"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/app/(auth)/auth";

export interface ReviewFilters {
  status?: "pending" | "approved" | "all";
  rating?: number;
  productId?: number;
  userId?: number;
  search?: string;
}

export async function getAllReviews(filters?: ReviewFilters) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      throw new Error("No autorizado");
    }

    const whereClause: any = {};

    // Filtrar por estado
    if (filters?.status === "pending") {
      whereClause.active = false;
    } else if (filters?.status === "approved") {
      whereClause.active = true;
    }

    // Filtrar por rating
    if (filters?.rating) {
      whereClause.rating = filters.rating;
    }

    // Filtrar por producto
    if (filters?.productId) {
      whereClause.product_id = filters.productId;
    }

    // Filtrar por usuario
    if (filters?.userId) {
      whereClause.user_id = filters.userId;
    }

    // Buscar por nombre de producto o usuario
    if (filters?.search) {
      whereClause.OR = [
        {
          products: {
            name: {
              contains: filters.search,
              mode: "insensitive",
            },
          },
        },
        {
          User: {
            name: {
              contains: filters.search,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    const reviews = await prisma.reviews.findMany({
      where: whereClause,
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        products: {
          select: {
            id: true,
            name: true,
            images: {
              take: 1,
              select: {
                image_url: true,
              },
            },
          },
        },
        orders: {
          select: {
            id: true,
            status: true,
            created_at: true,
          },
        },
        review_images: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return {
      success: true,
      reviews: reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        active: review.active,
        created_at: review.created_at,
        updated_at: review.updated_at,
        user: review.User,
        product: {
          ...review.products,
          image_url: review.products.images[0]?.image_url || null,
        },
        order: review.orders,
        images: review.review_images,
      })),
    };
  } catch (error: any) {
    console.error("Error al obtener reseñas:", error);
    return {
      success: false,
      error: error.message || "Error al obtener las reseñas",
    };
  }
}
