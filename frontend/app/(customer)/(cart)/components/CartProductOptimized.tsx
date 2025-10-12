'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    Minus,
    Plus,
    Trash2,
    ShoppingCart,
    ArrowLeft,
    RefreshCw,
    AlertTriangle,
    Package
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '../hooks/useCart';

// ===================================
// TYPES
// ===================================
interface CartProductsInfo {
    id: number;
    name: string;
    price: number;
    quantity: number;
    stock: number;
    color_code: string;
    size: string;
    image_url?: string;
}

// ===================================
// COMPONENTE PRINCIPAL OPTIMIZADO
// ===================================

interface CartProductOptimizedProps {
    cartProducts: CartProductsInfo[];
    cartLoading: boolean;
}

export default function CartProductOptimized({
    cartProducts,
    cartLoading
}: CartProductOptimizedProps) {
    const router = useRouter();
    const {
        // State de Cart Context
        getCartProductCount,
        getSubTotal,
        // Actions de Cart Context  
        incrementQuantity,
        decrementQuantity,
        removeProductFromCart,
        clearCart,
        getProductQuantity
    } = useCart();

    // ===================================
    // COMPONENT STATE OPTIMIZADO
    // ===================================
    const [isClearing, setIsClearing] = useState(false);

    // ===================================
    // HANDLERS SIMPLIFICADOS (sin dependencias problemáticas)
    // ===================================

    const handleContinueShopping = useCallback(() => {
        router.back();
    }, []);

    const handleClearCart = useCallback(async () => {
        if (window.confirm('¿Estás seguro de que quieres vaciar tu carrito?')) {
            setIsClearing(true);
            try {
                await clearCart();
            } finally {
                setIsClearing(false);
            }
        }
    }, []);

    const handleProceedToCheckout = useCallback(() => {
        router.push('/checkout');
    }, []);

    // ===================================
    // MÉTRICAS SIMPLIFICADAS
    // ===================================

    const cartMetrics = useMemo(() => ({
        totalItems: getCartProductCount(),
        subtotal: getSubTotal(),
        uniqueProducts: cartProducts.length,
        hasProducts: cartProducts.length > 0
    }), [cartProducts.length]);

    // ===================================
    // COMPONENTE PRODUCTO INDIVIDUAL
    // ===================================

    const ProductItem = React.memo(({ product }: { product: CartProductsInfo }) => {
        const [isUpdating, setIsUpdating] = useState(false);
        const productQuantity = getProductQuantity(product.id, product.color_code, product.size);
        const totalPrice = product.price * productQuantity;
        const isOutOfStock = product.stock === 0;
        const hasLimitedStock = product.stock < productQuantity && product.stock > 0;

        const handleDecrease = useCallback(async () => {
            if (productQuantity > 1 && !isUpdating) {
                setIsUpdating(true);
                try {
                    await decrementQuantity(product.id, product.color_code, product.size);
                } finally {
                    setIsUpdating(false);
                }
            }
        }, [productQuantity, isUpdating]);

        const handleIncrease = useCallback(async () => {
            if (productQuantity < product.stock && !isUpdating) {
                setIsUpdating(true);
                try {
                    await incrementQuantity(product.id, product.color_code, product.size);
                } finally {
                    setIsUpdating(false);
                }
            }
        }, [productQuantity, product.stock, isUpdating]);

        const handleRemove = useCallback(async () => {
            if (!isUpdating) {
                setIsUpdating(true);
                try {
                    await removeProductFromCart(product.id, product.color_code, product.size);
                } finally {
                    setIsUpdating(false);
                }
            }
        }, [isUpdating]);

        return (
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full"
            >
                <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Imagen del producto */}
                            <div className="relative w-full md:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="w-8 h-8 text-gray-400" />
                                    </div>
                                )}

                                {/* Badges de estado */}
                                {isOutOfStock && (
                                    <Badge variant="destructive" className="absolute top-2 left-2 text-xs">
                                        Sin Stock
                                    </Badge>
                                )}
                                {hasLimitedStock && (
                                    <Badge variant="outline" className="absolute top-2 left-2 text-xs border-orange-500 text-orange-700">
                                        Stock Limitado
                                    </Badge>
                                )}
                            </div>

                            {/* Información del producto */}
                            <div className="flex-1 space-y-2">
                                <div>
                                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Color: {product.color_code} | Talla: {product.size}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Stock disponible: {product.stock}
                                    </p>
                                </div>

                                {/* Precios */}
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-blue-600">
                                        ${product.price.toLocaleString()}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        x {productQuantity} = ${totalPrice.toLocaleString()}
                                    </span>
                                </div>

                                {/* Alertas de stock */}
                                {isOutOfStock && (
                                    <div className="flex items-center gap-2 p-2 bg-red-50 rounded-md">
                                        <AlertTriangle className="w-4 h-4 text-red-500" />
                                        <span className="text-sm text-red-700">
                                            Producto sin stock
                                        </span>
                                    </div>
                                )}

                                {hasLimitedStock && (
                                    <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-md">
                                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                                        <span className="text-sm text-orange-700">
                                            Solo quedan {product.stock} unidades disponibles
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Controles de cantidad */}
                            <div className="flex flex-col md:flex-row md:items-center gap-3">
                                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleDecrease}
                                        disabled={productQuantity <= 1 || isUpdating || isOutOfStock}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>

                                    <span className="w-12 text-center font-medium">
                                        {isUpdating ? '...' : productQuantity}
                                    </span>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleIncrease}
                                        disabled={productQuantity >= product.stock || isUpdating || isOutOfStock}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRemove}
                                    disabled={isUpdating}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        );
    });

    ProductItem.displayName = 'ProductItem';

    // ===================================
    // RENDERIZADO PRINCIPAL
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

    if (!cartMetrics.hasProducts) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md mx-auto"
                >
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingCart className="w-12 h-12 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Tu carrito está vacío
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Agrega algunos productos increíbles a tu carrito
                    </p>
                    <Button onClick={handleContinueShopping} className="w-full">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Continuar Comprando
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Carrito de Compras
                    </h1>
                    <p className="text-gray-600">
                        {cartMetrics.totalItems} {cartMetrics.totalItems === 1 ? 'producto' : 'productos'} en tu carrito
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Lista de productos */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-4"
                        >
                            {cartProducts.map((product) => (
                                <ProductItem
                                    key={`${product.id}-${product.color_code}-${product.size}`}
                                    product={product}
                                />
                            ))}
                        </motion.div>
                    </div>

                    {/* Resumen del carrito */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="sticky top-8"
                        >
                            <Card className="border border-gray-200 shadow-lg">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                                        Resumen del Pedido
                                    </h3>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Productos ({cartMetrics.totalItems})</span>
                                            <span className="font-semibold">${cartMetrics.subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="border-t pt-4">
                                            <div className="flex justify-between items-center text-lg font-bold">
                                                <span>Total</span>
                                                <span className="text-blue-600">${cartMetrics.subtotal.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Button
                                            onClick={handleProceedToCheckout}
                                            className="w-full"
                                            size="lg"
                                        >
                                            Proceder al Checkout
                                        </Button>

                                        <Button
                                            variant="outline"
                                            onClick={handleContinueShopping}
                                            className="w-full"
                                        >
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Continuar Comprando
                                        </Button>

                                        <Button
                                            variant="outline"
                                            onClick={handleClearCart}
                                            disabled={isClearing}
                                            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            {isClearing ? (
                                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4 mr-2" />
                                            )}
                                            {isClearing ? 'Vaciando...' : 'Vaciar Carrito'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}