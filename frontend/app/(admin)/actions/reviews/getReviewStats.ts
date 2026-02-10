"use server";

import { auth } from "@/app/(auth)/auth";

export async function getReviewStats() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      throw new Error("No autorizado");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/admin/stats`,
      {
        headers: {
          Authorization: `Bearer ${session?.user?.id}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener estadísticas");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error:", error);
    throw error;
  }
}
