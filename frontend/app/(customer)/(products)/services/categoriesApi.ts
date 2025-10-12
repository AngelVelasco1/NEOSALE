import { api } from "@/config/api";

export interface CategoryWithSubcategories {
  id: number;
  name: string;
  description: string | null;
  active: boolean;
  subcategories: {
    id: number;
    name: string;
    active: boolean;
  }[];
}

export interface SubcategoryData {
  id: number;
  name: string;
  active: boolean;
}

export interface CategoryData {
  id: number;
  name: string;
  description: string | null;
}

export interface CategoriesApiResponse {
  success: boolean;
  data: CategoryWithSubcategories[];
  message: string;
}

export interface CategoryApiResponse {
  success: boolean;
  data: CategoryWithSubcategories;
  message: string;
}

export interface SubcategoriesApiResponse {
  success: boolean;
  data: SubcategoryData[];
  message: string;
}

export interface ActiveCategoriesApiResponse {
  success: boolean;
  data: CategoryData[];
  message: string;
}

// Obtener todas las categorías con sus subcategorías
export const getAllCategoriesWithSubcategories = async (): Promise<
  CategoryWithSubcategories[]
> => {
  const response = await api.get<CategoriesApiResponse>("/api/categories");
  return response.data.data;
};

// Obtener una categoría específica por ID con sus subcategorías
export const getCategoryById = async (
  categoryId: number
): Promise<CategoryWithSubcategories> => {
  const response = await api.get<CategoryApiResponse>(
    `/api/categories/${categoryId}`
  );
  return response.data.data;
};

// Obtener subcategorías de una categoría específica
export const getSubcategoriesByCategory = async (
  categoryId: number
): Promise<SubcategoryData[]> => {
  const response = await api.get<SubcategoriesApiResponse>(
    `/api/categories/${categoryId}/subcategories`
  );
  return response.data.data;
};

// Obtener solo categorías activas (sin subcategorías)
export const getActiveCategoriesOnly = async (): Promise<CategoryData[]> => {
  const response = await api.get<ActiveCategoriesApiResponse>(
    "/api/categories/active"
  );
  return response.data.data;
};

// Helper function para usar en el navbar (retorna datos simplificados)
export const getCategoriesForNavbar = async (): Promise<
  CategoryWithSubcategories[]
> => {
  try {
    return await getAllCategoriesWithSubcategories();
  } catch (error) {
    console.error("Error al obtener categorías para el navbar:", error);
    // Retornar array vacío en caso de error para no romper la UI
    return [];
  }
};
