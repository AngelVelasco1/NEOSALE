"use client";

import {
  addFavoriteApi,
  removeFavoriteApi,
  checkIfFavoriteApi,
} from "../../favorites/services/favoritesApi";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import type React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FaHeart } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useFavorites } from "../../favorites/context/useFavorites"; // ✅ Importar el hook

export interface IProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  color: string;
  color_code: string;
  image_url?: string;
}

export interface ProductCardProps {
  data: IProduct;
  initialIsFavorite?: boolean;
}

export const ProductCard = ({
  data,
  initialIsFavorite = false,
}: ProductCardProps) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCheckedFavorite, setHasCheckedFavorite] = useState(false);
  const { data: session } = useSession();
  const { refreshFavoritesCount } = useFavorites(); // ✅ Usar el hook
  const userId = parseInt(session?.user?.id) || null;

  // Verificar favorito solo una vez cuando el usuario está logueado
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!userId || hasCheckedFavorite) return;

      try {
        const favorite = await checkIfFavoriteApi(userId, parseInt(data.id));
        setIsFavorite(favorite);
      } catch (error) {
        console.error("Error checking favorite:", error);
      } finally {
        setHasCheckedFavorite(true);
      }
    };

    checkFavoriteStatus();
  }, [userId, data.id, hasCheckedFavorite]);

  // Actualizar el estado si cambia la prop inicial
  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  const handleAddToFavorites = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      toast.error("Debes iniciar sesión para añadir favoritos");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      if (!isFavorite) {
        // Añadir a favoritos
        await addFavoriteApi({ userId, productId: Number.parseInt(data.id) });
        setIsFavorite(true);
      } else {
        // Remover de favoritos
        await removeFavoriteApi({
          userId,
          productId: Number.parseInt(data.id),
        });
        setIsFavorite(false);
      }

      // ✅ Actualizar el contador del navbar después de cualquier cambio
      await refreshFavoritesCount();
    } catch (error: any) {
      console.error("Error al manejar favoritos:", error);

      if (error.response?.status === 409) {
        if (!isFavorite) {
          toast.error("El producto ya está en favoritos");
          setIsFavorite(true);
        }
      } else if (error.response?.status === 404) {
        if (isFavorite) {
          toast.error("El producto no está en favoritos");
          setIsFavorite(false);
        }
      } else {
        toast.error(
          isFavorite
            ? "Error al remover de favoritos"
            : "Error al añadir a favoritos"
        );
        // Revertir el estado en caso de error
        setIsFavorite(!isFavorite);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link href={`/${data.id}`}>
      <motion.div
        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 backdrop-blur-sm border-2 border-slate-300/50 shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 hover:from-indigo-200/60 hover:via-slate-200/80 hover:to-purple-200"
        whileHover={{
          y: -8,
          transition: { type: "spring", stiffness: 400, damping: 25 },
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        {/* Header section with stock badge and favorites button */}
        <div className="relative p-4 pb-0">
          <div className="flex justify-between items-start mb-4">
            {/* Stock badge moved to top left */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
            >
              <div
                className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border-2 shadow-xl ${
                  data.stock > 0
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-300"
                    : "bg-gradient-to-r from-red-500 to-pink-600 text-white border-red-300"
                }`}
              >
                {data.stock > 0 ? "Disponible" : "Agotado"}
              </div>
            </motion.div>

            {/* Improved Favorite Button */}
            <motion.button
              onClick={handleAddToFavorites}
              className="relative z-10 group/fav"
              initial={{ scale: 0.8, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              disabled={isLoading}
            >
              {/* Glow effect background */}
              <motion.div
                className={`absolute inset-0 rounded-full blur-md transition-all duration-500 ${
                  isFavorite
                    ? "bg-gradient-to-r from-red-400 to-pink-500 opacity-60"
                    : "bg-gradient-to-r from-slate-400 to-slate-500 opacity-0 group-hover/fav:opacity-40"
                }`}
                animate={{
                  scale: isFavorite || initialIsFavorite ? [1, 1.3, 1] : 1,
                }}
                transition={{
                  duration: 0.6,
                  repeat: isFavorite ? 2 : 0,
                }}
              />

              <motion.div
                className={`relative w-11 h-11 rounded-full backdrop-blur-xl border-2 flex items-center justify-center shadow-lg transition-all duration-500 ${
                  isFavorite || initialIsFavorite
                    ? "bg-gradient-to-br from-red-600 via-pink-600 to-red-800 border-red-300 "
                    : "bg-white/90 border-slate-300 shadow-slate-200 hover:border-red-300 "
                }`}
                transition={{
                  duration: 1.5,
                  repeat: isFavorite || initialIsFavorite ? Infinity : 0,
                }}
              >
                <motion.div
                  animate={{
                    scale: isLoading ? [1, 1.2, 1] : 1,
                    rotate: isFavorite ? [0, -10, 10, -5, 5, 0] : 0,
                  }}
                  transition={{
                    duration: isLoading ? 0.8 : isFavorite ? 0.8 : 0.3,
                    repeat: isLoading ? Infinity : isFavorite ? 1 : 0,
                    ease: "easeInOut",
                  }}
                >
                  <FaHeart
                    className={`w-6 h-6 transition-all duration-300 ${
                      isFavorite
                        ? "text-white fill-current"
                        : "text-slate-600 fill-none stroke-current stroke-2"
                    }`}
                  />
                </motion.div>

                {isFavorite && (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                          x: [0, (Math.random() - 0.5) * 40],
                          y: [0, (Math.random() - 0.5) * 40],
                        }}
                        transition={{
                          duration: 1,
                          delay: i * 0.1,
                          ease: "easeOut",
                        }}
                      />
                    ))}
                  </>
                )}
              </motion.div>

              {/* Pulse ring effect */}
              <motion.div
                className={`absolute inset-0 rounded-full border-2 ${
                  isFavorite ? "border-red-400" : "border-slate-300"
                }`}
                animate={{
                  scale: isFavorite ? [1, 1.4, 1.8] : 1,
                  opacity: isFavorite ? [0.8, 0.4, 0] : 0,
                }}
                transition={{
                  duration: 1.2,
                  repeat: isFavorite ? 2 : 0,
                  ease: "easeOut",
                }}
              />
            </motion.button>
          </div>

          {/* Product image */}
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 transition-colors duration-300 shadow-inner">
            {data.image_url ? (
              <Image
                src={data.image_url || "/placeholder.svg"}
                alt="product"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-fit object-center group-hover:scale-110 transition-transform duration-700"
                priority
              />
            ) : (
              <Skeleton className="w-full h-full rounded-xl bg-gradient-to-br from-slate-100 to-slate-200" />
            )}
          </div>
        </div>

        {/* Product information */}
        <div className="p-4 pt-4 space-y-4">
          {/* Product name */}
          <motion.h3
            className="text-lg font-bold text-slate-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-700 group-hover:via-purple-700 group-hover:to-indigo-700 group-hover:bg-clip-text transition-all duration-300 line-clamp-2 leading-relaxed"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {data.name}
          </motion.h3>

          {/* Price and details */}
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <motion.p
                className="text-2xl font-black bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                ${data.price.toLocaleString()}
              </motion.p>
              <p className="text-sm text-slate-600 font-medium">
                {data.stock > 0 ? `${data.stock} en stock` : "Sin stock"}
              </p>
            </div>

            {/* Color indicator */}
            <div className="flex flex-col items-end space-y-2">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div
                  className="w-8 h-8 rounded-full border-3 border-white shadow-xl ring-2 ring-blue-200 group-hover:ring-blue-300 transition-all duration-300"
                  style={{ backgroundColor: data.color_code }}
                  title={data.color}
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
              </motion.div>
              <span className="text-xs text-slate-500 capitalize font-medium">
                {data.color}
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl" />

        {/* Enhanced shine effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />

        {/* Strong border glow on hover */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-300/80 transition-colors duration-500" />
        <div className="absolute -inset-1 rounded-3xl border-2 border-blue-400/0 group-hover:border-blue-400/50 transition-colors duration-500 blur-sm" />
      </motion.div>
    </Link>
  );
};
