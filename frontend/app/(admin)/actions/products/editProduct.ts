"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { ProductServerActionResponse } from "@/app/(admin)/types/server-action";

export async function editProduct(
  productId: string,
  formData: FormData
): Promise<ProductServerActionResponse> {
  // TODO: Implementar con Prisma y validación completa
  // Este es un placeholder básico - debes agregar:
  // 1. Validación con Zod schema
  // 2. Upload de imágenes con Cloudinary
  // 3. Manejo de variantes de producto

  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    const updatedProduct = await prisma.products.update({
      where: { id: parseInt(productId) },
      data: {
        name,
        description,
        // TODO: Agregar más campos según tu schema
      },
    });

    revalidatePath("/products");
    revalidatePath(`/products/${updatedProduct.id}`);

    return { success: true, product: updatedProduct };
  } catch (error) {
    console.error("Database update failed:", error);
    return { success: false, error: "Something went wrong. Please try again later." };
  }
}
