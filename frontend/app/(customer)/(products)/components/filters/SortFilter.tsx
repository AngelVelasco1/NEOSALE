"use client"

import { Button } from "@/components/ui/button"
import type { FilterState } from "../../types"

interface FilterSortProps {
  sortBy: FilterState["sortBy"]
  onSortChange: (sortBy: FilterState["sortBy"]) => void
}

const sortOptions = [
  { value: "name" as const, label: "Nombre A-Z" },
  { value: "price-asc" as const, label: "Precio: Menor a Mayor" },
  { value: "price-desc" as const, label: "Precio: Mayor a Menor" },
  { value: "newest" as const, label: "Más Recientes" },
]

export const SortFilter = ({ sortBy, onSortChange }: FilterSortProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="p-1.5 bg-slate-700/50 rounded-lg">
          <div className="w-2 h-2 bg-linear-to-r from-slate-400 to-slate-500 rounded-full"></div>
        </div>
        <div>
          <h4 className="font-semibold text-white text-sm">Ordenar Resultados</h4>
          <p className="text-xs text-slate-400">Organiza los productos a tu gusto</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {sortOptions.map((option) => (
          <Button
            key={option.value}
            variant={sortBy === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => onSortChange(option.value)}
            className={`h-10 rounded-xl transition-all duration-200 ${
              sortBy === option.value
                ? "bg-linear-to-r from-slate-500 to-slate-600 text-white border-0 shadow-lg shadow-slate-500/20 scale-105"
                : "border-slate-600 text-slate-300 hover:bg-slate-700/70 hover:text-white hover:border-slate-500 hover:scale-102"
            }`}
          >
            <span className="font-medium">{option.label}</span>
            {sortBy === option.value && (
              <div className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}
