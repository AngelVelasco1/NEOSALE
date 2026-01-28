import { render } from '@react-email/render';
import { EmailParams, Recipient, Sender } from 'mailersend';
import { OrderConfirmationEmailTemplate } from '@/app/components/OrderConfirmationEmailTemplate';
import { getMailerSend } from './mailersend';

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
    // Generar URL de seguimiento si no se proporciona
    const finalTrackingUrl = trackingUrl || `${getAppBaseUrl()}/orders/${orderId}`;

    // Renderizar el template HTML
    const htmlContent = await render(
      OrderConfirmationEmailTemplate({
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
      })
    );

    // Crear texto plano como alternativa
    const textContent = `
¡Pedido Confirmado!

Hola ${customerName},

Tu pedido #${orderId} ha sido confirmado exitosamente.
Fecha: ${orderDate}

Resumen de tu pedido:
${items.map(item => `- ${item.productName} (x${item.quantity}): $${(item.price * item.quantity).toLocaleString()}`).join('\n')}

Subtotal: $${subtotal.toLocaleString()}
${discount > 0 ? `Descuento: -$${discount.toLocaleString()}` : ''}
Envío: $${shipping.toLocaleString()}
Impuestos: $${taxes.toLocaleString()}
Total: $${total.toLocaleString()}

Dirección de envío:
${shippingAddress.street}
${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}
${shippingAddress.country}

Puedes seguir tu pedido en: ${finalTrackingUrl}

Gracias por tu compra,
Equipo NEOSALE
    `.trim();

    // Configurar el email
    const sentFrom = new Sender('noreply@test-r9084zv1368gw63d.mlsender.net', 'NEOSALE');
    const recipients = [new Recipient(customerEmail, customerName)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(`Pedido confirmado #${orderId} - NEOSALE`)
      .setText(textContent)
      .setHtml(htmlContent);

    // Enviar email usando MailerSend
    const mailerSend = getMailerSend();
    const response = await mailerSend.email.send(emailParams);


    return {
      success: true,
      data: {
        messageId: response.body.message_id || response.headers?.['x-message-id'],
        orderId,
      },
    };
  } catch (error: any) {
    console.error('❌ Error al enviar email de confirmación de orden:', error);
    throw new Error(`Error al enviar email de confirmación: ${error.message || 'Error desconocido'}`);
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

    const textContent = `
Hola ${customerName},

¡Tu pedido #${orderId} ha sido confirmado!

Total: $${total.toLocaleString()}

Puedes ver los detalles completos en: ${trackingUrl}

Gracias por tu compra,
Equipo NEOSALE
    `.trim();

    const sentFrom = new Sender('noreply@test-r9084zv1368gw63d.mlsender.net', 'NEOSALE');
    const recipients = [new Recipient(customerEmail, customerName)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(`Pedido confirmado #${orderId} - NEOSALE`)
      .setText(textContent);

    const mailerSend = getMailerSend();
    const response = await mailerSend.email.send(emailParams);


    return {
      success: true,
      data: {
        messageId: response.body.message_id || response.headers?.['x-message-id'],
      },
    };
  } catch (error: any) {
    console.error('❌ Error al enviar email simple de confirmación:', error);
    throw new Error(`Error al enviar email: ${error.message || 'Error desconocido'}`);
  }
}
