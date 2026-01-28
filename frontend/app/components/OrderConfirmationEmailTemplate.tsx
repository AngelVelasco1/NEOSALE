import * as React from 'react';

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderConfirmationEmailTemplateProps {
  customerName: string;
  orderId: string;
  orderDate: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  taxes: number;
  discount: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingUrl?: string;
}

export function OrderConfirmationEmailTemplate({
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
}: OrderConfirmationEmailTemplateProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={main}>
        <div style={container}>
          {/* Header */}
          <div style={logoSection}>
            <h1 style={heading}>NEOSALE</h1>
          </div>

          {/* Success Banner */}
          <div style={successBanner}>
            <h2 style={successTitle}>¡Pedido Confirmado! 🎉</h2>
            <p style={successSubtitle}>
              Gracias por tu compra, <strong>{customerName}</strong>
            </p>
          </div>

          {/* Order Info */}
          <div style={contentSection}>
            <div style={infoBox}>
              <div style={infoRow}>
                <span style={infoLabel}>Número de pedido:</span>
                <span style={infoValue}>#{orderId}</span>
              </div>
              <div style={infoRow}>
                <span style={infoLabel}>Fecha:</span>
                <span style={infoValue}>{orderDate}</span>
              </div>
            </div>

            {/* Order Items */}
            <h3 style={sectionTitle}>Resumen de tu pedido</h3>
            <div style={itemsContainer}>
              {items.map((item, index) => (
                <div key={index} style={itemRow}>
                  <div style={itemInfo}>
                    <div style={itemName}>{item.productName}</div>
                    <div style={itemQuantity}>Cantidad: {item.quantity}</div>
                  </div>
                  <div style={itemPrice}>{formatCurrency(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div style={priceBreakdown}>
              <div style={priceRow}>
                <span style={priceLabel}>Subtotal:</span>
                <span style={priceValue}>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div style={priceRow}>
                  <span style={priceLabel}>Descuento:</span>
                  <span style={discountValue}>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div style={priceRow}>
                <span style={priceLabel}>Envío:</span>
                <span style={priceValue}>{formatCurrency(shipping)}</span>
              </div>
              <div style={priceRow}>
                <span style={priceLabel}>Impuestos:</span>
                <span style={priceValue}>{formatCurrency(taxes)}</span>
              </div>
              <div style={totalRow}>
                <span style={totalLabel}>Total:</span>
                <span style={totalValue}>{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Shipping Address */}
            <h3 style={sectionTitle}>Dirección de envío</h3>
            <div style={addressBox}>
              <p style={addressText}>{shippingAddress.street}</p>
              <p style={addressText}>
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
              </p>
              <p style={addressText}>{shippingAddress.country}</p>
            </div>

            {/* Tracking Button */}
            {trackingUrl && (
              <div style={buttonContainer}>
                <a style={button} href={trackingUrl}>
                  Seguir mi pedido
                </a>
              </div>
            )}

            {/* Additional Info */}
            <div style={infoNote}>
              <p style={noteText}>
                <strong>¿Qué sigue?</strong>
              </p>
              <p style={noteText}>
                • Estamos preparando tu pedido para su envío
              </p>
              <p style={noteText}>
                • Recibirás una notificación cuando sea despachado
              </p>
              <p style={noteText}>
                • Puedes seguir el estado de tu pedido en cualquier momento
              </p>
            </div>

            <div style={supportBox}>
              <p style={supportText}>
                ¿Necesitas ayuda con tu pedido?
              </p>
              <p style={supportText}>
                Contáctanos en{' '}
                <a href="mailto:support@neosale.com" style={link}>
                  support@neosale.com
                </a>
              </p>
            </div>
          </div>

          {/* Footer */}
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

// Styles
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

const successBanner = {
  backgroundColor: '#10b981',
  padding: '24px 40px',
  textAlign: 'center' as const,
};

const successTitle = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0 0 8px 0',
};

const successSubtitle = {
  fontSize: '16px',
  color: '#ffffff',
  margin: '0',
};

const contentSection = {
  padding: '0 40px',
};

const infoBox = {
  backgroundColor: '#f9fafb',
  padding: '20px',
  borderRadius: '8px',
  marginTop: '24px',
  marginBottom: '24px',
};

const infoRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '8px',
};

const infoLabel = {
  fontSize: '14px',
  color: '#6b7280',
};

const infoValue = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#1f2937',
};

const sectionTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#1f2937',
  marginTop: '32px',
  marginBottom: '16px',
};

const itemsContainer = {
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  overflow: 'hidden',
};

const itemRow = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '16px',
  borderBottom: '1px solid #e5e7eb',
};

const itemInfo = {
  flex: '1',
};

const itemName = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#1f2937',
  marginBottom: '4px',
};

const itemQuantity = {
  fontSize: '13px',
  color: '#6b7280',
};

const itemPrice = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#1f2937',
};

const priceBreakdown = {
  marginTop: '24px',
  padding: '20px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
};

const priceRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '12px',
};

const priceLabel = {
  fontSize: '14px',
  color: '#6b7280',
};

const priceValue = {
  fontSize: '14px',
  color: '#1f2937',
};

const discountValue = {
  fontSize: '14px',
  color: '#10b981',
  fontWeight: '600',
};

const totalRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '16px',
  paddingTop: '16px',
  borderTop: '2px solid #e5e7eb',
};

const totalLabel = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#1f2937',
};

const totalValue = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#2563eb',
};

const addressBox = {
  backgroundColor: '#f9fafb',
  padding: '16px',
  borderRadius: '8px',
  borderLeft: '4px solid #2563eb',
};

const addressText = {
  fontSize: '14px',
  color: '#374151',
  margin: '4px 0',
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

const infoNote = {
  backgroundColor: '#eff6ff',
  padding: '16px',
  borderRadius: '8px',
  borderLeft: '4px solid #3b82f6',
  marginTop: '24px',
};

const noteText = {
  fontSize: '14px',
  color: '#1e40af',
  margin: '4px 0',
};

const supportBox = {
  textAlign: 'center' as const,
  marginTop: '32px',
  padding: '20px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
};

const supportText = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '4px 0',
};

const link = {
  color: '#2563eb',
  textDecoration: 'none',
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
