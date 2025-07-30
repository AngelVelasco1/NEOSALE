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
  discount: number;
  stock: number;
  category: string;
}
export interface CartProductsInfo {
    id: number;
    color: string;
    colorCode: string;
    imageUrl: string;
    name: string;
    price: number;
    size: string;
    quantity: number;
    total: number;
}
export interface CartProductsContext {
    cartProducts: CartProductsInfo[],
    addProductToCart: (product: CartProductsInfo) => void,
    updateQuantity: (id: number, color: string, quantity: number, size: string) => void,
    removeProductCart: (id: number, color: string, size: string) => void;
    getCartProductCount: () => number;
    getSubTotal: () => number;
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