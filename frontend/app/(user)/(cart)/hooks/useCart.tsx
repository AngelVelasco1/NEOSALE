"use client"

import React from 'react';
import {useContext, createContext, useState, useCallback, ReactNode} from 'react';
import { CartProductsContext, CartProductsInfo } from '../../types';

const CartContext = createContext<CartProductsContext | undefined>(undefined) ;

export const CartProvider = ({children}: {children: ReactNode}) => {
    const [cartProducts, setCartProduct] = useState<CartProductsInfo[]>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("cart");
            return stored ? JSON.parse(stored) : [];
        }
        return [];
    });
    
    const addProductToCart = useCallback((product: CartProductsInfo) => {
        setCartProduct((prevCart) => {
            const existingProduct = prevCart.find(
              (item) => item.id === product.id && item.colorCode === product.colorCode && item.size === product.size
            );
            if (existingProduct) {
              return prevCart.map((item) =>
                item.id === product.id && item.colorCode === product.colorCode && item.size === product.size
                  ? { ...item, quantity: item.quantity + product.quantity }
                  : item
              );
            }
            
            return [...prevCart, product];
          })
          localStorage.setItem("cart", JSON.stringify([...cartProducts, product]));
        }, [])

    const updateQuantity = (id: number, color: string, quantity: number, size: string) => {
        setCartProduct((prevCart) =>
          prevCart.map((product) =>
            product.id === id && product.colorCode === color && product.size === size? { ...product, quantity } : product
          )
        );
      };

    const removeProductCart = (id: number, color: string, size: string) => {
        setCartProduct((prev) => prev.filter((product) => !(product.id === id && product.colorCode == color && product.size === size)))
        localStorage.setItem("cart", JSON.stringify(cartProducts.filter((product) => !(product.id === id && product.colorCode == color && product.size === size))));
    }

    const getCartProductCount = useCallback(() => {
        return cartProducts.length;
    }, [cartProducts]);

    const getSubTotal = () => cartProducts.reduce((total, product) => total + product.quantity * product.price, 0);

    return (
    <CartContext.Provider value={{ cartProducts, addProductToCart, updateQuantity, removeProductCart, getCartProductCount, getSubTotal}}>
        {children}
    </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext);
    if(!context) {
        throw new Error("use cart must be within a provider")
    }
    return context;
}

