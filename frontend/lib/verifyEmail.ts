import { render } from '@react-email/render';
import { EmailParams, Recipient, Sender } from 'mailersend';
import { VerifyEmailTemplate } from '@/app/components/VerifyEmailTemplate';
import { getMailerSend } from './mailersend';

interface SendVerificationEmailParams {
  email: string;
  token: string;
  name: string;
}

const getAppBaseUrl = (): string => {
  return (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
};

const buildVerificationUrl = (token: string): string => {
  const baseUrl = getAppBaseUrl();
  return `${baseUrl}/api/auth/verify-email/${token}`;
};

export async function sendVerificationEmail({ email, token, name }: SendVerificationEmailParams) {
  try {
    const verificationUrl = buildVerificationUrl(token);
    
    const htmlContent = await render(VerifyEmailTemplate({ name, verificationUrl }));
    const textContent = `Hola ${name}, verifica tu email haciendo clic en este enlace: ${verificationUrl}`;
    
    const sentFrom = new Sender('noreply@test-r9084zv1368gw63d.mlsender.net', 'NEOSALE');
    const recipients = [new Recipient(email, name)];
    
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject('Verifica tu correo electrónico - NEOSALE')
      .setText(textContent)
      .setHtml(htmlContent);

    // Enviar email usando la instancia singleton
    const mailerSend = getMailerSend();
    const response = await mailerSend.email.send(emailParams);
    
    return { 
      success: true, 
      data: { 
        messageId: response.body.message_id || response.headers?.['x-message-id'] 
      } 
    };
  } catch (error: any) {
    console.error('Failed to send verification email:', error);
    throw new Error('Error al enviar correo de verificación');
  }
}
