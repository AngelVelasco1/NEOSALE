"use client"

import React, { useState, useEffect } from "react"
import {
  Star,
  Shield,
  Truck,
  Headphones,
} from "lucide-react"

export const BenefitsList = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: Star,
      title: "Alta Calidad",
      description: "Productos elaborados con los mejores materiales",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      hoverColor: "hover:bg-blue-500/20",
    },
    {
      icon: Shield,
      title: "Garantía Extendida",
      description: "Protección por más de 1 mes",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      hoverColor: "hover:bg-purple-500/20",
    },
    {
      icon: Truck,
      title: "Envío Gratis",
      description: "En compras superiores a 100K COP",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      hoverColor: "hover:bg-cyan-500/20",
    },
    {
      icon: Headphones,
      title: "Soporte 24/7",
      description: "Atención dedicada cuando la necesites",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      hoverColor: "hover:bg-pink-500/20",
    },
  ]

  return (
    <section className="py-10 bg-gradient-to-b from-white via-gray-50/30 to-white">
      <div className="container mx-auto px-4">
    

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={feature.title}
                className={`group text-center transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative mb-6">
                  <div
                    className={`w-16 h-16 mx-auto rounded-2xl ${feature.bgColor} ${feature.hoverColor} p-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}
                  >
                    <IconComponent className={`w-full h-full ${feature.color}`} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}