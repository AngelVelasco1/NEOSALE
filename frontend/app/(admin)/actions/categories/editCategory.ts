"use server";

import { apiClient } from "@/lib/api-client";
import { categoryFormSchema } from "@/app/(admin)/dashboard/categories/_components/form/schema";
import { formatValidationErrors } from "@/app/(admin)/helpers/formatValidationErrors";
import { CategoryServerActionResponse } from "@/app/(admin)/types/server-action";

export async function editCategory(
  categoryId: string,
  formData: FormData
): Promise<CategoryServerActionResponse> {
  const parsedData = categoryFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsedData.success) {
    return {
      validationErrors: formatValidationErrors(
        parsedData.error.flatten().fieldErrors
      ),
    };
  }

  const categoryData = parsedData.data;

  try {
    const response = await apiClient.put(`/admin/categories/${categoryId}`, categoryData);

    if (!response.success) {
      if (response.validationErrors) {
        return { validationErrors: response.validationErrors };
      }
      return { success: false, error: response.error || "Failed to update category" };
    }

    return { success: true, category: response.data };
  } catch (error) {
    console.error("[editCategory] Error:", error);
    return { success: false, error: "Something went wrong. Please try again later." };
  }
}
