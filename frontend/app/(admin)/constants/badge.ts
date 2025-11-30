import { OrderStatus } from "@/app/(admin)/services/orders/types";
import { ProductStatus } from "@/app/(admin)/services/products/types";
import { CouponStatus } from "@/app/(admin)/services/coupons/types";
import { StaffStatus } from "@/app/(admin)/services/staff/types";

type BadgeVariant =
  | "default"
  | "success"
  | "secondary"
  | "destructive"
  | "outline";

export const OrderBadgeVariants: Record<OrderStatus, BadgeVariant> = {
  pending: "default",
  paid: "success",
  processing: "secondary",
  shipped: "secondary",
  delivered: "success",
  cancelled: "destructive",
  refunded: "destructive",
};

export const ProductBadgeVariants: Record<ProductStatus, BadgeVariant> = {
  selling: "success",
  "out-of-stock": "destructive",
};

export const CouponBadgeVariants: Record<CouponStatus, BadgeVariant> = {
  active: "success",
  expired: "destructive",
};

export const StaffBadgeVariants: Record<StaffStatus, BadgeVariant> = {
  active: "success",
  inactive: "destructive",
};
