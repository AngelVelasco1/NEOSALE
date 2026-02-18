"use server";

import { apiClient } from "@/lib/api-client";

type ExportResponse = { data: any[] } | { error: string };

export async function exportOrders(): Promise<ExportResponse> {
  try {
    const response = await apiClient.get(`/api/backend/orders/export`);

    if (!response.success) {
      return { error: response.error || "Failed to fetch data for orders." };
    }

    return { data: (response.data || []) as any[] };
  } catch (error) {
    console.error("[exportOrders] Error:", error);
    return { error: "Failed to fetch data for orders." };
  }
}
