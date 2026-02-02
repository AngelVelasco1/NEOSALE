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
    <div className="space-y-4">

      <div className="relative group">
        <Input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 pr-10 border-slate-600 focus:border-slate-400 focus:ring-slate-400 bg-slate-800/70 text-white placeholder:text-slate-400 rounded-xl h-11 transition-all duration-200 group-hover:bg-slate-800/90"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 bg-slate-600/50 rounded-lg">
          <Search className="text-slate-400 h-4 w-4" />
        </div>
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSearchChange("")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-slate-600/70 rounded-lg transition-all duration-200 hover:scale-110"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-linear-to-r from-slate-400/10 to-slate-500/10 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </div>
  )
}
