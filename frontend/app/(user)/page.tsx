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
      <div className="mx-auto flex flex-col gap-y-16  ">
        <Banner />

        <h3 className="text-3xl text-center font-montserrat font-bold">
          Últimos Productos
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-16 px-24 py-2">
          {products.map((product) => {
            return <ProductCard key={product.id} data={product} />;
          })}
        </div>

        <div className="flex justify-center items-center px-4">
          <button
            onClick={() => router.push("/products")}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 
                     bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 
                     hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800
                     text-white font-semibold text-lg rounded-2xl
                     shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-600/40
                     transform transition-all duration-300 ease-out
                     hover:scale-105 hover:-translate-y-1
                     focus:outline-none focus:ring-4 focus:ring-blue-500/50
                     font-inter overflow-hidden cursor-pointer"
          >
            {/* Efecto de brillo animado */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                          translate-x-[-100%] group-hover:translate-x-[100%] 
                          transition-transform duration-1000 ease-in-out"
            />

            {/* Iconos decorativos */}
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
