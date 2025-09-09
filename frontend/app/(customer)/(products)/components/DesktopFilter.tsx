"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { FilterIcon, Package, RotateCcw } from "lucide-react"
import { SearchFilter } from "./filters/SearchFilter"
import { ColorFilter } from "./filters/ColorFilter"
import { CategoryFilter } from "./filters/CategoryFilter"
import { SortFilter } from "./filters/SortFilter"
import { ActiveFilters } from "./filters/ActiveFilters"
import type { FilterState } from "../types"
import React from "react"

interface Color {
  code: string
  name: string
}

interface UniqueData {
  colors: Color[]
  categories: string[]
  priceRange: { min: number; max: number }
}

interface DesktopFilterProps {
  filters: FilterState
  uniqueData: UniqueData
  activeFiltersCount: number
  products: unknown[]
  updateFilter: (key: keyof FilterState, value: unknown) => void
  handleColorToggle: (colorCode: string) => void
  handleCategoryToggle: (category: string) => void
  clearAllFilters: () => void
  getColorCount: (colorCode: string) => number
  getCategoryCount: (category: string) => number
}

export const DesktopFilter = ({
  filters,
  uniqueData,
  activeFiltersCount,
  products,
  updateFilter,
  handleColorToggle,
  handleCategoryToggle,
  clearAllFilters,
  getColorCount,
  getCategoryCount,
}: DesktopFilterProps) => {
  return (
    <div className="hidden lg:block space-y-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100 p-6 sticky top-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FilterIcon className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Filtros
          </h3>
          {activeFiltersCount > 0 && (
            <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">{activeFiltersCount}</Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Search */}
      <SearchFilter searchTerm={filters.searchTerm} onSearchChange={(value) => updateFilter("searchTerm", value)} />

      <Separator className="bg-gradient-to-r from-blue-100 to-indigo-100" />

      {/* Colors Filter */}
      <ColorFilter
        colors={uniqueData.colors}
        selectedColors={filters.selectedColors}
        onColorToggle={handleColorToggle}
        getColorCount={getColorCount}
      />

      <Separator className="bg-gradient-to-r from-blue-100 to-indigo-100" />

      {/* Categories Filter */}
      <CategoryFilter
        categories={uniqueData.categories}
        selectedCategories={filters.selectedCategories}
        onCategoryToggle={handleCategoryToggle}
        getCategoryCount={getCategoryCount}
      />

      <Separator className="bg-gradient-to-r from-blue-100 to-indigo-100" />

      {/* Stock Filter */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Package className="h-4 w-4 text-blue-600" />
          <h4 className="font-medium text-gray-900">Disponibilidad</h4>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock-desktop"
            checked={filters.inStockOnly}
            onCheckedChange={(checked) => updateFilter("inStockOnly", checked)}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-indigo-600 border-blue-300"
          />
          <label htmlFor="in-stock-desktop" className="text-sm text-gray-700 cursor-pointer">
            Solo productos en stock
          </label>
          <Badge variant="outline" className="text-xs text-gray-500 border-gray-300">
            {products.filter((p) => p.stock > 0).length}
          </Badge>
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-blue-100 to-indigo-100" />

      {/* Sort Options */}
      <SortFilter sortBy={filters.sortBy} onSortChange={(sortBy) => updateFilter("sortBy", sortBy)} />

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <>
          <Separator className="bg-gradient-to-r from-blue-100 to-indigo-100" />
          <ActiveFilters
            filters={filters}
            colors={uniqueData.colors}
            onSearchChange={(value) => updateFilter("searchTerm", value)}
            onColorToggle={handleColorToggle}
            onCategoryToggle={handleCategoryToggle}
            onStockToggle={(inStock) => updateFilter("inStockOnly", inStock)}
          />
        </>
      )}
    </div>
  )
}
