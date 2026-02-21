"use server";

import { apiClient } from "@/lib/api-client";
import { ProductServerActionResponse } from "@/app/(admin)/types/server-action";

export async function editProduct(
  productId: string,
  formData: FormData
): Promise<ProductServerActionResponse> {
  try {
    const response = await apiClient.uploadFile(
      `/admin/products/${productId}`,
      formData
    );

    if (!response.success) {
      return { success: false, error: response.error || "Failed to update product" };
    }

    return { success: true, product: response.data };
  } catch (error) {
    console.error("[editProduct] Error:", error);
    return { success: false, error: "Something went wrong. Please try again later." };
  }
}
