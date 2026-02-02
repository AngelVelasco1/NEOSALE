import { Metadata } from "next";
import { Clock, MapPin, Calendar, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Nuestra Historia | NeoSale",
  description: "Conoce la historia y evolución de NeoSale a través de los años",
};

export default function StoryPage() {
  const timeline = [
    {
      year: "2020",
      title: "El Comienzo",
      description: "NeoSale nace como una pequeña tienda en línea con 100 productos y un gran sueño: revolucionar el e-commerce de moda en Colombia.",
      achievements: ["Primera venta en línea", "10 productos iniciales", "Equipo fundador de 3 personas"],
    },
    {
      year: "2021",
      title: "Crecimiento Exponencial",
      description: "Expandimos nuestro catálogo a más de 1,000 productos y alcanzamos 5,000 clientes satisfechos.",
      achievements: ["Alianza con 20 marcas", "5,000 clientes", "Expansión a 10 ciudades"],
    },
    {
      year: "2022",
      title: "Consolidación",
      description: "Nos convertimos en una de las plataformas de moda más confiables, con tecnología de punta y un equipo de 30 profesionales.",
      achievements: ["10,000 productos en catálogo", "20,000 clientes", "App móvil lanzada"],
    },
    {
      year: "2023",
      title: "Innovación",
      description: "Implementamos IA para recomendaciones personalizadas y probadores virtuales, mejorando la experiencia de compra.",
      achievements: ["50+ marcas asociadas", "35,000 clientes", "Certificación ISO 9001"],
    },
    {
      year: "2024",
      title: "Expansión Regional",
      description: "Comenzamos operaciones en Ecuador y Perú, llevando nuestra visión de moda accesible a más países.",
      achievements: ["Expansión internacional", "50,000 clientes", "Premio a Mejor E-commerce"],
    },
    {
      year: "2026",
      title: "El Futuro es Ahora",
      description: "Continuamos innovando con tecnologías sostenibles y experiencias de compra inmersivas.",
      achievements: ["100+ marcas", "Programa de sostenibilidad", "Realidad aumentada integrada"],
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full mb-6">
              <Clock className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Nuestra Historia
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              Un viaje de pasión, innovación y compromiso con la moda
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-linear-to-b from-blue-200 via-indigo-200 to-purple-200 md:ml-[-2px]"></div>

            {/* Timeline Items */}
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex items-start gap-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Year Indicator */}
                  <div className="absolute left-8 md:left-1/2 -ml-6 md:-ml-12 w-12 h-12 md:w-24 md:h-24 bg-linear-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-xl z-10">
                    <span className="text-white font-bold text-sm md:text-xl">
                      {item.year}
                    </span>
                  </div>

                  {/* Content Card */}
                  <div
                    className={`flex-1 ml-20 md:ml-0 ${
                      index % 2 === 0 ? "md:pr-16" : "md:pl-16"
                    }`}
                  >
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shrink-0">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Award className="w-4 h-4 text-blue-600" />
                          Logros Destacados
                        </h4>
                        <ul className="space-y-2">
                          {item.achievements.map((achievement, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-2 text-sm text-gray-700"
                            >
                              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto bg-linear-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white text-center">
          <MapPin className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sé Parte de Nuestra Historia
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Cada cliente es parte fundamental de nuestro crecimiento. Únete a miles de personas que confían en NeoSale para su estilo personal.
          </p>
          <a
            href="/"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            Descubre Nuestros Productos
          </a>
        </div>
      </div>
    </div>
  );
}
