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
import { useFavorites } from "../../favorites/context/useFavorites";

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
  const { refreshFavoritesCount } = useFavorites();
  const userId = parseInt(session?.user?.id) || null;

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
        await addFavoriteApi({ userId, productId: Number.parseInt(data.id) });
        setIsFavorite(true);
      } else {
        await removeFavoriteApi({
          userId,
          productId: Number.parseInt(data.id),
        });
        setIsFavorite(false);
      }

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
        setIsFavorite(!isFavorite);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link href={`/${data.id}`}>
      <motion.div
        className="group relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl hover:shadow-3xl hover:shadow-blue-500/20 transition-all duration-500 hover:bg-white/10 hover:border-white/20"
        whileHover={{
          y: -12,
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
        <div className="relative p-4 pb-0">
          <div className="flex justify-between items-start mb-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
            >
              <div
                className={`px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md border shadow-xl ${data.stock > 0
                  ? "bg-linear-to-r from-emerald-400 to-green-500 text-white border-emerald-300/50"
                  : "bg-linear-to-r from-red-400 to-pink-500 text-white border-red-300/50"
                  }`}
              >
                {data.stock > 0 ? "Disponible" : "Agotado"}
              </div>
            </motion.div>

            <motion.button
              onClick={handleAddToFavorites}
              className="relative z-10 group/fav"
              initial={{ scale: 0.8, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              disabled={isLoading}
            >
              <motion.div
                className={`absolute inset-0 rounded-full blur-md transition-all duration-500 ${isFavorite
                  ? "bg-linear-to-r from-red-400 to-pink-500 opacity-60"
                  : "bg-linear-to-r from-blue-400 to-purple-500 opacity-0 group-hover/fav:opacity-40"
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
                className={`relative w-12 h-12 rounded-full backdrop-blur-xl border-2 flex items-center justify-center shadow-lg transition-all duration-500 ${isFavorite || initialIsFavorite
                  ? "bg-linear-to-br from-red-500 via-pink-500 to-red-700 border-red-300/50 "
                  : "bg-white/10 border-white/30 shadow-white/20 hover:border-red-300/50 "
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
                    className={`w-6 h-6 transition-all duration-300 ${isFavorite
                      ? "text-white "
                      : "text-white fill-none stroke-2 stroke-white"
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

              <motion.div
                className={`absolute inset-0 rounded-full border-2 ${isFavorite ? "border-red-400" : "border-slate-300"
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

          <div className="relative aspect-square overflow-hidden rounded-2xl bg-linear-to-br from-white/10 to-slate-50/20 border border-white/20 transition-all duration-500 shadow-inner group-hover:shadow-2xl group-hover:shadow-blue-500/20">
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
              <Skeleton className="w-full h-full rounded-2xl bg-linear-to-br from-white/10 to-slate-50/30" />
            )}

            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
          </div>
        </div>

        <div className="p-4 pt-4 space-y-4">
          {/* Product name */}
          <motion.h3
            className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-blue-300 group-hover:via-purple-300 group-hover:to-cyan-300 group-hover:bg-clip-text transition-all duration-300 line-clamp-2 leading-relaxed"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {data.name}
          </motion.h3>

          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <motion.p
                className="text-3xl font-black bg-linear-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                ${data.price.toLocaleString()}
              </motion.p>
              <p className="text-sm text-gray-300 font-medium">
                {data.stock > 0 ? `${data.stock} en stock` : "Sin stock"}
              </p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div
                  className="w-10 h-10 rounded-full border-2 border-white/30 shadow-xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300"
                  style={{ backgroundColor: data.color_code }}
                  title={data.color}
                />
                <div className="absolute inset-0 rounded-full bg-linear-to-br from-white/20 to-transparent" />
              </motion.div>
              <span className="text-xs text-gray-300 capitalize font-medium">
                {data.color}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-2 bg-linear-to-r from-blue-400 via-purple-400 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-3xl" />

        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-12" />

        <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-white/30 transition-colors duration-500" />
        <div className="absolute -inset-1 rounded-3xl border-2 border-blue-400/0 group-hover:border-blue-400/30 transition-colors duration-500 blur-sm" />
      </motion.div>
    </Link>
  );
};

