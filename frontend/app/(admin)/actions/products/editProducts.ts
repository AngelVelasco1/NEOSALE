"use server";

import { apiClient } from "@/lib/api-client";
import { productBulkFormSchema } from "@/app/(admin)/dashboard/products/_components/form/schema";
import { formatValidationErrors } from "@/app/(admin)/helpers/formatValidationErrors";
import { VServerActionResponse } from "@/app/(admin)/types/server-action";

export async function editProducts(
  productIds: string[],
  formData: FormData
): Promise<VServerActionResponse> {
  const parsedData = productBulkFormSchema.safeParse({
    category:
      formData.get("category") === "" ? undefined : formData.get("category"),
    published:
      formData.get("published") === null
        ? undefined
        : !!(formData.get("published") === "true"),
  });

  if (!parsedData.success) {
    return {
      validationErrors: formatValidationErrors(
        parsedData.error.flatten().fieldErrors
      ),
    };
  }

  const { category, published } = parsedData.data;

  try {
    const updateData: any = {};
    if (category) {
      updateData.category_id = parseInt(category);
    }
    if (typeof published !== "undefined") {
      updateData.active = published;
    }

    const response = await apiClient.put(
      `/admin/products`,
      { productIds: productIds.map(id => parseInt(id)), ...updateData }
    );

    if (!response.success) {
      return { success: false, error: response.error || "Failed to update products" };
    }

    return { success: true };
  } catch (error) {
    console.error("[editProducts] Error:", error);
    return { success: false, error: "Something went wrong. Please try again later." };
  }
}
