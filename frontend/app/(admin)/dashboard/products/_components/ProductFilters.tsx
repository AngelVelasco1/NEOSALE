"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  X,
  DollarSign,
  Tag,
  ShieldCheck,
  Package,
  Layers
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import FetchDropdownContainer from "@/app/(admin)/components/shared/FetchDropdownContainer";

import { fetchCategoriesDropdown } from "@/app/(admin)/services/categories";
import { fetchBrandsDropdown } from "@/app/(admin)/services/brands";

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estado local para el input de búsqueda y rangos
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [minPriceValue, setMinPriceValue] = useState(searchParams.get("minPrice") || "");
  const [maxPriceValue, setMaxPriceValue] = useState(searchParams.get("maxPrice") || "");
  const [minStockValue, setMinStockValue] = useState(searchParams.get("minStock") || "");
  const [maxStockValue, setMaxStockValue] = useState(searchParams.get("maxStock") || "");

  // Estado sincronizado con URL
  const currentFilters = {
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "all",
    brand: searchParams.get("brand") || "all",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    publishedFilter: searchParams.get("published") || "all",
    stockFilter: searchParams.get("status") || "all",
    minStock: searchParams.get("minStock") || "",
    maxStock: searchParams.get("maxStock") || "",
  };

  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useQuery({
    queryKey: ["categories", "dropdown"],
    queryFn: () => fetchCategoriesDropdown(),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: brands,
    isLoading: isLoadingBrands,
    isError: isErrorBrands,
  } = useQuery({
    queryKey: ["brands", "dropdown"],
    queryFn: () => fetchBrandsDropdown(),
    staleTime: 5 * 60 * 1000,
  });

  // Función para aplicar filtros automáticamente
  const applyFilters = useCallback((newFilters: Record<string, string>) => {
    const params = new URLSearchParams();

    // Búsqueda
    if (newFilters.search) {
      params.set("search", newFilters.search);
    }

    // Categoría
    if (newFilters.category && newFilters.category !== "all") {
      params.set("category", newFilters.category);
    }

    // Marca
    if (newFilters.brand && newFilters.brand !== "all") {
      params.set("brand", newFilters.brand);
    }

    // Rango de precio
    if (newFilters.minPrice) {
      params.set("minPrice", newFilters.minPrice);
    }
    if (newFilters.maxPrice) {
      params.set("maxPrice", newFilters.maxPrice);
    }

    // Filtro de publicación
    if (newFilters.publishedFilter && newFilters.publishedFilter !== "all") {
      params.set("published", newFilters.publishedFilter);
    }

    // Filtro de stock (disponibilidad binaria)
    if (newFilters.stockFilter && newFilters.stockFilter !== "all") {
      params.set("status", newFilters.stockFilter);
    }

    // Rango de stock numérico
    if (newFilters.minStock) {
      params.set("minStock", newFilters.minStock);
    }
    if (newFilters.maxStock) {
      params.set("maxStock", newFilters.maxStock);
    }

    // Mantener paginación
    params.set("page", "1");
    params.set("limit", searchParams.get("limit") || "10");

    router.push(`/dashboard/products?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  // Debounce para búsqueda - se ejecuta solo cuando cambia searchValue
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters({ ...currentFilters, search: searchValue });
    }, 800); // 800ms de retraso después de dejar de escribir

    return () => clearTimeout(timer);
  }, [searchValue]); // Solo depende de searchValue

  // Debounce para rangos de precio
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters({ ...currentFilters, minPrice: minPriceValue, maxPrice: maxPriceValue });
    }, 800);

    return () => clearTimeout(timer);
  }, [minPriceValue, maxPriceValue]);

  // Debounce para rangos de stock
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters({ ...currentFilters, minStock: minStockValue, maxStock: maxStockValue });
    }, 800);

    return () => clearTimeout(timer);
  }, [minStockValue, maxStockValue]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleCategoryChange = (value: string) => {
    applyFilters({ ...currentFilters, category: value });
  };

  const handleBrandChange = (value: string) => {
    applyFilters({ ...currentFilters, brand: value });
  };

  const handleMinPriceChange = (value: string) => {
    setMinPriceValue(value);
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPriceValue(value);
  };

  const handlePublishedFilter = (value: string) => {
    applyFilters({ ...currentFilters, publishedFilter: value });
  };

  const handleStockFilter = (value: string) => {
    applyFilters({ ...currentFilters, stockFilter: value });
  };

  const handleMinStockChange = (value: string) => {
    setMinStockValue(value);
  };

  const handleMaxStockChange = (value: string) => {
    setMaxStockValue(value);
  };

  const hasActiveFilters =
    currentFilters.search ||
    currentFilters.category !== "all" ||
    currentFilters.brand !== "all" ||
    currentFilters.minPrice ||
    currentFilters.maxPrice ||
    currentFilters.publishedFilter !== "all" ||
    currentFilters.stockFilter !== "all" ||
    currentFilters.minStock ||
    currentFilters.maxStock;

  return (
    <Card className="mb-8 overflow-hidden border-0 bg-linear-to-br from-white via-slate-50 to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/30 backdrop-blur-sm">


      <div className="px-6 py-4 space-y-5">
        {/* Grid principal de filtros - Búsqueda + Selectores principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-5">
          {/* Búsqueda - ocupa más espacio */}
          <div className="lg:col-span-4 space-y-2.5 gap-x-4">
            <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30">
                <Search className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              Búsqueda
            </Label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                type="search"
                placeholder="Nombre, descripción o SKU..."
                className="h-12 pl-12 pr-12 text-base bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600 transition-all shadow-sm hover:shadow-md"
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              {searchValue && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-700 dark:hover:text-slate-200 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-around gap-2 flex-wrap">
            {/* Categoría */}
            <div className="lg:col-span-1 space-y-2.5">
              <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <div className="block p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/30">
                  <Tag className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                </div>
                Categoría
              </Label>
              <Select value={currentFilters.category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="h-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-purple-300 dark:hover:border-purple-700 transition-colors shadow-sm">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-xl">
                  <FetchDropdownContainer
                    isLoading={isLoadingCategories}
                    isError={isErrorCategories}
                    errorMessage="Error al cargar categorías"
                  >
                    <SelectItem value="all" className="rounded-lg">Todas</SelectItem>
                    {!isLoadingCategories &&
                      !isErrorCategories &&
                      categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()} className="rounded-lg">
                          {category.name}
                        </SelectItem>
                      ))}
                  </FetchDropdownContainer>
                </SelectContent>
              </Select>
            </div>

            {/* Marca */}
            <div className="lg:col-span-1 space-y-2.5">
              <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-pink-100 dark:bg-pink-900/30">
                  <Layers className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
                </div>
                Marca
              </Label>
              <Select value={currentFilters.brand} onValueChange={handleBrandChange}>
                <SelectTrigger className="h-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-pink-300 dark:hover:border-pink-700 transition-colors shadow-sm">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-xl">
                  <FetchDropdownContainer
                    isLoading={isLoadingBrands}
                    isError={isErrorBrands}
                    errorMessage="Error al cargar marcas"
                  >
                    <SelectItem value="all" className="rounded-lg">Todas</SelectItem>
                    {!isLoadingBrands &&
                      !isErrorBrands &&
                      brands?.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id.toString()} className="rounded-lg">
                          {brand.name}
                        </SelectItem>
                      ))}
                  </FetchDropdownContainer>
                </SelectContent>
              </Select>
            </div>

            {/* Publicación */}
            <div className="lg:col-span-1 space-y-2.5">
              <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                Activo
              </Label>
              <Select value={currentFilters.publishedFilter} onValueChange={handlePublishedFilter}>
                <SelectTrigger className="h-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 transition-colors shadow-sm">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-xl">
                  <SelectItem value="all" className="rounded-lg">Todos</SelectItem>
                  <SelectItem value="true" className="rounded-lg">Activos</SelectItem>
                  <SelectItem value="false" className="rounded-lg">Desactivados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Disponibilidad */}
            <div className="lg:col-span-1 space-y-2.5">
              <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-orange-100 dark:bg-orange-900/30">
                  <Package className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                </div>
                Stock
              </Label>
              <Select value={currentFilters.stockFilter} onValueChange={handleStockFilter}>
                <SelectTrigger className="h-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-orange-300 dark:hover:border-orange-700 transition-colors shadow-sm">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-xl">
                  <SelectItem value="all" className="rounded-lg">Todos</SelectItem>
                  <SelectItem value="selling" className="rounded-lg">Con Stock</SelectItem>
                  <SelectItem value="out-of-stock" className="rounded-lg">Agotados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

        </div>

        <Separator className="dark:bg-slate-700/50" />

        {/* Grid secundario - Rangos numéricos */}
        <div className="flex justify-between flex-wrap px-3">
          {/* Precio Mínimo */}
          <div className="flex justify-around gap-2 flex-wrap lg:gap-4">
            <div className="space-y-2.5">
              <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30">
                  <DollarSign className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                </div>
                Min $
              </Label>
              <Input
                type="number"
                placeholder="1000"
                min="0"
                className="h-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
                value={minPriceValue}
                onChange={(e) => handleMinPriceChange(e.target.value)}
              />
            </div>

            {/* Precio Máximo */}
            <div className="space-y-2.5">
              <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30">
                  <DollarSign className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                </div>
                Max $
              </Label>
              <Input
                type="number"
                placeholder="50000"
                min="0"
                className="h-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
                value={maxPriceValue}
                onChange={(e) => handleMaxPriceChange(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-around gap-2 flex-wrap lg:gap-4">
            <div className="space-y-2.5">
              <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-orange-100 dark:bg-orange-900/30">
                  <Package className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                </div>
                Min Stock
              </Label>
              <Input
                type="number"
                placeholder="10"
                min="0"
                className="h-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                value={minStockValue}
                onChange={(e) => handleMinStockChange(e.target.value)}
              />
            </div>

            {/* Stock Máximo */}
            <div className="space-y-2.5">
              <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-orange-100 dark:bg-orange-900/30">
                  <Package className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                </div>
                Max Stock
              </Label>
              <Input
                type="number"
                placeholder="1000"
                min="0"
                className="h-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                value={maxStockValue}
                onChange={(e) => handleMaxStockChange(e.target.value)}
              />
            </div>
          </div>
          {/* Stock Mínimo */}

        </div>

        {/* Filtros activos mejorados */}
        {hasActiveFilters && (
          <>
            <Separator className="dark:bg-slate-700/50" />
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  Filtros Activos:
                </span>
                {currentFilters.search && (
                  <Badge
                    variant="secondary"
                    className="gap-1.5 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors pl-2 pr-1.5 py-1.5 border border-blue-200 dark:border-blue-800"
                    onClick={() => handleSearchChange("")}
                  >
                    <Search className="h-3.5 w-3.5" />
                    <span className="font-medium">{currentFilters.search}</span>
                    <div className="ml-1 p-0.5 rounded-sm hover:bg-blue-200 dark:hover:bg-blue-800">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.category !== "all" && (
                  <Badge
                    variant="secondary"
                    className="gap-1.5 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors pl-2 pr-1.5 py-1.5 border border-purple-200 dark:border-purple-800"
                    onClick={() => handleCategoryChange("all")}
                  >
                    <Tag className="h-3.5 w-3.5" />
                    <span className="font-medium">{categories?.find(c => c.id.toString() === currentFilters.category)?.name}</span>
                    <div className="ml-1 p-0.5 rounded-sm hover:bg-purple-200 dark:hover:bg-purple-800">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.brand !== "all" && (
                  <Badge
                    variant="secondary"
                    className="gap-1.5 cursor-pointer hover:bg-pink-100 dark:hover:bg-pink-900/40 transition-colors pl-2 pr-1.5 py-1.5 border border-pink-200 dark:border-pink-800"
                    onClick={() => handleBrandChange("all")}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span className="font-medium">{brands?.find(b => b.id.toString() === currentFilters.brand)?.name}</span>
                    <div className="ml-1 p-0.5 rounded-sm hover:bg-pink-200 dark:hover:bg-pink-800">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.minPrice && (
                  <Badge
                    variant="secondary"
                    className="gap-1.5 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors pl-2 pr-1.5 py-1.5 border border-green-200 dark:border-green-800"
                    onClick={() => handleMinPriceChange("")}
                  >
                    <DollarSign className="h-3.5 w-3.5" />
                    <span className="font-medium">Min: ${parseInt(currentFilters.minPrice).toLocaleString()}</span>
                    <div className="ml-1 p-0.5 rounded-sm hover:bg-green-200 dark:hover:bg-green-800">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.maxPrice && (
                  <Badge
                    variant="secondary"
                    className="gap-1.5 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors pl-2 pr-1.5 py-1.5 border border-green-200 dark:border-green-800"
                    onClick={() => handleMaxPriceChange("")}
                  >
                    <DollarSign className="h-3.5 w-3.5" />
                    <span className="font-medium">Max: ${parseInt(currentFilters.maxPrice).toLocaleString()}</span>
                    <div className="ml-1 p-0.5 rounded-sm hover:bg-green-200 dark:hover:bg-green-800">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.publishedFilter !== "all" && (
                  <Badge
                    variant="secondary"
                    className="gap-1.5 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors pl-2 pr-1.5 py-1.5 border border-blue-200 dark:border-blue-800"
                    onClick={() => handlePublishedFilter("all")}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span className="font-medium">{currentFilters.publishedFilter === "true" ? "Publicados" : "No Publicados"}</span>
                    <div className="ml-1 p-0.5 rounded-sm hover:bg-blue-200 dark:hover:bg-blue-800">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.stockFilter !== "all" && (
                  <Badge
                    variant="secondary"
                    className="gap-1.5 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors pl-2 pr-1.5 py-1.5 border border-orange-200 dark:border-orange-800"
                    onClick={() => handleStockFilter("all")}
                  >
                    <Package className="h-3.5 w-3.5" />
                    <span className="font-medium">{currentFilters.stockFilter === "selling" ? "Con Stock" : "Agotados"}</span>
                    <div className="ml-1 p-0.5 rounded-sm hover:bg-orange-200 dark:hover:bg-orange-800">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.minStock && (
                  <Badge
                    variant="secondary"
                    className="gap-1.5 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors pl-2 pr-1.5 py-1.5 border border-orange-200 dark:border-orange-800"
                    onClick={() => handleMinStockChange("")}
                  >
                    <Package className="h-3.5 w-3.5" />
                    <span className="font-medium">Stock Min: {currentFilters.minStock}</span>
                    <div className="ml-1 p-0.5 rounded-sm hover:bg-orange-200 dark:hover:bg-orange-800">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.maxStock && (
                  <Badge
                    variant="secondary"
                    className="gap-1.5 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors pl-2 pr-1.5 py-1.5 border border-orange-200 dark:border-orange-800"
                    onClick={() => handleMaxStockChange("")}
                  >
                    <Package className="h-3.5 w-3.5" />
                    <span className="font-medium">Stock Max: {currentFilters.maxStock}</span>
                    <div className="ml-1 p-0.5 rounded-sm hover:bg-orange-200 dark:hover:bg-orange-800">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
