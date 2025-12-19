import { prisma } from "../lib/prisma.js";
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
  const whereClause: any = { active: true }; // Solo reseñas aprobadas

  if (productId) whereClause.product_id = productId;
  if (userId) whereClause.user_id = userId;

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
};

export const getReviewByIdService = async (id: number) => {
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
    throw new Error("Review not found");
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
};

export const createReviewService = async (data: CreateReviewData) => {
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

    console.log('📝 Review creation result:', result);

    const reviewId = result[0]?.sp_create_review;

    if (!reviewId) {
      console.error('❌ No review ID returned:', result);
      throw new Error("Error al crear la review - No se recibió ID");
    }

    console.log('✅ Review created with ID:', reviewId);

    // Si hay imágenes, agregarlas usando stored procedure
    if (data.images && data.images.length > 0) {
      console.log('📸 Adding images to review:', reviewId);
      await prisma.$executeRaw`
        CALL sp_add_review_images(
          ${reviewId}::INTEGER, 
          ${data.user_id}::INTEGER, 
          ${data.images}::TEXT[]
        )
      `;
    }

    // Obtener la review completa con imágenes
    console.log('🔍 Fetching complete review with ID:', reviewId);
    
    if (!reviewId || isNaN(reviewId)) {
      throw new Error(`Invalid review ID: ${reviewId}`);
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
      console.error('❌ Review not found after creation with ID:', reviewId);
      throw new Error("Review not found after creation");
    }

    console.log('✅ Review fetched successfully:', completeReview.id);

    console.log('✅ Review fetched successfully:', completeReview.id);

    // 🔔 Notificar a todos los admins sobre la nueva reseña
    try {
      await notifyNewReview(
        data.product_id,
        completeReview.products?.name || "Producto",
        data.rating
      );
    } catch (notifyError) {
      console.error("⚠️ Error al crear notificación de nueva reseña:", notifyError);
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
    // Mapear errores específicos de PostgreSQL
    if (error.message.includes("Usuario ya ha calificado este producto")) {
      throw new Error("Ya has calificado este producto anteriormente");
    }
    if (error.message.includes("Usuario no existe o está inactivo")) {
      throw new Error("Usuario no válido");
    }
    if (error.message.includes("Producto no existe o está inactivo")) {
      throw new Error("Producto no válido");
    }
    if (error.message.includes("calificación debe estar entre 1 y 5")) {
      throw new Error("La calificación debe estar entre 1 y 5");
    }

    throw new Error(error.message || "Error al crear la review");
  }
};

export const updateReviewService = async (
  id: number,
  userId: number,
  data: UpdateReviewData
) => {
  try {
    // Usar el stored procedure para actualizar la review
    await prisma.$executeRaw`
      CALL sp_update_review(
        ${id}::INTEGER, 
        ${data.rating || null}::INTEGER, 
        ${data.comment !== undefined ? data.comment : null}::TEXT, 
        ${userId}::INTEGER
      )
    `;

    // Retornar la review actualizada
    return getReviewByIdService(id);
  } catch (error: any) {
    // Mapear errores específicos de PostgreSQL
    if (error.message.includes("Review no encontrada")) {
      throw new Error("Review no encontrada");
    }
    if (error.message.includes("No tienes permisos")) {
      throw new Error("No tienes permisos para modificar esta review");
    }
    if (error.message.includes("calificación debe estar entre 1 y 5")) {
      throw new Error("La calificación debe estar entre 1 y 5");
    }

    throw new Error(error.message || "Error al actualizar la review");
  }
};

export const deleteReviewService = async (id: number, userId: number) => {
  try {
    // Usar el stored procedure para eliminar la review
    await prisma.$executeRaw`
      CALL sp_delete_review(${id}, ${userId})
    `;

    return { message: "Review eliminada exitosamente" };
  } catch (error: any) {
    // Mapear errores específicos de PostgreSQL
    if (error.message.includes("Review no encontrada")) {
      throw new Error("Review no encontrada");
    }
    if (error.message.includes("No tienes permisos")) {
      throw new Error("No tienes permisos para eliminar esta review");
    }

    throw new Error(error.message || "Error al eliminar la review");
  }
};

export const getProductReviewStatsService = async (productId: number) => {
  const stats = await prisma.reviews.aggregate({
    where: { 
      product_id: productId,
      active: true // Solo reseñas aprobadas
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
      active: true // Solo reseñas aprobadas
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
};

export const getUserReviewsService = async (userId: number) => {
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
};

// Servicio para agregar imágenes a una review existente
export const addReviewImagesService = async (
  reviewId: number,
  userId: number,
  images: string[]
) => {
  try {
    if (!images || images.length === 0) {
      throw new Error("Se debe proporcionar al menos una imagen");
    }

    // Usar el stored procedure para agregar imágenes
    await prisma.$executeRaw`
      CALL sp_add_review_images(
        ${reviewId}::INTEGER, 
        ${userId}::INTEGER, 
        ${images}::TEXT[]
      )
    `;

    // Retornar la review actualizada con las nuevas imágenes
    return getReviewByIdService(reviewId);
  } catch (error: any) {
    // Mapear errores específicos de PostgreSQL
    if (error.message.includes("Review no encontrada")) {
      throw new Error("Review no encontrada");
    }
    if (error.message.includes("No tienes permisos")) {
      throw new Error("No tienes permisos para modificar esta review");
    }
    if (error.message.includes("más de 5 imágenes")) {
      throw new Error("No se pueden agregar más de 5 imágenes por review");
    }

    throw new Error(error.message || "Error al agregar imágenes");
  }
};

// Servicio para eliminar una imagen específica de una review
export const deleteReviewImageService = async (
  imageId: number,
  userId: number
) => {
  try {
    // Usar el stored procedure para eliminar la imagen
    await prisma.$executeRaw`
      CALL sp_delete_review_image(${imageId}::INTEGER, ${userId}::INTEGER)
    `;

    return { message: "Imagen eliminada exitosamente" };
  } catch (error: any) {
    // Mapear errores específicos de PostgreSQL
    if (error.message.includes("Imagen de review no encontrada")) {
      throw new Error("Imagen no encontrada");
    }
    if (error.message.includes("No tienes permisos")) {
      throw new Error("No tienes permisos para eliminar esta imagen");
    }

    throw new Error(error.message || "Error al eliminar la imagen");
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
    throw new Error(error.message || "Error al obtener productos reseñables");
  }
};

// Servicio para verificar si un usuario puede reseñar un producto específico
export const canUserReviewService = async (
  userId: number,
  productId: number,
  orderId: number
): Promise<{ can_review: boolean; reason?: string }> => {
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
    throw new Error(error.message || "Error al verificar permisos de reseña");
  }
};
