"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface FilterSearchProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

export const SearchFilter = ({ searchTerm, onSearchChange }: FilterSearchProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-blue-600" />
        <h4 className="font-medium text-gray-900">Buscar</h4>
      </div>
      <div className="relative">
        <Input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-gradient-to-r from-blue-50/30 to-indigo-50/30"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSearchChange("")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  )
}
