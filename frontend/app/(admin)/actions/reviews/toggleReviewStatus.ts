"use server";

import { apiClient } from "@/lib/api-client";

export async function toggleReviewStatus(reviewId: number, active: boolean) {
  try {
    const response = await apiClient.patch(`/admin/reviews/${reviewId}/status`, {
      active,
    });

    if (!response.success) {
      return { success: false, error: response.error || "Error al actualizar reseña" };
    }

    return { success: true, message: "Reseña actualizada exitosamente" };
  } catch (error) {
    console.error("[toggleReviewStatus] Error:", error);
    return { success: false, error: "Error al actualizar reseña" };
  }
}
