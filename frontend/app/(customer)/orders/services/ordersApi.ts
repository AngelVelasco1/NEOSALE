import { api } from "@/config/api";

export interface OrderItem {
  product_id: number;
  quantity: number;
  unit_price: number;
  color_code: string;
  size: string;
}

export interface CreateOrderData {
  payment_id: string;
  address_id?: number;
  items: OrderItem[];
  subtotal: number;
  taxes: number;
  shipping: number;
  total: number;
  payment_method: string;
}

export interface Order {
  id: number;
  status: string;
  total: number;
  created_at: string;
}

export const createOrderApi = async (
  orderData: CreateOrderData
): Promise<Order> => {
  try {
    const { data } = await api.post(
      "api/payments/orders/create-from-payment",
      orderData
    );
    return data;
  } catch (error: any) {
    console.error("Error creating order:", error);
    throw new Error(error.response?.data?.message || "Error al crear la orden");
  }
};
