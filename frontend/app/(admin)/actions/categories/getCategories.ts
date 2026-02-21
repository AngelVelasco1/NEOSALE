"use server";

import { apiClient } from "@/lib/api-client";

export type GetCategoriesParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  status?: string;
};

export type SubcategoryItem = {
  id: number;
  name: string;
};

export type CategoryWithSubcategories = {
  id: number;
  name: string;
  subcategories?: SubcategoryItem[];
};

export async function getCategories({
  page = 1,
  limit = 10,
  search,
  sortBy,
  sortOrder,
  status,
}: GetCategoriesParams = {}) {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (status && status !== "all") params.append("status", status);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);

    const response = await apiClient.get(`/api/admin/categories?${params.toString()}`);

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch categories");
    }

    return response.data || { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
  } catch (error) {
    console.error("[getCategories] Error:", error);
    return { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
  }
}

export async function getCategoriesDropdown() {
  try {
    const response = await apiClient.get(`/api/admin/categories/dropdown`);

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch categories dropdown");
    }

    return response.data || [];
  } catch (error) {
    console.error("[getCategoriesDropdown] Error:", error);
    return [];
  }
}

export async function getSubcategoriesByCategory(categoryId: number) {
  try {
    const response = await apiClient.get(`/api/admin/categories/${categoryId}/subcategories`);

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch subcategories");
    }

    return response.data || [];
  } catch (error) {
    console.error("[getSubcategoriesByCategory] Error:", error);
    return [];
  }
}

export async function getCategoryById(categoryId: number) {
  try {
    const response = await apiClient.get(`/api/admin/categories/${categoryId}`);

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch category");
    }

    return response.data || null;
  } catch (error) {
    console.error("[getCategoryById] Error:", error);
    return null;
  }
}

export async function getSubcategoriesDropdown() {
  try {
    const response = await apiClient.get(`/api/admin/subcategories/dropdown`);

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch subcategories dropdown");
    }

    return response.data || [];
  } catch (error) {
    console.error("[getSubcategoriesDropdown] Error:", error);
    return [];
  }
}

export async function getSubcategoriesByCategoryDropdown(categoryId?: number) {
  try {
    if (!categoryId) {
      return getSubcategoriesDropdown();
    }

    const response = await apiClient.get(`/api/admin/categories/${categoryId}/subcategories/dropdown`);

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch subcategories");
    }

    return response.data || [];
  } catch (error) {
    console.error("[getSubcategoriesByCategoryDropdown] Error:", error);
    return [];
  }
}

export async function getCategoriesWithSubcategories() {
  try {
    const response = await apiClient.get(`/api/admin/categories/with-subcategories`);

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch categories with subcategories");
    }

    return response.data || [];
  } catch (error) {
    console.error("[getCategoriesWithSubcategories] Error:", error);
    return [];
  }
}
