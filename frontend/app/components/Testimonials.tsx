import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import Image from 'next/image';

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const testimonials = [
    {
      id: 1,
      name: "María González",
      role: "Empresaria",
      company: "TechStart Solutions",
      rating: 5,
      text: "NEOSALE ha revolucionado mi forma de hacer compras online. La calidad premium y el servicio al cliente son excepcionales. Cada producto supera mis expectativas.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      highlight: "Calidad Premium",
      stats: { purchases: "50+", satisfaction: "100%" }
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      role: "Desarrollador Senior",
      company: "InnovateLab",
      rating: 5,
      text: "Como desarrollador, valoro la interfaz intuitiva y la tecnología detrás de NEOSALE. Los productos tecnológicos son de vanguardia y el soporte técnico es impecable.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      highlight: "Tecnología Avanzada",
      stats: { purchases: "30+", satisfaction: "100%" }
    },
    {
      id: 3,
      name: "Ana Martínez",
      role: "Diseñadora UX/UI",
      company: "Creative Studio",
      rating: 5,
      text: "El diseño y la experiencia de usuario de NEOSALE son simplemente espectaculares. Cada interacción está pensada al detalle. Es un placer hacer compras aquí.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      highlight: "Experiencia UX",
      stats: { purchases: "40+", satisfaction: "100%" }
    },
    {
      id: 4,
      name: "Luis Fernández",
      role: "Director Médico",
      company: "HealthCare Plus",
      rating: 5,
      text: "La confiabilidad y profesionalismo de NEOSALE me han convertido en cliente fiel. Los productos médicos y el servicio son de primera categoría.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      highlight: "Confiabilidad Total",
      stats: { purchases: "25+", satisfaction: "100%" }
    },
    {
      id: 5,
      name: "Sofia Vargas",
      role: "Emprendedora Digital",
      company: "Digital Ventures",
      rating: 5,
      text: "NEOSALE no solo ofrece productos excepcionales, sino que también impulsa mi crecimiento profesional. Su plataforma es una herramienta invaluable.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      highlight: "Crecimiento Profesional",
      stats: { purchases: "60+", satisfaction: "100%" }
    },
    {
      id: 6,
      name: "Diego Morales",
      role: "Arquitecto",
      company: "Modern Spaces",
      rating: 5,
      text: "Los productos de diseño y la atención personalizada de NEOSALE han transformado mis proyectos. Calidad, estilo y servicio impecable.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      highlight: "Diseño & Estilo",
      stats: { purchases: "35+", satisfaction: "100%" }
    },
  ]

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  return (
    <section className="py-20  relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/2 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-6">
            <div className="w-2 h-2 bg-linear-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-medium tracking-wider uppercase">
              Testimonios
            </span>
            <div className="w-2 h-2 bg-linear-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse"></div>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-linear-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Historias de Éxito
            </span>
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
            Descubre cómo NEOSALE ha transformado la experiencia de compra de miles de clientes
            satisfechos en todo el mundo.
          </p>
        </div>

        {/* Featured Testimonial Carousel */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative">
            {/* Main Testimonial Card */}
            <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500 blur-xl"></div>

              {/* Navigation Buttons */}
              <Button
                variant="ghost"
                size="icon"
                onClick={prevTestimonial}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextTestimonial}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </Button>

              <div className="text-center relative z-10">
                {/* Quote Icon with Animation */}
                <div className="relative mb-4">
                  <Quote className="w-16 h-16 text-blue-400/40 mx-auto" />
                  <div className="absolute inset-0 w-16 h-16 bg-linear-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-xl md:text-2xl font-medium text-white mb-10 leading-relaxed px-8 max-w-4xl mx-auto">
                  {testimonials[currentIndex].text}
                </blockquote>

                {/* Author Info */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
                  <div className="relative">
                    <Image
                      src={testimonials[currentIndex].avatar}
                      alt={testimonials[currentIndex].name}
                      width={70}
                      height={70}
                      className="rounded-full shadow-2xl ring-4 ring-white/20"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-linear-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <Star className="w-4 h-4 text-white fill-current" />
                    </div>
                  </div>

                  <div className="text-center md:text-left">
                    <div className="text-xl font-bold text-white mb-1">{testimonials[currentIndex].name}</div>
                    <div className="text-blue-300 font-medium mb-1">{testimonials[currentIndex].role}</div>
                    <div className="text-gray-400 text-sm mb-3">{testimonials[currentIndex].company}</div>

                    {/* Rating Stars */}
                    <div className="flex justify-center md:justify-start gap-1 mb-4">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    {/* Stats */}

                  </div>
                </div>

                {/* Highlight Badge */}
                <div className="inline-flex items-center gap-2 bg-linear-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
                  <div className="w-2 h-2 bg-linear-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">{testimonials[currentIndex].highlight}</span>
                  <div className="w-2 h-2 bg-linear-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Enhanced Indicators */}
            <div className="flex justify-center mt-8 gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all duration-500 rounded-full ${index === currentIndex
                    ? "w-12 h-4 bg-linear-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/30"
                    : "w-4 h-4 bg-white/30 hover:bg-white/50 hover:scale-110"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`group relative transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Card */}
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-full hover:bg-white/10 hover:border-white/20 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-blue-500/10">
                {/* Gradient Border */}
                <div className={`absolute inset-0 rounded-2xl bg-linear-to-r ${index % 2 === 0 ? 'from-blue-500/10' : 'from-purple-500/10'} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}></div>

                {/* Rating */}
                <div className="flex justify-center mb-4">
                  <div className="flex gap-1 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-gray-200 text-center mb-6 leading-relaxed group-hover:text-white transition-colors duration-300">
                  "{testimonial.text.length > 120 ? testimonial.text.substring(0, 120) + '...' : testimonial.text}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-center gap-4">
                  <div className="relative">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={50}
                      height={50}
                      className="rounded-full shadow-lg ring-2 ring-white/20"
                    />
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-white text-sm">{testimonial.name}</div>
                    <div className="text-blue-300 text-xs font-medium">{testimonial.role}</div>
                    <div className="text-gray-400 text-xs">{testimonial.company}</div>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="text-center mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                10K+
              </div>
              <div className="text-gray-300 text-sm">Clientes Satisfechos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                99.9%
              </div>
              <div className="text-gray-300 text-sm">Índice de Satisfacción</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                50K+
              </div>
              <div className="text-gray-300 text-sm">Productos Vendidos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-linear-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <div className="text-gray-300 text-sm">Soporte Disponible</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
