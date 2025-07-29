export interface IProductImage {
  color: string;
  color_code: string;
  image_url: string;
}

export interface IProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
  color: string;
  color_code: string;
  images: IProductImage[];
}

export interface IProductDetails {
  id: number;
  images: IProductImage[];
  name: string;
  description: string;
  price: number;
  quantity: number;
  sizes: string;
  stock: number;
  category: string;
}


export interface FilterState {
  searchTerm: string
  selectedColors: string[]
  selectedCategories: string[]
  priceRange: { min: number; max: number }
  inStockOnly: boolean
  sortBy: "name" | "price-asc" | "price-desc" | "newest"
}

export interface FilterProps {
  products: IProduct[]
  setFilteredProducts: (products: IProduct[]) => void
}