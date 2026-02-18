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

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
  verified_purchase: boolean;
  helpful_count: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  products?: { name: string };
  User?: { name: string; email: string };
}

export async function getAllReviews(filters: ReviewFilters = {}): Promise<{ success: boolean; reviews?: Review[]; error?: string }> {
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

    return {
      success: true,
      reviews: (response.data as unknown as Review[]) || [],
    };
  } catch (error) {
    console.error("[getAllReviews] Error:", error);
    return {
      success: false,
      reviews: [],
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
