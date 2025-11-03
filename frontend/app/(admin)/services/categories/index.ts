import {
  getCategories,
  getCategoriesDropdown,
  getSubcategoriesByCategory as getSubcategoriesByCategoryAction,
  getCategoryById as getCategoryByIdAction,
} from "@/app/(admin)/actions/categories/getCategories";
import {
  FetchCategoriesParams,
  FetchCategoriesResponse,
} from "./types";

// Obtener todas las categorías con subcategorías (con paginación y búsqueda)
export async function fetchCategories(
  params: FetchCategoriesParams
): Promise<FetchCategoriesResponse> {
  return getCategories(params);
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
