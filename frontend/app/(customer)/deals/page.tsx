import { Metadata } from "next";
import { Percent, Tag, Gift, Sparkles } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ofertas Especiales | NeoSale",
  description: "Descubre las mejores ofertas y descuentos en moda - Ahorra en NeoSale",
};

export default function DealsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-red-600 via-pink-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full mb-6">
              <Percent className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Ofertas Especiales
            </h1>
            <p className="text-xl md:text-2xl text-pink-100 leading-relaxed">
              Los mejores descuentos en tus productos favoritos
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <Gift className="w-24 h-24 mx-auto mb-6 text-pink-600" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Ofertas Increíbles Próximamente!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Estamos preparando descuentos especiales solo para ti. Suscríbete a nuestro newsletter para ser el primero en enterarte de nuestras ofertas exclusivas.
            </p>
            
            <div className="bg-linear-to-br from-pink-50 to-purple-50 rounded-2xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Suscríbete y Recibe
              </h3>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4">
                  <Tag className="w-8 h-8 mx-auto mb-2 text-pink-600" />
                  <p className="text-sm font-semibold">15% de descuento</p>
                  <p className="text-xs text-gray-600">en tu primera compra</p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-sm font-semibold">Ofertas exclusivas</p>
                  <p className="text-xs text-gray-600">para suscriptores</p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <Gift className="w-8 h-8 mx-auto mb-2 text-pink-600" />
                  <p className="text-sm font-semibold">Regalos especiales</p>
                  <p className="text-xs text-gray-600">en fechas especiales</p>
                </div>
              </div>
              
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                />
                <button
                  type="submit"
                  className="bg-linear-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg whitespace-nowrap"
                >
                  Suscribirse
                </button>
              </form>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-linear-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg"
              >
                Ver Todos los Productos
              </Link>
              <Link
                href="/brands"
                className="bg-white border-2 border-pink-600 text-pink-600 px-8 py-4 rounded-lg font-semibold hover:bg-pink-50 transition-all"
              >
                Explorar Marcas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
