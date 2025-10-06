import { api } from "../../../../config/api";
// Step 2: Configuración pública./config/api";

// 🎯 INTERFACES PARA WOMPI

// Step 1: Tokens de aceptación
export interface WompiAcceptanceToken {
  acceptance_token: string;
  permalink: string;
  type: string;
}

export interface WompiMerchantData {
  presigned_acceptance: WompiAcceptanceToken;
  presigned_personal_data_auth: WompiAcceptanceToken;
}
// Step 2: Configuración pública
export interface WompiPublicConfig {
  publicKey: string;
  environment: "sandbox" | "production";
  checkoutUrl: string;
  widgetUrl: string;
  acceptanceTokens: WompiMerchantData;
  contractLinks: {
    termsAndConditions: {
      url: string;
      type: string;
      title: string;
    };
    personalDataAuth: {
      url: string;
      type: string;
      title: string;
    };
  };
}

// 💳 TOKENIZACIÓN DE TARJETAS
export interface WompiCardTokenizationRequest {
  number: string;
  cvc: string;
  exp_month: string;
  exp_year: string;
  card_holder: string;
}

export interface WompiCardTokenizationResponse {
  status: "CREATED";
  data: {
    id: string; // Token de la tarjeta
    created_at: string;
    brand: string;
    name: string;
    last_four: string;
    bin: string;
    exp_year: string;
    exp_month: string;
    card_holder: string;
    expires_at: string;
  };
}

// 💳 MÉTODOS DE PAGO
export interface WompiCardPaymentMethod {
  type: "CARD";
  installments: number;
  token: string;
}

export interface WompiPaymentMethod {
  CARD: WompiCardPaymentMethod;
  // Otros métodos se agregarán después (NEQUI, PSE, etc.)
}

// Step 4: Firma de integridad
export interface WompiIntegritySignatureRequest {
  reference: string;
  amount: number;
  currency?: string;
}

export interface WompiIntegritySignatureResponse {
  success: boolean;
  message?: string;
  data?: {
    signature: string;
    reference: string;
    amount: number;
    currency: string;
  };
  error?: string;
}

// Step 5: Datos de transacción
export interface WompiTransactionData {
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
  // 💳 NUEVO: Método de pago agregado
  payment_method?: WompiCardPaymentMethod; // Por ahora solo CARD
  payment_method_type?: "CARD" | "NEQUI" | "PSE";
  // 🛒 NUEVO: Datos del carrito para creación de órdenes
  cartData?: Array<{
    product_id: number;
    quantity: number;
    price: number;
    name?: string;
    color_code?: string;
    size?: string;
  }>;
}

export interface WompiTransactionResponse {
  success: boolean;
  message?: string;
  data?: {
    transactionId: string;
    status: string;
    reference: string;
    paymentLinkId?: string;
    checkoutUrl?: string;
    redirectUrl?: string;
    createdAt?: string;
    fullResponse?: unknown;
  };
  error?: string;
}

// Respuestas genéricas de la API
export interface WompiApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Interfaz para test de conexión
export interface WompiConnectionTest {
  connectionStatus: "SUCCESS" | "FAILED";
  error: string | null;
  hasTokens: boolean;
  timestamp: string;
}

// 🎯 STEP 1: OBTENER TOKENS DE ACEPTACIÓN
export const getWompiAcceptanceTokensApi = async (): Promise<
  WompiApiResponse<WompiMerchantData>
> => {
  try {
    console.log("📡 Obteniendo tokens de aceptación de Wompi...");

    const { data: response } = await api.get<
      WompiApiResponse<WompiMerchantData>
    >("/api/payments/acceptance-tokens");

    if (!response.success) {
      throw new Error(
        response.error || "Error obteniendo tokens de aceptación"
      );
    }

    console.log("✅ Tokens de aceptación obtenidos:", {
      hasPresignedAcceptance:
        !!response.data?.presigned_acceptance?.acceptance_token,
      hasPersonalDataAuth:
        !!response.data?.presigned_personal_data_auth?.acceptance_token,
    });

    return response;
  } catch (error: unknown) {
    console.error("❌ Error en getWompiAcceptanceTokensApi:", error);

    if (error && typeof error === "object" && "response" in error) {
      const apiError = error as {
        response: { data?: WompiApiResponse<WompiMerchantData> };
      };
      if (apiError.response?.data) {
        throw apiError.response.data;
      }
    }

    throw {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error desconocido obteniendo tokens",
    };
  }
};

// 🎯 STEP 2: OBTENER CONFIGURACIÓN PÚBLICA (incluye tokens y links)
export const getWompiPublicConfigApi = async (): Promise<
  WompiApiResponse<WompiPublicConfig>
> => {
  try {
    console.log("📡 Obteniendo configuración pública de Wompi...");

    const { data: response } = await api.get<
      WompiApiResponse<WompiPublicConfig>
    >("/api/payments/config");

    if (!response.success) {
      throw new Error(
        response.error || "Error obteniendo configuración pública"
      );
    }

    console.log("✅ Configuración pública obtenida:", {
      publicKey: response.data?.publicKey?.substring(0, 20) + "...",
      environment: response.data?.environment,
      hasTokens: !!response.data?.acceptanceTokens,
      contractLinksCount: Object.keys(response.data?.contractLinks || {})
        .length,
    });

    return response;
  } catch (error: unknown) {
    console.error("❌ Error en getWompiPublicConfigApi:", error);

    if (error && typeof error === "object" && "response" in error) {
      const apiError = error as {
        response: { data?: WompiApiResponse<WompiPublicConfig> };
      };
      if (apiError.response?.data) {
        throw apiError.response.data;
      }
    }

    throw {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error desconocido obteniendo configuración",
    };
  }
};

// 💳 STEP 3: TOKENIZAR TARJETA DE CRÉDITO/DÉBITO
export const tokenizeCardApi = async (
  cardData: WompiCardTokenizationRequest,
  publicKey: string
): Promise<WompiApiResponse<WompiCardTokenizationResponse["data"]>> => {
  try {
    console.log("💳 Tokenizando tarjeta de crédito/débito...", {
      cardHolder: cardData.card_holder,
      lastFour: cardData.number.slice(-4),
      expMonth: cardData.exp_month,
      expYear: cardData.exp_year,
    });

    // Llamar directamente a Wompi (no a nuestro backend)
    const wompiResponse = await fetch(
      "https://sandbox.wompi.co/v1/tokens/cards",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicKey}`,
        },
        body: JSON.stringify(cardData),
      }
    );

    if (!wompiResponse.ok) {
      const errorData = await wompiResponse.json();
      console.error("❌ Error tokenizando tarjeta:", errorData);

      throw new Error(
        errorData.error?.reason ||
          errorData.message ||
          `Error ${wompiResponse.status}: ${wompiResponse.statusText}`
      );
    }

    const result: WompiCardTokenizationResponse = await wompiResponse.json();

    if (result.status !== "CREATED" || !result.data?.id) {
      throw new Error("Token de tarjeta no fue creado correctamente");
    }

    console.log("✅ Tarjeta tokenizada exitosamente:", {
      tokenId: result.data.id,
      brand: result.data.brand,
      lastFour: result.data.last_four,
      expiresAt: result.data.expires_at,
    });

    return {
      success: true,
      data: result.data,
    };
  } catch (error: unknown) {
    console.error("❌ Error en tokenizeCardApi:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error desconocido tokenizando tarjeta",
    };
  }
};

// 🎯 STEP 4: GENERAR FIRMA DE INTEGRIDAD
export const generateWompiIntegritySignatureApi = async (
  signatureData: WompiIntegritySignatureRequest
): Promise<WompiIntegritySignatureResponse> => {
  try {
    console.log("🔐 Generando firma de integridad:", {
      reference: signatureData.reference,
      amount: signatureData.amount,
      currency: signatureData.currency || "COP",
    });

    const { data: response } = await api.post<WompiIntegritySignatureResponse>(
      "/api/payments/generate-signature",
      signatureData
    );

    if (!response.success) {
      throw new Error(response.error || "Error generando firma de integridad");
    }

    console.log("✅ Firma de integridad generada:", {
      signature: response.data?.signature?.substring(0, 20) + "...",
      reference: response.data?.reference,
    });

    return response;
  } catch (error: unknown) {
    console.error("❌ Error en generateWompiIntegritySignatureApi:", error);

    if (error && typeof error === "object" && "response" in error) {
      const apiError = error as {
        response: { data?: WompiIntegritySignatureResponse };
      };
      if (apiError.response?.data) {
        throw apiError.response.data;
      }
    }

    throw {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error desconocido generando firma",
    };
  }
};

// 🎯 STEP 5: CREAR TRANSACCIÓN EN WOMPI
export const createWompiTransactionApi = async (
  transactionData: WompiTransactionData,
  userId: string | number // NUEVO: userId obligatorio desde NextAuth
): Promise<WompiTransactionResponse> => {
  try {
    console.log("� Creando transacción en Wompi:", {
      reference: transactionData.reference,
      amount: transactionData.amount,
      currency: transactionData.currency,
      customerEmail: transactionData.customerEmail,
      hasAcceptanceToken: !!transactionData.acceptanceToken,
      hasPersonalAuthToken: !!transactionData.acceptPersonalAuth,
    });

    // Pasar userId como query param
    const { data: response } = await api.post<WompiTransactionResponse>(
      `/api/payments/create-transaction?user_id=${userId}`,
      transactionData
    );

    if (!response.success) {
      throw new Error(response.error || "Error creando transacción");
    }

    console.log("✅ Transacción creada exitosamente:", {
      transactionId: response.data?.transactionId,
      status: response.data?.status,
      reference: response.data?.reference,
    });

    return response;
  } catch (error: unknown) {
    console.error("❌ Error en createWompiTransactionApi:", error);

    if (error && typeof error === "object" && "response" in error) {
      const apiError = error as {
        response: { data?: WompiTransactionResponse };
      };
      if (apiError.response?.data) {
        throw apiError.response.data;
      }
    }

    throw {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error desconocido creando transacción",
    };
  }
};

// 🎯 UTILIDAD: GENERAR REFERENCIA ÚNICA
export const generatePaymentReference = (userId?: number): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const userPrefix = userId ? `U${userId}` : "GUEST";

  return `NEOSALE_${userPrefix}_${timestamp}_${random}`.toUpperCase();
};

// 🎯 UTILIDAD: VALIDAR MONTO EN CENTAVOS
export const convertToCents = (amount: number): number => {
  return Math.round(amount * 100);
};

// 🎯 UTILIDAD: FORMATEAR MONTO DESDE CENTAVOS
export const convertFromCents = (amountInCents: number): number => {
  return amountInCents / 100;
};

// 🔍 FUNCIÓN DE DEBUGGING: Validar datos antes de crear transacción
export const validateWompiDataApi = async (
  transactionData: WompiTransactionData
): Promise<
  WompiApiResponse<{
    isValid: boolean;
    issues: string[];
    dataReceived: {
      reference?: string;
      amount?: number;
      currency?: string;
      customerEmail?: string;
      hasAllRequiredFields?: boolean;
      signatureGenerated?: boolean;
    };
    recommendations: string[];
  }>
> => {
  try {
    console.log("🔍 Validando datos para Wompi:", transactionData);

    const { data: response } = await api.post<
      WompiApiResponse<{
        isValid: boolean;
        issues: string[];
        dataReceived: {
          reference?: string;
          amount?: number;
          currency?: string;
          customerEmail?: string;
          hasAllRequiredFields?: boolean;
          signatureGenerated?: boolean;
        };
        recommendations: string[];
      }>
    >("/api/payments/validate-data", transactionData);

    if (!response.success) {
      throw new Error(response.error || "Error validando datos");
    }

    console.log("✅ Validación completada:", {
      isValid: response.data?.isValid,
      issuesCount: response.data?.issues?.length || 0,
    });

    return response;
  } catch (error: unknown) {
    console.error("❌ Error en validateWompiDataApi:", error);

    if (error && typeof error === "object" && "response" in error) {
      const apiError = error as {
        response: { data?: WompiApiResponse<unknown> };
      };
      if (apiError.response?.data) {
        throw apiError.response.data;
      }
    }

    throw {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error desconocido validando datos",
    };
  }
};
export const testWompiConnectionApi = async (): Promise<
  WompiApiResponse<WompiConnectionTest>
> => {
  try {
    console.log("🔍 Probando conexión con Wompi...");

    const { data: response } = await api.get<
      WompiApiResponse<WompiConnectionTest>
    >("/api/payments/test-connection");

    console.log("📊 Resultado de prueba de conexión:", response);

    return response;
  } catch (error: unknown) {
    console.error("❌ Error probando conexión con Wompi:", error);

    if (error && typeof error === "object" && "response" in error) {
      const apiError = error as {
        response: { data?: WompiApiResponse<WompiConnectionTest> };
      };
      if (apiError.response?.data) {
        throw apiError.response.data;
      }
    }

    throw {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error desconocido probando conexión",
    };
  }
};

// 🎯 FLUJO COMPLETO DE PAGO WOMPI
export const processWompiPaymentFlow = async (
  customerData: {
    email: string;
    name: string;
    phone: string;
    documentType: string;
    documentNumber: string;
    shippingAddress: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
      name?: string;
    };
  },
  orderData: {
    amount: number;
    currency?: string;
    userId?: number;
    description?: string;
  },
  acceptanceTokens: {
    acceptanceToken: string;
    acceptPersonalAuth: string;
  },
  // 💳 NUEVO: Datos de tarjeta opcionales para pago con tarjeta
  cardData?: {
    number: string;
    cvc: string;
    exp_month: string;
    exp_year: string;
    card_holder: string;
    installments: number;
  },
  // 🛒 NUEVO: Datos del carrito para creación de órdenes
  cartData?: Array<{
    product_id: number;
    quantity: number;
    price: number;
    name?: string;
    color_code?: string;
    size?: string;
  }>
): Promise<WompiTransactionResponse> => {
  try {
    console.log("🎯 Iniciando flujo completo de pago Wompi...");

    // Generar referencia única
    const reference = generatePaymentReference(orderData.userId);

    // Convertir monto a centavos
    const amountInCents = convertToCents(orderData.amount);

    // Preparar datos base de transacción
    const transactionData: WompiTransactionData = {
      acceptanceToken: acceptanceTokens.acceptanceToken,
      acceptPersonalAuth: acceptanceTokens.acceptPersonalAuth,
      customerEmail: customerData.email,
      customerName: customerData.name,
      customerPhone: customerData.phone,
      customerDocumentType: customerData.documentType,
      customerDocumentNumber: customerData.documentNumber,
      shippingAddress: customerData.shippingAddress,
      amount: amountInCents,
      currency: orderData.currency || "COP",
      reference,
      description: orderData.description || "Compra en NEOSALE",
      redirectUrl: `${window.location.origin}/checkout/success`,
      // 🛒 NUEVO: Incluir datos del carrito si están disponibles
      cartData: cartData,
    };

    // 💳 Si se proporcionan datos de tarjeta, tokenizar y agregar método de pago
    if (cardData) {
      console.log("💳 Procesando pago con tarjeta de crédito/débito...");

      // Obtener configuración pública para la llave pública
      const configResult = await getWompiPublicConfigApi();
      if (!configResult.success || !configResult.data) {
        throw new Error("No se pudo obtener la configuración pública de Wompi");
      }

      // Tokenizar la tarjeta
      const tokenResult = await tokenizeCardApi(
        {
          number: cardData.number,
          cvc: cardData.cvc,
          exp_month: cardData.exp_month,
          exp_year: cardData.exp_year,
          card_holder: cardData.card_holder,
        },
        configResult.data.publicKey
      );

      if (!tokenResult.success || !tokenResult.data) {
        throw new Error(tokenResult.error || "Error tokenizando tarjeta");
      }

      // Agregar método de pago a la transacción
      transactionData.payment_method = {
        type: "CARD",
        installments: cardData.installments,
        token: tokenResult.data.id,
      };
      transactionData.payment_method_type = "CARD";

      console.log("✅ Tarjeta tokenizada y método de pago configurado:", {
        tokenId: tokenResult.data.id,
        brand: tokenResult.data.brand,
        installments: cardData.installments,
      });
    }

    console.log("📋 Datos de transacción preparados:", {
      reference,
      amountInCents,
      currency: transactionData.currency,
      customerEmail: customerData.email,
      hasPaymentMethod: !!transactionData.payment_method,
      paymentMethodType: transactionData.payment_method_type,
    });

    // Crear transacción
    const result = await createWompiTransactionApi(
      transactionData,
      orderData.userId || 0
    );

    console.log("🎉 Flujo de pago completado exitosamente:", {
      transactionId: result.data?.transactionId,
      status: result.data?.status,
    });

    return result;
  } catch (error) {
    console.error("❌ Error en flujo completo de pago Wompi:", error);
    throw error;
  }
};

// 🆕 NUEVO: Obtener estado de transacción por ID
export const getWompiTransactionStatusApi = async (
  transactionId: string
): Promise<
  WompiApiResponse<{
    id: string;
    status: string;
    amount_in_cents: number;
    reference: string;
    customer_email: string;
    currency: string;
    payment_method: object;
    status_message?: string;
    created_at: string;
    finalized_at?: string;
    shipping_address?: object;
    redirect_url?: string;
    payment_link_id?: string;
    fullResponse: object;
  }>
> => {
  try {
    console.log("🔍 Consultando estado de transacción:", { transactionId });

    const { data: response } = await api.get<
      WompiApiResponse<{
        id: string;
        status: string;
        amount_in_cents: number;
        reference: string;
        customer_email: string;
        currency: string;
        payment_method: object;
        status_message?: string;
        created_at: string;
        finalized_at?: string;
        shipping_address?: object;
        redirect_url?: string;
        payment_link_id?: string;
        fullResponse: object;
      }>
    >(`/api/payments/transaction/${transactionId}`);

    if (!response.success) {
      throw new Error(
        response.error || "Error consultando estado de transacción"
      );
    }

    console.log("✅ Estado de transacción obtenido:", {
      transactionId,
      status: response.data?.status,
      amount: response.data?.amount_in_cents,
      reference: response.data?.reference,
    });

    return response;
  } catch (error: unknown) {
    console.error("❌ Error en getWompiTransactionStatusApi:", error);

    if (error && typeof error === "object" && "response" in error) {
      const apiError = error as {
        response: { data?: WompiApiResponse<unknown> };
      };
      if (apiError.response?.data) {
        throw apiError.response.data;
      }
    }

    throw {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error desconocido consultando estado",
    };
  }
};

// 🆕 NUEVO: Obtener payment desde base de datos
export const getPaymentFromDatabaseApi = async (
  transactionId: string
): Promise<WompiApiResponse<unknown>> => {
  try {
    console.log("📊 Consultando payment desde BD:", { transactionId });

    const { data: response } = await api.get<WompiApiResponse<unknown>>(
      `/api/payments/payment/db/${transactionId}`
    );

    if (!response.success) {
      throw new Error(
        response.error || "Error consultando payment desde base de datos"
      );
    }

    console.log("✅ Payment consultado desde BD:", response.data);

    return response;
  } catch (error: unknown) {
    console.error("❌ Error en getPaymentFromDatabaseApi:", error);

    if (error && typeof error === "object" && "response" in error) {
      const apiError = error as {
        response: { data?: WompiApiResponse<unknown> };
      };
      if (apiError.response?.data) {
        throw apiError.response.data;
      }
    }

    throw {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error desconocido consultando payment",
    };
  }
};

// 🆕 NUEVO: Crear orden desde payment
export const createOrderFromPaymentApi = async (orderData: {
  paymentId: number;
  shippingAddressId: number;
  couponId?: number;
}): Promise<
  WompiApiResponse<{
    order_id: number;
    payment_id: number;
    total_amount: number;
    success: boolean;
    message: string;
  }>
> => {
  try {
    console.log("🛒 Creando orden desde payment:", orderData);

    const { data: response } = await api.post<
      WompiApiResponse<{
        order_id: number;
        payment_id: number;
        total_amount: number;
        success: boolean;
        message: string;
      }>
    >("/api/payments/orders/create-from-payment", orderData);

    if (!response.success) {
      throw new Error(response.error || "Error creando orden desde payment");
    }

    console.log("✅ Orden creada desde payment:", response.data);

    return response;
  } catch (error: unknown) {
    console.error("❌ Error en createOrderFromPaymentApi:", error);

    if (error && typeof error === "object" && "response" in error) {
      const apiError = error as {
        response: { data?: WompiApiResponse<unknown> };
      };
      if (apiError.response?.data) {
        throw apiError.response.data;
      }
    }

    throw {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error desconocido creando orden",
    };
  }
};
