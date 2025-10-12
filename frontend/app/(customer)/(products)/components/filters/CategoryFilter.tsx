import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tag, ChevronDown, ChevronRight, ExternalLink } from "lucide-react"

interface CategoryWithSubcategories {
  id: number;
  name: string;
  subcategories: {
    id: number;
    name: string;
  }[];
}

interface FilterCategoriesProps {
  categories: CategoryWithSubcategories[]
  selectedCategories: string[]
  selectedSubcategories: string[]
  onCategoryToggle: (category: string) => void
  onSubcategoryToggle: (subcategory: string) => void
  getCategoryCount: (category: string) => number
  getSubcategoryCount: (subcategory: string) => number
}

export const CategoryFilter = ({
  categories,
  selectedCategories,
  selectedSubcategories,
  onCategoryToggle,
  onSubcategoryToggle,
  getCategoryCount,
  getSubcategoryCount,
}: FilterCategoriesProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set())
  const router = useRouter()

  const toggleCategory = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const navigateToCategory = (categoryName: string) => {
    const slug = categoryName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/gi, "")
      .replace(/\s+/g, "-");
    router.push(`/categoria/${slug}`)
  }

  const navigateToSubcategory = (subcategoryName: string) => {
    const slug = subcategoryName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/gi, "")
      .replace(/\s+/g, "-");
    router.push(`/categoria/${slug}`)
  }

  const totalSelectedFilters = selectedCategories.length + selectedSubcategories.length

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Tag className="h-4 w-4 text-blue-600" />
        <h4 className="font-medium text-gray-900">Categorías</h4>
        {totalSelectedFilters > 0 && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {totalSelectedFilters}
          </Badge>
        )}
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.name)
          const isExpanded = expandedCategories.has(category.id)
          const count = getCategoryCount(category.name)
          const hasSubcategories = category.subcategories.length > 0

          return (
            <div key={category.id} className="space-y-1">
              {/* Categoría principal */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-1">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={isSelected}
                    onCheckedChange={() => onCategoryToggle(category.name)}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-indigo-600 border-blue-300"
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="text-sm text-gray-700 cursor-pointer hover:text-blue-600 transition-colors flex-1"
                  >
                    {category.name}
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateToCategory(category.name)}
                    className="h-6 w-6 p-0 hover:bg-blue-100"
                    title={`Ver productos de ${category.name}`}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                  {hasSubcategories && (
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="p-1 hover:bg-gray-100 rounded-sm transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-3 w-3 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-3 w-3 text-gray-500" />
                      )}
                    </button>
                  )}
                </div>
                <Badge variant="outline" className="text-xs text-gray-500 border-gray-300 ml-2">
                  {count}
                </Badge>
              </div>

              {/* Subcategorías */}
              {hasSubcategories && isExpanded && (
                <div className="space-y-1 ml-6 border-l border-gray-200 pl-3">
                  {category.subcategories.map((subcategory) => {
                    const isSubSelected = selectedSubcategories.includes(subcategory.name)
                    const subCount = getSubcategoryCount(subcategory.name)

                    return (
                      <div key={subcategory.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 flex-1">
                          <Checkbox
                            id={`subcategory-${subcategory.id}`}
                            checked={isSubSelected}
                            onCheckedChange={() => onSubcategoryToggle(subcategory.name)}
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-indigo-600 border-blue-300 h-3 w-3"
                          />
                          <label
                            htmlFor={`subcategory-${subcategory.id}`}
                            className="text-xs text-gray-600 cursor-pointer hover:text-blue-600 transition-colors flex-1"
                          >
                            {subcategory.name}
                          </label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigateToSubcategory(subcategory.name)}
                            className="h-5 w-5 p-0 hover:bg-blue-100"
                            title={`Ver productos de ${subcategory.name}`}
                          >
                            <ExternalLink className="h-2.5 w-2.5" />
                          </Button>
                        </div>
                        <Badge variant="outline" className="text-xs text-gray-400 border-gray-200 ml-2">
                          {subCount}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
