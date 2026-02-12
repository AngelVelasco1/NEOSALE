"use server";

import { auth } from "@/app/(auth)/auth";
import { revalidatePath } from "next/cache";

export async function deleteReview(reviewId: number) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      throw new Error("No autorizado");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/${reviewId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.user?.id}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al eliminar reseña");
    }

    revalidatePath("/dashboard/reviews");

    return {
      success: true,
      message: "Reseña eliminada exitosamente",
    };
  } catch (error: any) {
    
    throw error;
  }
}
