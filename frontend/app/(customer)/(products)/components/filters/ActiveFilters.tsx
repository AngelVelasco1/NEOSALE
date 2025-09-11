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
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900">Filtros Activos</h4>
      <div className="flex flex-wrap gap-2">
        {filters.searchTerm && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {'Búsqueda: "'}
            {filters.searchTerm}
            {'"'}
            <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => onSearchChange("")} />
          </Badge>
        )}
        {filters.selectedColors.map((colorCode) => {
          const colorName = colors.find((c) => c.code === colorCode)?.name
          return (
            <Badge key={colorCode} variant="secondary" className="bg-blue-100 text-blue-700">
              {colorName}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => onColorToggle(colorCode)} />
            </Badge>
          )
        })}
        {filters.selectedCategories.map((category) => (
          <Badge key={category} variant="secondary" className="bg-blue-100 text-blue-700">
            {category}
            <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => onCategoryToggle(category)} />
          </Badge>
        ))}
        {filters.inStockOnly && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            En Stock
            <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => onStockToggle(false)} />
          </Badge>
        )}
      </div>
    </div>
  )
}
