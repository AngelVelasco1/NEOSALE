import { api } from '@/config/api';

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface SendOrderConfirmationEmailParams {
  customerEmail: string;
  customerName: string;
  orderId: string;
  orderDate: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  taxes: number;
  discount: number;
  total: number;
  shippingAddress: ShippingAddress;
  trackingUrl?: string;
}

const getAppBaseUrl = (): string => {
  return (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
};

/**
 * Envía un email de confirmación de orden al cliente
 * @param params - Datos de la orden y del cliente
 * @returns Promesa con el resultado del envío
 */
export async function sendOrderConfirmationEmail({
  customerEmail,
  customerName,
  orderId,
  orderDate,
  items,
  subtotal,
  shipping,
  taxes,
  discount,
  total,
  shippingAddress,
  trackingUrl,
}: SendOrderConfirmationEmailParams) {
  try {
    // 🚫 Verificar si los emails están desactivados en desarrollo
    if (process.env.DISABLE_EMAILS === 'true') {
      return {
        success: false,
        data: {
          messageId: null,
          orderId,
          warning: 'Emails desactivados en desarrollo (DISABLE_EMAILS=true)',
        },
      };
    }
    
    // Generar URL de seguimiento si no se proporciona
    const finalTrackingUrl = trackingUrl || `${getAppBaseUrl()}/orders/${orderId}`;
    
    // Llamar al backend para enviar el email
    const response = await api.post('api/emails/order-confirmation', {
      customerEmail,
      customerName,
      orderId,
      orderDate,
      items,
      subtotal,
      shipping,
      taxes,
      discount,
      total,
      shippingAddress,
      trackingUrl: finalTrackingUrl,
    });

    return response.data;
  } catch (error: any) {
    
    return {
      success: false,
      data: {
        messageId: null,
        orderId,
        warning: 'Email no enviado',
      },
    };
  }
}

/**
 * Envía un email de confirmación simplificado (sin detalles completos de items)
 * Útil cuando solo necesitas confirmar que se recibió la orden
 */
export async function sendSimpleOrderConfirmationEmail({
  customerEmail,
  customerName,
  orderId,
  total,
}: {
  customerEmail: string;
  customerName: string;
  orderId: string;
  total: number;
}) {
  try {
    const trackingUrl = `${getAppBaseUrl()}/orders`;

    const response = await api.post('api/emails/order-confirmation', {
      customerEmail,
      customerName,
      orderId,
      orderDate: new Date().toISOString(),
      items: [],
      subtotal: total,
      shipping: 0,
      taxes: 0,
      discount: 0,
      total,
      shippingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      trackingUrl,
    });

    return response.data;
  } catch (error: any) {
    
    throw new Error(`Error al enviar email: ${error.message || 'Error desconocido'}`);
  }
}
