"use server";

import { apiClient } from "@/lib/api-client";

type ExportResponse = { data: any[] } | { error: string };

export async function exportCoupons(): Promise<ExportResponse> {
  try {
    const response = await apiClient.get(`/admin/coupons/export`);

    if (!response.success) {
      return { error: response.error || "Failed to fetch data for coupons." };
    }

    return { data: (response.data || []) as any[] };
  } catch (error) {
    console.error("[exportCoupons] Error:", error);
    return { error: "Failed to fetch data for coupons." };
  }
}
