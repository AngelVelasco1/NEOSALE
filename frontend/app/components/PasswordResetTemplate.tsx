import * as React from "react";

interface PasswordResetTemplateProps {
  name: string;
  resetUrl: string;
  expiresInMinutes: number;
}

export function PasswordResetTemplate({
  name,
  resetUrl,
  expiresInMinutes,
}: PasswordResetTemplateProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={main}>
        <div style={container}>
          <div style={hero}>
            <h1 style={brand}>NEOSALE</h1>
            <p style={heroSub}>Centro de seguridad de cuenta</p>
          </div>

          <div style={content}>
            <h2 style={title}>¿Necesitas una nueva contraseña?</h2>
            <p style={paragraph}>
              Hola <strong>{name}</strong>,
            </p>
            <p style={paragraph}>
              Recibimos una solicitud para restablecer la contraseña de tu cuenta. Si
              fuiste tú, haz clic en el botón para crear una contraseña nueva.
            </p>

            <div style={buttonWrapper}>
              <a style={button} href={resetUrl}>
                Restablecer contraseña
              </a>
            </div>

            <p style={paragraph}>
              También puedes copiar y pegar este enlace en tu navegador:
            </p>
            <p style={link}>{resetUrl}</p>

            <p style={notice}>
              Este enlace estará activo durante {expiresInMinutes} minutos. Después de ese
              tiempo tendrás que solicitar uno nuevo.
            </p>
            <p style={paragraph}>
              Si no solicitaste este cambio, ignora este mensaje. Tu contraseña actual
              seguirá siendo válida.
            </p>
          </div>

          <div style={footer}>
            <p style={footerText}>© {new Date().getFullYear()} NEOSALE</p>
            <p style={footerText}>Este es un correo automático, por favor no respondas.</p>
          </div>
        </div>
      </body>
    </html>
  );
}

const main: React.CSSProperties = {
  backgroundColor: "#0f172a",
  fontFamily:
    "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,\"Helvetica Neue\",Ubuntu,sans-serif",
  padding: "32px 12px",
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  maxWidth: "600px",
  borderRadius: "20px",
  overflow: "hidden",
  boxShadow: "0 25px 45px rgba(15,23,42,0.15)",
};

const hero: React.CSSProperties = {
  background: "linear-gradient(135deg,#1d4ed8 0%,#7c3aed 100%)",
  padding: "40px 32px",
  textAlign: "center",
};

const brand: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "28px",
  margin: 0,
  letterSpacing: "0.08em",
};

const heroSub: React.CSSProperties = {
  color: "rgba(255,255,255,0.8)",
  marginTop: "8px",
  letterSpacing: "0.3em",
  textTransform: "uppercase",
  fontSize: "11px",
};

const content: React.CSSProperties = {
  padding: "32px",
};

const title: React.CSSProperties = {
  fontSize: "24px",
  margin: "0 0 16px",
  color: "#0f172a",
};

const paragraph: React.CSSProperties = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#475569",
  margin: "0 0 16px",
};

const buttonWrapper: React.CSSProperties = {
  textAlign: "center",
  margin: "32px 0",
};

const button: React.CSSProperties = {
  backgroundColor: "#2563eb",
  color: "#ffffff",
  padding: "14px 32px",
  borderRadius: "9999px",
  fontWeight: 600,
  textDecoration: "none",
  display: "inline-block",
};

const link: React.CSSProperties = {
  fontSize: "14px",
  color: "#2563eb",
  wordBreak: "break-all",
  backgroundColor: "#f8fafc",
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  margin: "0 0 16px",
};

const notice: React.CSSProperties = {
  fontSize: "14px",
  color: "#b45309",
  backgroundColor: "#fffbeb",
  padding: "12px 16px",
  borderRadius: "12px",
  borderLeft: "4px solid #fbbf24",
  marginBottom: "16px",
};

const footer: React.CSSProperties = {
  padding: "24px 32px",
  borderTop: "1px solid #e2e8f0",
  textAlign: "center",
  backgroundColor: "#f8fafc",
};

const footerText: React.CSSProperties = {
  fontSize: "12px",
  color: "#94a3b8",
  margin: "4px 0",
};
