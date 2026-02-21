import { Request, Response, NextFunction } from "express";
import {
  getAllCategoriesWithSubcategoriesService,
  getCategoryByIdService,
  getSubcategoriesByCategoryService,
  getActiveCategoriesService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from "../services/categories.js";

// GET - Retrieve all categories with subcategories
export const getAllCategoriesWithSubcategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await getAllCategoriesWithSubcategoriesService();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// GET - Retrieve category by ID
export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryId = parseInt(req.params.id);
    const category = await getCategoryByIdService(categoryId);

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// GET - Retrieve subcategories by category ID
export const getSubcategoriesByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = req.params;
    const categoryIdInt = parseInt(categoryId);

    if (isNaN(categoryIdInt)) {
      return res.status(400).json({
        success: false,
        error: "ID de categoría inválido",
        code: "INVALID_CATEGORY_ID",
      });
    }

    const subcategories = await getSubcategoriesByCategoryService(
      categoryIdInt
    );

    res.status(200).json({
      success: true,
      data: subcategories,
      message: "Subcategorías obtenidas exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

// GET - Retrieve active categories
export const getActiveCategoriesOnly = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await getActiveCategoriesService();

    res.status(200).json({
      success: true,
      data: categories,
      message: "Categorías activas obtenidas exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

// POST - Create new category
export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await createCategoryService(req.body);

    res.status(201).json({
      success: true,
      data: result,
      message: "Categoría creada exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

// PUT - Update category
export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryId = parseInt(req.params.id);
    const result = await updateCategoryService(categoryId, req.body);

    res.status(200).json({
      success: true,
      data: result,
      message: "Categoría actualizada exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

// DELETE - Delete category (soft delete)
export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryId = parseInt(req.params.id);
    await deleteCategoryService(categoryId);

    res.status(200).json({
      success: true,
      message: "Categoría eliminada exitosamente",
    });
  } catch (error) {
    next(error);
  }
};
