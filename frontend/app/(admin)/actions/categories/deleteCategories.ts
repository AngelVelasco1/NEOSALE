"use server";

import { apiClient } from "@/lib/api-client";
import { ServerActionResponse } from "@/types/server-action";

export async function deleteCategories(
  categoryIds: string[]
): Promise<ServerActionResponse> {
  try {
    const response = await apiClient.post(`/admin/categories/delete`, {
      categoryIds: categoryIds.map((id) => parseInt(id)),
    });

    if (!response.success) {
      return { success: false, error: response.error || "Something went wrong. Could not delete the categories." };
    }

    return { success: true };
  } catch (error) {
    console.error("[deleteCategories] Error:", error);
    return { success: false, error: "Something went wrong. Could not delete the categories." };
  }
}
