import { Metadata } from "next";
import { Building2, Users, Target, Heart, Award, TrendingUp } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sobre Nosotros | NeoSale",
  description: "Conoce la historia, misión y valores de NeoSale - Tu tienda de moda online de confianza",
};

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Pasión por la Moda",
      description: "Nos apasiona ofrecer las últimas tendencias con calidad excepcional",
    },
    {
      icon: Users,
      title: "Clientes Primero",
      description: "Tu satisfacción es nuestra prioridad absoluta",
    },
    {
      icon: Award,
      title: "Calidad Garantizada",
      description: "Seleccionamos cuidadosamente cada producto que ofrecemos",
    },
    {
      icon: TrendingUp,
      title: "Innovación Constante",
      description: "Mejoramos continuamente para brindarte la mejor experiencia",
    },
  ];

  const stats = [
    { number: "50K+", label: "Clientes Felices" },
    { number: "10K+", label: "Productos" },
    { number: "100+", label: "Marcas" },
    { number: "5★", label: "Calificación" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full mb-6">
              <Building2 className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Sobre NeoSale
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              Tu destino de moda en línea, conectando estilo y calidad desde 2020
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Nuestra Historia
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Fundada en 2020, NeoSale nació con una visión clara: democratizar el acceso a la moda de calidad en Colombia. Comenzamos como una pequeña tienda en línea con un catálogo limitado, pero una gran pasión por ofrecer productos excepcionales.
                </p>
                <p>
                  Hoy, somos una de las plataformas de e-commerce de moda más confiables del país, con más de 50,000 clientes satisfechos y un catálogo de más de 10,000 productos de las mejores marcas nacionales e internacionales.
                </p>
                <p>
                  Nuestro crecimiento se debe a un compromiso inquebrantable con la calidad, la autenticidad y el servicio al cliente. Cada producto que ofrecemos es cuidadosamente seleccionado por nuestro equipo de expertos en moda.
                </p>
              </div>
            </div>
            <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
              <Image
                src="/imgs/NomLogo2.png"
                alt="NeoSale"
                fill
                className="object-contain p-12"
              />
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Misión</h3>
              <p className="text-gray-700 leading-relaxed">
                Ofrecer una experiencia de compra en línea excepcional, proporcionando productos de moda de alta calidad a precios competitivos, con un servicio al cliente que supere las expectativas y construya relaciones duraderas con nuestros clientes.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 md:p-10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Visión</h3>
              <p className="text-gray-700 leading-relaxed">
                Ser la plataforma de e-commerce de moda líder en América Latina, reconocida por nuestra excelencia en el servicio, variedad de productos auténticos y compromiso con la sostenibilidad y la innovación tecnológica.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nuestros Valores
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Los principios que guían cada decisión y acción en NeoSale
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
                    <value.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white text-center">
            <Users className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nuestro Equipo
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Detrás de NeoSale hay un equipo apasionado de profesionales dedicados a ofrecerte la mejor experiencia de compra. Desde expertos en moda hasta especialistas en tecnología y atención al cliente, trabajamos juntos para hacer realidad tu estilo.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-blue-100">Profesionales</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-blue-100">Soporte</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-blue-100">Compromiso</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
