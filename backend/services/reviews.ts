import { prisma } from "../lib/prisma.js";

export interface CreateReviewData {
  user_id: number;
  product_id: number;
  rating: number;
  comment?: string;
  images?: string[];
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

export const getReviewsService = async (productId?: number, userId?: number) => {
  const whereClause: any = {};
  
  if (productId) whereClause.product_id = productId;
  if (userId) whereClause.user_id = userId;

  const reviews = await prisma.reviews.findMany({
    where: whereClause,
    include: {
      User: {
        select: {
          id: true,
          name: true,
          image: true
        }
      },
      products: {
        select: {
          id: true,
          name: true
        }
      },
      review_images: true
    },
    orderBy: {
      created_at: 'desc'
    }
  });

  return reviews.map((review: any) => ({
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    created_at: review.created_at,
    updated_at: review.updated_at,
    user: review.User,
    product: review.products,
    images: review.review_images
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
          image: true
        }
      },
      products: {
        select: {
          id: true,
          name: true
        }
      },
      review_images: true
    }
  });

  if (!review) {
    throw new Error('Review not found');
  }

  return {
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    created_at: review.created_at,
    updated_at: review.updated_at,
    user: review.User,
    product: review.products,
    images: review.review_images
  };
};

export const createReviewService = async (data: CreateReviewData) => {
  try {
    // Usar el stored procedure para crear la review
    const result = await prisma.$queryRaw<{ sp_create_review: number }[]>`
      SELECT sp_create_review(${data.rating}, ${data.comment || null}, ${data.user_id}, ${data.product_id}) as review_id
    `;
    
    const reviewId = result[0]?.review_id;
    
    if (!reviewId) {
      throw new Error('Error al crear la review');
    }

    // Si hay imágenes, agregarlas usando stored procedure
    if (data.images && data.images.length > 0) {
      await prisma.$executeRaw`
        CALL sp_add_review_images(${reviewId}, ${data.user_id}, ${data.images})
      `;
    }

    // Obtener la review completa con imágenes
    const completeReview = await getReviewByIdService(reviewId);
    return completeReview;
  } catch (error: any) {
    // Mapear errores específicos de PostgreSQL
    if (error.message.includes('Usuario ya ha calificado este producto')) {
      throw new Error('Ya has calificado este producto anteriormente');
    }
    if (error.message.includes('Usuario no existe o está inactivo')) {
      throw new Error('Usuario no válido');
    }
    if (error.message.includes('Producto no existe o está inactivo')) {
      throw new Error('Producto no válido');
    }
    if (error.message.includes('calificación debe estar entre 1 y 5')) {
      throw new Error('La calificación debe estar entre 1 y 5');
    }
    
    throw new Error(error.message || 'Error al crear la review');
  }
};

export const updateReviewService = async (id: number, userId: number, data: UpdateReviewData) => {
  try {
    // Usar el stored procedure para actualizar la review
    await prisma.$executeRaw`
      CALL sp_update_review(${id}, ${data.rating || null}, ${data.comment !== undefined ? data.comment : null}, ${userId})
    `;

    // Retornar la review actualizada
    return getReviewByIdService(id);
  } catch (error: any) {
    // Mapear errores específicos de PostgreSQL
    if (error.message.includes('Review no encontrada')) {
      throw new Error('Review no encontrada');
    }
    if (error.message.includes('No tienes permisos')) {
      throw new Error('No tienes permisos para modificar esta review');
    }
    if (error.message.includes('calificación debe estar entre 1 y 5')) {
      throw new Error('La calificación debe estar entre 1 y 5');
    }
    
    throw new Error(error.message || 'Error al actualizar la review');
  }
};

export const deleteReviewService = async (id: number, userId: number) => {
  try {
    // Usar el stored procedure para eliminar la review
    await prisma.$executeRaw`
      CALL sp_delete_review(${id}, ${userId})
    `;

    return { message: 'Review eliminada exitosamente' };
  } catch (error: any) {
    // Mapear errores específicos de PostgreSQL
    if (error.message.includes('Review no encontrada')) {
      throw new Error('Review no encontrada');
    }
    if (error.message.includes('No tienes permisos')) {
      throw new Error('No tienes permisos para eliminar esta review');
    }
    
    throw new Error(error.message || 'Error al eliminar la review');
  }
};

export const getProductReviewStatsService = async (productId: number) => {
  const stats = await prisma.reviews.aggregate({
    where: { product_id: productId },
    _avg: {
      rating: true
    },
    _count: {
      id: true
    }
  });

  const ratingDistribution = await prisma.reviews.groupBy({
    by: ['rating'],
    where: { product_id: productId },
    _count: {
      rating: true
    }
  });

  return {
    average_rating: stats._avg.rating ? Number(stats._avg.rating.toFixed(1)) : 0,
    total_reviews: stats._count.id,
    rating_distribution: ratingDistribution.map((item: any) => ({
      rating: item.rating,
      count: item._count.rating
    }))
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
              image_url: true
            }
          }
        }
      },
      review_images: true
    },
    orderBy: {
      created_at: 'desc'
    }
  });

  return reviews.map((review: any) => ({
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    created_at: review.created_at,
    updated_at: review.updated_at,
    product: {
      ...review.products,
      image_url: review.products.images[0]?.image_url
    },
    images: review.review_images
  }));
};

// Servicio para agregar imágenes a una review existente
export const addReviewImagesService = async (reviewId: number, userId: number, images: string[]) => {
  try {
    if (!images || images.length === 0) {
      throw new Error('Se debe proporcionar al menos una imagen');
    }

    // Usar el stored procedure para agregar imágenes
    await prisma.$executeRaw`
      CALL sp_add_review_images(${reviewId}, ${userId}, ${images})
    `;

    // Retornar la review actualizada con las nuevas imágenes
    return getReviewByIdService(reviewId);
  } catch (error: any) {
    // Mapear errores específicos de PostgreSQL
    if (error.message.includes('Review no encontrada')) {
      throw new Error('Review no encontrada');
    }
    if (error.message.includes('No tienes permisos')) {
      throw new Error('No tienes permisos para modificar esta review');
    }
    if (error.message.includes('más de 5 imágenes')) {
      throw new Error('No se pueden agregar más de 5 imágenes por review');
    }
    
    throw new Error(error.message || 'Error al agregar imágenes');
  }
};

// Servicio para eliminar una imagen específica de una review
export const deleteReviewImageService = async (imageId: number, userId: number) => {
  try {
    // Usar el stored procedure para eliminar la imagen
    await prisma.$executeRaw`
      CALL sp_delete_review_image(${imageId}, ${userId})
    `;

    return { message: 'Imagen eliminada exitosamente' };
  } catch (error: any) {
    // Mapear errores específicos de PostgreSQL
    if (error.message.includes('Imagen de review no encontrada')) {
      throw new Error('Imagen no encontrada');
    }
    if (error.message.includes('No tienes permisos')) {
      throw new Error('No tienes permisos para eliminar esta imagen');
    }
    
    throw new Error(error.message || 'Error al eliminar la imagen');
  }
};