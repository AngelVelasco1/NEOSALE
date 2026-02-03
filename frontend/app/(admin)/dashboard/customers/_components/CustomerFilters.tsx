"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, DollarSign, ShieldCheck, ShoppingBag } from "lucide-react";
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
  FILTER_SELECT_TRIGGER_CLASS,
} from "@/app/(admin)/components/shared/filters/styles";

const STATUS_PRESETS = [
  { label: "Activos", value: "true" },
  { label: "Inactivos", value: "false" },
];

const ORDERS_PRESETS = [
  { label: "Frecuentes (5+)", min: "5" },
  { label: "Nuevos", max: "1" },
];

const SPENT_PRESETS = [
  { label: "VIP $1000+", min: "1000" },
  { label: "Ticket medio", min: "200", max: "800" },
];

export default function CustomerFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [minOrdersValue, setMinOrdersValue] = useState(searchParams.get("minOrders") || "");
  const [maxOrdersValue, setMaxOrdersValue] = useState(searchParams.get("maxOrders") || "");
  const [minSpentValue, setMinSpentValue] = useState(searchParams.get("minSpent") || "");
  const [maxSpentValue, setMaxSpentValue] = useState(searchParams.get("maxSpent") || "");

  const currentFilters = {
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "all",
    minOrders: searchParams.get("minOrders") || "",
    maxOrders: searchParams.get("maxOrders") || "",
    minSpent: searchParams.get("minSpent") || "",
    maxSpent: searchParams.get("maxSpent") || "",
  };

  const applyFilters = useCallback(
    (newFilters: Record<string, string>) => {
      const params = new URLSearchParams();

      if (newFilters.search) params.set("search", newFilters.search);
      if (newFilters.status && newFilters.status !== "all") params.set("status", newFilters.status);
      if (newFilters.minOrders) params.set("minOrders", newFilters.minOrders);
      if (newFilters.maxOrders) params.set("maxOrders", newFilters.maxOrders);
      if (newFilters.minSpent) params.set("minSpent", newFilters.minSpent);
      if (newFilters.maxSpent) params.set("maxSpent", newFilters.maxSpent);

      const sortBy = searchParams.get("sortBy");
      const sortOrder = searchParams.get("sortOrder");
      if (sortBy) params.set("sortBy", sortBy);
      if (sortOrder) params.set("sortOrder", sortOrder);

      params.set("page", "1");

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleStatusChange = (value: string) => {
    applyFilters({ ...currentFilters, status: value });
  };

  const handleSearchChange = (value: string) => setSearchValue(value);
  const handleMinOrdersChange = (value: string) => setMinOrdersValue(value);
  const handleMaxOrdersChange = (value: string) => setMaxOrdersValue(value);
  const handleMinSpentChange = (value: string) => setMinSpentValue(value);
  const handleMaxSpentChange = (value: string) => setMaxSpentValue(value);

  const handleQuickStatus = (value: string) => {
    const next = currentFilters.status === value ? "all" : value;
    handleStatusChange(next);
  };

  const handleQuickOrders = (min?: string, max?: string) => {
    setMinOrdersValue(min || "");
    setMaxOrdersValue(max || "");

    applyFilters({ ...currentFilters, minOrders: min || "", maxOrders: max || "" });
  };

  const handleQuickSpent = (min?: string, max?: string) => {
    setMinSpentValue(min || "");
    setMaxSpentValue(max || "");

    applyFilters({ ...currentFilters, minSpent: min || "", maxSpent: max || "" });
  };

  const handleResetFilters = () => {
    setSearchValue("");
    setMinOrdersValue("");
    setMaxOrdersValue("");
    setMinSpentValue("");
    setMaxSpentValue("");

    applyFilters({
      search: "",
      status: "all",
      minOrders: "",
      maxOrders: "",
      minSpent: "",
      maxSpent: "",
    });
  };

  const chipClass = (isActive: boolean) =>
    isActive
      ? cn(
          FILTER_CHIP_CLASS,
          FILTER_CHIP_ACTIVE_CLASS,
          "border-transparent bg-[linear-gradient(120deg,rgba(236,72,153,0.9),rgba(232,121,249,0.95))] text-white shadow-[0_12px_30px_-12px_rgba(236,72,153,0.65)]"
        )
      : cn(
          FILTER_CHIP_CLASS,
          "border-white/15 bg-white/5 text-slate-100 backdrop-blur hover:border-pink-200/40 hover:text-white"
        );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== currentFilters.search) {
        applyFilters({ ...currentFilters, search: searchValue });
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [searchValue, currentFilters, applyFilters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (minOrdersValue !== currentFilters.minOrders) {
        applyFilters({ ...currentFilters, minOrders: minOrdersValue });
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [minOrdersValue, currentFilters, applyFilters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (maxOrdersValue !== currentFilters.maxOrders) {
        applyFilters({ ...currentFilters, maxOrders: maxOrdersValue });
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [maxOrdersValue, currentFilters, applyFilters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (minSpentValue !== currentFilters.minSpent) {
        applyFilters({ ...currentFilters, minSpent: minSpentValue });
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [minSpentValue, currentFilters, applyFilters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (maxSpentValue !== currentFilters.maxSpent) {
        applyFilters({ ...currentFilters, maxSpent: maxSpentValue });
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [maxSpentValue, currentFilters, applyFilters]);

  const hasActiveFilters =
    currentFilters.search ||
    currentFilters.status !== "all" ||
    currentFilters.minOrders ||
    currentFilters.maxOrders ||
    currentFilters.minSpent ||
    currentFilters.maxSpent;

  const heroHighlights = [
    {
      label: "Estado",
      value: currentFilters.status === "all" ? "Estados mixtos" : currentFilters.status === "true" ? "Activos" : "Inactivos",
    },
    {
      label: "Órdenes",
      value:
        currentFilters.minOrders || currentFilters.maxOrders
          ? `${currentFilters.minOrders || "0"} - ${currentFilters.maxOrders || "∞"}`
          : "Rango libre",
    },
    {
      label: "Ticket",
      value:
        currentFilters.minSpent || currentFilters.maxSpent
          ? `$${currentFilters.minSpent || "0"} - $${currentFilters.maxSpent || "∞"}`
          : "Sin límite",
    },
  ];

  return (
    <Card className={FILTER_CARD_CLASS}>
      <div className="space-y-2">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800/50 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white shadow-lg shadow-pink-900/25">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.4),transparent_55%)]"
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute -right-6 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-pink-400/25 blur-3xl" aria-hidden="true" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-pink-200/70">Segmentación de clientes</p>
                <p className="text-3xl font-semibold tracking-tight">Analiza tu audiencia</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="min-w-[130px] rounded-2xl border border-white/20 bg-white/10 px-3 py-1.5 text-left">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-white/70">Estado</p>
                  <p className="text-sm font-medium text-white">{currentFilters.status !== "all" ? "Filtrado" : "Todos"}</p>
                </div>
                <div className="min-w-[130px] rounded-2xl border border-white/20 bg-white/10 px-3 py-1.5 text-left">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-white/70">Órdenes</p>
                  <p className="text-sm font-medium text-white">{currentFilters.minOrders || currentFilters.maxOrders ? "Rango" : "Libre"}</p>
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr]">
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
                  placeholder="Nombre, correo o teléfono..."
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
                <div className="rounded-xl bg-pink-900/30 p-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-pink-400" />
                </div>
                Estado
              </Label>
              <div className="relative">
                <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pink-500" />
                <select
                  value={currentFilters.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-slate-700/60 bg-slate-900/60 pl-10 pr-10 text-sm font-medium text-slate-200 shadow-sm backdrop-blur-sm transition-all hover:border-pink-500/60 hover:bg-slate-900/70 hover:shadow-md focus:border-pink-500 focus:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-pink-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                  }}
                >
                  <option value="all">Todos</option>
                  <option value="true">Activos</option>
                  <option value="false">Inactivos</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
            <div className="pointer-events-none absolute -right-10 top-6 h-24 w-24 rounded-full bg-pink-500/30 blur-3xl" aria-hidden="true" />
            <div className="relative space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">Estado</p>
                  <p className="mt-1 text-sm text-slate-300">Filtra por estado activo o inactivo.</p>
                </div>
                <span className="rounded-2xl bg-pink-900/40 p-2 text-pink-200">
                  <ShieldCheck className="h-4 w-4" />
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {STATUS_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    className={chipClass(currentFilters.status === preset.value)}
                    onClick={() => handleQuickStatus(preset.value)}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
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
                  <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">Frecuencia</p>
                  <p className="mt-1 text-sm text-slate-300">Segmenta por número de órdenes.</p>
                </div>
                <span className="rounded-2xl bg-purple-900/40 p-2 text-purple-200">
                  <ShoppingBag className="h-4 w-4" />
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {ORDERS_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    className={chipClass(
                      currentFilters.minOrders === (preset.min || "") && currentFilters.maxOrders === (preset.max || "")
                    )}
                    onClick={() => handleQuickOrders(preset.min, preset.max)}
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
            <div className="pointer-events-none absolute right-0 top-0 h-16 w-16 rounded-full bg-amber-400/30 blur-2xl" aria-hidden="true" />
            <div className="space-y-5">
              <div className="rounded-2xl shadow-sm bg-slate-900/60">
                <div className="flex items-start justify-between">
                  <div>
                    <p className={FILTER_LABEL_CLASS}>Ticket promedio</p>
                    <p className="mt-1 text-sm text-slate-300">Define el rango de gasto.</p>
                  </div>
                  <span className="rounded-2xl bg-emerald-900/40 p-2 text-emerald-200">
                    <DollarSign className="h-4 w-4" />
                  </span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold text-slate-100">Min gastado $</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      min="0"
                      className={`${FILTER_INPUT_CLASS} focus:border-emerald-500 focus:ring-emerald-500/30`}
                      value={minSpentValue}
                      onChange={(e) => handleMinSpentChange(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold text-slate-100">Max gastado $</Label>
                    <Input
                      type="number"
                      placeholder="10000"
                      min="0"
                      className={`${FILTER_INPUT_CLASS} focus:border-emerald-500 focus:ring-emerald-500/30`}
                      value={maxSpentValue}
                      onChange={(e) => handleMaxSpentChange(e.target.value)}
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
                <div className="h-2 w-2 animate-pulse rounded-full bg-pink-400" />
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
                  className={`${FILTER_ACTIVE_BADGE_CLASS} border-pink-900/50 text-pink-200`}
                  onClick={() => handleStatusChange("all")}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span className="font-medium">{currentFilters.status === "true" ? "Activos" : "Inactivos"}</span>
                  <div className="rounded-sm p-0.5 transition-colors group-hover:bg-pink-900/40">
                    <X className="h-3 w-3" />
                  </div>
                </Badge>
              )}
              {currentFilters.minOrders && (
                <Badge
                  variant="secondary"
                  className={`${FILTER_ACTIVE_BADGE_CLASS} border-purple-900/50 text-purple-200`}
                  onClick={() => handleMinOrdersChange("")}
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span className="font-medium">Min Órdenes: {currentFilters.minOrders}</span>
                  <div className="rounded-sm p-0.5 transition-colors group-hover:bg-purple-900/40">
                    <X className="h-3 w-3" />
                  </div>
                </Badge>
              )}
              {currentFilters.maxOrders && (
                <Badge
                  variant="secondary"
                  className={`${FILTER_ACTIVE_BADGE_CLASS} border-purple-900/50 text-purple-200`}
                  onClick={() => handleMaxOrdersChange("")}
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span className="font-medium">Max Órdenes: {currentFilters.maxOrders}</span>
                  <div className="rounded-sm p-0.5 transition-colors group-hover:bg-purple-900/40">
                    <X className="h-3 w-3" />
                  </div>
                </Badge>
              )}
              {currentFilters.minSpent && (
                <Badge
                  variant="secondary"
                  className={`${FILTER_ACTIVE_BADGE_CLASS} border-green-900/50 text-green-200`}
                  onClick={() => handleMinSpentChange("")}
                >
                  <DollarSign className="h-3.5 w-3.5" />
                  <span className="font-medium">Min: ${parseInt(currentFilters.minSpent, 10).toLocaleString()}</span>
                  <div className="rounded-sm p-0.5 transition-colors group-hover:bg-green-900/40">
                    <X className="h-3 w-3" />
                  </div>
                </Badge>
              )}
              {currentFilters.maxSpent && (
                <Badge
                  variant="secondary"
                  className={`${FILTER_ACTIVE_BADGE_CLASS} border-green-900/50 text-green-200`}
                  onClick={() => handleMaxSpentChange("")}
                >
                  <DollarSign className="h-3.5 w-3.5" />
                  <span className="font-medium">Max: ${parseInt(currentFilters.maxSpent, 10).toLocaleString()}</span>
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
