"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getOffers } from "../(products)/services/api";
import { ProductCard } from "../(products)/components/ProductCard";
import { Clock, Flame, Zap, Sparkles, TrendingDown, Timer } from "lucide-react";

interface IOfferProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  sizes: string;
  base_discount: number;
  offer_discount: number;
  offer_end_date: Date;
  image_url: string;
  color_code: string;
  color: string;
  category: string;
  subcategories: string[];
  images: Array<{
    id: number;
    image_url: string;
    color_code: string;
    color: string;
  }>;
}

// Componente de número animado para el cronómetro
const AnimatedNumber = ({ value }: { value: number }) => {
  const formattedValue = String(value).padStart(2, '0');
  
  return (
    <div className="relative inline-block w-[16px] h-[16px] overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: -20, opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: 20, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 flex items-center justify-center font-mono font-bold text-[12px]"
        >
          {formattedValue}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

// Componente de timer en tiempo real
const CountdownTimer = ({ endDate }: { endDate: Date }) => {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeRemaining(null);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  if (!timeRemaining) return null;

  return (
    <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2 py-2 rounded-xl border border-white/10 shadow-xl">
      <Timer className="w-4 h-4 text-orange-400" />
      <div className="flex items-center gap-1 text-sm font-semibold tabular-nums">
        {timeRemaining.days > 0 && (
          <div className="flex items-center gap-0.5">
            <div className="bg-linear-to-br from-orange-500 to-red-500 text-white px-1.5 py-0.5 rounded-md shadow-lg shadow-orange-500/30 flex items-center justify-center min-w-[20px]">
              <AnimatedNumber value={timeRemaining.days} />
            </div>
            <span className="text-slate-400 text-[10px]">d</span>
          </div>
        )}
        <div className="bg-linear-to-br from-orange-500 to-red-500 text-white px-1.5 py-0.5 rounded-md shadow-lg shadow-orange-500/30 flex items-center justify-center min-w-[20px]">
          <AnimatedNumber value={timeRemaining.hours} />
        </div>
        <span className="text-slate-400 text-[10px]">:</span>
        <div className="bg-linear-to-br from-orange-500 to-red-500 text-white px-1.5 py-0.5 rounded-md shadow-lg shadow-orange-500/30 flex items-center justify-center min-w-[20px]">
          <AnimatedNumber value={timeRemaining.minutes} />
        </div>
        <span className="text-slate-400 text-[10px]">:</span>
        <div className="bg-linear-to-br from-orange-500 to-red-500 text-white px-1.5 py-0.5 rounded-md shadow-lg shadow-orange-500/30 flex items-center justify-center min-w-[20px]">
          <AnimatedNumber value={timeRemaining.seconds} />
        </div>
      </div>
    </div>
  );
};

const OffersPage = () => {
  const [offers, setOffers] = useState<IOfferProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "high" | "medium">("all");

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const data = await getOffers();
        setOffers(data);
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const filteredOffers = offers.filter((offer) => {
    if (filter === "all") return true;
    if (filter === "high") return (offer.offer_discount || 0) >= 30;
    if (filter === "medium")
      return (offer.offer_discount || 0) >= 15 && (offer.offer_discount || 0) < 30;
    return true;
  });

  const maxDiscount = Math.max(...offers.map((o) => o.offer_discount || 0));

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-linear-to-br from-orange-500/10 via-red-500/10 to-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-linear-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
         
          <h1 className="text-6xl md:text-7xl font-black mb-4 bg-linear-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
            MEGA OFERTAS
          </h1>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-6">
            Aprovecha descuentos increíbles hasta del{" "}
            <span className="text-orange-400 font-bold text-2xl">
              {maxDiscount}%
            </span>{" "}
            en productos seleccionados
          </p>

          <div className="flex items-center justify-center gap-2 text-slate-400">
            <Clock className="w-5 h-5" />
            <span className="text-sm">Ofertas por tiempo limitado</span>
          </div>
        </motion.div>

        {/* Filter Chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              filter === "all"
                ? "bg-linear-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/50"
                : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700"
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-2" />
            Todas las Ofertas
          </button>
          <button
            onClick={() => setFilter("high")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              filter === "high"
                ? "bg-linear-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/50"
                : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700"
            }`}
          >
            <Flame className="w-4 h-4 inline mr-2" />
            +30% OFF
          </button>
          <button
            onClick={() => setFilter("medium")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              filter === "medium"
                ? "bg-linear-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/50"
                : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700"
            }`}
          >
            <TrendingDown className="w-4 h-4 inline mr-2" />
            15-30% OFF
          </button>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-96 bg-slate-800/50 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
            >
              <p className="text-lg text-slate-400">
                {filteredOffers.length}{" "}
                {filteredOffers.length === 1
                  ? "producto en oferta"
                  : "productos en oferta"}
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={filter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredOffers.map((offer, index) => (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative group"
                  >
                    {/* Glow effect on hover */}
                    <div className="absolute -inset-1 bg-linear-to-r from-orange-600/0 via-red-600/0 to-orange-600/0 group-hover:from-orange-600/20 group-hover:via-red-600/20 group-hover:to-orange-600/20 rounded-2xl blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
                    
                    {/* Discount Badge - Top Left */}
                    <div className="absolute -top-2 -left-2 z-20">
                      <motion.div
                        className="relative"
                        animate={{ 
                          rotate: [0, -3, 3, 0],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        {/* Badge container with glassmorphism */}
                        <div className="relative overflow-hidden rounded-xl">
                          {/* Animated gradient background */}
                          <div className="absolute inset-0 bg-linear-to-br from-orange-900 via-red-900 to-orange-950 opacity-95" />
                          <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 via-transparent to-red-500/20" />
                          
                          {/* Content */}
                          <div className="relative px-2 py-1.5 flex items-center gap-1.5">
                            <div className="flex items-center justify-center w-5 h-5 ">
                              <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            </div>
                            <span className="font-black text-base tracking-tight text-white drop-shadow-lg">
                              -{offer.offer_discount}%
                            </span>
                          </div>
                          
                          {/* Border overlay */}
                          <div className="absolute inset-0 rounded-xl border border-orange-700/50 shadow-2xl shadow-orange-900/50" />
                          
                          {/* Shine effect */}
                          <motion.div
                            className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent"
                            animate={{
                              x: ['-100%', '200%'],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              repeatDelay: 2,
                              ease: "easeInOut"
                            }}
                          />
                        </div>
                        
                      </motion.div>
                    </div>

                    {/* Timer Badge - Top Center */}
                    <div className="absolute -top-[-5px] left-1/2 -translate-x-1/2 z-20 transform group-hover:scale-105 transition-transform duration-300">
                      <CountdownTimer endDate={offer.offer_end_date} />
                    </div>

                    <ProductCard
                      data={{
                        id: offer.id.toString(),
                        name: offer.name,
                        price: offer.price,
                        stock: offer.stock,
                        color: offer.color,
                        color_code: offer.color_code,
                        image_url: offer.image_url,
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Empty State */}
            {filteredOffers.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800/50 mb-6">
                  <Flame className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-400 mb-2">
                  No hay ofertas disponibles
                </h3>
                <p className="text-slate-500">
                  Intenta con otro filtro o vuelve más tarde
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OffersPage;
