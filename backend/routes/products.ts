import { Router } from "express";
import {
  getProducts,
  getLatestProducts,
  getVariantStock,
  getOffers,
  getTrustMetrics,
  updateVariant,
} from "../controllers/products";
import { cacheMiddleware } from "../middlewares/cache";

export const productsRoutes = () =>
  Router()
    .get("/getProducts", cacheMiddleware(3 * 60 * 1000), getProducts)
    .get("/getLatestProducts", cacheMiddleware(5 * 60 * 1000), getLatestProducts)
    .get("/getOffers", cacheMiddleware(10 * 60 * 1000), getOffers)
    .get("/trust-metrics", cacheMiddleware(60 * 60 * 1000), getTrustMetrics)
    .post("/getVariantStock", getVariantStock)
    .patch("/variants/:id", updateVariant);
