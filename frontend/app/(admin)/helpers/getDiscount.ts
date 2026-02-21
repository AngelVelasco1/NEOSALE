import { Coupon } from "@/app/(admin)/services/coupons/types";

type Props = {
  coupon: Pick<Coupon, "discount_type" | "discount_value"> | null;
  totalAmount: number;
  shippingCost: number;
};

export function getDiscount({ coupon, totalAmount, shippingCost }: Props) {
  let calculatedDiscount = 0;

  if (coupon) {
    if (coupon.discount_type === "fixed") {
      calculatedDiscount = coupon.discount_value;
    } else {
      const subtotal = Math.max(totalAmount - shippingCost, 0);
      calculatedDiscount = (subtotal * coupon.discount_value) / 100;
    }
  }

  return calculatedDiscount.toFixed(2);
}
