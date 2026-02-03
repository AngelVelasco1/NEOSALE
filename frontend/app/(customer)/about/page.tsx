import { Metadata } from "next";
import { Building2, Users, Target, Heart, Award, TrendingUp, Star, Zap, Globe, Sparkles, Mail, Phone, MapPin, Clock } from "lucide-react";
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
      gradient: "from-fuchsia-500/20 to-purple-500/20",
      borderColor: "border-fuchsia-500/30",
      iconColor: "text-fuchsia-400",
    },
    {
      icon: Users,
      title: "Clientes Primero",
      description: "Tu satisfacción es nuestra prioridad absoluta",
      gradient: "from-blue-500/20 to-indigo-500/20",
      borderColor: "border-blue-500/30",
      iconColor: "text-blue-400",
    },
    {
      icon: Award,
      title: "Calidad Garantizada",
      description: "Seleccionamos cuidadosamente cada producto que ofrecemos",
      gradient: "from-purple-500/20 to-violet-500/20",
      borderColor: "border-purple-500/30",
      iconColor: "text-purple-400",
    },
    {
      icon: TrendingUp,
      title: "Innovación Constante",
      description: "Mejoramos continuamente para brindarte la mejor experiencia",
      gradient: "from-indigo-500/20 to-fuchsia-500/20",
      borderColor: "border-indigo-500/30",
      iconColor: "text-indigo-400",
    },
  ];

  const stats = [
    { number: "50K+", label: "Clientes Felices", icon: Users, gradient: "from-blue-500/20 to-indigo-500/20" },
    { number: "10K+", label: "Productos", icon: Sparkles, gradient: "from-purple-500/20 to-violet-500/20" },
    { number: "100+", label: "Marcas", icon: Star, gradient: "from-fuchsia-500/20 to-purple-500/20" },
    { number: "5★", label: "Calificación", icon: Award, gradient: "from-indigo-500/20 to-fuchsia-500/20" },
  ];

  const teamStats = [
    { number: "50+", label: "Profesionales", icon: Users },
    { number: "24/7", label: "Soporte", icon: Zap },
    { number: "100%", label: "Compromiso", icon: Heart },
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "contacto@neossale.com",
      href: "mailto:contacto@neossale.com",
      gradient: "from-blue-500/20 to-indigo-500/20",
    },
    {
      icon: Phone,
      title: "Teléfono",
      value: "+57 300 123 4567",
      href: "tel:+573001234567",
      gradient: "from-purple-500/20 to-violet-500/20",
    },
    {
      icon: MapPin,
      title: "Dirección",
      value: "Bogotá, Colombia",
      href: "#",
      gradient: "from-fuchsia-500/20 to-purple-500/20",
    },
    {
      icon: Clock,
      title: "Horario",
      value: "L-V 9:00 AM - 6:00 PM",
      href: "#",
      gradient: "from-indigo-500/20 to-fuchsia-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-linear-to-br from-indigo-500/20 to-fuchsia-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-br from-purple-500/20 to-violet-500/20 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-linear-to-br from-fuchsia-500/15 to-indigo-500/15 rounded-full blur-2xl animate-pulse delay-700" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-linear-to-br from-blue-500/15 to-purple-500/15 rounded-full blur-2xl animate-pulse delay-300" />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="border-b border-slate-800/50 bg-linear-to-b from-slate-900/95 via-slate-900/90 to-slate-950/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="max-w-5xl mx-auto text-center space-y-8">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 bg-linear-to-r from-blue-600/30 to-purple-600/30 rounded-3xl blur-xl animate-pulse" />
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-linear-to-br from-blue-500/20 via-purple-500/20 to-indigo-500/20 border border-blue-500/30 backdrop-blur-sm">
                  <Building2 className="w-12 h-12 text-blue-400 drop-shadow-lg" />
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-linear-to-r from-blue-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent leading-tight">
                  Sobre
                  <br />
                  <span className="bg-linear-to-r from-fuchsia-300 to-purple-300 bg-clip-text text-transparent">
                    NeoSale
                  </span>
                </h1>

                <div className="w-32 h-1 bg-linear-to-r from-blue-500 to-purple-500 rounded-full mx-auto" />
              </div>

              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Tu destino de moda en línea, conectando estilo y calidad desde 2020.
                Una historia de pasión, innovación y compromiso con la excelencia.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-slate-300">Fundada en:</span>
                  <span className="font-semibold text-white">2020</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                  <Globe className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-300">Colombia</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  <span className="text-slate-300">Crecimiento</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
          <div className="max-w-6xl mx-auto">
            <div className="relative p-8 rounded-3xl bg-linear-to-br from-slate-900/80 via-slate-800/60 to-slate-900/40 border border-slate-700/50 backdrop-blur-xl">
              <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5" />
              <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center group">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br ${stat.gradient} border border-slate-600/50 group-hover:scale-110 transition-transform duration-300 mb-4`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-4xl lg:text-5xl font-bold bg-linear-to-r from-blue-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent mb-2">
                        {stat.number}
                      </div>
                      <div className="text-slate-300 font-medium">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-7xl mx-auto">
            {/* Introduction Card */}
            <div className="mb-16">
              <div className="relative p-8 rounded-3xl bg-linear-to-br from-slate-900/80 via-slate-800/60 to-slate-900/40 border border-slate-700/50 backdrop-blur-xl">
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5" />
                <div className="relative z-10 text-center space-y-4">
                  <h2 className="text-3xl font-bold bg-linear-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                    Nuestra Historia
                  </h2>
                  <p className="text-slate-300 max-w-3xl mx-auto leading-relaxed">
                    Fundada en 2020, NeoSale nació con una visión clara: democratizar el acceso a la moda de calidad en Colombia.
                    Comenzamos como una pequeña tienda en línea con un catálogo limitado, pero una gran pasión por ofrecer productos excepcionales.
                  </p>
                </div>
              </div>
            </div>

            {/* Story Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-6">
                <div className="space-y-4 text-slate-300 leading-relaxed">
                  <p>
                    Hoy, somos una de las plataformas de e-commerce de moda más confiables del país, con más de 50,000 clientes satisfechos y un catálogo de más de 10,000 productos de las mejores marcas nacionales e internacionales.
                  </p>
                  <p>
                    Nuestro crecimiento se debe a un compromiso inquebrantable con la calidad, la autenticidad y el servicio al cliente. Cada producto que ofrecemos es cuidadosamente seleccionado por nuestro equipo de expertos en moda.
                  </p>
                  <p>
                    Creemos que la moda debe ser accesible para todos, por eso trabajamos incansablemente para ofrecer precios competitivos sin comprometer la calidad, y para crear una experiencia de compra que sea tan placentera como encontrar la prenda perfecta.
                  </p>
                </div>
              </div>
              <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-3xl" />
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src="/imgs/NomLogo2.png"
                    alt="NeoSale"
                    width={300}
                    height={200}
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              <div className="relative p-8 rounded-3xl bg-linear-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 backdrop-blur-xl group hover:border-blue-500/30 transition-all duration-500">
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-linear-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">Nuestra Misión</h3>
                  <p className="text-slate-300 leading-relaxed">
                    Ofrecer una experiencia de compra en línea excepcional, proporcionando productos de moda de alta calidad a precios competitivos, con un servicio al cliente que supere las expectativas y construya relaciones duraderas con nuestros clientes.
                  </p>
                </div>
              </div>

              <div className="relative p-8 rounded-3xl bg-linear-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 backdrop-blur-xl group hover:border-indigo-500/30 transition-all duration-500">
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-indigo-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-linear-to-br from-indigo-500/20 to-fuchsia-500/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-8 h-8 text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors duration-300">Nuestra Visión</h3>
                  <p className="text-slate-300 leading-relaxed">
                    Ser la plataforma de e-commerce de moda líder en América Latina, reconocida por nuestra excelencia en el servicio, variedad de productos auténticos y compromiso con la sostenibilidad y la innovación tecnológica.
                  </p>
                </div>
              </div>
            </div>

            {/* Values Grid */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold bg-linear-to-r from-fuchsia-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent mb-4">
                  Nuestros Valores
                </h2>
                <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                  Los principios que guían cada decisión y acción en NeoSale
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <div
                      key={index}
                      className="group relative p-8 rounded-2xl bg-linear-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 backdrop-blur-xl hover:border-slate-600/70 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-fuchsia-500/10"
                    >
                      <div className={`absolute inset-0 rounded-2xl bg-linear-to-br ${value.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                      <div className="relative z-10 space-y-6">
                        <div className="flex items-start gap-4">
                          <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-linear-to-br ${value.gradient} border ${value.borderColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                            <Icon className={`w-7 h-7 ${value.iconColor} drop-shadow-sm`} />
                          </div>

                          <div className="flex-1 space-y-3">
                            <h3 className="text-xl font-bold text-white group-hover:text-fuchsia-300 transition-colors duration-300 leading-tight">
                              {value.title}
                            </h3>

                            <p className="text-slate-300 leading-relaxed text-sm">
                              {value.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Team Section */}
            <div className="relative p-12 rounded-3xl bg-linear-to-br from-slate-900/80 via-slate-800/60 to-slate-900/40 border border-slate-700/50 backdrop-blur-xl mb-16">
              <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-fuchsia-500/5 via-purple-500/5 to-indigo-500/5" />
              <div className="relative z-10">
                <div className="text-center space-y-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-fuchsia-500/20 to-purple-500/20 border border-fuchsia-500/30">
                    <Users className="w-8 h-8 text-fuchsia-400" />
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold bg-linear-to-r from-fuchsia-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                      Nuestro Equipo
                    </h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                      Detrás de NeoSale hay un equipo apasionado de profesionales dedicados a ofrecerte la mejor experiencia de compra. Desde expertos en moda hasta especialistas en tecnología y atención al cliente, trabajamos juntos para hacer realidad tu estilo.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {teamStats.map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <div key={index} className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50">
                          <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 bg-linear-to-br from-fuchsia-500/20 to-purple-500/20 border border-fuchsia-500/30 rounded-xl flex items-center justify-center">
                              <Icon className="w-6 h-6 text-fuchsia-400" />
                            </div>
                          </div>
                          <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                          <div className="text-slate-300">{stat.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h3 className="text-4xl font-bold bg-linear-to-r from-blue-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                  ¿Quieres Conocernos Mejor?
                </h3>
                <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                  Estamos aquí para responder tus preguntas y compartir más sobre nuestra historia y valores.
                  ¡No dudes en contactarnos!
                </p>
              </div>

              {/* Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {contactInfo.map((contact, index) => {
                  const Icon = contact.icon;
                  return (
                    <a
                      key={index}
                      href={contact.href}
                      className="group relative p-6 rounded-2xl bg-linear-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 backdrop-blur-xl hover:border-slate-600/70 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10"
                    >
                      <div className={`absolute inset-0 rounded-2xl bg-linear-to-br ${contact.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                      <div className="relative z-10 text-center space-y-4">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br ${contact.gradient} border border-slate-600/50 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white group-hover:text-blue-300 transition-colors duration-300">
                            {contact.title}
                          </h4>
                          <p className="text-slate-300 text-sm mt-1">
                            {contact.value}
                          </p>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Final CTA */}
              <div className="relative p-12 rounded-3xl bg-linear-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10 border border-blue-500/30 backdrop-blur-xl">
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-blue-500/5 to-purple-500/5" />
                <div className="relative z-10 text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                    <Sparkles className="w-8 h-8 text-blue-400" />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-white">
                      Únete a Nuestra Comunidad
                    </h3>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                      Forma parte de la familia NeoSale. Descubre las últimas tendencias,
                      accede a ofertas exclusivas y vive una experiencia de moda única.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="/products"
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-500 hover:via-purple-500 hover:to-indigo-500 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
                    >
                      <Sparkles className="w-5 h-5" />
                      Explorar Productos
                    </a>
                    <a
                      href="mailto:contacto@neossale.com"
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-linear-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold transition-all duration-300 hover:scale-105 border border-slate-600/50"
                    >
                      <Mail className="w-5 h-5" />
                      Contactar Equipo
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
