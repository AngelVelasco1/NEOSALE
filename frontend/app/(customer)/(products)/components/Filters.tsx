"use client"
import React from "react"
import { useProductFilters } from "../hooks/useFilter"
import { DesktopFilter } from "./DesktopFilter"
import { MobileFilter } from "./MobileFilter"
import type { FilterProps } from "../../types"

export const ProductFilter = ({ products, setFilteredProducts }: FilterProps) => {
  const {
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
  } = useProductFilters(products, setFilteredProducts)

  const commonProps = {
    filters,
    uniqueData,
    activeFiltersCount,
    products,
    updateFilter,
    handleColorToggle,
    handleCategoryToggle,
    handleSubcategoryToggle,
    clearAllFilters,
    getColorCount,
    getCategoryCount,
    getSubcategoryCount,
  }

  return (
    <>
      <MobileFilter {...commonProps} />
      <DesktopFilter {...commonProps} />
    </>
  )
}

export { DesktopFilter, MobileFilter }
