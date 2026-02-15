import { Metadata } from "next";
import { Cookie, Settings, BarChart, Target, CheckCircle2, Shield, Database, Globe, Mail, Phone, MapPin, Clock, Sparkles, AlertTriangle } from "lucide-react";
import { CookiesFloatingParticles } from "./_components/CookiesFloatingParticles";

export const metadata: Metadata = {
  title: "Política de Cookies | NeoSale",
  description: "Política de cookies de NeoSale - Información sobre cómo usamos cookies y tecnologías similares",
};

export default function CookiesPage() {
  const cookieTypes = [
    {
      title: "Cookies Estrictamente Necesarias",
      icon: CheckCircle2,
      gradient: "from-orange-500/20 to-amber-500/20",
      borderColor: "border-orange-500/30",
      iconColor: "text-orange-400",
      required: true,
      content: `Estas cookies son esenciales para el funcionamiento del sitio web:

• Permitir la navegación básica del sitio
• Recordar productos en tu carrito de compras
• Mantener tu sesión activa
• Garantizar la seguridad y prevenir fraudes

Nota: No puedes desactivar estas cookies ya que el sitio no funcionaría correctamente.`,
    },
    {
      title: "Cookies de Funcionalidad",
      icon: Settings,
      gradient: "from-red-500/20 to-pink-500/20",
      borderColor: "border-red-500/30",
      iconColor: "text-red-400",
      required: false,
      content: `Mejoran la funcionalidad y personalización del sitio:

Propósito:
• Guardar tu ubicación (región/ciudad)
• Recordar ajustes de visualización
• Personalizar el contenido según tus preferencias
• Mejorar tu experiencia de usuario

Control: Puedes desactivar estas cookies, pero puede afectar la funcionalidad del sitio.`,
    },
    {
      title: "Cookies Analíticas",
      icon: BarChart,
      gradient: "from-pink-500/20 to-rose-500/20",
      borderColor: "border-pink-500/30",
      iconColor: "text-pink-400",
      required: false,
      content: `Nos ayudan a entender cómo los usuarios interactúan con el sitio:

• Contar visitantes y medir tráfico
• Analizar patrones de navegación
• Mejorar el rendimiento del sitio
• Identificar problemas técnicos

Control: Puedes optar por no participar en el rastreo analítico.`,
    },
    {
      title: "Cookies de Marketing",
      icon: Target,
      gradient: "from-purple-500/20 to-violet-500/20",
      borderColor: "border-purple-500/30",
      iconColor: "text-purple-400",
      required: false,
      content: `Utilizadas para mostrar publicidad relevante:

• Mostrar anuncios personalizados
• Limitar la frecuencia de anuncios
• Medir la efectividad de campañas
• Recordar tus intereses y comportamiento de compra

Control: Puedes rechazar estas cookies sin afectar la funcionalidad básica del sitio.`,
    },
  ];

  const additionalSections = [
    {
      title: "¿Qué son las Cookies?",
      icon: Cookie,
      gradient: "from-amber-500/20 to-orange-500/20",
      borderColor: "border-amber-500/30",
      iconColor: "text-amber-400",
      content: `Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (computadora, tablet o móvil) cuando visitas un sitio web. Permiten que el sitio recuerde tus acciones y preferencias durante un período de tiempo, para que no tengas que reconfigurarlas cada vez que regreses o navegues de una página a otra.

**Cómo funcionan:**
• Se crean cuando visitas un sitio web
• Se almacenan en tu navegador
• Se envían de vuelta al sitio en visitas futuras
• Contienen información específica sobre tu uso del sitio`,
    },
    {
      title: "Cómo Gestionar las Cookies",
      icon: Settings,
      gradient: "from-red-500/20 to-coral-500/20",
      borderColor: "border-red-500/30",
      iconColor: "text-red-400",
      content: `Tienes control total sobre las cookies en tu dispositivo:

**En tu navegador:**
• Chrome: Configuración → Privacidad → Cookies
• Firefox: Preferencias → Privacidad → Cookies
• Safari: Preferencias → Privacidad → Gestionar datos
• Edge: Configuración → Cookies y permisos

**Opciones disponibles:**
• Bloquear todas las cookies
• Eliminar cookies existentes
• Gestionar cookies por sitio
• Usar modo incógnito/privado`,
    },
    {
      title: "Cookies de Terceros",
      icon: Globe,
      gradient: "from-pink-500/20 to-purple-500/20",
      borderColor: "border-pink-500/30",
      iconColor: "text-pink-400",
      content: `Algunos de nuestros socios comerciales pueden establecer cookies en tu dispositivo:

**Proveedores de servicios:**
• Procesadores de pago (Stripe, PayPal)
• Herramientas de análisis (Google Analytics)
• Redes sociales (Facebook, Instagram)
• Plataformas de publicidad

**Control limitado:**
• No tenemos control directo sobre estas cookies
• Cumplen con sus propias políticas de privacidad
• Puedes gestionarlas desde tu navegador
• Consulta sus políticas para más información`,
    },
    {
      title: "Actualizaciones y Cambios",
      icon: AlertTriangle,
      gradient: "from-violet-500/20 to-purple-500/20",
      borderColor: "border-violet-500/30",
      iconColor: "text-violet-400",
      content: `Nos reservamos el derecho de actualizar esta política:

**Cambios posibles:**
• Nuevos tipos de cookies implementadas
• Modificaciones en el uso de cookies existentes
• Actualizaciones por cambios legales
• Mejoras en la transparencia

**Notificación:**
• Los cambios se publicarán en esta página
• Fecha de actualización se mostrará arriba
• Cambios significativos serán notificados
• El uso continuado implica aceptación`,
    },
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "cookies@tutienda.com",
      href: "mailto:cookies@tutienda.com",
      gradient: "from-orange-500/20 to-amber-500/20",
    },
    {
      icon: Phone,
      title: "Teléfono",
      value: "+57 300 123 4567",
      href: "tel:+573001234567",
      gradient: "from-red-500/20 to-pink-500/20",
    },
    {
      icon: MapPin,
      title: "Dirección",
      value: "Bogotá, Colombia",
      href: "#",
      gradient: "from-pink-500/20 to-rose-500/20",
    },
    {
      icon: Clock,
      title: "Horario",
      value: "L-V 9:00 AM - 6:00 PM",
      href: "#",
      gradient: "from-purple-500/20 to-violet-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-linear-to-br from-orange-500/20 to-amber-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-linear-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-br from-red-500/20 to-rose-500/20 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-linear-to-br from-violet-500/15 to-purple-500/15 rounded-full blur-2xl animate-pulse delay-700" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-linear-to-br from-coral-500/15 to-pink-500/15 rounded-full blur-2xl animate-pulse delay-300" />
      </div>

      {/* Floating Particles */}
      <CookiesFloatingParticles />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="border-b border-slate-800/50 bg-linear-to-b from-slate-900/95 via-slate-900/90 to-slate-950/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="max-w-5xl mx-auto text-center space-y-8">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 bg-linear-to-r from-orange-600/30 to-amber-600/30 rounded-3xl blur-xl animate-pulse" />
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-linear-to-br from-orange-500/20 via-amber-500/20 to-red-500/20 border border-orange-500/30 backdrop-blur-sm">
                  <Cookie className="w-12 h-12 text-orange-400 drop-shadow-lg" />
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-linear-to-r from-orange-300 via-amber-300 to-red-300 bg-clip-text text-transparent leading-tight">
                  Política de
                  <br />
                  <span className="bg-linear-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                    Cookies
                  </span>
                </h1>

                <div className="w-32 h-1 bg-linear-to-r from-orange-500 to-amber-500 rounded-full mx-auto" />
              </div>

              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Transparencia total sobre cómo usamos cookies y tecnologías similares para
                mejorar tu experiencia en nuestro sitio web de manera responsable y segura.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                  <span className="text-slate-300">Última actualización:</span>
                  <span className="font-semibold text-white">31 de Enero, 2026</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-300">Transparencia Total</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                  <Database className="w-4 h-4 text-pink-400" />
                  <span className="text-slate-300">Control del Usuario</span>
                </div>
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
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-orange-500/5 via-amber-500/5 to-red-500/5" />
                <div className="relative z-10 text-center space-y-4">
                  <h2 className="text-3xl font-bold bg-linear-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent">
                    Tecnología que Mejora tu Experiencia
                  </h2>
                  <p className="text-slate-300 max-w-3xl mx-auto leading-relaxed">
                    Las cookies nos permiten personalizar tu experiencia de compra, recordar tus preferencias
                    y mejorar continuamente nuestros servicios. Creemos en la transparencia y te damos control total.
                  </p>
                </div>
              </div>
            </div>

            {/* Cookie Types Grid */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold bg-linear-to-r from-orange-300 via-amber-300 to-red-300 bg-clip-text text-transparent mb-4">
                  Tipos de Cookies que Utilizamos
                </h2>
                <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                  Clasificamos las cookies según su función y propósito para mayor claridad
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {cookieTypes.map((type, index) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={index}
                      className="group relative p-8 rounded-2xl bg-linear-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 backdrop-blur-xl hover:border-slate-600/70 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/10"
                    >
                      <div className={`absolute inset-0 rounded-2xl bg-linear-to-br ${type.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                      <div className="relative z-10 space-y-6">
                        <div className="flex items-start gap-4">
                          <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-linear-to-br ${type.gradient} border ${type.borderColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                            <Icon className={`w-7 h-7 ${type.iconColor} drop-shadow-sm`} />
                          </div>

                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="text-xl font-bold text-white group-hover:text-orange-300 transition-colors duration-300 leading-tight">
                                {type.title}
                              </h3>
                              {type.required && (
                                <span className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                                  Requeridas
                                </span>
                              )}
                            </div>

                            <div className="prose prose-invert prose-slate max-w-none">
                              <p className="text-slate-300 leading-relaxed whitespace-pre-line text-sm">
                                {type.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Additional Information Grid */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold bg-linear-to-r from-pink-300 via-purple-300 to-violet-300 bg-clip-text text-transparent mb-4">
                  Información Adicional
                </h2>
                <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                  Todo lo que necesitas saber sobre cookies y tu control sobre ellas
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {additionalSections.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <div
                      key={index}
                      className="group relative p-8 rounded-2xl bg-linear-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 backdrop-blur-xl hover:border-slate-600/70 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-pink-500/10"
                    >
                      <div className={`absolute inset-0 rounded-2xl bg-linear-to-br ${section.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                      <div className="relative z-10 space-y-6">
                        <div className="flex items-start gap-4">
                          <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-linear-to-br ${section.gradient} border ${section.borderColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                            <Icon className={`w-7 h-7 ${section.iconColor} drop-shadow-sm`} />
                          </div>

                          <div className="flex-1 space-y-3">
                            <h3 className="text-xl font-bold text-white group-hover:text-pink-300 transition-colors duration-300 leading-tight">
                              {section.title}
                            </h3>

                            <div className="prose prose-invert prose-slate max-w-none">
                              <p className="text-slate-300 leading-relaxed whitespace-pre-line text-sm">
                                {section.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contact Section */}
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h3 className="text-4xl font-bold bg-linear-to-r from-orange-300 via-amber-300 to-red-300 bg-clip-text text-transparent">
                  ¿Preguntas sobre Cookies?
                </h3>
                <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                  Nuestro equipo técnico está aquí para resolver cualquier duda sobre
                  cómo gestionamos las cookies y tecnologías similares.
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
                      className="group relative p-6 rounded-2xl bg-linear-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 backdrop-blur-xl hover:border-slate-600/70 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/10"
                    >
                      <div className={`absolute inset-0 rounded-2xl bg-linear-to-br ${contact.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                      <div className="relative z-10 text-center space-y-4">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br ${contact.gradient} border border-slate-600/50 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white group-hover:text-orange-300 transition-colors duration-300">
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
              <div className="relative p-12 rounded-3xl bg-linear-to-br from-orange-500/10 via-amber-500/10 to-red-500/10 border border-orange-500/30 backdrop-blur-xl">
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-orange-500/5 to-amber-500/5" />
                <div className="relative z-10 text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30">
                    <Cookie className="w-8 h-8 text-orange-400" />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-white">
                      Control Total sobre tus Datos
                    </h3>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                      Te damos las herramientas para gestionar tus cookies según tus preferencias.
                      Tu privacidad y control son nuestra prioridad.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="mailto:cookies@tutienda.com"
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-linear-to-r from-orange-600 via-amber-600 to-red-600 hover:from-orange-500 hover:via-amber-500 hover:to-red-500 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/25"
                    >
                      <Mail className="w-5 h-5" />
                      Contactar Soporte Técnico
                    </a>
                    <a
                      href="tel:+573001234567"
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-linear-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold transition-all duration-300 hover:scale-105 border border-slate-600/50"
                    >
                      <Phone className="w-5 h-5" />
                      Llamar Ahora
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
