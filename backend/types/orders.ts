// Tipos para el sistema de órdenes y MercadoPago

export interface CreateOrderRequest {
  productId: number;
  quantity: number;
  colorCode?: string;
  size?: string;
}

export interface OrderItem {
  id: string;
  title: string;
  category_id?: string;
  quantity: number;
  currency_id: string;
  unit_price: number;
  picture_url?: string;
  description?: string;
}

export interface MercadoPagoPreference {
  items: OrderItem[];
  back_urls?: {
    success?: string;
    failure?: string;
    pending?: string;
  };
  notification_url?: string;
  external_reference?: string;
  payment_methods?: {
    excluded_payment_methods?: Array<{ id: string }>;
    excluded_payment_types?: Array<{ id: string }>;
  };
  payer?: {
    name?: string;
    surname?: string;
    email?: string;
    phone?: {
      area_code?: string;
      number?: string;
    };
  };
}

export interface OrderStatus {
  PENDING: 'pending';
  PROCESSING: 'processing';
  PAID: 'paid';
  SHIPPED: 'shipped';
  DELIVERED: 'delivered';
  CANCELLED: 'cancelled';
  REFUNDED: 'refunded';
}

export interface Order {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  colorCode?: string;
  size?: string;
  totalAmount: number;
  status: keyof OrderStatus;
  preferenceId?: string;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderResponse {
  order: Order;
  paymentLink: string;
  preferenceId: string;
}

export interface MercadoPagoWebhookData {
  id: string;
  live_mode: boolean;
  type: 'payment' | 'plan' | 'subscription' | 'invoice';
  date_created: string;
  application_id: number;
  user_id: number;
  version: number;
  api_version: string;
  action: string;
  data: {
    id: string;
  };
}

export interface PaymentStatus {
  PENDING: 'pending';
  APPROVED: 'approved';
  AUTHORIZED: 'authorized';
  IN_PROCESS: 'in_process';
  IN_MEDIATION: 'in_mediation';
  REJECTED: 'rejected';
  CANCELLED: 'cancelled';
  REFUNDED: 'refunded';
  CHARGED_BACK: 'charged_back';
}
