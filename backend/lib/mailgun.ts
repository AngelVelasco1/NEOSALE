import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

let transporter: Transporter | null = null;

export function getMailgunClient() {
  if (!transporter) {
    const EMAIL_USER = process.env.EMAIL_USER;
    const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
    const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
    const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');

    if (!EMAIL_USER || !EMAIL_PASSWORD) {
      throw new Error('EMAIL_USER and EMAIL_PASSWORD must be defined in environment variables');
    }

    transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_PORT === 465, // true para 465, false para otros puertos
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    });

    console.log('📧 Nodemailer configured with:', EMAIL_USER);
  }

  return transporter;
}

export interface EmailData {
  from: string;
  to: string[];
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail(emailData: EmailData) {
  try {
    const transporter = getMailgunClient();

    const info = await transporter.sendMail({
      from: emailData.from,
      to: emailData.to.join(', '),
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html,
    });

    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, data: { id: info.messageId } };
  } catch (error: any) {
    console.error('❌ Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
