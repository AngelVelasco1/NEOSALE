"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, X } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CustomerFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);

    params.set("page", "1");
    params.set("limit", searchParams.get("limit") || "10");
    router.push(`/customers?${params.toString()}`);
  };

  const handleReset = () => {
    setSearch("");
    router.push("/customers");
  };

  const hasActiveFilters = search.trim() !== "";

  return (
    <Card className="mb-6 p-5 border border-slate-200/60 dark:border-slate-700/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50 rounded-xl">
      <form onSubmit={handleFilter} className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          {hasActiveFilters && (
            <Badge className="ml-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs">
              Activo
            </Badge>
          )}
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Buscar por nombre, teléfono o email..."
              className="h-10 pl-9 pr-3 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1 h-10 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-all duration-200"
            >
              <Filter className="h-3.5 w-3.5 mr-1.5" />
              Aplicar
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 px-4 rounded-lg text-sm transition-all duration-200"
              onClick={handleReset}
              disabled={!hasActiveFilters}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Activos:
            </span>
            <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs">
              <Search className="h-3 w-3 mr-1" />
              {search}
            </Badge>
          </div>
        )}
      </form>
    </Card>
  );
}
