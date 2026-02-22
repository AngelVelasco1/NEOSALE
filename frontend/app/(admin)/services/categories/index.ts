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
import { FetchCategoriesParams, FetchCategoriesResponse, Category } from "./types";

// Obtener todas las categorías con subcategorías (con paginación y búsqueda)
export async function fetchCategories(
  params: FetchCategoriesParams
): Promise<FetchCategoriesResponse> {
  const {
    page = 1,
    limit = 10,
    search,
    sortBy,
    sortOrder,
    status,
  } = params;

  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());
  if (search) queryParams.append("search", search);
  if (status && status !== "all") queryParams.append("status", status);
  if (sortBy) queryParams.append("sortBy", sortBy);
  if (sortOrder) queryParams.append("sortOrder", sortOrder);

  const response = await fetch(`/api/categories?${queryParams.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Error ${response.status}: Failed to fetch categories`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch categories");
  }

  // Mapear la estructura de paginación del servidor a la esperada por el frontend
  const data = result.data || [];
  const pagination = result.pagination || {};

  const mappedResult: FetchCategoriesResponse = {
    data: data,
    pagination: {
      current: pagination.page || page,
      limit: pagination.limit || limit,
      items: pagination.total || 0,
      pages: pagination.totalPages || 0,
      next: pagination.page < pagination.totalPages ? pagination.page + 1 : null,
      prev: pagination.page > 1 ? pagination.page - 1 : null,
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
  return (await getSubcategoriesByCategoryDropdown(categoryId)) as unknown as SubcategoryItem[];
}

// Obtener categorías con sus subcategorías para manejo completo
export async function fetchCategoriesWithSubcategories(): Promise<
  CategoryWithSubcategories[]
> {
  return (await getCategoriesWithSubcategories()) as unknown as CategoryWithSubcategories[];
}
