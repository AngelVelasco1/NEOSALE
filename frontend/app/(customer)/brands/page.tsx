import { Metadata } from "next";
import { getAllBrands } from "./services";
import Link from "next/link";
import Image from "next/image";
import { Package2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Marcas | NeoSale",
  description: "Explora nuestras marcas favoritas y descubre productos de alta calidad",
};

// Prevent prerendering of this page during build
export async function generateStaticParams() {
  return [];
}

export default async function BrandsPage() {
  const brands = await getAllBrands();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="border-b border-slate-800/50 bg-linear-to-b from-slate-900/90 to-transparent backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 mb-6">
                <Package2 className="w-10 h-10 text-purple-400" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-linear-to-r from-purple-300 via-fuchsia-300 to-blue-300 bg-clip-text text-transparent">
                Nuestras Marcas
              </h1>
              
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Descubre las mejores marcas y encuentra productos de calidad excepcional
              </p>

              <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                <span className="font-semibold text-purple-400">{brands.length}</span>
                <span>marcas disponibles</span>
              </div>
            </div>
          </div>
        </div>

        {/* Brands Grid */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {brands.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center mx-auto mb-6">
                <Package2 className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No hay marcas disponibles
              </h3>
              <p className="text-slate-400 text-sm">
                Vuelve pronto para descubrir nuevas marcas
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {brands.map((brand) => {
                const slug = brand.name.toLowerCase().replace(/\s+/g, "-");
                const productCount = brand._count?.products || 0;
                
                return (
                  <Link
                    key={brand.id}
                    href={`/brands/${slug}`}
                    className="group relative overflow-hidden rounded-xl bg-linear-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 hover:scale-[1.02]"
                  >
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-linear-to-br from-purple-500/0 to-fuchsia-500/0 group-hover:from-purple-500/5 group-hover:to-fuchsia-500/5 transition-all duration-300 pointer-events-none" />
                    
                    {/* Content */}
                    <div className="relative z-10 p-6 space-y-4">
                      {/* Brand Image/Logo */}
                      <div className="relative w-full aspect-square rounded-lg bg-slate-800/50 overflow-hidden border border-slate-700/30 group-hover:border-purple-500/20 transition-all duration-300">
                        {brand.image_url ? (
                          <Image
                            src={brand.image_url}
                            alt={brand.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <Package2 className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                              <span className="text-2xl font-bold text-slate-600 uppercase tracking-wider">
                                {brand.name.substring(0, 2)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Brand Info */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                          {brand.name}
                        </h3>
                        
                        {brand.description && (
                          <p className="text-sm text-slate-400 line-clamp-2">
                            {brand.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-slate-500">
                            {productCount} {productCount === 1 ? "producto" : "productos"}
                          </span>
                          
                          <div className="flex items-center gap-1 text-purple-400 group-hover:gap-2 transition-all duration-300">
                            <span className="text-xs font-medium">Ver más</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Featured Badge (if has many products) */}
                    {productCount > 10 && (
                      <div className="absolute top-4 right-4 px-2 py-1 rounded-lg bg-linear-to-r from-purple-600/90 to-fuchsia-600/90 backdrop-blur-sm border border-purple-500/30">
                        <span className="text-xs font-semibold text-white">Popular</span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="border-t border-slate-800/50 bg-linear-to-b from-transparent to-slate-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="max-w-3xl mx-auto p-8 rounded-2xl bg-linear-to-br from-purple-500/10 to-fuchsia-500/10 border border-purple-500/30">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-white">
                  ¿No encuentras tu marca favorita?
                </h3>
                <p className="text-slate-300">
                  Contáctanos y cuéntanos qué marcas te gustaría ver en nuestra tienda
                </p>
                <a
                  href="mailto:info@tutienda.com"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-semibold transition-all duration-300 hover:scale-105"
                >
                  Contáctanos
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
