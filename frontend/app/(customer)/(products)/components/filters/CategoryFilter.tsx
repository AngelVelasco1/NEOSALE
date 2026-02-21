import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag, ChevronDown, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CategoryWithSubcategories {
  id: number;
  name: string;
  subcategories: {
    id: number;
    name: string;
  }[];
}

interface FilterCategoriesProps {
  categories: CategoryWithSubcategories[];
  selectedCategories: string[];
  selectedSubcategories: string[];
  onCategoryToggle: (category: string) => void;
  onSubcategoryToggle: (subcategory: string) => void;
  getCategoryCount: (category: string) => number;
  getSubcategoryCount: (subcategory: string) => number;
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
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set()
  );
  const router = useRouter();

  const toggleCategory = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const navigateToCategory = (categoryName: string) => {
    const slug = categoryName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/gi, "")
      .replace(/\s+/g, "-");
    router.push(`/category/${slug}`);
  };

  const navigateToSubcategory = (subcategoryName: string) => {
    const slug = subcategoryName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/gi, "")
      .replace(/\s+/g, "-");
    router.push(`/category/${slug}`);
  };

  const totalSelectedFilters =
    selectedCategories.length + selectedSubcategories.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-2 bg-linear-to-br from-slate-800 to-slate-900 rounded-lg ring-1 ring-slate-700 shadow-md"
          >
            <Tag className="h-4 w-4 text-slate-300" />
          </motion.div>
          <div>
            <h4 className="font-bold text-slate-100 text-sm">Categorías</h4>
            <p className="text-xs text-slate-500">Explora por tipo</p>
          </div>
        </div>
        {totalSelectedFilters > 0 && (
          <Badge className="bg-slate-800 text-slate-200 border border-slate-700 px-2.5 py-1 font-semibold">
            {totalSelectedFilters}
          </Badge>
        )}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900 rounded-lg pr-2">
        {categories.map((category, idx) => {
          const isSelected = selectedCategories.includes(category.name);
          const isExpanded = expandedCategories.has(category.id);
          const count = getCategoryCount(category.name);
          const hasSubcategories = category.subcategories.length > 0;

          return (
            <motion.div
              key={category.id}
              className="space-y-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              {/* Categoría principal */}
              <div
                className={`flex items-center justify-between p-3 rounded-lg transition-all ${isSelected
                    ? "bg-slate-800 ring-1 ring-slate-700"
                    : "bg-slate-900/50 hover:bg-slate-800/70"
                  }`}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={isSelected}
                    onCheckedChange={() => onCategoryToggle(category.name)}
                    className="data-[state=checked]:bg-slate-700 data-[state=checked]:border-slate-600 border-slate-600 shrink-0"
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="text-sm text-slate-200 cursor-pointer hover:text-slate-100 transition-colors font-medium flex-1 truncate"
                  >
                    {category.name}
                  </label>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant="outline"
                      className="text-xs text-slate-400 border-slate-700 font-semibold"
                    >
                      {count}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateToCategory(category.name)}
                      className="h-7 w-7 p-0 hover:bg-slate-700"
                      title={`Ver ${category.name}`}
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                    </Button>
                    {hasSubcategories && (
                      <motion.button
                        onClick={() => toggleCategory(category.id)}
                        className="p-1.5 hover:bg-slate-700 rounded-md transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        </motion.div>
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>

              {/* Subcategorías */}
              <AnimatePresence>
                {hasSubcategories && isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1.5 ml-6 pl-4 border-l-2 border-slate-800 py-2"
                  >
                    {category.subcategories.map((subcategory) => {
                      const isSubSelected = selectedSubcategories.includes(
                        subcategory.name
                      );
                      const subCount = getSubcategoryCount(subcategory.name);

                      return (
                        <motion.div
                          key={subcategory.id}
                          className={`flex items-center justify-between p-2.5 rounded-lg transition-all ${isSubSelected
                              ? "bg-slate-800/80 ring-1 ring-slate-700/50"
                              : "bg-slate-900/30 hover:bg-slate-800/50"
                            }`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                            <Checkbox
                              id={`subcategory-${subcategory.id}`}
                              checked={isSubSelected}
                              onCheckedChange={() =>
                                onSubcategoryToggle(subcategory.name)
                              }
                              className="data-[state=checked]:bg-slate-700 data-[state=checked]:border-slate-600 border-slate-600 h-3.5 w-3.5 shrink-0"
                            />
                            <label
                              htmlFor={`subcategory-${subcategory.id}`}
                              className="text-xs text-slate-300 cursor-pointer hover:text-slate-200 transition-colors font-medium flex-1 truncate"
                            >
                              {subcategory.name}
                            </label>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Badge
                                variant="outline"
                                className="text-xs text-slate-500 border-slate-700 font-semibold"
                              >
                                {subCount}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  navigateToSubcategory(subcategory.name)
                                }
                                className="h-6 w-6 p-0 hover:bg-slate-700"
                                title={`Ver ${subcategory.name}`}
                              >
                                <ExternalLink className="h-3 w-3 text-slate-400" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
