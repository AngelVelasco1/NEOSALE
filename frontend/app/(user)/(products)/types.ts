export interface IProductImage {
  color: string;
  colorcode: string;
  imageurl: string;
}

export interface IProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  color: string;
  colorCode: string;
  images: IProductImage[]
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