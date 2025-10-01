import { Router } from 'express';
import {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getProductReviewStats,
  getUserReviews,
  addReviewImages,
  deleteReviewImage
} from '../controllers/reviews.js';

export const reviewsRoutes = () => {
  const app = Router();
  
  // Obtener todas las reviews con filtros opcionales
  app.get("/getReviews", getReviews);
  
  // Obtener reviews de un producto específico
  app.get("/product/:productId/stats", getProductReviewStats);
  
  // Obtener reviews de un usuario específico
  app.get("/user/:userId", getUserReviews);
  
  // Obtener una review específica por ID
  app.get("/:id", getReviewById);
  
  // Crear una nueva review
  app.post("/createReview", createReview);
  
  // Actualizar una review existente
  app.put("/:id", updateReview);
  
  // Eliminar una review
  app.delete("/:id", deleteReview);
  
  // Agregar imágenes a una review existente
  app.post("/:reviewId/images", addReviewImages);
  
  // Eliminar una imagen específica de una review
  app.delete("/images/:imageId", deleteReviewImage);
  
  return app;
};