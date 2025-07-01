"use client"

import React from 'react'
import { useState } from "react"
import { Filter as FilterComponent } from "./Filter"
import { Button } from "../../../components/ui/button"
import { Filter, X } from "lucide-react"
import type { IProduct } from "../types"

interface MobileFilterProps {
  products: IProduct[]
  setFilteredProducts: (products: IProduct[]) => void
}

export const MobileFilter = ({ products, setFilteredProducts }: MobileFilterProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Filter Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="lg:hidden border-blue-200 text-blue-600 hover:bg-blue-50 bg-white/70 backdrop-blur-sm"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filtros
      </Button>

      {/* Mobile Filter Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          {/* Filter Panel */}
          <div className="fixed inset-y-0 left-0 w-80 bg-gradient-to-b from-blue-50 to-indigo-50 shadow-xl overflow-y-auto">
            <div className="p-6">
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

              {/* Filter Component */}
              <FilterComponent products={products} setFilteredProducts={setFilteredProducts} />

              {/* Apply Button */}
              <div className="mt-6 pt-6 border-t border-blue-200">
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