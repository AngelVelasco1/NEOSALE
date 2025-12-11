import { FRONT_CONFIG } from "@/config/credentials.js";

export interface ReviewableProduct {
  order_id: number;
  order_date: Date | null;
  product_id: number;
  product_name: string;
  product_image: string | null;
  price: number;
  quantity: number;
  color_code: string;
  size: string;
}

export interface CanReviewResponse {
  can_review: boolean;
  reason?: string;
}

export interface CreateReviewData {
  user_id: number;
  product_id: number;
  order_id: number;
  rating: number;
  comment?: string;
}

/**
 * Obtiene los productos que el usuario puede reseñar (de órdenes entregadas)
 */
export async function getReviewableProducts(
  userId: number
): Promise<ReviewableProduct[]> {
  const response = await fetch(
    `${FRONT_CONFIG.api_origin}/api/reviews/reviewable/${userId}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Error al obtener productos para reseñar");
  }

  return response.json();
}

/**
 * Verifica si el usuario puede dejar una reseña para un producto específico
 */
export async function canUserReview(
  userId: number,
  productId: number,
  orderId: number
): Promise<CanReviewResponse> {
  const response = await fetch(
    `${FRONT_CONFIG.api_origin}/api/reviews/can-review/${userId}/${productId}/${orderId}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Error al verificar permisos de reseña");
  }

  return response.json();
}

/**
 * Crea una nueva reseña
 */
export async function createReview(data: CreateReviewData) {
  const response = await fetch(
    `${FRONT_CONFIG.api_origin}/api/reviews/createReview`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al crear reseña");
  }

  return response.json();
}
