import { sendEmail } from '../lib/mailgun.js';

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

interface SendPasswordResetEmailParams {
  email: string;
  name: string;
  resetUrl: string;
  expiresInMinutes: number;
}

interface SendVerificationEmailParams {
  email: string;
  name: string;
  verificationUrl: string;
}

const EMAIL_FROM = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@neosale.com';
const STORE_NAME = process.env.STORE_NAME || 'NEOSALE';

export async function sendOrderConfirmationEmail(params: SendOrderConfirmationEmailParams) {
  const {
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
  } = params;

  try {
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

${trackingUrl ? `Puedes seguir tu pedido en: ${trackingUrl}` : ''}

Gracias por tu compra,
Equipo ${STORE_NAME}
    `.trim();

    // HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .order-item { padding: 10px; border-bottom: 1px solid #ddd; }
            .totals { margin-top: 20px; padding: 15px; background: white; }
            .total-row { display: flex; justify-content: space-between; padding: 5px 0; }
            .total-final { font-weight: bold; font-size: 1.2em; border-top: 2px solid #4CAF50; }
            .button { display: inline-block; padding: 12px 24px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .address { background: white; padding: 15px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Pedido Confirmado!</h1>
            </div>
            <div class="content">
              <p>Hola ${customerName},</p>
              <p>Tu pedido <strong>#${orderId}</strong> ha sido confirmado exitosamente.</p>
              <p>Fecha: ${orderDate}</p>
              
              <h3>Resumen de tu pedido:</h3>
              ${items.map(item => `
                <div class="order-item">
                  <strong>${item.productName}</strong> (x${item.quantity}): $${(item.price * item.quantity).toLocaleString()}
                </div>
              `).join('')}
              
              <div class="totals">
                <div class="total-row">
                  <span>Subtotal:</span>
                  <span>$${subtotal.toLocaleString()}</span>
                </div>
                ${discount > 0 ? `
                  <div class="total-row">
                    <span>Descuento:</span>
                    <span>-$${discount.toLocaleString()}</span>
                  </div>
                ` : ''}
                <div class="total-row">
                  <span>Envío:</span>
                  <span>$${shipping.toLocaleString()}</span>
                </div>
                <div class="total-row">
                  <span>Impuestos:</span>
                  <span>$${taxes.toLocaleString()}</span>
                </div>
                <div class="total-row total-final">
                  <span>Total:</span>
                  <span>$${total.toLocaleString()}</span>
                </div>
              </div>
              
              <div class="address">
                <h4>Dirección de envío:</h4>
                <p>
                  ${shippingAddress.street}<br>
                  ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}<br>
                  ${shippingAddress.country}
                </p>
              </div>
              
              ${trackingUrl ? `
                <div style="text-align: center;">
                  <a href="${trackingUrl}" class="button">Seguir mi pedido</a>
                </div>
              ` : ''}
              
              <p>Gracias por tu compra,<br><strong>Equipo ${STORE_NAME}</strong></p>
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await sendEmail({
      from: `${STORE_NAME} <${EMAIL_FROM}>`,
      to: [customerEmail],
      subject: `Pedido confirmado #${orderId} - ${STORE_NAME}`,
      text: textContent,
      html: htmlContent,
    });

    return {
      success: true,
      data: {
        messageId: result.data?.id,
        orderId,
      },
    };
  } catch (error: any) {
    console.error('❌ Error al enviar email de confirmación de orden:', error);
    return {
      success: false,
      error: error.message,
      data: {
        messageId: null,
        orderId,
        warning: 'Email no enviado',
      },
    };
  }
}

export async function sendPasswordResetEmail(params: SendPasswordResetEmailParams) {
  const { email, name, resetUrl, expiresInMinutes } = params;

  try {
    const textContent = `
Hola ${name},

Recibimos una solicitud para restablecer tu contraseña en ${STORE_NAME}.

Abre este enlace para continuar: ${resetUrl}

El enlace caduca en ${expiresInMinutes} minutos.

Si no hiciste esta solicitud, puedes ignorar este mensaje.

Equipo ${STORE_NAME}
    `.trim();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #FF9800; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #FF9800; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Restablece tu contraseña</h1>
            </div>
            <div class="content">
              <p>Hola ${name},</p>
              <p>Recibimos una solicitud para restablecer tu contraseña en ${STORE_NAME}.</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Restablecer contraseña</a>
              </div>
              
              <div class="warning">
                <p><strong>⏰ Este enlace caduca en ${expiresInMinutes} minutos.</strong></p>
              </div>
              
              <p>Si no hiciste esta solicitud, puedes ignorar este mensaje con seguridad.</p>
              
              <p>Saludos,<br><strong>Equipo ${STORE_NAME}</strong></p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendEmail({
      from: `${STORE_NAME} <${EMAIL_FROM}>`,
      to: [email],
      subject: `Restablece tu contraseña - ${STORE_NAME}`,
      text: textContent,
      html: htmlContent,
    });

    return { success: true, message: 'Email sent successfully' };
  } catch (error: any) {
    console.error('Failed to send password reset email:', error);
    throw new Error('No pudimos enviar el correo de restablecimiento');
  }
}

export async function sendVerificationEmail(params: SendVerificationEmailParams) {
  const { email, name, verificationUrl } = params;

  try {
    const textContent = `
Hola ${name},

Bienvenido a ${STORE_NAME}!

Por favor verifica tu correo electrónico haciendo clic en el siguiente enlace:
${verificationUrl}

Si no creaste una cuenta en ${STORE_NAME}, puedes ignorar este mensaje.

Saludos,
Equipo ${STORE_NAME}
    `.trim();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2196F3; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #2196F3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verifica tu correo electrónico</h1>
            </div>
            <div class="content">
              <p>Hola ${name},</p>
              <p>Bienvenido a ${STORE_NAME}!</p>
              <p>Por favor verifica tu correo electrónico para activar tu cuenta.</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verificar correo</a>
              </div>
              
              <p>Si no creaste una cuenta en ${STORE_NAME}, puedes ignorar este mensaje.</p>
              
              <p>Saludos,<br><strong>Equipo ${STORE_NAME}</strong></p>
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await sendEmail({
      from: `${STORE_NAME} <${EMAIL_FROM}>`,
      to: [email],
      subject: `Verifica tu correo electrónico - ${STORE_NAME}`,
      text: textContent,
      html: htmlContent,
    });

    return {
      success: true,
      data: {
        messageId: result.data?.id,
      },
    };
  } catch (error: any) {
    console.error('Failed to send verification email:', error);
    throw new Error('Error al enviar correo de verificación');
  }
}
