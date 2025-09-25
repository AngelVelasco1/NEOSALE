import { Request, Response, NextFunction } from "express";
import {
  processCardPayment,
  processWebhook,
  getPaymentDetails,
  createPaymentPreference,
  getPreferenceDetails,
} from "../services/payments";

export const addPaymentController = async (req: Request, res: Response) => {
  try {
    const {
      amount,
      email,
      installments,
      token,
      user_id,
      identificationType,
      identificationNumber,
    } = req.body;

    if (!amount || !email || !token) {
      res.status(400).json({
        success: false,
        message: "Faltan datos requeridos para el pago (amount, email, token)",
      });
      return;
    }
    if (!user_id) {
      res.status(400).json({
        success: false,
        message: "ID de usuario requerido",
      });
      return;
    }

    if (amount <= 0) {
      res.status(400).json({
        success: false,
        message: "El monto debe ser mayor a cero",
      });
      return;
    }

    if (!email.includes("@")) {
      res.status(400).json({
        success: false,
        message: "Email inválido",
      });
      return;
    }

    if (
      identificationType &&
      identificationType !== "none" &&
      !identificationNumber
    ) {
      res.status(400).json({
        success: false,
        message:
          "Si especifica tipo de identificación, debe proporcionar el número",
      });
      return;
    }

    if (identificationNumber && identificationNumber.length < 6) {
      res.status(400).json({
        success: false,
        message: "El número de identificación debe tener al menos 6 dígitos",
      });
      return;
    }

    const payment = await processCardPayment({
      user_id: Number(user_id),
      amount: Number(amount),
      email: email.toLowerCase().trim(),
      installments: installments || 1,
      token,
      identificationType:
        identificationType && identificationType !== "none"
          ? identificationType
          : undefined,
      identificationNumber:
        identificationNumber && identificationType !== "none"
          ? identificationNumber
          : undefined,
    });

    res.status(200).json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        status_detail: payment.status_detail,
        transaction_amount: payment.transaction_amount,
        payment_method_id: payment.payment_method_id,
        external_reference: payment.external_reference,
        date_created: payment.date_created,
      },
    });
  } catch (error: any) {
    console.error("Error procesando pago:", error);

    res.status(500).json({
      success: false,
      message:
        error.message || "Error interno del servidor al procesar el pago",
    });
    return;
  }
};

export const handleWebhookController = async (req: Request, res: Response) => {
  try {
    await processWebhook(req.body);
    res.status(200).json({
      success: true,
      message: "Webhook procesado correctamente",
    });
  } catch (error: unknown) {
    console.error("❌ Error procesando webhook:", error);
    res.status(500).json({
      success: false,
      message: "Error procesando webhook",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getPaymentStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "ID de pago requerido",
      });
      return;
    }

    const paymentDetails = await getPaymentDetails(id);

    res.json({
      success: true,
      message: `Estado del pago ${id} consultado exitosamente`,
      payment: {
        id: paymentDetails.id,
        status: paymentDetails.status,
        status_detail: paymentDetails.status_detail,
        transaction_amount: paymentDetails.transaction_amount,
        payment_method_id: paymentDetails.payment_method_id,
        date_created: paymentDetails.date_created,
        external_reference: paymentDetails.external_reference,
      },
    });
  } catch (error: unknown) {
    console.error(`❌ Error consultando pago ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: "Error consultando estado del pago",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const handleSuccessController = (req: Request, res: Response) => {
  const {
    collection_id,
    collection_status,
    payment_id,
    status,
    external_reference,
  } = req.query;
  res.json({
    success: true,
    message: "Pago exitoso",
    data: {
      collection_id,
      collection_status,
      payment_id,
      status,
      external_reference,
    },
  });
};

export const handleFailureController = (req: Request, res: Response) => {
  const {
    collection_id,
    collection_status,
    payment_id,
    status,
    external_reference,
  } = req.query;
  res.json({
    success: false,
    message: "Pago rechazado",
    data: {
      collection_id,
      collection_status,
      payment_id,
      status,
      external_reference,
    },
  });
};

export const handlePendingController = (req: Request, res: Response) => {
  const {
    collection_id,
    collection_status,
    payment_id,
    status,
    external_reference,
  } = req.query;
  res.json({
    success: true,
    message: "Pago pendiente",
    data: {
      collection_id,
      collection_status,
      payment_id,
      status,
      external_reference,
    },
  });
};

export const createPreferenceController = async (
  req: Request,
  res: Response
) => {
  try {
    const { title, quantity, unit_price, currency_id = "COP" } = req.body;

    if (!title || !unit_price) {
      res.status(400).json({
        success: false,
        message: "Título y precio unitario son requeridos",
      });
      return;
    }

    if (unit_price <= 0) {
      res.status(400).json({
        success: false,
        message: "El precio debe ser mayor a cero",
      });
      return;
    }

    console.log("📝 Creando preferencia de pago:", {
      title,
      quantity: quantity || 1,
      unit_price,
      currency_id,
    });

    const preference = await createPaymentPreference({
      title,
      quantity: quantity || 1,
      unit_price: Number(unit_price),
      currency_id,
    });

    res.json({
      success: true,
      message: "Preferencia de pago creada exitosamente",
      data: {
        id: preference.id,
        init_point: preference.init_point,
        sandbox_init_point: preference.sandbox_init_point,
        external_reference: preference.external_reference,
        items: preference.items,
      },
    });
  } catch (error: unknown) {
    console.error("❌ Error creando preferencia:", error);
    res.status(500).json({
      success: false,
      message: "Error creando preferencia de pago",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getPreferenceController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "ID de preferencia es requerido",
      });
      return;
    }

    console.log(`🔍 Consultando preferencia: ${id}`);

    const preference = await getPreferenceDetails(id);

    res.status(200).json({
      success: true,
      message: "Preferencia encontrada",
      data: preference,
    });
  } catch (error: unknown) {
    console.error("❌ Error en getPreferenceController:", error);
    next(error);
  }
};
