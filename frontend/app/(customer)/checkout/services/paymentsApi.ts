import { api } from "../../../../config/api";

// Interfaz simplificada para Checkout Bricks
export interface PaymentData {
  amount: number;
  email: string;
  installments: number;
  token: string;
  user_id: number;
}

export interface PaymentResponse {
  success: boolean;
  payment?: {
    id: string;
    status: string;
    status_detail?: string;
    payment_method_id?: string;
  };
  message?: string;
  error?: string;
}

export interface PreferenceData {
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

export interface PreferenceResponse {
  success: boolean;
  data?: {
    id: string;
    init_point: string;
    sandbox_init_point: string;
    items: Array<{
      title: string;
      quantity: number;
      unit_price: number;
      currency_id: string;
    }>;
  };
  message?: string;
  error?: string;
}

export const processCardPaymentApi = async (
  data: PaymentData
): Promise<PaymentResponse> => {
  try {
    console.log("Enviando datos de pago a la API:", {
      amount: data.amount,
      email: data.email,
      installments: data.installments,
      hasToken: !!data.token,
      user_id: data.user_id,
    });

    const { data: response } = await api.post<PaymentResponse>(
      "/api/payments/addPayment",
      data
    );

    return response;
  } catch (error: unknown) {
    console.error("Error en API de pagos:", error);

    // Manejo mejorado de errores
    if (error && typeof error === "object" && "response" in error) {
      const apiError = error as { response: { data?: PaymentResponse } };
      if (apiError.response?.data) {
        throw apiError.response.data;
      }
    }

    throw error;
  }
};

export const createPreferenceApi = async (
  data: PreferenceData
): Promise<PreferenceResponse> => {
  try {
    console.log("🛒 Enviando datos de preferencia a la API:", {
      title: data.title,
      quantity: data.quantity,
      unit_price: data.unit_price,
      currency_id: data.currency_id || "COP",
      payer_email: data.payer_email,
      external_reference: data.external_reference,
      items_count: data.items?.length || 0,
    });

    const { data: response } = await api.post<PreferenceResponse>(
      "/api/payments/create-preference",
      data
    );

    return response;
  } catch (error: unknown) {
    console.error("Error en API de preferencias:", error);

    if (error && typeof error === "object" && "response" in error) {
      const apiError = error as { response: { data?: PreferenceResponse } };
      if (apiError.response?.data) {
        throw apiError.response.data;
      }
    }

    throw error;
  }
};
