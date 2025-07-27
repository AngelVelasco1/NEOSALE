"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export const Banner = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Fondo animado minimalista */}
      <div className="absolute inset-0">
        {/* Gradiente principal con parallax sutil */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/8 to-cyan-500/5 transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
          }}
        />

        {/* Formas geométricas elegantes */}
        <div className="absolute inset-0 opacity-60">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-float-gentle" />
          <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-tr from-purple-400/10 to-cyan-400/10 rounded-full blur-2xl animate-float-gentle-delayed" />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-cyan-400/8 to-blue-400/8 rounded-full blur-xl animate-pulse-gentle" />
        </div>

        {/* Grid sutil */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px] animate-grid-subtle" />

        {/* Partículas flotantes minimalistas */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-particle-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 pt-32 pb-20  my-auto ">
        <div className="text-center space-y-12 max-w-6xl mx-auto">
          {/* Badge flotante */}
          <div
            className={`inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full px-6 py-3 shadow-lg transition-all duration-1000 ${isLoaded ? "animate-fade-in-down opacity-100" : "opacity-0 -translate-y-5"}`}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse-soft" />
            <span className="text-gray-700 text-sm font-medium tracking-wide uppercase">
              Transforma tu negocio
            </span>
            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full animate-pulse-soft-delayed" />
          </div>

          {/* Título principal con gradientes de marca */}
          <div
            className={`space-y-6 transition-all duration-1000 delay-200 ${isLoaded ? "animate-fade-in-up opacity-100" : "opacity-0 translate-y-5"}`}
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-none">
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-gradient-x">
                  NEO
                </span>
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl -z-10 animate-glow-soft" />
              </span>
              <span className="relative inline-block ml-4">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient-x-reverse">
                  SALE
                </span>
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl -z-10 animate-glow-soft-delayed" />
              </span>
            </h1>

            {/* Decoración elegante */}
            <div className="flex items-center justify-center gap-4 animate-fade-in">
              <div className="h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent w-24 animate-expand" />
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-spin-slow" />
              <div className="h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent w-24 animate-expand-delayed" />
            </div>
          </div>

          {/* Descripción con glassmorphism */}
         

          {/* Botones CTA modernos */}
          <div
            className={`space-y-8 pt-8 transition-all duration-1000 delay-600 ${isLoaded ? "animate-fade-in-up opacity-100" : "opacity-0 translate-y-5"}`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button
                size="lg"
                className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white border-0 px-10 py-6 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 animate-button-float"
              >
                <span className="relative z-10">COMENZAR AHORA</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="group bg-white/80 backdrop-blur-sm border-gray-300 text-gray-700 hover:bg-white hover:border-blue-400 hover:text-blue-600 px-10 py-6 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg animate-button-float-delayed"
              >
                <span>Ver Demo</span>
                <div className="ml-2 transition-transform group-hover:translate-x-1">→</div>
              </Button>
            </div>

            {/* Estadísticas elegantes */}
            <div className="flex items-center justify-center gap-12 pt-8">
              <div className="text-center animate-counter-fade">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  10K+
                </div>
                <div className="text-gray-500 text-sm">Usuarios activos</div>
              </div>
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
              <div className="text-center animate-counter-fade-delayed">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  99.9%
                </div>
                <div className="text-gray-500 text-sm">Uptime</div>
              </div>
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
              <div className="text-center animate-counter-fade-delayed-2">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  24/7
                </div>
                <div className="text-gray-500 text-sm">Soporte</div>
              </div>
            </div>
          </div>

          {/* Indicador de scroll minimalista */}
          <div
            className={`pt-16 transition-all duration-1000 delay-800 ${isLoaded ? "animate-fade-in opacity-100" : "opacity-0"}`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="text-gray-400 text-sm">Descubre más</div>
              <div className="w-5 h-8 border-2 border-gray-300 rounded-full flex justify-center">
                <div className="w-0.5 h-2 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mt-1.5 animate-scroll-bounce" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS optimizado para animaciones suaves */}
      <style jsx>{`
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes float-gentle-delayed {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(15px) translateX(-10px); }
        }
        @keyframes pulse-gentle {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        @keyframes grid-subtle {
          0% { transform: translate(0, 0); }
          100% { transform: translate(30px, 30px); }
        }
        @keyframes particle-float {
          0%, 100% { transform: translateY(0px); opacity: 0.3; }
          50% { transform: translateY(-60px); opacity: 0.8; }
        }
        @keyframes fade-in-down {
          0% { transform: translateY(-20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade-in-up {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade-in-scale {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes gradient-x-reverse {
          0%, 100% { background-position: 100% 50%; }
          50% { background-position: 0% 50%; }
        }
        @keyframes glow-soft {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes glow-soft-delayed {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes expand {
          0% { width: 0; }
          100% { width: 6rem; }
        }
        @keyframes expand-delayed {
          0% { width: 0; }
          100% { width: 6rem; }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes button-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes button-float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes counter-fade {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes counter-fade-delayed {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes counter-fade-delayed-2 {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes scroll-bounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(8px); opacity: 0.5; }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes pulse-soft-delayed {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .animate-float-gentle { animation: float-gentle 8s ease-in-out infinite; }
        .animate-float-gentle-delayed { animation: float-gentle-delayed 10s ease-in-out infinite; }
        .animate-pulse-gentle { animation: pulse-gentle 6s ease-in-out infinite; }
        .animate-grid-subtle { animation: grid-subtle 30s linear infinite; }
        .animate-particle-float { animation: particle-float 6s ease-in-out infinite; }
        .animate-fade-in-down { animation: fade-in-down 1s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; }
        .animate-fade-in-scale { animation: fade-in-scale 1s ease-out forwards; }
        .animate-fade-in { animation: fade-in 1s ease-out forwards 0.4s; }
        .animate-gradient-x { animation: gradient-x 8s ease infinite; background-size: 200% 200%; }
        .animate-gradient-x-reverse { animation: gradient-x-reverse 8s ease infinite; background-size: 200% 200%; }
        .animate-glow-soft { animation: glow-soft 3s ease-in-out infinite; }
        .animate-glow-soft-delayed { animation: glow-soft-delayed 3s ease-in-out infinite 1s; }
        .animate-expand { animation: expand 1s ease-out forwards 0.6s; }
        .animate-expand-delayed { animation: expand-delayed 1s ease-out forwards 0.8s; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-button-float { animation: button-float 4s ease-in-out infinite; }
        .animate-button-float-delayed { animation: button-float-delayed 4s ease-in-out infinite 0.5s; }
        .animate-counter-fade { animation: counter-fade 1s ease-out forwards 1s; }
        .animate-counter-fade-delayed { animation: counter-fade-delayed 1s ease-out forwards 1.2s; }
        .animate-counter-fade-delayed-2 { animation: counter-fade-delayed-2 1s ease-out forwards 1.4s; }
        .animate-scroll-bounce { animation: scroll-bounce 2s ease-in-out infinite; }
        .animate-pulse-soft { animation: pulse-soft 2s ease-in-out infinite; }
        .animate-pulse-soft-delayed { animation: pulse-soft-delayed 2s ease-in-out infinite 0.3s; }
      `}</style>
    </section>
  )
}