"use client"

import { Badge } from "@/components/ui/badge"
import { Palette } from "lucide-react"

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
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Palette className="h-4 w-4 text-blue-600" />
        <h4 className="font-medium text-gray-900">Colores</h4>
        {selectedColors.length > 0 && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {selectedColors.length}
          </Badge>
        )}
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {colors.map(({ code, name }, index) => {
          const isSelected = selectedColors.includes(code)
          const count = getColorCount(code)
          return (
            <div key={`${index}-${code}-${name}`} className="flex flex-col items-center space-y-1">
              <button
                onClick={() => onColorToggle(code)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition-all duration-200 border-2 ${
                  isSelected
                    ? "border-blue-500 ring-2 ring-blue-200 scale-110"
                    : "border-gray-200 hover:border-blue-300 hover:scale-105"
                } shadow-sm`}
                style={{ backgroundColor: code }}
                title={name}
                aria-label={`Filter by color ${name}`}
              />
              <div className="text-center">
                <span className="text-xs text-gray-600 block truncate w-10 sm:w-12" title={name}>
                  {name}
                </span>
                <span className="text-xs text-gray-400">({count})</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}