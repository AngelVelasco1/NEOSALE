"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const plans = [
  {
    badge: "Básico",
    badgeColor: "bg-blue-100 text-blue-600",
    monthlyPrice: "29",
    yearlyPrice: "290", // 10 months price
    description: "Perfecto para emprendedores que inician su tienda online",
    features: [
      "Hasta 500 productos",
      "2 métodos de pago (Stripe, PayPal)",
      "Dashboard básico con métricas",
      "Gestión de clientes básica",
      "5 cupones de descuento",
      "Soporte por email",
      "SSL gratuito",
    ],
    popular: false,
    buttonStyle: "outline",
    borderColor: "border-blue-300",
    shadowColor: "shadow-blue-200/40",
    hoverShadow: "hover:shadow-blue-300/60",
    hoverBorder: "hover:border-blue-400",
  },
  {
    badge: "Profesional",
    badgeColor: "bg-purple-100 text-purple-600",
    monthlyPrice: "79",
    yearlyPrice: "790", // 10 months price
    description: "La mejor opción para negocios en crecimiento",
    features: [
      "Productos ilimitados",
      "Todas las pasarelas de pago",
      "Dashboard avanzado + Analytics",
      "CRM completo de clientes",
      "Sistema de cupones y promociones",
      "Gestión avanzada de productos y categorías",
      "Soporte prioritario 24/7",
      "Reportes y exportaciones",
    ],
    popular: true,
    buttonStyle: "filled",
    gradientBg: true,
  },
  {
    badge: "Premium",
    badgeColor: "bg-indigo-100 text-indigo-600",
    monthlyPrice: "199",
    yearlyPrice: "1990", // 10 months price
    description: "Solución avanzada para pasar al siguiente nivel",
    features: [
      "Todo lo de Professional +",
      "White-label completo",
      "Workflows automatizados",
      "CDN global y alta disponibilidad",
      "Backup automático diario",
      "Gerente de cuenta dedicado",
      "SLA 99.9% uptime",
      "Auditorías de seguridad",
      "Desarrollo de features personalizadas",
    ],
    popular: false,
    buttonStyle: "outline",
    borderColor: "border-indigo-300",
    shadowColor: "shadow-indigo-200/40",
    hoverShadow: "hover:shadow-indigo-300/60",
    hoverBorder: "hover:border-indigo-400",
  },
]

export const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false)

  const getPrice = (plan: any) => {
    return isYearly ? plan.yearlyPrice : plan.monthlyPrice
  }

  const getSavings = (monthlyPrice: string, yearlyPrice: string) => {
    const monthly = Number.parseInt(monthlyPrice)
    const yearly = Number.parseInt(yearlyPrice)
    const monthlyCost = monthly * 12
    const savings = monthlyCost - yearly
    return savings
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/2 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-6">
            <div className="w-2 h-2 bg-linear-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-medium tracking-wider uppercase">
              Planes de Precios
            </span>
            <div className="w-2 h-2 bg-linear-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse"></div>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-linear-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Planes que se
            </span>
            <br />
            <span className="bg-linear-to-r from-blue-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
              adaptan a ti
            </span>
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
            Elige el plan perfecto para tu negocio. Todos nuestros planes incluyen soporte técnico,
            actualizaciones gratuitas y la mejor experiencia de usuario.
          </p>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-center px-4 mb-16">

          {/* Enhanced Billing Toggle with Framer Motion */}
          <div className="flex items-center gap-6">


            <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full p-1.5 shadow-lg border border-white/20 relative">
              {/* Animated Background Slider with matching gradient */}
              <motion.div
                className="absolute top-1.5 bottom-1.5 bg-linear-to-br from-slate-900 via-purple-900 to-slate-800 rounded-full shadow-lg shadow-purple-900/30"
                animate={{
                  left: isYearly ? "calc(54% + 0.125rem)" : "0.375rem",
                  right: isYearly ? "0.375rem" : "calc(46% + 0.125rem)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 40,
                }}
              />

              <motion.button
                onClick={() => setIsYearly(false)}
                className={`relative z-10 px-6 py-2.5 rounded-full text-sm font-semibold ${!isYearly ? "text-gray-100" : "text-gray-300"
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Mensual
              </motion.button>

              <motion.button
                onClick={() => setIsYearly(true)}
                className={`relative z-10 px-6 py-2.5 rounded-full text-sm font-semibold ${isYearly ? "text-whitex" : "text-gray-300"
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Anual
                <motion.span
                  className="absolute -top-2 -right-2 bg-linear-to-r z-0 from-green-500 to-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-lg"
                  animate={{
                    scale: isYearly ? 1 : 0.8,
                    opacity: isYearly ? 1 : 0.7,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  -17%
                </motion.span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.badge}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: index * 0.1,
              }}
              whileHover={{
                y: -8,
                transition: { type: "spring", stiffness: 400, damping: 25 },
              }}
              className={`relative ${plan.popular ? "lg:-mt-6 lg:mb-6" : ""}`}
            >
              {/* Enhanced Card */}
              <div
                className={`relative h-full rounded-2xl p-6 backdrop-blur-sm ${plan.gradientBg
                  ? "bg-linear-to-br from-slate-900 via-purple-900 to-slate-800 text-white shadow-2xl shadow-purple-500/20 border border-purple-500/20"
                  : `bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl hover:bg-white/10 hover:border-white/20 hover:shadow-2xl`
                  }`}
              >
                {/* Badge */}
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 300 }}
                >
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm ${plan.gradientBg ? "bg-white/10 text-white border border-white/20" : "bg-white/10 text-white border border-white/20"
                      }`}
                  >
                    {plan.badge}
                  </span>
                </motion.div>

                {/* Animated Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-3">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={isYearly ? "yearly" : "monthly"}
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.8 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                          duration: 0.3,
                        }}
                        className={`text-6xl font-black tracking-tight ${plan.gradientBg ? "text-white" : "text-white"
                          }`}
                      >
                        ${getPrice(plan)}
                      </motion.div>
                    </AnimatePresence>
                    <motion.span
                      className={`text-lg font-medium ${plan.gradientBg ? "text-white/70" : "text-gray-300"}`}
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      / {isYearly ? "año" : "mes"}
                    </motion.span>
                  </div>

                  {/* Compact Animated Savings Display */}
                  <AnimatePresence>
                    {isYearly && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                          duration: 0.4,
                        }}
                        className="mt-3 flex justify-start"
                      >
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${plan.gradientBg
                            ? "bg-white/20 text-white border border-white/30"
                            : "bg-green-100 text-green-700 border border-green-200"
                            }`}
                        >
                          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                            Ahorras ${getSavings(plan.monthlyPrice, plan.yearlyPrice)} al año
                          </motion.span>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Plan Name & Description */}

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                  className={`mb-6 leading-relaxed text-sm ${plan.gradientBg ? "text-white/90" : "text-gray-300"}`}
                >
                  {plan.description}
                </motion.p>

                {/* Divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
                  className={`w-full border-t mb-6 origin-left ${plan.gradientBg ? "border-white/30" : "border-white/20"}`}
                />

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.1 + 0.6 + featureIndex * 0.05,
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      whileHover={{
                        x: 4,
                        transition: { type: "spring", stiffness: 400, damping: 25 },
                      }}
                      className="flex items-start gap-4"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-1 ${plan.gradientBg ? "bg-white/20" : "bg-white/10"
                          }`}
                      >
                        <Check
                          className={`w-3 h-3 stroke-[2.5] ${plan.gradientBg ? "text-white" : "text-slate-600"}`}
                        />
                      </motion.div>
                      <span
                        className={`text-sm leading-relaxed ${plan.gradientBg ? "text-white/90" : "text-gray-300"}`}
                      >
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.8 }}
                >
                  <Button
                    size="lg"
                    className={`w-full font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 ${plan.gradientBg
                      ? "bg-linear-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white shadow-blue-500/25 hover:shadow-blue-600/40"
                      : "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30"
                      }`}
                    asChild
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      {plan.badge === "Básico"
                        ? "Comenzar Ahora"
                        : plan.badge === "Profesional"
                          ? "Obtener Profesional"
                          : "Obtener Premium"}
                    </motion.button>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  )
}
