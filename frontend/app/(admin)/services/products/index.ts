import {
  getProducts,
  getProductById as getProductByIdAction,
} from "@/app/(admin)/actions/products/getProducts";
import {
  FetchProductsParams,
  FetchProductsResponse,
  ProductDetails,
} from "./types";
import { Pagination } from "@/app/(admin)/types/pagination";

// Migrado a Server Actions con Prisma
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

  // Mapear ordenamiento
  let sortBy: "price" | "created_at" | "updated_at" | "name" | "stock" =
    "created_at";
  let sortOrder: "asc" | "desc" = "desc";

  // Si viene sortBy y sortOrder explícitos (de la tabla)
  if (sortByParam && sortOrderParam) {
    sortBy = sortByParam as typeof sortBy;
    sortOrder = sortOrderParam as typeof sortOrder;
  } else if (priceSort) {
    // Si viene de los filtros de precio
    sortBy = "price";
    sortOrder = priceSort === "lowest-first" ? "asc" : "desc";
  } else if (dateSort) {
    // Determinar si es fecha de creación o actualización
    if (dateSort.includes("added")) {
      sortBy = "created_at";
    } else if (dateSort.includes("updated")) {
      sortBy = "updated_at";
    }
    // Determinar dirección
    sortOrder = dateSort.includes("asc") ? "asc" : "desc";
  }

  // Mapear estado de stock
  const stockStatus = status
    ? status === "selling"
      ? "in-stock"
      : "out-of-stock"
    : undefined;

  const result = await getProducts({
    page,
    limit,
    search,
    category: category ? parseInt(category) : undefined,
    brand: brand ? parseInt(brand) : undefined,
    active: published,
    minPrice: minPrice ? parseInt(minPrice) : undefined,
    maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
    stockStatus: stockStatus as "in-stock" | "out-of-stock" | undefined,
    minStock: minStock ? parseInt(minStock) : undefined,
    maxStock: maxStock ? parseInt(maxStock) : undefined,
    sortBy,
    sortOrder,
  });

  // Map Decimal fields to numbers and Date fields to strings
  const mappedData = result.data.map((product) => ({
    ...product,
    base_discount: Number(product.base_discount),
    offer_discount: product.offer_discount ? Number(product.offer_discount) : null,
    offer_start_date: product.offer_start_date?.toISOString() ?? null,
    offer_end_date: product.offer_end_date?.toISOString() ?? null,
    created_at: product.created_at.toISOString(),
    updated_at: product.updated_at?.toISOString() ?? null,
    deleted_at: product.deleted_at?.toISOString() ?? null,
  }));

  const mappedResult: FetchProductsResponse = {
    data: mappedData,
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



export async function fetchProductDetails(
  productId: number
): Promise<{ product: ProductDetails | null }> {
  const product = await getProductByIdAction(productId);
  return { product: product as ProductDetails | null };
}
