import { MercadoPagoConfig, Payment } from 'mercadopago';

if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
  console.error('Error: MERCADO_PAGO_ACCESS_TOKEN no está definida en el archivo .env');
  process.exit(1);
}

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!
});

export const processCardPayment = async (data: {
  amount: number;
  email: string;
  installments: number;
  token: string;
}) => {
  const paymentClient = new Payment(mpClient);
  
  const payment = await paymentClient.create({
    body: {
      payer: {
        email: data.email,
      },
      token: data.token,
      transaction_amount: data.amount,
      installments: data.installments,
    },
  });

  return payment;
};

export default {
  mpClient,
  processCardPayment
};