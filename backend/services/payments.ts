// backend/services/payments.ts
import { MercadoPagoConfig, Payment } from 'mercadopago';

// ✅ Interfaces de tipos
interface PaymentData {
  amount: number;
  email: string;
  installments: number;
  token: string;
  identificationType?: string;
  identificationNumber?: string;
}

// ✅ Verificar credenciales antes de usar
const validateMPCredentials = () => {
  const token = process.env.MP_ACCESS_TOKEN
  
  if (!token) {
    throw new Error('❌ Access Token de MercadoPago no configurado');
  }
  
   
  return token;
};

export const processCardPayment = async (paymentData: PaymentData) => {
  try {
    // ✅ Validar credenciales antes de procesar
    const accessToken = validateMPCredentials();
    
    const client = new MercadoPagoConfig({
      accessToken,
      options: {
        timeout: 5000,
        integratorId: 'dev_24c65fb163bf11ea96500242ac130004'
      }
    });

    const payment = new Payment(client);

    // ✅ Configurar payload del pago con datos completos
    const paymentPayload: any = {
      transaction_amount: paymentData.amount,
      token: paymentData.token,
      description: 'Compra en NEOCOMMERCE',
      installments: paymentData.installments,
      // ✅ Remover payment_method_id para que MercadoPago lo detecte automáticamente del token
      payer: {
        email: paymentData.email,
      },
      // ✅ Configuraciones adicionales para mejorar aprobación
      additional_info: {
        ip_address: "127.0.0.1", // En producción, obtener IP real del request
        items: [
          {
            id: "item-ID-1234",
            title: "Compra en NEOCOMMERCE",
            category_id: "others",
            quantity: 1,
            unit_price: paymentData.amount
          }
        ]
      },
      // ✅ Referencia externa para tracking
      external_reference: `NEOC-${Date.now()}`,
      // ✅ Configuración para testing
      binary_mode: false,
      capture: true
    };

    // ✅ Solo agregar identificación si se proporcionan los datos
    if (paymentData.identificationType && paymentData.identificationNumber) {
      paymentPayload.payer.identification = {
        type: paymentData.identificationType,
        number: paymentData.identificationNumber
      };
    }

    console.log('💳 Procesando pago con MercadoPago:', {
      amount: paymentData.amount,
      email: paymentData.email,
      installments: paymentData.installments,
      identification: paymentData.identificationType,
      hasIdentificationNumber: !!paymentData.identificationNumber
    });

    const result = await payment.create({
      body: paymentPayload
    });

    console.log('✅ Respuesta de MercadoPago:', {
      id: result.id,
      status: result.status,
      status_detail: result.status_detail,
      payment_method_id: result.payment_method_id
    });

    return result;

  } catch (error: any) {
    console.error('❌ Error en processCardPayment:', error);
    
    // ✅ Mejorar manejo de errores específicos de MercadoPago
    if (error.cause && Array.isArray(error.cause)) {
      const mpError = error.cause[0];
      throw new Error(`Error de MercadoPago: ${mpError.description || mpError.message}`);
    }
    
    if (error.status) {
      switch (error.status) {
        case 400:
          throw new Error('Datos de pago inválidos. Verifica la información de tu tarjeta.');
        case 401:
          throw new Error('Error de autenticación con MercadoPago.');
        case 403:
          throw new Error('Operación no permitida.');
        case 404:
          throw new Error('Método de pago no encontrado.');
        default:
          throw new Error(`Error de MercadoPago (${error.status}): ${error.message}`);
      }
    }
    
    throw error;
  }
};