"use client"

import { Button } from "@/components/ui/button"
import { Check, Star, Zap, Crown } from "lucide-react"
import { useEffect, useState } from "react"

const plans = [
  {
    name: "Básico",
    price: "9",
    period: "mes",
    description: "Perfecto para empezar tu transformación digital",
    icon: Star,
    features: [
      "Hasta 1,000 usuarios",
      "5GB de almacenamiento",
      "Soporte por email",
      "Dashboard básico",
      "Integraciones básicas",
      "SSL incluido",
    ],
    popular: false,
    gradient: "from-blue-500 to-cyan-500",
    darkGradient: "dark:from-blue-400 dark:to-cyan-400",
    bgGradient: "from-blue-50 to-cyan-50",
    darkBgGradient: "dark:from-blue-950/20 dark:to-cyan-950/20",
  },
  {
    name: "Pro",
    price: "29",
    period: "mes",
    description: "La elección inteligente para empresas en crecimiento",
    icon: Zap,
    features: [
      "Hasta 10,000 usuarios",
      "50GB de almacenamiento",
      "Soporte prioritario 24/7",
      "Dashboard avanzado",
      "Todas las integraciones",
      "API completa",
      "Analytics avanzados",
      "Backup automático",
    ],
    popular: true,
    gradient: "from-purple-500 to-pink-500",
    darkGradient: "dark:from-purple-400 dark:to-pink-400",
    bgGradient: "from-purple-50 to-pink-50",
    darkBgGradient: "dark:from-purple-950/20 dark:to-pink-950/20",
  },
  {
    name: "Premium",
    price: "99",
    period: "mes",
    description: "Solución empresarial completa sin límites",
    icon: Crown,
    features: [
      "Usuarios ilimitados",
      "Almacenamiento ilimitado",
      "Soporte dedicado",
      "Dashboard personalizable",
      "Integraciones personalizadas",
      "API sin límites",
      "Analytics empresariales",
      "Backup en tiempo real",
      "Consultoría incluida",
      "SLA garantizado",
    ],
    popular: false,
    gradient: "from-cyan-500 to-blue-500",
    darkGradient: "dark:from-cyan-400 dark:to-blue-400",
    bgGradient: "from-cyan-50 to-blue-50",
    darkBgGradient: "dark:from-cyan-950/20 dark:to-blue-950/20",
  },
]

export const Pricing = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-24">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-60 dark:opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-blue-400/20 dark:from-purple-500/20 dark:to-blue-500/15 rounded-full blur-3xl animate-float-gentle" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tr from-cyan-400/25 to-pink-400/20 dark:from-cyan-500/15 dark:to-pink-500/10 rounded-full blur-2xl animate-float-gentle-delayed" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(99,179,237,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(99,179,237,0.02)_1px,transparent_1px)] bg-[size:60px_60px] animate-grid-drift" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div
            className={`inline-flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/50 rounded-full px-6 py-3 shadow-lg dark:shadow-2xl dark:shadow-black/40 mb-8 transition-all duration-1000 ${
              isLoaded ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-400 dark:to-blue-400 rounded-full animate-pulse-soft" />
            <span className="text-slate-600 dark:text-slate-300 text-sm font-medium tracking-wide">
              PLANES Y PRECIOS
            </span>
          </div>

          <div
            className={`space-y-6 transition-all duration-1200 delay-300 ${
              isLoaded ? "animate-fade-up opacity-100" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent animate-gradient-shift">
                Elige tu Plan
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Transforma tu negocio con la solución perfecta para tus necesidades. Todos los planes incluyen soporte
              técnico y actualizaciones gratuitas.
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.name}
                className={`relative group transition-all duration-700 delay-${index * 200} ${
                  isLoaded ? "animate-scale-up opacity-100" : "opacity-0 scale-95"
                } ${plan.popular ? "lg:-mt-8 lg:mb-8" : ""}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse-glow">
                      MÁS POPULAR
                    </div>
                  </div>
                )}

                {/* Card */}
                <div
                  className={`relative h-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-2 ${
                    plan.popular
                      ? "border-purple-200 dark:border-purple-500/30 shadow-2xl shadow-purple-500/20 dark:shadow-purple-500/30"
                      : "border-slate-200/60 dark:border-slate-700/50 shadow-xl dark:shadow-black/20"
                  } rounded-3xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl group-hover:border-opacity-100 overflow-hidden`}
                >
                  {/* Background Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${plan.bgGradient} ${plan.darkBgGradient} opacity-50 dark:opacity-20 transition-opacity duration-500 group-hover:opacity-70 dark:group-hover:opacity-30`}
                  />

                  {/* Animated Border */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-border-flow" />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${plan.gradient} ${plan.darkGradient} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>

                    {/* Description */}
                    <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">{plan.description}</p>

                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-slate-900 dark:text-white">${plan.price}</span>
                        <span className="text-slate-600 dark:text-slate-400 font-medium">/{plan.period}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 w-5 h-5 bg-gradient-to-r ${plan.gradient} ${plan.darkGradient} rounded-full flex items-center justify-center mt-0.5`}
                          >
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Button
                      size="lg"
                      className={`w-full group/btn relative overflow-hidden ${
                        plan.popular
                          ? `bg-gradient-to-r ${plan.gradient} ${plan.darkGradient} hover:shadow-2xl hover:shadow-purple-500/30 dark:hover:shadow-purple-500/40`
                          : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100"
                      } text-white font-bold py-4 rounded-2xl transition-all duration-500 hover:scale-105 shadow-lg`}
                    >
                      <span className="relative z-10">{plan.popular ? "Comenzar Ahora" : "Seleccionar Plan"}</span>

                      {/* Button Effects */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 dark:from-white/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 animate-shimmer-sweep" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/15 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 skew-x-12" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div
          className={`text-center mt-20 transition-all duration-1500 delay-1000 ${
            isLoaded ? "animate-fade-up opacity-100" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            ¿Necesitas algo personalizado? Contáctanos para una solución a medida.
          </p>
          <Button
            variant="outline"
            size="lg"
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 px-8 py-4 rounded-2xl transition-all duration-400 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Contactar Ventas
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33% { transform: translateY(-20px) translateX(10px) rotate(1deg); }
          66% { transform: translateY(10px) translateX(-15px) rotate(-1deg); }
        }
        @keyframes float-gentle-delayed {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33% { transform: translateY(15px) translateX(-10px) rotate(-1deg); }
          66% { transform: translateY(-25px) translateX(20px) rotate(1deg); }
        }
        @keyframes grid-drift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(30px, 30px); }
        }
        @keyframes slide-up {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade-up {
          0% { transform: translateY(40px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes scale-up {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.4); }
          50% { box-shadow: 0 0 30px rgba(168, 85, 247, 0.6); }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes border-flow {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        @keyframes shimmer-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-float-gentle { animation: float-gentle 8s ease-in-out infinite; }
        .animate-float-gentle-delayed { animation: float-gentle-delayed 10s ease-in-out infinite; }
        .animate-grid-drift { animation: grid-drift 20s linear infinite; }
        .animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
        .animate-fade-up { animation: fade-up 1s ease-out forwards; }
        .animate-scale-up { animation: scale-up 0.8s ease-out forwards; }
        .animate-pulse-soft { animation: pulse-soft 2s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-gradient-shift { 
          animation: gradient-shift 3s ease infinite; 
          background-size: 200% 200%; 
        }
        .animate-border-flow { animation: border-flow 2s ease-in-out infinite; }
        .animate-shimmer-sweep { animation: shimmer-sweep 1.5s ease-in-out infinite; }

        .delay-0 { animation-delay: 0ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-400 { animation-delay: 400ms; }
      `}</style>
    </section>
  )
}
