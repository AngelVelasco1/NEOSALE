import { Payment, Preference } from "mercadopago";
import { getCartService } from "./cart";
import { createMPClient } from "../config/credentials";
import {
  adjustAmountForTesting,
  analyzePaymentError,
  getPaymentErrorMessage,
} from "../utils/paymentTestUtils";

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
  items?: Array<{
    id: string;
    title: string;
    description?: string;
    quantity: number;
    unit_price: number;
  }>;
}

interface WebhookData {
  id: string;
  live_mode: boolean;
  type: string;
  date_created: string;
  application_id: string;
  user_id: string;
  version: string;
  api_version: string;
  action: string;
  data: any;
}

export const processCardPaymentService = async (
  paymentData: PaymentData
): Promise<any> => {
  try {
    const adjustedAmount = adjustAmountForTesting(paymentData.amount);

    console.log("Iniciando proceso de pago:", {
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

    const client = createMPClient();
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

    if (paymentData.identificationType && paymentData.identificationNumber) {
      paymentPayload.payer.identification = {
        type: paymentData.identificationType,
        number: paymentData.identificationNumber,
      };
    }

    const result = await payment.create({
      body: paymentPayload,
    });

    console.log("Respuesta de MercadoPago:", {
      id: result.id,
      status: result.status,
      status_detail: result.status_detail,
      payment_method_id: result.payment_method_id,
      transaction_amount: result.transaction_amount,
      originalAmount: paymentData.amount,
      wasAmountAdjusted: adjustedAmount !== paymentData.amount,
    });

    if (result.status === "rejected") {
      const errorAnalysis = analyzePaymentError(
        result.status,
        result.status_detail || ""
      );
      const userMessage = getPaymentErrorMessage(result.status_detail || "");

      console.warn("Pago rechazado:", {
        status_detail: result.status_detail,
        isRateLimit: errorAnalysis.isRateLimit,
        suggestedAmount: errorAnalysis.suggestedAmount,
        canRetry: errorAnalysis.canRetry,
      });
      throw new Error(userMessage);
    }

    return result;
  } catch (error: unknown) {
    console.error("Error en processCardPayment:", error);
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
    throw new Error(
      `Error desconocido en el procesamiento del pago: ${String(error)}`
    );
  }
};

export const processWebhookService = async (
  webhookData: WebhookData
): Promise<void> => {
  try {
    console.log("Procesando webhook de MercadoPago:", {
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
  } catch (error: unknown) {
    console.error("Error procesando webhook:", error);
    throw new Error(
      `Error procesando webhook: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const getPaymentDetailsService = async (
  paymentId: string
): Promise<any> => {
  try {
    const client = createMPClient();
    const payment = new Payment(client);

    console.log(`Consultando pago ID: ${paymentId}`);

    const result = await payment.get({
      id: paymentId,
    });

    console.log("Detalles del pago obtenidos:", {
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

export const createPaymentPreferenceService = async (
  preferenceData: PreferenceData
): Promise<any> => {
  try {
    const client = createMPClient();
    const preference = new Preference(client);

    const preferencePayload = {
      items: preferenceData.items?.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        quantity: item.quantity,
        currency_id: "COP",
        unit_price: item.unit_price,
      })) || [
        {
          id: `item-${Date.now()}`,
          title: preferenceData.title,
          quantity: preferenceData.quantity,
          unit_price: preferenceData.unit_price,
          currency_id: "COP",
        },
      ],
      back_urls: {
        success: `${process.env.BACKEND_URL}/api/payments/success`,
        failure: `${process.env.BACKEND_URL}/api/payments/failure`,
        pending: `${process.env.BACKEND_URL}/api/payments/pending`,
      },
      auto_return: "approved",
      external_reference:
        preferenceData.external_reference ||
        `PREF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      notification_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
      statement_descriptor: "MI TIENDA",
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ).toISOString(),
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12,
      },
      payer: preferenceData.payer_email
        ? {
            email: preferenceData.payer_email,
          }
        : undefined,
    };

    const result = await preference.create({
      body: preferencePayload,
    });

    console.log("Preferencia creada:", {
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

export const getPreferenceService = async (
  preferenceId: string
): Promise<any> => {
  try {
    const client = createMPClient();
    const preference = new Preference(client);

    const result = await preference.get({
      preferenceId: preferenceId,
    });

    console.log("Detalles de la preferencia obtenidos:", {
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
