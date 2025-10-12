import { Router } from "express";
import {
  getAllCategoriesWithSubcategories,
  getCategoryById,
  getSubcategoriesByCategory,
  getActiveCategoriesOnly,
} from "../controllers/categories";

export const categoriesRoutes = () =>
  Router()
    // Obtener solo categorías activas (sin subcategorías) - DEBE IR ANTES de /:id
    .get("/active", getActiveCategoriesOnly)
    // Obtener subcategorías de una categoría específica - DEBE IR ANTES de /:id
    .get("/:categoryId/subcategories", getSubcategoriesByCategory)
    // Obtener todas las categorías con sus subcategorías
    .get("/", getAllCategoriesWithSubcategories)
    // Obtener una categoría específica por ID con sus subcategorías
    .get("/:id", getCategoryById);
