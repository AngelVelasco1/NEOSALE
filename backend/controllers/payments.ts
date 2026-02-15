import { Request, Response } from "express";
import {
  getWompiAcceptanceTokensService,
  getWompiPublicConfigService,
  generateWompiIntegritySignature,
  createPaymentService,
  getWompiTransactionStatusService,
  updatePaymentStatusService,
  getPaymentByTransactionIdService,
  updatePaymentFromWebhook,
  verifyWebhookSignature,
  WompiTransactionData,
  convertPesosToWompiCentavos,
  getFinancialInstitutions,
  createPSETransaction,
  PSETransactionData,
  createNequiTransaction,
  NequiTransactionData,
} from "../services/payments";
import {
  createOrderService,
  processWompiOrderWebhook,
} from "../services/orders";
import { prisma } from "../lib/prisma";

export const getAcceptanceTokensController = async (
  req: Request,
  res: Response
) => {
  try {
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

export const createPaymentController = async (req: Request, res: Response) => {
  try {
    const transactionData: WompiTransactionData = req.body;

    const user_id = Number(req.query.user_id);
    if (!user_id || isNaN(user_id)) {
      res.status(400).json({
        success: false,
        message: "user_id es requerido en query params para crear pagos.",
      });
      return;
    }

    let amountInCentavos = transactionData.amount;

    if (transactionData.amount && transactionData.amount < 1000000) {
      amountInCentavos = convertPesosToWompiCentavos(transactionData.amount);
    }

    const transactionDataWithCentavos: WompiTransactionData = {
      ...transactionData,
      amount: amountInCentavos, // Usar el monto en centavos
    };

    if (
      !transactionDataWithCentavos.reference ||
      !transactionDataWithCentavos.amount ||
      !transactionDataWithCentavos.customerEmail
    ) {
      res.status(400).json({
        success: false,
        message: "Reference, amount y customerEmail son requeridos",
      });
      return;
    }

    if (
      !transactionDataWithCentavos.acceptanceToken ||
      !transactionDataWithCentavos.acceptPersonalAuth
    ) {
      res.status(400).json({
        success: false,
        message: "Tokens de aceptación requeridos",
      });
      return;
    }

    const result = await createPaymentService(
      transactionDataWithCentavos,
      user_id
    );

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
    console.error("Error en createWompiTransactionController:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

export const getTransactionStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const { transactionId } = req.params;

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

export const validateWompiDataController = async (
  req: Request,
  res: Response
) => {
  try {
    const transactionData = req.body; // Usar any para recibir la estructura nueva

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

export const updatePaymentStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    // Manejar tanto PUT /:transactionId como POST con transactionId en body
    const transactionId = req.params.transactionId || req.body.transactionId;
    const {
      status,
      statusMessage,
      processorResponseCode,
      processorResponse,
      wompiResponse,
    } = req.body;

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
      statusMessage || wompiResponse?.status_message,
      processorResponseCode,
      wompiResponse || processorResponse
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

export const getPaymentFromDatabaseController = async (
  req: Request,
  res: Response
) => {
  try {
    const { transactionId } = req.params;

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

export const handleWompiWebhookController = async (
  req: Request,
  res: Response
) => {
  try {
    const { data, timestamp, signature } = req.body;

    // Validar que los datos requeridos estén presentes
    if (!data || !timestamp || !signature) {
      res.status(400).json({
        success: false,
        message: "Webhook incompleto: faltan data, timestamp o signature",
      });
      return;
    }

    const { transaction } = data;

    if (!transaction || !transaction.id) {
      res.status(400).json({
        success: false,
        message: "Datos de transacción incompletos en webhook",
      });
      return;
    }

    // Verificar la firma del webhook
    const isValidSignature = verifyWebhookSignature(signature, req.body);

    if (!isValidSignature) {
      console.error("❌ Firma de webhook inválida");
      res.status(401).json({
        success: false,
        message: "Firma de webhook inválida",
      });
      return;
    }

    try {
      await updatePaymentFromWebhook({
        transactionId: transaction.id,
        newStatus: transaction.status,
        statusMessage: transaction.status_message,
        processorResponseCode: transaction.processor_response_code,
        processorResponse: transaction,
        signature,
        paymentMethodDetails: transaction.payment_method,
      });
    } catch (updateError) {
      console.error("Error actualizando payment desde webhook:", updateError);
      res.status(500).json({
        success: false,
        message: "Error actualizando payment",
        error:
          updateError instanceof Error
            ? updateError.message
            : "Error desconocido",
      });
      return;
    }

    // Procesar orden si el pago fue aprobado
    const orderResult = await processWompiOrderWebhook(
      transaction.id,
      transaction.status
    );

    res.status(200).json({
      success: true,
      message: "Webhook procesado exitosamente",
      data: {
        transactionId: transaction.id,
        paymentStatus: transaction.status,
        orderResult,
      },
    });
  } catch (error) {
    console.error("❌ Error en handleWompiWebhookController:", error);
    res.status(500).json({
      success: false,
      message: "Error procesando webhook",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

export const createOrderFromPaymentController = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      payment_id,
      address_id,
      couponId,
      paymentId = payment_id,
      shippingAddressId = address_id,
    } = req.body;

    // Usar payment_id y address_id como valores principales
    const finalPaymentTransactionId = paymentId || payment_id;
    const finalShippingAddressId = shippingAddressId || address_id;

    // Validar datos requeridos
    if (!finalPaymentTransactionId || !finalShippingAddressId) {
      res.status(400).json({
        success: false,
        message: "payment_id y address_id son requeridos",
      });
      return;
    }

    const paymentRecord = await prisma.payments.findUnique({
      where: {
        transaction_id: finalPaymentTransactionId as string,
      },
      select: {
        id: true,
        payment_status: true,
        transaction_id: true,
      },
    });


    if (!paymentRecord) {
      // Buscar todos los payments para debug
      const allPayments = await prisma.payments.findMany({
        select: {
          id: true,
          transaction_id: true,
          payment_status: true,
          created_at: true,
        },
        orderBy: {
          created_at: "desc",
        },
        take: 10,
      });


      res.status(404).json({
        success: false,
        message: `Payment no encontrado para transaction_id: ${finalPaymentTransactionId}`,
        debug: {
          searchedTransactionId: finalPaymentTransactionId,
          totalPaymentsInDb: allPayments.length,
          recentPayments: allPayments.map((p) => ({
            id: p.id,
            transaction_id: p.transaction_id,
            status: p.payment_status,
            created_at: p.created_at,
          })),
        },
      });
      return;
    }

    // Convertir address_id a número y validar
    const shippingAddressIdNum = Number(finalShippingAddressId);
    const couponIdNum = couponId ? Number(couponId) : undefined;

    if (isNaN(shippingAddressIdNum)) {
      res.status(400).json({
        success: false,
        message: "address_id debe ser un número válido",
      });
      return;
    }

    if (couponId && isNaN(couponIdNum!)) {
      res.status(400).json({
        success: false,
        message: "couponId debe ser un número válido",
      });
      return;
    }

    const result = await createOrderService({
      paymentId: paymentRecord.id, // Usar el ID numérico real
      shippingAddressId: shippingAddressIdNum,
      couponId: couponIdNum,
    });

    res.status(201).json({
      success: true,
      message: "Orden creada exitosamente desde payment",
      data: result,
    });
  } catch (error) {
    console.error("❌ Error en createOrderFromPaymentController:", error);
    res.status(500).json({
      success: false,
      message: "Error creando orden desde payment",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

// PSE
export const getFinancialInstitutionsController = async (
  req: Request,
  res: Response
) => {
  try {
    const institutions = await getFinancialInstitutions();

    res.status(200).json({
      success: true,
      message: "Instituciones financieras obtenidas exitosamente",
      data: institutions,
    });
  } catch (error) {
    console.error("❌ Error en getFinancialInstitutionsController:", error);
    res.status(500).json({
      success: false,
      message: "Error obteniendo instituciones financieras",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

const getClientIP = (req: Request): string => {
  const forwarded = req.headers["x-forwarded-for"] as string;
  const realIP = req.headers["x-real-ip"] as string;
  const clientIP = req.connection?.remoteAddress || req.socket?.remoteAddress;

  // Prioridad: x-forwarded-for > x-real-ip > connection IP
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (clientIP) {
    return clientIP.replace("::ffff:", ""); // IPv4 mapped IPv6
  }

  return "127.0.0.1"; // Fallback para desarrollo local
};

export const createPSEPaymentController = async (
  req: Request,
  res: Response
) => {
  try {
    const { user_id } = req.query;
    const requestBody = req.body;

    const {
      amount,
      currency = "COP",
      customerEmail,
      customer_data,
      user_type,
      user_legal_id_type,
      user_legal_id,
      financial_institution_code,
      payment_description,
      shipping_address,
      cartData,
    } = requestBody;

    // Validaciones básicas
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id es requerido",
      });
    }

    if (!amount || !customerEmail || !customer_data) {
      return res.status(400).json({
        success: false,
        message:
          "Datos incompletos: amount, customerEmail, customer_data son requeridos",
        received: {
          hasAmount: !!amount,
          hasCustomerEmail: !!customerEmail,
          hasCustomerData: !!customer_data,
        },
      });
    }

    // Validar datos específicos de PSE
    if (!customer_data.full_name || !customer_data.phone_number) {
      return res.status(400).json({
        success: false,
        message:
          "customer_data.full_name y customer_data.phone_number son requeridos para PSE",
        received: {
          hasFullName: !!customer_data.full_name,
          hasPhoneNumber: !!customer_data.phone_number,
          customerData: customer_data,
        },
      });
    }

    // ✅ VALIDAR CAMPOS PSE (campos directos en el body)
    if (!user_type && user_type !== 0) {
      // 0 es válido (Natural)
      return res.status(400).json({
        success: false,
        message: "user_type es requerido (0 = Natural, 1 = Jurídica)",
        received: { user_type },
      });
    }

    if (!user_legal_id_type) {
      return res.status(400).json({
        success: false,
        message: "user_legal_id_type es requerido (CC, CE, NIT, PP)",
        received: { user_legal_id_type },
      });
    }

    if (!user_legal_id) {
      return res.status(400).json({
        success: false,
        message: "user_legal_id es requerido",
        received: { user_legal_id },
      });
    }

    if (!financial_institution_code) {
      return res.status(400).json({
        success: false,
        message: "financial_institution_code es requerido",
        received: { financial_institution_code },
      });
    }

    const amountInCents = amount;
    const reference = `PSE-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const clientIP = getClientIP(req);

    // 📦 PREPARAR DATOS PARA PSE TRANSACTION
    const pseTransactionData: PSETransactionData = {
      amount: amountInCents,
      currency,
      customerEmail,
      reference,
      pseDetails: {
        user_type,
        user_legal_id_type,
        user_legal_id,
        financial_institution_code,
        payment_description: payment_description || "Pago en NEOSALE",
      },
      customerData: {
        phone_number: customer_data.phone_number,
        full_name: customer_data.full_name,
      },
      ...(shipping_address && { shippingAddress: shipping_address }),
      ...(cartData && { cartData }),
      userId: parseInt(user_id as string),
      clientIP,
    };

    const result = await createPSETransaction(pseTransactionData);

    if (result.success) {
      res.status(200).json({
        success: true,
        data: {
          transactionId: result.data.transactionId,
          status: result.data.status,
          reference: result.data.reference,
          // 🔗 RETORNAR async_payment_url PARA REDIRECCIÓN AL BANCO
          payment_link:
            result.data.async_payment_url || result.data.payment_link_id,
          async_payment_url: result.data.async_payment_url,
          redirect_url: result.data.redirect_url,
          message: "Transacción PSE creada exitosamente",
        },
      });
    } else {
      throw new Error(result.error || "Error creando transacción PSE");
    }
  } catch (error) {
    console.error("❌ Error en createPSEPaymentController:", error);
    res.status(500).json({
      success: false,
      message: "Error creando transacción PSE",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

// Nequi
export const createNequiPaymentController = async (
  req: Request,
  res: Response
) => {
  try {
    const { user_id } = req.query;
    const {
      amount,
      currency = "COP",
      customerEmail,
      phone_number,
      customer_data,
      shipping_address,
      cartData,
    } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id es requerido",
      });
    }

    if (!amount || !customerEmail || !customer_data || !phone_number) {
      return res.status(400).json({
        success: false,
        message:
          "Datos incompletos: amount, customerEmail, customer_data y phone_number son requeridos",
        received: {
          hasAmount: !!amount,
          hasCustomerEmail: !!customerEmail,
          hasCustomerData: !!customer_data,
          hasPhoneNumber: !!phone_number,
        },
      });
    }

    if (!customer_data.full_name || !customer_data.phone_number) {
      return res.status(400).json({
        success: false,
        message:
          "customer_data.full_name y customer_data.phone_number son requeridos para Nequi",
        received: {
          hasFullName: !!customer_data.full_name,
          hasPhoneNumber: !!customer_data.phone_number,
          customerData: customer_data,
        },
      });
    }

    const amountInCents = amount;
    const reference = `NEQUI-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const nequiTransactionData: NequiTransactionData = {
      amount: amountInCents,
      currency,
      customerEmail,
      reference,
      phone_number: phone_number.replace(/\s+/g, ""),
      customerData: {
        phone_number: customer_data.phone_number.replace(/\s+/g, ""),
        full_name: customer_data.full_name,
      },
      ...(shipping_address && { shippingAddress: shipping_address }),
      ...(cartData && { cartData }),
      userId: parseInt(user_id as string),
    };

    const result = await createNequiTransaction(nequiTransactionData);

    if (result.success) {
      res.status(200).json({
        success: true,
        data: {
          transactionId: result.data.transactionId,
          status: result.data.status,
          reference: result.data.reference,
          payment_method: result.data.paymentMethod,
          redirect_url: result.data.redirect_url,
          message: "Transacción Nequi creada exitosamente",
        },
      });
    } else {
      throw new Error(result.error || "Error creando transacción Nequi");
    }
  } catch (error) {
    console.error("❌ Error en createNequiPaymentController:", error);
    res.status(500).json({
      success: false,
      message: "Error creando transacción Nequi",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};
