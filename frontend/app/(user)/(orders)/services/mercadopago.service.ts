// API service for MercadoPago integration
import { api } from '@/config/api';

// Types for payment information
export interface PaymentCardInfo {
  token: string;
  transaction_amount: number;
  installments: number;
  payment_method_id: string;
  issuer_id?: string;
  payer: {
    email: string;
    identification: {
      type: string;
      number: string;
    }
  };
  description: string;
  order_id?: number | string;
}

export interface PaymentPreferenceItem {
  id: string;
  title: string;
  description?: string;
  picture_url?: string;
  category_id?: string;
  quantity: number;
  currency_id: string;
  unit_price: number;
}

export interface PaymentPreferenceRequest {
  items: PaymentPreferenceItem[];
  user: {
    id: number;
    email: string;
    name: string;
  };
  shipping_address?: any;
  back_urls?: {
    success: string;
    failure: string;
    pending: string;
  };
  notification_url?: string;
}

export interface PaymentPreferenceResponse {
  id: string;
  init_point: string;
  order_id: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  payment_type_id: string;
  status: string;
  thumbnail: string;
  secure_thumbnail: string;
}

// Create payment preference for checkout
export const createPreferenceApi = async (data: PaymentPreferenceRequest): Promise<PaymentPreferenceResponse> => {
  const { data: responseData } = await api.post('/api/payments/create-preference', data);
  return responseData;
};

// Process a card payment directly
export const processCardPaymentApi = async (paymentInfo: PaymentCardInfo): Promise<any> => {
  const { data } = await api.post('/api/payments/process-card', paymentInfo);
  return data;
};

// Get payment status
export const getPaymentStatusApi = async (paymentId: string): Promise<any> => {
  const { data } = await api.get(`/api/payments/${paymentId}`);
  return data;
};

// Get available payment methods
export const getPaymentMethodsApi = async (): Promise<PaymentMethod[]> => {
  const { data } = await api.get('/api/payments/payment-methods');
  return data;
};

// Request a refund
export const refundPaymentApi = async (paymentId: string): Promise<any> => {
  const { data } = await api.post(`/api/payments/${paymentId}/refund`);
  return data;
};
