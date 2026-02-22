import type {
  FetchProductsParams,
  FetchProductsResponse,
} from "./types";

/**
 * Fetches paginated products from the admin proxy route.
 * Calls GET /api/products which proxies to /api/admin/products with proper auth.
 */
export async function fetchProducts(
  params: FetchProductsParams
): Promise<FetchProductsResponse> {
  const {
    page = 1,
    limit = 10,
    search,
    category,
    brand,
    priceSort,
    minPrice,
    maxPrice,
    status,
    minStock,
    maxStock,
    published,
    dateSort,
    sortBy: sortByParam,
    sortOrder: sortOrderParam,
  } = params;

  // Resolve sort params
  let sortBy: string = "created_at";
  let sortOrder: "asc" | "desc" = "desc";

  if (sortByParam && sortOrderParam) {
    sortBy = sortByParam;
    sortOrder = sortOrderParam as "asc" | "desc";
  } else if (priceSort) {
    sortBy = "price";
    sortOrder = priceSort === "lowest-first" ? "asc" : "desc";
  } else if (dateSort) {
    if (dateSort.includes("added")) {
      sortBy = "created_at";
    } else if (dateSort.includes("updated")) {
      sortBy = "updated_at";
    }
    sortOrder = dateSort.includes("asc") ? "asc" : "desc";
  }

  // Map frontend stockStatus to backend expected values
  const stockStatusMap: Record<string, string> = {
    selling: "inStock",
    "out-of-stock": "outOfStock",
  };
  const stockStatus = status ? (stockStatusMap[status] ?? status) : undefined;

  // Build query params
  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());
  queryParams.append("sortBy", sortBy);
  queryParams.append("sortOrder", sortOrder);
  if (search) queryParams.append("search", search);
  if (category) queryParams.append("category", category);
  if (brand) queryParams.append("brand", brand);
  if (published !== undefined) queryParams.append("active", published.toString());
  if (minPrice) queryParams.append("minPrice", minPrice);
  if (maxPrice) queryParams.append("maxPrice", maxPrice);
  if (minStock) queryParams.append("minStock", minStock);
  if (maxStock) queryParams.append("maxStock", maxStock);
  if (stockStatus) queryParams.append("stockStatus", stockStatus);

  const response = await fetch(`/api/products?${queryParams.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Error ${response.status}: Failed to fetch products`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch products");
  }

  // Normalize the response structure
  const raw = result.data || [];
  const pagination = result.pagination || {};

  const mappedData = raw.map((product: any) => ({
    ...product,
    base_discount: product.base_discount !== undefined ? Number(product.base_discount) : 0,
    offer_discount: product.offer_discount != null ? Number(product.offer_discount) : null,
    offer_start_date: product.offer_start_date ?? null,
    offer_end_date: product.offer_end_date ?? null,
    created_at: product.created_at ?? new Date().toISOString(),
    updated_at: product.updated_at ?? null,
    deleted_at: product.deleted_at ?? null,
    categories: product.categories ?? { name: "Sin categoría" },
    brands: product.brands ?? { name: "" },
    images: product.images ?? [],
  }));

  return {
    data: mappedData,
    pagination: {
      current: pagination.page ?? page,
      limit: pagination.limit ?? limit,
      items: pagination.total ?? 0,
      pages: pagination.totalPages ?? 0,
      next: pagination.page < pagination.totalPages ? pagination.page + 1 : null,
      prev: pagination.page > 1 ? pagination.page - 1 : null,
    },
  };
}

export async function fetchProductDetails(
  productId: number
): Promise<{ product: any | null }> {
  const response = await fetch(`/api/products/${productId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to fetch product details");
  }

  const result = await response.json();
  return { product: result.data ?? null };
}
