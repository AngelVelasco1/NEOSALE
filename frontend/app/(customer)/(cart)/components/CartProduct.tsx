"use client"
import React, { useCallback, useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  ShoppingBag,
  Trash2,
  RefreshCw,
  XCircle,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Package,
  Sparkles,
  Zap
} from "lucide-react"
import { useCart } from "../hooks/useCart"
import type { CartProductsInfo } from "../../types"
import { getProductVariantApi } from "../../(products)/services/api"
import CouponInput from "./CouponInput"
import type { AppliedCoupon } from "../types/coupon"

const COUPON_STORAGE_KEY = "neosale_applied_coupon"

interface VariantStock {
  stock: number
  isLoading: boolean
  lastUpdated: number
  error?: string
}

interface VariantStockMap {
  [key: string]: VariantStock
}

interface ProductItemProps {
  product: CartProductsInfo
  currentStock: number
  isStockLoading: boolean
  onRefreshStock: (product: CartProductsInfo) => Promise<void>
}

const ProductItem = React.memo<ProductItemProps>(({
  product,
  currentStock,
  isStockLoading,
}) => {
  const {
    updateQuantity,
    removeProductFromCart,
    incrementQuantity,
    decrementQuantity,
    getProductQuantity
  } = useCart()

  const productQuantity = getProductQuantity(product.id, product.color_code, product.size)
  const isOutOfStock = currentStock === 0
  const hasLimitedStock = currentStock < productQuantity && currentStock > 0
  const totalPrice = product.price * productQuantity

  const handleDecrease = useCallback(async () => {
    if (productQuantity > 1) {
      await decrementQuantity(product.id, product.color_code, product.size)
    }
  }, [productQuantity, decrementQuantity, product.id, product.color_code, product.size])

  const handleIncrease = useCallback(async () => {
    if (productQuantity < currentStock) {
      await incrementQuantity(product.id, product.color_code, product.size)
    }
  }, [productQuantity, currentStock, incrementQuantity, product.id, product.color_code, product.size])

  const handleQuantityChange = useCallback(async (newQuantity: number) => {
    if (newQuantity !== productQuantity && newQuantity <= currentStock && newQuantity > 0) {
      await updateQuantity(product.id, product.color_code, newQuantity, product.size)
    }
  }, [productQuantity, currentStock, updateQuantity, product.id, product.color_code, product.size])

  const handleRemove = useCallback(async () => {
    await removeProductFromCart(product.id, product.color_code, product.size)
  }, [removeProductFromCart, product.id, product.color_code, product.size])

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100 }
  }

  return (
    <motion.div
      variants={itemVariants}
      layout
      className={`group relative bg-linear-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl rounded-3xl p-6 border transition-all duration-500 shadow-2xl hover:shadow-indigo-500/10 ${isOutOfStock
        ? "border-red-500/40 shadow-red-500/20"
        : hasLimitedStock
          ? "border-amber-500/40 shadow-amber-500/20"
          : "border-slate-700/60 hover:border-indigo-400/60 hover:shadow-indigo-400/20"
        } overflow-hidden`}
    >
      {/* Subtle background pattern or glow */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex items-center gap-8">
        {/* Product Image */}
        <motion.div
          className={`relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-linear-to-br from-slate-800/70 to-slate-900/70 border border-slate-700/60 ${isOutOfStock ? "opacity-60 grayscale" : ""
            } shadow-lg`}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={product.image_url || "/placeholder.svg"}
            alt={product.name || product.title || "Producto"}
            fill
            className="object-fit"
            sizes="128px"
          />
          {isStockLoading && (
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center rounded-2xl">
              <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
            </div>
          )}
          {/* Overlay for out of stock */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold mb-3 truncate text-xl bg-linear-to-r ${isOutOfStock ? "from-slate-500 to-slate-600" : "from-slate-100 to-indigo-200"} bg-clip-text text-transparent`}>
            {product.name || product.title}
          </h3>

          <div className="flex items-center gap-4 mb-2">
            <span className="text-sm text-slate-300 bg-slate-800/70 px-4 py-2 rounded-xl flex items-center gap-2 border border-slate-700/50 shadow-sm">
              <Package className="w-4 h-4 text-indigo-400" />
              {product.size}
            </span>
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-full border-2 border-slate-600 shadow-md"
                style={{ backgroundColor: product.color_code }}
                title={product.color}
              />
              <span className="text-sm text-slate-300 font-medium">{product.color}</span>
            </div>
          </div>



          {/* Unit Price */}
          <div className={`text-xl font-bold ${isOutOfStock ? "text-slate-500" : "text-indigo-300"}`}>
            ${product.price.toLocaleString()}
          </div>
        </div>

        {/* Price & Quantity */}
        <div className="flex flex-col items-end gap-6">
          {/* Total Price */}
          <div className="text-right min-w-[140px]">
            <div className={`text-2xl font-extrabold bg-linear-to-r ${isOutOfStock ? "from-slate-600 to-slate-700" : "from-slate-100 to-purple-200"} bg-clip-text text-transparent`}>
              ${totalPrice.toLocaleString()}
            </div>
            {productQuantity > 1 && (
              <div className="text-sm text-slate-400 mt-2">
                {productQuantity} × ${product.price.toLocaleString()}
              </div>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-slate-800/50 rounded-2xl p-2 border border-slate-700/50 shadow-inner">
            <motion.button
              onClick={handleDecrease}
              disabled={productQuantity <= 1 || isOutOfStock || isStockLoading}
              className="w-8 h-8 rounded-xl bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-200 hover:bg-slate-600 hover:border-indigo-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold shadow-md"
              whileHover={{ scale: 1.1, backgroundColor: "#4f46e5" }}
              whileTap={{ scale: 0.95 }}
            >
              -
            </motion.button>

            <div className="w-12 text-center font-bold text-slate-100 text-md bg-slate-900/50 rounded-lg py-1">
              {productQuantity}
            </div>

            <motion.button
              onClick={handleIncrease}
              disabled={productQuantity >= currentStock || isOutOfStock || isStockLoading}
              className="w-8 h-8 rounded-xl bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-200 hover:bg-slate-600 hover:border-indigo-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold shadow-md"
              whileHover={{ scale: 1.1, backgroundColor: "#4f46e5" }}
              whileTap={{ scale: 0.95 }}
            >
              +
            </motion.button>
          </div>
        </div>

        {/* Delete Button */}
        <motion.button
          className="p-3 text-slate-200 bg-slate-500/20 hover:text-red-200 hover:bg-red-500/20 rounded-xl transition-all duration-200 shadow-md cursor-pointer"
          onClick={handleRemove}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          disabled={isStockLoading}
        >
          <Trash2 className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Warning Messages */}
      <AnimatePresence>
        {isOutOfStock && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="mt-6 p-4 bg-linear-to-r from-red-500/20 to-red-600/20 border border-red-500/50 rounded-2xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-red-300">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">Este producto ya no está disponible</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRemove}
                className="text-red-300 border-red-500/50 hover:bg-red-500/30 bg-transparent h-9 rounded-xl"
              >
                Eliminar
              </Button>
            </div>
          </motion.div>
        )}

        {hasLimitedStock && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="mt-6 p-4 bg-linear-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/50 rounded-2xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-amber-300">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">Solo quedan {currentStock} unidades</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuantityChange(currentStock)}
                className="text-amber-300 border-amber-500/50 hover:bg-amber-500/30 bg-transparent h-9 rounded-xl"
              >
                Ajustar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

ProductItem.displayName = 'ProductItem'

export default function CartProducts() {
  const router = useRouter()
  const {
    cartProducts,
    getSubTotal,
    getCartProductCount,
    clearCart,
    getCart,
    isLoading: cartLoading,
    error,
    clearError
  } = useCart()

  const [variantStocks, setVariantStocks] = useState<VariantStockMap>({})
  const [isUpdatingStocks, setIsUpdatingStocks] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(() => {
    if (typeof window === "undefined") return null
    try {
      const stored = localStorage.getItem(COUPON_STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const getVariantKey = useCallback((product: CartProductsInfo) => {
    return `${product.id}-${product.color_code}-${product.size}`
  }, [])

  const fetchVariantStock = useCallback(async (product: CartProductsInfo) => {
    const variantKey = getVariantKey(product)

    try {
      setVariantStocks(prev => ({
        ...prev,
        [variantKey]: {
          ...prev[variantKey],
          isLoading: true,
          error: undefined
        }
      }))

      const response = await getProductVariantApi({
        id: product.id,
        color_code: product.color_code,
        size: product.size
      })

      const currentStock = response.data?.stock || response.stock || 0

      setVariantStocks(prev => ({
        ...prev,
        [variantKey]: {
          stock: currentStock,
          isLoading: false,
          lastUpdated: Date.now()
        }
      }))

      return currentStock
    } catch (error) {
      console.error(`Error fetching stock for variant ${variantKey}:`, error)
      setVariantStocks(prev => ({
        ...prev,
        [variantKey]: {
          stock: 0,
          isLoading: false,
          lastUpdated: Date.now(),
          error: 'Error al cargar stock'
        }
      }))
      return 0
    }
  }, [getVariantKey])

  const updateAllStocks = useCallback(async () => {
    if (cartProducts.length === 0) return

    setIsUpdatingStocks(true)

    try {
      const stockPromises = cartProducts.map(product => fetchVariantStock(product))
      await Promise.allSettled(stockPromises)
    } finally {
      setIsUpdatingStocks(false)
    }
  }, [cartProducts, fetchVariantStock])

  const refreshSingleStock = useCallback(async (product: CartProductsInfo) => {
    await fetchVariantStock(product)
  }, [fetchVariantStock])

  // Definir funciones de manejo de cupón ANTES de los useEffects que las usan
  const handleCouponApplied = useCallback((coupon: AppliedCoupon) => {
    setAppliedCoupon(coupon)
    try {
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon))
    } catch (error) {
      console.error("Error saving coupon to localStorage:", error)
    }
  }, [])

  const handleCouponRemoved = useCallback(() => {
    setAppliedCoupon(null)
    try {
      localStorage.removeItem(COUPON_STORAGE_KEY)
    } catch (error) {
      console.error("Error removing coupon from localStorage:", error)
    }
  }, [])

  useEffect(() => {
    if (!cartLoading && cartProducts.length > 0) {
      updateAllStocks()
    }
  }, [cartLoading, cartProducts, updateAllStocks])

  // Validar cupón almacenado cuando cambie el subtotal
  useEffect(() => {
    const validateStoredCoupon = async () => {
      if (!appliedCoupon || cartProducts.length === 0) return

      const currentSubtotal = getSubTotal()
      const minPurchase = appliedCoupon.coupon.min_purchase_amount || 0

      // Si el subtotal no cumple el mínimo, remover el cupón automáticamente
      if (currentSubtotal < minPurchase) {
      
        handleCouponRemoved()
        return
      }

      // Recalcular el descuento basado en el subtotal actual
      const couponType = appliedCoupon.coupon.discount_type
      const discountValue = appliedCoupon.coupon.discount_value
      let newDiscountAmount = 0

      if (couponType === 'percentage') {
        newDiscountAmount = Math.round((currentSubtotal * discountValue) / 100)
      } else if (couponType === 'fixed') {
        newDiscountAmount = discountValue
      }

      // Limitar el descuento al subtotal
      newDiscountAmount = Math.min(newDiscountAmount, currentSubtotal)

      // Si el descuento cambió, actualizar
      if (newDiscountAmount !== appliedCoupon.discount_amount) {
        const updatedCoupon = {
          ...appliedCoupon,
          discount_amount: newDiscountAmount
        }
        setAppliedCoupon(updatedCoupon)
        try {
          localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(updatedCoupon))
        } catch (error) {
          console.error("Error updating coupon in localStorage:", error)
        }
      }
    }

    validateStoredCoupon()
  }, [appliedCoupon, cartProducts, getSubTotal, handleCouponRemoved])

  useEffect(() => {
    const interval = setInterval(() => {
      if (cartProducts.length > 0) {
        getCart()
      }
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [cartProducts, getCart])

  const getCurrentStock = useCallback((product: CartProductsInfo) => {
    const variantKey = getVariantKey(product)
    const variantStock = variantStocks[variantKey]
    return variantStock?.stock ?? product.stock
  }, [getVariantKey, variantStocks])

  const isVariantLoading = useCallback((product: CartProductsInfo) => {
    const variantKey = getVariantKey(product)
    return variantStocks[variantKey]?.isLoading || false
  }, [getVariantKey, variantStocks])

  const cartMetrics = useMemo(() => {
    const totalItems = getCartProductCount()
    const subtotal = getSubTotal()
    const discount = appliedCoupon?.discount_amount || 0
    const total = subtotal - discount
    const hasOutOfStockItems = cartProducts.some(product => getCurrentStock(product) === 0)
    const hasLimitedStockItems = cartProducts.some(product => {
      const stock = getCurrentStock(product)
      return stock < product.quantity && stock > 0
    })

    return {
      totalItems,
      subtotal,
      discount,
      total,
      hasOutOfStockItems,
      hasLimitedStockItems,
      uniqueProducts: cartProducts.length
    }
  }, [cartProducts, getCurrentStock, getCartProductCount, getSubTotal, appliedCoupon])

  const handleContinueShopping = useCallback(() => {
    router.back()
  }, [router])

  const handleProceedToCheckout = useCallback(() => {
    if (cartMetrics.hasOutOfStockItems) {
      return
    }
    router.push('/checkout')
  }, [router, cartMetrics.hasOutOfStockItems])

  const handleClearCart = useCallback(async () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar tu carrito?')) {
      await clearCart()
      setAppliedCoupon(null)
      try {
        localStorage.removeItem(COUPON_STORAGE_KEY)
      } catch (error) {
        console.error("Error removing coupon from localStorage:", error)
      }
    }
  }, [clearCart])

  const handleRefreshCart = useCallback(async () => {
    await getCart()
    await updateAllStocks()
  }, [getCart, updateAllStocks])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <RefreshCw className="w-12 h-12 animate-spin text-indigo-400 mx-auto mb-6" />
          <p className="text-slate-300 font-semibold text-lg">Cargando tu carrito...</p>
        </motion.div>
      </div>
    )
  }

  return (

    <motion.div
      className="min-h-screen bg-linear-to-br from-slate-900 via-slate-900 to-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}

    >
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">

              <h1 className="text-5xl font-extrabold bg-linear-to-r from-slate-100 via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                Mi Carrito
              </h1>
            </div>

            <motion.button
              onClick={handleRefreshCart}
              disabled={isUpdatingStocks}
              className="text-sm text-slate-300 hover:text-indigo-300 flex items-center gap-3 px-5 py-3 rounded-2xl border border-slate-700/60 hover:border-indigo-400/60 bg-slate-800/50 backdrop-blur-sm transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-indigo-500/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className={`w-5 h-5 ${isUpdatingStocks ? 'animate-spin' : ''}`} />
              Actualizar
            </motion.button>
          </div>



          {/* Status badges */}
          {(cartMetrics.hasOutOfStockItems || cartMetrics.hasLimitedStockItems) && (
            <div className="flex gap-4 mt-6">
              {cartMetrics.hasOutOfStockItems && (
                <span className="text-sm text-red-300 flex items-center gap-2 bg-red-500/20 px-4 py-2 rounded-xl border border-red-500/40 shadow-md">
                  <XCircle className="w-4 h-4" />
                  Productos sin stock
                </span>
              )}
              {cartMetrics.hasLimitedStockItems && (
                <span className="text-sm text-amber-300 flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-xl border border-amber-500/40 shadow-md">
                  <AlertTriangle className="w-4 h-4" />
                  Stock limitado
                </span>
              )}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-300 font-medium">{error}</span>
                <button onClick={clearError} className="text-red-300 hover:text-red-200 transition-colors">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Empty State */}
        {cartProducts.length === 0 && (
          <motion.div
            className="text-center py-24"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-28 h-28 mx-auto mb-8 bg-linear-to-br from-slate-800 to-slate-900 rounded-3xl flex items-center justify-center border border-slate-700/60 shadow-2xl">
              <ShoppingBag className="w-14 h-14 text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-200 mb-4">
              Tu carrito está vacío
            </h3>
            <p className="text-slate-500 mb-8 text-lg">
              Descubre nuestros productos y comienza a comprar
            </p>
            <Button
              className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-indigo-500/30"
              onClick={handleContinueShopping}
            >
              Continuar Comprando
            </Button>
          </motion.div>
        )}

        {/* Cart Summary */}
        {cartProducts.length > 0 && (
          <motion.div
            className="flex flex-col mb-10 bg-linear-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/60 shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left: Summary Details */}
              <div className="flex-1 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal ({cartMetrics.totalItems} items)</span>
                    <span className="font-semibold text-slate-200">${cartMetrics.subtotal.toLocaleString()}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-green-400">
                      <span>Descuento ({appliedCoupon.coupon.code})</span>
                      <span className="font-semibold">-${cartMetrics.discount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-800/60">
                    <div className="flex justify-between items-baseline">
                      <div className="text-sm text-slate-400 uppercase tracking-wide">Total</div>
                      <div className="text-3xl font-extrabold bg-linear-to-r from-slate-100 to-indigo-200 bg-clip-text text-transparent">
                        ${cartMetrics.total.toLocaleString()}
                      </div>
                    </div>
                    {appliedCoupon && (
                      <div className="text-right text-sm text-green-400 mt-1 font-medium">
                        ¡Ahorraste ${cartMetrics.discount.toLocaleString()}!
                      </div>
                    )}
                  </div>
                </div>

                {/* Coupon Input - Compact */}
                <div className="pt-6 border-t border-slate-800/60">
                  <CouponInput
                    subtotal={cartMetrics.subtotal}
                    onCouponApplied={handleCouponApplied}
                    onCouponRemoved={handleCouponRemoved}
                    appliedCoupon={appliedCoupon}
                  />
                </div>

                {isUpdatingStocks && (
                  <div className="text-sm text-slate-500 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Actualizando stocks...
                  </div>
                )}
              </div>

              {/* Right: Action Buttons */}
              <div className="flex flex-col gap-4 lg:min-w-[240px]">
                <Button
                  variant="outline"
                  className="border-slate-700/60 bg-slate-800/50 backdrop-blur-sm text-slate-300 hover:bg-slate-700 hover:border-slate-600 rounded-xl font-semibold shadow-lg hover:shadow-slate-700/30 p-5"
                  onClick={handleContinueShopping}
                >
                  Seguir Comprando
                </Button>

                <Button
                  variant="outline"
                  className="border-slate-700/60 bg-slate-800/50 backdrop-blur-sm text-slate-300 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300 rounded-xl font-semibold shadow-lg hover:shadow-red-500/20 p-5"
                  onClick={handleClearCart}
                >
                  Vaciar Carrito
                </Button>

                <Button
                  onClick={handleProceedToCheckout}
                  disabled={cartMetrics.hasOutOfStockItems || isUpdatingStocks}
                  className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg hover:shadow-indigo-500/30 p-5"
                >
                  Proceder al Pago
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Info badges */}
            <div className="mt-8 pt-8 border-t border-slate-800/60 flex flex-wrap gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Envío gratis +$100k
              </span>
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                Entrega 2-3 días
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Devolución 30 días
              </span>
            </div>
          </motion.div>
        )}

        {/* Products List */}
        <AnimatePresence mode="wait">
          {cartProducts.length > 0 && (
            <motion.div
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {cartProducts.map((product, index) => (
                <motion.div
                  key={`${product.id}-${product.color_code}-${product.size}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <ProductItem
                    product={product}
                    currentStock={getCurrentStock(product)}
                    isStockLoading={isVariantLoading(product)}
                    onRefreshStock={refreshSingleStock}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
