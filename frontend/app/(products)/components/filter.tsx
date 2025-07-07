"use client"


import React from 'react'
import { useState, useCallback, useEffect, useMemo } from "react"
import type { IProduct } from "../types"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Checkbox } from "../../../components/ui/checkbox"
import { Badge } from "../../../components/ui/badge"
import { Separator } from "../../../components/ui/separator"
import { Search, X, FilterIcon, Package, Palette, Tag, DollarSign, RotateCcw } from "lucide-react"

interface FilterState {
  searchTerm: string
  selectedColors: string[]
  selectedCategories: string[]
  priceRange: { min: number; max: number }
  inStockOnly: boolean
  sortBy: "name" | "price-asc" | "price-desc" | "newest"
}

interface FilterProps {
  products: IProduct[]
  setFilteredProducts: (products: IProduct[]) => void
}

export const Filter = ({ products, setFilteredProducts }: FilterProps) => {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    selectedColors: [],
    selectedCategories: [],
    priceRange: { min: 1, max: 5000 },
    inStockOnly: false,
    sortBy: "name",
  })

  const uniqueData = useMemo(() => {
    const colors = Array.from(
      new Set(
        products
          .map((product) => ({ code: product.colorCode, name: product.color }))
          .filter((color) => color.code && color.name),
      ),
    )

    const categories = Array.from(new Set(products.map((product) => product.category).filter(Boolean)))

    const priceRange = products.reduce(
      (acc, product) => ({
        min: Math.min(acc.min, product.price),
        max: Math.max(acc.max, product.price),
      }),
      { min: Number.POSITIVE_INFINITY, max: 0 },
    )

    return { colors, categories, priceRange }
  }, [products])

  // Apply all filters
  const applyFilters = useCallback(() => {
    let filtered = [...products]

    // Search filter
    if (filters.searchTerm) {
      filtered = filtered.filter((product) => product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()))
    }

    // Color filter
    if (filters.selectedColors.length > 0) {
      filtered = filtered.filter((product) => filters.selectedColors.includes(product.colorCode))
    }

    // Category filter
    if (filters.selectedCategories.length > 0) {
      filtered = filtered.filter((product) => filters.selectedCategories.includes(product.category))
    }


    // Stock filter
    if (filters.inStockOnly) {
      filtered = filtered.filter((product) => product.stock > 0)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        case "newest":
          return b.id - a.id // Assuming higher ID means newer
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }, [products, filters, setFilteredProducts])

  // Apply filters whenever filters change
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  // Update individual filter
  const updateFilter = (key: keyof FilterState, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  // Handle color selection
  const handleColorToggle = (colorCode: string) => {
    const newColors = filters.selectedColors.includes(colorCode)
      ? filters.selectedColors.filter((c) => c !== colorCode)
      : [...filters.selectedColors, colorCode]
    updateFilter("selectedColors", newColors)
  }

  // Handle category selection
  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.selectedCategories.includes(category)
      ? filters.selectedCategories.filter((c) => c !== category)
      : [...filters.selectedCategories, category]
    updateFilter("selectedCategories", newCategories)
  }

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      searchTerm: "",
      selectedColors: [],
      selectedCategories: [],
      priceRange: { min: uniqueData.priceRange.min, max: uniqueData.priceRange.max },
      inStockOnly: false,
      sortBy: "name",
    })
  }

  // Count active filters
  const activeFiltersCount =
    (filters.searchTerm ? 1 : 0) +
    filters.selectedColors.length +
    filters.selectedCategories.length +
    (filters.inStockOnly ? 1 : 0) +
    (filters.priceRange.min !== uniqueData.priceRange.min || filters.priceRange.max !== uniqueData.priceRange.max
      ? 1
      : 0)

  // Get product count for each filter option
  const getColorCount = (colorCode: string) => {
    return products.filter((p) => p.colorCode === colorCode).length
  }

  const getCategoryCount = (category: string) => {
    return products.filter((p) => p.category === category).length
  }

  return (
    <div className="space-y-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100 p-6">
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
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-blue-600" />
          <h4 className="font-medium text-gray-900">Buscar</h4>
        </div>
        <div className="relative">
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={filters.searchTerm}
            onChange={(e) => updateFilter("searchTerm", e.target.value)}
            className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-gradient-to-r from-blue-50/30 to-indigo-50/30"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
          {filters.searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateFilter("searchTerm", "")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-blue-100 to-indigo-100" />

      {/* Colors Filter */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Palette className="h-4 w-4 text-blue-600" />
          <h4 className="font-medium text-gray-900">Colores</h4>
          {filters.selectedColors.length > 0 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {filters.selectedColors.length}
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {uniqueData.colors.map(({ code, name }) => {
            const isSelected = filters.selectedColors.includes(code)
            const count = getColorCount(code)

            return (
              <div key={code} className="flex flex-col items-center space-y-1">
                <button
                  onClick={() => handleColorToggle(code)}
                  className={`w-10 h-10 rounded-lg transition-all duration-200 border-2 ${
                    isSelected
                      ? "border-blue-500 ring-2 ring-blue-200 scale-110"
                      : "border-gray-200 hover:border-blue-300 hover:scale-105"
                  } shadow-sm`}
                  style={{ backgroundColor: code }}
                  title={name}
                />
                <div className="text-center">
                  <span className="text-xs text-gray-600 block truncate w-12" title={name}>
                    {name}
                  </span>
                  <span className="text-xs text-gray-400">({count})</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-blue-100 to-indigo-100" />

      {/* Categories Filter */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Tag className="h-4 w-4 text-blue-600" />
          <h4 className="font-medium text-gray-900">Categorías</h4>
          {filters.selectedCategories.length > 0 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {filters.selectedCategories.length}
            </Badge>
          )}
        </div>
        <div className="space-y-2">
          {uniqueData.categories.map((category) => {
            const isSelected = filters.selectedCategories.includes(category)
            const count = getCategoryCount(category)

            return (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={isSelected}
                    onCheckedChange={() => handleCategoryToggle(category)}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-indigo-600 border-blue-300"
                  />
                  <label
                    htmlFor={category}
                    className="text-sm text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                  >
                    {category}
                  </label>
                </div>
                <Badge variant="outline" className="text-xs text-gray-500 border-gray-300">
                  {count}
                </Badge>
              </div>
            )
          })}
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-blue-100 to-indigo-100" />
 

      <Separator className="bg-gradient-to-r from-blue-100 to-indigo-100" />

      {/* Stock Filter */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Package className="h-4 w-4 text-blue-600" />
          <h4 className="font-medium text-gray-900">Disponibilidad</h4>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={filters.inStockOnly}
            onCheckedChange={(checked) => updateFilter("inStockOnly", checked)}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-indigo-600 border-blue-300"
          />
          <label htmlFor="in-stock" className="text-sm text-gray-700 cursor-pointer">
            Solo productos en stock
          </label>
          <Badge variant="outline" className="text-xs text-gray-500 border-gray-300">
            {products.filter((p) => p.stock > 0).length}
          </Badge>
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-blue-100 to-indigo-100" />

      {/* Sort Options */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 flex items-center">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mr-2"></div>
          Ordenar por
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {[
            { value: "name", label: "Nombre A-Z" },
            { value: "price-asc", label: "Precio: Menor a Mayor" },
            { value: "price-desc", label: "Precio: Mayor a Menor" },
            { value: "newest", label: "Más Recientes" },
          ].map((option) => (
            <Button
              key={option.value}
              variant={filters.sortBy === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("sortBy", option.value)}
              className={
                filters.sortBy === option.value
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0"
                  : "border-blue-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
              }
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <>
          <Separator className="bg-gradient-to-r from-blue-100 to-indigo-100" />
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Filtros Activos</h4>
            <div className="flex flex-wrap gap-2">
              {filters.searchTerm && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Búsqueda: &quot{filters.searchTerm}&quot
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => updateFilter("searchTerm", "")} />
                </Badge>
              )}
              {filters.selectedColors.map((colorCode) => {
                const colorName = uniqueData.colors.find((c) => c.code === colorCode)?.name
                return (
                  <Badge key={colorCode} variant="secondary" className="bg-blue-100 text-blue-700">
                    {colorName}
                    <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleColorToggle(colorCode)} />
                  </Badge>
                )
              })}
              {filters.selectedCategories.map((category) => (
                <Badge key={category} variant="secondary" className="bg-blue-100 text-blue-700">
                  {category}
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleCategoryToggle(category)} />
                </Badge>
              ))}
              {filters.inStockOnly && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  En Stock
                  <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => updateFilter("inStockOnly", false)} />
                </Badge>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
