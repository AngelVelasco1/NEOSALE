"use client";

import { useState } from "react";
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

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

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

  // Función para normalizar acentos y caracteres especiales
  const normalizeText = (text: string) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // Función para filtrar FAQs según la búsqueda
  const trimmedQuery = searchQuery.trim();
  const normalizedQuery = normalizeText(trimmedQuery);
  const searchWords = normalizedQuery.split(/\s+/).filter((word) => word.length > 1);
  
  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (question) => {
          const normalizedQuestion = normalizeText(question.q + " " + question.a);
          return (
            searchWords.length === 0 ||
            searchWords.some((word) => normalizedQuestion.includes(word))
          );
        }
      ),
    }))
    .filter((category) => category.questions.length > 0);

  const hasSearchResults = filteredFaqs.length > 0 || searchQuery === "";

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden relative">
      {/* Animated Orbital Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Center gradient orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Orbital path 1 - Blue to Purple */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-blue-500/25 to-cyan-500/15 rounded-full blur-3xl animate-bounce" style={{animationDuration: '4s'}}></div>
                
        {/* Orbital path 3 - Indigo to Blue */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-blue-500/10 rounded-full blur-3xl" style={{animation: 'spin 20s linear infinite'}}></div> 

        {/* Add spin animation */}
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-cyan-500/5 to-purple-600/10"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 right-40 w-80 h-80 bg-gradient-to-br from-blue-500/15 to-cyan-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 left-40 w-80 h-80 bg-gradient-to-tl from-purple-500/10 to-pink-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-blue-500/30 to-cyan-500/20 backdrop-blur-2xl rounded-2xl mb-8 shadow-2xl shadow-blue-500/50 border border-blue-400/40 hover:shadow-3xl hover:shadow-blue-400/60 transition-all duration-300">
              <HelpCircle className="w-14 h-14 text-blue-300" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
              Centro de Ayuda
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-12 font-light max-w-2xl mx-auto">
              Encuentra respuestas rápidas y resuelve tus dudas al instante
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/40 via-cyan-500/30 to-blue-500/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="relative flex items-center bg-slate-700/50 backdrop-blur-2xl rounded-2xl border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300 shadow-lg hover:shadow-blue-500/30">
                <Search className="absolute left-5 w-6 h-6 text-blue-300 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Busca: devolución, pago, envío, cuenta..."
                  className="w-full pl-16 pr-6 py-4 rounded-2xl bg-transparent text-white placeholder-gray-400 focus:outline-none transition-all text-base md:text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PQRS Section */}
   

      {/* FAQs Section */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-lg text-gray-400 font-light">
              {searchQuery ? `Resultados para: "${searchQuery}"` : "Encuentra respuestas rápidas a las preguntas más comunes"}
            </p>
          </div>

          {!hasSearchResults ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-300 mb-2">No se encontraron resultados</h3>
              <p className="text-gray-400 mb-6">No hay preguntas que coincidan con "{searchQuery}". Intenta con otras palabras clave.</p>
              <button
                onClick={() => setSearchQuery("")}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                Ver todas las preguntas
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(searchQuery ? filteredFaqs : faqs).map((category, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-slate-800/70 to-slate-900/80 backdrop-blur-xl border border-slate-600/60 rounded-2xl shadow-2xl p-8 hover:border-blue-400/60 transition-all hover:shadow-3xl hover:shadow-blue-500/25 hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl shadow-blue-500/50 group-hover:scale-125 transition-transform group-hover:shadow-3xl group-hover:shadow-blue-400/60">
                    <category.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {category.category}
                  </h3>
                </div>
                <div className="space-y-5">
                  {category.questions.map((item, qIndex) => (
                    <details key={qIndex} className="group/faq">
                      <summary className="cursor-pointer list-none">
                        <div className="flex items-start gap-3 hover:text-blue-300 transition-colors py-2">
                          <span className="text-blue-400 mt-1.5 font-bold group-open/faq:text-blue-300">►</span>
                          <span className="font-semibold text-gray-100 group-open/faq:text-blue-300 transition-colors">
                            {item.q}
                          </span>
                        </div>
                      </summary>
                      <p className="mt-3 ml-8 text-gray-300 text-sm leading-relaxed font-light">
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact Methods */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl"></div>
            <div className="absolute inset-0 bg-black/20 rounded-3xl"></div>
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
            </div>

            <div className="relative z-10 p-8 md:p-16">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                  Otros Canales de Contacto
                </h2>
                <p className="text-blue-100 text-lg font-light">
                  Elige el canal que mejor se adapte a tus necesidades
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {contactMethods.map((method, index) => (
                  <a
                    key={index}
                    href={method.link}
                    className="group/contact bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 hover:bg-white/30 hover:border-white/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-400/40 shadow-lg shadow-white/10"
                  >
                    <div className="w-14 h-14 bg-white/30 rounded-xl flex items-center justify-center mb-5 group-hover/contact:scale-125 transition-transform group-hover/contact:bg-white/40 shadow-md shadow-gray-700/60">
                      <method.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-white">{method.title}</h3>
                    <p className="text-blue-50 font-semibold mb-1 text-sm">
                      {method.value}
                    </p>
                    <p className="text-sm text-blue-200/80 font-light">{method.description}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hours Section */}
      <div className="relative z-10 container mx-auto px-4 py-20 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/80 backdrop-blur-xl border border-slate-600/60 rounded-3xl shadow-2xl p-10 text-center hover:border-blue-400/60 transition-all shadow-blue-500/20">
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-3xl font-black text-white">
                Horarios de Atención
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="p-6 bg-slate-700/20 rounded-2xl border border-slate-600/30">
                <p className="font-bold text-white mb-2 text-lg">Lunes a Viernes</p>
                <p className="text-gray-400 font-light text-sm">8:00 AM - 6:00 PM</p>
              </div>
              <div className="p-6 bg-slate-700/20 rounded-2xl border border-slate-600/30">
                <p className="font-bold text-white mb-2 text-lg">Sábados</p>
                <p className="text-gray-400 font-light text-sm">9:00 AM - 2:00 PM</p>
              </div>
              <div className="p-6 bg-slate-700/20 rounded-2xl border border-slate-600/30">
                <p className="font-bold text-white mb-2 text-lg">Domingos y Festivos</p>
                <p className="text-red-400 font-light text-sm">Cerrado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
