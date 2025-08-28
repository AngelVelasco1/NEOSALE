"use client";
import { Banner } from "../components/Banner";
import { ProductCard } from "./(products)/components/ProductCard";
import React, { useEffect, useState } from "react";
import { getLatestProducts } from "./(products)/services/api";
import { IProduct } from "./(products)/types";

import { useRouter } from "next/navigation";
import { Testimonials } from "../components/Testimonials";
import { BenefitsList } from "../components/BenefitsList";
import { ArrowRight, Sparkles } from "lucide-react";
import { Pricing } from "../components/Pricing";
import { motion } from "framer-motion";

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getLatestProducts();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <>
      <div className="mx-auto flex flex-col gap-y-16 ">
        <Banner />

        <h2 className="text-4xl lg:text-5xl text-center font-black leading-tight relative mb-6">
          <motion.span
            className="bg-gradient-to-r from-blue-950 via-blue-700 to-blue-950 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            style={{
              backgroundSize: "200% 200%",
            }}
          >
            Últimos Productos
          </motion.span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6 px-20">
          {products.map((product) => {
            return <ProductCard key={product.id} data={product} />;
          })}
        </div>

        <div className="flex justify-center items-center">
          <button
            onClick={() => router.push("/products")}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 
                     bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 
                     hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800
                     text-white font-semibold text-lg rounded-2xl
                     shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-600/40
                     transform transition-all duration-200 ease-in-out
                     hover:scale-105 hover:-translate-y-1
                     focus:outline-none 
                    overflow-hidden cursor-pointer"
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                          translate-x-[-100%] group-hover:translate-x-[100%] 
                          transition-transform duration-1000 ease-in-out"
            />

            <Sparkles className="h-6 w-6 text-white animate-pulse" />

            {/* Texto */}
            <span className="relative z-10 tracking-wide">
              Ver Todos los Productos
            </span>

            {/* Flecha animada */}
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        <div className="mt-16 mb-4">
          <BenefitsList />
        </div>

        <div className="mt-16 mb-4">
          <Pricing />
        </div>

        <div>
          <Testimonials />
        </div>
      </div>
    </>
  );
}
