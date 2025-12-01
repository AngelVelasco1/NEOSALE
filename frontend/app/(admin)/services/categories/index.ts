import {
  getCategories,
  getCategoriesDropdown,
  getSubcategoriesByCategory as getSubcategoriesByCategoryAction,
  getCategoryById as getCategoryByIdAction,
  getSubcategoriesDropdown,
  getSubcategoriesByCategoryDropdown,
  getCategoriesWithSubcategories,
  CategoryWithSubcategories,
  SubcategoryItem,
} from "@/app/(admin)/actions/categories/getCategories";
import { FetchCategoriesParams, FetchCategoriesResponse } from "./types";

// Obtener todas las categorías con subcategorías (con paginación y búsqueda)
export async function fetchCategories(
  params: FetchCategoriesParams
): Promise<FetchCategoriesResponse> {
  const result = await getCategories(params);
  
  // Mapear la estructura de paginación del servidor a la esperada por el frontend
  const mappedResult: FetchCategoriesResponse = {
    data: result.data,
    pagination: {
      current: result.pagination.page,
      limit: result.pagination.limit,
      items: result.pagination.total,
      pages: result.pagination.totalPages,
      next: result.pagination.page < result.pagination.totalPages 
        ? result.pagination.page + 1 
        : null,
      prev: result.pagination.page > 1 
        ? result.pagination.page - 1 
        : null,
    }
  };

  return mappedResult;
}

// Obtener solo categorías activas para dropdown (sin subcategorías)
export async function fetchCategoriesDropdown() {
  return getCategoriesDropdown();
}

// Obtener subcategorías de una categoría específica
export async function fetchSubcategoriesByCategory(categoryId: number) {
  return getSubcategoriesByCategoryAction(categoryId);
}

// Obtener una categoría específica por ID con sus subcategorías
export async function fetchCategoryById(categoryId: number) {
  return getCategoryByIdAction(categoryId);
}

// Obtener todas las subcategorías activas para dropdown
export async function fetchSubcategoriesDropdown() {
  return getSubcategoriesDropdown();
}

// Obtener subcategorías filtradas por categoría para dropdown
export async function fetchSubcategoriesByCategoryDropdown(
  categoryId?: number
): Promise<SubcategoryItem[]> {
  return getSubcategoriesByCategoryDropdown(categoryId);
}

// Obtener categorías con sus subcategorías para manejo completo
export async function fetchCategoriesWithSubcategories(): Promise<
  CategoryWithSubcategories[]
> {
  return getCategoriesWithSubcategories();
}
