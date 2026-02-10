import { Router } from "express";
import {
  getAllCategoriesWithSubcategories,
  getCategoryById,
  getSubcategoriesByCategory,
  getActiveCategoriesOnly,
} from "../controllers/categories";
import { cacheMiddleware } from "../middlewares/cache";

export const categoriesRoutes = () =>
  Router()
    // Obtener solo categorías activas (sin subcategorías) - DEBE IR ANTES de /:id
    .get("/active", cacheMiddleware(15 * 60 * 1000), getActiveCategoriesOnly)
    // Obtener subcategorías de una categoría específica - DEBE IR ANTES de /:id
    .get("/:categoryId/subcategories", cacheMiddleware(15 * 60 * 1000), getSubcategoriesByCategory)
    // Obtener todas las categorías con sus subcategorías
    .get("/", cacheMiddleware(15 * 60 * 1000), getAllCategoriesWithSubcategories)
    // Obtener una categoría específica por ID con sus subcategorías
    .get("/:id", cacheMiddleware(15 * 60 * 1000), getCategoryById);
