"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import type { IProduct, FilterState, CategoryWithSubcategories } from "../../types"
import { useCategories } from "./useCategories"

export const useProductFilters = (products: IProduct[], setFilteredProducts: (products: IProduct[]) => void) => {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    selectedColors: [],
    selectedCategories: [],
    selectedSubcategories: [],
    priceRange: { min: 1, max: 5000 },
    inStockOnly: false,
    sortBy: "name",
  })

  // Get categories from the database
  const { categories: dbCategories } = useCategories()

  const uniqueData = useMemo(() => {
    const colors = Array.from(
      new Map(products.flatMap((product) => product.images).map((image) => [image?.color_code, { code: image?.color_code, name: image?.color }])).values(),
    )

    // Use database categories instead of extracting from products
    const categories = dbCategories.map(cat => ({
      id: cat.id,
      name: cat.name,
      subcategories: cat.subcategories
    })) as CategoryWithSubcategories[]

    const priceRange = products.reduce(
      (acc, product) => ({
        min: Math.min(acc.min, product.price),
        max: Math.max(acc.max, product.price),
      }),
      { min: Number.POSITIVE_INFINITY, max: 0 },
    )
    return { colors, categories, priceRange }
  }, [products, dbCategories])

  // Apply all filters
  const applyFilters = useCallback(() => {
    let filtered = [...products]

    // Search filter
    if (filters.searchTerm) {
      filtered = filtered.filter((product) => product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()))
    }

    // Color filter
    if (filters.selectedColors.length > 0) {
      filtered = filtered.filter((product) => product.images?.some((image) => filters.selectedColors.includes(image.color_code)))
    }

    // Category filter - both main categories and subcategories
    if (filters.selectedCategories.length > 0 || filters.selectedSubcategories.length > 0) {
      filtered = filtered.filter((product) => {
        // Check if product category matches selected main categories
        const matchesMainCategory = filters.selectedCategories.length === 0 || filters.selectedCategories.includes(product.category)

        // Check if product category matches any category that has selected subcategories
        const matchesSubcategory = filters.selectedSubcategories.length === 0 || (() => {
          // Find all categories that have the selected subcategories
          const categoriesWithSelectedSubs = dbCategories.filter(cat =>
            cat.subcategories.some(sub => filters.selectedSubcategories.includes(sub.name))
          )
          return categoriesWithSelectedSubs.some(cat => cat.name === product.category)
        })()

        return matchesMainCategory && matchesSubcategory
      })
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
  }, [products, filters, setFilteredProducts, dbCategories])

  // Apply filters whenever filters change
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  // Update individual filter
  const updateFilter = useCallback((key: keyof FilterState, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  // Handle color selection
  const handleColorToggle = useCallback(
    (colorCode: string) => {
      const newColors = filters.selectedColors.includes(colorCode)
        ? filters.selectedColors.filter((c) => c !== colorCode)
        : [...filters.selectedColors, colorCode]
      updateFilter("selectedColors", newColors)
    },
    [filters.selectedColors, updateFilter],
  )

  // Handle category selection
  const handleCategoryToggle = useCallback(
    (category: string) => {
      const newCategories = filters.selectedCategories.includes(category)
        ? filters.selectedCategories.filter((c) => c !== category)
        : [...filters.selectedCategories, category]
      updateFilter("selectedCategories", newCategories)
    },
    [filters.selectedCategories, updateFilter],
  )

  // Handle subcategory selection
  const handleSubcategoryToggle = useCallback(
    (subcategory: string) => {
      const newSubcategories = filters.selectedSubcategories.includes(subcategory)
        ? filters.selectedSubcategories.filter((c) => c !== subcategory)
        : [...filters.selectedSubcategories, subcategory]
      updateFilter("selectedSubcategories", newSubcategories)
    },
    [filters.selectedSubcategories, updateFilter],
  )

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters({
      searchTerm: "",
      selectedColors: [],
      selectedCategories: [],
      selectedSubcategories: [],
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
      filters.selectedSubcategories.length +
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
        product.images?.some((image) => image.color_code === colorCode)
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

  const getSubcategoryCount = useCallback(
    (subcategory: string) => {
      // Find categories that have this subcategory and count products in those categories
      const categoriesWithSubcategory = dbCategories.filter(cat =>
        cat.subcategories.some(sub => sub.name === subcategory)
      )
      return products.filter((p) =>
        categoriesWithSubcategory.some(cat => cat.name === p.category)
      ).length
    },
    [products, dbCategories],
  )

  return {
    filters,
    uniqueData,
    updateFilter,
    handleColorToggle,
    handleCategoryToggle,
    handleSubcategoryToggle,
    clearAllFilters,
    activeFiltersCount,
    getColorCount,
    getCategoryCount,
    getSubcategoryCount,
  }
}
