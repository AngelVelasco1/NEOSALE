import { api } from '../../../../config/api';

export const processCardPaymentApi = async (data: {
  amount: number;
  email: string;
  installments: number;
  token: string;
  user_id: number;
  identificationType?: string;
  identificationNumber?: string;
}) => {
  try {
  

    const { data: response } = await api.post('/api/payments/addPayment', data);
    
    return response;
  } catch (error: any) {
    console.error('Error en API de pagos:', error);
    throw error;
  }
};