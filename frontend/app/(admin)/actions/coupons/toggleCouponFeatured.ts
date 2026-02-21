"use server";

import { apiClient } from "@/lib/api-client";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

export async function toggleCouponFeatured(
  couponId: number,
  currentFeaturedStatus: boolean
): Promise<ServerActionResponse> {
  try {
    const newFeaturedStatus = !currentFeaturedStatus;

    const response = await apiClient.patch(`/admin/coupons/${couponId}/featured`, {
      featured: newFeaturedStatus,
    });

    if (!response.success) {
      return { success: false, error: response.error || "Failed to update coupon featured status." };
    }

    return { success: true };
  } catch (error) {
    console.error("[toggleCouponFeatured] Error:", error);
    return { success: false, error: "Failed to update coupon featured status." };
  }
}
