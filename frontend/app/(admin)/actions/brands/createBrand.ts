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

      return { success: true, brand: response.data };
    } else {
      const response = await apiClient.post(`/admin/brands`, {
        name: name.trim(),
        description: description || "",
      });

      if (!response.success) {
        return { success: false, error: response.error || "Failed to create brand" };
      }

      return { success: true, brand: response.data };
    }
  } catch (error) {
    console.error("[createBrand] Error:", error);
    return { success: false, error: "Something went wrong. Please try again later." };
  }
}
        deleted_at: null,
      },
    });

    if (existingBrand) {
      return { success: false, error: "Una marca con este nombre ya existe" };
    }

    // Upload image if provided
    let imageUrl: string | null = null;
    if (imageFile) {
      try {
        imageUrl = await uploadImageToCloudinary(imageFile, "brands");
      } catch (error) {
        
        return { success: false, error: "Error al subir la imagen" };
      }
    }

    // Create the brand
    const brand = await prisma.brands.create({
      data: {
        name: trimmedName,
        description: description?.trim() || null,
        image_url: imageUrl,
        active: true,
      },
      select: {
        id: true,
        name: true,
        image_url: true,
      },
    });

    // Revalidate relevant paths
    revalidatePath("/dashboard/products");
    revalidatePath("/dashboard/brands");
    revalidatePath("/brands");

    return { success: true, brand };
  } catch (error) {
    
    return {
      success: false,
      error: "Error al crear la marca. Por favor intenta de nuevo.",
    };
  }
}
