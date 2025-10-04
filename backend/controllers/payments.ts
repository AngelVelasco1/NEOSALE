import { Request, Response } from "express";
import {
  getWompiAcceptanceTokensService,
  getWompiPublicConfigService,
  generateWompiIntegritySignature,
  createWompiTransactionService,
  getWompiTransactionStatusService,
  updatePaymentStatusService,
  getPaymentByTransactionIdService,
  WompiTransactionData,
} from "../services/payments";

// 🎯 PASO 1: Obtener tokens de aceptación prefirmados
export const getAcceptanceTokensController = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("Solicitud de tokens de aceptación recibida");

    const result = await getWompiAcceptanceTokensService();

    if (!result.success) {
      res.status(500).json({
        success: false,
        message: "Error obteniendo tokens de aceptación de Wompi",
        error: result.error,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Tokens de aceptación obtenidos exitosamente",
      data: result.data,
    });
  } catch (error) {
    console.error("Error en getAcceptanceTokensController:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

export const getPaymentConfigController = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("Solicitud de configuración de pagos recibida");

    const result = await getWompiPublicConfigService();

    if (!result.success) {
      res.status(500).json({
        success: false,
        message: "Error obteniendo configuración de pagos",
        error: result.error,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Configuración de pagos obtenida exitosamente",
      data: result.data,
    });
  } catch (error) {
    console.error("Error en getPaymentConfigController:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

// 🎯 Endpoint de prueba para verificar configuración
export const testWompiConnectionController = async (
  req: Request,
  res: Response
) => {
  try {
    const tokensResult = await getWompiAcceptanceTokensService();

    res.status(200).json({
      success: true,
      message: "Prueba de conexión con Wompi",
      data: {
        connectionStatus: tokensResult.success ? "SUCCESS" : "FAILED",
        error: tokensResult.error || null,
        hasTokens: tokensResult.success && !!tokensResult.data,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error en testWompiConnectionController:", error);
    res.status(500).json({
      success: false,
      message: "Error probando conexión con Wompi",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

// 🎯 PASO 4: Generar firma de integridad
export const generateIntegritySignatureController = async (
  req: Request,
  res: Response
) => {
  try {
    const { reference, amount, currency = "COP" } = req.body;

    // Validar datos requeridos
    if (!reference || !amount) {
      res.status(400).json({
        success: false,
        message: "Reference y amount son requeridos",
      });
      return;
    }

    if (typeof amount !== "number" || amount <= 0) {
      res.status(400).json({
        success: false,
        message: "Amount debe ser un número mayor a 0",
      });
      return;
    }

    console.log("Generando firma de integridad:", {
      reference,
      amount,
      currency,
    });

    const signature = generateWompiIntegritySignature(
      reference,
      amount,
      currency
    );

    res.status(200).json({
      success: true,
      message: "Firma de integridad generada exitosamente",
      data: {
        signature,
        reference,
        amount,
        currency,
      },
    });
  } catch (error) {
    console.error("Error en generateIntegritySignatureController:", error);
    res.status(500).json({
      success: false,
      message: "Error generando firma de integridad",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

// 🎯 PASO 5: Crear transacción en Wompi
export const createWompiTransactionController = async (
  req: Request,
  res: Response
) => {
  try {
    const transactionData: WompiTransactionData = req.body;

    console.log("📥 Solicitud de creación de transacción recibida:", {
      reference: transactionData.reference,
      amount: transactionData.amount,
      currency: transactionData.currency,
      customerEmail: transactionData.customerEmail,
      customerName: transactionData.customerName,
      customerPhone: transactionData.customerPhone,
      customerDocumentType: transactionData.customerDocumentType,
      customerDocumentNumber: transactionData.customerDocumentNumber,
      hasAcceptanceToken: !!transactionData.acceptanceToken,
      hasPersonalAuthToken: !!transactionData.acceptPersonalAuth,
      shippingAddress: transactionData.shippingAddress,
      acceptanceTokenLength: transactionData.acceptanceToken?.length || 0,
      personalAuthLength: transactionData.acceptPersonalAuth?.length || 0,
    });

    // Validar datos requeridos básicos
    if (
      !transactionData.reference ||
      !transactionData.amount ||
      !transactionData.customerEmail
    ) {
      res.status(400).json({
        success: false,
        message: "Reference, amount y customerEmail son requeridos",
      });
      return;
    }

    if (
      !transactionData.acceptanceToken ||
      !transactionData.acceptPersonalAuth
    ) {
      res.status(400).json({
        success: false,
        message: "Tokens de aceptación requeridos",
      });
      return;
    }

    const result = await createWompiTransactionService(transactionData);

    if (!result.success) {
      res.status(500).json({
        success: false,
        message: "Error creando transacción en Wompi",
        error: result.error,
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: "Transacción creada exitosamente",
      data: result.data,
    });
  } catch (error) {
    console.error("❌ Error en createWompiTransactionController:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

// 🎯 PASO 6: Consultar estado de transacción por ID
export const getTransactionStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const { transactionId } = req.params;

    console.log("🔍 Solicitud de estado de transacción:", { transactionId });

    // Validar ID de transacción
    if (!transactionId || transactionId.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: "ID de transacción requerido",
      });
      return;
    }

    const result = await getWompiTransactionStatusService(transactionId);

    if (!result.success) {
      // Determinar el código de estado apropiado
      const statusCode = result.error?.includes("no encontrada") ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message: "Error consultando estado de transacción",
        error: result.error,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Estado de transacción obtenido exitosamente",
      data: result.data,
    });
  } catch (error) {
    console.error("❌ Error en getTransactionStatusController:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

// 🔍 ENDPOINT DE DEBUGGING: Validar datos antes de enviar a Wompi
export const validateWompiDataController = async (
  req: Request,
  res: Response
) => {
  try {
    const transactionData = req.body; // Usar any para recibir la estructura nueva

    console.log("🔍 Validando datos para Wompi:", transactionData);

    // Realizar todas las validaciones con la nueva estructura
    const issues: string[] = [];
    const recommendations: string[] = [];

    // ✅ Validación de referencia
    if (!transactionData.reference || transactionData.reference.length < 8) {
      issues.push("Referencia debe tener al menos 8 caracteres");
      recommendations.push(
        "Generar referencia única con formato: wompi_TIMESTAMP_USERID"
      );
    }

    // ✅ Validación de monto
    if (
      !transactionData.amount_in_cents ||
      transactionData.amount_in_cents < 100
    ) {
      issues.push("Monto debe ser mayor a 100 centavos (1 peso)");
      recommendations.push(
        "Verificar conversión de pesos a centavos (monto * 100)"
      );
    }

    // ✅ Validación de moneda
    if (!transactionData.currency || transactionData.currency !== "COP") {
      issues.push("Moneda debe ser 'COP'");
      recommendations.push("Establecer currency: 'COP' para Colombia");
    }

    // ✅ Validación de email del cliente
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !transactionData.customer_email ||
      !emailRegex.test(transactionData.customer_email)
    ) {
      issues.push("Email del cliente inválido o faltante");
      recommendations.push("Verificar formato de email: ejemplo@dominio.com");
    }

    // ✅ Validación de información del cliente
    if (!transactionData.customer_data) {
      issues.push("Datos del cliente (customer_data) faltantes");
      recommendations.push("Incluir customer_data con phone_number, full_name");
    } else {
      if (
        !transactionData.customer_data.phone_number ||
        transactionData.customer_data.phone_number.length < 10
      ) {
        issues.push("Teléfono del cliente debe tener al menos 10 dígitos");
        recommendations.push("Formato: +573001234567 o 3001234567");
      }

      if (
        !transactionData.customer_data.full_name ||
        transactionData.customer_data.full_name.length < 2
      ) {
        issues.push("Nombre completo del cliente requerido");
        recommendations.push("Incluir nombre y apellido completos");
      }

      // Validación de documento de identidad
      if (transactionData.customer_data.legal_id) {
        const validDocTypes = ["CC", "CE", "NIT", "TI", "PP"];
        if (
          !transactionData.customer_data.legal_id_type ||
          !validDocTypes.includes(transactionData.customer_data.legal_id_type)
        ) {
          issues.push(
            `Tipo de documento inválido. Debe ser uno de: ${validDocTypes.join(
              ", "
            )}`
          );
          recommendations.push(
            "Usar CC para cédula de ciudadanía, CE para cédula de extranjería, etc."
          );
        }
      }
    }

    // ✅ Validación de dirección de envío
    if (!transactionData.shipping_address) {
      issues.push("Dirección de envío (shipping_address) faltante");
      recommendations.push(
        "Incluir shipping_address con address_line_1, city, country"
      );
    } else {
      if (
        !transactionData.shipping_address.address_line_1 ||
        transactionData.shipping_address.address_line_1.length < 5
      ) {
        issues.push("Dirección de envío debe tener al menos 5 caracteres");
        recommendations.push("Incluir dirección completa con calle y número");
      }

      if (
        !transactionData.shipping_address.city ||
        transactionData.shipping_address.city.length < 2
      ) {
        issues.push("Ciudad de envío requerida");
        recommendations.push("Especificar ciudad de destino");
      }

      if (
        !transactionData.shipping_address.country ||
        transactionData.shipping_address.country !== "CO"
      ) {
        issues.push("País debe ser 'CO' para Colombia");
        recommendations.push("Establecer country: 'CO'");
      }
    }

    // ✅ Validación de tokens de aceptación
    if (
      !transactionData.acceptance_token ||
      (!/^pub_test_/.test(transactionData.acceptance_token) &&
        !/^pub_prod_/.test(transactionData.acceptance_token))
    ) {
      issues.push("Token de aceptación inválido");
      recommendations.push(
        "Usar token que inicie con 'pub_test_' o 'pub_prod_'"
      );
    }

    if (
      !transactionData.payment_link_acceptance_token ||
      (!/^pub_test_/.test(transactionData.payment_link_acceptance_token) &&
        !/^pub_prod_/.test(transactionData.payment_link_acceptance_token))
    ) {
      issues.push("Token de aceptación de link de pago inválido");
      recommendations.push(
        "Usar token que inicie con 'pub_test_' o 'pub_prod_'"
      );
    }

    // ✅ Intentar generar firma para verificar integridad
    let signatureGenerated = false;
    try {
      const signature = generateWompiIntegritySignature(
        transactionData.reference,
        transactionData.amount_in_cents,
        transactionData.currency
      );
      signatureGenerated = !!signature;

      if (!signature) {
        issues.push("No se pudo generar la firma de integridad");
        recommendations.push("Verificar variables de entorno WP_INTEGRITY");
      }
    } catch (error) {
      issues.push(
        `Error generando firma: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
      recommendations.push(
        "Verificar configuración de llaves de Wompi en variables de entorno"
      );
    }

    const isValid = issues.length === 0;

    const dataReceived = {
      reference: transactionData.reference,
      amount: transactionData.amount_in_cents,
      currency: transactionData.currency,
      customerEmail: transactionData.customer_email,
      hasAllRequiredFields: !!(
        transactionData.reference &&
        transactionData.amount_in_cents &&
        transactionData.currency &&
        transactionData.customer_email &&
        transactionData.customer_data &&
        transactionData.shipping_address
      ),
      signatureGenerated,
    };

    console.log("✅ Resultado validación:", {
      isValid,
      issuesCount: issues.length,
      dataReceived,
    });

    res.status(200).json({
      success: true,
      message: "Validación completada",
      data: {
        isValid,
        issues,
        dataReceived,
        recommendations: isValid
          ? ["Datos válidos para Wompi"]
          : recommendations,
      },
    });
  } catch (error) {
    console.error("❌ Error en validateWompiDataController:", error);
    res.status(500).json({
      success: false,
      message: "Error validando datos",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

// 🔄 PASO 7: Actualizar estado de payment manualmente
export const updatePaymentStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const { transactionId } = req.params;
    const { status, statusMessage, processorResponseCode, processorResponse } =
      req.body;

    console.log("🔄 Solicitud de actualización de payment:", {
      transactionId,
      status,
      statusMessage,
    });

    // Validar parámetros
    if (!transactionId || !status) {
      res.status(400).json({
        success: false,
        message: "transactionId y status son requeridos",
      });
      return;
    }

    const validStatuses = [
      "PENDING",
      "APPROVED",
      "DECLINED",
      "VOIDED",
      "ERROR",
    ];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: `Status inválido. Debe ser uno de: ${validStatuses.join(
          ", "
        )}`,
      });
      return;
    }

    const result = await updatePaymentStatusService(
      transactionId,
      status,
      statusMessage,
      processorResponseCode,
      processorResponse
    );

    if (!result.success) {
      res.status(500).json({
        success: false,
        message: "Error actualizando estado de payment",
        error: result.error,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Estado de payment actualizado exitosamente",
      data: result.data,
    });
  } catch (error) {
    console.error("❌ Error en updatePaymentStatusController:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

// 📊 PASO 8: Obtener payment desde base de datos
export const getPaymentFromDatabaseController = async (
  req: Request,
  res: Response
) => {
  try {
    const { transactionId } = req.params;

    console.log("📊 Solicitud de payment desde BD:", { transactionId });

    if (!transactionId) {
      res.status(400).json({
        success: false,
        message: "transactionId requerido",
      });
      return;
    }

    const result = await getPaymentByTransactionIdService(transactionId);

    if (!result.success) {
      res.status(500).json({
        success: false,
        message: "Error consultando payment desde base de datos",
        error: result.error,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Payment consultado exitosamente desde base de datos",
      data: result.data,
    });
  } catch (error) {
    console.error("❌ Error en getPaymentFromDatabaseController:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};
