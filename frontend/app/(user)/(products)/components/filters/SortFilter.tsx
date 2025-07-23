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
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900 flex items-center">
        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mr-2"></div>
        Ordenar por
      </h4>
      <div className="grid grid-cols-1 gap-2">
        {sortOptions.map((option) => (
          <Button
            key={option.value}
            variant={sortBy === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => onSortChange(option.value)}
            className={
              sortBy === option.value
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0"
                : "border-blue-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
            }
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
