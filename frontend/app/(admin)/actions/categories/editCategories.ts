"use server";

import { apiClient } from "@/lib/api-client";
import { categoryBulkFormSchema } from "@/app/(admin)/dashboard/categories/_components/form/schema";
import { formatValidationErrors } from "@/app/(admin)/helpers/formatValidationErrors";
import { VServerActionResponse } from "@/app/(admin)/types/server-action";

export async function editCategories(
  categoryIds: string[],
  formData: FormData
): Promise<VServerActionResponse> {
  const parsedData = categoryBulkFormSchema.safeParse({
    published: !!(formData.get("published") === "true"),
  });

  if (!parsedData.success) {
    return {
      validationErrors: formatValidationErrors(
        parsedData.error.flatten().fieldErrors
      ),
    };
  }

  const { published } = parsedData.data;

  try {
    const response = await apiClient.put(`/admin/categories`, {
      categoryIds: categoryIds.map((id) => parseInt(id)),
      active: published,
    });

    if (!response.success) {
      return { success: false, error: response.error || "Failed to update categories" };
    }

    return { success: true };
  } catch (error) {
    console.error("[editCategories] Error:", error);
    return { success: false, error: "Something went wrong. Please try again later." };
  }
}
