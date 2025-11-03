import {
  getProducts,
  getProductById as getProductByIdAction,
} from "@/app/(admin)/actions/products/getProducts";
import {
  FetchProductsParams,
  FetchProductsResponse,
  ProductDetails,
} from "./types";

// Migrado a Server Actions con Prisma
export async function fetchProducts(
  params: FetchProductsParams
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

  // Mapear parámetros al formato de la Server Action
  const sortBy = priceSort
    ? "price"
    : dateSort
    ? dateSort.includes("added")
      ? "created_at"
      : "updated_at"
    : "created_at";

  const sortOrder =
    priceSort === "lowest-first" || dateSort?.includes("asc")
      ? "asc"
      : "desc";

  const stockStatus = status
    ? status === "selling"
      ? "in-stock"
      : "out-of-stock"
    : undefined;

  return getProducts({
    page,
    limit,
    search,
    category: category ? parseInt(category) : undefined,
    active: published,
    stockStatus: stockStatus as "in-stock" | "out-of-stock" | undefined,
    sortBy: sortBy as "price" | "created_at" | "updated_at",
    sortOrder: sortOrder as "asc" | "desc",
  });
  
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

export async function fetchProductDetails(
  productId: number
): Promise<{ product: ProductDetails | null }> {
  const product = await getProductByIdAction(productId);
  return { product: product as ProductDetails | null };
}
