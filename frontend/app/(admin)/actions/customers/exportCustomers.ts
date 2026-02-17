"use server";

import { apiClient } from "@/lib/api-client";

export async function exportCustomers() {
  try {
    const response = await apiClient.get(`/admin/customers/export`);

    if (!response.success) {
      return { error: response.error || "Failed to fetch data for customers." };
    }

    return { data: response.data || [] };
  } catch (error) {
    console.error("[exportCustomers] Error:", error);
    return { error: "Failed to fetch data for customers." };
  }
}
