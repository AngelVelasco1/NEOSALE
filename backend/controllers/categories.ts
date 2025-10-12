import { Request, Response, NextFunction } from "express";
import { CategoriesService } from "../services/categories";

const categoriesService = new CategoriesService();

export const getAllCategoriesWithSubcategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories =
      await categoriesService.getAllCategoriesWithSubcategories();

    res.status(200).json({
      success: true,
      data: categories,
      message: "Categorías obtenidas exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        error: "ID de categoría inválido",
        code: "INVALID_CATEGORY_ID",
      });
    }

    const category = await categoriesService.getCategoryById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Categoría no encontrada",
        code: "CATEGORY_NOT_FOUND",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
      message: "Categoría obtenida exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

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

    const subcategories = await categoriesService.getSubcategoriesByCategory(
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

export const getActiveCategoriesOnly = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await categoriesService.getActiveCategoriesOnly();

    res.status(200).json({
      success: true,
      data: categories,
      message: "Categorías activas obtenidas exitosamente",
    });
  } catch (error) {
    next(error);
  }
};
