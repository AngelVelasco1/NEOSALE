import { Metadata } from "next";
import { Briefcase, Users, TrendingUp, Heart, Send, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Trabaja con Nosotros | NeoSale",
  description: "Únete al equipo de NeoSale y forma parte de la revolución del e-commerce de moda",
};

export default function CareersPage() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Crecimiento Profesional",
      description: "Oportunidades de desarrollo y capacitación constante",
    },
    {
      icon: Users,
      title: "Ambiente Colaborativo",
      description: "Equipo joven, dinámico y apasionado por la innovación",
    },
    {
      icon: Heart,
      title: "Balance Vida-Trabajo",
      description: "Horarios flexibles y trabajo remoto disponible",
    },
    {
      icon: Briefcase,
      title: "Beneficios Competitivos",
      description: "Salario competitivo, bonos y beneficios adicionales",
    },
  ];

  const openPositions = [
    {
      title: "Desarrollador Full Stack",
      department: "Tecnología",
      location: "Bogotá / Remoto",
      type: "Tiempo Completo",
      description: "Buscamos desarrollador con experiencia en React, Node.js y bases de datos para unirse a nuestro equipo de tecnología.",
    },
    {
      title: "Diseñador UX/UI",
      department: "Diseño",
      location: "Bogotá / Remoto",
      type: "Tiempo Completo",
      description: "Únete a nuestro equipo de diseño para crear experiencias de usuario excepcionales en nuestra plataforma.",
    },
    {
      title: "Especialista en Marketing Digital",
      department: "Marketing",
      location: "Bogotá",
      type: "Tiempo Completo",
      description: "Gestiona campañas digitales, SEO/SEM y estrategias de contenido para aumentar nuestra presencia online.",
    },
    {
      title: "Customer Success Manager",
      department: "Servicio al Cliente",
      location: "Bogotá / Híbrido",
      type: "Tiempo Completo",
      description: "Lidera iniciativas para mejorar la satisfacción del cliente y optimizar la experiencia de compra.",
    },
    {
      title: "Analista de Datos",
      department: "Tecnología",
      location: "Bogotá / Remoto",
      type: "Tiempo Completo",
      description: "Analiza datos de comportamiento de usuarios y ventas para generar insights accionables.",
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
              <Briefcase className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Trabaja con Nosotros
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              Únete a un equipo apasionado que está revolucionando el e-commerce de moda
            </p>
          </div>
        </div>
      </div>

      {/* Why Work With Us */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por Qué NeoSale?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Más que un trabajo, es una oportunidad de crecer profesionalmente
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          {/* Culture Section */}
          <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 mb-20">
            <div className="max-w-3xl mx-auto text-center">
              <Users className="w-16 h-16 mx-auto mb-6 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Nuestra Cultura
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                En NeoSale valoramos la creatividad, la innovación y el trabajo en equipo. Creemos que un ambiente laboral positivo y colaborativo es fundamental para el éxito. Aquí encontrarás un espacio donde tus ideas son escuchadas y donde puedes hacer una diferencia real.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white rounded-xl p-4">
                  <div className="text-3xl font-bold text-blue-600 mb-1">95%</div>
                  <div className="text-sm text-gray-600">Satisfacción Empleados</div>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <div className="text-3xl font-bold text-indigo-600 mb-1">4.8★</div>
                  <div className="text-sm text-gray-600">Calificación Glassdoor</div>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <div className="text-3xl font-bold text-purple-600 mb-1">50+</div>
                  <div className="text-sm text-gray-600">Profesionales</div>
                </div>
              </div>
            </div>
          </div>

          {/* Open Positions */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Posiciones Abiertas
              </h2>
              <p className="text-lg text-gray-600">
                Encuentra la oportunidad perfecta para ti
              </p>
            </div>

            <div className="space-y-6">
              {openPositions.map((position, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {position.title}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                          {position.department}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                          {position.type}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                          📍 {position.location}
                        </span>
                      </div>
                    </div>
                    <button className="text-white px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap"
                      style={{
                        backgroundImage: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.9';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    >
                      Aplicar Ahora
                    </button>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {position.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Spontaneous Application */}
          <div className="bg-linear-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <Send className="w-16 h-16 mx-auto mb-6 opacity-80" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ¿No Encontraste tu Posición Ideal?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Envíanos tu CV de todas formas. Siempre estamos buscando talento excepcional para unirse a nuestro equipo.
              </p>
              <div className="bg-white rounded-2xl p-8 text-left">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                        placeholder="+57 300 123 4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Área de Interés
                      </label>
                      <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900">
                        <option value="">Selecciona un área</option>
                        <option>Tecnología</option>
                        <option>Marketing</option>
                        <option>Diseño</option>
                        <option>Servicio al Cliente</option>
                        <option>Operaciones</option>
                        <option>Otro</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      LinkedIn (Opcional)
                    </label>
                    <input
                      type="url"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                      placeholder="https://linkedin.com/in/tuperfil"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Carta de Presentación
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-gray-900"
                      placeholder="Cuéntanos sobre ti y por qué quieres trabajar con nosotros..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Adjuntar CV (PDF, DOC, DOCX)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                      <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-600 text-sm">
                        Haz clic para seleccionar o arrastra tu archivo aquí
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                  >
                    Enviar Aplicación
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
