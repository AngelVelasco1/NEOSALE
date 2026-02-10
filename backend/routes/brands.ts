import { Router } from "express";
import {
  getAllBrands,
  getBrandById,
  getBrandByName,
} from "../controllers/brands.js";
import { cacheMiddleware } from "../middlewares/cache.js";

export const brandsRoutes = () =>
  Router()
    .get("/", cacheMiddleware(30 * 60 * 1000), getAllBrands)
    .get("/:id", cacheMiddleware(30 * 60 * 1000), getBrandById)
    .get("/name/:name", cacheMiddleware(30 * 60 * 1000), getBrandByName);
