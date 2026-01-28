import { Metadata } from "next";
import { Sparkles, TrendingUp, Star, Zap } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nuevos Lanzamientos | NeoSale",
  description: "Descubre las últimas novedades y lanzamientos en moda - Lo más nuevo en NeoSale",
};

export default function NewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full mb-6">
              <Sparkles className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Nuevos Lanzamientos
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              Descubre lo último en moda - Las tendencias más recientes te esperan
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <Zap className="w-24 h-24 mx-auto mb-6 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Próximamente!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Estamos trabajando en traerte las últimas novedades y lanzamientos exclusivos. Mantente atento a nuestras redes sociales para ser el primero en conocer nuestros nuevos productos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
              >
                Ver Todos los Productos
              </Link>
              <Link
                href="/deals"
                className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all"
              >
                Ver Ofertas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
