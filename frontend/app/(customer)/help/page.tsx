import { Metadata } from "next";
import {
  HelpCircle,
  MessageSquare,
  AlertCircle,
  ThumbsUp,
  Send,
  Phone,
  Mail,
  Clock,
  MapPin,
  Search,
  Package,
  CreditCard,
  Truck,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Centro de Ayuda | NeoSale",
  description: "Centro de ayuda y atención al cliente - PQRS (Peticiones, Quejas, Reclamos y Sugerencias)",
};

export default function HelpPage() {
  const pqrsTypes = [
    {
      title: "Petición",
      description: "Solicita información o servicios",
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Queja",
      description: "Expresa tu inconformidad sobre un servicio",
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Reclamo",
      description: "Reporta incumplimiento en productos o servicios",
      icon: HelpCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Sugerencia",
      description: "Ayúdanos a mejorar con tus ideas",
      icon: ThumbsUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  const faqs = [
    {
      category: "Pedidos y Envíos",
      icon: Package,
      questions: [
        {
          q: "¿Cómo puedo rastrear mi pedido?",
          a: "Puedes rastrear tu pedido desde tu perfil en la sección 'Mis Pedidos' o mediante el enlace de seguimiento enviado a tu correo.",
        },
        {
          q: "¿Cuánto tarda la entrega?",
          a: "Los tiempos de entrega varían según tu ubicación. Generalmente entre 2-5 días hábiles para ciudades principales y 5-8 días para otras zonas.",
        },
        {
          q: "¿Hacen envíos a todo el país?",
          a: "Sí, realizamos envíos a todo Colombia. Los costos de envío se calculan según tu ubicación.",
        },
      ],
    },
    {
      category: "Pagos",
      icon: CreditCard,
      questions: [
        {
          q: "¿Qué métodos de pago aceptan?",
          a: "Aceptamos tarjetas de crédito/débito, PSE, efectivo (Efecty, Baloto) y contra entrega en algunas zonas.",
        },
        {
          q: "¿Es seguro pagar en línea?",
          a: "Sí, utilizamos pasarelas de pago certificadas con encriptación SSL para proteger tus datos.",
        },
        {
          q: "¿Puedo pagar en cuotas?",
          a: "Sí, aceptamos pagos diferidos según las opciones de tu tarjeta de crédito.",
        },
      ],
    },
    {
      category: "Devoluciones y Cambios",
      icon: RefreshCw,
      questions: [
        {
          q: "¿Cuál es la política de devoluciones?",
          a: "Tienes 30 días para devolver productos sin usar con etiquetas originales. Ver política completa en Términos y Condiciones.",
        },
        {
          q: "¿Cómo solicito un cambio?",
          a: "Contacta nuestro servicio al cliente con tu número de pedido. Te guiaremos en el proceso.",
        },
        {
          q: "¿Quién cubre el costo de devolución?",
          a: "Si el producto tiene defecto, cubrimos el envío. Para otras razones, el cliente asume el costo de retorno.",
        },
      ],
    },
    {
      category: "Cuenta y Seguridad",
      icon: ShieldCheck,
      questions: [
        {
          q: "¿Cómo cambio mi contraseña?",
          a: "Ve a tu perfil, sección 'Seguridad' y selecciona 'Cambiar contraseña'.",
        },
        {
          q: "¿Mis datos están protegidos?",
          a: "Sí, cumplimos con todas las normas de protección de datos. Lee nuestra Política de Privacidad.",
        },
        {
          q: "¿Puedo eliminar mi cuenta?",
          a: "Sí, contacta nuestro equipo de soporte para gestionar la eliminación de tu cuenta.",
        },
      ],
    },
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: "Teléfono",
      value: "+57 300 123 4567",
      description: "Lun - Vie: 8:00 AM - 6:00 PM",
      link: "tel:+573001234567",
    },
    {
      icon: Mail,
      title: "Email",
      value: "soporte@neosale.com",
      description: "Respuesta en 24-48 horas",
      link: "mailto:soporte@neosale.com",
    },
    {
      icon: MessageSquare,
      title: "Chat en Vivo",
      value: "Chat disponible",
      description: "Lun - Sáb: 9:00 AM - 8:00 PM",
      link: "#chat",
    },
    {
      icon: MapPin,
      title: "Oficina Principal",
      value: "Bogotá, Colombia",
      description: "Cra 7 #71-21, Oficina 501",
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full mb-6 shadow-2xl">
              <HelpCircle className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Centro de Ayuda
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              ¿En qué podemos ayudarte hoy?
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Busca por palabras clave: devolución, pago, envío..."
                className="w-full px-6 py-4 rounded-full bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/40 shadow-2xl"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PQRS Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Sistema PQRS
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Tu opinión es importante. Selecciona el tipo de solicitud que deseas realizar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {pqrsTypes.map((type, index) => (
              <div
                key={index}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer hover:border-blue-500/50"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 ${type.color} bg-slate-800/50 rounded-xl mb-4 shadow-lg`}>
                  <type.icon className="w-7 h-7" />
                </div>
                <h3 className={`text-xl font-bold ${type.color} mb-2`}>
                  {type.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {type.description}
                </p>
              </div>
            ))}
          </div>

          {/* PQRS Form */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 md:p-12 mb-16">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-2">
                Envía tu Solicitud
              </h3>
              <p className="text-gray-400 mb-8">
                Completa el formulario y nos pondremos en contacto contigo lo antes posible
              </p>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="tucorreo@ejemplo.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Tipo de Solicitud *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="peticion">Petición</option>
                      <option value="queja">Queja</option>
                      <option value="reclamo">Reclamo</option>
                      <option value="sugerencia">Sugerencia</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Número de Pedido (Opcional)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="#12345"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Asunto *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Breve descripción del asunto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Describe detalladamente tu solicitud..."
                  />
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-600 bg-slate-800 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
                    Acepto la{" "}
                    <Link href="/privacy" className="text-blue-400 hover:text-blue-300 hover:underline">
                      Política de Privacidad
                    </Link>{" "}
                    y el{" "}
                    <Link href="/data-treatment" className="text-blue-400 hover:text-blue-300 hover:underline">
                      Tratamiento de Datos Personales
                    </Link>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                >
                  <Send className="w-5 h-5" />
                  Enviar Solicitud
                </button>
              </form>
            </div>
          </div>

          {/* FAQs Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Preguntas Frecuentes
              </h2>
              <p className="text-lg text-gray-400">
                Encuentra respuestas rápidas a las preguntas más comunes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqs.map((category, index) => (
                <div
                  key={index}
                  className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8 hover:shadow-blue-500/5 transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      {category.category}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {category.questions.map((item, qIndex) => (
                      <details key={qIndex} className="group">
                        <summary className="cursor-pointer list-none">
                          <div className="flex items-start gap-2 hover:text-blue-400 transition-colors">
                            <span className="text-blue-500 mt-1">▸</span>
                            <span className="font-semibold text-gray-300 group-open:text-blue-400">
                              {item.q}
                            </span>
                          </div>
                        </summary>
                        <p className="mt-2 ml-4 text-gray-400 text-sm leading-relaxed">
                          {item.a}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Methods */}
          <div className="bg-linear-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Otros Canales de Contacto
                </h2>
                <p className="text-blue-100 text-lg">
                  Elige el canal que mejor se adapte a tus necesidades
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {contactMethods.map((method, index) => (
                  <a
                    key={index}
                    href={method.link}
                    className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                      <method.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">{method.title}</h3>
                    <p className="text-blue-100 font-semibold mb-1">
                      {method.value}
                    </p>
                    <p className="text-sm text-blue-200">{method.description}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Hours Section */}
          <div className="mt-16 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-blue-500" />
              <h3 className="text-2xl font-bold text-white">
                Horarios de Atención
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <p className="font-semibold text-white mb-1">Lunes a Viernes</p>
                <p className="text-gray-400">8:00 AM - 6:00 PM</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Sábados</p>
                <p className="text-gray-400">9:00 AM - 2:00 PM</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Domingos y Festivos</p>
                <p className="text-gray-400">Cerrado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
