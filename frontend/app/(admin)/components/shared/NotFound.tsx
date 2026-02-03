"use client";

import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";
import { useUserSafe } from "@/app/(auth)/hooks/useUserSafe";

import Typography from "../ui/typography";
import React from "react";

export function NotFound({ page = "Page" }: { page?: string }) {
    const { userProfile, isLoading } = useUserSafe();
    const isAdmin = userProfile?.role === "admin";
  

  return (
    <div className="relative w-full py-16 sm:py-20 w-full h-screen min-h-screen grid place-items-center px-4 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      
      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="flex flex-col text-center items-center space-y-8">
          {/* 404 Number with gradient */}
          <div className="relative">
            <Typography
              variant="h1"
              className="text-[120px] sm:text-[180px] md:text-[220px] font-black leading-none bg-gradient-to-br from-blue-500 via-cyan-400 to-purple-500 bg-clip-text text-transparent opacity-30 select-none"
            >
              404
            </Typography>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-blue-500/30 via-cyan-500/20 to-purple-500/30 border border-blue-400/40 backdrop-blur-md flex items-center justify-center shadow-2xl shadow-blue-500/20">
                <Search className="w-16 h-16 sm:w-20 sm:h-20 text-cyan-300" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-3 -mt-4">
            <h3
              className="text-3xl min-[360px]:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent pb-2 overflow-visible"
            >
              {page} No Encontrada
            </h3>
            
            <Typography
              component="p"
              className="text-base md:text-lg text-slate-300 max-w-md mx-auto leading-relaxed"
            >
              Lo sentimos, la página que buscas no existe o ha sido movida.
            </Typography>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {!isLoading && (
              <Link
                href={isAdmin ? "/dashboard" : "/"}
                className="group relative px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-blue-500/40 hover:shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                {isAdmin ? "Ir al Dashboard" : "Ir a la tienda"}
              </Link>
            )}
     
            <button
              onClick={() => window.history.back()}
              className="group px-6 py-3 rounded-lg bg-slate-800/70 text-slate-100 font-semibold border border-slate-600/60 hover:bg-slate-700/70 hover:border-cyan-500/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Volver Atrás
            </button>
          </div>

          {/* Additional help text */}
          <div className="pt-8 border-t border-slate-700/60">
            <Typography
              component="p"
              className="text-sm text-slate-400"
            >
              Si crees que esto es un error, por favor contacta al soporte.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
