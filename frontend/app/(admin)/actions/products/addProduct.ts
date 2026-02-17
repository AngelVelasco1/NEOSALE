"use server";

import { apiClient } from "@/lib/api-client";
import { productFormSchema } from "@/app/(admin)/dashboard/products/_components/form/schema";
import { formatValidationErrors } from "@/app/(admin)/helpers/formatValidationErrors";
import { ProductServerActionResponse } from "@/app/(admin)/types/server-action";

export async function addProduct(
  formData: FormData
): Promise<ProductServerActionResponse> {
  const formDataObject = {
    name: formData.get("name"),
    description: formData.get("description"),
    image: formData.get("image"),
    sku: formData.get("sku"),
    category: formData.get("category"),
    subcategory: formData.get("subcategory"),
    brand: formData.get("brand"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    weight_grams: formData.get("weight_grams"),
    sizes: formData.get("sizes"),
    color: formData.get("color"),
    color_code: formData.get("color_code"),
  };

  const parsedData = productFormSchema.safeParse(formDataObject);

  if (!parsedData.success) {
    return {
      validationErrors: formatValidationErrors(
        parsedData.error.flatten().fieldErrors
      ),
    };
  }

  try {
    const response = await apiClient.uploadFile(
      `/admin/products`,
      formData
    );

    if (!response.success) {
      return { success: false, error: response.error || "Failed to create product" };
    }

    return { success: true, product: response.data };
  } catch (error) {
    console.error("[addProduct] Error:", error);
    return { success: false, error: "Something went wrong. Please try again later." };
  }
}
