import { api } from "@/config/api";
import { CartProductsInfo } from "../../types";

export interface CartResponse {
  success: boolean;
  message?: string;
  items: CartProductsInfo[];
  total_items: number;
  total_amount: number;
  cart_id: number;
}
export interface ProductCartData {
  user_id: number;
  product_id: number;
  color_code: string;
  size: string;
  quantity?: number;
}

const BASE_URL = "/api/cart";
const ENDPOINTS = {
  getCart: `${BASE_URL}/getCart`,
  addProduct: `${BASE_URL}/addProduct`,
  deleteProduct: `${BASE_URL}/deleteProduct`,
  updateProduct: `${BASE_URL}/updateProduct`,
  clearCart: `${BASE_URL}/clearCart`,
  getCartItemCount: `${BASE_URL}/getCartItemCount`,
  getCartSummary: `${BASE_URL}/getCartSummary`,
};

const validateUserId = (user_id: number) => {
  if (!user_id || isNaN(user_id)) {
    throw new Error("user_id inválido");
  }
};

export const getCartApi = async (
  user_id: number
): Promise<CartProductsInfo[]> => {
  try {
    validateUserId(user_id);
    const { data } = await api.get<CartResponse>(
      `${ENDPOINTS.getCart}?user_id=${user_id}`
    );
    return data.items;
  } catch (error) {
    
    return [];
  }
};

export const addProductToCartApi = async (
  product: ProductCartData
): Promise<CartResponse> => {
  try {
    validateUserId(product.user_id);
    const { data } = await api.post(ENDPOINTS.addProduct, product);
    return data;
  } catch (error) {
    
    throw error;
  }
};

export const updateQuantityApi = async (
  productData: ProductCartData & { quantity: number }
): Promise<CartResponse> => {
  try {
    validateUserId(productData.user_id);

    if (productData.quantity < 0) {
      throw new Error("La cantidad no puede ser negativa");
    }

    const { data } = await api.put<CartResponse>(
      ENDPOINTS.updateProduct,
      productData
    );
    return data;
  } catch (error) {
    
    throw error;
  }
};

export const removeProductFromCartApi = async (
  product: ProductCartData
): Promise<CartResponse> => {
  try {
    validateUserId(product.user_id);
    const { data } = await api.delete<CartResponse>(ENDPOINTS.deleteProduct, {
      data: product,
    });
    return data;
  } catch (error) {
    
    throw error;
  }
};

export const clearCartApi = async (user_id: number): Promise<CartResponse> => {
  try {
    validateUserId(user_id);
    const { data } = await api.delete<CartResponse>(ENDPOINTS.clearCart, {
      data: { user_id },
    });
    return data;
  } catch (error) {
    
    throw error;
  }
};
