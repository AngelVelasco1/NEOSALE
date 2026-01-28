"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Settings, CheckCircle2, Shield } from "lucide-react";
import Link from "next/link";
import { useCookieConsent, CookiePreferences } from "../hooks/useCookieConsent";

export function CookieConsent() {
  const { showBanner, acceptAll, rejectAll, savePreferences, preferences } = useCookieConsent();
  const [showCustomize, setShowCustomize] = useState(false);
  const [customPreferences, setCustomPreferences] = useState<CookiePreferences>(preferences);

  if (!showBanner) return null;

  const handleCustomize = () => {
    setCustomPreferences(preferences);
    setShowCustomize(true);
  };

  const handleSaveCustom = () => {
    savePreferences(customPreferences);
    setShowCustomize(false);
  };

  const cookieTypes = [
    {
      id: "necessary" as keyof CookiePreferences,
      title: "Cookies Necesarias",
      description: "Esenciales para el funcionamiento del sitio. No se pueden desactivar.",
      icon: Shield,
      required: true,
    },
    {
      id: "functional" as keyof CookiePreferences,
      title: "Cookies Funcionales",
      description: "Mejoran la funcionalidad y personalización de tu experiencia.",
      icon: Settings,
      required: false,
    },
    {
      id: "analytics" as keyof CookiePreferences,
      title: "Cookies Analíticas",
      description: "Nos ayudan a entender cómo interactúas con el sitio para mejorarlo.",
      icon: CheckCircle2,
      required: false,
    },
    {
      id: "marketing" as keyof CookiePreferences,
      title: "Cookies de Marketing",
      description: "Utilizadas para mostrarte publicidad relevante y personalizada.",
      icon: Cookie,
      required: false,
    },
  ];

  return (
    <>
      {/* Cookie Banner */}
      <AnimatePresence>
        {!showCustomize && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
          >
            <div className="container mx-auto max-w-6xl">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
                {/* Decorative Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
                  <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl" />
                </div>

                {/* Content */}
                <div className="relative z-10 p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                    {/* Icon and Text */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 flex items-center justify-center">
                        <Cookie className="w-6 h-6 text-purple-400" />
                      </div>
                      
                      <div className="space-y-2 flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-white">
                          🍪 Usamos Cookies
                        </h3>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          Utilizamos cookies para mejorar tu experiencia, personalizar contenido y analizar nuestro tráfico. 
                          Al hacer clic en "Aceptar Todo", consientes el uso de todas las cookies.{" "}
                          <Link 
                            href="/cookies" 
                            className="text-purple-400 hover:text-purple-300 underline transition-colors"
                          >
                            Más información
                          </Link>
                        </p>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                      <button
                        onClick={handleCustomize}
                        className="px-5 py-2.5 rounded-xl border border-slate-600 hover:border-purple-500/50 text-white font-medium transition-all duration-300 hover:scale-105 hover:bg-slate-800/50 flex items-center justify-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Personalizar
                      </button>
                      
                      <button
                        onClick={rejectAll}
                        className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium transition-all duration-300 hover:scale-105"
                      >
                        Solo Necesarias
                      </button>
                      
                      <button
                        onClick={acceptAll}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/25"
                      >
                        Aceptar Todo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customize Modal */}
      <AnimatePresence>
        {showCustomize && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCustomize(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700/50 shadow-2xl"
              >
                {/* Decorative Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
                  <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Header */}
                  <div className="sticky top-0 bg-slate-900/90 backdrop-blur-sm border-b border-slate-700/50 p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 flex items-center justify-center">
                          <Settings className="w-5 h-5 text-purple-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                          Preferencias de Cookies
                        </h2>
                      </div>
                      <button
                        onClick={() => setShowCustomize(false)}
                        className="w-8 h-8 rounded-lg hover:bg-slate-700/50 flex items-center justify-center transition-colors"
                      >
                        <X className="w-5 h-5 text-slate-400" />
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-4">
                    <p className="text-slate-300 text-sm mb-6">
                      Personaliza qué tipos de cookies deseas aceptar. Las cookies necesarias siempre están activas 
                      ya que son esenciales para el funcionamiento del sitio.
                    </p>

                    {cookieTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <div
                          key={type.id}
                          className="group relative p-5 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-700/60 border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-purple-400" />
                            </div>

                            <div className="flex-1 space-y-1">
                              <h3 className="font-semibold text-white">
                                {type.title}
                              </h3>
                              <p className="text-sm text-slate-400">
                                {type.description}
                              </p>
                            </div>

                            <div className="flex-shrink-0">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={customPreferences[type.id]}
                                  disabled={type.required}
                                  onChange={(e) =>
                                    setCustomPreferences({
                                      ...customPreferences,
                                      [type.id]: e.target.checked,
                                    })
                                  }
                                  className="sr-only peer"
                                />
                                <div className={`w-11 h-6 rounded-full transition-colors ${
                                  type.required
                                    ? "bg-purple-600 cursor-not-allowed"
                                    : "bg-slate-600 peer-checked:bg-purple-600"
                                } peer-focus:ring-4 peer-focus:ring-purple-500/25`}>
                                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                                    customPreferences[type.id] ? "translate-x-5" : "translate-x-0"
                                  }`} />
                                </div>
                              </label>
                            </div>
                          </div>

                          {type.required && (
                            <div className="mt-3 flex items-center gap-2 text-xs text-purple-400">
                              <Shield className="w-3 h-3" />
                              <span>Siempre activas</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="sticky bottom-0 bg-slate-900/90 backdrop-blur-sm border-t border-slate-700/50 p-6 rounded-b-2xl">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <Link
                        href="/cookies"
                        className="text-sm text-purple-400 hover:text-purple-300 transition-colors text-center sm:text-left"
                      >
                        Más información sobre cookies
                      </Link>
                      <div className="flex-1" />
                      <button
                        onClick={() => setShowCustomize(false)}
                        className="px-5 py-2.5 rounded-xl border border-slate-600 hover:border-slate-500 text-white font-medium transition-all duration-300"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSaveCustom}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/25"
                      >
                        Guardar Preferencias
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
