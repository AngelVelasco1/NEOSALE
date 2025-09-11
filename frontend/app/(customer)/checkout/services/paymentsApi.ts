import { api } from '@/config/api';

export const processCardPaymentApi = async (data: {
  amount: number;
  email: string;
  installments: number;
  token: string;
}) => {
  const { data: response } = await api.post('/api/payments/addPayment', data);
  return response;
};