import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import { getCartService } from "./cart";
import {
  adjustAmountForTesting,
  analyzePaymentError,
  getPaymentErrorMessage,
} from "../utils/paymentTestUtils";

// ✅ Interfaces de tipos
interface PaymentData {
  user_id: number;
  amount: number;
  email: string;
  installments: number;
  token: string;
  identificationType?: string;
  identificationNumber?: string;
}

interface PreferenceData {
  title: string;
  quantity: number;
  unit_price: number;
  currency_id?: string;
  payer_email?: string;
  external_reference?: string;
}

interface PaymentStatusData {
  payment_id: string;
}

const validateMPCredentials = () => {
  const token = process.env.MP_ACCESS_TOKEN;

  if (!token) {
    throw new Error("Access Token de MercadoPago no configurado");
  }

  return token;
};

// ✅ Servicio principal de procesamiento de pagos
export const processCardPayment = async (
  paymentData: PaymentData
): Promise<any> => {
  try {
    // 🛡️ LIMITE DE PRUEBA: Ajustar montos automáticamente
    const adjustedAmount = adjustAmountForTesting(paymentData.amount);

    console.log("🔄 Iniciando procesamiento de pago con Checkout API:", {
      originalAmount: paymentData.amount,
      adjustedAmount: adjustedAmount,
      email: paymentData.email,
      user_id: paymentData.user_id,
      hasToken: !!paymentData.token,
      tokenLength: paymentData.token?.length || 0,
      tokenPreview: paymentData.token
        ? `${paymentData.token.substring(0, 8)}...`
        : "NO_TOKEN",
      installments: paymentData.installments,
      identificationType: paymentData.identificationType || "No especificado",
      hasIdentification: !!paymentData.identificationNumber,
      isTestEnvironment: process.env.NODE_ENV === "development",
    });

    // ✅ Validar datos esenciales
    if (!paymentData.user_id) {
      throw new Error("ID de usuario requerido para procesar el pago");
    }

    if (!paymentData.amount || paymentData.amount <= 0) {
      throw new Error("Monto inválido para procesar el pago");
    }

    if (!paymentData.token) {
      throw new Error("Token de tarjeta requerido para procesar el pago");
    }

    if (!paymentData.email) {
      throw new Error("Email es requerido para procesar el pago");
    }

    const accessToken = validateMPCredentials();

    const client = new MercadoPagoConfig({
      accessToken,
      options: {
        timeout: 10000,
        integratorId: "dev_24c65fb163bf11ea96500242ac130004",
      },
    });

    // Obtener items del carrito para información adicional
    const cartItems = await getCartService(paymentData.user_id);
    const mpItems = cartItems.map((item: any) => ({
      id: item.id?.toString() || "unknown",
      title: `${item.name}${item.color_code ? ` (${item.color_code})` : ""}${
        item.size ? ` - ${item.size}` : ""
      }`,
      category_id: item.category || "others",
      quantity: item.quantity,
      unit_price: Number(item.price || 0),
      description:
        item.description ||
        `${item.name} - Color: ${item.color_code || "N/A"} - Talla: ${
          item.size || "N/A"
        }`,
      picture_url: item.image_url || undefined,
    }));

    const payment = new Payment(client);

    // Construir el payload base
    const paymentPayload: any = {
      transaction_amount: adjustedAmount,
      token: paymentData.token,
      description: `Pedido NEOCOMMERCE - ${Date.now()}`,
      installments: paymentData.installments,
      payer: {
        email: paymentData.email,
      },
      additional_info: {
        items: mpItems,
      },
      external_reference: `NEOC-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      binary_mode: false,
      capture: true,
    };

    // ✅ Agregar información de identificación si está disponible
    if (paymentData.identificationType && paymentData.identificationNumber) {
      paymentPayload.payer.identification = {
        type: paymentData.identificationType,
        number: paymentData.identificationNumber,
      };
    }

    console.log(
      "📤 Payload completo a MercadoPago:",
      JSON.stringify(paymentPayload, null, 2)
    );

    const result = await payment.create({
      body: paymentPayload,
    });

    console.log("✅ Respuesta de MercadoPago:", {
      id: result.id,
      status: result.status,
      status_detail: result.status_detail,
      payment_method_id: result.payment_method_id,
      transaction_amount: result.transaction_amount,
      originalAmount: paymentData.amount,
      wasAmountAdjusted: adjustedAmount !== paymentData.amount,
    });

    // 🔍 Analizar error específico si el pago fue rechazado
    if (result.status === "rejected") {
      const errorAnalysis = analyzePaymentError(
        result.status,
        result.status_detail || ""
      );
      const userMessage = getPaymentErrorMessage(result.status_detail || "");

      console.warn("❌ Pago rechazado:", {
        status_detail: result.status_detail,
        isRateLimit: errorAnalysis.isRateLimit,
        suggestedAmount: errorAnalysis.suggestedAmount,
        canRetry: errorAnalysis.canRetry,
      });

      // Lanzar error con mensaje específico para el frontend
      throw new Error(userMessage);
    }

    return result;
  } catch (error: unknown) {
    console.error("Error en processCardPayment:", error);
    console.error("Error type:", typeof error);
    console.error(
      "Error keys:",
      error && typeof error === "object" ? Object.keys(error) : "N/A"
    );

    if (
      error &&
      typeof error === "object" &&
      "cause" in error &&
      Array.isArray(error.cause) &&
      error.cause.length > 0
    ) {
      const mpError = error.cause[0];
      const errorMessage =
        mpError?.description ||
        mpError?.message ||
        "Error de MercadoPago desconocido";
      throw new Error(`Error de MercadoPago: ${errorMessage}`);
    }

    if (error && typeof error === "object" && "status" in error) {
      const statusError = error as { status: number; message?: string };
      switch (statusError.status) {
        case 400:
          throw new Error(
            "Datos de pago inválidos. Verifica la información de tu tarjeta."
          );
        case 401:
          throw new Error("Error de autenticación con MercadoPago.");
        case 403:
          throw new Error("Operación no permitida.");
        case 404:
          throw new Error("Método de pago no encontrado.");
        default:
          throw new Error(
            `Error de MercadoPago (${statusError.status}): ${
              statusError.message || "Error desconocido"
            }`
          );
      }
    }

    // Manejo genérico de errores
    if (error instanceof Error) {
      throw error;
    }

    // Último recurso para errores desconocidos
    throw new Error(
      `Error desconocido en el procesamiento del pago: ${String(error)}`
    );
  }
};

// ✅ Servicio para procesar webhook
export const processWebhook = async (webhookData: any): Promise<void> => {
  try {
    console.log("📬 Procesando webhook de MercadoPago:", {
      id: webhookData.id,
      live_mode: webhookData.live_mode,
      type: webhookData.type,
      date_created: webhookData.date_created,
      application_id: webhookData.application_id,
      user_id: webhookData.user_id,
      version: webhookData.version,
      api_version: webhookData.api_version,
      action: webhookData.action,
      data: webhookData.data,
    });

    // Aquí puedes agregar lógica para procesar diferentes tipos de webhook
    switch (webhookData.type) {
      case "payment":
        console.log("💳 Webhook de pago recibido");
        // Procesar actualización de pago
        break;
      case "subscription":
        console.log("� Webhook de suscripción recibido");
        // Procesar actualización de suscripción
        break;
      default:
        console.log(`📋 Webhook de tipo ${webhookData.type} recibido`);
    }
  } catch (error: unknown) {
    console.error("Error procesando webhook:", error);
    throw new Error(
      `Error procesando webhook: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

// ✅ Servicio para consultar estado de pago
export const getPaymentDetails = async (paymentId: string): Promise<any> => {
  try {
    const accessToken = validateMPCredentials();

    const client = new MercadoPagoConfig({
      accessToken,
      options: {
        timeout: 10000,
        integratorId: "dev_24c65fb163bf11ea96500242ac130004",
      },
    });

    const payment = new Payment(client);

    console.log(`🔍 Consultando pago ID: ${paymentId}`);

    const result = await payment.get({
      id: paymentId,
    });

    console.log("✅ Detalles del pago obtenidos:", {
      id: result.id,
      status: result.status,
      status_detail: result.status_detail,
      transaction_amount: result.transaction_amount,
    });

    return result;
  } catch (error: unknown) {
    console.error(`Error consultando pago ${paymentId}:`, error);
    throw new Error(
      `Error consultando estado del pago: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

// ✅ Servicio para crear preferencias de pago
export const createPaymentPreference = async (preferenceData: {
  title: string;
  quantity: number;
  unit_price: number;
  currency_id?: string;
}): Promise<any> => {
  try {
    const accessToken = validateMPCredentials();

    const client = new MercadoPagoConfig({
      accessToken,
      options: {
        timeout: 10000,
        integratorId: "dev_24c65fb163bf11ea96500242ac130004",
      },
    });

    const preference = new Preference(client);

    const preferencePayload = {
      items: [
        {
          id: `item-${Date.now()}`,
          title: preferenceData.title,
          quantity: preferenceData.quantity,
          unit_price: preferenceData.unit_price,
          currency_id: preferenceData.currency_id || "COP",
        },
      ],
      external_reference: `PREF-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      back_urls: {
        success: `${process.env.BACKEND_URL}/api/payments/success`,
        failure: `${process.env.BACKEND_URL}/api/payments/failure`,
        pending: `${process.env.BACKEND_URL}/api/payments/pending`,
      },
      auto_return: "approved",
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12,
      },
    };

    console.log(
      "� Creando preferencia de pago:",
      JSON.stringify(preferencePayload, null, 2)
    );

    const result = await preference.create({
      body: preferencePayload,
    });

    console.log("✅ Preferencia creada:", {
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
    });

    return result;
  } catch (error: unknown) {
    console.error("Error creando preferencia:", error);
    throw new Error(
      `Error creando preferencia de pago: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

// ✅ Servicio para consultar preferencias de pago
export const getPreferenceDetails = async (preferenceId: string) => {
  try {
    const accessToken = validateMPCredentials();

    const client = new MercadoPagoConfig({
      accessToken,
      options: {
        timeout: 10000,
        integratorId: "dev_24c65fb163bf11ea96500242ac130004",
      },
    });

    const preference = new Preference(client);

    console.log(`🔍 Consultando preferencia ID: ${preferenceId}`);

    const result = await preference.get({
      preferenceId: preferenceId,
    });

    console.log("✅ Detalles de la preferencia obtenidos:", {
      id: result.id,
      external_reference: result.external_reference,
      items_count: result.items?.length || 0,
      init_point: result.init_point,
    });

    return result;
  } catch (error: unknown) {
    console.error(`Error consultando preferencia ${preferenceId}:`, error);
    throw new Error(
      `Error consultando preferencia: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};
