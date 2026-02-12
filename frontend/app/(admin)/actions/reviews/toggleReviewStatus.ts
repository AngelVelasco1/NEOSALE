"use server";

import { auth } from "@/app/(auth)/auth";
import { revalidatePath } from "next/cache";

export async function toggleReviewStatus(reviewId: number, active: boolean) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      throw new Error("No autorizado");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/${reviewId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.id}`,
        },
        body: JSON.stringify({ active }),
      }
    );

    if (!response.ok) {
      throw new Error("Error al actualizar reseña");
    }

    revalidatePath("/dashboard/reviews");

    return {
      success: true,
      message: "Reseña actualizada exitosamente",
    };
  } catch (error: any) {
    
    throw error;
  }
}
