"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, X, DollarSign, Tag, ShieldCheck, Package, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import FetchDropdownContainer from "@/app/(admin)/components/shared/FetchDropdownContainer";
import { fetchCategoriesDropdown } from "@/app/(admin)/services/categories";
import { fetchBrandsDropdown } from "@/app/(admin)/services/brands";
BiDollar

import {
  FILTER_ACTIVE_BADGE_CLASS,
  FILTER_CARD_CLASS,
  FILTER_CHIP_ACTIVE_CLASS,
  FILTER_CHIP_CLASS,
  FILTER_INPUT_CLASS,
  FILTER_LABEL_CLASS,
  FILTER_RESET_BUTTON_CLASS,
  FILTER_SELECT_TRIGGER_CLASS,
} from "@/app/(admin)/components/shared/filters/styles";
import { BiDollar } from "react-icons/bi";

const PUBLISHED_PRESETS = [
  { label: "Activos", value: "true" },
  { label: "Pausados", value: "false" },
];

const STOCK_PRESETS = [
  { label: "Con stock", value: "selling" },
  { label: "Agotados", value: "out-of-stock" },
];

const PRICE_PRESETS = [
  { label: "Bajo < $500", max: "500" },
  { label: "Medio $500-1500", min: "500", max: "1500" },
  { label: "Premium > $1500", min: "1500" },
];

const STOCK_RANGE_PRESETS = [
  { label: "Top sellers", min: "20" },
  { label: "Nivel crítico", max: "5" },
];

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [minPriceValue, setMinPriceValue] = useState(searchParams.get("minPrice") || "");
  const [maxPriceValue, setMaxPriceValue] = useState(searchParams.get("maxPrice") || "");
  const [minStockValue, setMinStockValue] = useState(searchParams.get("minStock") || "");
  const [maxStockValue, setMaxStockValue] = useState(searchParams.get("maxStock") || "");

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
    queryFn: fetchCategoriesDropdown,
    staleTime: 10 * 60 * 1000, // 10 minutos - datos dropdown cambian poco
    gcTime: 15 * 60 * 1000, // 15 minutos en cache
  });

  const {
    data: brands,
    isLoading: isLoadingBrands,
    isError: isErrorBrands,
  } = useQuery({
    queryKey: ["brands", "dropdown"],
    queryFn: fetchBrandsDropdown,
    staleTime: 10 * 60 * 1000, // 10 minutos - datos dropdown cambian poco
    gcTime: 15 * 60 * 1000, // 15 minutos en cache
  });

  const applyFilters = useCallback(
    (newFilters: Record<string, string>) => {
      const params = new URLSearchParams();

      if (newFilters.search) params.set("search", newFilters.search);
      if (newFilters.category && newFilters.category !== "all") params.set("category", newFilters.category);
      if (newFilters.brand && newFilters.brand !== "all") params.set("brand", newFilters.brand);
      if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice);
      if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice);
      if (newFilters.publishedFilter && newFilters.publishedFilter !== "all") params.set("published", newFilters.publishedFilter);
      if (newFilters.stockFilter && newFilters.stockFilter !== "all") params.set("status", newFilters.stockFilter);
      if (newFilters.minStock) params.set("minStock", newFilters.minStock);
      if (newFilters.maxStock) params.set("maxStock", newFilters.maxStock);

      params.set("page", "1");
      params.set("limit", searchParams.get("limit") || "10");

      router.push(`/dashboard/products?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters({ ...currentFilters, search: searchValue });
    }, 800);

    return () => clearTimeout(timer);
  }, [searchValue, currentFilters, applyFilters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters({ ...currentFilters, minPrice: minPriceValue, maxPrice: maxPriceValue });
    }, 800);

    return () => clearTimeout(timer);
  }, [minPriceValue, maxPriceValue, currentFilters, applyFilters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters({ ...currentFilters, minStock: minStockValue, maxStock: maxStockValue });
    }, 800);

    return () => clearTimeout(timer);
  }, [minStockValue, maxStockValue, currentFilters, applyFilters]);

  const handleSearchChange = (value: string) => setSearchValue(value);
  const handleCategoryChange = (value: string) => applyFilters({ ...currentFilters, category: value });
  const handleBrandChange = (value: string) => applyFilters({ ...currentFilters, brand: value });
  const handleMinPriceChange = (value: string) => setMinPriceValue(value);
  const handleMaxPriceChange = (value: string) => setMaxPriceValue(value);
  const handlePublishedFilter = (value: string) => applyFilters({ ...currentFilters, publishedFilter: value });
  const handleStockFilter = (value: string) => applyFilters({ ...currentFilters, stockFilter: value });
  const handleMinStockChange = (value: string) => setMinStockValue(value);
  const handleMaxStockChange = (value: string) => setMaxStockValue(value);

  const handleQuickPublished = (value: string) => {
    const next = currentFilters.publishedFilter === value ? "all" : value;
    handlePublishedFilter(next);
  };

  const handleQuickStockStatus = (value: string) => {
    const next = currentFilters.stockFilter === value ? "all" : value;
    handleStockFilter(next);
  };

  const handleQuickPrice = (min?: string, max?: string) => {
    setMinPriceValue(min || "");
    setMaxPriceValue(max || "");

    applyFilters({ ...currentFilters, minPrice: min || "", maxPrice: max || "" });
  };

  const handleQuickStockRange = (min?: string, max?: string) => {
    setMinStockValue(min || "");
    setMaxStockValue(max || "");

    applyFilters({ ...currentFilters, minStock: min || "", maxStock: max || "" });
  };

  const handleResetFilters = () => {
    setSearchValue("");
    setMinPriceValue("");
    setMaxPriceValue("");
    setMinStockValue("");
    setMaxStockValue("");

    applyFilters({
      search: "",
      category: "all",
      brand: "all",
      minPrice: "",
      maxPrice: "",
      publishedFilter: "all",
      stockFilter: "all",
      minStock: "",
      maxStock: "",
    });
  };

  const chipClass = (isActive: boolean) =>
    isActive
      ? cn(
        FILTER_CHIP_CLASS,
        FILTER_CHIP_ACTIVE_CLASS,
        "border-transparent bg-[linear-gradient(120deg,rgba(94,234,212,0.9),rgba(59,130,246,0.95))] text-slate-950 shadow-[0_12px_30px_-12px_rgba(59,130,246,0.65)]"
      )
      : cn(
        FILTER_CHIP_CLASS,
        "border-white/15 bg-white/5 text-slate-100 backdrop-blur hover:border-cyan-200/40 hover:text-white"
      );

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
    <Card className={FILTER_CARD_CLASS}>
      <div className="space-y-2">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800/50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white shadow-md shadow-emerald-900/25">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.4),transparent_55%)]"
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute -right-6 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-emerald-400/25 blur-3xl" aria-hidden="true" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-200/70">Panel de productos</p>
                <p className="text-3xl font-semibold tracking-tight">Gestiona tu catálogo</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="min-w-[130px] rounded-2xl border border-white/20 bg-white/10 px-3 py-1.5 text-left">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-white/70">Catálogo</p>
                  <p className="text-sm font-medium text-white">{currentFilters.category !== "all" ? "Categoría" : "Todas"}</p>
                </div>
                <div className="min-w-[130px] rounded-2xl border border-white/20 bg-white/10 px-3 py-1.5 text-left">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-white/70">Estado</p>
                  <p className="text-sm font-medium text-white">{currentFilters.publishedFilter !== "all" ? "Filtrado" : "Todos"}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                className={`${FILTER_RESET_BUTTON_CLASS} text-white/95 transition-all hover:text-white cursor-pointer `}
                onClick={handleResetFilters}
              >
                Reiniciar filtros
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/70 bg-linear-to-br from-white via-slate-50 to-slate-100 p-5 shadow-sm dark:border-slate-900 dark:from-slate-950/50 dark:via-slate-900/40 dark:to-slate-950/30">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr_1fr]">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                <div className="rounded-xl bg-blue-100/70 p-1.5 dark:bg-blue-900/30">
                  <Search className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                Búsqueda avanzada
              </Label>
              <div className="relative group">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                <Input
                  type="search"
                  placeholder="Nombre, SKU o descripción..."
                  className={`${FILTER_INPUT_CLASS} h-11 pl-12 pr-12 text-base`}
                  value={searchValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
                {searchValue && (
                  <button
                    onClick={() => handleSearchChange("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 p-1 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600 dark:hover:text-slate-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                <div className="rounded-xl bg-purple-100/70 p-1.5 dark:bg-purple-900/30">
                  <Tag className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                </div>
                Categoría
              </Label>
              <div className="relative">
                <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-400 dark:text-purple-500" />
                <select
                  value={currentFilters.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  disabled={isLoadingCategories || isErrorCategories}
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200/60 bg-white/80 pl-10 pr-10 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:border-purple-400/80 hover:bg-white/90 hover:shadow-md focus:border-purple-400 focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-purple-400/30 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-purple-500/60 dark:hover:bg-slate-900/70 dark:focus:border-purple-500 dark:focus:bg-slate-900/80"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                  }}
                >
                  <option value="all">Todas las categorías</option>
                  {!isLoadingCategories &&
                    !isErrorCategories &&
                    categories?.map((category) => (
                      <option key={category.id} value={category.id.toString()}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                <div className="rounded-xl bg-pink-100/70 p-1.5 dark:bg-pink-900/30">
                  <Layers className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
                </div>
                Marca
              </Label>
              <div className="relative">
                <Layers className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pink-400 dark:text-pink-500" />
                <select
                  value={currentFilters.brand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  disabled={isLoadingBrands || isErrorBrands}
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200/60 bg-white/80 pl-10 pr-10 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:border-pink-400/80 hover:bg-white/90 hover:shadow-md focus:border-pink-400 focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-pink-400/30 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-pink-500/60 dark:hover:bg-slate-900/70 dark:focus:border-pink-500 dark:focus:bg-slate-900/80"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                  }}
                >
                  <option value="all">Todas las marcas</option>
                  {!isLoadingBrands &&
                    !isErrorBrands &&
                    brands?.map((brand) => (
                      <option key={brand.id} value={brand.id.toString()}>
                        {brand.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/92 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <div className="pointer-events-none absolute -right-10 top-6 h-24 w-24 rounded-full bg-blue-200/50 blur-3xl dark:bg-blue-500/30" aria-hidden="true" />
            <div className="relative space-y-0.5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Publicación</p>
                </div>
                <span className="rounded-2xl bg-blue-100/80 p-2 text-blue-600 dark:bg-blue-900/40 dark:text-blue-200">
                  <ShieldCheck className="h-4 w-4" />
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {PUBLISHED_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    className={chipClass(currentFilters.publishedFilter === preset.value)}
                    onClick={() => handleQuickPublished(preset.value)}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/92 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <div className="pointer-events-none absolute -left-6 bottom-0 h-24 w-24 rounded-full bg-emerald-200/50 blur-3xl dark:bg-emerald-400/30" aria-hidden="true" />
            <div className="relative space-y-0.5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Disponibilidad</p>
                </div>
                <span className="rounded-2xl bg-emerald-100/80 p-2 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-200">
                  <Package className="h-4 w-4" />
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {STOCK_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    className={chipClass(currentFilters.stockFilter === preset.value)}
                    onClick={() => handleQuickStockStatus(preset.value)}
                  >
                    <Package className="h-3.5 w-3.5" />
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/92 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <div className="pointer-events-none absolute right-0 top-0 h-16 w-16 rounded-full bg-amber-200/60 blur-2xl dark:bg-amber-400/30" aria-hidden="true" />
            <div className="">
              <div className="rounded-2xl shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                <div className="flex items-start justify-between">
                  <div>
                    <p className={FILTER_LABEL_CLASS}>Rango de precio</p>
                  </div>
                  <span className="rounded-2xl bg-emerald-100/80 p-2 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-200">
                    <BiDollar className="h-4 w-4" />
                  </span>
                </div>
                <div className=" grid gap-2 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-900 dark:text-slate-300">Precio mínimo</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      min="0"
                      className={`${FILTER_INPUT_CLASS} focus:border-emerald-500 focus:ring-emerald-500/30`}
                      value={minPriceValue}
                      onChange={(e) => handleMinPriceChange(e.target.value)}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-900 dark:text-slate-300">Precio máximo</Label>
                    <Input
                      type="number"
                      placeholder="10000"
                      min="0"
                      className={`${FILTER_INPUT_CLASS} focus:border-emerald-500 focus:ring-emerald-500/30`}
                      value={maxPriceValue}
                      onChange={(e) => handleMaxPriceChange(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-r from-slate-50 via-white to-slate-100 p-5 shadow-sm dark:border-slate-900 dark:from-slate-900/70 dark:via-slate-900/40 dark:to-slate-900/20">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-white dark:bg-white/10">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Filtros activos
              </span>
                {currentFilters.search && (
                  <Badge
                    variant="secondary"
                    className={`${FILTER_ACTIVE_BADGE_CLASS} border-blue-200/70 text-blue-700 dark:border-blue-900/50 dark:text-blue-200`}
                    onClick={() => handleSearchChange("")}
                  >
                    <Search className="h-3.5 w-3.5" />
                    <span className="font-medium">{currentFilters.search}</span>
                    <div className="rounded-sm p-0.5 transition-colors group-hover:bg-blue-100/70 dark:group-hover:bg-blue-900/40">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.category !== "all" && (
                  <Badge
                    variant="secondary"
                    className={`${FILTER_ACTIVE_BADGE_CLASS} border-purple-200/70 text-purple-700 dark:border-purple-900/50 dark:text-purple-200`}
                    onClick={() => handleCategoryChange("all")}
                  >
                    <Tag className="h-3.5 w-3.5" />
                    <span className="font-medium">{categories?.find((c) => c.id.toString() === currentFilters.category)?.name}</span>
                    <div className="rounded-sm p-0.5 transition-colors group-hover:bg-purple-100/70 dark:group-hover:bg-purple-900/40">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.brand !== "all" && (
                  <Badge
                    variant="secondary"
                    className={`${FILTER_ACTIVE_BADGE_CLASS} border-pink-200/70 text-pink-700 dark:border-pink-900/50 dark:text-pink-200`}
                    onClick={() => handleBrandChange("all")}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span className="font-medium">{brands?.find((b) => b.id.toString() === currentFilters.brand)?.name}</span>
                    <div className="rounded-sm p-0.5 transition-colors group-hover:bg-pink-100/70 dark:group-hover:bg-pink-900/40">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.minPrice && (
                  <Badge
                    variant="secondary"
                    className={`${FILTER_ACTIVE_BADGE_CLASS} border-green-200/70 text-green-700 dark:border-green-900/50 dark:text-green-200`}
                    onClick={() => handleMinPriceChange("")}
                  >
                    <DollarSign className="h-3.5 w-3.5" />
                    <span className="font-medium">Min: ${parseInt(currentFilters.minPrice, 10).toLocaleString()}</span>
                    <div className="rounded-sm p-0.5 transition-colors group-hover:bg-green-100/70 dark:group-hover:bg-green-900/40">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.maxPrice && (
                  <Badge
                    variant="secondary"
                    className={`${FILTER_ACTIVE_BADGE_CLASS} border-green-200/70 text-green-700 dark:border-green-900/50 dark:text-green-200`}
                    onClick={() => handleMaxPriceChange("")}
                  >
                    <DollarSign className="h-3.5 w-3.5" />
                    <span className="font-medium">Max: ${parseInt(currentFilters.maxPrice, 10).toLocaleString()}</span>
                    <div className="rounded-sm p-0.5 transition-colors group-hover:bg-green-100/70 dark:group-hover:bg-green-900/40">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.publishedFilter !== "all" && (
                  <Badge
                    variant="secondary"
                    className={`${FILTER_ACTIVE_BADGE_CLASS} border-blue-200/70 text-blue-700 dark:border-blue-900/50 dark:text-blue-200`}
                    onClick={() => handlePublishedFilter("all")}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span className="font-medium">{currentFilters.publishedFilter === "true" ? "Publicados" : "No publicados"}</span>
                    <div className="rounded-sm p-0.5 transition-colors group-hover:bg-blue-100/70 dark:group-hover:bg-blue-900/40">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.stockFilter !== "all" && (
                  <Badge
                    variant="secondary"
                    className={`${FILTER_ACTIVE_BADGE_CLASS} border-orange-200/70 text-orange-700 dark:border-orange-900/50 dark:text-orange-200`}
                    onClick={() => handleStockFilter("all")}
                  >
                    <Package className="h-3.5 w-3.5" />
                    <span className="font-medium">{currentFilters.stockFilter === "selling" ? "Con stock" : "Agotados"}</span>
                    <div className="rounded-sm p-0.5 transition-colors group-hover:bg-orange-100/70 dark:group-hover:bg-orange-900/40">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.minStock && (
                  <Badge
                    variant="secondary"
                    className={`${FILTER_ACTIVE_BADGE_CLASS} border-orange-200/70 text-orange-700 dark:border-orange-900/50 dark:text-orange-200`}
                    onClick={() => handleMinStockChange("")}
                  >
                    <Package className="h-3.5 w-3.5" />
                    <span className="font-medium">Stock Min: {currentFilters.minStock}</span>
                    <div className="rounded-sm p-0.5 transition-colors group-hover:bg-orange-100/70 dark:group-hover:bg-orange-900/40">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.maxStock && (
                  <Badge
                    variant="secondary"
                    className={`${FILTER_ACTIVE_BADGE_CLASS} border-orange-200/70 text-orange-700 dark:border-orange-900/50 dark:text-orange-200`}
                    onClick={() => handleMaxStockChange("")}
                  >
                    <Package className="h-3.5 w-3.5" />
                    <span className="font-medium">Stock Max: {currentFilters.maxStock}</span>
                    <div className="rounded-sm p-0.5 transition-colors group-hover:bg-orange-100/70 dark:group-hover:bg-orange-900/40">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
