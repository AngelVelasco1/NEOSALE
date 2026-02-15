import { Pagination } from "@/app/(admin)/types/pagination";

export type ProductStatus = "selling" | "out-of-stock";

// Tipo basado en Prisma schema
export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  weight_grams: number;
  sizes: string;
  base_discount: number;
  category_id: number;
  brand_id: number;
  active: boolean;
  in_offer: boolean;
  offer_discount: number | null;
  offer_start_date: string | null;
  offer_end_date: string | null;
  created_at: string;
  created_by: number;
  updated_at: string | null;
  updated_by: number;
  deleted_at: string | null;
  deleted_by: number | null;
  categories: {
    id: number;
    name: string;
  };
  brands: {
    id: number;
    name: string;
  };
  images: Array<{
    image_url: string;
    color: string;
    color_code: string;
    is_primary?: boolean | null;
  }>;
  product_variants?: Array<{
    id: number;
    stock: number;
    size: string;
    color: string;
    color_code: string;
  }>;
  // Propiedad computada para la imagen por defecto
  image_url?: string;
  sku?: string;
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

export type ProductDetails = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  weight_grams: number;
  sizes: string;
  base_discount: number;
  category_id: number;
  brand_id: number;
  active: boolean;
  in_offer: boolean;
  offer_discount: number | null;
  offer_start_date: string | null;
  offer_end_date: string | null;
  created_at: string;
  created_by: number;
  updated_at: string | null;
  updated_by: number;
  deleted_at: string | null;
  deleted_by: number | null;
  categories: {
    name: string;
  };
  brands: {
    name: string;
  };
  images: Array<{
    image_url: string;
    is_primary: boolean;
    color: string | null;
  }>;
  product_variants: Array<{
    id: number;
    color: string;
    color_code: string;
    size: string;
    stock: number;
    price: number | null;
  }>;
};
