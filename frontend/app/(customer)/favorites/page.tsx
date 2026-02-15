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
  const userId = session?.user?.id ? parseInt(session.user.id) : null;
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
      <div className="min-h-screen  bg-linear-to-br from-slate-950 via-slate-900/50 to-slate-950 relative overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-linear-to-br from-red-500/15 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-linear-to-br from-purple-500/15 to-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        <div className="relative z-10 container mx-auto py-12">
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
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900/50 to-slate-950 relative overflow-hidden flex items-center justify-center">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-linear-to-br from-red-500/15 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-linear-to-br from-purple-500/15 to-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center p-8 bg-linear-to-br from-slate-900/80 via-slate-800/60 to-slate-900/40 rounded-3xl shadow-2xl backdrop-blur-xl max-w-md mx-4 border border-slate-700/50"
        >
          <div className="w-20 h-20 bg-linear-to-br from-red-500/30 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-400/30">
            <FaHeart className="w-10 h-10 text-red-300" />
          </div>
          <h2 className="text-2xl font-bold bg-linear-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent mb-4">
            Inicia Sesión
          </h2>
          <p className="text-slate-400 mb-6 leading-relaxed">
            Necesitas iniciar sesión para guardar y ver tus productos favoritos
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-3 bg-linear-to-r from-red-600/80 to-pink-600/70 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/25 border border-red-500/30"
          >
            Iniciar Sesión
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-26 bg-linear-to-br from-slate-950 via-slate-900/50 to-slate-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-linear-to-br from-red-500/15 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-linear-to-br from-purple-500/15 to-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-br from-fuchsia-500/10 to-purple-500/8 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-linear-to-br from-red-500/40 via-pink-500/30 to-rose-600/20 rounded-2xl flex items-center justify-center border border-red-400/40 shadow-lg shadow-red-500/20">
              <FaHeart className="w-7 h-7 text-red-300" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-linear-to-r from-slate-100 via-slate-200 to-slate-300 bg-clip-text text-transparent leading-tight">
                Mis Favoritos
              </h1>
              <p className="text-slate-400 text-lg mt-2">
                {favorites.length > 0
                  ? `${favorites.length} producto${favorites.length !== 1 ? "s" : ""} en tu colección`
                  : "Tu colección está vacía"}
              </p>
            </div>
          </div>
          
          {/* Decorative line */}
          <div className="h-1 w-32 bg-linear-to-r from-red-500/60 to-pink-500/40 rounded-full" />
        </motion.div>

        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <div className="w-40 h-40 bg-linear-to-br from-slate-800/60 to-slate-900/40 rounded-3xl flex items-center justify-center mb-8 border border-slate-700/40 backdrop-blur-sm">
              <FaHeart className="w-20 h-20 text-slate-500" />
            </div>
            <h2 className="text-3xl font-bold text-slate-200 mb-4">
              Aún no tienes favoritos
            </h2>
            <p className="text-slate-400 text-center max-w-md mb-10 leading-relaxed">
              Explora nuestro catálogo de moda y guarda tus productos favoritos para acceder a ellos rápidamente
            </p>
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-8 py-4 bg-linear-to-r from-red-600/80 to-pink-600/70 hover:from-red-600 hover:to-pink-600 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/30 border border-red-500/30"
              >
                <FaShoppingBag className="w-5 h-5" />
                Explorar Moda
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
            >
              {favorites
                .map((favorite, index) => {
                  if (!favorite.products) {
                    
                    return null;
                  }

                  return (
                    <motion.div
                      key={favorite.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                    >
                      <ProductCard
                        data={{
                          id: favorite.products.id.toString(),
                          name: favorite.products.name,
                          price: Number(favorite.products.price),
                          stock: favorite.products.stock,
                          color: favorite.products.color,
                          color_code: favorite.products.color_code,
                          image_url: favorite.products.image_url ?? undefined,
                        }}
                        initialIsFavorite={true}
                      />
                    </motion.div>
                  );
                })
                .filter(Boolean)}
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-12"
            >
              <div className="relative p-8 rounded-3xl bg-linear-to-br from-slate-900/80 via-slate-800/60 to-slate-900/40 border border-slate-700/50 backdrop-blur-xl">
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-red-500/5 via-pink-500/4 to-purple-500/3" />
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
                  <div>
                    <h3 className="text-2xl font-bold bg-linear-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent mb-2">
                      Continúa explorando
                    </h3>
                    <p className="text-slate-400">
                      Descubre más productos
                    </p>
                  </div>
                  <Link href="/products" className="flex-shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-linear-to-r from-purple-600/80 to-indigo-600/70 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/30 border border-purple-500/30 whitespace-nowrap"
                    >
                      Más Productos
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
