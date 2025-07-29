"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import type { IProduct, FilterState } from "../types"

export const useProductFilters = (products: IProduct[], setFilteredProducts: (products: IProduct[]) => void) => {
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
      new Map(products.flatMap((product) => product.images).map((image) => [image?.color_code, {code: image?.color_code, name: image?.color}])).values(),
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
      filtered = filtered.filter((product) => product.images?.some(image => filters.selectedColors.includes(image.color_code)))
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
          return b.id - a.id
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
  const updateFilter = useCallback((key: keyof FilterState, value: unknown) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }))
  }, [])

  // Handle color selection
  const handleColorToggle = useCallback(
    (colorCode: string) => {
      const newColors = filters.selectedColors.includes(colorCode)
        ? filters.selectedColors.filter((c: any) => c !== colorCode)
        : [...filters.selectedColors, colorCode]
      updateFilter("selectedColors", newColors)
    },
    [filters.selectedColors, updateFilter],
  )

  // Handle category selection
  const handleCategoryToggle = useCallback(
    (category: string) => {
      const newCategories = filters.selectedCategories.includes(category)
        ? filters.selectedCategories.filter((c: any) => c !== category)
        : [...filters.selectedCategories, category]
      updateFilter("selectedCategories", newCategories)
    },
    [filters.selectedCategories, updateFilter],
  )

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters({
      searchTerm: "",
      selectedColors: [],
      selectedCategories: [],
      priceRange: { min: uniqueData.priceRange.min, max: uniqueData.priceRange.max },
      inStockOnly: false,
      sortBy: "name",
    })
  }, [uniqueData.priceRange])

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    return (
      (filters.searchTerm ? 1 : 0) +
      filters.selectedColors.length +
      filters.selectedCategories.length +
      (filters.inStockOnly ? 1 : 0) +
      (filters.priceRange.min !== uniqueData.priceRange.min || filters.priceRange.max !== uniqueData.priceRange.max
        ? 1
        : 0)
    )
  }, [filters, uniqueData.priceRange])

  // Get product count for each filter option
   const getColorCount = useCallback(
    (colorCode: string) => {
      return products.filter((product) => 
        product.images?.some(image => image.color_code === colorCode)
      ).length
    },
    [products],
  )
  const getCategoryCount = useCallback(
    (category: string) => {
      return products.filter((p) => p.category === category).length
    },
    [products],
  )

  return {
    filters,
    uniqueData,
    updateFilter,
    handleColorToggle,
    handleCategoryToggle,
    clearAllFilters,
    activeFiltersCount,
    getColorCount,
    getCategoryCount,
  }
}
