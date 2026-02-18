import { notFound } from "next/navigation";
import { fetchOrderDetails } from "@/app/(admin)/services/orders";
import { formatDate } from "@/lib/date-utils";
import { Badge } from "@/app/(admin)/components/ui/badge";
import { OrderBadgeVariants } from "@/app/(admin)/constants/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/(admin)/components/ui/table";
import "../invoice-pdf.css";

type PageParams = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PrintOrder({ params }: PageParams) {
  try {
    const { id } = await params;
    const { order } = await fetchOrderDetails({ id });

    if (!order) {
      notFound();
    }

    return (
      <html lang="es">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Orden #{order.id} - NeoSale</title>
          <style>{`
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              background: white;
              color: #1f2937;
              line-height: 1.6;
            }

            .print-container {
              max-width: 900px;
              margin: 0 auto;
              padding: 40px;
              background: white;
            }

            .header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 40px;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 20px;
            }

            .brand-section h1 {
              font-size: 32px;
              font-weight: 900;
              color: #1e40af;
              margin-bottom: 10px;
            }

            .invoice-info {
              text-align: right;
            }

            .invoice-info p {
              margin: 4px 0;
              font-size: 14px;
            }

            .invoice-info .invoice-number {
              font-size: 18px;
              font-weight: 600;
              color: #1f2937;
            }

            .customer-section {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
              margin-bottom: 40px;
            }

            .customer-section h3 {
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              color: #6b7280;
              margin-bottom: 8px;
            }

            .customer-section p {
              font-size: 14px;
              line-height: 1.8;
              color: #374151;
            }

            .order-items {
              margin-bottom: 40px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }

            thead {
              background: #f9fafb;
              border-top: 2px solid #e5e7eb;
              border-bottom: 2px solid #e5e7eb;
            }

            th {
              padding: 12px;
              text-align: left;
              font-weight: 600;
              font-size: 13px;
              text-transform: uppercase;
              color: #374151;
            }

            td {
              padding: 12px;
              border-bottom: 1px solid #f3f4f6;
              font-size: 14px;
            }

            tr:last-child td {
              border-bottom: none;
            }

            .totals {
              display: flex;
              justify-content: flex-end;
              margin-bottom: 40px;
            }

            .totals-box {
              width: 300px;
              text-align: right;
            }

            .totals-box p {
              display: flex;
              justify-content: space-between;
              margin: 8px 0;
              font-size: 14px;
            }

            .total-amount {
              font-size: 18px;
              font-weight: 700;
              color: #1e40af;
              border-top: 2px solid #e5e7eb;
              padding-top: 12px;
              margin-top: 12px;
            }

            .footer {
              border-top: 2px solid #e5e7eb;
              padding-top: 20px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
            }

            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 600;
            }

            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              .print-container {
                padding: 0;
              }
              a {
                color: inherit;
                text-decoration: none;
              }
            }
          `}</style>
        </head>
        <body>
          <div className="print-container">
            {/* Header */}
            <div className="header">
              <div className="brand-section">
                <h1>NEO$ALE</h1>
              </div>
              <div className="invoice-info">
                <p className="invoice-number">Orden #{order.id}</p>
                <p>
                  <strong>Fecha:</strong> {formatDate.medium(order.created_at)}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  <span className="status-badge">{order.status}</span>
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="customer-section">
              <div>
                <h3>Facturar A:</h3>
                <p>
                  <strong>{order.User?.name}</strong>
                  <br />
                  {order.addresses?.street}
                  <br />
                  {order.addresses?.city},{" "}
                  {order.addresses?.state}{" "}
                  {order.addresses?.zip_code}
                  <br />
                  {order.addresses?.city}
                  <br />
                  {order.User?.email}
                </p>
              </div>
              <div>
                <h3>Enviar A:</h3>
                <p>
                  <strong>
                    {order.User?.name}                  </strong>
                  <br />
                  {order.addresses?.street}
                  <br />
                  {order.addresses?.city},{" "}
                  {order.addresses?.state}{" "}
                  {order.addresses?.zip_code}
                  <br />
                  {order.addresses?.city}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="order-items">
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th style={{ textAlign: "center" }}>Cantidad</th>
                    <th style={{ textAlign: "right" }}>Precio Unitario</th>
                    <th style={{ textAlign: "right" }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.order_items?.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item?.products.name}</strong>
                        <br />
                     
                      </td>
                      <td style={{ textAlign: "center" }}>{item.quantity}</td>
                      <td style={{ textAlign: "right" }}>
                        ${(item.price / 100).toFixed(2)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        ${((item.price * item.quantity) / 100).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="totals">
              <div className="totals-box">
                <p>
                  <span>Subtotal:</span>
                  <span>${(order.total / 100).toFixed(2)}</span>
                </p>
               
               
                {order.shipping_cost > 0 && (
                  <p>
                    <span>Envío:</span>
                    <span>${(order.shipping_cost / 100).toFixed(2)}</span>
                  </p>
                )}
                <p className="total-amount">
                  <span>TOTAL:</span>
                  <span>${(order.total / 100).toFixed(2)}</span>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="footer">
              <p>
                Gracias por tu compra. Para consultas contacta a
                support@neosale.com
              </p>
              <p>© 2026 NeoSale. Todos los derechos reservados.</p>
            </div>
          </div>

          <script>{`
            // Auto-print cuando la página carga
            window.addEventListener('load', () => {
              setTimeout(() => {
                window.print();
              }, 500);
            });

            // Cerrar la ventana después de imprimir
            window.addEventListener('afterprint', () => {
              window.close();
            });
          `}</script>
        </body>
      </html>
    );
  } catch (error) {
    notFound();
  }
}
