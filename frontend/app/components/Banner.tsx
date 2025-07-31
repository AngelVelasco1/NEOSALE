"use client"

import { Button } from "@/components/ui/button"
import React,{ useEffect, useState } from "react"

export const Banner = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)

  }, [])

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Fondo animado con efectos más notables */}
      <div className="absolute inset-0">
        {/* Gradiente principal con parallax más pronunciado */}
        <div
          className="absolute inset-0  transition-transform duration-700 ease-out"
         
        />

        {/* Formas geométricas con animaciones más dinámicas */}
        <div className="absolute inset-0 opacity-70">
          <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-400/15 to-purple-400/15 rounded-full blur-3xl animate-float-dynamic" />
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-tr from-purple-400/15 to-cyan-400/15 rounded-full blur-2xl animate-float-spiral" />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-gradient-to-r from-cyan-400/12 to-blue-400/12 rounded-full blur-xl animate-pulse-intense" />
          <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-lg animate-bounce-float" />
        </div>

        {/* Grid con movimiento más visible */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:80px_80px] animate-grid-flow" />

        {/* Partículas flotantes más grandes y visibles */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-400/40 to-purple-400/40 rounded-full animate-particle-dance"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Ondas de energía */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-400/5 to-transparent animate-wave-energy" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-transparent via-purple-400/5 to-transparent animate-wave-energy-reverse" />
        </div>
      </div>

      {/* Contenido principal con animaciones mejoradas */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 pt-32 pb-20 my-auto">
        <div className="text-center space-y-12 max-w-6xl mx-auto">
          {/* Badge flotante con efecto más dramático */}
          <div
            className={`inline-flex items-center gap-3 bg-white/90 backdrop-blur-md border border-gray-200/60 rounded-full px-8 py-4 shadow-xl transition-all duration-1200 ${
              isLoaded ? "animate-slide-bounce opacity-100" : "opacity-0 -translate-y-10"
            }`}
          >
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse-glow" />
            <span className="text-gray-700 text-sm font-semibold tracking-wider uppercase animate-text-shimmer">
              Transforma tu negocio
            </span>
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full animate-pulse-glow-delayed" />
          </div>

          <div
            className={`space-y-6 transition-all duration-1000 delay-300 ${
              isLoaded ? "animate-scale-bounce opacity-100" : "opacity-0 scale-90"
            }`}
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-normal leading-none">
              <span className="relative inline-block animate-text-reveal-left">
                <span className="bg-gradient-to-r animate-text-bounce from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-gradient-wave">
                  NEO
                </span>
                <div className="absolute -inset-3 bg-gradient-to-r from-blue-500/40 to-purple-500/40 blur-2xl -z-10 animate-glow-pulse" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shine-sweep" />
              </span>
              <span className="relative inline-block animate-text-bounce ml-4 animate-text-reveal-right">
                <span className="bg-gradient-to-r  from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent animate-gradient-wave-reverse">
                  $ALE
                </span>
                <div className="absolute -inset-3 bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-2xl -z-10 animate-glow-pulse-delayed" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shine-sweep-delayed" />
              </span>
            </h1>

            {/* Decoración con animaciones más dinámicas */}
            <div className="flex items-center justify-center gap-6 animate-fade-in-scale">
              <div className="h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent w-32 animate-expand-pulse" />
              <div className="relative">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-spin-wobble" />
                <div className="absolute inset-0 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm animate-pulse-intense" />
                <div className="absolute -inset-3 w-10 h-10 border-2 border-blue-400/30 rounded-full animate-ping-slow" />
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent w-32 animate-expand-pulse-delayed" />
            </div>
          </div>

          {/* Botones CTA con efectos más llamativos */}
          <div
            className={`space-y-8 pt-4 transition-all duration-1200 delay-600 ${
              isLoaded ? "animate-slide-up-bounce opacity-100" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button
                size="lg"
                className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white border-0 px-12 py-7 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:shadow-blue-500/30 transition-all duration-500 hover:scale-110 animate-button-float-intense overflow-hidden"
              >
                <span className="relative z-10 animate-text-bounce">COMENZAR AHORA</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer-wave" />
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-40 group-hover:opacity-70 transition-opacity duration-500 animate-glow-rotate" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="group bg-white/90 backdrop-blur-md border-2 border-gray-300 text-gray-700 hover:bg-white hover:border-blue-500 hover:text-blue-600 px-12 py-7 text-lg font-semibold rounded-2xl transition-all duration-400 hover:scale-105 shadow-xl hover:shadow-2xl animate-button-float-intense-delayed"
              >
                <span className="animate-text-bounce-delayed">Ver Demo</span>
                <div className="ml-2 transition-transform group-hover:translate-x-2 animate-arrow-dance">→</div>
              </Button>
            </div>

            {/* Estadísticas con animaciones de contador */}
            <div className="flex items-center justify-center gap-16 pt-10">
              <div className="text-center animate-counter-up-bounce">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-number-pulse">
                  10K+
                </div>
                <div className="text-gray-500 text-sm font-medium animate-fade-in-delayed">Usuarios activos</div>
              </div>
              <div className="w-px h-10 bg-gradient-to-b from-transparent via-gray-400 to-transparent animate-line-glow" />
              <div className="text-center animate-counter-up-bounce-delayed">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent animate-number-pulse-delayed">
                  99.9%
                </div>
                <div className="text-gray-500 text-sm font-medium animate-fade-in-delayed-2">Uptime</div>
              </div>
              <div className="w-px h-10 bg-gradient-to-b from-transparent via-gray-400 to-transparent animate-line-glow-delayed" />
              <div className="text-center animate-counter-up-bounce-delayed-2">
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent animate-number-pulse-delayed-2">
                  24/7
                </div>
                <div className="text-gray-500 text-sm font-medium animate-fade-in-delayed-3">Soporte</div>
              </div>
            </div>
          </div>

          {/* Indicador de scroll con animación más llamativa */}
          <div
            className={`pt-16 transition-all duration-1500 delay-1000 ${
              isLoaded ? "animate-bounce-in-scale opacity-100" : "opacity-0 scale-90"
            }`}
          >
            <div className="flex flex-col items-center gap-4 animate-float-gentle-intense">
              <div className="text-gray-400 text-sm font-medium animate-text-pulse">Descubre más</div>
              <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center animate-border-pulse-glow">
                <div className="w-1 h-3 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mt-2 animate-scroll-indicator-bounce" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS mejorado con animaciones más dinámicas */}
      <style jsx>{`
        @keyframes float-dynamic {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          25% { transform: translateY(-40px) translateX(20px) rotate(5deg); }
          50% { transform: translateY(-20px) translateX(-30px) rotate(-3deg); }
          75% { transform: translateY(30px) translateX(15px) rotate(2deg); }
        }
        @keyframes float-spiral {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          25% { transform: translateY(-30px) translateX(30px) rotate(90deg); }
          50% { transform: translateY(0px) translateX(60px) rotate(180deg); }
          75% { transform: translateY(30px) translateX(30px) rotate(270deg); }
          100% { transform: translateY(0px) translateX(0px) rotate(360deg); }
        }
        @keyframes pulse-intense {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.3); opacity: 1; }
        }
        @keyframes bounce-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          25% { transform: translateY(-20px) scale(1.1); }
          50% { transform: translateY(-10px) scale(0.9); }
          75% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes grid-flow {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(40px, 40px) rotate(1deg); }
        }
        @keyframes particle-dance {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.4; }
          25% { transform: translateY(-80px) translateX(40px) scale(1.2); opacity: 0.8; }
          50% { transform: translateY(-40px) translateX(-60px) scale(0.8); opacity: 1; }
          75% { transform: translateY(-120px) translateX(20px) scale(1.1); opacity: 0.6; }
        }
        @keyframes wave-energy {
          0% { transform: translateX(-100%) scaleY(1); }
          50% { transform: translateX(0%) scaleY(1.2); }
          100% { transform: translateX(100%) scaleY(1); }
        }
        @keyframes wave-energy-reverse {
          0% { transform: translateX(100%) scaleY(1); }
          50% { transform: translateX(0%) scaleY(1.2); }
          100% { transform: translateX(-100%) scaleY(1); }
        }
        @keyframes slide-bounce {
          0% { transform: translateY(-30px); opacity: 0; }
          60% { transform: translateY(5px); opacity: 0.8; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes scale-bounce {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes text-reveal-left {
          0% { transform: translateX(-50px) rotateY(-90deg); opacity: 0; }
          100% { transform: translateX(0) rotateY(0deg); opacity: 1; }
        }
        @keyframes text-reveal-right {
          0% { transform: translateX(50px) rotateY(90deg); opacity: 0; }
          100% { transform: translateX(0) rotateY(0deg); opacity: 1; }
        }
        @keyframes gradient-wave {
          0%, 100% { background-position: 0% 50%; filter: hue-rotate(0deg); }
          50% { background-position: 100% 50%; filter: hue-rotate(30deg); }
        }
        @keyframes gradient-wave-reverse {
          0%, 100% { background-position: 100% 50%; filter: hue-rotate(0deg); }
          50% { background-position: 0% 50%; filter: hue-rotate(-30deg); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes glow-pulse-delayed {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        @keyframes shine-sweep {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(300%) skewX(-12deg); }
        }
        @keyframes shine-sweep-delayed {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(300%) skewX(-12deg); }
        }
        @keyframes expand-pulse {
          0% { width: 0; opacity: 0; }
          50% { width: 8rem; opacity: 1; }
          100% { width: 8rem; opacity: 0.6; }
        }
        @keyframes expand-pulse-delayed {
          0% { width: 0; opacity: 0; }
          50% { width: 8rem; opacity: 1; }
          100% { width: 8rem; opacity: 0.6; }
        }
        @keyframes spin-wobble {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(90deg) scale(1.2); }
          50% { transform: rotate(180deg) scale(0.8); }
          75% { transform: rotate(270deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes slide-up-bounce {
          0% { transform: translateY(40px); opacity: 0; }
          60% { transform: translateY(-10px); opacity: 0.8; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes button-float-intense {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-8px) scale(1.02); }
        }
        @keyframes button-float-intense-delayed {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-6px) scale(1.02); }
        }
        @keyframes text-bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
        @keyframes title-bounce {
          0%, 100% { transform: translateY(10px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes text-bounce-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
        @keyframes shimmer-wave {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes glow-rotate {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes arrow-dance {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(5px) rotate(5deg); }
        }
        @keyframes counter-up-bounce {
          0% { transform: translateY(30px) scale(0.8); opacity: 0; }
          60% { transform: translateY(-5px) scale(1.1); opacity: 0.8; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes counter-up-bounce-delayed {
          0% { transform: translateY(30px) scale(0.8); opacity: 0; }
          60% { transform: translateY(-5px) scale(1.1); opacity: 0.8; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes counter-up-bounce-delayed-2 {
          0% { transform: translateY(30px) scale(0.8); opacity: 0; }
          60% { transform: translateY(-5px) scale(1.1); opacity: 0.8; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes number-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes number-pulse-delayed {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes number-pulse-delayed-2 {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes line-glow {
          0%, 100% { opacity: 0.3; box-shadow: 0 0 0 rgba(59, 130, 246, 0); }
          50% { opacity: 1; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
        }
        @keyframes line-glow-delayed {
          0%, 100% { opacity: 0.3; box-shadow: 0 0 0 rgba(59, 130, 246, 0); }
          50% { opacity: 1; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
        }
        @keyframes bounce-in-scale {
          0% { transform: translateY(20px) scale(0.8); opacity: 0; }
          50% { transform: translateY(-10px) scale(1.1); opacity: 0.7; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes float-gentle-intense {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes text-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes border-pulse-glow {
          0%, 100% { border-color: rgb(156, 163, 175); box-shadow: 0 0 0 rgba(59, 130, 246, 0); }
          50% { border-color: rgb(59, 130, 246); box-shadow: 0 0 15px rgba(59, 130, 246, 0.3); }
        }
        @keyframes scroll-indicator-bounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(12px); opacity: 0.3; }
        }
        @keyframes text-shimmer {
          0%, 100% { background-position: -200% center; }
          50% { background-position: 200% center; }
        }
        @keyframes fade-in-scale {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fade-in-delayed {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes fade-in-delayed-2 {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes fade-in-delayed-3 {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        .animate-float-dynamic { animation: float-dynamic 12s ease-in-out infinite; }
        .animate-float-spiral { animation: float-spiral 20s linear infinite; }
        .animate-pulse-intense { animation: pulse-intense 3s ease-in-out infinite; }
        .animate-bounce-float { animation: bounce-float 6s ease-in-out infinite; }
        .animate-grid-flow { animation: grid-flow 25s linear infinite; }
        .animate-particle-dance { animation: particle-dance 8s ease-in-out infinite; }
        .animate-wave-energy { animation: wave-energy 8s ease-in-out infinite; }
        .animate-wave-energy-reverse { animation: wave-energy-reverse 10s ease-in-out infinite; }
        .animate-slide-bounce { animation: slide-bounce 1.2s ease-out forwards; }
        .animate-scale-bounce { animation: scale-bounce 1.5s ease-out forwards; }
        .animate-text-reveal-left { animation: text-reveal-left 1.5s ease-out forwards; }
        .animate-text-reveal-right { animation: text-reveal-right 1.5s ease-out forwards 0.3s; }
        .animate-gradient-wave { animation: gradient-wave 4s ease infinite; background-size: 200% 200%; }
        .animate-gradient-wave-reverse { animation: gradient-wave-reverse 4s ease infinite; background-size: 200% 200%; }
        .animate-glow-pulse { animation: glow-pulse 2s ease-in-out infinite; }
        .animate-glow-pulse-delayed { animation: glow-pulse-delayed 2s ease-in-out infinite 0.5s; }
        .animate-shine-sweep { animation: shine-sweep 3s ease-in-out infinite; }
        .animate-shine-sweep-delayed { animation: shine-sweep-delayed 3s ease-in-out infinite 1.5s; }
        .animate-expand-pulse { animation: expand-pulse 2s ease-out forwards 0.8s; }
        .animate-expand-pulse-delayed { animation: expand-pulse-delayed 2s ease-out forwards 1s; }
        .animate-spin-wobble { animation: spin-wobble 4s ease-in-out infinite; }
        .animate-ping-slow { animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-slide-up-bounce { animation: slide-up-bounce 1.2s ease-out forwards; }
        .animate-button-float-intense { animation: button-float-intense 3s ease-in-out infinite; }
        .animate-button-float-intense-delayed { animation: button-float-intense-delayed 3s ease-in-out infinite 0.5s; }
        .animate-title-bounce { animation: title-bounce 2s ease-out infinite; }

        .animate-text-bounce { animation: text-bounce 2s ease-in-out infinite; }
        .animate-text-bounce-delayed { animation: text-bounce-delayed 2s ease-in-out infinite 0.3s; }
        .animate-shimmer-wave { animation: shimmer-wave 2s ease-in-out infinite; }
        .animate-glow-rotate { animation: glow-rotate 4s linear infinite; }
        .animate-arrow-dance { animation: arrow-dance 1.5s ease-in-out infinite; }
        .animate-counter-up-bounce { animation: counter-up-bounce 1.2s ease-out forwards 1.2s; }
        .animate-counter-up-bounce-delayed { animation: counter-up-bounce-delayed 1.2s ease-out forwards 1.4s; }
        .animate-counter-up-bounce-delayed-2 { animation: counter-up-bounce-delayed-2 1.2s ease-out forwards 1.6s; }
        .animate-number-pulse { animation: number-pulse 2s ease-in-out infinite 1.2s; }
        .animate-number-pulse-delayed { animation: number-pulse-delayed 2s ease-in-out infinite 1.4s; }
        .animate-number-pulse-delayed-2 { animation: number-pulse-delayed-2 2s ease-in-out infinite 1.6s; }
        .animate-line-glow { animation: line-glow 3s ease-in-out infinite 1.3s; }
        .animate-line-glow-delayed { animation: line-glow-delayed 3s ease-in-out infinite 1.5s; }
        .animate-bounce-in-scale { animation: bounce-in-scale 1.5s ease-out forwards; }
        .animate-float-gentle-intense { animation: float-gentle-intense 4s ease-in-out infinite; }
        .animate-text-pulse { animation: text-pulse 3s ease-in-out infinite; }
        .animate-border-pulse-glow { animation: border-pulse-glow 2s ease-in-out infinite; }
        .animate-scroll-indicator-bounce { animation: scroll-indicator-bounce 2s ease-in-out infinite; }
        .animate-text-shimmer { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent); background-size: 200% 100%; animation: text-shimmer 3s ease-in-out infinite; }
        .animate-fade-in-scale { animation: fade-in-scale 1s ease-out forwards 0.6s; }
        .animate-fade-in-delayed { animation: fade-in-delayed 1s ease-out forwards 1.3s; }
        .animate-fade-in-delayed-2 { animation: fade-in-delayed-2 1s ease-out forwards 1.5s; }
        .animate-fade-in-delayed-3 { animation: fade-in-delayed-3 1s ease-out forwards 1.7s; }
      `}</style>
    </section>
  )
}
