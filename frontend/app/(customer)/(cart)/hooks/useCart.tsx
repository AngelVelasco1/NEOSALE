"use client";

import React, {
  useContext,
  createContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import { CartProductsContext, CartProductsInfo } from "../../types";
import { useUserSafe } from "../../../(auth)/hooks/useUserSafe";
import {
  addProductToCartApi,
  getCartApi,
  removeProductFromCartApi,
  updateQuantityApi,
  clearCartApi,
} from "../services/cartApi";
import { ErrorsHandler } from "@/app/errors/errorsHandler";

const CartContext = createContext<CartProductsContext | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { userProfile } = useUserSafe();

  const [cartProducts, setCartProducts] = useState<CartProductsInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const getLocalCart = (): CartProductsInfo[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error charging local cart:", error);
      return [];
    }
  };

  const setLocalCart = (cart: CartProductsInfo[]) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving local cart:", error);
    }
  };

  const clearLocalCart = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("cart");
  };


  const showError = (title: string, message: string) => {
    setError(message);
    ErrorsHandler.showError(title, message);
  };

  const clearError = () => setError(null);
  const syncLocalCartToServer = async () => {
    if (!userProfile) return;

    const localCart = getLocalCart();
    if (localCart.length === 0) return;

    try {
      for (const product of localCart) {
        await addProductToCartApi({
          user_id: userProfile.id,
          product_id: product.id,
          quantity: product.quantity,
          color_code: product.color_code,
          size: product.size
        });
      }
      clearLocalCart();
    } catch (error) {
      console.error("Error syncing local cart to server:", error);
    }
  };


  const cartMetrics = useMemo(() => {
    const safeCartProducts = Array.isArray(cartProducts) ? cartProducts : [];

    const totalItems = safeCartProducts.reduce((total, product) => total + product.quantity, 0);
    const subTotal = safeCartProducts.reduce(
      (total, product) => total + (product.quantity * product.price),
      0
    );

    return {
      totalItems,
      subTotal,
      uniqueProducts: safeCartProducts.length
    };
  }, [cartProducts]); // ✅ SOLO cartProducts como dependencia

  // ===================================
  // FUNCIÓN PRINCIPAL PARA OBTENER CARRITO
  // ===================================

  const getCart = useCallback(async () => {
    if (!userProfile) {
      const localCart = getLocalCart();
      setCartProducts(Array.isArray(localCart) ? localCart : []);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const serverCart = await getCartApi(userProfile.id);
      setCartProducts(Array.isArray(serverCart) ? serverCart : []);
    } catch (error) {
      console.error("Error loading cart:", error);
      showError("Error", "No pudimos cargar los productos del carrito");
      setCartProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [userProfile]); // ✅ SOLO userProfile como dependencia

  // ===================================
  // INICIALIZACIÓN DEL CARRITO
  // ===================================

  useEffect(() => {
    const initializeCart = async () => {
      if (userProfile) {
        await syncLocalCartToServer();
      }
      await getCart();
    };

    initializeCart();
  }, [userProfile, getCart]); // ✅ Dependencias necesarias

  // ===================================
  // FUNCIONES DE GESTIÓN DE PRODUCTOS
  // ===================================

  const getProductQuantity = useCallback((
    id: number,
    colorCode: string,
    size: string
  ): number => {
    const product = cartProducts.find(
      p => p.id === id && p.color_code === colorCode && p.size === size
    );
    return product?.quantity || 0;
  }, [cartProducts]); // ✅ SOLO cartProducts como dependencia

  const addProductToCart = useCallback(
    async (product: CartProductsInfo) => {
      try {
        if (userProfile) {
          const response = await addProductToCartApi({
            user_id: userProfile.id,
            product_id: product.id,
            quantity: product.quantity,
            color_code: product.color_code,
            size: product.size,
          });

          // ✅ ACTUALIZACIÓN INMEDIATA: Sin recargar página
          if (response.success && response.items) {
            setCartProducts(Array.isArray(response.items) ? response.items : []);
          } else {
            // Solo si falla, recargar
            const serverCart = await getCartApi(userProfile.id);
            setCartProducts(Array.isArray(serverCart) ? serverCart : []);
          }
        } else {
          // Modo local - actualización inmediata
          setCartProducts(prevCart => {
            const safeCart = Array.isArray(prevCart) ? prevCart : [];
            const existingProductIndex = safeCart.findIndex(
              item => item.id === product.id &&
                item.color_code === product.color_code &&
                item.size === product.size
            );

            let updatedCart;
            if (existingProductIndex >= 0) {
              updatedCart = safeCart.map((item, index) =>
                index === existingProductIndex
                  ? { ...item, quantity: item.quantity + product.quantity }
                  : item
              );
            } else {
              updatedCart = [...safeCart, product];
            }

            setLocalCart(updatedCart);
            return updatedCart;
          });
        }
      } catch (error) {
        console.error("Error adding product to cart:", error);
        showError("Error", "No pudimos agregar el producto al carrito");
      }
    }, [userProfile]); // ✅ SOLO userProfile como dependencia

  const updateQuantity = useCallback(
    async (id: number, color_code: string, quantity: number, size: string) => {
      const currentProduct = cartProducts.find(
        product =>
          product.id === id &&
          product.color_code === color_code &&
          product.size === size
      );

      if (!currentProduct) {
        showError("Error", "Producto no encontrado en el carrito");
        return;
      }

      if (quantity > currentProduct.stock) {
        ErrorsHandler.showInfo("Superaste el stock disponible");
        return;
      }

      try {
        if (userProfile) {
          const response = await updateQuantityApi({
            user_id: userProfile.id,
            product_id: id,
            quantity,
            color_code,
            size
          });

          // ✅ ACTUALIZACIÓN INMEDIATA: Sin recargar página
          if (response.success && response.items) {
            setCartProducts(Array.isArray(response.items) ? response.items : []);
          } else {
            // Solo si falla, recargar
            const serverCart = await getCartApi(userProfile.id);
            setCartProducts(Array.isArray(serverCart) ? serverCart : []);
          }
        } else {
          // Modo local - actualización inmediata
          const updatedCart = cartProducts.map(product =>
            product.id === id &&
              product.color_code === color_code &&
              product.size === size
              ? { ...product, quantity }
              : product
          );
          setCartProducts(updatedCart);
          setLocalCart(updatedCart);
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
        showError("Error", "No pudimos actualizar la cantidad del producto");
      }
    }, [userProfile, cartProducts]); // ✅ Dependencias necesarias

  const removeProductFromCart = useCallback(
    async (
      id: number,
      color_code: string,
      size: string
    ) => {
      try {
        if (userProfile) {
          const response = await removeProductFromCartApi({
            user_id: userProfile.id,
            product_id: id,
            color_code,
            size,
          });

          // ✅ ACTUALIZACIÓN INMEDIATA: Sin recargar página
          if (response.success && response.items) {
            setCartProducts(Array.isArray(response.items) ? response.items : []);
          } else {
            // Solo si falla, recargar
            const serverCart = await getCartApi(userProfile.id);
            setCartProducts(Array.isArray(serverCart) ? serverCart : []);
          }
        } else {
          // Modo local - actualización inmediata
          const updatedCart = cartProducts.filter(
            product => !(product.id === id &&
              product.color_code === color_code &&
              product.size === size)
          );
          setCartProducts(updatedCart);
          setLocalCart(updatedCart);
        }
      } catch (error) {
        console.error("Error removing product:", error);
        showError("Error", "No pudimos eliminar el producto del carrito");
      }
    }, [userProfile, cartProducts]); // ✅ Dependencias necesarias

  // ===================================
  // FUNCIONES DE MÉTRICAS Y CONTADORES
  // ===================================

  const getCartProductCount = useCallback(() => {
    return cartMetrics.uniqueProducts;
  }, [cartMetrics.uniqueProducts]);

  const getSubTotal = useCallback(() => {
    return cartMetrics.subTotal;
  }, [cartMetrics.subTotal]);

  // ===================================
  // LIMPIAR CARRITO
  // ===================================

  const clearCart = useCallback(async () => {
    try {
      if (userProfile) {
        await clearCartApi(userProfile.id);
      }

      setCartProducts([]);
      clearLocalCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
      ErrorsHandler.showError("Error:", "No se pudo limpiar el carrito");
    }
  }, [userProfile]);


  const incrementQuantity = useCallback(async (
    id: number,
    colorCode: string,
    size: string
  ) => {
    const currentQuantity = getProductQuantity(id, colorCode, size);
    await updateQuantity(id, colorCode, currentQuantity + 1, size);
  }, [getProductQuantity, updateQuantity]);

  const decrementQuantity = useCallback(async (
    id: number,
    colorCode: string,
    size: string
  ) => {
    const currentQuantity = getProductQuantity(id, colorCode, size);
    if (currentQuantity > 1) {
      await updateQuantity(id, colorCode, currentQuantity - 1, size);
    }
  }, [getProductQuantity, updateQuantity]);


  const contextValue = useMemo((): CartProductsContext => ({
    cartProducts: Array.isArray(cartProducts) ? cartProducts : [], // ✅ Protección simple
    addProductToCart,
    updateQuantity,
    removeProductFromCart,
    getCartProductCount,
    getSubTotal,
    clearCart,
    getCart,
    error,
    clearError,
    incrementQuantity,
    decrementQuantity,
    getProductQuantity,
    isLoading,
  }), [
    cartProducts,
    addProductToCart,
    updateQuantity,
    removeProductFromCart,
    getCartProductCount,
    getSubTotal,
    clearCart,
    getCart,
    error,
    clearError,
    incrementQuantity,
    decrementQuantity,
    getProductQuantity,
    isLoading,
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new error("useCart must be used within a CartProvider");
  }
  return context;
};