import { render } from "@react-email/render";
import { EmailParams, Recipient, Sender } from "mailersend";
import { PasswordResetTemplate } from "@/app/components/PasswordResetTemplate";
import { getMailerSend } from "./mailersend";

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

    const htmlContent = await render(
      PasswordResetTemplate({ name, resetUrl, expiresInMinutes })
    );
    const textContent = [
      `Hola ${name},`,
      "Recibimos una solicitud para restablecer tu contraseña en NEOSALE.",
      `Abre este enlace para continuar: ${resetUrl}`,
      `El enlace caduca en ${expiresInMinutes} minutos.`,
      "Si no hiciste esta solicitud, puedes ignorar este mensaje.",
    ].join("\n\n");

    const sentFrom = new Sender(
      "noreply@test-r9084zv1368gw63d.mlsender.net",
      "NEOSALE"
    );
    const recipients = [new Recipient(email, name)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject("Restablece tu contraseña - NEOSALE")
      .setText(textContent)
      .setHtml(htmlContent);

    const mailerSend = getMailerSend();
    await mailerSend.email.send(emailParams);
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    throw new Error("No pudimos enviar el correo de restablecimiento");
  }
}
