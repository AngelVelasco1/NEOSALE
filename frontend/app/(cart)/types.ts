export interface CartProductsInfo {
    id: number;
    color: string;
    colorCode: string;
    imageUrl: string;
    name: string;
    price: number;
    size: string;
    quantity: number;
}
export interface CartProductsContext {
    cartProducts: CartProductsInfo[],
    addProductToCart: (product: CartProductsInfo) => void,
    updateQuantity: (id: number, color: string, quantity: number, size: string) => void,
    removeProductCart: (id: number, color: string, size: string) => void;
}