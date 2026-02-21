"use server";

import { apiClient } from "@/lib/api-client";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

export async function deleteCoupon(
  couponId: number
): Promise<ServerActionResponse> {
  try {
    const response = await apiClient.delete(`/admin/coupons/${couponId}`);

    if (!response.success) {
      return { success: false, error: response.error || "Something went wrong. Could not delete the coupon." };
    }

    return { success: true };
  } catch (error) {
    console.error("[deleteCoupon] Error:", error);
    return { success: false, error: "Something went wrong. Could not delete the coupon." };
  }
}
