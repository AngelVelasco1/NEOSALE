"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/app/(auth)/auth";
import { revalidatePath } from "next/cache";

export async function toggleReviewStatus(reviewId: number) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      throw new Error("No autorizado");
    }

    // Obtener el estado actual de la reseña
    const review = await prisma.reviews.findUnique({
      where: { id: reviewId },
      select: { active: true },
    });

    if (!review) {
      throw new Error("Reseña no encontrada");
    }

    // Cambiar el estado
    const updatedReview = await prisma.reviews.update({
      where: { id: reviewId },
      data: {
        active: !review.active,
        updated_at: new Date(),
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        products: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    revalidatePath("/dashboard/reviews");
    revalidatePath(`/products/${updatedReview.product_id}`);

    return {
      success: true,
      message: updatedReview.active
        ? "Reseña aprobada exitosamente"
        : "Reseña desaprobada exitosamente",
      review: updatedReview,
    };
  } catch (error: any) {
    console.error("Error al cambiar estado de reseña:", error);
    return {
      success: false,
      error: error.message || "Error al cambiar el estado de la reseña",
    };
  }
}
