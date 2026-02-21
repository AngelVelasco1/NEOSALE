"use client";
import { ProductCard } from "./(products)/components/ProductCard";
import React, { useEffect, useState } from "react";
import { getLatestProducts } from "./(products)/services/api";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// Dynamic imports para componentes pesados
const Banner = dynamic(() => import("../components/Banner").then(mod => ({ default: mod.Banner })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gradient-to-r from-slate-900 to-slate-800 animate-pulse" />
  ),
});

const Testimonials = dynamic(() => import("../components/Testimonials").then(mod => ({ default: mod.Testimonials })), {
  ssr: false,
});

const BenefitsList = dynamic(() => import("../components/BenefitsList").then(mod => ({ default: mod.BenefitsList })), {
  ssr: false,
});

const Pricing = dynamic(() => import("../components/Pricing").then(mod => ({ default: mod.Pricing })), {
  ssr: false,
});

export default function Home() {
  const [products, setProducts] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getLatestProducts();
        const safeProducts = Array.isArray(data) ? data : [];
        setProducts(safeProducts);
      } catch (error) {
        
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <div className="relative mx-auto flex flex-col from-slate-900  via-slate-900 to-slate-900  bg-linear-to-br">

        <Banner />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(71,85,105,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(71,85,105,0.12)_1px,transparent_1px)] bg-position-[80px_80px]" />

        {/* Latest Products Section */}
        <section className="relative py-20  overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-6">
                <div className="w-2 h-2 bg-linear-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-medium tracking-wider uppercase">
                  Productos Destacados
                </span>
                <div className="w-2 h-2 bg-linear-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse"></div>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-linear-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  Últimos Productos
                </span>
              </h2>
              <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
                Descubre nuestra colección más reciente de productos premium.
                Tecnología de vanguardia, diseño excepcional y calidad
                garantizada.
              </p>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-64 bg-slate-800/50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16">
                {products.map((product: any, index: number) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group"
                  >
                    <ProductCard data={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">No products available</p>
              </div>
            )}

            {/* CTA Button */}
            <div className="text-center">
              <motion.button
                onClick={() => router.push("/products")}
                className="group relative inline-flex items-center justify-center gap-4 px-10 py-5
                         bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600
                         hover:from-blue-700 hover:via-purple-600 hover:to-indigo-700
                         text-white font-bold text-xl rounded-2xl
                         shadow-2xl shadow-blue-500/25 hover:shadow-3xl hover:shadow-blue-600/40
                         transform transition-all duration-300 ease-out
                         hover:scale-105 hover:-translate-y-2
                         focus:outline-none focus:ring-4 focus:ring-blue-500/50
                         overflow-hidden cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12"></div>

                {/* Glow effect */}
                <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-slate-500 rounded-2xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>

                {/* Content */}
                <div className="relative z-10 flex items-center gap-4">


                  <span className="tracking-wide font-bold">
                    Ver Todos los Productos
                  </span>

                  <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </div>

                {/* Floating particles */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-linear-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
                <div
                  className="absolute -bottom-1 -left-1 w-2 h-2 bg-linear-to-r from-purple-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </motion.button>
            </div>
          </div>
        </section>

        <div className="">
          <BenefitsList />
        </div>

        <div className="">
          <Pricing />
        </div>

        <div>
          <Testimonials />
        </div>
      </div>
    </>
  );
}
