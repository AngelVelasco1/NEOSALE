import { Metadata } from "next";
import { Shield, Lock, Eye, Database, UserCheck, AlertTriangle, CheckCircle2, FileText, Users, CreditCard, Globe, Mail, Phone, MapPin, Clock, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidad | NeoSale",
  description: "Política de privacidad de NeoSale - Conoce cómo protegemos y manejamos tu información personal",
};

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Información que Recopilamos",
      icon: Database,
      gradient: "from-emerald-500/20 to-teal-500/20",
      borderColor: "border-emerald-500/30",
      iconColor: "text-emerald-400",
      content: `Recopilamos diferentes tipos de información para brindarte un mejor servicio:

**Información Personal:**
• Nombre completo y documento de identidad
• Dirección de correo electrónico
• Número de teléfono
• Dirección de envío y facturación
• Información de pago (procesada de forma segura)

**Información de Uso:**
• Dirección IP y tipo de navegador
• Páginas visitadas y tiempo de navegación
• Productos vistos y agregados al carrito
• Historial de compras y preferencias
• Cookies y tecnologías similares`,
    },
    {
      title: "2. Cómo Usamos tu Información",
      icon: UserCheck,
      gradient: "from-teal-500/20 to-cyan-500/20",
      borderColor: "border-teal-500/30",
      iconColor: "text-teal-400",
      content: `Utilizamos tu información personal para:

**Operaciones Esenciales:**
• Procesar y gestionar tus pedidos
• Comunicarnos contigo sobre tus compras
• Proporcionar soporte al cliente
• Verificar tu identidad y prevenir fraudes
• Cumplir con obligaciones legales y fiscales

**Mejoras del Servicio:**
• Personalizar tu experiencia de compra
• Enviar recomendaciones de productos
• Mejorar nuestro sitio web y servicios
• Realizar análisis estadísticos
• Desarrollar nuevos productos y servicios`,
    },
    {
      title: "3. Bases Legales para el Tratamiento",
      icon: Shield,
      gradient: "from-cyan-500/20 to-blue-500/20",
      borderColor: "border-cyan-500/30",
      iconColor: "text-cyan-400",
      content: `Tratamos tus datos personales bajo las siguientes bases legales:

• **Ejecución de contrato:** Para procesar tus pedidos
• **Consentimiento:** Para comunicaciones de marketing
• **Interés legítimo:** Para prevenir fraude y mejorar servicios
• **Obligación legal:** Para cumplir con requisitos fiscales y legales
• **Ley 1581 de 2012:** Protección de datos personales en Colombia`,
    },
    {
      title: "4. Compartir Información con Terceros",
      icon: Eye,
      gradient: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/30",
      iconColor: "text-green-400",
      content: `Podemos compartir tu información con:

**Proveedores de Servicios:**
• Empresas de transporte y logística
• Procesadores de pago seguros
• Servicios de hosting y almacenamiento
• Plataformas de email marketing
• Herramientas de análisis y métricas

**Requisitos Legales:**
• Autoridades gubernamentales cuando sea requerido
• Para proteger nuestros derechos legales
• En caso de fusión, adquisición o venta de activos

**Nota:** Nunca vendemos tu información personal a terceros con fines de marketing.`,
    },
    {
      title: "5. Seguridad de la Información",
      icon: Lock,
      gradient: "from-lime-500/20 to-green-500/20",
      borderColor: "border-lime-500/30",
      iconColor: "text-lime-400",
      content: `Implementamos medidas de seguridad para proteger tus datos:

**Medidas Técnicas:**
• Encriptación SSL/TLS en todas las transacciones
• Servidores seguros con certificaciones de seguridad
• Firewalls y sistemas de detección de intrusiones
• Copias de seguridad regulares
• Actualizaciones constantes de seguridad

**Medidas Organizacionales:**
• Acceso limitado solo a personal autorizado
• Capacitación en seguridad de datos
• Auditorías de seguridad periódicas
• Políticas estrictas de confidencialidad
• Monitoreo continuo de sistemas`,
    },
    {
      title: "6. Tus Derechos",
      icon: Shield,
      gradient: "from-emerald-500/20 to-green-500/20",
      borderColor: "border-emerald-500/30",
      iconColor: "text-emerald-400",
      content: `Según la Ley 1581 de 2012, tienes derecho a:

**Derechos Fundamentales:**
• **Acceso:** Conocer qué datos tenemos sobre ti
• **Rectificación:** Corregir información inexacta
• **Actualización:** Mantener tus datos al día
• **Supresión:** Solicitar la eliminación de tus datos
• **Revocación:** Retirar el consentimiento otorgado

**Cómo Ejercer tus Derechos:**
• Contacta a privacidad@tutienda.com
• Proporciona identificación válida
• Especifica claramente tu solicitud
• Responderemos en máximo 15 días hábiles`,
    },
    {
      title: "7. Cookies y Tecnologías de Rastreo",
      icon: Database,
      gradient: "from-teal-500/20 to-emerald-500/20",
      borderColor: "border-teal-500/30",
      iconColor: "text-teal-400",
      content: `Utilizamos cookies para mejorar tu experiencia:

**Tipos de Cookies:**
• **Esenciales:** Necesarias para el funcionamiento del sitio
• **Funcionales:** Recordar tus preferencias
• **Analíticas:** Entender cómo usas el sitio
• **Publicitarias:** Mostrar anuncios relevantes

**Control de Cookies:**
• Puedes gestionar cookies desde tu navegador
• Desactivar cookies puede afectar la funcionalidad
• Consulta nuestra Política de Cookies para más detalles`,
    },
    {
      title: "8. Retención de Datos",
      icon: Database,
      gradient: "from-cyan-500/20 to-teal-500/20",
      borderColor: "border-cyan-500/30",
      iconColor: "text-cyan-400",
      content: `Conservamos tu información personal:

• Durante el tiempo necesario para prestarte servicios
• Mientras mantengas una cuenta activa
• Por requisitos legales y fiscales (hasta 5 años)
• Para resolver disputas y hacer cumplir acuerdos
• Datos anonimizados pueden retenerse indefinidamente

**Eliminación de Cuenta:**
• Puedes solicitar la eliminación de tu cuenta
• Se conservarán datos requeridos legalmente
• El proceso puede tomar hasta 30 días`,
    },
    {
      title: "9. Transferencias Internacionales",
      icon: Globe,
      gradient: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
      iconColor: "text-blue-400",
      content: `Tu información puede ser transferida a:

• Servidores ubicados fuera de Colombia
• Proveedores de servicios internacionales
• Países con protección adecuada de datos

**Garantías:**
• Cláusulas contractuales estándar aprobadas
• Certificaciones de privacidad reconocidas
• Medidas de seguridad apropiadas
• Cumplimiento con regulaciones aplicables`,
    },
    {
      title: "10. Menores de Edad",
      icon: Shield,
      gradient: "from-green-500/20 to-lime-500/20",
      borderColor: "border-green-500/30",
      iconColor: "text-green-400",
      content: `Protección de menores:

• No recopilamos intencionalmente datos de menores de 18 años
• Los padres/tutores deben supervisar el uso del sitio
• Si detectamos datos de menores, los eliminaremos
• Se requiere consentimiento parental para menores
• Contacta inmediatamente si se registró información de un menor`,
    },
    {
      title: "11. Marketing y Comunicaciones",
      icon: Eye,
      gradient: "from-emerald-500/20 to-cyan-500/20",
      borderColor: "border-emerald-500/30",
      iconColor: "text-emerald-400",
      content: `Respecto a comunicaciones de marketing:

**Consentimiento:**
• Solicitamos tu consentimiento explícito
• Puedes suscribirte a nuestro newsletter
• Recibirás ofertas y promociones especiales

**Opt-out:**
• Cancela la suscripción en cualquier momento
• Usa el enlace "Darse de baja" en emails
• Actualiza preferencias en tu cuenta
• Respetamos tu decisión inmediatamente`,
    },
    {
      title: "12. Cambios a esta Política",
      icon: AlertTriangle,
      gradient: "from-amber-500/20 to-orange-500/20",
      borderColor: "border-amber-500/30",
      iconColor: "text-amber-400",
      content: `Actualizaciones de la política:

• Nos reservamos el derecho de modificar esta política
• Los cambios se publicarán en esta página
• La fecha de actualización se mostrará arriba
• Cambios significativos serán notificados por email
• El uso continuado implica aceptación de cambios`,
    },
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "privacidad@tutienda.com",
      href: "mailto:privacidad@tutienda.com",
      gradient: "from-emerald-500/20 to-teal-500/20",
    },
    {
      icon: Phone,
      title: "Teléfono",
      value: "+57 300 123 4567",
      href: "tel:+573001234567",
      gradient: "from-teal-500/20 to-cyan-500/20",
    },
    {
      icon: MapPin,
      title: "Dirección",
      value: "Bogotá, Colombia",
      href: "#",
      gradient: "from-green-500/20 to-emerald-500/20",
    },
    {
      icon: Clock,
      title: "Horario",
      value: "L-V 9:00 AM - 6:00 PM",
      href: "#",
      gradient: "from-lime-500/20 to-green-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-linear-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-linear-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-br from-green-500/20 to-lime-500/20 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-linear-to-br from-teal-500/15 to-cyan-500/15 rounded-full blur-2xl animate-pulse delay-700" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-linear-to-br from-blue-500/15 to-teal-500/15 rounded-full blur-2xl animate-pulse delay-300" />
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
                <div className="absolute inset-0 bg-linear-to-r from-emerald-600/30 to-teal-600/30 rounded-3xl blur-xl animate-pulse" />
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-linear-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-500/30 backdrop-blur-sm">
                  <Shield className="w-12 h-12 text-emerald-400 drop-shadow-lg" />
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-linear-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent leading-tight">
                  Política de
                  <br />
                  <span className="bg-linear-to-r from-teal-300 to-blue-300 bg-clip-text text-transparent">
                    Privacidad
                  </span>
                </h1>

                <div className="w-32 h-1 bg-linear-to-r from-emerald-500 to-teal-500 rounded-full mx-auto" />
              </div>

              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Tu privacidad es nuestra prioridad absoluta. Conoce cómo recopilamos, usamos y protegemos
                tu información personal conforme a la legislación colombiana y estándares internacionales.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-slate-300">Última actualización:</span>
                  <span className="font-semibold text-white">31 de Enero, 2026</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300">Protección GDPR</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                  <Shield className="w-4 h-4 text-teal-400" />
                  <span className="text-slate-300">Ley 1581 de 2012</span>
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
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5" />
                <div className="relative z-10 text-center space-y-4">
                  <h2 className="text-3xl font-bold bg-linear-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                    Compromiso con tu Privacidad
                  </h2>
                  <p className="text-slate-300 max-w-3xl mx-auto leading-relaxed">
                    En NeoSale, la protección de tus datos personales es fundamental. Esta política explica
                    de manera transparente cómo manejamos tu información y cuáles son tus derechos.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <div
                    key={index}
                    className="group relative p-8 rounded-2xl bg-linear-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 backdrop-blur-xl hover:border-slate-600/70 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/10"
                  >
                    <div className={`absolute inset-0 rounded-2xl bg-linear-to-br ${section.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    <div className="relative z-10 space-y-6">
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-linear-to-br ${section.gradient} border ${section.borderColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <Icon className={`w-7 h-7 ${section.iconColor} drop-shadow-sm`} />
                        </div>

                        <div className="flex-1 space-y-3">
                          <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors duration-300 leading-tight">
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

            {/* Contact Section */}
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h3 className="text-4xl font-bold bg-linear-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                  ¿Preguntas sobre tu Privacidad?
                </h3>
                <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                  Nuestro equipo de protección de datos está aquí para resolver cualquier duda sobre
                  cómo manejamos tu información personal.
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
                      className="group relative p-6 rounded-2xl bg-linear-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 backdrop-blur-xl hover:border-slate-600/70 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/10"
                    >
                      <div className={`absolute inset-0 rounded-2xl bg-linear-to-br ${contact.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                      <div className="relative z-10 text-center space-y-4">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br ${contact.gradient} border border-slate-600/50 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white group-hover:text-emerald-300 transition-colors duration-300">
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
              <div className="relative p-12 rounded-3xl bg-linear-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30 backdrop-blur-xl">
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-emerald-500/5 to-teal-500/5" />
                <div className="relative z-10 text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
                    <Lock className="w-8 h-8 text-emerald-400" />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-white">
                      Protección de Datos Garantizada
                    </h3>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                      Cumplimos con la Ley 1581 de 2012 y estándares internacionales de protección de datos.
                      Tu información está segura con nosotros.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="mailto:privacidad@tutienda.com"
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25"
                    >
                      <Mail className="w-5 h-5" />
                      Contactar Protección de Datos
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
