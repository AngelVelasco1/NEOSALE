"use server";

import { apiClient } from "@/lib/api-client";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

export async function deleteCoupons(
  couponIds: number[]
): Promise<ServerActionResponse> {
  try {
    const response = await apiClient.post(`/api/admin/coupons/delete`, {
      couponIds,
    });

    if (!response.success) {
      return { success: false, error: response.error || "Something went wrong. Could not delete the coupons." };
    }

    return { success: true };
  } catch (error) {
    console.error("[deleteCoupons] Error:", error);
    return { success: false, error: "Something went wrong. Could not delete the coupons." };
  }
}
