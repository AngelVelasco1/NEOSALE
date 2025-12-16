"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/app/(auth)/auth";
import { revalidatePath } from "next/cache";

export async function deleteReview(reviewId: number) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      throw new Error("No autorizado");
    }

    // Verificar que la reseña existe
    const review = await prisma.reviews.findUnique({
      where: { id: reviewId },
      select: {
        id: true,
        product_id: true,
      },
    });

    if (!review) {
      throw new Error("Reseña no encontrada");
    }

    // Eliminar la reseña (las imágenes se eliminan en cascada)
    await prisma.reviews.delete({
      where: { id: reviewId },
    });

    revalidatePath("/dashboard/reviews");
    revalidatePath(`/products/${review.product_id}`);

    return {
      success: true,
      message: "Reseña eliminada exitosamente",
    };
  } catch (error: any) {
    console.error("Error al eliminar reseña:", error);
    return {
      success: false,
      error: error.message || "Error al eliminar la reseña",
    };
  }
}
