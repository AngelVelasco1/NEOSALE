"use server";

import { apiClient } from "@/lib/api-client";
import { categoryFormSchema } from "@/app/(admin)/dashboard/categories/_components/form/schema";
import { formatValidationErrors } from "@/app/(admin)/helpers/formatValidationErrors";
import { CategoryServerActionResponse } from "@/app/(admin)/types/server-action";
import { z } from "zod";

export async function addCategory(
  formData: FormData
): Promise<CategoryServerActionResponse> {
  try {
    const parsedData = categoryFormSchema
      .extend({
        subcategories: z.string().optional(),
      })
      .safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        subcategories: formData.get("subcategories"),
      });

    if (!parsedData.success) {
      return {
        validationErrors: formatValidationErrors(
          parsedData.error.flatten().fieldErrors
        ),
      };
    }

    const response = await apiClient.post(`/admin/categories`, {
      name: parsedData.data.name,
      description: parsedData.data.description,
    });

    if (!response.success) {
      if (response.validationErrors) {
        return { validationErrors: response.validationErrors };
      }
      return { success: false, error: response.error || "Failed to create category" };
    }

    return { success: true, category: response.data };
  } catch (error) {
    console.error("[addCategory] Error:", error);
    return { success: false, error: "Something went wrong. Please try again later." };
  }
}
