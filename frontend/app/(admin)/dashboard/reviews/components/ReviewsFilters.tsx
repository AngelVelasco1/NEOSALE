"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Star, CheckCircle, Clock } from "lucide-react";
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
} from "@/app/(admin)/components/shared/filters/styles";

const STATUS_PRESETS = [
  { label: "Pendientes", value: "pending" },
  { label: "Aprobadas", value: "approved" },
];

const RATING_PRESETS = [
  { label: "5★", value: "5" },
  { label: "4★", value: "4" },
  { label: "3★", value: "3" },
  { label: "2★", value: "2" },
  { label: "1★", value: "1" },
];

export default function ReviewsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");

  const currentFilters = {
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "all",
    rating: searchParams.get("rating") || "all",
  };

  const applyFilters = useCallback(
    (newFilters: Record<string, string>) => {
      const params = new URLSearchParams();

      if (newFilters.search) params.set("search", newFilters.search.trim());
      if (newFilters.status && newFilters.status !== "all") params.set("status", newFilters.status);
      if (newFilters.rating && newFilters.rating !== "all") params.set("rating", newFilters.rating);

      const sortBy = searchParams.get("sortBy");
      const sortOrder = searchParams.get("sortOrder");
      if (sortBy) params.set("sortBy", sortBy);
      if (sortOrder) params.set("sortOrder", sortOrder);

      params.set("page", "1");

      router.push(`/dashboard/reviews?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleStatusChange = (value: string) => {
    applyFilters({ ...currentFilters, status: value });
  };

  const handleRatingChange = (value: string) => {
    applyFilters({ ...currentFilters, rating: value });
  };

  const handleSearchChange = (value: string) => setSearchValue(value);

  const handleQuickStatus = (value: string) => {
    const next = currentFilters.status === value ? "all" : value;
    handleStatusChange(next);
  };

  const handleQuickRating = (value: string) => {
    const next = currentFilters.rating === value ? "all" : value;
    handleRatingChange(next);
  };

  const handleResetFilters = () => {
    setSearchValue("");
    applyFilters({
      search: "",
      status: "all",
      rating: "all",
    });
  };

  const chipClass = (isActive: boolean) =>
    isActive
      ? cn(
          FILTER_CHIP_CLASS,
          FILTER_CHIP_ACTIVE_CLASS,
          "border-transparent bg-[linear-gradient(120deg,rgba(249,115,22,0.9),rgba(251,146,60,0.95))] text-white shadow-[0_12px_30px_-12px_rgba(249,115,22,0.65)]"
        )
      : cn(
          FILTER_CHIP_CLASS,
          "border-white/15 bg-white/5 text-slate-100 backdrop-blur hover:border-orange-200/40 hover:text-white"
        );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== currentFilters.search) {
        applyFilters({ ...currentFilters, search: searchValue });
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [searchValue, currentFilters, applyFilters]);

  const hasActiveFilters =
    currentFilters.search ||
    currentFilters.status !== "all" ||
    currentFilters.rating !== "all";

  return (
    <Card className={FILTER_CARD_CLASS}>
      <div className="space-y-2">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800/50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white shadow-lg shadow-orange-900/25">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.4),transparent_55%)]"
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute -right-6 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-orange-400/25 blur-3xl" aria-hidden="true" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-orange-200/70">Retroalimentación</p>
                <p className="text-3xl font-semibold tracking-tight">Gestiona reseñas</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="min-w-[130px] rounded-2xl border border-white/20 bg-white/10 px-3 py-1.5 text-left">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-white/70">Estado</p>
                  <p className="text-sm font-medium text-white">{currentFilters.status !== "all" ? "Filtrado" : "Todas"}</p>
                </div>
                <div className="min-w-[130px] rounded-2xl border border-white/20 bg-white/10 px-3 py-1.5 text-left">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-white/70">Rating</p>
                  <p className="text-sm font-medium text-white">{currentFilters.rating !== "all" ? `${currentFilters.rating}★` : "Todos"}</p>
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

        <div className="rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-4 shadow-sm dark:border-slate-900 dark:from-slate-950/50 dark:via-slate-900/40 dark:to-slate-950/30">
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
                  placeholder="Producto, usuario o comentario..."
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
                <div className="rounded-xl bg-green-100/70 p-1.5 dark:bg-green-900/30">
                  <CheckCircle className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                </div>
                Estado
              </Label>
              <div className="relative">
                <CheckCircle className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400 dark:text-green-500" />
                <select
                  value={currentFilters.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200/60 bg-white/80 pl-10 pr-10 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:border-green-400/80 hover:bg-white/90 hover:shadow-md focus:border-green-400 focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-green-400/30 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-green-500/60 dark:hover:bg-slate-900/70 dark:focus:border-green-500 dark:focus:bg-slate-900/80"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                  }}
                >
                  <option value="all">Todas</option>
                  <option value="pending">Pendientes</option>
                  <option value="approved">Aprobadas</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                <div className="rounded-xl bg-amber-100/70 p-1.5 dark:bg-amber-900/30">
                  <Star className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                </div>
                Rating
              </Label>
              <div className="relative">
                <Star className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-400 dark:text-amber-500" />
                <select
                  value={currentFilters.rating}
                  onChange={(e) => handleRatingChange(e.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200/60 bg-white/80 pl-10 pr-10 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:border-amber-400/80 hover:bg-white/90 hover:shadow-md focus:border-amber-400 focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-amber-400/30 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-amber-500/60 dark:hover:bg-slate-900/70 dark:focus:border-amber-500 dark:focus:bg-slate-900/80"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                  }}
                >
                  <option value="all">Todos los ratings</option>
                  <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                  <option value="4">⭐⭐⭐⭐ (4)</option>
                  <option value="3">⭐⭐⭐ (3)</option>
                  <option value="2">⭐⭐ (2)</option>
                  <option value="1">⭐ (1)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/92 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <div className="pointer-events-none absolute -right-10 top-6 h-24 w-24 rounded-full bg-green-200/50 blur-3xl dark:bg-green-500/30" aria-hidden="true" />
            <div className="relative space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Estado de revisión</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Aprobadas o pendientes de moderación.</p>
                </div>
                <span className="rounded-2xl bg-green-100/80 p-2 text-green-600 dark:bg-green-900/40 dark:text-green-200">
                  <CheckCircle className="h-4 w-4" />
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
                    {preset.value === "pending" ? <Clock className="h-3.5 w-3.5" /> : <CheckCircle className="h-3.5 w-3.5" />}
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/92 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <div className="pointer-events-none absolute -left-6 bottom-0 h-24 w-24 rounded-full bg-amber-200/50 blur-3xl dark:bg-amber-400/30" aria-hidden="true" />
            <div className="relative space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Calificación</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Filtra por estrellas otorgadas.</p>
                </div>
                <span className="rounded-2xl bg-amber-100/80 p-2 text-amber-600 dark:bg-amber-900/40 dark:text-amber-200">
                  <Star className="h-4 w-4" />
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {RATING_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    className={chipClass(currentFilters.rating === preset.value)}
                    onClick={() => handleQuickRating(preset.value)}
                  >
                    <Star className="h-3.5 w-3.5" />
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-r from-slate-50 via-white to-slate-100 p-5 shadow-sm dark:border-slate-900 dark:from-slate-900/70 dark:via-slate-900/40 dark:to-slate-900/20">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-white dark:bg-white/10">
                <div className="h-2 w-2 animate-pulse rounded-full bg-orange-400" />
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
              {currentFilters.status !== "all" && (
                <Badge
                  variant="secondary"
                  className={`${FILTER_ACTIVE_BADGE_CLASS} border-green-200/70 text-green-700 dark:border-green-900/50 dark:text-green-200`}
                  onClick={() => handleStatusChange("all")}
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span className="font-medium">{currentFilters.status === "pending" ? "Pendientes" : "Aprobadas"}</span>
                  <div className="rounded-sm p-0.5 transition-colors group-hover:bg-green-100/70 dark:group-hover:bg-green-900/40">
                    <X className="h-3 w-3" />
                  </div>
                </Badge>
              )}
              {currentFilters.rating !== "all" && (
                <Badge
                  variant="secondary"
                  className={`${FILTER_ACTIVE_BADGE_CLASS} border-amber-200/70 text-amber-700 dark:border-amber-900/50 dark:text-amber-200`}
                  onClick={() => handleRatingChange("all")}
                >
                  <Star className="h-3.5 w-3.5" />
                  <span className="font-medium">{currentFilters.rating}★</span>
                  <div className="rounded-sm p-0.5 transition-colors group-hover:bg-amber-100/70 dark:group-hover:bg-amber-900/40">
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
