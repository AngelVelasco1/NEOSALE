"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, X, TrendingUp, Tag } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FetchDropdownContainer from "@/app/(admin)/components/shared/FetchDropdownContainer";

import { sortToParamsMap, getSortFromParams } from "./sortParams";
import { fetchCategoriesDropdown } from "@/app/(admin)/services/categories";

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    sort: getSortFromParams(searchParams) || "",
  });

  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories", "dropdown"],
    queryFn: () => fetchCategoriesDropdown(),
    staleTime: 5 * 60 * 1000,
  });

  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.category && filters.category !== "all")
      params.set("category", filters.category);

    if (filters.sort && filters.sort !== "none") {
      const sortConfig = sortToParamsMap[filters.sort];
      if (sortConfig) {
        params.set(sortConfig.key, sortConfig.value);
      }
    }

    params.set("page", "1");
    params.set("limit", searchParams.get("limit") || "10");
    router.push(`/products?${params.toString()}`);
  };

  const handleReset = () => {
    setFilters({ search: "", category: "all", sort: "none" });
    router.push("/products");
  };

  const hasActiveFilters = filters.search || (filters.category && filters.category !== "all") || (filters.sort && filters.sort !== "none");

  return (
    <Card className="mb-6 p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-xl">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Buscar productos..."
              className="h-10 pl-9 pr-3 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all text-sm"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          {/* Category Select */}
          <div className="relative">
            <Select
              value={filters.category}
              onValueChange={(value) => setFilters({ ...filters, category: value })}
            >
              <SelectTrigger className="h-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                <div className="flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-blue-500" />
                  <SelectValue placeholder="Categoría" />
                </div>
              </SelectTrigger>

              <SelectContent className="rounded-lg border-slate-200 dark:border-slate-700">
                <FetchDropdownContainer
                  isLoading={isLoading}
                  isError={isError}
                  errorMessage="Error al cargar categorías"
                >
                  <SelectItem value="all" className="text-sm">
                    Todas las Categorías
                  </SelectItem>

                  {!isLoading &&
                    !isError &&
                    categories &&
                    categories!.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                        className="text-sm"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                </FetchDropdownContainer>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Select */}
          <div className="relative">
            <Select
              value={filters.sort}
              onValueChange={(value) => setFilters({ ...filters, sort: value })}
            >
              <SelectTrigger className="h-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5 text-purple-500" />
                  <SelectValue placeholder="Ordenar" />
                </div>
              </SelectTrigger>

              <SelectContent className="rounded-lg border-slate-200 dark:border-slate-700">
                <SelectItem value="none" className="text-sm">Sin Orden</SelectItem>

                <div className="px-2 py-1 text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                  Precio
                </div>
                <SelectItem value="lowest-first" className="text-sm">Menor a Mayor</SelectItem>
                <SelectItem value="highest-first" className="text-sm">Mayor a Menor</SelectItem>

                <div className="px-2 py-1 text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                  Estado
                </div>
                <SelectItem value="published" className="text-sm">Publicados</SelectItem>
                <SelectItem value="unpublished" className="text-sm">No Publicados</SelectItem>
                <SelectItem value="status-selling" className="text-sm">En Venta</SelectItem>
                <SelectItem value="status-out-of-stock" className="text-sm">Sin Stock</SelectItem>

                <div className="px-2 py-1 text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                  Fecha
                </div>
                <SelectItem value="date-added-asc" className="text-sm">Añadido (Asc)</SelectItem>
                <SelectItem value="date-added-desc" className="text-sm">Añadido (Desc)</SelectItem>
                <SelectItem value="date-updated-asc" className="text-sm">Actualizado (Asc)</SelectItem>
                <SelectItem value="date-updated-desc" className="text-sm">Actualizado (Desc)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            type="submit"
            className="flex-1 h-9 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-all duration-200"
          >
            <Filter className="h-3.5 w-3.5 mr-1.5" />
            Aplicar
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-9 px-4 rounded-lg text-sm transition-all duration-200"
            onClick={handleReset}
            disabled={!hasActiveFilters}
          >
            <X className="h-3.5 w-3.5 mr-1.5" />
            Limpiar
          </Button>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Activos:
            </span>
            {filters.search && (
              <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs">
                <Search className="h-3 w-3 mr-1" />
                {filters.search}
              </Badge>
            )}
            {filters.category && filters.category !== "all" && (
              <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {categories?.find(c => c.id.toString() === filters.category)?.name || filters.category}
              </Badge>
            )}
            {filters.sort && filters.sort !== "none" && (
              <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                Orden
              </Badge>
            )}
          </div>
        )}
      </form>
    </Card>
  );
}
