"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

type CreateBrandResponse =
  | { success: true; brand: { id: number; name: string; image_url: string | null } }
  | { success: false; error: string };

export async function createBrand(
  name: string,
  description?: string,
  imageFile?: File
): Promise<CreateBrandResponse> {
  try {
    // Validate input
    if (!name || name.trim().length === 0) {
      return { success: false, error: "El nombre de la marca es requerido" };
    }

    const trimmedName = name.trim();

    // Check if brand already exists
    const existingBrand = await prisma.brands.findFirst({
      where: {
        name: {
          equals: trimmedName,
          mode: "insensitive",
        },
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
        console.error("Error uploading image:", error);
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
    console.error("Error creating brand:", error);
    return {
      success: false,
      error: "Error al crear la marca. Por favor intenta de nuevo.",
    };
  }
}
