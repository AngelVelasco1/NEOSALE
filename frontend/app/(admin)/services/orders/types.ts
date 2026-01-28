// Tipos basados en Prisma
export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Order {
  id: number;
  payment_id: number;
  status: OrderStatus;
  subtotal: number;
  discount: number | null;
  shipping_cost: number;
  taxes: number;
  total: number;
  shipping_address_id: number;
  user_note: string | null;
  admin_notes: string | null;
  coupon_id: number | null;
  coupon_discount: number | null;
  tracking_number: string | null;
  carrier: string | null;
  estimated_delivery_date: string | null;
  created_at: string;
  updated_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  user_id: number;
  updated_by: number;
  payments: {
    transaction_id: string | null;
    payment_method: string;
  };
  users?: {
    name: string | null;
    email?: string | null;
  } | null;
}

export interface FetchOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  method?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: string;
  maxAmount?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface FetchOrdersResponse {
  data: Order[];
  pagination: Pagination;
}

export type OrderDetails = {
  id: number;
  payment_id: number;
  status: OrderStatus;
  subtotal: number;
  discount: number | null;
  shipping_cost: number;
  taxes: number;
  total: number;
  shipping_address_id: number;
  user_note: string | null;
  admin_notes: string | null;
  coupon_id: number | null;
  coupon_discount: number | null;
  tracking_number: string | null;
  carrier: string | null;
  estimated_delivery_date: string | null;
  created_at: string;
  updated_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  user_id: number;
  updated_by: number;
  User: {
    name: string | null;
    email: string;
    phoneNumber: string | null;
  };
  addresses: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
  };
  order_items: Array<{
    id: number;
    price: number;
    quantity: number;
    subtotal: number;
    color_code: string;
    size: string;
    product_id: number;
    order_id: number;
    created_at: string;
    updated_at: string | null;
    products: {
      name: string;
    };
  }>;
  coupons: {
    code: string;
    discount_type: string;
    discount_value: number;
  } | null;
  payments: {
    transaction_id: string | null;
    payment_method: string;
  };
};

export type OrdersExport = {
  id: number;
  payment_id: number;
  status: string;
  subtotal: number;
  discount: number | null;
  shipping_cost: number;
  taxes: number;
  total: number;
  shipping_address_id: number;
  user_note: string | null;
  admin_notes: string | null;
  coupon_id: number | null;
  coupon_discount: number | null;
  tracking_number: string | null;
  carrier: string | null;
  estimated_delivery_date: string | null;
  created_at: string;
  updated_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  user_id: number;
  updated_by: number;
  customer_name: string | null;
  customer_email: string;
  payment_method: string;
  transaction_id: string | null;
};
