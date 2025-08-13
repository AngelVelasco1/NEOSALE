"use client";

import React, { useContext, createContext, useState, useCallback, useEffect, ReactNode } from "react";
import { CartProductsContext, CartProductsInfo } from "../../types";
import { useUserSafe } from "../../../(auth)/hooks/useUserSafe";
import { addProductToCartApi, getCartApi, deleteProductFromCartApi, updateQuantityApi } from "../services/api";
import { ErrorsHandler } from "@/app/errors/errorsHandler";

const CartContext = createContext<CartProductsContext | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { userProfile } = useUserSafe();
  const [cartProducts, setCartProduct] = useState<CartProductsInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialCart = async () => {
      setIsLoading(true);

      if (userProfile) {
        try {
          localStorage.removeItem("cart");
          const cartItems = await getCartApi(userProfile.id);
          setCartProduct(cartItems || []);
        } catch (error) {
          console.error("Error loading cart", error);
          setCartProduct([]);
        }
      } else {
        const stored = localStorage.getItem("cart");
        setCartProduct(stored ? JSON.parse(stored) : []);
      }

      setIsLoading(false);
    };

    loadInitialCart();
  }, [userProfile]);

  const addProductToCart = useCallback(
    async (product: CartProductsInfo) => {
      if (userProfile) {
        try {
          const productData = {
            user_id: userProfile.id,
            product_id: product.id,
            quantity: product.quantity,
            color_code: product.color_code,
            size: product.size,
          };

          await addProductToCartApi(productData);
          const cartItem = await getCartApi(userProfile.id);
          setCartProduct(cartItem);
        } catch (error) {
          console.error("Error adding product to cart:", error);
        }
      } else {
        setCartProduct((prevCart) => {
          const existingProduct = prevCart.find(
            (item) =>
              item.id === product.id &&
              item.color_code === product.color_code &&
              item.size === product.size
          );

          let updatedCart;
          if (existingProduct) {
            updatedCart = prevCart.map((item) =>
              item.id === product.id &&
                item.color_code === product.color_code &&
                item.size === product.size
                ? { ...item, quantity: item.quantity + product.quantity }
                : item
            );
          } else {
            updatedCart = [...prevCart, product];
          }

          localStorage.setItem("cart", JSON.stringify(updatedCart));
          return updatedCart;
        });
      }
    },
    [userProfile]
  );

  const updateQuantity = useCallback(async (
    id: number,
    color_code: string,
    quantity: number,
    size: string
  ) => {

    const currentProduct = cartProducts.find(
      (product) =>
        product.id === id &&
        product.color_code === color_code &&
        product.size === size
    )

    if (quantity > currentProduct!.stock) {
      ErrorsHandler.showInfo("Superaste el stock disponible")
      return
    };

    if (userProfile) {
      const productData = {
        user_id: userProfile.id,
        product_id: id,
        quantity,
        color_code,
        size
      };

      await updateQuantityApi(productData);
      const updatedCart = await getCartApi(userProfile.id);
      setCartProduct(updatedCart || []);
    } else {
      setCartProduct((prevCart) =>
        prevCart.map((product) =>
          product.id === id &&
            product.color_code === color_code &&
            product.size === size
            ? { ...product, quantity }
            : product
        )
      );
      const updatedCart = cartProducts.map((product) =>
        product.id === id &&
          product.color_code === color_code &&
          product.size === size
          ? { ...product, quantity }
          : product
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  }, [userProfile, cartProducts]);

  const deleteProductFromCart = async (id: number, color_code: string, size: string) => {
    setCartProduct((prev) =>
      prev.filter(
        (product) =>
          !(
            product.id === id &&
            product.color_code === color_code &&
            product.size === size
          )
      )
    );

    if (userProfile) {
      const productData = {
        user_id: userProfile.id,
        product_id: id,
        color_code,
        size
      };

      await deleteProductFromCartApi(productData)
    } else {
      const filteredCart = cartProducts.filter(
        (product) =>
          !(
            product.id === id &&
            product.color_code === color_code &&
            product.size === size
          )
      );
      localStorage.setItem("cart", JSON.stringify(filteredCart));
    }
  };

  const getCartProductCount = useCallback(() => {
    return cartProducts.length;
  }, [cartProducts]);

  const getSubTotal = () =>
    cartProducts.reduce(
      (total, product) => total + product.quantity * product.price,
      0
    );

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        addProductToCart,
        updateQuantity,
        deleteProductFromCart,
        getCartProductCount,
        getSubTotal,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("use cart must be within a provider");
  }
  return context;
};
