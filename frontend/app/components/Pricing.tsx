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

export const Pricing= () => {
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
    <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <h2 className="text-4xl lg:text-5xl font-black leading-tight relative">
                <motion.span
                  className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-800 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  style={{
                    backgroundSize: "200% 200%",
                  }}
                >
                  Planes que se
                </motion.span>
                <br />
                <motion.span
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent relative"
                  animate={{
                    backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  style={{
                    backgroundSize: "200% 200%",
                  }}
                >
                  adaptan a ti
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-indigo-400/20 blur-xl -z-10"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [0.95, 1.05, 0.95],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                </motion.span>
              </h2>        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-center px-4 mb-16">
        
          {/* Enhanced Billing Toggle with Framer Motion */}
          <div className="flex items-center gap-6">
          

            <div className="flex items-center bg-white rounded-full p-1.5 shadow-lg border border-gray-200 relative ">
              {/* Animated Background Slider with matching gradient */}
              <motion.div
                className="absolute top-1.5 bottom-1.5 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 rounded-full shadow-lg shadow-purple-900/30"
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
                className={`relative z-10 px-6 py-2.5 rounded-full text-sm font-semibold ${
                  !isYearly ? "text-white" : "text-gray-600"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Mensual
              </motion.button>

              <motion.button
                onClick={() => setIsYearly(true)}
                className={`relative z-10 px-6 py-2.5 rounded-full text-sm font-semibold ${
                  isYearly ? "text-white" : "text-gray-600"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Anual
                <motion.span
                  className="absolute -top-2 -right-2 bg-gradient-to-r z-0 from-green-500 to-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-lg"
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
                className={`relative h-full rounded-2xl p-8 backdrop-blur-sm ${
                  plan.gradientBg
                    ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white shadow-2xl shadow-purple-500/20 border border-purple-500/20"
                    : `bg-white/80 backdrop-blur-sm ${plan.borderColor} border ${plan.shadowColor} shadow-lg ${plan.hoverShadow} ${plan.hoverBorder} hover:shadow-xl hover:bg-white`
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
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm ${
                      plan.gradientBg ? "bg-white/10 text-white border border-white/20" : plan.badgeColor
                    }`}
                  >
                    {plan.badge}
                  </span>
                </motion.div>

                {/* Animated Price */}
                <div className="mb-8">
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
                        className={`text-6xl font-black tracking-tight ${
                          plan.gradientBg ? "text-white" : "text-slate-900"
                        }`}
                      >
                        ${getPrice(plan)}
                      </motion.div>
                    </AnimatePresence>
                    <motion.span
                      className={`text-lg font-medium ${plan.gradientBg ? "text-white/70" : "text-slate-500"}`}
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
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            plan.gradientBg
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
                  className={`mb-8 leading-relaxed ${plan.gradientBg ? "text-white/90" : "text-gray-600"}`}
                >
                  {plan.description}
                </motion.p>

                {/* Divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
                  className={`w-full border-t mb-6 origin-left ${plan.gradientBg ? "border-white/30" : "border-gray-200"}`}
                />

                {/* Features */}
                <ul className="space-y-5 mb-10">
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
                        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-1 ${
                          plan.gradientBg ? "bg-white/20" : "bg-slate-100"
                        }`}
                      >
                        <Check
                          className={`w-3 h-3 stroke-[2.5] ${plan.gradientBg ? "text-white" : "text-slate-600"}`}
                        />
                      </motion.div>
                      <span
                        className={`text-base leading-relaxed ${plan.gradientBg ? "text-white/90" : "text-slate-700"}`}
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
                  transition={{ delay: index * 0.1 + 1 }}
                >
                  <Button
                    size="lg"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-slate-900/25 hover:shadow-xl hover:shadow-slate-900/40 border border-slate-800"
                    asChild
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      {plan.name === "Starter"
                        ? "Comenzar Ahora"
                        : plan.name === "Professional"
                          ? "Obtener Profesional"
                          : "Obtener Avanzado"}
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
