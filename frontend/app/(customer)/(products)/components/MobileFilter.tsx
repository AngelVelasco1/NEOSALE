"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { FilterIcon, Package, X } from "lucide-react"
import { SearchFilter } from "./filters/SearchFilter"
import { ColorFilter } from "./filters/ColorFilter"
import { CategoryFilter } from "./filters/CategoryFilter"
import { SortFilter } from "./filters/SortFilter"
import { ActiveFilters } from "./filters/ActiveFilters"
import { PriceFilter } from "./filters/PriceFilter"
import type { FilterState, CategoryWithSubcategories, IProduct } from "../../types"

interface Color {
  code: string
  name: string
}

interface UniqueData {
  colors: Color[]
  categories: CategoryWithSubcategories[]
  priceRange: { min: number; max: number }
}

interface MobileFilterProps {
  filters: FilterState
  uniqueData: UniqueData
  activeFiltersCount: number
  products: IProduct[]
  updateFilter: (key: keyof FilterState, value: unknown) => void
  handleColorToggle: (colorCode: string) => void
  handleCategoryToggle: (category: string) => void
  handleSubcategoryToggle: (subcategory: string) => void
  handlePriceChange: (min: number, max: number) => void
  clearAllFilters: () => void
  getColorCount: (colorCode: string) => number
  getCategoryCount: (category: string) => number
  getSubcategoryCount: (subcategory: string) => number
  getProductCountInRange: (min: number, max: number) => number
}

export const MobileFilter = ({
  filters,
  uniqueData,
  activeFiltersCount,
  products,
  updateFilter,
  handleColorToggle,
  handleCategoryToggle,
  handleSubcategoryToggle,
  handlePriceChange,
  clearAllFilters,
  getColorCount,
  getCategoryCount,
  getSubcategoryCount,
  getProductCountInRange,
}: MobileFilterProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="w-full sm:w-auto border-blue-200 text-blue-600 hover:bg-blue-50 bg-white/70 backdrop-blur-sm"
        >
          <FilterIcon className="h-4 w-4 mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">{activeFiltersCount}</Badge>
          )}
        </Button>
      </div>

      {/* Mobile Filter Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          {/* Filter Panel */}
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-gradient-to-b from-blue-50 to-indigo-50 shadow-xl overflow-y-auto">
            <div className="p-4 sm:p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  Filtros
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Filter Content */}
              <div className="space-y-6">
                {/* Search Filter */}
                <SearchFilter
                  searchTerm={filters.searchTerm}
                  onSearchChange={(value) => updateFilter("searchTerm", value)}
                />

                <Separator className="bg-gradient-to-r from-blue-100 to-indigo-100" />

                {/* Price Filter */}
                <PriceFilter
                  priceRange={uniqueData.priceRange}
                  selectedMinPrice={filters.priceRange.min}
                  selectedMaxPrice={filters.priceRange.max}
                  onPriceChange={handlePriceChange}
                  getProductCountInRange={getProductCountInRange}
                />

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
                  selectedSubcategories={filters.selectedSubcategories}
                  onCategoryToggle={handleCategoryToggle}
                  onSubcategoryToggle={handleSubcategoryToggle}
                  getCategoryCount={getCategoryCount}
                  getSubcategoryCount={getSubcategoryCount}
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
                      id="in-stock-mobile"
                      checked={filters.inStockOnly}
                      onCheckedChange={(checked) => updateFilter("inStockOnly", checked)}
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-indigo-600 border-blue-300"
                    />
                    <label htmlFor="in-stock-mobile" className="text-sm text-gray-700 cursor-pointer">
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

              <div className="mt-6 pt-6 border-t border-blue-200 space-y-3">
                {activeFiltersCount > 0 && (
                  <Button
                    variant="outline"
                    onClick={clearAllFilters}
                    className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                  >
                    Limpiar Filtros
                  </Button>
                )}
                <Button
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white"
                >
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
