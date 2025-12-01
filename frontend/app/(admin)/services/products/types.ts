import { Database } from "@/types/supabase";
import { Pagination } from "@/types/pagination";

import { SBCategory } from "../categories/types";

export type ProductStatus = "selling" | "out-of-stock";

export type SBProduct = Database["public"]["Tables"]["products"]["Row"];

export type Product = SBProduct & {
  categories: {
    name: string | null;
    slug: string | null;
  } | null;
};

export interface FetchProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  priceSort?: string;
  minPrice?: string;
  maxPrice?: string;
  status?: string;
  minStock?: string;
  maxStock?: string;
  published?: boolean;
  dateSort?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface FetchProductsResponse {
  data: Product[];
  pagination: Pagination;
}

export type ProductDetails = Pick<
  SBProduct,
  | "id"
  | "name"
  | "description"
  | "cost_price"
  | "selling_price"
  | "stock"
  | "min_stock_threshold"
  | "category_id"
  | "image_url"
  | "slug"
  | "sku"
> & {
  categories: Pick<SBCategory, "name">;
};
