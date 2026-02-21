"use server";

import { apiClient } from "@/lib/api-client";

export async function getBrandsDropdown() {
  try {
    const response = await apiClient.get(`/api/admin/brands`);

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch brands");
    }

    return response.data || [];
  } catch (error) {
    console.error("[getBrandsDropdown] Error:", error);
    return [];
  }
}
