"use server";

import { apiClient } from "@/lib/api-client";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

export async function deleteProduct(
  productId: string
): Promise<ServerActionResponse> {
  try {
    const response = await apiClient.delete(`/api/admin/products/${productId}`);

    if (!response.success) {
      return { success: false, error: response.error || "Could not delete the product." };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Something went wrong. Could not deactivate the product.",
    };
  }
}
