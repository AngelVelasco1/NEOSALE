"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductCard } from "../../(products)/components/ProductCard";
import {
  getProductsByCategory,
  getProductsBySubcategory,
} from "../../(products)/services/api";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  Grid3x3,
  AlertCircle,
  Sparkles,
} from "lucide-react";
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

const slugToName = (slug: string) => {
  return decodeURIComponent(slug)
    .replace(/-/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
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

        let data: {
          id: number;
          name: string;
          price: number;
          stock: number;
          color: string;
          color_code: string;
          image_url?: string;
        }[] = [];
        let searchName = "";

        if (slugs.length === 1) {
          // Solo categoría: /categoria/accesorios-deportivos
          searchName = slugToName(slugs[0]);
          setDisplayName(searchName);
          setIsSubcategory(false);

          data = await getProductsByCategory(searchName);
        } else if (slugs.length === 2) {
          // Categoría + Subcategoría: /categoria/accesorios-deportivos/accesorios-fitness
          searchName = slugToName(slugs[1]);
          setDisplayName(searchName);
          setIsSubcategory(true);

          data = await getProductsBySubcategory(searchName);
        }

        // Convertir number id a string para compatibilidad con ProductCard
        const formattedData = data.map(
          (product: {
            id: number;
            name: string;
            price: number;
            stock: number;
            color: string;
            color_code: string;
            image_url?: string;
          }) => ({
            ...product,
            id: product.id.toString(),
          })
        );

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-900 relative">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(71,85,105,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(71,85,105,0.08)_1px,transparent_1px)] bg-[size:80px_80px]" />

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Header Skeleton */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-11 w-28 rounded-xl" />
            </div>
            <Skeleton className="h-12 w-80 mb-4 rounded-lg" />
            <Skeleton className="h-6 w-48 rounded-lg" />
          </div>

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="space-y-4"
              >
                <Skeleton className="h-72 w-full rounded-2xl" />
                <Skeleton className="h-5 w-3/4 rounded-lg" />
                <Skeleton className="h-5 w-1/2 rounded-lg" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen  bg-gradient-to-br from-slate-900 via-slate-900 to-slate-900  relative">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(71,85,105,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(71,85,105,0.08)_1px,transparent_1px)] bg-[size:80px_80px]" />

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2 h-11 px-6 rounded-xl border-slate-200 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">Volver</span>
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white/80 backdrop-blur-sm border border-red-200 rounded-3xl shadow-xl p-12 text-center">
              <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                Error al cargar productos
              </h2>
              <p className="text-slate-600 text-lg mb-8">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Intentar de nuevo
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-900  relative">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(71,85,105,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(71,85,105,0.08)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2 h-11 px-6 rounded-xl border-slate-200 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all duration-300 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Volver</span>
          </Button>
        </motion.div>

        {/* Header Section */}
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/60 backdrop-blur-md rounded-3xl border border-slate-200/60 shadow-xl p-8"
          >
            {/* Category Icon and Title */}
            <div className="flex items-start gap-4 mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                  isSubcategory
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                    : "bg-gradient-to-br from-blue-500 to-indigo-600"
                }`}
              >
                <Grid3x3 className="w-8 h-8 text-white" />
              </motion.div>

              <div className="flex-1">
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`text-4xl lg:text-5xl font-bold bg-clip-text text-transparent mb-2 ${
                    isSubcategory
                      ? "bg-gradient-to-r from-indigo-600 to-purple-700"
                      : "bg-gradient-to-r from-blue-600 to-indigo-700"
                  }`}
                >
                  {displayName}
                </motion.h1>

                {/* Breadcrumb */}
                {slugs && slugs.length > 1 && (
                  <motion.nav
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex mb-4"
                    aria-label="Breadcrumb"
                  >
                    <ol className="inline-flex items-center space-x-2">
                      <li className="inline-flex items-center">
                        <span className="text-slate-500 text-sm font-medium">
                          {slugToName(slugs[0])}
                        </span>
                      </li>
                      <li>
                        <div className="flex items-center">
                          <span className="text-slate-400 mx-2">/</span>
                          <span className="text-slate-700 text-sm font-semibold">
                            {displayName}
                          </span>
                        </div>
                      </li>
                    </ol>
                  </motion.nav>
                )}

                {/* Products Count */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl">
                    <Package className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900">
                      {products.length === 0
                        ? "No se encontraron productos"
                        : `${products.length} producto${
                            products.length === 1 ? "" : "s"
                          } disponible${products.length === 1 ? "" : "s"}`}
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Products Grid or Empty State */}
        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-3xl shadow-xl p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
                className="w-24 h-24 bg-gradient-to-br from-slate-100 to-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <Package className="h-12 w-12 text-slate-400" />
              </motion.div>

              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                No hay productos disponibles
              </h2>
              <p className="text-slate-600 text-lg mb-8">
                No se encontraron productos en esta{" "}
                {isSubcategory ? "subcategoría" : "categoría"}. Explora otras
                opciones o vuelve más tarde.
              </p>

              <Button
                onClick={() => router.push("/")}
                className="h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Ver todos los productos
                </span>
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.3 + index * 0.05,
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
                whileHover={{ y: -5 }}
                className="transform-gpu"
              >
                <ProductCard data={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
