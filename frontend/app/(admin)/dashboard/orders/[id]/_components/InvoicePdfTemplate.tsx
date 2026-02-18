import { formatDate } from "@/lib/date-utils";

import { OrderDetails } from "@/app/(admin)/services/orders/types";
import Image from "next/image";

const getBadgeStyles = (status: string): React.CSSProperties => {
  const baseStyles: React.CSSProperties = {
    display: "inline-block",
    padding: "0px 10px 12px 10px",
    fontSize: "11px",
    fontWeight: "600",
    borderRadius: "20px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const statusColors: Record<string, { bg: string; color: string; border: string }> = {
    pending: { bg: "#FEF3C7", color: "#92400E", border: "#FDE68A" },
    processing: { bg: "#DBEAFE", color: "#1E40AF", border: "#BFDBFE" },
    shipped: { bg: "#E0E7FF", color: "#3730A3", border: "#C7D2FE" },
    delivered: { bg: "#D1FAE5", color: "#065F46", border: "#A7F3D0" },
    cancelled: { bg: "#FEE2E2", color: "#991B1B", border: "#FECACA" },
  };

  const colors = statusColors[status] || { bg: "#F3F4F6", color: "#1F2937", border: "#E5E7EB" };

  return {
    ...baseStyles,
    backgroundColor: colors.bg,
    color: colors.color,
    border: `1px solid ${colors.border}`,
  };
};

export default function InvoicePdfTemplate({ order }: { order: OrderDetails }) {
  return (
    <div
      id={`invoice-${order.id}`}
      style={{
        width: "794px",
        height: "1123px",
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        padding: "56px",
        backgroundColor: "#ffffff",
        boxSizing: "border-box",
        position: "relative"
      }}
    >
      {/* Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "flex-start", 
        marginBottom: "25px",
        paddingBottom: "32px",
        borderBottom: "2px solid #E5E7EB"
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "12px", 
            marginBottom: "16px" 
          }}>
            <Image width={50} height={50} alt="logo" src="/imgs/Logo.png" style={{ objectFit: "contain" }} />
            <h1 style={{ 
              fontSize: "28px", 
              color: "#2768E3", 
              fontWeight: "700", 
              marginBottom: "22px",
              letterSpacing: "-0.5px"
            }}>
              NEO$ALE
            </h1>
          </div>
          <div style={{ 
            fontSize: "11px", 
            color: "#6B7280", 
            lineHeight: "1.5",
            marginLeft: "15px"
          }}>
            <p style={{ margin: "0 0 1px 0" }}>2 Lawson Avenue, California, United States</p>
            <p style={{ margin: "0 0 1px 0" }}>+1 (212) 456-7890</p>
            <p style={{ margin: "0" }}>ecommerceadmin@gmail.com</p>
          </div>
        </div>

        <div style={{ textAlign: "right", minWidth: "160px" }}>
          <h2 style={{ 
            fontSize: "36px", 
            color: "#111827", 
            fontWeight: "700", 
            textTransform: "uppercase",
            margin: "0 0 12px 0",
            letterSpacing: "1px"
          }}>
            
        Factura
          </h2>
          <span style={getBadgeStyles(order.status)}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(3, 1fr)", 
        gap: "32px", 
        marginBottom: "30px",
        padding: "24px",
        backgroundColor: "#F9FAFB",
        borderRadius: "12px"
      }}>
        <div>
          <p style={{ 
            fontSize: "9px", 
            color: "#6B7280", 
            textTransform: "uppercase", 
            fontWeight: "700",
            marginBottom: "5px",
            letterSpacing: "1px"
          }}>
            Fecha de la Orden
          </p>
          <p style={{ 
            fontSize: "15px", 
            color: "#111827", 
            fontWeight: "600", 
            margin: 0 
          }}>
            {formatDate.long(order.created_at)}
          </p>
        </div>

        <div>
          <p style={{ 
            fontSize: "9px", 
            color: "#6B7280", 
            textTransform: "uppercase", 
            fontWeight: "700",
            marginBottom: "8px",
            letterSpacing: "1px"
          }}>
            Factura No.
          </p>
          <p style={{ 
            fontSize: "15px", 
            color: "#111827", 
            fontWeight: "600", 
            margin: 0 
          }}>
            #{`INV-${String(order.id).padStart(6, "0")}`}
          </p>
        </div>

        <div>
          <p style={{ 
            fontSize: "9px", 
            color: "#6B7280", 
            textTransform: "uppercase", 
            fontWeight: "700",
            marginBottom: "8px",
            letterSpacing: "1px"
          }}>
            Método de Pago
          </p>
          <p style={{ 
            fontSize: "15px", 
            color: "#111827", 
            fontWeight: "600",
            textTransform: "uppercase",
            margin: 0
          }}>
            {order.payments?.payment_method || "N/A"}
          </p>
        </div>
      </div>

      {/* Bill To */}
      <div style={{ 
        marginBottom: "25px",
        padding: "20px 24px",
        borderLeft: "4px solid #3B82F6",
        backgroundColor: "#EFF6FF",
        borderRadius: "0 8px 8px 0"
      }}>
        <p style={{ 
          fontSize: "9px", 
          color: "#3B82F6",
          textTransform: "uppercase",
          fontWeight: "700",
          marginBottom: "12px",
          letterSpacing: "1px"
        }}>\n          Facturado a:
        </p>
        <p style={{ 
          fontSize: "17px", 
          color: "#111827",
          fontWeight: "700",
          marginBottom: "8px"
        }}>
          {order.User.name}
        </p>
        <div style={{ 
          fontSize: "13px", 
          color: "#4B5563", 
          lineHeight: "1.8" 
        }}>
          <p style={{ margin: "0 0 4px 0" }}>{order.User.email}</p>
          {order.User.phoneNumber && <p style={{ margin: "0 0 4px 0" }}>{order.User.phoneNumber}</p>}
          {order.addresses && <p style={{ margin: "0" }}>{`${order.addresses.street}, ${order.addresses.city}, ${order.addresses.state} ${order.addresses.zip_code}`}</p>}
        </div>
      </div>

      {/* Products Table */}
      <div style={{ 
        marginBottom: "25px",
        border: "1px solid #E5E7EB",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
      }}>
        <table style={{ width: "100%", padding: "0px", borderCollapse: "collapse" }}>
          <thead style={{backgroundColor: "gray"}}>
            <tr style={{ 
              backgroundColor: "#F9FAFB",
              borderBottom: "2px solid #E5E7EB" 
            }}>
              <th style={{ 
                height: "48px",
                fontSize: "10px",
                fontWeight: "700",
                color: "#374151",
                textAlign: "left",
                padding: "12px 20px",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                SR.
              </th>
              <th style={{ 
                height: "48px",
                fontSize: "10px",
                fontWeight: "700",
                color: "#374151",
                textAlign: "left",
                padding: "12px 20px",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                Producto
              </th>
              <th style={{ 
                height: "48px",
                fontSize: "10px",
                fontWeight: "700",
                color: "#374151",
                textAlign: "center",
                padding: "12px 20px",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                Cantidad
              </th>
              <th style={{ 
                height: "48px",
                fontSize: "10px",
                fontWeight: "700",
                color: "#374151",
                textAlign: "center",
                padding: "12px 20px",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                Precio Unitario
              </th>
              <th style={{ 
                height: "48px",
                fontSize: "10px",
                fontWeight: "700",
                color: "#374151",
                textAlign: "right",
                padding: "12px 20px",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                Cantidad
              </th>
            </tr>
          </thead>

          <tbody>
            {order.order_items.map((orderItem, index) => (
              <tr
                key={`order-item-${index}`}
                style={{ 
                  borderBottom: index < order.order_items.length - 1 ? "1px solid #F3F4F6" : "none",
                  backgroundColor: "#ffffff"
                }}
              >
                <td style={{ 
                  padding: "16px 20px",
                  fontSize: "14px",
                  color: "#6B7280",
                  fontWeight: "500"
                }}>
                  {index + 1}
                </td>
                <td style={{ 
                  padding: "16px 20px",
                  fontSize: "14px",
                  color: "#111827",
                  fontWeight: "500"
                }}>
                  {orderItem.products.name}
                </td>
                <td style={{ 
                  padding: "16px 20px",
                  fontSize: "14px",
                  color: "#111827",
                  textAlign: "center",
                  fontWeight: "600"
                }}>
                  {orderItem.quantity}
                </td>
                <td style={{ 
                  padding: "16px 20px",
                  fontSize: "14px",
                  color: "#6B7280",
                  textAlign: "center",
                  fontWeight: "500"
                }}>
                  ${orderItem.price.toFixed(2)}
                </td>
                <td style={{ 
                  padding: "16px 20px",
                  fontSize: "15px",
                  color: "#3B82F6",
                  fontWeight: "700",
                  textAlign: "right"
                }}>
                  ${(orderItem.quantity * orderItem.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      <div style={{ 
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        padding: "28px",
        backgroundColor: "#F9FAFB",
        borderRadius: "12px",
        border: "1px solid #E5E7EB"
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ 
            fontWeight: "700",
            fontSize: "9px",
            color: "#6B7280",
            textTransform: "uppercase",
            marginBottom: "8px",
            letterSpacing: "1px"
          }}>
            Metodo de Pago
          </p>
          <p style={{ 
            fontSize: "15px",
            fontWeight: "600",
            color: "#111827",
            textTransform: "capitalize",
            margin: 0
          }}>
            {order.payments?.payment_method || "N/A"}
          </p>
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ 
            fontWeight: "700",
            fontSize: "9px",
            color: "#6B7280",
            textTransform: "uppercase",
            marginBottom: "8px",
            letterSpacing: "1px"
          }}>
             Costo de Envío
          </p>
          <p style={{ 
            fontSize: "15px",
            fontWeight: "600",
            color: "#111827",
            margin: 0
          }}>
            ${order.shipping_cost.toFixed(2)}
          </p>
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ 
            fontWeight: "700",
            fontSize: "9px",
            color: "#6B7280",
            textTransform: "uppercase",
            marginBottom: "8px",
            letterSpacing: "1px"
          }}>
            Descuento
          </p>
          <p style={{ 
            fontSize: "15px",
            fontWeight: "600",
            color: "#10B981",
            margin: 0
          }}>
            $
            {order.coupons
              ? order.coupons.discount_type === "fixed"
                ? order.coupons.discount_value.toFixed(2)
                : (
                  ((order.total - order.shipping_cost) * 100) /
                  (100 - order.coupons.discount_value) -
                  (order.total - order.shipping_cost)
                ).toFixed(2)
              : "0.00"}
          </p>
        </div>

        <div style={{ 
          textAlign: "center",
          borderLeft: "2px solid #3B82F6",
          paddingLeft: "20px"
        }}>
          <p style={{ 
            fontWeight: "700",
            fontSize: "9px",
            color: "#3B82F6",
            textTransform: "uppercase",
            marginBottom: "2px",
            letterSpacing: "1px"
          }}>
            Total a Pagar
          </p>
          <p style={{ 
            fontSize: "20px",
            fontWeight: "700",
            color: "#3B82F6",
            margin: 0
          }}>
            ${order.total.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
