import { api } from '../../../../config/api';

export const processCardPaymentApi = async (data: {
  amount: number;
  email: string;
  installments: number;
  token: string;
  identificationType?: string;
  identificationNumber?: string;
}) => {
  try {
    console.log('📤 Enviando datos de pago al backend:', {
      amount: data.amount,
      email: data.email,
      installments: data.installments,
      hasToken: !!data.token,
      identificationType: data.identificationType,
      hasIdentification: !!data.identificationNumber
    });

    const { data: response } = await api.post('/api/payments/addPayment', data);
    
    console.log('📥 Respuesta del backend:', response);
    return response;
  } catch (error: any) {
    console.error('❌ Error en API de pagos:', error);
    throw error;
  }
};