import { OrderStatus } from "@/app/(admin)/services/orders/types";
import { ProductStatus } from "@/app/(admin)/services/products/types";
import { CouponStatus } from "@/app/(admin)/services/coupons/types";
import { StaffStatus } from "@/app/(admin)/services/staff/types";

export const OrderBadgeVariants: Record<OrderStatus, string> = {
  pending: "warning",
  processing: "processing",
  delivered: "success",
  cancelled: "destructive",
};

export const ProductBadgeVariants: Record<ProductStatus, string> = {
  selling: "success",
  "out-of-stock": "destructive",
};

export const CouponBadgeVariants: Record<CouponStatus, string> = {
  active: "success",
  expired: "destructive",
};

export const StaffBadgeVariants: Record<StaffStatus, string> = {
  active: "success",
  inactive: "destructive",
};
