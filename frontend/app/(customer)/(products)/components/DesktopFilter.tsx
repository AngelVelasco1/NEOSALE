"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { FilterIcon, RotateCcw } from "lucide-react"
import { SearchFilter } from "./filters/SearchFilter"
import { ColorFilter } from "./filters/ColorFilter"
import { CategoryFilter } from "./filters/CategoryFilter"
import { SortFilter } from "./filters/SortFilter"
import { ActiveFilters } from "./filters/ActiveFilters"
import type { FilterState, CategoryWithSubcategories, IProduct } from "../../types"

import React from "react"
import { motion } from "framer-motion"
import { PriceFilter } from "./filters/PriceFilter"

interface Color {
  code: string
  name: string
}

interface UniqueData {
  colors: Color[]
  categories: CategoryWithSubcategories[]
  priceRange: { min: number; max: number }
}

interface DesktopFilterProps {
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

export const DesktopFilter = ({
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
}: DesktopFilterProps) => {

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="hidden lg:block space-y-6 bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-950/50 border border-slate-700/50 p-6 sticky top-4 ring-1 ring-slate-800/50 overflow-hidden"
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-950/5 via-transparent to-indigo-950/5 rounded-2xl pointer-events-none" />

      {/* Background gradient accent */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-purple-500/3 to-indigo-500/5 rounded-2xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="p-2 bg-linear-to-br from-slate-800 to-slate-900 rounded-lg ring-1 ring-slate-700 shadow-md"
            >
              <FilterIcon className="h-5 w-5 text-slate-300" />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                Filtros
              </h3>
              {activeFiltersCount > 0 && (
                <p className="text-xs text-slate-500">{activeFiltersCount} activos</p>
              )}
            </div>
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-9 px-3 transition-colors"
              style={{
                color: `var(--color-primary)`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `rgba(var(--color-primary-rgb), 0.1)`;
                e.currentTarget.style.color = `var(--color-primary)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `transparent`;
                e.currentTarget.style.color = `var(--color-primary)`;
              }}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Limpiar
            </Button>
          )}
        </div>

        {/* Search */}
        <SearchFilter searchTerm={filters.searchTerm} onSearchChange={(value) => updateFilter("searchTerm", value)} />

        <Separator className="bg-slate-800" />

        {/* Price Filter */}
        <PriceFilter
          priceRange={uniqueData.priceRange}
          selectedMinPrice={filters.priceRange.min}
          selectedMaxPrice={filters.priceRange.max}
          onPriceChange={handlePriceChange}
          getProductCountInRange={getProductCountInRange}
        />

        <Separator className="bg-slate-800" />

        {/* Colors Filter */}
        <ColorFilter
          colors={uniqueData.colors}
          selectedColors={filters.selectedColors}
          onColorToggle={handleColorToggle}
          getColorCount={getColorCount}
        />

        <Separator className="bg-slate-800" />

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

        <Separator className="bg-slate-800" />



        <Separator className="bg-slate-800" />

        {/* Sort Options */}
        <SortFilter sortBy={filters.sortBy} onSortChange={(sortBy) => updateFilter("sortBy", sortBy)} />

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <>
            <Separator className="bg-slate-800" />
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

      {/* Bottom gradient accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-b-2xl opacity-80" />
    </motion.div>
  )
}
