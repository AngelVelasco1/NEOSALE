"use server";

import { apiClient } from "@/lib/api-client";

export type GetProductsParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: number;
  subcategory?: number;
  brand?: number;
  active?: boolean;
  inOffer?: boolean;
  minPrice?: number;
  maxPrice?: number;
  stockStatus?: "in-stock" | "out-of-stock";
  minStock?: number;
  maxStock?: number;
  sortBy?: "price" | "created_at" | "updated_at" | "name" | "stock";
  sortOrder?: "asc" | "desc";
};

export async function getProducts({
  page = 1,
  limit = 10,
  search,
  category,
  subcategory,
  brand,
  active,
  inOffer,
  minPrice,
  maxPrice,
  stockStatus,
  minStock,
  maxStock,
  sortBy = "created_at",
  sortOrder = "desc",
}: GetProductsParams = {}) {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (category) params.append("category", category.toString());
    if (subcategory) params.append("subcategory", subcategory.toString());
    if (brand) params.append("brand", brand.toString());
    if (active !== undefined) params.append("active", active.toString());
    if (inOffer !== undefined) params.append("inOffer", inOffer.toString());
    if (minPrice !== undefined) params.append("minPrice", minPrice.toString());
    if (maxPrice !== undefined) params.append("maxPrice", maxPrice.toString());
    if (stockStatus) params.append("stockStatus", stockStatus);
    if (minStock !== undefined) params.append("minStock", minStock.toString());
    if (maxStock !== undefined) params.append("maxStock", maxStock.toString());
    params.append("sortBy", sortBy);
    params.append("sortOrder", sortOrder);

    const queryString = params.toString();
    const response = await apiClient.get(`/admin/products${queryString ? `?${queryString}` : ""}`);
    
    if (!response.success) {
      throw new Error(response.error || "Failed to fetch products");
    }

    return response.data || { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
  } catch (error) {
    console.error("[getProducts] Error:", error);
    return { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
  }
}

export async function getProductById(productId: number) {
  try {
    const response = await apiClient.get(`/admin/products/${productId}`);

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch product");
    }

    return response.data || null;
  } catch (error) {
    console.error("[getProductById] Error:", error);
    throw new Error("Failed to fetch product");
  }
}
