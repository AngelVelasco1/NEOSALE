"use server";

import { apiClient } from "@/lib/api-client";

type CreateBrandResponse =
  | { success: true; brand: { id: number; name: string; image_url?: string | null } }
  | { success: false; error: string };

export async function createBrand(
  name: string,
  description?: string,
  imageFile?: File
): Promise<CreateBrandResponse> {
  try {
    if (!name || name.trim().length === 0) {
      return { success: false, error: "El nombre de la marca es requerido" };
    }

    if (imageFile) {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description || "");
      formData.append("image", imageFile);

      const response = await apiClient.uploadFile(`/admin/brands`, formData);

      if (!response.success) {
        return { success: false, error: response.error || "Failed to create brand" };
      }

      return { success: true, brand: response.data as any };
    } else {
      const response = await apiClient.post(`/admin/brands`, {
        name: name.trim(),
        description: description || "",
      });

      if (!response.success) {
        return { success: false, error: response.error || "Failed to create brand" };
      }

      return { success: true, brand: response.data as any };
    }
  } catch (error) {
    console.error("[createBrand] Error:", error);
    return { success: false, error: "Something went wrong. Please try again later." };
  }
}
