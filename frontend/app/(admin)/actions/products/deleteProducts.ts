"use server";

import { apiClient } from "@/lib/api-client";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

export async function deleteProducts(
  productIds: string[]
): Promise<ServerActionResponse> {
  try {
    const response = await apiClient.delete(`/admin/products`, {
      body: { productIds: productIds.map(id => parseInt(id)) },
    });

    if (!response.success) {
      return { success: false, error: response.error || "Could not delete the products." };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: "Could not delete the products." };
  }
}
