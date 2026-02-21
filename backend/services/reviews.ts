import { prisma } from "../lib/prisma.js";
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
  handlePrismaError,
} from "../errors/errorsClass.js";
import { notifyNewReview } from "./notifications.js";

export interface CreateReviewData {
  user_id: number;
  product_id: number;
  rating: number;
  comment?: string;
  images?: string[];
  order_id?: number;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

export const getReviewsService = async (
  productId?: number,
  userId?: number
) => {
  // Validación ANTES del try-catch
  if (productId && productId <= 0) {
    throw new ValidationError("ID de producto inválido");
  }
  if (userId && userId <= 0) {
    throw new ValidationError("ID de usuario inválido");
  }

  const whereClause: any = { active: true }; // Solo reseñas aprobadas

  if (productId) whereClause.product_id = productId;
  if (userId) whereClause.user_id = userId;

  try {
    const reviews = await prisma.reviews.findMany({
      where: whereClause,
      include: {
        User: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        products: {
          select: {
            id: true,
            name: true,
          },
        },
        review_images: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return reviews.map((review: any) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      created_at: review.created_at,
      updated_at: review.updated_at,
      user: review.User,
      product: review.products,
      images: review.review_images,
    }));
  } catch (error: any) {
    console.error(
      `[getReviewsService] Error al obtener reseñas (productId: ${productId}, userId: ${userId}):`,
      error
    );
    throw handlePrismaError(error);
  }
};

export const getReviewByIdService = async (id: number) => {
  // Validación ANTES del try-catch
  if (!id || id <= 0) {
    throw new ValidationError("ID de reseña inválido");
  }

  try {
    const review = await prisma.reviews.findUnique({
      where: { id },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        products: {
          select: {
            id: true,
            name: true,
          },
        },
        review_images: true,
      },
    });

    if (!review) {
      throw new NotFoundError("Reseña no encontrada");
    }

    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      created_at: review.created_at,
      updated_at: review.updated_at,
      user: review.User,
      product: review.products,
      images: review.review_images,
    };
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    console.error(`[getReviewByIdService] Error al obtener reseña ${id}:`, error);
    throw handlePrismaError(error);
  }
};

export const createReviewService = async (data: CreateReviewData) => {
  // Validación ANTES del try-catch
  if (!data.user_id || data.user_id <= 0) {
    throw new ValidationError("ID de usuario inválido");
  }
  if (!data.product_id || data.product_id <= 0) {
    throw new ValidationError("ID de producto inválido");
  }
  if (!data.rating || data.rating < 1 || data.rating > 5) {
    throw new ValidationError("La calificación debe estar entre 1 y 5");
  }
  if (data.images && !Array.isArray(data.images)) {
    throw new ValidationError("Las imágenes deben ser un array");
  }
  if (data.images && data.images.length > 5) {
    throw new ValidationError("No se pueden agregar más de 5 imágenes por reseña");
  }

  try {
    // Usar el stored procedure para crear la review con order_id
    const result = await prisma.$queryRaw<{ sp_create_review: number }[]>`
      SELECT sp_create_review(
        ${data.rating}::INTEGER, 
        ${data.comment || null}::TEXT, 
        ${data.user_id}::INTEGER, 
        ${data.product_id}::INTEGER,
        ${data.order_id || null}::INTEGER
      ) as sp_create_review
    `;

    const reviewId = result[0]?.sp_create_review;

    if (!reviewId) {
      throw new Error("No se recibió ID de la reseña");
    }

    // Si hay imágenes, agregarlas usando stored procedure
    if (data.images && data.images.length > 0) {
      await prisma.$executeRaw`
        CALL sp_add_review_images(
          ${reviewId}::INTEGER, 
          ${data.user_id}::INTEGER, 
          ${data.images}::TEXT[]
        )
      `;
    }

    // Obtener directamente con Prisma en lugar de usar el servicio
    const completeReview = await prisma.reviews.findUnique({
      where: { id: reviewId },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        products: {
          select: {
            id: true,
            name: true,
          },
        },
        review_images: true,
      },
    });

    if (!completeReview) {
      throw new Error("No se pudo recuperar la reseña creada");
    }

    // 🔔 Notificar a todos los admins sobre la nueva reseña
    try {
      await notifyNewReview(
        data.product_id,
        completeReview.products?.name || "Producto",
        data.rating
      );
    } catch (notifyError) {
      console.error("[createReviewService] Error al crear notificación de nueva reseña:", notifyError);
      // No lanzar error, la notificación es opcional
    }

    return {
      id: completeReview.id,
      rating: completeReview.rating,
      comment: completeReview.comment,
      created_at: completeReview.created_at,
      updated_at: completeReview.updated_at,
      user: completeReview.User,
      product: completeReview.products,
      images: completeReview.review_images,
    };
  } catch (error: any) {
    if (error instanceof ValidationError) {
      throw error;
    }
    console.error(`[createReviewService] Error al crear reseña para producto ${data.product_id}:`, error);
    throw handlePrismaError(error);
  }
};

export const updateReviewService = async (
  id: number,
  userId: number,
  data: UpdateReviewData
) => {
  // Validación ANTES del try-catch
  if (!id || id <= 0) {
    throw new ValidationError("ID de reseña inválido");
  }
  if (!userId || userId <= 0) {
    throw new ValidationError("ID de usuario inválido");
  }
  if (data.rating && (data.rating < 1 || data.rating > 5)) {
    throw new ValidationError("La calificación debe estar entre 1 y 5");
  }

  try {
    // Verificar que la review existe y que el usuario es el propietario
    const review = await prisma.reviews.findUnique({
      where: { id },
      select: { user_id: true }
    });

    if (!review) {
      throw new NotFoundError("Reseña no encontrada");
    }

    if (review.user_id !== userId) {
      throw new ForbiddenError("No tienes permisos para modificar esta reseña");
    }

    // Actualizar solo los campos proporcionados (order_id no se puede modificar)
    const updateData: any = {};

    if (data.rating !== undefined) {
      updateData.rating = data.rating;
    }

    if (data.comment !== undefined) {
      updateData.comment = data.comment;
    }

    await prisma.reviews.update({
      where: { id },
      data: {
        ...updateData,
        updated_at: new Date()
      }
    });

    // Retornar la review actualizada
    return getReviewByIdService(id);
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof ValidationError) {
      throw error;
    }
    console.error(`[updateReviewService] Error al actualizar reseña ${id}:`, error);
    throw handlePrismaError(error);
  }
};

export const deleteReviewService = async (id: number, userId: number) => {
  // Validación ANTES del try-catch
  if (!id || id <= 0) {
    throw new ValidationError("ID de reseña inválido");
  }
  if (!userId || userId <= 0) {
    throw new ValidationError("ID de usuario inválido");
  }

  try {
    // Verificar que la review existe y que el usuario es el propietario en una sola consulta
    const review = await prisma.reviews.findUnique({
      where: { id },
      select: { user_id: true }
    });

    if (!review) {
      throw new NotFoundError("Reseña no encontrada");
    }

    if (review.user_id !== userId) {
      throw new ForbiddenError("No tienes permisos para eliminar esta reseña");
    }

    // Eliminar la review (las imágenes se eliminan en cascada por FK)
    await prisma.reviews.delete({
      where: { id }
    });

    return { message: "Reseña eliminada exitosamente" };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      throw error;
    }
    console.error(`[deleteReviewService] Error al eliminar reseña ${id}:`, error);
    throw handlePrismaError(error);
  }
};

export const getProductReviewStatsService = async (productId: number) => {
  // Validación ANTES del try-catch
  if (!productId || productId <= 0) {
    throw new ValidationError("ID de producto inválido");
  }

  try {
    const stats = await prisma.reviews.aggregate({
      where: {
        product_id: productId,
        active: true, // Solo reseñas aprobadas
      },
      _avg: {
        rating: true,
      },
      _count: {
        id: true,
      },
    });

    const ratingDistribution = await prisma.reviews.groupBy({
      by: ["rating"],
      where: {
        product_id: productId,
        active: true, // Solo reseñas aprobadas
      },
      _count: {
        rating: true,
      },
    });

    return {
      average_rating: stats._avg.rating
        ? Number(stats._avg.rating.toFixed(1))
        : 0,
      total_reviews: stats._count.id,
      rating_distribution: ratingDistribution.map((item: any) => ({
        rating: item.rating,
        count: item._count.rating,
      })),
    };
  } catch (error: any) {
    console.error(`[getProductReviewStatsService] Error al obtener estadísticas de reseñas del producto ${productId}:`, error);
    throw handlePrismaError(error);
  }
};

export const getUserReviewsService = async (userId: number) => {
  // Validación ANTES del try-catch
  if (!userId || userId <= 0) {
    throw new ValidationError("ID de usuario inválido");
  }

  try {
    const reviews = await prisma.reviews.findMany({
      where: { user_id: userId },
      include: {
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
        review_images: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return reviews.map((review: any) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      created_at: review.created_at,
      updated_at: review.updated_at,
      product: {
        ...review.products,
        image_url: review.products.images[0]?.image_url,
      },
      images: review.review_images,
    }));
  } catch (error: any) {
    console.error(`[getUserReviewsService] Error al obtener reseñas del usuario ${userId}:`, error);
    throw handlePrismaError(error);
  }
};

// Servicio para agregar imágenes a una review existente
export const addReviewImagesService = async (
  reviewId: number,
  userId: number,
  images: string[]
) => {
  // Validación ANTES del try-catch
  if (!reviewId || reviewId <= 0) {
    throw new ValidationError("ID de reseña inválido");
  }
  if (!userId || userId <= 0) {
    throw new ValidationError("ID de usuario inválido");
  }
  if (!images || !Array.isArray(images) || images.length === 0) {
    throw new ValidationError("Se debe proporcionar al menos una imagen");
  }
  if (images.length > 5) {
    throw new ValidationError("No se pueden agregar más de 5 imágenes por reseña");
  }

  try {
    // Verificar que la review existe y que el usuario es el propietario
    const review = await prisma.reviews.findUnique({
      where: { id: reviewId },
      select: {
        user_id: true,
        review_images: {
          select: { id: true } // Solo contar
        }
      }
    });

    if (!review) {
      throw new NotFoundError("Reseña no encontrada");
    }

    if (review.user_id !== userId) {
      throw new ForbiddenError("No tienes permisos para modificar esta reseña");
    }

    // Verificar límite de imágenes (máximo 5 por review)
    const currentImageCount = review.review_images.length;
    if (currentImageCount + images.length > 5) {
      throw new ValidationError(
        `No se pueden agregar más de 5 imágenes por reseña. Actualmente tienes ${currentImageCount}, intentas agregar ${images.length}.`
      );
    }

    // Filtrar URLs válidas y crear imágenes
    const validImages = images
      .map(url => url?.trim())
      .filter((url): url is string => url !== null && url !== undefined && url.length > 0);

    if (validImages.length === 0) {
      throw new ValidationError("No se proporcionaron URLs de imagen válidas");
    }

    // Insertar las imágenes en una sola consulta
    await prisma.review_images.createMany({
      data: validImages.map(image_url => ({
        review_id: reviewId,
        image_url
      }))
    });

    // Retornar la review actualizada con las nuevas imágenes
    return getReviewByIdService(reviewId);
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof ValidationError) {
      throw error;
    }
    console.error(`[addReviewImagesService] Error al agregar imágenes a la reseña ${reviewId}:`, error);
    throw handlePrismaError(error);
  }
};

// Servicio para eliminar una imagen específica de una review
export const deleteReviewImageService = async (
  imageId: number,
  userId: number
) => {
  // Validación ANTES del try-catch
  if (!imageId || imageId <= 0) {
    throw new ValidationError("ID de imagen inválido");
  }
  if (!userId || userId <= 0) {
    throw new ValidationError("ID de usuario inválido");
  }

  try {
    // Obtener la imagen con la review asociada para validar ownership
    const image = await prisma.review_images.findUnique({
      where: { id: imageId },
      select: {
        reviews: {
          select: { user_id: true }
        }
      }
    });

    if (!image) {
      throw new NotFoundError("Imagen de reseña no encontrada");
    }

    if (image.reviews.user_id !== userId) {
      throw new ForbiddenError("No tienes permisos para eliminar esta imagen");
    }

    // Eliminar la imagen
    await prisma.review_images.delete({
      where: { id: imageId }
    });

    return { message: "Imagen eliminada exitosamente" };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      throw error;
    }
    console.error(`[deleteReviewImageService] Error al eliminar imagen ${imageId}:`, error);
    throw handlePrismaError(error);
  }
};

// Interfaz para productos reseñables
export interface ReviewableProduct {
  product_id: number;
  product_name: string;
  product_image: string | null;
  order_id: number;
  order_date: Date;
  color_code: string;
  size: string;
}

// Servicio para obtener productos que el usuario puede reseñar
export const getReviewableProductsService = async (
  userId: number
): Promise<ReviewableProduct[]> => {
  // Validación ANTES del try-catch
  if (!userId || userId <= 0) {
    throw new ValidationError("ID de usuario inválido");
  }

  try {
    // Obtener todas las órdenes entregadas del usuario
    const deliveredOrders = await prisma.orders.findMany({
      where: {
        user_id: userId,
        status: "delivered",
      },
      include: {
        order_items: {
          include: {
            products: {
              include: {
                images: {
                  take: 1,
                },
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // Obtener todas las reseñas que el usuario ya hizo
    const existingReviews = await prisma.reviews.findMany({
      where: { user_id: userId },
      select: {
        product_id: true,
        order_id: true,
      },
    });

    // Crear un Set para búsqueda rápida de reseñas existentes
    const reviewedSet = new Set(
      existingReviews.map((r) => `${r.product_id}-${r.order_id}`)
    );

    // Extraer productos únicos de las órdenes que no han sido reseñados
    const reviewableProducts: ReviewableProduct[] = [];

    for (const order of deliveredOrders) {
      for (const item of order.order_items) {
        const key = `${item.product_id}-${order.id}`;

        // Solo agregar si no ha sido reseñado
        if (!reviewedSet.has(key)) {
          reviewableProducts.push({
            product_id: item.product_id,
            product_name: item.products.name,
            product_image: item.products.images[0]?.image_url || null,
            order_id: order.id,
            order_date: order.created_at,
            color_code: item.color_code,
            size: item.size,
          });
        }
      }
    }

    return reviewableProducts;
  } catch (error: any) {
    console.error(`[getReviewableProductsService] Error al obtener productos reseñables para usuario ${userId}:`, error);
    throw handlePrismaError(error);
  }
};

// Servicio para verificar si un usuario puede reseñar un producto específico
export const canUserReviewService = async (
  userId: number,
  productId: number,
  orderId: number
): Promise<{ can_review: boolean; reason?: string }> => {
  // Validación ANTES del try-catch
  if (!userId || userId <= 0) {
    throw new ValidationError("ID de usuario inválido");
  }
  if (!productId || productId <= 0) {
    throw new ValidationError("ID de producto inválido");
  }
  if (!orderId || orderId <= 0) {
    throw new ValidationError("ID de orden inválido");
  }

  try {
    // Verificar que la orden existe y pertenece al usuario
    const order = await prisma.orders.findFirst({
      where: {
        id: orderId,
        user_id: userId,
      },
      include: {
        order_items: {
          where: {
            product_id: productId,
          },
        },
      },
    });

    if (!order) {
      return {
        can_review: false,
        reason: "Orden no encontrada o no pertenece al usuario",
      };
    }

    if (order.order_items.length === 0) {
      return {
        can_review: false,
        reason: "El producto no está en esta orden",
      };
    }

    if (order.status !== "delivered") {
      return {
        can_review: false,
        reason: "La orden aún no ha sido entregada",
      };
    }

    // Verificar si ya existe una reseña para este producto en esta orden
    const existingReview = await prisma.reviews.findFirst({
      where: {
        user_id: userId,
        product_id: productId,
        order_id: orderId,
      },
    });

    if (existingReview) {
      return {
        can_review: false,
        reason: "Ya has reseñado este producto en esta orden",
      };
    }

    return { can_review: true };
  } catch (error: any) {
    console.error(
      `[canUserReviewService] Error al verificar permisos de reseña (usuario: ${userId}, producto: ${productId}, orden: ${orderId}):`,
      error
    );
    throw handlePrismaError(error);
  }
};

// ============================================
// ADMIN FUNCTIONS - Reviews
// ============================================

interface AdminReviewsQueryParams {
  page?: number;
  limit?: number;
  status?: "active" | "inactive";
  rating?: number;
  productId?: number;
  userId?: number;
  search?: string;
}

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const getPaginationParams = (page?: number, limit?: number) => {
  const safeLimit = Math.min(limit || DEFAULT_LIMIT, MAX_LIMIT);
  const safePage = Math.max(page || 1, 1);
  return { skip: (safePage - 1) * safeLimit, take: safeLimit, limit: safeLimit };
};

// GET - Admin Reviews List (with filtering)
export const getReviewsAdminService = async (params: AdminReviewsQueryParams) => {
  const { skip, take, limit } = getPaginationParams(params.page, params.limit);

  try {
    const where: any = {};

    // Filter by active status
    if (params.status === "active") {
      where.active = true;
    } else if (params.status === "inactive") {
      where.active = false;
    }

    // Filter by rating
    if (params.rating && params.rating > 0 && params.rating <= 5) {
      where.rating = params.rating;
    }

    // Filter by product
    if (params.productId && params.productId > 0) {
      where.product_id = params.productId;
    }

    // Filter by user
    if (params.userId && params.userId > 0) {
      where.user_id = params.userId;
    }

    // Search in comment
    if (params.search?.trim()) {
      where.comment = { contains: params.search.trim(), mode: "insensitive" };
    }

    const [reviews, total] = await Promise.all([
      prisma.reviews.findMany({
        where,
        select: {
          id: true,
          rating: true,
          comment: true,
          active: true,
          created_at: true,
          products: { select: { name: true } },
          User: { select: { name: true, email: true } },
        },
        skip,
        take,
        orderBy: { created_at: "desc" },
      }),
      prisma.reviews.count({ where }),
    ]);

    return {
      success: true,
      data: reviews,
      pagination: {
        total,
        page: params.page || 1,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error: any) {
    console.error("[getReviewsAdminService] Error al obtener reseñas:", error);
    throw handlePrismaError(error);
  }
};

// PUT - Toggle review active status
export const toggleReviewStatusService = async (
  reviewId: number,
  active: boolean
): Promise<void> => {
  // Validación ANTES del try-catch
  if (!reviewId || reviewId <= 0) {
    throw new ValidationError("ID de reseña inválido");
  }

  try {
    const existing = await prisma.reviews.findUnique({
      where: { id: reviewId },
    });

    if (!existing) {
      throw new NotFoundError("Reseña no encontrada");
    }

    await prisma.reviews.update({
      where: { id: reviewId },
      data: { active },
    });
  } catch (error: any) {
    if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
    console.error(
      `[toggleReviewStatusService] Error al cambiar estado de reseña ${reviewId}:`,
      error
    );
    throw handlePrismaError(error);
  }
};

// DELETE - Delete review
export const deleteReviewAdminService = async (reviewId: number): Promise<void> => {
  // Validación ANTES del try-catch
  if (!reviewId || reviewId <= 0) {
    throw new ValidationError("ID de reseña inválido");
  }

  try {
    const existing = await prisma.reviews.findUnique({
      where: { id: reviewId },
    });

    if (!existing) {
      throw new NotFoundError("Reseña no encontrada");
    }

    await prisma.reviews.delete({
      where: { id: reviewId },
    });
  } catch (error: any) {
    if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
    console.error(`[deleteReviewAdminService] Error al eliminar reseña ${reviewId}:`, error);
    throw handlePrismaError(error);
  }
};

// GET - Review stats
export const getReviewStatsService = async (): Promise<any> => {
  try {
    const [totalReviews, activeReviews, averageRating, ratingDistribution] =
      await Promise.all([
        prisma.reviews.count(),
        prisma.reviews.count({ where: { active: true } }),
        prisma.reviews.aggregate({
          _avg: { rating: true },
        }),
        prisma.reviews.groupBy({
          by: ["rating"],
          _count: true,
        }),
      ]);

    return {
      success: true,
      data: {
        totalReviews,
        activeReviews,
        averageRating: ratingDistribution.length > 0 ? 
          Math.round((averageRating._avg.rating || 0) * 10) / 10 : 0,
        ratingDistribution: ratingDistribution.reduce(
          (acc, item) => ({
            ...acc,
            [item.rating]: item._count,
          }),
          {}
        ),
      },
    };
  } catch (error: any) {
    console.error("[getReviewStatsService] Error al obtener estadísticas de reseñas:", error);
    throw handlePrismaError(error);
  }
};
