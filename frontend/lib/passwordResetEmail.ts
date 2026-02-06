import { api } from '@/config/api';

interface SendPasswordResetEmailParams {
  email: string;
  name: string;
  token: string;
  expiresInMinutes: number;
}

const getAppBaseUrl = (): string => {
  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
};

export async function sendPasswordResetEmail({
  email,
  name,
  token,
  expiresInMinutes,
}: SendPasswordResetEmailParams) {
  try {
    // 🚫 Verificar si los emails están desactivados en desarrollo
    if (process.env.DISABLE_EMAILS === 'true') {
      console.log('📧 [DEV] Email de reset desactivado. Email:', email);
      return { success: true, message: 'Email desactivado en desarrollo' };
    }

    const baseUrl = getAppBaseUrl();
    const resetUrl = `${baseUrl}/update-password?token=${token}`;

    const response = await api.post('api/emails/password-reset', {
      email,
      name,
      resetUrl,
      expiresInMinutes,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    throw new Error("No pudimos enviar el correo de restablecimiento");
  }
}
