export interface Coupon {
  id: number;
  code: string;
  name: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_purchase_amount: number;
  usage_limit: number | null;
  usage_count: number | null;
  active: boolean;
  expires_at: string;
  created_at: string;
}

export interface CouponValidationResponse {
  valid: boolean;
  coupon?: Coupon;
  discount_amount?: number;
  error?: string;
}

export interface AppliedCoupon {
  coupon: Coupon;
  discount_amount: number;
}
