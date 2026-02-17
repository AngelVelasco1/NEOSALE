"use server";

import { apiClient } from "@/lib/api-client";

export async function exportCategories() {
  try {
    const response = await apiClient.get(`/admin/categories/export`);

    if (!response.success) {
      return { error: response.error || "Failed to fetch data for categories." };
    }

    return { data: response.data || [] };
  } catch (error) {
    console.error("[exportCategories] Error:", error);
    return { error: "Failed to fetch data for categories." };
  }
}
