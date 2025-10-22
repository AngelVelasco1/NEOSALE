"use client"

import { Badge } from "@/components/ui/badge"
import { Palette } from "lucide-react"
import { motion } from "framer-motion"

interface Color {
  code: string
  name: string
}

interface FilterColorsProps {
  colors: Color[]
  selectedColors: string[]
  onColorToggle: (colorCode: string) => void
  getColorCount: (colorCode: string) => number
}

export const ColorFilter = ({ colors, selectedColors, onColorToggle, getColorCount }: FilterColorsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg ring-1 ring-slate-700 shadow-md"
          >
            <Palette className="h-4 w-4 text-slate-300" />
          </motion.div>
          <div>
            <h4 className="font-bold text-slate-100 text-sm">Colores</h4>
            <p className="text-xs text-slate-500">Filtra por color</p>
          </div>
        </div>
        {selectedColors.length > 0 && (
          <Badge className="bg-slate-800 text-slate-200 border border-slate-700 px-2.5 py-1 font-semibold">
            {selectedColors.length}
          </Badge>
        )}
      </div>
      <div className="grid grid-cols-4 gap-3">
        {colors.map(({ code, name }, index) => {
          const isSelected = selectedColors.includes(code)
          const count = getColorCount(code)
          return (
            <motion.div
              key={`${index}-${code}-${name}`}
              className="flex flex-col items-center space-y-2 group"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
            >
              <div className="relative">
                <motion.button
                  onClick={() => onColorToggle(code)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-12 h-12 rounded-xl transition-all duration-300 overflow-hidden ${isSelected
                    ? "ring-2 ring-slate-300 ring-offset-2 ring-offset-slate-950 shadow-xl scale-105"
                    : "ring-1 ring-slate-700 hover:ring-slate-500 shadow-md"
                    }`}
                  style={{ backgroundColor: code }}
                  title={name}
                  aria-label={`Filter by color ${name}`}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Check mark for selected */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </motion.button>
              </div>
              <div className="text-center space-y-0.5">
                <span className="text-xs text-slate-300 block font-medium truncate w-16" title={name}>
                  {name}
                </span>
                <span className="text-xs text-slate-600 font-medium">({count})</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
