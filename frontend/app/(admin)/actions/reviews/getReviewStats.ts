"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/app/(auth)/auth";

export async function getReviewStats() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      throw new Error("No autorizado");
    }

    // Obtener estadísticas generales
    const [totalReviews, pendingReviews, approvedReviews, avgRating] =
      await Promise.all([
        prisma.reviews.count(),
        prisma.reviews.count({ where: { active: false } }),
        prisma.reviews.count({ where: { active: true } }),
        prisma.reviews.aggregate({
          _avg: {
            rating: true,
          },
        }),
      ]);

    // Distribución de ratings
    const ratingDistribution = await prisma.reviews.groupBy({
      by: ["rating"],
      _count: {
        rating: true,
      },
      orderBy: {
        rating: "desc",
      },
    });

    // Reseñas recientes pendientes
    const recentPending = await prisma.reviews.findMany({
      where: { active: false },
      take: 5,
      orderBy: { created_at: "desc" },
      include: {
        User: {
          select: {
            name: true,
          },
        },
        products: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      success: true,
      stats: {
        total: totalReviews,
        pending: pendingReviews,
        approved: approvedReviews,
        averageRating: avgRating._avg.rating
          ? Number(avgRating._avg.rating.toFixed(1))
          : 0,
        ratingDistribution: ratingDistribution.map((item) => ({
          rating: item.rating,
          count: item._count.rating,
        })),
        recentPending: recentPending.map((review) => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          userName: review.User.name,
          productName: review.products.name,
          created_at: review.created_at,
        })),
      },
    };
  } catch (error: any) {
    console.error("Error al obtener estadísticas:", error);
    return {
      success: false,
      error: error.message || "Error al obtener las estadísticas",
    };
  }
}
