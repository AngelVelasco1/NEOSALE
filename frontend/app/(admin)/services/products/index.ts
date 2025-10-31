// TODO: Migrar a Prisma - Servicio temporalmente deshabilitado
// import { SupabaseClient } from "@supabase/supabase-js";
// import { Database } from "@/types/supabase";
// import { queryPaginatedTable } from "@/helpers/queryPaginatedTable";
import {
  Product,
  FetchProductsParams,
  FetchProductsResponse,
  ProductDetails,
} from "./types";

// Migrado a Prisma - Usa API routes
export async function fetchProducts(
  params: FetchProductsParams,
  _client?: any // No se usa más, mantenido por compatibilidad
): Promise<FetchProductsResponse> {
  const {
    page = 1,
    limit = 10,
    search,
    category,
    priceSort,
    status,
    published,
    dateSort,
  } = params;
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(category && { category }),
    ...(status && { status }),
    ...(published !== undefined && { published: published.toString() }),
  });

  const response = await fetch(`/api/products?${queryParams.toString()}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
  
  /* CÓDIGO ORIGINAL CON SUPABASE - ARCHIVADO
  const selectQuery = `
    *,
    categories!inner (
      name,
      slug
    )
  `;

  let query = client.from("products").select(selectQuery, { count: "exact" });

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  if (category) {
    query = query.eq("categories.slug", category);
  }

  if (status) {
    if (status === "selling") {
      query = query.gt("stock", 0);
    } else if (status === "out-of-stock") {
      query = query.eq("stock", 0);
    }
  }

  if (published !== undefined) {
    query = query.eq("published", published);
  }

  if (priceSort) {
    query = query.order("selling_price", {
      ascending: priceSort === "lowest-first",
    });
  } else if (dateSort) {
    const [field, direction] = dateSort.split("-");
    query = query.order(field === "added" ? "created_at" : "updated_at", {
      ascending: direction === "asc",
    });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const paginatedProducts = await queryPaginatedTable<Product, "products">({
    name: "products",
    page,
    limit,
    query,
  });

  return paginatedProducts;
}

export async function fetchProductDetails(
  client: SupabaseClient<Database>,
  { slug }: { slug: string }
) {
  const selectQuery = `
    id,
    name,
    description,
    cost_price,
    selling_price,
    stock,
    min_stock_threshold,
    category_id,
    image_url,
    slug,
    sku,
    categories(name)
  `;

  const { data, error } = await client
    .from("products")
    .select(selectQuery)
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(error.message);
    throw new Error(`Failed to fetch product details: ${error.message}`);
  }

  if (!data) {
    console.error("Failed to fetch product details");
    throw new Error("Failed to fetch product details");
  }

  return {
    product: data as ProductDetails,
  };
  */
}

// Stub temporal para fetchProductDetails
export async function fetchProductDetails(
  client: any,
  slug: string
): Promise<{ product: ProductDetails | null }> {
  // TODO: Implementar con Prisma
  return { product: null };
}
