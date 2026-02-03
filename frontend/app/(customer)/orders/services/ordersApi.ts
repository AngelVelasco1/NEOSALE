import { api } from "@/config/api";

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  unit_price?: number; // Para compatibilidad con el formato anterior
  color_code: string;
  size: string;
  subtotal: number;
  products: {
    id: number;
    name: string;
    brands: {
      name: string;
    };
    categories: {
      name: string;
    };
    images: Array<{
      id: number;
      image_url: string;
      color_code: string;
      color: string;
      is_primary?: boolean;
    }>;
  };
}

export interface PaymentInfo {
  id: number;
  transaction_id: string;
  payment_status: string;
  payment_method: string;
  amount_in_cents: number;
  currency: string;
  customer_email: string;
  created_at: string;
  approved_at?: string;
}

export interface CreateOrderData {
  paymentId: string | number;
  shippingAddressId: number;
  couponId?: number;
}

export interface Order {
  id?: number; // Para las órdenes obtenidas
  order_id?: number; // Para las órdenes creadas
  payment_id?: number;
  total_amount?: number;
  total?: number; // Para compatibilidad
  status?: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  created_at?: string;
  order_items?: OrderItem[];
  payment?: PaymentInfo;
  coupons?: {
    id: number;
    code: string;
    discount_percentage: number;
  };
  success?: boolean;
  message?: string;
  user_id?: number;
  delivered_at?: string;
  addresses: {
    id: number;
    address: string;
    country: string;
    city: string;
    department: string;
    is_default: boolean;
    created_at: string;
  };
}

export const createOrderApi = async (
  orderData: CreateOrderData
): Promise<Order> => {
  try {
    const { data } = await api.post(
      "/api/payments/orders/create-from-payment",
      orderData
    );

    if (!data.success) {
      throw new Error(data.message || "Error al crear la orden");
    }

    return data.data;
  } catch (error: unknown) {
    console.error("Error creating order:", error);

    if (error && typeof error === "object" && "response" in error) {
      const apiError = error as {
        response: { data?: { message?: string } };
      };
      throw new Error(
        apiError.response?.data?.message || "Error al crear la orden"
      );
    }

    throw new Error(
      error instanceof Error ? error.message : "Error al crear la orden"
    );
  }
};

/**
 * Obtiene todas las órdenes del usuario autenticado
 */
export const getUserOrdersApi = async (): Promise<Order[]> => {
  try {
    // Obtener la sesión para extraer el user_id
    const sessionResponse = await fetch("/api/auth/session");
    const session = await sessionResponse.json();

    if (!session?.user?.id) {
      throw new Error("Usuario no autenticado");
    }

    const userId = session.user.id;
    const BACKEND_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    // Llamar directamente al backend
    const response = await fetch(
      `${BACKEND_URL}/api/orders/user-orders-with-payments?user_id=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-User-ID": userId.toString(),
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage =
        errorData?.message ||
        `Error ${response.status}: ${response.statusText}`;

      console.error("❌ Error obteniendo órdenes:", {
        status: response.status,
        message: errorMessage,
      });

      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Error obteniendo órdenes");
    }

    return result.data || [];
  } catch (error) {
    console.error("❌ Error en getUserOrdersApi:", error);
    throw error;
  }
};

/**
 * Obtiene una orden específica por ID
 */
export const getOrderByIdApi = async (orderId: number): Promise<Order> => {
  try {
    // Obtener la sesión para extraer el user_id
    const sessionResponse = await fetch("/api/auth/session");
    const session = await sessionResponse.json();

    if (!session?.user?.id) {
      throw new Error("Usuario no autenticado");
    }

    const userId = session.user.id;
    const BACKEND_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    // Llamar directamente al backend
    const response = await fetch(
      `${BACKEND_URL}/api/orders/${orderId}?user_id=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-User-ID": userId.toString(),
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage =
        errorData?.message ||
        `Error ${response.status}: ${response.statusText}`;

      console.error("❌ Error obteniendo orden:", {
        orderId,
        status: response.status,
        message: errorMessage,
      });

      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Error obteniendo orden");
    }

    return result.data;
  } catch (error) {
    console.error("❌ Error en getOrderByIdApi:", error);
    throw error;
  }
};
