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

interface PSEFinancialInstitution {
  financial_institution_code: string;
  financial_institution_name: string;
}

interface PSEPaymentMethod {
  type: "PSE";
  user_type: 0 | 1; // 0: Natural, 1: Jurídica
  user_legal_id_type: "CC" | "CE" | "NIT" | "PP";
  user_legal_id: string;
  financial_institution_code: string;
  payment_description: string;
}

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
  payment_method?: {
    type: "CARD";
    installments: number;
    token: string;
  };
  payment_method_type?: "CARD" | "NEQUI" | "PSE";
  cartData?: Array<{
    product_id: number;
    quantity: number;
    price: number;
    name?: string;
    color_code?: string;
    size?: string;
  }>;
}

interface PSETransactionData {
  amount: number;
  currency: string;
  customerEmail: string;
  reference: string;
  pseDetails: Omit<PSEPaymentMethod, "type">;
  customerData: {
    phone_number: string;
    full_name: string;
  };
  shippingAddress?: {
    address_line_1: string;
    address_line_2?: string;
    city: string;
    region: string;
    country: string;
    postal_code: string;
    phone_number: string;
    name?: string;
  };

  userId?: number;
  clientIP?: string;
  cartData?: Array<{
    product_id: number;
    quantity: number;
    price: number;
    name?: string;
    color_code?: string;
    size?: string;
  }>;
}

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

export const getWompiPublicConfigService = async () => {
  try {
    const config = getWompiConfig();
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
    return {
      success: true,
      data: publicConfig,
    };
  } catch (error) {
    console.error("Error en getWompiPublicConfigService:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error obteniendo configuración pública de Wompi",
    };
  }
};

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

    // Generar hash SHA256
    const signature = crypto
      .createHash("sha256")
      .update(concatenatedString, "utf8")
      .digest("hex");

    return signature;
  } catch (error) {
    console.error("Error generando firma de integridad:", error);
    throw new Error(
      `Error generando firma de integridad: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
};

export const getFinancialInstitutions = async (): Promise<
  PSEFinancialInstitution[]
> => {
  try {
    const config = getWompiConfig();

    const response = await fetch(
      `${config.baseUrl}/pse/financial_institutions`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${config.publicKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("❌ Error obteniendo instituciones financieras:", {
        status: response.status,
        error: errorData,
      });
      throw new Error(
        `Error fetching financial institutions: ${response.status} - ${errorData}`
      );
    }

    const data = await response.json();

    return data.data || [];
  } catch (error) {
    console.error("❌ Error getting financial institutions:", error);
    throw error;
  }
};

export const createPSETransaction = async (
  pseTransactionData: PSETransactionData
): Promise<any> => {
  try {
    const config = getWompiConfig();

    const {
      amount,
      currency,
      customerEmail,
      reference,
      pseDetails,
      customerData,
      shippingAddress,
      userId,
      clientIP,
    } = pseTransactionData;

    // 🔐 OBTENER TOKENS DE ACEPTACIÓN (como en pagos con tarjeta)
    const tokensResult = await getWompiAcceptanceTokensService();

    if (!tokensResult.success || !tokensResult.data) {
      throw new Error(
        `Error obteniendo tokens de aceptación: ${tokensResult.error}`
      );
    }

    const acceptanceToken =
      tokensResult.data.presigned_acceptance.acceptance_token;
    const acceptPersonalAuth =
      tokensResult.data.presigned_personal_data_auth.acceptance_token;

    // 🔐 GENERAR INTEGRITY SIGNATURE (OBLIGATORIO PARA WOMPI)
    const integritySignature = generateWompiIntegritySignature(
      reference,
      amount,
      currency
    );

    // 🌐 CONFIGURAR URL DE REDIRECCIÓN
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const redirectUrl = `${frontendUrl}/checkout/payment/pse-result`;

    try {
      new URL(redirectUrl);
    } catch {
      throw new Error(`URL de redirect inválida: ${redirectUrl}`);
    }

    // 🛡️ CAMPOS ANTI-FRAUDE PARA SERVICIOS FINANCIEROS
    const finalClientIP = clientIP || "192.168.1.1"; // ✅ USAR IP REAL DEL CLIENTE
    const productOpeningDate = new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, ""); // YYYYMMDD
    const beneficiaryDocument = pseDetails.user_legal_id; // Documento del beneficiario

    // 📦 ESTRUCTURA COMPLETA PARA PSE SEGÚN DOCUMENTACIÓN WOMPI
    const transactionData = {
      // 🔐 CAMPOS OBLIGATORIOS PARA CUALQUIER TRANSACCIÓN WOMPI
      amount_in_cents: amount,
      currency,
      customer_email: customerEmail,
      reference,
      public_key: config.publicKey,
      signature: integritySignature,
      redirect_url: redirectUrl,
      acceptance_token: acceptanceToken,
      acceptance_token_auth: acceptPersonalAuth,

      // 🏦 CAMPOS ESPECÍFICOS PARA PSE CON ANTI-FRAUDE
      payment_method: {
        type: "PSE" as const,
        user_type: pseDetails.user_type,
        user_legal_id_type: pseDetails.user_legal_id_type,
        user_legal_id: pseDetails.user_legal_id,
        financial_institution_code: pseDetails.financial_institution_code,
        payment_description: pseDetails.payment_description,
        // ✅ CAMPOS ANTI-FRAUDE OBLIGATORIOS PARA SERVICIOS FINANCIEROS
        reference_one: finalClientIP, // ✅ IP del cliente
        reference_two: productOpeningDate, // Fecha apertura producto (YYYYMMDD)
        reference_three: beneficiaryDocument, // Documento del beneficiario
      },

      // 👤 DATOS DEL CLIENTE (OBLIGATORIOS PARA PSE)
      customer_data: {
        phone_number: customerData.phone_number,
        full_name: customerData.full_name,
      },

      // 📦 DIRECCIÓN DE ENVÍO (OPCIONAL PARA PSE, PERO REQUERIDA SI SE ENVÍA)
      ...(shippingAddress && {
        shipping_address: shippingAddress,
      }),
    };

    // 🚀 ENVIAR TRANSACIÓN A WOMPI
    const response = await fetch(`${config.baseUrl}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.privateKey}`,
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Error creando transacción PSE:", {
        status: response.status,
        error: errorData,
      });
      throw new Error(
        `Wompi PSE transaction failed: ${JSON.stringify(errorData)}`
      );
    }

    const result = await response.json();
    const transactionId = result.data?.id;

    let asyncPaymentUrl = result.data?.payment_method?.extra?.async_payment_url;
    let pollAttempts = 0;
    const maxPollAttempts = 12; // 2 minutos máximo (10 segundos * 12)

    while (!asyncPaymentUrl && pollAttempts < maxPollAttempts) {
      pollAttempts++;
      console.log(`Polling intento ${pollAttempts}/${maxPollAttempts}...`);

      // Esperar 10 segundos antes del siguiente intento
      await new Promise((resolve) => setTimeout(resolve, 10000));

      try {
        // Consultar estado de la transacción
        const statusResponse = await fetch(
          `${config.baseUrl}/transactions/${transactionId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${config.publicKey}`,
            },
          }
        );

        if (statusResponse.ok) {
          const statusResult = await statusResponse.json();
          asyncPaymentUrl =
            statusResult.data?.payment_method?.extra?.async_payment_url;

          if (asyncPaymentUrl) {
            console.log(" async_payment_url obtenida:", asyncPaymentUrl);
            break;
          }
        }
      } catch (pollError) {
        console.error(
          `⚠️ Error en polling intento ${pollAttempts}:`,
          pollError
        );
      }
    }

    if (!asyncPaymentUrl) {
      console.warn(
        "⚠️ No se pudo obtener async_payment_url después del polling"
      );
    }

    try {
      let cartDataForDb = null;
      if (
        pseTransactionData.cartData &&
        Array.isArray(pseTransactionData.cartData)
      ) {
        // Convertir los items a formato esperado por la BD (precios en centavos)
        cartDataForDb = pseTransactionData.cartData.map((item) => {
          return {
            product_id: item.product_id,
            quantity: item.quantity,
            price:
              item.price < 1000000
                ? convertPesosToWompiCentavos(item.price)
                : item.price, // Convertir si está en pesos
            color: item.color_code || "",
            size: item.size || "",
          };
        });
      }

      const paymentDbResult = await createPaymentTransaction({
        transactionId: result.data?.id,
        reference,
        orderId: null,
        amount,
        currency,
        paymentMethod: "PSE",
        paymentMethodData: result.data?.payment_method || {},
        acceptanceToken,
        acceptPersonalAuth,
        integritySignature,
        redirectUrl,
        checkoutUrl: asyncPaymentUrl || result.data?.payment_link_id, // URL del banco
        customerEmail,
        customerPhone: customerData.phone_number,
        customerDocumentType: pseDetails.user_legal_id_type,
        customerDocumentNumber: pseDetails.user_legal_id,
        shippingAddress: shippingAddress || {},
        processorResponse: result.data,
        userId,
        cartData: cartDataForDb || undefined,
      });

      console.log(
        "✅ Payment PSE almacenado en base de datos:",
        paymentDbResult
      );
    } catch (dbError) {
      console.error(
        "⚠️ Error almacenando payment PSE en BD (no crítico):",
        dbError
      );
    }

    return {
      success: true,
      data: {
        transactionId: result.data?.id,
        status: result.data?.status,
        reference: result.data?.reference,
        paymentMethod: result.data?.payment_method,
        async_payment_url: asyncPaymentUrl,
        payment_link_id: result.data?.payment_link_id,
        redirect_url: result.data?.redirect_url,
        createdAt: result.data?.created_at,
        fullResponse: result.data,
      },
    };
  } catch (error) {
    console.error("❌ Error creating PSE transaction:", error);
    throw error;
  }
};

export const createPaymentService = async (
  transactionData: WompiTransactionData,
  userId: number
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

    // Validaciones adicionales específicas de Wompi
    if (!customerPhone || customerPhone.length < 10) {
      throw new Error("Teléfono del cliente requerido (mínimo 10 dígitos)");
    }

    if (!customerDocumentNumber || customerDocumentNumber.length < 6) {
      throw new Error("Número de documento requerido (mínimo 6 caracteres)");
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

    const integritySignature = generateWompiIntegritySignature(
      reference,
      amount,
      currency
    );

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

    if (transactionData.payment_method && transactionData.payment_method_type) {
      transactionPayload.payment_method = transactionData.payment_method;
      transactionPayload.payment_method_type =
        transactionData.payment_method_type;

      console.log("Método de pago incluido:", {
        type: transactionData.payment_method.type,
        installments: transactionData.payment_method.installments,
        hasToken: !!transactionData.payment_method.token,
      });
    }

    console.log(
      "Payload completo enviado a Wompi:",
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

    // Validar que tenemos el transactionId antes de guardar
    if (!transactionResult.data?.id) {
      throw new Error("No se recibió transactionId de Wompi");
    }

    let cartDataForDb = null;
    if (transactionData.cartData && Array.isArray(transactionData.cartData)) {
      // Convertir los items a formato esperado por la BD (precios en centavos)
      cartDataForDb = transactionData.cartData.map((item) => {
        return {
          product_id: item.product_id,
          quantity: item.quantity,
          price:
            item.price < 1000000
              ? convertPesosToWompiCentavos(item.price)
              : item.price, // Convertir si está en pesos
          color: item.color_code || "",
          size: item.size || "",
        };
      });
    } else {
      console.log("Cart data NO válido - almacenando array vacío:", {
        hasCartData: !!transactionData.cartData,
        cartDataStructure: transactionData.cartData,
        reason: !transactionData.cartData
          ? "cartData es null/undefined"
          : !Array.isArray(transactionData.cartData)
          ? "cartData no es un array"
          : "estructura desconocida",
      });
    }

    try {
      const paymentDbResult = await createPaymentTransaction({
        transactionId: transactionResult.data.id, // Ya validado que existe
        reference,
        orderId: null,
        amount,
        currency,
        paymentMethod: transactionData.payment_method_type || "CARD",
        paymentMethodData: transactionData.payment_method || {},
        paymentToken: transactionData.payment_method?.token,
        acceptanceToken,
        acceptPersonalAuth,
        integritySignature,
        redirectUrl,
        checkoutUrl: transactionResult.data?.checkout_url,
        customerEmail,
        customerPhone,
        customerDocumentType,
        customerDocumentNumber,
        shippingAddress: transactionPayload.shipping_address,
        processorResponse: transactionResult.data,
        userId,
        cartData: cartDataForDb || undefined, // NUEVO: Pasar datos del carrito
      });

      console.log("✅ Payment guardado exitosamente en BD:", paymentDbResult);
    } catch (dbError) {
      console.error("❌ Error CRÍTICO almacenando payment en BD:", dbError);
      throw new Error(
        `Error guardando payment en base de datos: ${
          dbError instanceof Error ? dbError.message : "Error desconocido"
        }`
      );
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

    console.log(" Estado de transacción obtenido:", {
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

// NUEVA FUNCIÓN: Actualizar payment de manera general (no específico para webhooks)
export const updatePaymentService = async ({
  transactionId,
  newStatus,
  statusMessage,
  processorResponse,
  paymentMethodDetails,
}: {
  transactionId: string;
  newStatus: "PENDING" | "APPROVED" | "DECLINED" | "VOIDED" | "ERROR";
  statusMessage?: string;
  processorResponse?: object;
  paymentMethodDetails?: object;
}) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT * FROM fn_update_payment(
        ${transactionId}::VARCHAR(255),
        ${newStatus}::payment_status_enum,
        ${statusMessage || null}::VARCHAR(500),
        ${processorResponse ? JSON.stringify(processorResponse) : null}::JSONB,
        ${
          paymentMethodDetails ? JSON.stringify(paymentMethodDetails) : null
        }::JSONB
      )
    `;

    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Error en updatePaymentService:", error);
    throw new Error(
      `Error actualizando payment: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
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
    // Usar fn_update_payment para todas las actualizaciones
    const result = await prisma.$queryRaw`
      SELECT * FROM fn_update_payment(
        ${transactionId}::VARCHAR(255),
        ${newStatus}::payment_status_enum,
        ${statusMessage || null}::VARCHAR(500),
        ${processorResponse ? JSON.stringify(processorResponse) : null}::JSONB,
        ${null}::JSONB
      )
    `;

    console.log(
      "✅ Estado de payment actualizado con fn_update_payment:",
      result
    );

    return {
      success: true,
      data: result,
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

export const getPaymentByTransactionIdService = async (
  transactionId: string
) => {
  try {
    console.log("Consultando payment desde BD:", { transactionId });

    const paymentResult = await prisma.$queryRaw`
      SELECT * FROM get_payment_by_transaction_id(${transactionId}::VARCHAR)
    `;

    console.log(" Payment consultado desde BD:", paymentResult);

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

interface CreatePaymentTransactionParams {
  transactionId: string;
  reference: string;
  orderId?: number | null;
  amount: number;
  currency: string;
  paymentMethod: "CARD" | "PSE" | "NEQUI" | "BANCOLOMBIA";
  paymentMethodData?: object;
  paymentToken?: string;
  acceptanceToken: string;
  acceptPersonalAuth: string;
  integritySignature: string;
  redirectUrl: string;
  checkoutUrl?: string;
  customerEmail: string;
  customerPhone: string;
  customerDocumentType: string;
  customerDocumentNumber: string;
  shippingAddress: object;
  processorResponse?: object;
  userId?: number | null;
  cartData?: object; // NUEVO: Datos del carrito en formato para la BD
}

export const createPaymentTransaction = async (
  params: CreatePaymentTransactionParams
) => {
  try {
    console.log("🔍 Llamando fn_create_payment con params:", {
      transactionId: params.transactionId,
      reference: params.reference,
      amount: params.amount,
      paymentMethod: params.paymentMethod,
      customerEmail: params.customerEmail,
      hasCartData: !!params.cartData,
      cartDataLength: Array.isArray(params.cartData)
        ? params.cartData.length
        : 0,
      userId: params.userId,
      currency: params.currency,
      hasShippingAddress: !!params.shippingAddress,
      acceptanceToken: params.acceptanceToken
        ? params.acceptanceToken.substring(0, 20) + "..."
        : null,
      acceptPersonalAuth: params.acceptPersonalAuth
        ? params.acceptPersonalAuth.substring(0, 20) + "..."
        : null,
      integritySignature: params.integritySignature
        ? params.integritySignature.substring(0, 20) + "..."
        : null,
    });

    const result = await prisma.$queryRaw`
      SELECT * FROM fn_create_payment(
        ${params.transactionId}::VARCHAR(255),
        ${params.reference}::VARCHAR(255),
        ${params.amount}::INTEGER,
        ${params.paymentMethod}::payment_method_enum,
        ${params.customerEmail}::VARCHAR(255),
        ${JSON.stringify(params.cartData || [])}::JSONB,
        ${JSON.stringify(params.shippingAddress)}::JSONB,
        ${params.userId || null}::INTEGER,
        ${params.currency}::VARCHAR(3),
        ${JSON.stringify(params.paymentMethodData || {})}::JSONB,
        ${params.paymentToken || null}::VARCHAR(255),
        ${params.acceptanceToken}::TEXT,
        ${params.acceptPersonalAuth}::TEXT,
        ${params.integritySignature}::VARCHAR(255),
        ${params.redirectUrl}::VARCHAR(500),
        ${params.checkoutUrl || null}::VARCHAR(500),
        ${params.customerPhone}::VARCHAR(20),
        ${params.customerDocumentType}::VARCHAR(10),
        ${params.customerDocumentNumber}::VARCHAR(20),
        ${JSON.stringify(params.processorResponse || {})}::JSONB
      )
    `;

    console.log("✅ fn_create_payment ejecutada exitosamente:", result);

    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Error en createPaymentTransaction:", error);
    throw new Error(
      `Error creando payment: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
};

export const updatePaymentFromWebhook = async (webhookData: {
  transactionId: string;
  newStatus: "PENDING" | "APPROVED" | "DECLINED" | "VOIDED" | "ERROR";
  statusMessage?: string;
  processorResponseCode?: string;
  processorResponse: object;
  signature: string;
  paymentMethodDetails?: object;
}) => {
  try {
    // Verificar firma del webhook antes de procesar
    const expectedSignature = generateWebhookSignature(
      webhookData.processorResponse
    );
    if (webhookData.signature !== expectedSignature) {
      throw new Error("Firma de webhook inválida");
    }

    const result = await prisma.$queryRaw`
      SELECT * FROM fn_update_payment(
        ${webhookData.transactionId}::VARCHAR(255),
        ${webhookData.newStatus}::payment_status_enum,
        ${webhookData.statusMessage || null}::VARCHAR(500),
        ${JSON.stringify(webhookData.processorResponse)}::JSONB,
        ${JSON.stringify(webhookData.paymentMethodDetails || {})}::JSONB
      )
    `;

    console.log(
      "✅ fn_update_payment ejecutada exitosamente desde webhook:",
      result
    );
    return { success: true, data: result };
  } catch (error) {
    console.error("Error en updatePaymentFromWebhook:", error);
    throw new Error(
      `Error actualizando payment desde webhook: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
};

// NUEVA FUNCIÓN: Generar firma para verificación de webhooks
export const generateWebhookSignature = (webhookData: object): string => {
  try {
    const config = getWompiConfig();
    const secret = config.eventsSecret;

    if (!secret) {
      throw new Error("WP_EVENTS no está configurado");
    }

    // Convertir el objeto a string JSON y generar SHA256
    const dataString = JSON.stringify(webhookData);
    const signature = crypto
      .createHash("sha256")
      .update(dataString + secret, "utf8")
      .digest("hex");

    return signature;
  } catch (error) {
    console.error("Error generando firma de webhook:", error);
    throw new Error(
      `Error generando firma de webhook: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
};

export const verifyWebhookSignature = (
  receivedSignature: string,
  webhookData: object
): boolean => {
  try {
    const expectedSignature = generateWebhookSignature(webhookData);
    return receivedSignature === expectedSignature;
  } catch (error) {
    console.error("Error verificando firma de webhook:", error);
    return false;
  }
};

// 💰 FUNCIÓN PARA CONVERTIR PESOS A CENTAVOS
export const convertPesosToWompiCentavos = (pesosAmount: number): number => {
  // Validar que sea un número válido
  if (
    typeof pesosAmount !== "number" ||
    isNaN(pesosAmount) ||
    pesosAmount < 0
  ) {
    throw new Error(`Monto en pesos inválido: ${pesosAmount}`);
  }

  // Convertir pesos a centavos (multiplicar por 100)
  const centavos = Math.round(pesosAmount * 100);

  return centavos;
};

// 💰 FUNCIÓN PARA CONVERTIR CENTAVOS A PESOS (para mostrar al usuario)
export const convertWompiCentavosToPesos = (centavosAmount: number): number => {
  // Validar que sea un número válido
  if (
    typeof centavosAmount !== "number" ||
    isNaN(centavosAmount) ||
    centavosAmount < 0
  ) {
    throw new Error(`Monto en centavos inválido: ${centavosAmount}`);
  }

  // Convertir centavos a pesos (dividir por 100)
  const pesos = centavosAmount / 100;

  return pesos;
};

// 🧮 FUNCIÓN PARA CALCULAR EL TOTAL DEL CARRITO EN CENTAVOS
export const calculateCartTotalInCentavos = (
  cartData: Array<{
    product_id: number;
    quantity: number;
    price: number; // EN PESOS
    name?: string;
    color_code?: string;
    size?: string;
  }>
): {
  subtotalCentavos: number;
  taxesCentavos: number;
  shippingCentavos: number;
  discountCentavos: number;
  totalCentavos: number;
  originalPesos: {
    subtotal: number;
    taxes: number;
    shipping: number;
    discount: number;
    total: number;
  };
} => {
  try {
    // Calcular subtotal desde items
    let subtotalPesos = 0;

    if (cartData && cartData.length > 0) {
      subtotalPesos = cartData.reduce((sum, item) => {
        const itemSubtotal = item.price * item.quantity;
        return sum + itemSubtotal;
      }, 0);
    }

    // Valores en pesos (con valores por defecto)
    const taxesPesos = Math.round(subtotalPesos * 0.19); // IVA 19%
    const shippingPesos = subtotalPesos >= 100000 ? 0 : 15000; // Envío gratis > $100,000
    const discountPesos = 0;
    const totalPesos =
      subtotalPesos + taxesPesos + shippingPesos - discountPesos;

    // Convertir todo a centavos
    const result = {
      subtotalCentavos: convertPesosToWompiCentavos(subtotalPesos),
      taxesCentavos: convertPesosToWompiCentavos(taxesPesos),
      shippingCentavos: convertPesosToWompiCentavos(shippingPesos),
      discountCentavos: convertPesosToWompiCentavos(discountPesos),
      totalCentavos: convertPesosToWompiCentavos(totalPesos),
      originalPesos: {
        subtotal: subtotalPesos,
        taxes: taxesPesos,
        shipping: shippingPesos,
        discount: discountPesos,
        total: totalPesos,
      },
    };

    return result;
  } catch (error) {
    console.error("❌ Error calculando total del carrito:", error);
    throw new Error(
      `Error calculando total del carrito: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
};

// Exportar tipos
export type {
  AcceptanceToken,
  WompiMerchantData,
  WompiConfig,
  WompiTransactionData,
  CreatePaymentTransactionParams,
  PSETransactionData,
};
