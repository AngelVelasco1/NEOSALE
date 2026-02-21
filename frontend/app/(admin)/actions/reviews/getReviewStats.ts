"use server";

import { apiClient } from "@/lib/api-client";

interface ReviewStats {
  total: number;
  pending: number;
  approved: number;
  averageRating: number;
  ratingDistribution: { rating: number; count: number }[];
}

export async function getReviewStats(): Promise<{ success: boolean; stats?: ReviewStats }> {
  try {
    const response = await apiClient.get(`/api/admin/reviews/stats`);

    if (!response.success) {
      throw new Error(response.error || "Error al obtener estadísticas");
    }

    return {
      success: true,
      stats: response.data as unknown as ReviewStats,
    };
  } catch (error) {
    console.error("[getReviewStats] Error:", error);
    return {
      success: false,
    };
  }
}
