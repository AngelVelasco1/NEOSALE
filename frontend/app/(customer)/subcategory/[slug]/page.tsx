"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductCard } from "../../(products)/components/ProductCard";
import { getProductsBySubcategory } from "../../(products)/services/api";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Interfaz local compatible con ProductCard
interface ProductData {
    id: string;
    name: string;
    price: number;
    stock: number;
    color: string;
    color_code: string;
    image_url?: string;
}

export default function SubcategoryPage() {
    const [products, setProducts] = useState<ProductData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const params = useParams();
    const router = useRouter();

    const subcategorySlug = params.slug as string;
    const subcategoryName = decodeURIComponent(subcategorySlug);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getProductsBySubcategory(subcategoryName);
                // Convertir number id a string para compatibilidad
                const formattedData = data.map((product: { id: number; name: string; price: number; stock: number; color: string; color_code: string; image_url?: string }) => ({
                    ...product,
                    id: product.id.toString()
                }));
                setProducts(formattedData);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Error al cargar los productos");
            } finally {
                setLoading(false);
            }
        };

        if (subcategoryName) {
            fetchProducts();
        }
    }, [subcategoryName]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="h-64 w-full rounded-lg" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver
                    </Button>
                </div>
                <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Error al cargar productos</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>Intentar de nuevo</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                </Button>

                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent"
                    >
                        {subcategoryName}
                    </motion.h1>
                </div>
            </div>

            {/* Products Count */}
            <div className="mb-6">
                <p className="text-gray-600">
                    {products.length === 0
                        ? "No se encontraron productos"
                        : `${products.length} producto${products.length === 1 ? '' : 's'} encontrado${products.length === 1 ? '' : 's'}`
                    }
                </p>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
                <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">No hay productos en esta subcategoría</h2>
                    <p className="text-gray-600 mb-6">Explora otras subcategorías o vuelve más tarde</p>
                    <Button onClick={() => router.push('/')}>Ver todos los productos</Button>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <ProductCard data={product} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}