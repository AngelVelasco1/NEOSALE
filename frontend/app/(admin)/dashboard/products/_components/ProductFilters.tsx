"use client";

import { Search, X, Loader2, Tag, DollarSign, Layers, ShieldCheck, Package } from "lucide-react";
import { cn } from "@/lib/utils";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import {
  FILTER_ACTIVE_BADGE_CLASS,
  FILTER_CARD_CLASS,
  FILTER_CHIP_ACTIVE_CLASS,
  FILTER_CHIP_CLASS,
  FILTER_INPUT_CLASS,
  FILTER_LABEL_CLASS,
  FILTER_RESET_BUTTON_CLASS,
} from "@/app/(admin)/components/shared/filters/styles";
import { BiDollar } from "react-icons/bi";

import { PUBLISHED_PRESETS, STOCK_PRESETS } from "./constants";
import { useProductFilters } from "./useProductFilters";

export default function ProductFilters() {
  const {
    filters: currentFilters,
    isLoadingSearch,
    hasActiveFilters,
    categories,
    isLoadingCategories,
    isErrorCategories,
    brands,
    isLoadingBrands,
    isErrorBrands,
    handleSearchChange,
    handleCategoryChange,
    handleBrandChange,
    handleMinPriceChange,
    handleMaxPriceChange,
    handlePublishedFilter,
    handleStockFilter,
    handleMinStockChange,
    handleMaxStockChange,
    handleQuickPublished,
    handleQuickStockStatus,
    handleResetFilters,
  } = useProductFilters();

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

  return (
    <Card className={FILTER_CARD_CLASS}>
      <div className="space-y-2">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800/50 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white shadow-md shadow-emerald-900/25">
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
              <div className="relative w-full max-w-xs">
                <label htmlFor="product-search" className="sr-only">Buscar productos</label>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search className="w-5 h-5" />
                </span>
                <input
                  id="product-search"
                  type="search"
                  autoComplete="off"
                  className="block w-full rounded-xl border border-slate-700 bg-slate-900/80 py-2.5 pl-11 pr-12 text-base text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all shadow-sm outline-none"
                  placeholder="Buscar por nombre, SKU o descripción..."
                  value={currentFilters.search}
                  onChange={e => handleSearchChange(e.target.value)}
                  aria-label="Buscar productos"
                  disabled={isLoadingSearch}
                />
                {currentFilters.search && (
                  <button
                    type="button"
                    aria-label="Limpiar búsqueda"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-700/70 p-1 text-slate-300 hover:bg-slate-600 hover:text-white transition-all"
                    onClick={() => handleSearchChange("")}
                    tabIndex={0}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {isLoadingSearch && (
                  <span className="absolute right-10 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  </span>
                )}
              </div>
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

        <div className="rounded-3xl border border-slate-900 bg-linear-to-br from-slate-950/50 via-slate-900/40 to-slate-950/30 p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr_1fr]">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                <div className="rounded-xl bg-blue-900/30 p-1.5">
                  <Search className="h-3.5 w-3.5 text-blue-400" />
                </div>
                Búsqueda avanzada
              </Label>
              <div className="relative group">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                <Input
                  type="search"
                  placeholder="Nombre, SKU o descripción..."
                  className={`${FILTER_INPUT_CLASS} h-11 pl-12 pr-12 text-base`}
                  value={currentFilters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
                {currentFilters.search && (
                  <button
                    onClick={() => handleSearchChange("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-slate-700 p-1 text-slate-400 transition-all hover:bg-slate-600 hover:text-slate-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                <div className="rounded-xl bg-purple-900/30 p-1.5">
                  <Tag className="h-3.5 w-3.5 text-purple-400" />
                </div>
                Categoría
              </Label>
              <div className="relative">
                <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-500" />
                <select
                  value={currentFilters.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  disabled={isLoadingCategories || isErrorCategories}
                  className="h-11 w-full appearance-none rounded-xl border border-slate-700/60 bg-slate-900/60 pl-10 pr-10 text-sm font-medium text-slate-200 shadow-sm backdrop-blur-sm transition-all hover:border-purple-500/60 hover:bg-slate-900/70 hover:shadow-md focus:border-purple-500 focus:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-purple-500/30 disabled:cursor-not-allowed disabled:opacity-50"
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
              <Label className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                <div className="rounded-xl bg-pink-900/30 p-1.5">
                  <Layers className="h-3.5 w-3.5 text-pink-400" />
                </div>
                Marca
              </Label>
              <div className="relative">
                <Layers className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pink-500" />
                <select
                  value={currentFilters.brand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  disabled={isLoadingBrands || isErrorBrands}
                  className="h-11 w-full appearance-none rounded-xl border border-slate-700/60 bg-slate-900/60 pl-10 pr-10 text-sm font-medium text-slate-200 shadow-sm backdrop-blur-sm transition-all hover:border-pink-500/60 hover:bg-slate-900/70 hover:shadow-md focus:border-pink-500 focus:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-pink-500/30 disabled:cursor-not-allowed disabled:opacity-50"
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
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
            <div className="pointer-events-none absolute -right-10 top-6 h-24 w-24 rounded-full bg-blue-500/30 blur-3xl" aria-hidden="true" />
            <div className="relative space-y-0.5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">Publicación</p>
                </div>
                <span className="rounded-2xl bg-blue-900/40 p-2 text-blue-200">
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

          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
            <div className="pointer-events-none absolute -left-6 bottom-0 h-24 w-24 rounded-full bg-emerald-400/30 blur-3xl" aria-hidden="true" />
            <div className="relative space-y-0.5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">Disponibilidad</p>
                </div>
                <span className="rounded-2xl bg-emerald-900/40 p-2 text-emerald-200">
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

          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
            <div className="pointer-events-none absolute right-0 top-0 h-16 w-16 rounded-full bg-amber-400/30 blur-2xl" aria-hidden="true" />
            <div className="">
              <div className="rounded-2xl shadow-sm bg-slate-900/60">
                <div className="flex items-start justify-between">
                  <div>
                    <p className={FILTER_LABEL_CLASS}>Rango de precio</p>
                  </div>
                  <span className="rounded-2xl bg-emerald-900/40 p-2 text-emerald-200">
                    <BiDollar className="h-4 w-4" />
                  </span>
                </div>
                <div className=" grid gap-2 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-300">Precio mínimo</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      min="0"
                      className={`${FILTER_INPUT_CLASS} focus:border-emerald-500 focus:ring-emerald-500/30`}
                      value={currentFilters.minPrice}
                      onChange={(e) => handleMinPriceChange(e.target.value)}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-300">Precio máximo</Label>
                    <Input
                      type="number"
                      placeholder="10000"
                      min="0"
                      className={`${FILTER_INPUT_CLASS} focus:border-emerald-500 focus:ring-emerald-500/30`}
                      value={currentFilters.maxPrice}
                      onChange={(e) => handleMaxPriceChange(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="rounded-3xl border border-slate-900 bg-linear-to-r from-slate-900/70 via-slate-900/40 to-slate-900/20 p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-white">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Filtros activos
              </span>
                {currentFilters.search && (
                  <Badge
                    variant="secondary"
                    className={`${FILTER_ACTIVE_BADGE_CLASS} border-blue-900/50 text-blue-200`}
                    onClick={() => handleSearchChange("")}
                  >
                    <Search className="h-3.5 w-3.5" />
                    <span className="font-medium">{currentFilters.search}</span>
                    <div className="rounded-sm p-0.5 transition-colors group-hover:bg-blue-900/40">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.category !== "all" && (
                  <Badge
                    variant="secondary"
                    className={`${FILTER_ACTIVE_BADGE_CLASS} border-purple-900/50 text-purple-200`}
                    onClick={() => handleCategoryChange("all")}
                  >
                    <Tag className="h-3.5 w-3.5" />
                    <span className="font-medium">{categories?.find((c) => c.id.toString() === currentFilters.category)?.name}</span>
                    <div className="rounded-sm p-0.5 transition-colors group-hover:bg-purple-900/40">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.brand !== "all" && (
                  <Badge
                    variant="secondary"
                    className={`${FILTER_ACTIVE_BADGE_CLASS} border-pink-900/50 text-pink-200`}
                    onClick={() => handleBrandChange("all")}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span className="font-medium">{brands?.find((b) => b.id.toString() === currentFilters.brand)?.name}</span>
                    <div className="rounded-sm p-0.5 transition-colors group-hover:bg-pink-900/40">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.minPrice && (
                  <Badge
                    variant="secondary"
                    className={`${FILTER_ACTIVE_BADGE_CLASS} border-green-900/50 text-green-200`}
                    onClick={() => handleMinPriceChange("")}
                  >
                    <DollarSign className="h-3.5 w-3.5" />
                    <span className="font-medium">Min: ${parseInt(currentFilters.minPrice, 10).toLocaleString()}</span>
                    <div className="rounded-sm p-0.5 transition-colors group-hover:bg-green-900/40">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.maxPrice && (
                  <Badge
                    variant="secondary"
                    className={`${FILTER_ACTIVE_BADGE_CLASS} border-green-900/50 text-green-200`}
                    onClick={() => handleMaxPriceChange("")}
                  >
                    <DollarSign className="h-3.5 w-3.5" />
                    <span className="font-medium">Max: ${parseInt(currentFilters.maxPrice, 10).toLocaleString()}</span>
                    <div className="rounded-sm p-0.5 transition-colors group-hover:bg-green-900/40">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.publishedFilter !== "all" && (
                  <Badge
                    variant="secondary"
                    className={`${FILTER_ACTIVE_BADGE_CLASS} border-blue-900/50 text-blue-200`}
                    onClick={() => handlePublishedFilter("all")}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span className="font-medium">{currentFilters.publishedFilter === "true" ? "Publicados" : "No publicados"}</span>
                    <div className="rounded-sm p-0.5 transition-colors group-hover:bg-blue-900/40">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.stockFilter !== "all" && (
                  <Badge
                    variant="secondary"
                    className={`${FILTER_ACTIVE_BADGE_CLASS} border-orange-900/50 text-orange-200`}
                    onClick={() => handleStockFilter("all")}
                  >
                    <Package className="h-3.5 w-3.5" />
                    <span className="font-medium">{currentFilters.stockFilter === "selling" ? "Con stock" : "Agotados"}</span>
                    <div className="rounded-sm p-0.5 transition-colors group-hover:bg-orange-900/40">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.minStock && (
                  <Badge
                    variant="secondary"
                    className={`${FILTER_ACTIVE_BADGE_CLASS} border-orange-900/50 text-orange-200`}
                    onClick={() => handleMinStockChange("")}
                  >
                    <Package className="h-3.5 w-3.5" />
                    <span className="font-medium">Stock Min: {currentFilters.minStock}</span>
                    <div className="rounded-sm p-0.5 transition-colors group-hover:bg-orange-900/40">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.maxStock && (
                  <Badge
                    variant="secondary"
                    className={`${FILTER_ACTIVE_BADGE_CLASS} border-orange-900/50 text-orange-200`}
                    onClick={() => handleMaxStockChange("")}
                  >
                    <Package className="h-3.5 w-3.5" />
                    <span className="font-medium">Stock Max: {currentFilters.maxStock}</span>
                    <div className="rounded-sm p-0.5 transition-colors group-hover:bg-orange-900/40">
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
