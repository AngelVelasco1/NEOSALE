"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useCart } from "../hooks/useCart";
import Image from "next/image";
import { SetQuantity } from "../../../components/SetQuantity";
import { Button } from "../../../../components/ui/button";
import { Trash2, ShoppingBag, ArrowRight, AlertTriangle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProductVariantApi } from "../../(products)/services/api";
import { CartProductsInfo } from "../../types";
import { useRouter } from "next/navigation";


interface VariantStock {
  [key: string]: {
    stock: number;
    isLoading: boolean;
    lastUpdated: number;
  };
}

export default function CartProducts() {
  const router = useRouter();
  const { cartProducts, updateQuantity, deleteProductFromCart, getSubTotal } = useCart();
  
  const [variantStocks, setVariantStocks] = useState<VariantStock>({});
  const [isUpdatingStocks, setIsUpdatingStocks] = useState(false);

  const getVariantKey = useCallback((product: CartProductsInfo) => {
    return `${product.id}-${product.color_code}-${product.size}`;
  }, []);

  const fetchVariantStock = useCallback(async (product: CartProductsInfo) => {
    const variantKey = getVariantKey(product);
    
    try {
      setVariantStocks(prev => ({
        ...prev,
        [variantKey]: { ...prev[variantKey], isLoading: true }
      }));

      const response = await getProductVariantApi({
        id: product.id,
        color_code: product.color_code,
        size: product.size
      });

      const currentStock = response.data?.stock || response.stock || 0;

      setVariantStocks(prev => ({
        ...prev,
        [variantKey]: {
          stock: currentStock,
          isLoading: false,
          lastUpdated: Date.now()
        }
      }));

      if (product.quantity > currentStock && currentStock > 0) {
        updateQuantity(product.id, product.color_code, currentStock, product.size);
      } else if (currentStock === 0) {
        console.warn(`Producto ${product.name} (${product.color} - ${product.size}) ya no tiene stock disponible`);
      }

      return currentStock;
    } catch (error) {
      console.error(`Error fetching stock for variant ${variantKey}:`, error);
      setVariantStocks(prev => ({
        ...prev,
        [variantKey]: {
          stock: 0,
          isLoading: false,
          lastUpdated: Date.now()
        }
      }));
      return 0;
    }
  }, [getVariantKey, updateQuantity]);

  const updateAllStocks = useCallback(async () => {
    if (cartProducts.length === 0) return;
    
    setIsUpdatingStocks(true);
    
    try {
      const stockPromises = cartProducts.map(product => fetchVariantStock(product));
      await Promise.allSettled(stockPromises);
    } finally {
      setIsUpdatingStocks(false);
    }
  }, [cartProducts, fetchVariantStock]);

  // ✅ EFECTO PARA CARGAR STOCKS AL MONTAR EL COMPONENTE
  useEffect(() => {
    updateAllStocks();
  }, [updateAllStocks]);

  const getCurrentStock = useCallback((product: CartProductsInfo) => {
    const variantKey = getVariantKey(product);
    const variantStock = variantStocks[variantKey];
    
    if (!variantStock) return product.stock; // Fallback al stock original
    return variantStock.stock;
  }, [getVariantKey, variantStocks]);

  // ✅ FUNCIÓN PARA VERIFICAR SI UNA VARIANTE ESTÁ CARGANDO
  const isVariantLoading = useCallback((product: CartProductsInfo) => {
    const variantKey = getVariantKey(product);
    return variantStocks[variantKey]?.isLoading || false;
  }, [getVariantKey, variantStocks]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
              Mi Carrito
            </h1>
        
          </div>
          <p className="text-gray-600 font-medium">
            {cartProducts.length}{" "}
            {cartProducts.length === 1 ? "producto" : "productos"} en tu carrito
          </p>
        </motion.div>

        {/* Empty State */}
        {cartProducts.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Tu carrito está vacío
            </h3>
            <p className="text-gray-500 mb-6">
              ¡Descubre nuestros increíbles productos!
            </p>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg"
              onClick={() => window.history.back()}
            >
              Continuar Comprando
            </Button>
          </motion.div>
        )}

        {cartProducts.length > 0 && (
          <motion.div
            className="mb-8 bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <div className="text-sm text-gray-600 mb-1">
                  Total del carrito
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ${getSubTotal().toLocaleString()}
                </div>
              </div>

              <div className="flex flex-col items-center sm:flex-row gap-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="border-gray-200 text-gray-700 hover:bg-gray-50 px-5 py-5 rounded-lg font-medium transition-all duration-300"
                  onClick={() => window.history.back()}
                >
                  Seguir Comprando
                </Button>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button onClick={() => router.push('/checkout')} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-5 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl group">
                    <span>Proceder al Pago</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Envío gratis en compras superiores a $100.000</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Entrega en 2-3 días hábiles</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Cart Items */}
        <AnimatePresence mode="wait">
          {cartProducts.length > 0 && (
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {cartProducts.map((product) => {
                const currentStock = getCurrentStock(product);
                const isLoading = isVariantLoading(product);
                const isOutOfStock = currentStock === 0;
                const hasLimitedStock = currentStock < product.quantity && currentStock > 0;

                return (
                  <motion.div
                    key={`${product.id}-${product.color_code}-${product.size}`}
                    variants={itemVariants}
                    layout
                    className={`group bg-white rounded-2xl p-6 shadow-sm border transition-all duration-300 hover:shadow-md ${
                      isOutOfStock 
                        ? "border-red-200 bg-red-50/30" 
                        : hasLimitedStock 
                          ? "border-yellow-200 bg-yellow-50/30"
                          : "border-gray-100 hover:border-blue-200"
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      {/* Product Image */}
                      <motion.div
                        className={`relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 ${
                          isOutOfStock ? "opacity-60" : ""
                        }`}
                        whileHover={{ scale: isOutOfStock ? 1 : 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Image
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name || "Producto"}
                          fill
                          className="object-fit"
                        />
                        {isLoading && (
                          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                            <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                          </div>
                        )}
                      </motion.div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold mb-1 truncate ${
                          isOutOfStock ? "text-gray-500" : "text-gray-900"
                        }`}>
                          {product.name}
                        </h3>
                        
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                            {product.size}
                          </span>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200"
                              style={{ backgroundColor: product.color_code }}
                              title={product.color}
                            />
                            <span className="text-sm text-gray-500">
                              {product.color}
                            </span>
                          </div>
                        </div>

                   

                        {/* Price */}
                        <div className={`text-lg font-bold ${
                          isOutOfStock ? "text-gray-400" : "text-blue-600"
                        }`}>
                          ${product.price.toLocaleString()}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-center gap-x-8 gap-y-3">
                        <div className="text-right min-w-[80px]">
                          <div className={`text-lg font-bold ${
                            isOutOfStock ? "text-gray-400" : "text-gray-900"
                          }`}>
                            ${(product.price * product.quantity).toLocaleString()}
                          </div>
                          {product.quantity > 1 && (
                            <div className="text-xs text-gray-500">
                              {product.quantity} × $
                              {product.price.toLocaleString()}
                            </div>
                          )}
                        </div>
                        
                        <SetQuantity
                          cartProduct={product}
                          disabled={isOutOfStock || isLoading} // ✅ DESHABILITAR SI NO HAY STOCK
                          handleDecrease={() => {
                            const newQuantity = Math.max(1, product.quantity - 1);
                            if (newQuantity !== product.quantity) {
                              updateQuantity(
                                product.id,
                                product.color_code,
                                newQuantity,
                                product.size
                              );
                            }
                          }}
                          handleIncrease={() => {
                            // ✅ USAR currentStock EN LUGAR DE product.stock
                            const newQuantity = Math.min(currentStock, product.quantity + 1);
                            if (newQuantity !== product.quantity && currentStock > 0) {
                              updateQuantity(
                                product.id,
                                product.color_code,
                                newQuantity,
                                product.size
                              );
                            }
                          }}
                        />
                      </div>

                      <motion.button
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
                        onClick={() =>
                          deleteProductFromCart(
                            product.id,
                            product.color_code,
                            product.size
                          )
                        }
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>

                    {/* ✅ MENSAJE DE ADVERTENCIA PARA PRODUCTOS SIN STOCK */}
                    {isOutOfStock && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                      >
                        <div className="flex items-center gap-2 text-sm text-red-700">
                          <AlertTriangle className="w-4 h-4" />
                          <span>
                            Este producto ya no está disponible. Te recomendamos eliminarlo del carrito.
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}