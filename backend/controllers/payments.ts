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

    console.log("Datos originales del carrito (antes de conversión):", {
      reference: transactionData.reference,
      amountRecibido: transactionData.amount,
      currency: transactionData.currency,
      customerEmail: transactionData.customerEmail,
      userId: user_id,
      // 🔍 DEBUG: Información detallada del carrito
      hasCartData: !!transactionData.cartData,
      cartDataType: typeof transactionData.cartData,
      cartDataIsArray: Array.isArray(transactionData.cartData),
      cartDataKeys: transactionData.cartData
        ? Object.keys(transactionData.cartData)
        : [],
      cartDataContent: transactionData.cartData,
      cartDataStringified: JSON.stringify(transactionData.cartData),
      bodyKeys: Object.keys(transactionData),
      bodySize: JSON.stringify(transactionData).length,
    });

    // 💰 NUEVA LÓGICA: Si el amount viene en pesos, convertirlo a centavos
    let amountInCentavos = transactionData.amount;

    // Verificar si el amount parece estar en pesos (valor típicamente < 1,000,000 para órdenes normales)
    // Si es menor a 1,000,000 asumir que está en pesos y convertir
    if (transactionData.amount && transactionData.amount < 1000000) {
      console.log("💰 Detectado monto en PESOS, convirtiendo a centavos...");
      amountInCentavos = convertPesosToWompiCentavos(transactionData.amount);

      console.log("✅ Conversión completada:", {
        montoOriginalPesos: transactionData.amount,
        montoConvertidoCentavos: amountInCentavos,
        factorConversion: "x100",
      });
    } else {
      console.log(
        "💰 Monto ya está en centavos (>= 1,000,000), no se convierte"
      );
    }

    // Actualizar el amount en transactionData
    const transactionDataWithCentavos: WompiTransactionData = {
      ...transactionData,
      amount: amountInCentavos, // Usar el monto en centavos
    };

    console.log("Solicitud de creación de transacción procesada:", {
      reference: transactionDataWithCentavos.reference,
      amountOriginal: transactionData.amount,
      amountFinalCentavos: amountInCentavos,
      currency: transactionDataWithCentavos.currency,
      customerEmail: transactionDataWithCentavos.customerEmail,
      customerName: transactionDataWithCentavos.customerName,
      customerPhone: transactionDataWithCentavos.customerPhone,
      customerDocumentType: transactionDataWithCentavos.customerDocumentType,
      customerDocumentNumber:
        transactionDataWithCentavos.customerDocumentNumber,
      hasAcceptanceToken: !!transactionDataWithCentavos.acceptanceToken,
      hasPersonalAuthToken: !!transactionDataWithCentavos.acceptPersonalAuth,
      shippingAddress: transactionDataWithCentavos.shippingAddress,
      acceptanceTokenLength:
        transactionDataWithCentavos.acceptanceToken?.length || 0,
      personalAuthLength:
        transactionDataWithCentavos.acceptPersonalAuth?.length || 0,
      userId: user_id,
    });

    // Validar datos requeridos básicos
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

    // Pasar el userId desde query params a la función de servicio con amount corregido
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
    // Manejar tanto PUT /:transactionId como POST con transactionId en body
    const transactionId = req.params.transactionId || req.body.transactionId;
    const {
      status,
      statusMessage,
      processorResponseCode,
      processorResponse,
      wompiResponse,
    } = req.body;

    console.log("🔄 Solicitud de actualización de payment:", {
      transactionId,
      status,
      statusMessage,
      method: req.method,
      hasWompiResponse: !!wompiResponse,
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

// 🔗 NUEVO: Webhook de Wompi para procesar eventos de pago
export const handleWompiWebhookController = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("🎯 Webhook de Wompi recibido:", {
      headers: req.headers,
      body: req.body,
      timestamp: new Date().toISOString(),
    });

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

    console.log("✅ Firma de webhook verificada correctamente");

    // Actualizar el payment en la base de datos
    try {
      const updateResult = await updatePaymentFromWebhook({
        transactionId: transaction.id,
        newStatus: transaction.status,
        statusMessage: transaction.status_message,
        processorResponseCode: transaction.processor_response_code,
        processorResponse: transaction,
        signature,
        paymentMethodDetails: transaction.payment_method,
      });

      console.log("✅ Payment actualizado desde webhook:", updateResult);
    } catch (updateError) {
      console.error(
        "❌ Error actualizando payment desde webhook:",
        updateError
      );
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

    console.log("✅ Webhook procesado exitosamente:", {
      transactionId: transaction.id,
      status: transaction.status,
      orderCreated: orderResult.orderId || "N/A",
      orderSuccess: orderResult.success,
    });

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

// 🆕 NUEVO: Crear orden desde payment aprobado
export const createOrderFromPaymentController = async (
  req: Request,
  res: Response
) => {
  try {
    // Extraer con los nombres que envía el frontend
    const {
      payment_id,
      address_id,
      couponId,
      // También permitir los nombres en camelCase por compatibilidad
      paymentId = payment_id,
      shippingAddressId = address_id,
    } = req.body;

    console.log("🛒 Solicitud de creación de orden desde payment:", {
      payment_id,
      address_id,
      paymentId,
      shippingAddressId,
      couponId,
      bodyReceived: req.body,
    });

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

    // Buscar el payment por transaction_id para obtener el ID numérico
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
      res.status(404).json({
        success: false,
        message: `Payment no encontrado para transaction_id: ${finalPaymentTransactionId}`,
      });
      return;
    }

    console.log("✅ Payment encontrado:", {
      paymentId: paymentRecord.id,
      transactionId: paymentRecord.transaction_id,
      status: paymentRecord.payment_status,
    });

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

    console.log("🔄 Llamando a createOrderService con:", {
      paymentId: paymentRecord.id, // Usar el ID numérico de la BD
      shippingAddressId: shippingAddressIdNum,
      couponId: couponIdNum,
    });

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
