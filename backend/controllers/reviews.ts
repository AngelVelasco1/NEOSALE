import { NextFunction, Request, Response } from "express";
import {
  getReviewsService,
  getReviewByIdService,
  createReviewService,
  updateReviewService,
  deleteReviewService,
  getProductReviewStatsService,
  getUserReviewsService,
  addReviewImagesService,
  deleteReviewImageService,
  getReviewableProductsService,
  canUserReviewService,
  CreateReviewData,
  UpdateReviewData,
} from "../services/reviews.js";

export const getReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.query.productId
      ? Number(req.query.productId)
      : undefined;
    const userId = req.query.userId ? Number(req.query.userId) : undefined;

    const reviews = await getReviewsService(productId, userId);
    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
};

export const getReviewById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const review = await getReviewByIdService(id);
    res.status(200).json(review);
  } catch (err) {
    next(err);
  }
};

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id, product_id, rating, comment, images, order_id } = req.body;

    const reviewData: CreateReviewData = {
      user_id: Number(user_id),
      product_id: Number(product_id),
      rating: Number(rating),
      comment,
      images,
      order_id: order_id ? Number(order_id) : undefined,
    };

    const review = await createReviewService(reviewData);
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

export const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const { user_id, rating, comment } = req.body;

    const updateData: UpdateReviewData = {};
    if (rating !== undefined) updateData.rating = Number(rating);
    if (comment !== undefined) updateData.comment = comment;

    const review = await updateReviewService(id, Number(user_id), updateData);
    res.status(200).json(review);
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const { user_id } = req.body;
    const result = await deleteReviewService(id, Number(user_id));
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getReviewableProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.params.userId);
    const products = await getReviewableProductsService(userId);
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

export const canUserReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.params.userId);
    const productId = Number(req.params.productId);
    const orderId = Number(req.params.orderId);
    const result = await canUserReviewService(userId, productId, orderId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getProductReviewStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = Number(req.params.productId);

    if (!productId || isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const stats = await getProductReviewStatsService(productId);
    res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
};

export const getUserReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.params.userId);

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const reviews = await getUserReviewsService(userId);
    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
};

export const addReviewImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviewId = Number(req.params.reviewId);
    const { user_id, images } = req.body;

    if (!reviewId || isNaN(reviewId)) {
      return res.status(400).json({ error: "Invalid review IDI" });
    }

    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res
        .status(400)
        .json({ error: "images array is required and must not be empty" });
    }

    const review = await addReviewImagesService(
      reviewId,
      Number(user_id),
      images
    );
    res.status(200).json(review);
  } catch (err) {
    next(err);
  }
};

export const deleteReviewImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const imageId = Number(req.params.imageId);
    const { user_id } = req.body;

    if (!imageId || isNaN(imageId)) {
      return res.status(400).json({ error: "Invalid image ID" });
    }

    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    const result = await deleteReviewImageService(imageId, Number(user_id));
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
