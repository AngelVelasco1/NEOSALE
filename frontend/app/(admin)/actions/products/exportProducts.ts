"use server";

import { apiClient } from "@/lib/api-client";

type ExportResponse = { data: any[] } | { error: string };

export async function exportProducts(): Promise<ExportResponse> {
  try {
    const response = await apiClient.get(`/api/admin/products/export`);

    if (!response.success) {
      return { error: response.error || "Failed to fetch data for products." };
    }

    return { data: (response.data || []) as any[] };
  } catch (error) {
    return { error: "Failed to fetch data for products." };
  }
}
