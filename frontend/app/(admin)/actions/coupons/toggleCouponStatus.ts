"use server";

import { apiClient } from "@/lib/api-client";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

export async function toggleCouponActiveStatus(
  couponId: number,
  currentActiveStatus: boolean
): Promise<ServerActionResponse> {
  try {
    const newActiveStatus = !currentActiveStatus;

    const response = await apiClient.patch(`/admin/coupons/${couponId}/status`, {
      active: newActiveStatus,
    });

    if (!response.success) {
      return { success: false, error: response.error || "Failed to update coupon status." };
    }

    return { success: true };
  } catch (error) {
    console.error("[toggleCouponActiveStatus] Error:", error);
    return { success: false, error: "Failed to update coupon status." };
  }
}
