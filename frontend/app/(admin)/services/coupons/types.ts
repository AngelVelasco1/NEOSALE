import { Pagination } from "@/types/pagination";

export type CouponStatus = "expired" | "active";

export type Coupon = {
  id: number;
  code: string;
  name: string;
  discount_type: string;
  discount_value: number;
  min_purchase_amount: number | null;
  usage_limit: number | null;
  usage_count: number | null;
  active: boolean;
  featured: boolean;
  created_by: number;
  created_at: Date;
  expires_at: Date;
  deleted_at: Date | null;
  deleted_by: number | null;
};

export interface FetchCouponsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  discountType?: string;
  featured?: string;
  minDiscount?: number;
  maxDiscount?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface FetchCouponsResponse {
  data: Coupon[];
  pagination: Pagination;
}
