import { Metadata } from "next";
import { getBrandBySlug } from "../services";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Package2, ArrowLeft } from "lucide-react";
import { ProductCard } from "./components/ProductCard";

// Esta ruta es dinámica y depende de la BD, no se puede prerenderer
export const dynamic = "force-dynamic";

// Static metadata - Dynamic metadata not compatible with Cache Components
export const metadata: Metadata = {
  title: "Marca | NeoSale",
  description: "Descubre todos los productos de esta marca en NeoSale",
};

interface BrandPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BrandDetailPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const productCount = brand._count?.products || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Back Button */}
        <div className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/brands"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-purple-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a Marcas
            </Link>
          </div>
        </div>

        {/* Brand Header */}
        <div className="border-b border-slate-800/50 bg-gradient-to-b from-slate-900/90 to-transparent backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Brand Logo */}
                <div className="flex-shrink-0">
                  <div className="relative w-32 h-32 rounded-2xl bg-slate-800/50 overflow-hidden border border-slate-700/50">
                    {brand.image_url ? (
                      <Image
                        src={brand.image_url}
                        alt={brand.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Package2 className="w-16 h-16 text-slate-600" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Brand Info */}
                <div className="flex-1 text-center md:text-left space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-300 via-fuchsia-300 to-blue-300 bg-clip-text text-transparent">
                      {brand.name}
                    </h1>
                    
                    {brand.description && (
                      <p className="text-lg text-slate-300 max-w-2xl">
                        {brand.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-center md:justify-start gap-8">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                        <Package2 className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm text-slate-400">Productos</div>
                        <div className="text-lg font-bold text-white">{productCount}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Productos de {brand.name}
            </h2>
            <p className="text-slate-400 text-sm">
              Explora nuestra colección de productos de esta marca
            </p>
          </div>

          {brand.products.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center mx-auto mb-6">
                <Package2 className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No hay productos disponibles
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                Esta marca aún no tiene productos en catálogo
              </p>
              <Link
                href="/brands"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-600 hover:border-purple-500/50 text-white font-medium transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4" />
                Ver otras marcas
              </Link>
            </div>
          ) : (
            <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {brand.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
