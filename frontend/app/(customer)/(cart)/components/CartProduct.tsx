"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useCart } from "../hooks/useCart"; import Image from "next/image";
import { Button } from "../../../../components/ui/button";
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  Package,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProductVariantApi } from "../../(products)/services/api";
import { CartProductsInfo } from "../../types";
import { useRouter } from "next/navigation";


interface VariantStock {
  stock: number;
  isLoading: boolean;
  lastUpdated: number;
  error?: string;
}

interface VariantStockMap {
  [key: string]: VariantStock;
}

interface ProductItemProps {
  product: CartProductsInfo;
  currentStock: number;
  isStockLoading: boolean;
  onRefreshStock: (product: CartProductsInfo) => void;
}

const ProductItem = React.memo<ProductItemProps>(({
  product,
  currentStock,
  isStockLoading,
  onRefreshStock
}) => {
  const {
    updateQuantity,
    removeProductFromCart,
    incrementQuantity,
    decrementQuantity,
    getProductQuantity
  } = useCart();

  const productQuantity = getProductQuantity(product.id, product.color_code, product.size);
  const isOutOfStock = currentStock === 0;
  const hasLimitedStock = currentStock < productQuantity && currentStock > 0;
  const totalPrice = product.price * productQuantity;

  const handleDecrease = useCallback(async () => {
    if (productQuantity > 1) {
      await decrementQuantity(product.id, product.color_code, product.size);
    }
  }, [productQuantity, decrementQuantity, product.id, product.color_code, product.size]);

  const handleIncrease = useCallback(async () => {
    if (productQuantity < currentStock) {
      await incrementQuantity(product.id, product.color_code, product.size);
    }
  }, [productQuantity, currentStock, incrementQuantity, product.id, product.color_code, product.size]);

  const handleQuantityChange = useCallback(async (newQuantity: number) => {
    if (newQuantity !== productQuantity && newQuantity <= currentStock && newQuantity > 0) {
      await updateQuantity(product.id, product.color_code, newQuantity, product.size);
    }
  }, [productQuantity, currentStock, updateQuantity, product.id, product.color_code, product.size]);

  const handleRemove = useCallback(async () => {
    await removeProductFromCart(product.id, product.color_code, product.size);
  }, [removeProductFromCart, product.id, product.color_code, product.size]);




  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100 }
  };

  return (
    <motion.div
      variants={itemVariants}
      layout
      className={`group bg-white rounded-2xl p-6 shadow-sm border transition-all duration-300 hover:shadow-md ${isOutOfStock
        ? "border-red-200 bg-red-50/30"
        : hasLimitedStock
          ? "border-yellow-200 bg-yellow-50/30"
          : "border-gray-100 hover:border-blue-200"
        }`}
    >
      <div className="flex items-center gap-6">
        {/* Imagen del Producto */}
        <motion.div
          className={`relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 ${isOutOfStock ? "opacity-60" : ""
            }`}
          whileHover={{ scale: isOutOfStock ? 1 : 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Image
            src={product.image_url || "/placeholder.svg"}
            alt={product.name || product.title || "Producto"}
            fill
            className="object-cover"
            sizes="96px"
          />
          {isStockLoading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
            </div>
          )}
        </motion.div>

        {/* Información del Producto */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold mb-1 truncate ${isOutOfStock ? "text-gray-500" : "text-gray-900"
            }`}>
            {product.name || product.title}
          </h3>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1">
              <Package className="w-3 h-3" />
              {product.size}
            </span>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200"
                style={{ backgroundColor: product.color_code }}
                title={product.color}
              />
              <span className="text-sm text-gray-500">{product.color}</span>
            </div>
          </div>

          {/* Estado del Stock con Refresh */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2">
              {isStockLoading ? (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Verificando stock...
                </span>
              ) : isOutOfStock ? (
                <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  Sin stock
                </span>
              ) : hasLimitedStock ? (
                <span className="text-xs text-yellow-600 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Stock limitado ({currentStock} disponibles)
                </span>
              ) : (
                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {currentStock} disponibles
                </span>
              )}
            </div>


          </div>

          {/* Precio Unitario */}
          <div className={`text-lg font-bold ${isOutOfStock ? "text-gray-400" : "text-blue-600"
            }`}>
            ${product.price.toLocaleString()}
          </div>
        </div>

        <div className="flex flex-col items-end gap-4">
          {/* Precio Total */}
          <div className="text-right min-w-[100px]">
            <div className={`text-xl font-bold ${isOutOfStock ? "text-gray-400" : "text-gray-900"
              }`}>
              ${totalPrice.toLocaleString()}
            </div>
            {productQuantity > 1 && (
              <div className="text-xs text-gray-500">
                {productQuantity} × ${product.price.toLocaleString()}
              </div>
            )}
          </div>

          {/* Controles de Cantidad Personalizados */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={handleDecrease}
              disabled={productQuantity <= 1 || isOutOfStock || isStockLoading}
              className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              -
            </motion.button>

            <div className="w-12 text-center font-medium">
              {productQuantity}
            </div>

            <motion.button
              onClick={handleIncrease}
              disabled={productQuantity >= currentStock || isOutOfStock || isStockLoading}
              className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              +
            </motion.button>
          </div>
        </div>

        {/* Botón Eliminar */}
        <motion.button
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
          onClick={handleRemove}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={isStockLoading}
        >
          <Trash2 className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Mensajes de Advertencia */}
      <AnimatePresence>
        {isOutOfStock && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-red-700">
                <AlertTriangle className="w-4 h-4" />
                <span>Este producto ya no está disponible.</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRemove}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Eliminar
              </Button>
            </div>
          </motion.div>
        )}

        {hasLimitedStock && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-yellow-700">
                <AlertTriangle className="w-4 h-4" />
                <span>Solo quedan {currentStock} unidades disponibles.</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuantityChange(currentStock)}
                className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
              >
                Ajustar a {currentStock}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

ProductItem.displayName = 'ProductItem';

export default function CartProducts() {
  const router = useRouter();
  const {
    cartProducts,
    getSubTotal,
    getCartProductCount,
    clearCart,
    getCart,
    isLoading: cartLoading,
    error,
    clearError
  } = useCart();

  const [variantStocks, setVariantStocks] = useState<VariantStockMap>({});
  const [isUpdatingStocks, setIsUpdatingStocks] = useState(false);



  const getVariantKey = useCallback((product: CartProductsInfo) => {
    return `${product.id}-${product.color_code}-${product.size}`;
  }, []);

  const fetchVariantStock = useCallback(async (product: CartProductsInfo) => {
    const variantKey = getVariantKey(product);

    try {
      setVariantStocks(prev => ({
        ...prev,
        [variantKey]: {
          ...prev[variantKey],
          isLoading: true,
          error: undefined
        }
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

      return currentStock;
    } catch (error) {
      console.error(`Error fetching stock for variant ${variantKey}:`, error);
      setVariantStocks(prev => ({
        ...prev,
        [variantKey]: {
          stock: 0,
          isLoading: false,
          lastUpdated: Date.now(),
          error: 'Error al cargar stock'
        }
      }));
      return 0;
    }
  }, [getVariantKey]); // ✅ Incluir dependencia necesaria

  const updateAllStocks = useCallback(async () => {
    if (cartProducts.length === 0) return;

    setIsUpdatingStocks(true);

    try {
      const stockPromises = cartProducts.map(product => fetchVariantStock(product));
      await Promise.allSettled(stockPromises);
    } finally {
      setIsUpdatingStocks(false);
    }
  }, [cartProducts, fetchVariantStock]); // ✅ Incluir dependencias necesarias

  const refreshSingleStock = useCallback(async (product: CartProductsInfo) => {
    await fetchVariantStock(product);
  }, [fetchVariantStock]); // ✅ Incluir dependencia necesaria

  // ===================================
  // EFECTOS OPTIMIZADOS
  // ===================================

  useEffect(() => {
    if (!cartLoading && cartProducts.length > 0) {
      updateAllStocks();
    }
  }, [cartLoading, cartProducts, updateAllStocks]);

  // Auto-refresh cart every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (cartProducts.length > 0) {
        getCart();
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [cartProducts, getCart]); // ✅ Incluir dependencias necesarias

  // ===================================
  // FUNCIONES AUXILIARES CON USEMEMO
  // ===================================

  const getCurrentStock = useCallback((product: CartProductsInfo) => {
    const variantKey = getVariantKey(product);
    const variantStock = variantStocks[variantKey];
    return variantStock?.stock ?? product.stock;
  }, [getVariantKey, variantStocks]); // ✅ Incluir dependencias necesarias

  const isVariantLoading = useCallback((product: CartProductsInfo) => {
    const variantKey = getVariantKey(product);
    return variantStocks[variantKey]?.isLoading || false;
  }, [getVariantKey, variantStocks]); // ✅ Incluir dependencias necesarias

  // Métricas del carrito optimizadas
  const cartMetrics = useMemo(() => {
    const totalItems = getCartProductCount();
    const subtotal = getSubTotal();
    const hasOutOfStockItems = cartProducts.some(product => getCurrentStock(product) === 0);
    const hasLimitedStockItems = cartProducts.some(product => {
      const stock = getCurrentStock(product);
      return stock < product.quantity && stock > 0;
    });

    return {
      totalItems,
      subtotal,
      hasOutOfStockItems,
      hasLimitedStockItems,
      uniqueProducts: cartProducts.length
    };
  }, [cartProducts, getCurrentStock, getCartProductCount, getSubTotal]); // ✅ Incluir todas las dependencias

  // ===================================
  // HANDLERS OPTIMIZADOS
  // ===================================

  const handleContinueShopping = useCallback(() => {
    router.back();
  }, [router]); // ✅ Incluir router como dependencia

  const handleProceedToCheckout = useCallback(() => {
    if (cartMetrics.hasOutOfStockItems) {
      // Opcional: mostrar modal de confirmación
      return;
    }
    router.push('/checkout');
  }, [router, cartMetrics.hasOutOfStockItems]); // ✅ Incluir dependencias necesarias

  const handleClearCart = useCallback(async () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar tu carrito?')) {
      await clearCart();
    }
  }, [clearCart]); // ✅ Incluir clearCart como dependencia

  const handleRefreshCart = useCallback(async () => {
    await getCart();
    await updateAllStocks();
  }, [getCart, updateAllStocks]); // ✅ Incluir dependencias necesarias

  // ===================================
  // VARIANTES DE ANIMACIÓN
  // ===================================

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  // ===================================
  // RENDERIZADO
  // ===================================

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando tu carrito...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header Optimizado */}
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
            {cartMetrics.uniqueProducts} {cartMetrics.uniqueProducts === 1 ? "producto" : "productos"}
            {cartMetrics.totalItems !== cartMetrics.uniqueProducts && (
              <span> • {cartMetrics.totalItems} unidades totales</span>
            )}
          </p>

          {/* Indicadores de Stock y Acciones */}
          <div className="mt-4 flex justify-center items-center gap-4">
            {(cartMetrics.hasOutOfStockItems || cartMetrics.hasLimitedStockItems) && (
              <motion.div
                className="flex gap-3 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {cartMetrics.hasOutOfStockItems && (
                  <span className="text-red-600 font-medium flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    Productos sin stock
                  </span>
                )}
                {cartMetrics.hasLimitedStockItems && (
                  <span className="text-yellow-600 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    Stock limitado
                  </span>
                )}
              </motion.div>
            )}

            {/* Botón Refresh */}
            <motion.button
              onClick={handleRefreshCart}
              disabled={isUpdatingStocks}
              className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-4 h-4 ${isUpdatingStocks ? 'animate-spin' : ''}`} />
              Actualizar
            </motion.button>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-700">{error}</span>
                <button
                  onClick={clearError}
                  className="text-red-400 hover:text-red-600"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Estado Vacío */}
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
              onClick={handleContinueShopping}
            >
              Continuar Comprando
            </Button>
          </motion.div>
        )}

        {/* Resumen del Carrito */}
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
                  Subtotal del carrito
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ${cartMetrics.subtotal.toLocaleString()}
                </div>
                {isUpdatingStocks && (
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Actualizando precios...
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-all duration-300"
                  onClick={handleContinueShopping}
                >
                  Seguir Comprando
                </Button>

                <Button
                  variant="outline"
                  className="border-red-200 text-red-700 hover:bg-red-50 px-6 py-3 rounded-lg font-medium transition-all duration-300"
                  onClick={handleClearCart}
                >
                  Vaciar Carrito
                </Button>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleProceedToCheckout}
                    disabled={cartMetrics.hasOutOfStockItems || isUpdatingStocks}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Proceder al Pago</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Información Adicional */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Envío gratis en compras superiores a $100.000</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Entrega en 2-3 días hábiles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Devoluciones gratis por 30 días</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Lista de Productos */}
        <AnimatePresence mode="wait">
          {cartProducts.length > 0 && (
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {cartProducts.map((product) => (
                <ProductItem
                  key={`${product.id}-${product.color_code}-${product.size}`}
                  product={product}
                  currentStock={getCurrentStock(product)}
                  isStockLoading={isVariantLoading(product)}
                  onRefreshStock={refreshSingleStock}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}