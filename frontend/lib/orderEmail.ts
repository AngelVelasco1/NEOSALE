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
    // 🚫 Verificar si los emails están desactivados en desarrollo
    if (process.env.DISABLE_EMAILS === 'true') {
      console.log('📧 [DEV] Email desactivado. Orden:', orderId, 'Email:', customerEmail);
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
    
    console.log('📧 Enviando email a:', customerEmail);
    console.log('📋 Orden ID:', orderId);
    
    const response = await mailerSend.email.send(emailParams);

    console.log('✅ Email enviado exitosamente');
    console.log('📨 Response:', JSON.stringify({
      statusCode: response.statusCode,
      messageId: response.body?.message_id,
      headers: response.headers
    }, null, 2));

    return {
      success: true,
      data: {
        messageId: response.body.message_id || response.headers?.['x-message-id'],
        orderId,
      },
    };
  } catch (error: any) {
    console.error('❌ Error al enviar email de confirmación de orden:');
    console.error('📋 Error completo:', JSON.stringify({
      statusCode: error?.statusCode,
      body: error?.body,
      message: error?.message,
      headers: error?.headers
    }, null, 2));
    
    // Si es error de límite de cuenta trial de MailerSend, no fallar
    const errorMessage = error?.body?.message || error?.message || '';
    if (errorMessage.includes('trial account') || errorMessage.includes('unique recipients limit') || errorMessage.includes('MS42225')) {
      console.warn('⚠️ Límite de MailerSend alcanzado (cuenta trial). Email no enviado pero orden creada exitosamente.');
      return {
        success: false,
        data: {
          messageId: null,
          orderId,
          warning: 'Email no enviado por límite de cuenta trial de MailerSend',
        },
      };
    }
    
    // Si es error 422 pero no es límite de trial, mostrar el error real
    if (error?.statusCode === 422) {
      console.error('❌ Error 422 de validación:', error?.body);
      console.error('💡 Verifica que el email del destinatario sea válido');
    }
    
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
    throw new Error(`Error al enviar email: ${error.message.errors || 'Error desconocido'}`);
  }
}
