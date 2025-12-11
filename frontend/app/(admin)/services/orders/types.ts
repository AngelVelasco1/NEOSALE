// Tipos basados en Prisma
export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Order {
  id: number;
  invoice_no?: string;
  status: OrderStatus;
  total: number;
  created_at: string;
  customers?: {
    name: string;
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
  invoice_no: string;
  order_time: string;
  total_amount: number;
  shipping_cost: number;
  payment_method: string;
  status: OrderStatus;
  customers: {
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
  };
  order_items: Array<{
    quantity: number;
    unit_price: number;
    products: {
      name: string;
    };
  }>;
  coupons: {
    discount_type: string;
    discount_value: number;
  } | null;
};

export type OrdersExport = {
  id: number;
  invoice_no: string;
  order_time: string;
  total_amount: number;
  shipping_cost: number;
  payment_method: string;
  status: string;
  created_at: string;
  updated_at: string;
  discount: string;
  customer_name: string;
  customer_email: string;
};
