"use client"

import React, { useState, useEffect } from "react"
import {
  Star,
  Shield,
  Truck,
  Headphones,
  CreditCard,
  RefreshCw,
  CheckCircle,
} from "lucide-react"

export const BenefitsList = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: Star,
      title: "Calidad Premium",
      description: "Productos elaborados con materiales de primera calidad y certificaciones internacionales",
      benefits: ["Materiales duraderos", "Certificación ISO 9001", "Control de calidad estricto"],
      color: "text-blue-400",
      bgColor: "bg-blue-400/15",
      hoverColor: "hover:bg-blue-400/25",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Shield,
      title: "Garantía Completa",
      description: "Protección extendida con cobertura total por defectos de fabricación",
      benefits: ["Hasta 2 años de garantía", "Reparación gratuita", "Reemplazo inmediato"],
      color: "text-purple-400",
      bgColor: "bg-purple-400/15",
      hoverColor: "hover:bg-purple-400/25",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Truck,
      title: "Envío Express",
      description: "Entrega rápida y gratuita en todo el territorio nacional",
      benefits: ["Envío gratis desde $100K", "Entrega en 24-48h", "Rastreo en tiempo real"],
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/15",
      hoverColor: "hover:bg-cyan-400/25",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      icon: Headphones,
      title: "Soporte Premium",
      description: "Atención especializada 24/7 con respuesta inmediata",
      benefits: ["Chat en vivo", "Línea directa", "Asistencia técnica"],
      color: "text-pink-400",
      bgColor: "bg-pink-400/15",
      hoverColor: "hover:bg-pink-400/25",
      gradient: "from-pink-500 to-purple-500",
    },
    {
      icon: CreditCard,
      title: "Pago Seguro",
      description: "Múltiples métodos de pago con encriptación de nivel bancario",
      benefits: ["Pago contra entrega", "Tarjetas de crédito", "Transferencias seguras"],
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/15",
      hoverColor: "hover:bg-emerald-400/25",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: RefreshCw,
      title: "Devoluciones Fáciles",
      description: "Proceso de devolución simplificado sin complicaciones",
      benefits: ["30 días para devolver", "Recogida gratuita", "Reembolso inmediato"],
      color: "text-orange-400",
      bgColor: "bg-orange-400/15",
      hoverColor: "hover:bg-orange-400/25",
      gradient: "from-orange-500 to-red-500",
    },
  ]

  return (
    <section className="py-16  relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-6">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-medium tracking-wider uppercase">
              ¿Por qué elegirnos?
            </span>
            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Beneficios Exclusivos
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Descubre por qué miles de clientes confían en nosotros para sus compras.
            Ofrecemos una experiencia de compra excepcional con beneficios únicos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={feature.title}
                className={`group relative transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                  }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Card Background with Gradient Border */}
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 h-full hover:bg-white/10 hover:border-white/20 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-blue-500/10">
                  {/* Gradient Border Effect */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}></div>

                  {/* Icon Section */}
                  <div className="relative mb-6">
                    <div className="relative inline-flex">
                      <div
                        className={`w-20 h-20 rounded-2xl ${feature.bgColor} ${feature.hoverColor} p-5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 flex items-center justify-center`}
                      >
                        <IconComponent className={`w-full h-full ${feature.color} group-hover:scale-110 transition-transform duration-300`} />
                      </div>
                      {/* Floating particles effect */}
                      <div className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white group-hover:text-blue-200 transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                      {feature.description}
                    </p>

                    {/* Benefits List */}
                    <div className="space-y-2 pt-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <div
                          key={benefitIndex}
                          className="flex items-center gap-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
                          style={{ transitionDelay: `${benefitIndex * 50}ms` }}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.gradient} flex-shrink-0`}></div>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
