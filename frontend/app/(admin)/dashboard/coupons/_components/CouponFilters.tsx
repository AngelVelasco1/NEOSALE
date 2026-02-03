"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, ToggleLeft, Percent, DollarSign, TrendingUp, Star } from "lucide-react";
import { cn } from "@/lib/utils";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

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

const STATUS_PRESETS = [
  { label: "Activos", value: "active" },
  { label: "Expirados", value: "expired" },
];

const TYPE_PRESETS = [
  { label: "%", value: "percentage" },
  { label: "Fijo", value: "fixed" },
];

const FEATURED_PRESETS = [
  { label: "Destacados", value: "true" },
  { label: "Ocultos", value: "false" },
];

export default function CouponFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [minDiscountValue, setMinDiscountValue] = useState(searchParams.get("minDiscount") || "");
  const [maxDiscountValue, setMaxDiscountValue] = useState(searchParams.get("maxDiscount") || "");

  const currentFilters = {
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "all",
    discountType: searchParams.get("discountType") || "all",
    featured: searchParams.get("featured") || "all",
    minDiscount: searchParams.get("minDiscount") || "",
    maxDiscount: searchParams.get("maxDiscount") || "",
  };

  const applyFilters = useCallback(
    (newFilters: Record<string, string>) => {
      const params = new URLSearchParams();

      if (newFilters.search) params.set("search", newFilters.search.trim());
      if (newFilters.status && newFilters.status !== "all") params.set("status", newFilters.status);
      if (newFilters.discountType && newFilters.discountType !== "all") params.set("discountType", newFilters.discountType);
      if (newFilters.featured && newFilters.featured !== "all") params.set("featured", newFilters.featured);
      if (newFilters.minDiscount) params.set("minDiscount", newFilters.minDiscount);
      if (newFilters.maxDiscount) params.set("maxDiscount", newFilters.maxDiscount);

      const sortBy = searchParams.get("sortBy");
      const sortOrder = searchParams.get("sortOrder");
      const limit = searchParams.get("limit");
      if (sortBy) params.set("sortBy", sortBy);
      if (sortOrder) params.set("sortOrder", sortOrder);
      params.set("limit", limit || "10");
      params.set("page", "1");

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleStatusChange = (value: string) => {
    applyFilters({ ...currentFilters, status: value });
  };

  const handleTypeChange = (value: string) => {
    applyFilters({ ...currentFilters, discountType: value });
  };

  const handleFeaturedChange = (value: string) => {
    applyFilters({ ...currentFilters, featured: value });
  };

  const handleSearchChange = (value: string) => setSearchValue(value);
  const handleMinDiscountChange = (value: string) => setMinDiscountValue(value);
  const handleMaxDiscountChange = (value: string) => setMaxDiscountValue(value);

  const handleResetFilters = () => {
    setSearchValue("");
    setMinDiscountValue("");
    setMaxDiscountValue("");

    applyFilters({
      search: "",
      status: "all",
      discountType: "all",
      featured: "all",
      minDiscount: "",
      maxDiscount: "",
    });
  };

  const chipClass = (isActive: boolean) =>
    isActive
      ? cn(
          FILTER_CHIP_CLASS,
          FILTER_CHIP_ACTIVE_CLASS,
          "border-transparent bg-[linear-gradient(120deg,rgba(37,99,235,0.9),rgba(59,130,246,0.95))] text-white shadow-[0_12px_30px_-12px_rgba(37,99,235,0.65)]"
        )
      : cn(
          FILTER_CHIP_CLASS,
          "border-white/15 bg-white/5 text-slate-100 backdrop-blur hover:border-blue-200/40 hover:text-white"
        );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        searchValue !== currentFilters.search ||
        minDiscountValue !== currentFilters.minDiscount ||
        maxDiscountValue !== currentFilters.maxDiscount
      ) {
        applyFilters({
          ...currentFilters,
          search: searchValue,
          minDiscount: minDiscountValue,
          maxDiscount: maxDiscountValue,
        });
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [searchValue, minDiscountValue, maxDiscountValue, currentFilters, applyFilters]);

  const hasActiveFilters =
    currentFilters.search ||
    currentFilters.status !== "all" ||
    currentFilters.discountType !== "all" ||
    currentFilters.featured !== "all" ||
    currentFilters.minDiscount ||
    currentFilters.maxDiscount;

  const heroHighlights = [
    {
      label: "Estado",
      value: currentFilters.status === "all" ? "Estados mixtos" : currentFilters.status === "active" ? "Activos" : "Expirados",
    },
    {
      label: "Tipo",
      value:
        currentFilters.discountType === "all"
          ? "Tipos mixtos"
          : currentFilters.discountType === "percentage"
            ? "Porcentaje"
            : "Fijo",
    },
    {
      label: "Destacados",
      value: currentFilters.featured === "all" ? "Todos" : currentFilters.featured === "true" ? "Solo destacados" : "Ocultos",
    },
  ];

  return (
    <Card className={FILTER_CARD_CLASS}>
      <div className="space-y-2">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800/50 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white shadow-lg shadow-blue-900/25">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.4),transparent_55%)]"
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute -right-6 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-blue-400/25 blur-3xl" aria-hidden="true" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-200/70">Estrategias de descuento</p>
                <p className="text-3xl font-semibold tracking-tight">Gestiona cupones activos</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="min-w-[130px] rounded-2xl border border-white/20 bg-white/10 px-3 py-1.5 text-left">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-white/70">Estado</p>
                  <p className="text-sm font-medium text-white">{currentFilters.status !== "all" ? "Filtrado" : "Todos"}</p>
                </div>
                <div className="min-w-[130px] rounded-2xl border border-white/20 bg-white/10 px-3 py-1.5 text-left">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-white/70">Tipo</p>
                  <p className="text-sm font-medium text-white">{currentFilters.discountType !== "all" ? "Filtrado" : "Todos"}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                className={`${FILTER_RESET_BUTTON_CLASS} text-white/95 transition-all hover:text-white cursor-pointer`}
                onClick={handleResetFilters}
              >
                Reiniciar filtros
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-900 bg-linear-to-br from-slate-950/50 via-slate-900/40 to-slate-950/30 p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr_1fr_1fr]">
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
                  placeholder="Código, campaña o etiqueta..."
                  className={`${FILTER_INPUT_CLASS} h-11 pl-12 pr-12 text-base`}
                  value={searchValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
                {searchValue && (
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
                <div className="rounded-xl bg-blue-900/30 p-1.5">
                  <ToggleLeft className="h-3.5 w-3.5 text-blue-400" />
                </div>
                Estado
              </Label>
              <div className="relative">
                <ToggleLeft className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-500" />
                <select
                  value={currentFilters.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-slate-700/60 bg-slate-900/60 pl-10 pr-10 text-sm font-medium text-slate-200 shadow-sm backdrop-blur-sm transition-all hover:border-blue-500/60 hover:bg-slate-900/70 hover:shadow-md focus:border-blue-500 focus:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                  }}
                >
                  <option value="all">Todos</option>
                  <option value="active">Activos</option>
                  <option value="expired">Expirados</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                <div className="rounded-xl bg-purple-900/30 p-1.5">
                  <Percent className="h-3.5 w-3.5 text-purple-400" />
                </div>
                Tipo
              </Label>
              <div className="relative">
                <Percent className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-500" />
                <select
                  value={currentFilters.discountType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-slate-700/60 bg-slate-900/60 pl-10 pr-10 text-sm font-medium text-slate-200 shadow-sm backdrop-blur-sm transition-all hover:border-purple-500/60 hover:bg-slate-900/70 hover:shadow-md focus:border-purple-500 focus:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-purple-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                  }}
                >
                  <option value="all">Todos los tipos</option>
                  <option value="percentage">Porcentaje</option>
                  <option value="fixed">Fijo</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                <div className="rounded-xl bg-amber-900/30 p-1.5">
                  <Star className="h-3.5 w-3.5 text-amber-400" />
                </div>
                Destacados
              </Label>
              <div className="relative">
                <Star className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-500" />
                <select
                  value={currentFilters.featured}
                  onChange={(e) => handleFeaturedChange(e.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-slate-700/60 bg-slate-900/60 pl-10 pr-10 text-sm font-medium text-slate-200 shadow-sm backdrop-blur-sm transition-all hover:border-amber-500/60 hover:bg-slate-900/70 hover:shadow-md focus:border-amber-500 focus:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-amber-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                  }}
                >
                  <option value="all">Todos</option>
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
            <div className="pointer-events-none absolute -right-10 top-6 h-24 w-24 rounded-full bg-blue-500/30 blur-3xl" aria-hidden="true" />
            <div className="relative space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">Estado</p>
                  <p className="mt-1 text-sm text-slate-300">Filtra cupones activos o expirados.</p>
                </div>
                <span className="rounded-2xl bg-blue-900/40 p-2 text-blue-200">
                  <ToggleLeft className="h-4 w-4" />
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {STATUS_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    className={chipClass(currentFilters.status === preset.value)}
                    onClick={() => handleStatusChange(currentFilters.status === preset.value ? "all" : preset.value)}
                  >
                    <ToggleLeft className="h-3.5 w-3.5" />
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
            <div className="pointer-events-none absolute -left-6 bottom-0 h-24 w-24 rounded-full bg-purple-400/30 blur-3xl" aria-hidden="true" />
            <div className="relative space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">Tipo de descuento</p>
                  <p className="mt-1 text-sm text-slate-300">Porcentaje o cantidad fija.</p>
                </div>
                <span className="rounded-2xl bg-purple-900/40 p-2 text-purple-200">
                  <Percent className="h-4 w-4" />
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {TYPE_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    className={chipClass(currentFilters.discountType === preset.value)}
                    onClick={() => handleTypeChange(currentFilters.discountType === preset.value ? "all" : preset.value)}
                  >
                    <Percent className="h-3.5 w-3.5" />
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
            <div className="pointer-events-none absolute right-0 top-0 h-16 w-16 rounded-full bg-amber-400/30 blur-2xl" aria-hidden="true" />
            <div className="relative space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">Visibilidad</p>
                  <p className="mt-1 text-sm text-slate-300">Mostrar solo cupones destacados.</p>
                </div>
                <span className="rounded-2xl bg-amber-900/40 p-2 text-amber-200">
                  <Star className="h-4 w-4" />
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {FEATURED_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    className={chipClass(currentFilters.featured === preset.value)}
                    onClick={() => handleFeaturedChange(currentFilters.featured === preset.value ? "all" : preset.value)}
                  >
                    <Star className="h-3.5 w-3.5" />
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-900 bg-linear-to-br from-slate-950/50 via-slate-900/40 to-slate-950/30 p-5 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-emerald-900/30 p-1.5">
                <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <p className={FILTER_LABEL_CLASS}>Rango de descuento</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2.5">
                <Label className="text-sm font-semibold text-slate-100">Mínimo</Label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  className={`${FILTER_INPUT_CLASS} focus:border-emerald-500 focus:ring-emerald-500/30`}
                  value={minDiscountValue}
                  onChange={(e) => handleMinDiscountChange(e.target.value)}
                />
              </div>
              <div className="space-y-2.5">
                <Label className="text-sm font-semibold text-slate-100">Máximo</Label>
                <Input
                  type="number"
                  placeholder="100"
                  min="0"
                  className={`${FILTER_INPUT_CLASS} focus:border-emerald-500 focus:ring-emerald-500/30`}
                  value={maxDiscountValue}
                  onChange={(e) => handleMaxDiscountChange(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="rounded-3xl border border-slate-900 bg-linear-to-r from-slate-900/70 via-slate-900/40 to-slate-900/20 p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-white">
                <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
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
              {currentFilters.status !== "all" && (
                <Badge
                  variant="secondary"
                  className={`${FILTER_ACTIVE_BADGE_CLASS} border-blue-900/50 text-blue-200`}
                  onClick={() => handleStatusChange("all")}
                >
                  <ToggleLeft className="h-3.5 w-3.5" />
                  <span className="font-medium">{currentFilters.status === "active" ? "Activos" : "Expirados"}</span>
                  <div className="rounded-sm p-0.5 transition-colors group-hover:bg-blue-900/40">
                    <X className="h-3 w-3" />
                  </div>
                </Badge>
              )}
              {currentFilters.discountType !== "all" && (
                <Badge
                  variant="secondary"
                  className={`${FILTER_ACTIVE_BADGE_CLASS} border-purple-900/50 text-purple-200`}
                  onClick={() => handleTypeChange("all")}
                >
                  <Percent className="h-3.5 w-3.5" />
                  <span className="font-medium">{currentFilters.discountType === "percentage" ? "Porcentaje" : "Fijo"}</span>
                  <div className="rounded-sm p-0.5 transition-colors group-hover:bg-purple-900/40">
                    <X className="h-3 w-3" />
                  </div>
                </Badge>
              )}
              {currentFilters.featured !== "all" && (
                <Badge
                  variant="secondary"
                  className={`${FILTER_ACTIVE_BADGE_CLASS} border-yellow-900/50 text-yellow-200`}
                  onClick={() => handleFeaturedChange("all")}
                >
                  <Star className="h-3.5 w-3.5" />
                  <span className="font-medium">Destacado: {currentFilters.featured === "true" ? "Sí" : "No"}</span>
                  <div className="rounded-sm p-0.5 transition-colors group-hover:bg-yellow-900/40">
                    <X className="h-3 w-3" />
                  </div>
                </Badge>
              )}
              {currentFilters.minDiscount && (
                <Badge
                  variant="secondary"
                  className={`${FILTER_ACTIVE_BADGE_CLASS} border-green-900/50 text-green-200`}
                  onClick={() => handleMinDiscountChange("")}
                >
                  <DollarSign className="h-3.5 w-3.5" />
                  <span className="font-medium">Min: {currentFilters.minDiscount}</span>
                  <div className="rounded-sm p-0.5 transition-colors group-hover:bg-green-900/40">
                    <X className="h-3 w-3" />
                  </div>
                </Badge>
              )}
              {currentFilters.maxDiscount && (
                <Badge
                  variant="secondary"
                  className={`${FILTER_ACTIVE_BADGE_CLASS} border-green-900/50 text-green-200`}
                  onClick={() => handleMaxDiscountChange("")}
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span className="font-medium">Max: {currentFilters.maxDiscount}</span>
                  <div className="rounded-sm p-0.5 transition-colors group-hover:bg-green-900/40">
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
