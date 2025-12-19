export type NotificationType = 
  | "low_stock"
  | "out_of_stock"
  | "new_order"
  | "order_status_change"
  | "new_review"
  | "system_alert"
  | "promotion";

export type Notification = {
  id: number;
  staff_id: number;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  related_entity_type?: string;
  related_entity_id?: number;
  is_read: boolean;
  read_at?: string;
  created_at: string;
};
