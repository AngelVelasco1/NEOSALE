"use server";

import { apiClient } from "@/lib/api-client";

type ExportResponse = { data: any[] } | { error: string };

export async function exportCategories(): Promise<ExportResponse> {
  try {
    const response = await apiClient.get(`/api/admin/categories/export`);

    if (!response.success) {
      return { error: response.error || "Failed to fetch data for categories." };
    }

    return { data: (response.data || []) as any[] };
  } catch (error) {
    console.error("[exportCategories] Error:", error);
    return { error: "Failed to fetch data for categories." };
  }
}
