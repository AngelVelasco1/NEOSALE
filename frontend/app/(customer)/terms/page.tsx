import { Metadata } from "next";
import { Scale, FileText, AlertCircle, CheckCircle2, Shield, Users, CreditCard, Truck, RotateCcw, Copyright, Globe, Mail, Phone, MapPin, Clock, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Términos y Condiciones | NeoSale",
  description: "Términos y condiciones de uso de NeoSale - Lee nuestros términos antes de usar nuestros servicios",
};

export default function TermsPage() {
  const sections = [
    {
      title: "1. Aceptación de Términos",
      icon: CheckCircle2,
      gradient: "from-emerald-500/20 to-teal-500/20",
      borderColor: "border-emerald-500/30",
      iconColor: "text-emerald-400",
      content: `Al acceder y utilizar este sitio web, usted acepta y se compromete a cumplir con estos términos y condiciones de uso. Si no está de acuerdo con alguno de estos términos, le recomendamos no utilizar nuestros servicios.`,
    },
    {
      title: "2. Uso del Sitio Web",
      icon: FileText,
      gradient: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
      iconColor: "text-blue-400",
      content: `El contenido de este sitio web es para su información general y uso personal. Está sujeto a cambios sin previo aviso. Usted se compromete a:

• Utilizar el sitio de manera legal y apropiada
• No realizar actividades que puedan dañar o interferir con el funcionamiento del sitio
• No intentar acceder a áreas restringidas del sistema
• Proporcionar información veraz y actualizada al registrarse`,
    },
    {
      title: "3. Productos y Servicios",
      icon: Sparkles,
      gradient: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
      iconColor: "text-purple-400",
      content: `Nos esforzamos por mantener la información de productos actualizada y precisa. Sin embargo:

• Los precios están sujetos a cambios sin previo aviso
• Las imágenes son representativas y pueden variar ligeramente del producto real
• La disponibilidad de productos puede cambiar sin notificación previa
• Nos reservamos el derecho de limitar las cantidades de compra
• Los productos están sujetos a disponibilidad de stock`,
    },
    {
      title: "4. Registro de Cuenta",
      icon: Users,
      gradient: "from-orange-500/20 to-red-500/20",
      borderColor: "border-orange-500/30",
      iconColor: "text-orange-400",
      content: `Al crear una cuenta en nuestro sitio, usted:

• Es responsable de mantener la confidencialidad de su contraseña
• Es responsable de todas las actividades que ocurran bajo su cuenta
• Debe notificarnos inmediatamente de cualquier uso no autorizado
• Debe tener al menos 18 años de edad para registrarse
• Acepta proporcionar información veraz, actual y completa`,
    },
    {
      title: "5. Proceso de Compra",
      icon: CreditCard,
      gradient: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/30",
      iconColor: "text-green-400",
      content: `Al realizar una compra en nuestro sitio:

• La confirmación del pedido no garantiza la disponibilidad del producto
• Nos reservamos el derecho de rechazar o cancelar pedidos
• Los precios incluyen IVA según la legislación colombiana
• El contrato de compra se considera finalizado al recibir la confirmación
• Aplican las políticas de envío y devolución publicadas`,
    },
    {
      title: "6. Pagos y Facturación",
      icon: Shield,
      gradient: "from-indigo-500/20 to-blue-500/20",
      borderColor: "border-indigo-500/30",
      iconColor: "text-indigo-400",
      content: `Respecto a los pagos:

• Aceptamos los métodos de pago indicados en el sitio
• Los pagos son procesados de forma segura por pasarelas certificadas
• El cargo se realizará al confirmar el pedido
• En caso de error en precios, nos reservamos el derecho a cancelar
• Toda transacción está sujeta a verificación de fraude`,
    },
    {
      title: "7. Envíos y Entregas",
      icon: Truck,
      gradient: "from-cyan-500/20 to-blue-500/20",
      borderColor: "border-cyan-500/30",
      iconColor: "text-cyan-400",
      content: `Política de envíos:

• Los tiempos de entrega son estimados y no garantizados
• No somos responsables por retrasos causados por terceros
• El riesgo se transfiere al momento de la entrega al transportista
• Es responsabilidad del cliente verificar el paquete al recibirlo
• Los costos de envío se calculan según destino y peso`,
    },
    {
      title: "8. Devoluciones y Reembolsos",
      icon: RotateCcw,
      gradient: "from-pink-500/20 to-rose-500/20",
      borderColor: "border-pink-500/30",
      iconColor: "text-pink-400",
      content: `Para devoluciones:

• Aplica la Ley 1480 de 2011 (Estatuto del Consumidor)
• Derecho de retracto de 5 días hábiles desde la entrega
• Los productos deben estar en su empaque original sin usar
• El cliente asume el costo del envío de devolución
• Los reembolsos se procesan en 30 días hábiles máximo`,
    },
    {
      title: "9. Propiedad Intelectual",
      icon: Copyright,
      gradient: "from-violet-500/20 to-purple-500/20",
      borderColor: "border-violet-500/30",
      iconColor: "text-violet-400",
      content: `Todo el contenido del sitio web:

• Está protegido por derechos de autor y marcas registradas
• No puede ser reproducido sin autorización expresa
• Incluye textos, gráficos, logos, imágenes y software
• Su uso no autorizado puede resultar en acciones legales
• Las marcas de terceros pertenecen a sus respectivos dueños`,
    },
    {
      title: "10. Limitación de Responsabilidad",
      icon: Scale,
      gradient: "from-slate-500/20 to-gray-500/20",
      borderColor: "border-slate-500/30",
      iconColor: "text-slate-400",
      content: `Nuestra responsabilidad está limitada a:

• No garantizamos que el sitio esté libre de interrupciones o errores
• No somos responsables por daños indirectos o consecuentes
• La responsabilidad máxima no excederá el valor pagado por el producto
• No garantizamos la exactitud de información de terceros
• Aplican las limitaciones permitidas por la ley colombiana`,
    },
    {
      title: "11. Enlaces a Terceros",
      icon: Globe,
      gradient: "from-teal-500/20 to-cyan-500/20",
      borderColor: "border-teal-500/30",
      iconColor: "text-teal-400",
      content: `Nuestro sitio puede contener enlaces a sitios web externos:

• No somos responsables del contenido de sitios de terceros
• Los enlaces no implican endoso o aprobación
• El uso de sitios externos es bajo su propio riesgo
• Recomendamos revisar sus políticas de privacidad
• No controlamos la disponibilidad de estos sitios`,
    },
    {
      title: "12. Modificaciones",
      icon: FileText,
      gradient: "from-amber-500/20 to-orange-500/20",
      borderColor: "border-amber-500/30",
      iconColor: "text-amber-400",
      content: `Nos reservamos el derecho de:

• Modificar estos términos en cualquier momento
• Los cambios serán efectivos al publicarse en el sitio
• El uso continuado implica aceptación de los nuevos términos
• Se notificarán cambios significativos cuando sea posible
• Es su responsabilidad revisar periódicamente los términos`,
    },
    {
      title: "13. Ley Aplicable y Jurisdicción",
      icon: Scale,
      gradient: "from-rose-500/20 to-pink-500/20",
      borderColor: "border-rose-500/30",
      iconColor: "text-rose-400",
      content: `Estos términos se rigen por:

• La legislación de la República de Colombia
• Cualquier disputa se resolverá en tribunales colombianos
• Se aplicará el Estatuto del Consumidor (Ley 1480 de 2011)
• Se respetan los derechos del consumidor establecidos por ley
• Mediación como primera instancia de resolución de conflictos`,
    },
    {
      title: "14. Contacto",
      icon: Mail,
      gradient: "from-lime-500/20 to-green-500/20",
      borderColor: "border-lime-500/30",
      iconColor: "text-lime-400",
      content: `Para consultas sobre estos términos:

• Email: legal@tutienda.com
• Teléfono: +57 300 123 4567
• Dirección: Bogotá, Colombia
• Horario de atención: Lunes a Viernes, 9:00 AM - 6:00 PM
• Tiempo de respuesta: Máximo 5 días hábiles`,
    },
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "legal@tutienda.com",
      href: "mailto:legal@tutienda.com",
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: Phone,
      title: "Teléfono",
      value: "+57 300 123 4567",
      href: "tel:+573001234567",
      gradient: "from-green-500/20 to-emerald-500/20",
    },
    {
      icon: MapPin,
      title: "Dirección",
      value: "Bogotá, Colombia",
      href: "#",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: Clock,
      title: "Horario",
      value: "L-V 9:00 AM - 6:00 PM",
      href: "#",
      gradient: "from-orange-500/20 to-red-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-br from-fuchsia-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-linear-to-br from-emerald-500/15 to-teal-500/15 rounded-full blur-2xl animate-pulse delay-700" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-linear-to-br from-orange-500/15 to-red-500/15 rounded-full blur-2xl animate-pulse delay-300" />
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
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-linear-to-br from-blue-500/20 via-purple-500/20 to-fuchsia-500/20 border border-blue-500/30 backdrop-blur-sm">
                  <Scale className="w-12 h-12 text-blue-400 drop-shadow-lg" />
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-linear-to-r from-blue-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent leading-tight">
                  Términos y
                  <br />
                  <span className="bg-linear-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                    Condiciones
                  </span>
                </h1>

                <div className="w-32 h-1 bg-linear-to-r from-blue-500 to-purple-500 rounded-full mx-auto" />
              </div>

              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Por favor, lee cuidadosamente estos términos antes de usar nuestros servicios.
                Al utilizar nuestro sitio web, aceptas estar sujeto a estos términos y condiciones.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-slate-300">Última actualización:</span>
                  <span className="font-semibold text-white">31 de Enero, 2026</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-300">Protección Legal</span>
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
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-blue-500/5 via-purple-500/5 to-fuchsia-500/5" />
                <div className="relative z-10 text-center space-y-4">
                  <h2 className="text-3xl font-bold bg-linear-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                    Compromiso con la Transparencia
                  </h2>
                  <p className="text-slate-300 max-w-3xl mx-auto leading-relaxed">
                    Estos términos y condiciones están diseñados para proteger tanto a nuestros clientes como a nuestra empresa,
                    asegurando una experiencia de compra segura, justa y transparente para todos.
                  </p>
                </div>
              </div>
            </div>

            {/* Terms Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <div
                    key={index}
                    className="group relative p-8 rounded-2xl bg-linear-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 backdrop-blur-xl hover:border-slate-600/70 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10"
                  >
                    <div className={`absolute inset-0 rounded-2xl bg-linear-to-br ${section.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    <div className="relative z-10 space-y-6">
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-linear-to-br ${section.gradient} border ${section.borderColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <Icon className={`w-7 h-7 ${section.iconColor} drop-shadow-sm`} />
                        </div>

                        <div className="flex-1 space-y-3">
                          <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300 leading-tight">
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
                <h3 className="text-4xl font-bold bg-linear-to-r from-blue-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
                  ¿Necesitas Ayuda?
                </h3>
                <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                  Nuestro equipo legal está aquí para resolver cualquier duda sobre nuestros términos y condiciones.
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
              <div className="relative p-12 rounded-3xl bg-linear-to-br from-blue-500/10 via-purple-500/10 to-fuchsia-500/10 border border-blue-500/30 backdrop-blur-xl">
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-blue-500/5 to-purple-500/5" />
                <div className="relative z-10 text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                    <AlertCircle className="w-8 h-8 text-blue-400" />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-white">
                      ¿Tienes Preguntas Específicas?
                    </h3>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                      No dudes en contactarnos. Nuestro equipo de soporte legal está disponible para aclarar
                      cualquier duda sobre nuestros términos y condiciones.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="mailto:legal@tutienda.com"
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-linear-to-r from-blue-600 via-purple-600 to-fuchsia-600 hover:from-blue-500 hover:via-purple-500 hover:to-fuchsia-500 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
                    >
                      <Mail className="w-5 h-5" />
                      Contactar Soporte Legal
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
     
