"use server";

import { apiClient } from "@/lib/api-client";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

export async function toggleProductPublishedStatus(
  productId: string,
  currentPublishedStatus: boolean
): Promise<ServerActionResponse> {
  try {
    const newPublishedStatus = !currentPublishedStatus;
    const response = await apiClient.patch(
      `/api/admin/products/${productId}/status`,
      { active: newPublishedStatus }
    );

    if (!response.success) {
      return { success: false, error: response.error || "Failed to update product status." };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update product status." };
  }
}
