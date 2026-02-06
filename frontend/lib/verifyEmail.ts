import { api } from '@/config/api';

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
    // 🚫 Verificar si los emails están desactivados en desarrollo
    if (process.env.DISABLE_EMAILS === 'true') {
      console.log('📧 [DEV] Email de verificación desactivado. Email:', email);
      console.log('🔗 [DEV] Token de verificación:', token);
      return { success: true, message: 'Email desactivado en desarrollo. Token: ' + token };
    }

    const verificationUrl = buildVerificationUrl(token);
    
    const response = await api.post('api/emails/verification', {
      email,
      name,
      verificationUrl,
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Failed to send verification email:', error);
    throw new Error('Error al enviar correo de verificación');
  }
}
