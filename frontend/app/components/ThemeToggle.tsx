"use client"

import React, {useEffect, useState} from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-6 right-6 z-50 bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-full p-3 shadow-lg"
      >
        <div className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="group fixed top-6 right-6 z-50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/50 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-500 group-hover:rotate-180 transition-transform duration-500" />
      ) : (
        <Moon className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:-rotate-12 transition-transform duration-500" />
      )}
    </Button>
  )
}
