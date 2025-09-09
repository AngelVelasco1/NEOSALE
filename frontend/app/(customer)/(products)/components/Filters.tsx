"use client"
import { useProductFilters } from "../hooks/useFilter"
import { DesktopFilter } from "./DesktopFilter"
import { MobileFilter } from "./MobileFilter"
import type { FilterProps } from "../types"

export const ProductFilter = ({ products, setFilteredProducts }: FilterProps) => {
  const {
    filters,
    uniqueData,
    updateFilter,
    handleColorToggle,
    handleCategoryToggle,
    clearAllFilters,
    activeFiltersCount,
    getColorCount,
    getCategoryCount,
  } = useProductFilters(products, setFilteredProducts)

  const commonProps = {
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
  }

  return (
    <>
      <MobileFilter {...commonProps} />
      <DesktopFilter {...commonProps} />
    </>
  )
}

export { DesktopFilter, MobileFilter }
