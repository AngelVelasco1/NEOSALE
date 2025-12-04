import { Pagination } from "@/types/pagination";

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone_number: string | null;
  identification: string | null;
  identification_type: string | null;
  role: string;
  active: boolean;
  created_at: Date;
  total_orders: number;
  total_spent: number;
  average_spent: number;
  last_order_date: Date | null;
}

export interface FetchCustomersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  minOrders?: string;
  maxOrders?: string;
  minSpent?: string;
  maxSpent?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface FetchCustomersResponse {
  data: Customer[];
  pagination: Pagination;
}

export interface CustomerOrder {
  id: number;
  status: string;
  total: number;
  subtotal: number;
  shipping_cost: number;
  taxes: number;
  discount: number;
  coupon_discount: number;
  tracking_number: string | null;
  carrier: string | null;
  estimated_delivery_date: Date | null;
  created_at: Date;
  updated_at: Date | null;
  shipped_at: Date | null;
  delivered_at: Date | null;
  cancelled_at: Date | null;
  user_note: string | null;
  admin_notes: string | null;
  payment_method: string;
  payment_status: string;
  payment_reference: string;
  transaction_id: string | null;
  shipping_address: {
    address: string;
    city: string;
    department: string;
    country: string;
  };
  customer: {
    id: number;
    name: string;
    email: string;
    phone_number: string | null;
  };
  items: Array<{
    id: number;
    quantity: number;
    price: number;
    subtotal: number;
    color_code: string;
    size: string;
    product: {
      id: number;
      name: string;
      description: string;
      image_url: string | null;
    };
  }>;
}
