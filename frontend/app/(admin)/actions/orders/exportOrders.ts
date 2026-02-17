"use server";

import { apiClient } from "@/lib/api-client";

export async function exportOrders() {
  try {
    const response = await apiClient.get(`/admin/orders/export`);

    if (!response.success) {
      return { error: response.error || "Failed to fetch data for orders." };
    }

    return { data: response.data || [] };
  } catch (error) {
    console.error("[exportOrders] Error:", error);
    return { error: "Failed to fetch data for orders." };
  }
}
