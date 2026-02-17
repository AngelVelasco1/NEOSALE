"use server";

import { apiClient } from "@/lib/api-client";

export async function exportProducts() {
  try {
    const response = await apiClient.get(`/admin/products/export`);

    if (!response.success) {
      return { error: response.error || "Failed to fetch data for products." };
    }

    return { data: response.data || [] };
  } catch (error) {
    return { error: "Failed to fetch data for products." };
  }
}
