import * as React from 'react';

interface VerifyEmailTemplateProps {
  name: string;
  verificationUrl: string;
}

export function VerifyEmailTemplate({ name, verificationUrl }: VerifyEmailTemplateProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={main}>
        <div style={container}>
          <div style={logoSection}>
            <h1 style={heading}>NEOSALE</h1>
          </div>
          
          <div style={contentSection}>
            <h2 style={title}>
              ¡Verifica tu correo electrónico!
            </h2>
            
            <p style={paragraph}>
              Hola <strong>{name}</strong>,
            </p>
            
            <p style={paragraph}>
              Gracias por registrarte en NEOSALE. Para completar tu registro y acceder a todas las funcionalidades de nuestra plataforma, necesitamos verificar tu correo electrónico.
            </p>
            
            <div style={buttonContainer}>
              <a style={button} href={verificationUrl}>
                Verificar mi correo
              </a>
            </div>
            
            <p style={paragraph}>
              O copia y pega este enlace en tu navegador:
            </p>
            
            <p style={link}>
              {verificationUrl}
            </p>
            
            <p style={note}>
              <strong>Nota:</strong> Este enlace expirará en 24 horas por seguridad.
            </p>
            
            <p style={paragraph}>
              Si no creaste una cuenta en NEOSALE, puedes ignorar este correo de forma segura.
            </p>
          </div>
          
          <div style={footer}>
            <p style={footerText}>
              © {new Date().getFullYear()} NEOSALE. Todos los derechos reservados.
            </p>
            <p style={footerText}>
              Este es un correo automático, por favor no respondas.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const logoSection = {
  padding: '32px 40px',
  textAlign: 'center' as const,
  backgroundColor: '#1a1a1a',
};

const heading = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0',
};

const contentSection = {
  padding: '0 40px',
};

const title = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#1a1a1a',
  marginBottom: '24px',
  marginTop: '32px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#525252',
  marginBottom: '16px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  lineHeight: '100%',
};

const link = {
  fontSize: '14px',
  color: '#2563eb',
  wordBreak: 'break-all' as const,
  padding: '12px',
  backgroundColor: '#f3f4f6',
  borderRadius: '4px',
  marginBottom: '16px',
};

const note = {
  fontSize: '14px',
  color: '#737373',
  backgroundColor: '#fef3c7',
  padding: '12px',
  borderRadius: '4px',
  borderLeft: '4px solid #f59e0b',
  marginBottom: '16px',
};

const footer = {
  padding: '32px 40px',
  borderTop: '1px solid #e5e7eb',
  marginTop: '32px',
};

const footerText = {
  fontSize: '12px',
  color: '#737373',
  textAlign: 'center' as const,
  marginBottom: '8px',
};
