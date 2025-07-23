import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tag } from "lucide-react"

interface FilterCategoriesProps {
  categories: string[]
  selectedCategories: string[]
  onCategoryToggle: (category: string) => void
  getCategoryCount: (category: string) => number
}

export const CategoryFilter = ({
  categories,
  selectedCategories,
  onCategoryToggle,
  getCategoryCount,
}: FilterCategoriesProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Tag className="h-4 w-4 text-blue-600" />
        <h4 className="font-medium text-gray-900">Categorías</h4>
        {selectedCategories.length > 0 && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {selectedCategories.length}
          </Badge>
        )}
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category)
          const count = getCategoryCount(category)
          return (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={isSelected}
                  onCheckedChange={() => onCategoryToggle(category)}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-indigo-600 border-blue-300"
                />
                <label
                  htmlFor={`category-${category}`}
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
  )
}
