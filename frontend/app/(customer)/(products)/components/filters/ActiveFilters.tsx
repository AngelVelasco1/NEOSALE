"use client"

import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import type { FilterState } from "../../types"

interface Color {
  code: string
  name: string
}

interface FilterActiveBadgesProps {
  filters: FilterState
  colors: Color[]
  onSearchChange: (value: string) => void
  onColorToggle: (colorCode: string) => void
  onCategoryToggle: (category: string) => void
  onStockToggle: (inStock: boolean) => void
}

export const ActiveFilters = ({
  filters,
  colors,
  onSearchChange,
  onColorToggle,
  onCategoryToggle,
  onStockToggle,
}: FilterActiveBadgesProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="p-1.5 bg-slate-700/50 rounded-lg">
          <div className="w-2 h-2 bg-linear-to-r from-slate-400 to-slate-500 rounded-full"></div>
        </div>
        <div>
          <h4 className="font-semibold text-white text-sm">Filtros Aplicados</h4>
          <p className="text-xs text-slate-400">Haz clic para remover filtros</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        {filters.searchTerm && (
          <Badge variant="secondary" className="bg-linear-to-r from-slate-600 to-slate-700 text-slate-200 border-slate-500 px-3 py-1.5 rounded-full hover:bg-slate-600 transition-all duration-200 cursor-pointer group">
            <span className="font-medium">Búsqueda:</span>
            <span className="ml-1 italic">"{filters.searchTerm}"</span>
            <X className="h-3.5 w-3.5 ml-2 cursor-pointer group-hover:text-white transition-colors" onClick={() => onSearchChange("")} />
          </Badge>
        )}
        {filters.selectedColors.map((colorCode) => {
          const colorName = colors.find((c) => c.code === colorCode)?.name
          return (
            <Badge key={colorCode} variant="secondary" className="bg-linear-to-r from-slate-600 to-slate-700 text-slate-200 border-slate-500 px-3 py-1.5 rounded-full hover:bg-slate-600 transition-all duration-200 cursor-pointer group">
              <span className="font-medium">{colorName}</span>
              <X className="h-3.5 w-3.5 ml-2 cursor-pointer group-hover:text-white transition-colors" onClick={() => onColorToggle(colorCode)} />
            </Badge>
          )
        })}
        {filters.selectedCategories.map((category) => (
          <Badge key={category} variant="secondary" className="bg-linear-to-r from-slate-600 to-slate-700 text-slate-200 border-slate-500 px-3 py-1.5 rounded-full hover:bg-slate-600 transition-all duration-200 cursor-pointer group">
            <span className="font-medium">{category}</span>
            <X className="h-3.5 w-3.5 ml-2 cursor-pointer group-hover:text-white transition-colors" onClick={() => onCategoryToggle(category)} />
          </Badge>
        ))}
        {filters.inStockOnly && (
          <Badge variant="secondary" className="bg-linear-to-r from-slate-600 to-slate-700 text-slate-200 border-slate-500 px-3 py-1.5 rounded-full hover:bg-slate-600 transition-all duration-200 cursor-pointer group">
            <span className="font-medium">En Stock</span>
            <X className="h-3.5 w-3.5 ml-2 cursor-pointer group-hover:text-white transition-colors" onClick={() => onStockToggle(false)} />
          </Badge>
        )}
      </div>
    </div>
  )
}
