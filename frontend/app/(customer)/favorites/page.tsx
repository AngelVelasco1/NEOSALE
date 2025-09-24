"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaHeart, FaShoppingBag } from "react-icons/fa";
import { toast } from "sonner";
import { getUserFavoritesApi, type Favorite } from "./services/favoritesApi";
import { ProductCard } from "../(products)/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavorites } from "@/app/(customer)/favorites/context/useFavorites";

export default function Favorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  const userId = parseInt(session?.user?.id);
  const { refreshFavoritesCount } = useFavorites();

  const fetchFavorites = async () => {
    if (status === "loading") return;

    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      const favoritesData = await getUserFavoritesApi(userId);
      setFavorites(favoritesData);
      // ✅ Actualizar contador cuando se cargan los favoritos
      await refreshFavoritesCount();
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast.error("Error al cargar favoritos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [userId, status, favorites]); // ✅ Quitar 'favorites' de las dependencias para evitar loops



  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-12 w-64 mb-4" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-4"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaHeart className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Inicia Sesión
          </h2>
          <p className="text-slate-600 mb-6">
            Necesitas iniciar sesión para ver tus productos favoritos
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            Iniciar Sesión
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-pink-600 rounded-full flex items-center justify-center">
              <FaHeart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent">
                Mis Favoritos
              </h1>
              <p className="text-slate-600 text-lg">
                {favorites.length > 0
                  ? `${favorites.length} producto${
                      favorites.length !== 1 ? "s" : ""
                    } favorito${favorites.length !== 1 ? "s" : ""}`
                  : "No tienes productos favoritos aún"}
              </p>
            </div>
          </div>
        </motion.div>

        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mb-8">
              <FaHeart className="w-16 h-16 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-4">
              No tienes favoritos aún
            </h2>
            <p className="text-slate-500 text-center max-w-md mb-8">
              Explora nuestros productos y marca tus favoritos tocando el icono
              del corazón
            </p>
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FaShoppingBag className="w-5 h-5" />
                Explorar Productos
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {favorites
              .map((favorite, index) => {
                if (!favorite.products) {
                  console.warn("Favorite without product:", favorite);
                  return null;
                }

                return (
                  <motion.div
                    key={favorite.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard
                      data={{
                        id: favorite.products.id.toString(),
                        name: favorite.products.name,
                        price: Number(favorite.products.price),
                        stock: favorite.products.stock,
                        color: favorite.products.color,
                        color_code: favorite.products.color_code,
                        image_url: favorite.products.image_url,
                      }}
                      initialIsFavorite={true}
                      // ✅ Ya no necesitas onToggleFavorite - el ProductCard se encarga
                    />
                  </motion.div>
                );
              })
              .filter(Boolean)}
          </motion.div>
        )}

        {favorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16"
          >
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-blue-300 hover:shadow-lg transition-all duration-300"
              >
                Descubrir Más Productos
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
