import * as crypto from "crypto";
import { prisma } from "../lib/prisma";

// Interfaces
interface AcceptanceToken {
  acceptance_token: string;
  permalink: string;
  type: string;
}

interface WompiMerchantData {
  presigned_acceptance: AcceptanceToken;
  presigned_personal_data_auth: AcceptanceToken;
}

interface WompiConfig {
  publicKey: string;
  privateKey: string;
  eventsSecret: string;
  integritySecret: string;
  environment: "sandbox" | "production";
  baseUrl: string;
}

// Interface para datos que recibimos del frontend
interface WompiTransactionData {
  acceptanceToken: string;
  acceptPersonalAuth: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  customerDocumentType: string;
  customerDocumentNumber: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    name?: string;
  };
  amount: number;
  currency: string;
  reference: string;
  description?: string;
  redirectUrl?: string;
  // 💳 NUEVO: Métodos de pago
  payment_method?: {
    type: "CARD";
    installments: number;
    token: string;
  };
  payment_method_type?: "CARD" | "NEQUI" | "PSE";
}

// Interface específica para el payload que enviaremos a Wompi API
interface WompiApiPayload {
  amount_in_cents: number;
  currency: string;
  signature: string;
  customer_email: string;
  reference: string;
  public_key: string;
  redirect_url: string;
  customer_data: {
    phone_number: string;
    full_name: string;
    legal_id: string;
    legal_id_type: string;
  };
  shipping_address: {
    address_line_1: string;
    address_line_2?: string;
    city: string;
    region: string;
    country: string;
    postal_code: string;
    phone_number: string;
    name?: string;
  };
  acceptance_token: string;
  acceptance_token_auth: string;
  // 💳 NUEVO: Campos de método de pago
  payment_method?: {
    type: "CARD";
    installments: number;
    token: string;
  };
  payment_method_type?: "CARD" | "NEQUI" | "PSE";
}

// Configuración de Wompi
const getWompiConfig = (): WompiConfig => {
  const environment =
    process.env.NODE_ENV === "production" ? "production" : "sandbox";

  return {
    publicKey: process.env.WP_PUBLIC_KEY || "",
    privateKey: process.env.WP_PRIVATE_KEY || "",
    eventsSecret: process.env.WP_EVENTS || "",
    integritySecret: process.env.WP_INTEGRITY || "",
    environment,
    baseUrl:
      environment === "production"
        ? "https://production.wompi.co/v1"
        : "https://sandbox.wompi.co/v1",
  };
};

export const getWompiAcceptanceTokensService = async () => {
  try {
    const config = getWompiConfig();

    // Validar configuración
    if (!config.publicKey) {
      throw new Error("WP_PUBLIC_KEY no está configurado");
    }

    console.log("Obteniendo tokens de aceptación de Wompi...", {
      publicKey: config.publicKey.substring(0, 20) + "...",
      environment: config.environment,
      baseUrl: config.baseUrl,
    });

    const url = `${config.baseUrl}/merchants/${config.publicKey}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error obteniendo tokens de Wompi:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url,
      });

      throw new Error(
        `Error ${response.status}: ${response.statusText} - ${errorText}`
      );
    }

    const result = await response.json();

    // Validar estructura de respuesta
    if (
      !result.data ||
      !result.data.presigned_acceptance ||
      !result.data.presigned_personal_data_auth
    ) {
      console.error(" Respuesta de Wompi inválida:", result);
      throw new Error("Respuesta de Wompi no contiene los tokens esperados");
    }

    const merchantData: WompiMerchantData = {
      presigned_acceptance: result.data.presigned_acceptance,
      presigned_personal_data_auth: result.data.presigned_personal_data_auth,
    };

    console.log(" Tokens de aceptación obtenidos exitosamente:", {
      hasPresignedAcceptance:
        !!merchantData.presigned_acceptance.acceptance_token,
      hasPersonalDataAuth:
        !!merchantData.presigned_personal_data_auth.acceptance_token,
      acceptancePermalink: merchantData.presigned_acceptance.permalink,
      personalDataPermalink:
        merchantData.presigned_personal_data_auth.permalink,
    });

    return {
      success: true,
      data: merchantData,
    };
  } catch (error) {
    console.error("Error en getWompiAcceptanceTokensService:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error desconocido obteniendo tokens de Wompi",
    };
  }
};

// 🎯 PASO 2: Obtener configuración pública (incluye tokens y links)
export const getWompiPublicConfigService = async () => {
  try {
    const config = getWompiConfig();

    console.log("📡 Obteniendo configuración pública de Wompi...");

    // Obtener tokens de aceptación
    const tokensResult = await getWompiAcceptanceTokensService();

    if (!tokensResult.success) {
      throw new Error(
        tokensResult.error || "Error obteniendo tokens de aceptación"
      );
    }

    const publicConfig = {
      publicKey: config.publicKey,
      environment: config.environment,
      checkoutUrl: "https://checkout.wompi.co/p/",
      widgetUrl: "https://checkout.wompi.co/widget.js",
      acceptanceTokens: tokensResult.data,
      // 🎯 PASO 2: Links de contratos para mostrar al usuario
      contractLinks: {
        termsAndConditions: {
          url: tokensResult.data?.presigned_acceptance.permalink,
          type: tokensResult.data?.presigned_acceptance.type,
          title: "Términos y Condiciones de Uso",
        },
        personalDataAuth: {
          url: tokensResult.data?.presigned_personal_data_auth.permalink,
          type: tokensResult.data?.presigned_personal_data_auth.type,
          title: "Autorización de Administración de Datos Personales",
        },
      },
    };

    console.log("✅ Configuración pública de Wompi obtenida:", {
      publicKey: config.publicKey.substring(0, 20) + "...",
      environment: config.environment,
      hasTokens: !!tokensResult.data,
      contractLinksCount: Object.keys(publicConfig.contractLinks).length,
    });

    return {
      success: true,
      data: publicConfig,
    };
  } catch (error) {
    console.error("❌ Error en getWompiPublicConfigService:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error obteniendo configuración pública de Wompi",
    };
  }
};

// STEP 4: Función para generar la firma de integridad SHA256
export const generateWompiIntegritySignature = (
  reference: string,
  amount: number,
  currency: string
): string => {
  try {
    const config = getWompiConfig();
    const secret = config.integritySecret;

    if (!secret) {
      throw new Error(
        "WP_INTEGRITY no está configurado en las variables de entorno"
      );
    }

    // Concatenar: reference + amount + currency + secret
    const concatenatedString = `${reference}${amount}${currency}${secret}`;

    console.log("🔐 Generando firma de integridad:", {
      reference,
      amount,
      currency,
      concatenatedLength: concatenatedString.length,
      secretPresent: !!secret,
    });

    // Generar hash SHA256
    const signature = crypto
      .createHash("sha256")
      .update(concatenatedString, "utf8")
      .digest("hex");

    console.log(
      "✅ Firma de integridad generada:",
      signature.substring(0, 20) + "..."
    );

    return signature;
  } catch (error) {
    console.error("❌ Error generando firma de integridad:", error);
    throw new Error(
      `Error generando firma de integridad: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
};

// STEP 5: Función para crear transacción en Wompi
export const createWompiTransactionService = async (
  transactionData: WompiTransactionData
) => {
  try {
    const config = getWompiConfig();

    const {
      acceptanceToken,
      acceptPersonalAuth,
      customerEmail,
      customerName,
      customerPhone,
      customerDocumentType,
      customerDocumentNumber,
      shippingAddress,
      amount,
      currency = "COP",
      reference,
      redirectUrl = "http://localhost:3000/checkout/response",
    } = transactionData;

    // Validar configuración
    if (!config.publicKey || !config.privateKey) {
      throw new Error("Claves de Wompi no configuradas");
    }

    // Validar datos requeridos
    if (!acceptanceToken || !acceptPersonalAuth) {
      throw new Error("Tokens de aceptación requeridos");
    }

    // Validar formato de tokens (deben ser strings no vacíos)
    if (
      typeof acceptanceToken !== "string" ||
      acceptanceToken.trim().length === 0
    ) {
      throw new Error("Token de aceptación de términos inválido");
    }

    if (
      typeof acceptPersonalAuth !== "string" ||
      acceptPersonalAuth.trim().length === 0
    ) {
      throw new Error("Token de autorización de datos personales inválido");
    }

    if (!customerEmail || !customerName || !reference) {
      throw new Error("Datos del cliente y referencia son requeridos");
    }

    if (!amount || amount <= 0) {
      throw new Error("El monto debe ser mayor a 0");
    }

    // Validaciones adicionales específicas de Wompi
    if (!customerPhone || customerPhone.length < 10) {
      throw new Error("Teléfono del cliente requerido (mínimo 10 dígitos)");
    }

    if (!customerDocumentNumber || customerDocumentNumber.length < 6) {
      throw new Error("Número de documento requerido (mínimo 6 caracteres)");
    }

    if (
      !customerDocumentType ||
      !["CC", "CE", "NIT", "PP"].includes(customerDocumentType)
    ) {
      throw new Error(
        "Tipo de documento inválido. Debe ser: CC, CE, NIT, o PP"
      );
    }

    if (!shippingAddress.line1 || shippingAddress.line1.length < 5) {
      throw new Error("Dirección de envío requerida (mínimo 5 caracteres)");
    }

    if (!shippingAddress.city || shippingAddress.city.length < 2) {
      throw new Error("Ciudad de envío requerida");
    }

    if (!shippingAddress.state || shippingAddress.state.length < 2) {
      throw new Error("Región/Estado de envío requerido");
    }

    if (!shippingAddress.country || shippingAddress.country !== "CO") {
      throw new Error("País debe ser 'CO' para Colombia");
    }

    if (!shippingAddress.postalCode || shippingAddress.postalCode.length < 5) {
      throw new Error("Código postal requerido (mínimo 5 caracteres)");
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      throw new Error("Formato de email inválido");
    }

    // Validar que el monto esté en centavos (entero)
    if (!Number.isInteger(amount)) {
      throw new Error("El monto debe estar en centavos (número entero)");
    }

    // Generar firma de integridad
    const integritySignature = generateWompiIntegritySignature(
      reference,
      amount,
      currency
    );

    // Preparar datos de la transacción según la documentación oficial de Wompi
    const transactionPayload: WompiApiPayload = {
      amount_in_cents: amount,
      currency,
      signature: integritySignature,
      customer_email: customerEmail,
      reference,
      public_key: config.publicKey,
      redirect_url: redirectUrl,
      customer_data: {
        phone_number: customerPhone,
        full_name: customerName,
        legal_id: customerDocumentNumber,
        legal_id_type: customerDocumentType,
      },
      shipping_address: {
        address_line_1: shippingAddress.line1,
        ...(shippingAddress.line2 &&
          shippingAddress.line2.trim().length > 0 && {
            address_line_2: shippingAddress.line2.trim(),
          }),
        city: shippingAddress.city,
        region: shippingAddress.state,
        country: shippingAddress.country,
        postal_code: shippingAddress.postalCode,
        phone_number: customerPhone,
        ...(shippingAddress.name &&
          shippingAddress.name.trim().length > 0 && {
            name: shippingAddress.name.trim(),
          }),
      },
      acceptance_token: acceptanceToken,
      acceptance_token_auth: acceptPersonalAuth,
    };

    // 💳 NUEVO: Agregar método de pago si está presente
    if (transactionData.payment_method && transactionData.payment_method_type) {
      transactionPayload.payment_method = transactionData.payment_method;
      transactionPayload.payment_method_type =
        transactionData.payment_method_type;

      console.log("💳 Método de pago incluido:", {
        type: transactionData.payment_method.type,
        installments: transactionData.payment_method.installments,
        hasToken: !!transactionData.payment_method.token,
      });
    }

    console.log("🚀 Creando transacción en Wompi:", {
      reference,
      amount,
      currency,
      customerEmail,
      hasSignature: !!integritySignature,
      hasAcceptanceToken: !!acceptanceToken,
      payloadSize: JSON.stringify(transactionPayload).length,
    });

    // Log detallado del payload para debugging
    console.log(
      "📋 Payload completo enviado a Wompi:",
      JSON.stringify(transactionPayload, null, 2)
    );

    // Realizar petición a Wompi
    const response = await fetch(`${config.baseUrl}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.privateKey}`,
      },
      body: JSON.stringify(transactionPayload),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        const errorText = await response.text();
        console.error("❌ Error de respuesta no parseable:", errorText);
        throw new Error(
          `Error HTTP ${response.status}: ${response.statusText} - ${errorText}`
        );
      }

      console.error("❌ Error detallado de Wompi:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        url: `${config.baseUrl}/transactions`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.privateKey.substring(0, 20)}...`,
        },
        payloadSample: {
          amount_in_cents: amount,
          currency,
          reference,
          customer_email: customerEmail,
          hasSignature: !!integritySignature,
        },
      });

      // Manejo específico de errores de validación (422)
      if (response.status === 422) {
        const validationErrors =
          errorData.error?.validation ||
          errorData.error?.details ||
          errorData.error?.messages ||
          errorData.error;

        console.error("🚨 Errores de validación de Wompi:", validationErrors);
        console.error(
          "🔍 Error data completo:",
          JSON.stringify(errorData, null, 2)
        );

        let errorMessage = "Error de validación en Wompi: ";

        // Función recursiva para extraer mensajes de error
        const extractErrorMessages = (
          errors: unknown,
          path: string = ""
        ): string[] => {
          const messages: string[] = [];

          if (typeof errors === "string") {
            messages.push(`${path}: ${errors}`);
          } else if (Array.isArray(errors)) {
            errors.forEach((error, index) => {
              if (typeof error === "string") {
                messages.push(`${path}[${index}]: ${error}`);
              } else {
                messages.push(
                  ...extractErrorMessages(error, `${path}[${index}]`)
                );
              }
            });
          } else if (typeof errors === "object" && errors !== null) {
            Object.entries(errors as Record<string, unknown>).forEach(
              ([key, value]) => {
                const currentPath = path ? `${path}.${key}` : key;
                messages.push(...extractErrorMessages(value, currentPath));
              }
            );
          } else {
            messages.push(`${path}: ${String(errors)}`);
          }

          return messages;
        };

        if (validationErrors) {
          const errorMessages = extractErrorMessages(validationErrors);
          errorMessage += errorMessages.join("; ");
        } else {
          errorMessage +=
            errorData.error?.reason ||
            errorData.message ||
            "Datos de transacción inválidos";
        }

        throw new Error(errorMessage);
      }

      throw new Error(
        `Error de Wompi (${response.status}): ${
          errorData.error?.reason || errorData.message || response.statusText
        }`
      );
    }

    const transactionResult = await response.json();

    console.log("✅ Transacción creada exitosamente:", {
      transactionId: transactionResult.data?.id,
      status: transactionResult.data?.status,
      reference: transactionResult.data?.reference,
    });

    // 🗃️ NUEVA FUNCIONALIDAD: Almacenar payment en base de datos
    try {
      console.log("💾 Almacenando payment en base de datos...");

      // Determinar el método de pago para la base de datos
      let dbPaymentMethod = "CARD"; // Por defecto
      if (transactionData.payment_method) {
        dbPaymentMethod = transactionData.payment_method.type;
      }

      const paymentDbResult = await prisma.$queryRaw`
        SELECT * FROM create_payment_transaction(
          ${transactionResult.data?.id}::VARCHAR(255),
          ${reference}::VARCHAR(255),
          ${1}::INTEGER, -- TODO: Obtener order_id real del contexto
          ${amount}::INTEGER,
          ${currency}::VARCHAR(3),
          ${dbPaymentMethod}::payment_method_enum,
          ${JSON.stringify(transactionData.payment_method || {})}::JSONB,
          ${transactionData.payment_method?.token || null}::VARCHAR(255),
          ${acceptanceToken}::TEXT,
          ${acceptPersonalAuth}::TEXT,
          ${integritySignature}::VARCHAR(255),
          ${redirectUrl}::VARCHAR(500),
          ${transactionResult.data?.checkout_url || null}::VARCHAR(500),
          ${customerEmail}::VARCHAR(255),
          ${customerPhone}::VARCHAR(20),
          ${customerDocumentType}::VARCHAR(10),
          ${customerDocumentNumber}::VARCHAR(20),
          ${JSON.stringify(transactionPayload.shipping_address)}::JSONB,
          ${JSON.stringify(transactionResult.data)}::JSONB
        )
      `;

      console.log("✅ Payment almacenado en base de datos:", paymentDbResult);
    } catch (dbError) {
      console.error(
        "⚠️  Error almacenando payment en BD (no crítico):",
        dbError
      );
      // No fallar la transacción principal por error de BD
    }

    return {
      success: true,
      data: {
        transactionId: transactionResult.data?.id,
        status: transactionResult.data?.status,
        reference: transactionResult.data?.reference,
        paymentLinkId: transactionResult.data?.payment_link_id,
        checkoutUrl: transactionResult.data?.checkout_url,
        redirectUrl: transactionResult.data?.redirect_url,
        createdAt: transactionResult.data?.created_at,
        fullResponse: transactionResult.data,
      },
    };
  } catch (error) {
    console.error("❌ Error en createWompiTransactionService:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error creando transacción en Wompi",
    };
  }
};

// STEP 6: Consultar estado de transacción por ID
export const getWompiTransactionStatusService = async (
  transactionId: string
) => {
  try {
    const config = getWompiConfig();

    // Validar configuración
    if (!config.publicKey) {
      throw new Error("WP_PUBLIC_KEY no está configurado");
    }

    // Validar ID de transacción
    if (!transactionId || transactionId.trim().length === 0) {
      throw new Error("ID de transacción requerido");
    }

    console.log("🔍 Consultando estado de transacción:", {
      transactionId,
      environment: config.environment,
      baseUrl: config.baseUrl,
    });

    const url = `${config.baseUrl}/transactions/${transactionId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.privateKey}`,
      },
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        const errorText = await response.text();
        console.error("❌ Error de respuesta no parseable:", errorText);
        throw new Error(
          `Error HTTP ${response.status}: ${response.statusText} - ${errorText}`
        );
      }

      console.error("❌ Error consultando transacción:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        transactionId,
      });

      if (response.status === 404) {
        throw new Error("Transacción no encontrada");
      }

      throw new Error(
        `Error consultando transacción (${response.status}): ${
          errorData.error?.reason || errorData.message || response.statusText
        }`
      );
    }

    const transactionData = await response.json();

    console.log("✅ Estado de transacción obtenido:", {
      transactionId,
      status: transactionData.data?.status,
      amount: transactionData.data?.amount_in_cents,
      reference: transactionData.data?.reference,
    });

    // 🔄 Actualizar estado en nuestra base de datos si ha cambiado
    if (transactionData.data?.status) {
      try {
        await updatePaymentStatusService(
          transactionId,
          transactionData.data.status,
          transactionData.data?.status_message,
          transactionData.data?.processor_response_code,
          transactionData.data
        );
        console.log("✅ Estado sincronizado con base de datos");
      } catch (dbError) {
        console.error("⚠️  Error sincronizando estado con BD:", dbError);
        // No fallar la consulta por error de sincronización
      }
    }

    return {
      success: true,
      data: {
        id: transactionData.data?.id,
        status: transactionData.data?.status, // APPROVED, DECLINED, PENDING, ERROR, VOIDED
        amount_in_cents: transactionData.data?.amount_in_cents,
        reference: transactionData.data?.reference,
        customer_email: transactionData.data?.customer_email,
        currency: transactionData.data?.currency,
        payment_method: transactionData.data?.payment_method,
        status_message: transactionData.data?.status_message,
        created_at: transactionData.data?.created_at,
        finalized_at: transactionData.data?.finalized_at,
        shipping_address: transactionData.data?.shipping_address,
        redirect_url: transactionData.data?.redirect_url,
        payment_link_id: transactionData.data?.payment_link_id,
        fullResponse: transactionData.data,
      },
    };
  } catch (error) {
    console.error("❌ Error en getWompiTransactionStatusService:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error consultando estado de transacción en Wompi",
    };
  }
};

// STEP 7: Actualizar estado de payment en base de datos
export const updatePaymentStatusService = async (
  transactionId: string,
  newStatus: "PENDING" | "APPROVED" | "DECLINED" | "VOIDED" | "ERROR",
  statusMessage?: string,
  processorResponseCode?: string,
  processorResponse?: Record<string, unknown>
) => {
  try {
    console.log("🔄 Actualizando estado de payment:", {
      transactionId,
      newStatus,
      statusMessage,
    });

    const updateResult = await prisma.$queryRaw`
      SELECT * FROM update_payment_status(
        ${transactionId}::VARCHAR(255),
        ${newStatus}::payment_status_enum,
        ${statusMessage || null}::VARCHAR(500),
        ${processorResponseCode || null}::VARCHAR(20),
        ${processorResponse ? JSON.stringify(processorResponse) : null}::JSONB,
        ${newStatus === "APPROVED" ? new Date() : null}::TIMESTAMP(6),
        ${
          newStatus === "DECLINED" || newStatus === "ERROR" ? new Date() : null
        }::TIMESTAMP(6)
      )
    `;

    console.log("✅ Estado de payment actualizado:", updateResult);

    return {
      success: true,
      data: updateResult,
    };
  } catch (error) {
    console.error("❌ Error actualizando estado de payment:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error actualizando estado de payment",
    };
  }
};

// STEP 8: Obtener payment desde base de datos
export const getPaymentByTransactionIdService = async (
  transactionId: string
) => {
  try {
    console.log("🔍 Consultando payment desde BD:", { transactionId });

    const paymentResult = await prisma.$queryRaw`
      SELECT * FROM get_payment_by_transaction_id(${transactionId}::VARCHAR(255))
    `;

    console.log("✅ Payment consultado desde BD:", paymentResult);

    return {
      success: true,
      data: paymentResult,
    };
  } catch (error) {
    console.error("❌ Error consultando payment desde BD:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error consultando payment desde base de datos",
    };
  }
};

// Exportar tipos
export type {
  AcceptanceToken,
  WompiMerchantData,
  WompiConfig,
  WompiTransactionData,
  WompiApiPayload,
};
