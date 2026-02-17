"use server";

import { apiClient } from "@/lib/api-client";

export interface ReviewFilters {
  status?: "pending" | "approved" | "all";
  rating?: number;
  productId?: number;
  userId?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getAllReviews(filters: ReviewFilters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.rating) params.append("rating", filters.rating.toString());
    if (filters.productId) params.append("productId", filters.productId.toString());
    if (filters.userId) params.append("userId", filters.userId.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    const response = await apiClient.get(`/admin/reviews?${params.toString()}`);

    if (!response.success) {
      throw new Error(response.error || "Error al obtener las reseñas");
    }

    return response.data || [];
  } catch (error) {
    console.error("[getAllReviews] Error:", error);
    throw error;
  }
}
