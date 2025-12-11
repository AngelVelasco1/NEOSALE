import { Router } from "express";
import {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getProductReviewStats,
  getUserReviews,
  addReviewImages,
  deleteReviewImage,
  getReviewableProducts,
  canUserReview,
} from "../controllers/reviews.js";

export const reviewsRoutes = () =>
  Router()
    .get("/getReviews", getReviews)
    .get("/reviewable/:userId", getReviewableProducts)
    .get("/can-review/:userId/:productId/:orderId", canUserReview)
    .get("/product/:productId/stats", getProductReviewStats)
    .get("/user/:userId", getUserReviews)
    .get("/:id", getReviewById)
    .post("/createReview", createReview)
    .put("/:id", updateReview)
    .delete("/:id", deleteReview)
    .post("/:reviewId/images", addReviewImages)
    .delete("/images/:imageId", deleteReviewImage);
