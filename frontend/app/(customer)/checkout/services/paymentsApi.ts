import { api } from '../../../../config/api';

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

export const processCardPaymentApi = async (data: PaymentData): Promise<PaymentResponse> => {
  try {
    console.log('🚀 Enviando datos de pago a la API:', {
      amount: data.amount,
      email: data.email,
      installments: data.installments,
      hasToken: !!data.token,
      user_id: data.user_id
    });

    const { data: response } = await api.post<PaymentResponse>('/api/payments/addPayment', data);
    
    return response;
  } catch (error: unknown) {
    console.error('Error en API de pagos:', error);
    
    // Manejo mejorado de errores
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as { response: { data?: PaymentResponse } };
      if (apiError.response?.data) {
        throw apiError.response.data;
      }
    }
    
    throw error;
  }
};