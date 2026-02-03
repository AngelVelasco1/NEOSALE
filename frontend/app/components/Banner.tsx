"use client";


import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useStoreSettings } from "@/app/hooks/useStoreSettings";


export const Banner = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const storeSettings = useStoreSettings();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        {/* lineare principal */}
        <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-900 to-slate-900" />

        <div className="absolute inset-0 opacity-60">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl animate-float-smooth" style={{backgroundImage: `linear-gradient(to bottom right, rgba(var(--color-primary-rgb), 0.25), rgba(var(--color-accent-rgb), 0.25))`}} />
          <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] rounded-full blur-3xl animate-float-smooth-delayed" style={{backgroundImage: `linear-gradient(to top right, rgba(var(--color-secondary-rgb), 0.2), rgba(var(--color-primary-rgb), 0.2))`}} />
          <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] rounded-full blur-2xl animate-pulse-smooth" style={{backgroundImage: `linear-gradient(to right, rgba(var(--color-primary-rgb), 0.18), rgba(var(--color-secondary-rgb), 0.18))`}} />
        </div>

        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2.5 h-2.5 rounded-full animate-particle-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 4}s`,
                backgroundImage: `linear-gradient(to right, rgba(var(--color-primary-rgb), 0.4), rgba(var(--color-secondary-rgb), 0.4))`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex min-h-screen items-center justify-center  pt-36 pb-18 my-auto">
        <div className="text-center space-y-12 max-w-6xl mx-auto">
          <div
            className={`space-y-6 transition-all duration-1000 delay-300 ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
          >
            <h1 className="text-7xl sm:text-8xl md:text-8xl lg:text-9xl xl:text-[9rem] font-black tracking-tight leading-none">
              {storeSettings?.store_name ? (
                <span className="relative inline-block">
                  <span className="bg-clip-text text-transparent bg-size-[200%_auto] animate-linear-flow" style={{backgroundImage: `linear-gradient(to right, var(--color-primary), var(--color-secondary), var(--color-primary))`}}>
                    {storeSettings.store_name}
                  </span>
                  <div className="absolute -inset-4 blur-2xl -z-10 animate-glow-smooth" style={{backgroundImage: `linear-gradient(to right, rgba(var(--color-primary-rgb), 0.5), rgba(var(--color-secondary-rgb), 0.5))`}} />
                </span>
              ) : (
                <>
                  <span className="relative inline-block">
                    <span className="bg-clip-text text-transparent bg-size-[200%_auto] animate-linear-flow" style={{backgroundImage: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`}}>
                      NEO
                    </span>
                    <div className="absolute -inset-4 blur-2xl -z-10 animate-glow-smooth" style={{backgroundImage: `linear-gradient(to right, rgba(var(--color-primary-rgb), 0.5), rgba(var(--color-secondary-rgb), 0.5))`}} />
                  </span>
                  <span className="relative inline-block ml-4">
                    <span className="bg-clip-text text-transparent bg-size-[200%_auto] animate-linear-flow-reverse" style={{backgroundImage: `linear-gradient(to right, var(--color-secondary), var(--color-accent), var(--color-primary))`}}>
                      $ALE
                    </span>
                    <div className="absolute -inset-4 blur-2xl -z-10 animate-glow-smooth-delayed" style={{backgroundImage: `linear-gradient(to right, rgba(var(--color-secondary-rgb), 0.5), rgba(var(--color-accent-rgb), 0.5))`}} />
                  </span>
                </>
              )}
            </h1>

            {/* Decoración elegante */}
            <div className="flex items-center justify-center gap-6 animate-fade-in">
              <div className="h-px w-32 animate-expand-smooth" style={{backgroundImage: `linear-gradient(to right, transparent, rgba(148, 163, 184, 0.5), transparent)`}} />
              <div className="relative">
                <div className="w-4 h-4 rounded-full animate-spin-smooth" style={{backgroundImage: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`}} />
                <div className="absolute inset-0 w-4 h-4 rounded-full blur-md animate-pulse-smooth" style={{backgroundImage: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`}} />
              </div>
              <div className="h-px w-32 animate-expand-smooth" style={{backgroundImage: `linear-gradient(to right, transparent, rgba(148, 163, 184, 0.5), transparent)`}} />
            </div>
          </div>

          {/* Botones CTA */}
          <div
            className={`space-y-8 pt-4 transition-all duration-1000 delay-500 ${isLoaded
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
              }`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button
                size="lg"
                className="group relative text-white border-0 px-12 py-7 text-lg font-bold rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden animate-button-pulse"
                style={{
                  backgroundImage: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`,
                  boxShadow: `0 25px 50px -12px rgba(var(--color-primary-rgb), 0.3)`
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.boxShadow = `0 25px 50px -12px rgba(var(--color-primary-rgb), 0.5)`;
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.boxShadow = `0 25px 50px -12px rgba(var(--color-primary-rgb), 0.3)`;
                }}
              >
                <span className="relative z-10 animate-text-shine">
                  COMENZAR AHORA
                </span>
                <div className="absolute inset-0 translate-x-full group-hover:translate-x-full transition-transform duration-700" style={{backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))`}} />
                <div className="absolute -inset-1 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-glow-pulse" style={{backgroundImage: `linear-gradient(to right, rgba(var(--color-primary-rgb), 0.2), rgba(var(--color-secondary-rgb), 0.2))`}} />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="group bg-slate-800/60 backdrop-blur-md border-2 border-slate-600/50 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500 hover:text-slate-200 px-12 py-7 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl animate-button-pulse-delayed"
              >
                <span className="animate-text-shine-delayed">Ver Demo</span>
                <span className="ml-2 transition-transform group-hover:translate-x-1 group-hover:scale-110 inline-block animate-arrow-bounce">
                  →
                </span>
              </Button>
            </div>

            <div className="flex flex-col items-center md:flex-row justify-center gap-4 md:gap-16 pt-10">
              <div className="text-center animate-fade-in-up animate-stat-bounce">
                <div className="text-4xl font-bold bg-clip-text text-transparent" style={{backgroundImage: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`}}>
                  10K+
                </div>
                <div className="text-slate-400 text-sm font-medium mt-1">
                  Usuarios activos
                </div>
              </div>
              <div className="w-px h-10" style={{backgroundImage: `linear-gradient(to bottom, transparent, rgba(148, 163, 184, 0.5), transparent)`}} />
              <div
                className="text-center animate-fade-in-up animate-stat-bounce"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="text-4xl font-bold bg-clip-text text-transparent" style={{backgroundImage: `linear-gradient(to right, var(--color-secondary), var(--color-accent))`}}>
                  99.9%
                </div>
                <div className="text-slate-400 text-sm font-medium mt-1">
                  Uptime
                </div>
              </div>
              <div className="w-px h-10" style={{backgroundImage: `linear-gradient(to bottom, transparent, rgba(148, 163, 184, 0.5), transparent)`}} />
              <div
                className="text-center animate-fade-in-up animate-stat-bounce"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="text-4xl font-bold bg-clip-text text-transparent" style={{backgroundImage: `linear-gradient(to right, var(--color-accent), var(--color-primary))`}}>
                  24/7
                </div>
                <div className="text-slate-400 text-sm font-medium mt-1">
                  Soporte
                </div>
              </div>
            </div>
          </div>

          {/* Indicador de scroll */}
          <div
            className={`pt-4 transition-all duration-1000 delay-700 ${isLoaded ? "opacity-100" : "opacity-0"
              }`}
          >
            <div className="flex flex-col items-center gap-4 animate-float-gentle">
              <div className="text-slate-400 text-sm font-medium">
                Descubre más
              </div>
              <div className="w-6 h-10 border-2 rounded-full flex justify-center" style={{borderColor: `rgba(148, 163, 184, 0.5)`}}>
                <div className="w-1 h-3 rounded-full mt-2 animate-scroll-bounce" style={{backgroundImage: `linear-gradient(to bottom, var(--color-primary), var(--color-secondary))`}} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes linear-flow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes linear-flow-reverse {
          0% {
            background-position: 100% 50%;
          }
          50% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
        /* Movimiento más amplio y visible */
        @keyframes float-smooth {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-40px, -40px) scale(1.05);
          }
        }
        @keyframes float-smooth-delayed {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(40px, 40px) scale(1.05);
          }
        }
        /* Pulso más pronunciado */
        @keyframes pulse-smooth {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.3);
            opacity: 1;
          }
        }
        /* Resplandor más intenso */
        @keyframes glow-smooth {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
        @keyframes glow-smooth-delayed {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
        @keyframes grid-subtle {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(40px, 40px);
          }
        }
        /* Partículas con movimiento más amplio */
        @keyframes particle-float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-150px) translateX(80px);
            opacity: 0.8;
          }
        }
        @keyframes expand-smooth {
          0% {
            width: 0;
            opacity: 0;
          }
          100% {
            width: 8rem;
            opacity: 0.5;
          }
        }
        /* Rotación más rápida */
        @keyframes spin-smooth {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        /* Movimiento más pronunciado */
        @keyframes float-gentle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes scroll-bounce {
          0%,
          100% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(8px);
            opacity: 0.5;
          }
        }
        /* Nueva animación para estadísticas con movimiento */
        @keyframes stat-bounce {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1.05);
          }
        }
        @keyframes button-pulse {
          0%,
          100% {
            transform: translateY(0) scale(1);
            box-shadow: 0 10px 25px -5px rgba(71, 85, 105, 0.25);
          }
          50% {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 20px 40px -10px rgba(71, 85, 105, 0.4);
          }
        }
        @keyframes button-pulse-delayed {
          0%,
          100% {
            transform: translateY(0) scale(1);
            box-shadow: 0 10px 25px -5px rgba(71, 85, 105, 0.15);
          }
          50% {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 20px 40px -10px rgba(71, 85, 105, 0.3);
          }
        }
        @keyframes text-shine {
          0%,
          100% {
            background-position: -200% center;
          }
          50% {
            background-position: 200% center;
          }
        }
        @keyframes text-shine-delayed {
          0%,
          100% {
            background-position: -200% center;
          }
          50% {
            background-position: 200% center;
          }
        }
        @keyframes arrow-bounce {
          0%,
          100% {
            transform: translateX(0) rotate(0deg);
          }
          50% {
            transform: translateX(2px) rotate(2deg);
          }
        }
        @keyframes glow-pulse {
          0%,
          100% {
            opacity: 0;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }

        .animate-linear-flow {
          animation: linear-flow 4s ease infinite;
        }
        .animate-linear-flow-reverse {
          animation: linear-flow-reverse 4s ease infinite;
        }
        .animate-float-smooth {
          animation: float-smooth 15s ease-in-out infinite;
        }
        .animate-float-smooth-delayed {
          animation: float-smooth-delayed 18s ease-in-out infinite;
        }
        .animate-pulse-smooth {
          animation: pulse-smooth 3s ease-in-out infinite;
        }
        .animate-glow-smooth {
          animation: glow-smooth 2.5s ease-in-out infinite;
        }
        .animate-glow-smooth-delayed {
          animation: glow-smooth-delayed 2.5s ease-in-out infinite 0.5s;
        }
        .animate-grid-subtle {
          animation: grid-subtle 30s linear infinite;
        }
        .animate-particle-float {
          animation: particle-float 8s ease-in-out infinite;
        }
        .animate-expand-smooth {
          animation: expand-smooth 1.5s ease-out forwards 0.8s;
        }
        .animate-spin-smooth {
          animation: spin-smooth 4s linear infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards 0.6s;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards 1s;
        }
        .animate-float-gentle {
          animation: float-gentle 2.5s ease-in-out infinite;
        }
        .animate-scroll-bounce {
          animation: scroll-bounce 2s ease-in-out infinite;
        }
        .animate-stat-bounce {
          animation: stat-bounce 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};
