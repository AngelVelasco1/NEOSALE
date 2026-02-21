"use server";

import { apiClient } from "@/lib/api-client";

type ExportResponse = { data: any[] } | { error: string };

export async function exportCustomers(): Promise<ExportResponse> {
  try {
    const response = await apiClient.get(`/api/admin/customers/export`);

    if (!response.success) {
      return { error: response.error || "Failed to fetch data for customers." };
    }

    return { data: (response.data || []) as any[] };
  } catch (error) {
    console.error("[exportCustomers] Error:", error);
    return { error: "Failed to fetch data for customers." };
  }
}
