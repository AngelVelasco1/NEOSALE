import { MercadoPagoConfig, Payment } from "mercadopago";
import { getCartService } from "./cart";


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

const validateMPCredentials = () => {
  const token = process.env.MP_ACCESS_TOKEN;

  if (!token) {
    throw new Error("Access Token de MercadoPago no configurado");
  }

  return token;
};

export const processCardPayment = async (paymentData: PaymentData) => {
  try {
    console.log("🔄 Iniciando procesamiento de pago:", {
      amount: paymentData.amount,
      email: paymentData.email,
      user_id: paymentData.user_id,
      hasToken: !!paymentData.token
    });

    // ✅ Validar datos esenciales
    if (!paymentData.user_id) {
      throw new Error('ID de usuario requerido para procesar el pago');
    }

    if (!paymentData.amount || paymentData.amount <= 0) {
      throw new Error('Monto inválido para procesar el pago');
    }

    if (!paymentData.token) {
      throw new Error('Token de tarjeta requerido para procesar el pago');
    }

    const accessToken = validateMPCredentials();

    const client = new MercadoPagoConfig({
      accessToken,
      options: {
        timeout: 10000,
        integratorId: "dev_24c65fb163bf11ea96500242ac130004",
      },
    });

    const cartItems = await getCartService(paymentData.user_id);
     const mpItems = cartItems.map((item: any) => ({
      id: item.productId?.toString() || item.id?.toString(),
      title: item.product?.name || item.name || 'Producto',
      category_id: item.product?.category || 'others',
      quantity: item.quantity,
      unit_price: item.product?.price || item.price || 0,
      description: item.product?.description || ''
    }));
    
    const payment = new Payment(client);

    // ✅ NO manipular el amount - usar directamente
    const paymentPayload: any = {
      transaction_amount: paymentData.amount, // ✅ Usar amount directamente sin manipulación
      token: paymentData.token,
      description: `Pedido NEOCOMMERCE - ${Date.now()}`,
      installments: paymentData.installments || 1,
      payer: {
        email: paymentData.email,
      } as any,
      additional_info: {
        ip_address: "127.0.0.1",
        items: [
          ...mpItems
        ],
      },
      external_reference: `NEOC-${Date.now()}-${Math.random()
        .toString(36)
        }`,
      binary_mode: false,
      capture: true,
    };

    console.log(" AMOUNT DEBUG:", {
      original_amount: paymentData.amount,
      amount_type: typeof paymentData.amount,
      transaction_amount: paymentPayload.transaction_amount,
      transaction_amount_type: typeof paymentPayload.transaction_amount
    });

    if (paymentData.identificationType && paymentData.identificationNumber) {
      paymentPayload.payer.identification = {
        type: paymentData.identificationType,
        number: paymentData.identificationNumber,
      };
    }

    console.log("📤 Payload completo a MercadoPago:", JSON.stringify(paymentPayload, null, 2));

    const result = await payment.create({
      body: paymentPayload,
    });

    console.log("✅ Respuesta de MercadoPago:", {
      id: result.id,
      status: result.status,
      status_detail: result.status_detail,
      payment_method_id: result.payment_method_id,
      paymentData: paymentPayload.additional_info.items,
      userId: paymentData.user_id
    });

    return result;
  } catch (error: any) {
    console.error("Error en processCardPayment:", error);

    // ✅ Mejorar manejo de errores específicos de MercadoPago
    if (error.cause && Array.isArray(error.cause)) {
      const mpError = error.cause[0];
      throw new Error(
        `Error de MercadoPago: ${mpError.description || mpError.message}`
      );
    }

    if (error.status) {
      switch (error.status) {
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
            `Error de MercadoPago (${error.status}): ${error.message}`
          );
      }
    }

    throw error;
  }
};
