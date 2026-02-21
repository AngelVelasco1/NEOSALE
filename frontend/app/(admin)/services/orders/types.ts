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
  payment: {
    id: number;
    transaction_id: string | null;
    payment_method: string;
    payment_status: string;
    amount_in_cents: number;
    currency: string;
    customer_email: string | null;
    created_at: string;
    approved_at: string | null;
  } | null;
  User: {
    id: number;
    name: string;
    email: string;
  };
  addresses: {
    id: number;
    address: string;
    country: string;
    city: string;
    department: string;
    is_default: boolean;
    created_at: string;
  } | null;
  coupons: Array<{
    id: number;
    code: string;
    discount_value: number;
    discount_type: string;
  }>;
  order_items: Array<{
    quantity: number;
    price: number;
    color_code: string | null;
    size: string | null;
    products: {
      id: number;
      name: string;
      price: number;
    };
  }>;
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
  invoice_no: string;
  created_at: string;
  total: number;
  shipping_cost: number;
  status: OrderStatus;
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
  } | null;
  order_items: Array<{
    quantity: number;
    price: number;
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
