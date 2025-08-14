"use client"

import React, { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-14 h-7 rounded-full bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 shadow-md border border-slate-300/30 dark:border-slate-600/30" />
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="group relative w-14 h-8 rounded-full transition-all duration-300  mt-2  cursor-pointer"
      style={{
        background: theme === "dark" 
          ? "linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)"
          : "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)"
      }}
    >
      {/* Solo el switch sin iconos de fondo */}
      <div className="absolute inset-0 rounded-full shadow-lg border border-slate-300/40 dark:border-slate-600/40" />
      <div className="absolute inset-0.5 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-sm" />
      
      <div 
        className={`absolute top-0.5 w-7 h-7 rounded-full transition-all duration-500 ease-out shadow-lg ${
          theme === "dark" 
            ? "translate-x-7 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800" 
            : "translate-x-0.5 bg-gradient-to-br from-white via-slate-50 to-slate-100"
        }`}
      >
        <div className="absolute inset-0 rounded-full flex items-center justify-center">
          {theme === "dark" ? (
            <Moon className="h-4 w-4 text-slate-200 drop-shadow-sm" />
          ) : (
            <Sun className="h-4 w-4 text-amber-500 drop-shadow-sm" />
          )}
        </div>
        
      
      </div>

      {/* Efecto de hover */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/0 via-blue-400/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  )
}