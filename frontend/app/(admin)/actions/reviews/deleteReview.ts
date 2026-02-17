"use server";

import { apiClient } from "@/lib/api-client";

export async function deleteReview(reviewId: number) {
  try {
    const response = await apiClient.delete(`/admin/reviews/${reviewId}`);

    if (!response.success) {
      return { success: false, error: response.error || "Error al eliminar reseña" };
    }

    return { success: true, message: "Reseña eliminada exitosamente" };
  } catch (error) {
    console.error("[deleteReview] Error:", error);
    return { success: false, error: "Error al eliminar reseña" };
  }
}
