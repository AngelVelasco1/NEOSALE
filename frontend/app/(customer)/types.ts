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
  base_discount: number;
  offer_discount: number | null;
  in_offer: boolean;
  offer_end_date: Date | null;
  stock: number;
  category: string;
}
export interface CartProductsInfo {
  id: number;
  category_id?: string;
  name: string; // Consistente con backend
  title?: string; // Opcional para compatibilidad
  description: string;
  color_code: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  total: number;
  stock: number;
  image_url: string | null;
  alt_text: string;
  category: string;
}
export interface CartProductsContext {
  cartProducts: CartProductsInfo[];
  addProductToCart: (product: CartProductsInfo) => void;
  updateQuantity: (
    id: number,
    color_code: string,
    quantity: number,
    size: string
  ) => void;
  removeProductFromCart: (id: number, color_code: string, size: string) => void;
  getCartProductCount: () => number;
  getSubTotal: () => number;
  clearCart: () => void;
  error: string | null;
  clearError: () => void;
  getCart: () => Promise<void>;
  getProductQuantity: (id: number, colorCode: string, size: string) => number;
  incrementQuantity: (
    id: number,
    colorCode: string,
    size: string
  ) => Promise<void>;
  decrementQuantity: (
    id: number,
    colorCode: string,
    size: string
  ) => Promise<void>;
  isLoading: boolean;
}

export interface CategoryWithSubcategories {
  id: number;
  name: string;
  subcategories: {
    id: number;
    name: string;
  }[];
}

export interface FilterState {
  searchTerm: string;
  selectedColors: string[];
  selectedCategories: string[];
  selectedSubcategories: string[];
  priceRange: { min: number; max: number };
  inStockOnly: boolean;
  sortBy: "name" | "price-asc" | "price-desc" | "newest";
}

export interface FilterProps {
  products: IProduct[];
  setFilteredProducts: (products: IProduct[]) => void;
}
