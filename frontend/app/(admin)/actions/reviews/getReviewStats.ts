"use server";

import { apiClient } from "@/lib/api-client";

export async function getReviewStats() {
  try {
    const response = await apiClient.get(`/admin/reviews/stats`);

    if (!response.success) {
      throw new Error(response.error || "Error al obtener estadísticas");
    }

    return response.data || {};
  } catch (error) {
    console.error("[getReviewStats] Error:", error);
    throw error;
  }
}
