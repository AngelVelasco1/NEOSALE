"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductCard } from "../../(products)/components/ProductCard";
import { getProductsByCategory, getProductsBySubcategory } from "../../(products)/services/api";
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

// Función para convertir slug de vuelta a nombre
const slugToName = (slug: string) => {
    return decodeURIComponent(slug)
        .replace(/-/g, " ")
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .trim();
};

export default function CategoriaPage() {
    const [products, setProducts] = useState<ProductData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState<string>("");
    const [isSubcategory, setIsSubcategory] = useState(false);
    const params = useParams();
    const router = useRouter();

    const slugs = params.slug as string[];

    useEffect(() => {
        const fetchProducts = async () => {
            if (!slugs || slugs.length === 0) return;

            try {
                setLoading(true);
                setError(null);

                let data: { id: number; name: string; price: number; stock: number; color: string; color_code: string; image_url?: string }[] = [];
                let searchName = "";

                if (slugs.length === 1) {
                    // Solo categoría: /categoria/accesorios-deportivos
                    searchName = slugToName(slugs[0]);
                    setDisplayName(searchName);
                    setIsSubcategory(false);

                    console.log("🔍 Frontend: Buscando categoría:", searchName);
                    data = await getProductsByCategory(searchName);
                } else if (slugs.length === 2) {
                    // Categoría + Subcategoría: /categoria/accesorios-deportivos/accesorios-fitness
                    searchName = slugToName(slugs[1]);
                    setDisplayName(searchName);
                    setIsSubcategory(true);

                    console.log("🎯 Frontend: Buscando subcategoría:", searchName);
                    data = await getProductsBySubcategory(searchName);
                }

                console.log("📦 Frontend: Productos recibidos:", data.length);

                // Convertir number id a string para compatibilidad con ProductCard
                const formattedData = data.map((product: { id: number; name: string; price: number; stock: number; color: string; color_code: string; image_url?: string }) => ({
                    ...product,
                    id: product.id.toString()
                }));

                setProducts(formattedData);
            } catch (err) {
                console.error("❌ Frontend: Error fetching products:", err);
                setError("Error al cargar los productos");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [slugs]);

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

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-3xl lg:text-4xl font-bold bg-clip-text text-transparent ${isSubcategory
                            ? "bg-gradient-to-r from-indigo-600 to-purple-700"
                            : "bg-gradient-to-r from-blue-600 to-indigo-700"
                            }`}
                    >
                        {displayName}
                    </motion.h1>
                </div>
            </div>

            {/* Breadcrumb */}
            {slugs && slugs.length > 1 && (
                <div className="mb-6">
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            <li className="inline-flex items-center">
                                <span className="text-gray-500 text-sm">
                                    {slugToName(slugs[0])}
                                </span>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <span className="text-gray-400 mx-2">/</span>
                                    <span className="text-gray-700 text-sm font-medium">{displayName}</span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                </div>
            )}

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
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        No hay productos en esta {isSubcategory ? 'subcategoría' : 'categoría'}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Explora otras {isSubcategory ? 'subcategorías' : 'categorías'} o vuelve más tarde
                    </p>
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