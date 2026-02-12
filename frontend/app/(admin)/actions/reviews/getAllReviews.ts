"use server";

import { auth } from "@/app/(auth)/auth";

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
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      throw new Error("No autorizado");
    }

    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.rating) params.append("rating", filters.rating.toString());
    if (filters.productId) params.append("productId", filters.productId.toString());
    if (filters.userId) params.append("userId", filters.userId.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/admin/list?${params}`,
      {
        headers: {
          Authorization: `Bearer ${session?.user?.id}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener las reseñas");
    }

    return await response.json();
  } catch (error) {
    
    throw error;
  }
}
