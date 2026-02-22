import { Pagination } from "@/app/(admin)/types/pagination";

export type Category = {
  id: number;
  name: string;
  description: string | null;
  id_subcategory: number | null;
  active: boolean;
  deleted_at: Date | null;
  deleted_by: number | null;
  subcategory: {
    id: number;
    name: string;
  } | null;
  subcategories?: {
    id: number;
    name: string;
    active: boolean;
  }[];
  _count?: {
    products: number;
  };
};

export interface FetchCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  status?: string;
}

export interface FetchCategoriesResponse {
  data: Category[];
  pagination: Pagination;
}

export type CategoryDropdown = Pick<Category, "id" | "name">;
