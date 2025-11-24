"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { ServerActionResponse } from "@/types/server-action";

export async function deleteCategory(
  categoryId: string
): Promise<ServerActionResponse> {
  try {
    const categoryIdInt = parseInt(categoryId);

    // Obtener la subcategoría relacionada antes de eliminar
    const category = await prisma.categories.findUnique({
      where: { id: categoryIdInt },
      select: { id_subcategory: true },
    });

    // Usar una transacción para eliminar todo en orden
    await prisma.$transaction(async (tx) => {
      // 1. Eliminar relaciones en category_subcategory
      await tx.category_subcategory.deleteMany({
        where: { category_id: categoryIdInt },
      });

      // 2. Eliminar productos asociados a esta categoría
      await tx.products.deleteMany({
        where: { category_id: categoryIdInt },
      });

      // 3. Eliminar la categoría
      await tx.categories.delete({
        where: { id: categoryIdInt },
      });

      // 4. Si tenía una subcategoría asociada, eliminarla también
      if (category?.id_subcategory) {
        // Primero eliminar las relaciones de la subcategoría
        await tx.category_subcategory.deleteMany({
          where: { subcategory_id: category.id_subcategory },
        });

        // Luego eliminar la subcategoría
        await tx.subcategories.delete({
          where: { id: category.id_subcategory },
        });
      }
    });

    revalidatePath("/categories");

    return { success: true };
  } catch (error) {
    console.error("Database delete failed:", error);
    return { dbError: "Something went wrong. Could not delete the category." };
  }
}
