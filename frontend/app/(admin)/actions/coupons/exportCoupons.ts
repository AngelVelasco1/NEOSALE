"use server";

import { apiClient } from "@/lib/api-client";

export async function exportCoupons() {
  try {
    const response = await apiClient.get(`/admin/coupons/export`);

    if (!response.success) {
      return { error: response.error || "Failed to fetch data for coupons." };
    }

    return { data: response.data || [] };
  } catch (error) {
    console.error("[exportCoupons] Error:", error);
    return { error: "Failed to fetch data for coupons." };
  }
}
