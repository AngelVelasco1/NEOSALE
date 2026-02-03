"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Tag, ToggleLeft, X } from "lucide-react";
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

const STATUS_OPTIONS = [
  { label: "Todas", value: "all" },
  { label: "Activas", value: "active" },
  { label: "Inactivas", value: "inactive" },
];

export default function CategoryFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");

    const currentFilters = {
      search: searchParams.get("search") || "",
      status: searchParams.get("status") || "all",
    };

    const applyFilters = useCallback(
      (newFilters: Record<string, string>) => {
        const params = new URLSearchParams();

        if (newFilters.search) {
          params.set("search", newFilters.search);
        }

        if (newFilters.status && newFilters.status !== "all") {
          params.set("status", newFilters.status);
        }

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

    const handleSearchChange = (value: string) => {
      setSearchValue(value);
    };

    const handleResetFilters = () => {
      setSearchValue("");

      applyFilters({
        search: "",
        status: "all",
      });
    };

    const chipClass = (isActive: boolean) =>
      isActive
        ? cn(
            FILTER_CHIP_CLASS,
            FILTER_CHIP_ACTIVE_CLASS,
            "border-transparent bg-[linear-gradient(120deg,rgba(168,85,247,0.9),rgba(139,92,246,0.95))] text-white shadow-[0_12px_30px_-12px_rgba(139,92,246,0.65)]"
          )
        : cn(
            FILTER_CHIP_CLASS,
            "border-white/15 bg-white/5 text-slate-100 backdrop-blur hover:border-purple-200/40 hover:text-white"
          );

    useEffect(() => {
      const timer = setTimeout(() => {
        if (searchValue !== currentFilters.search) {
          applyFilters({ ...currentFilters, search: searchValue });
        }
      }, 800);

      return () => clearTimeout(timer);
    }, [searchValue, currentFilters.search, currentFilters.status, applyFilters]);

    const hasActiveFilters = currentFilters.search || currentFilters.status !== "all";

    const heroHighlights = [
      {
        label: "Estado",
        value:
          currentFilters.status === "all"
            ? "Estados mixtos"
            : currentFilters.status === "active"
              ? "Activas"
              : "Inactivas",
      },
      {
        label: "Búsqueda",
        value: currentFilters.search ? currentFilters.search : "Libre",
      },
    ];

    return (
      <Card className={FILTER_CARD_CLASS}>
        <div className="space-y-2">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800/50 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white shadow-lg shadow-purple-900/25">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.4),transparent_55%)]"
              aria-hidden="true"
            />
            <div className="pointer-events-none absolute -right-6 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-purple-400/25 blur-3xl" aria-hidden="true" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-purple-200/70">Categorias de los productos</p>
                  <p className="text-3xl font-semibold tracking-tight">Gestiona categorías</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="min-w-[130px] rounded-2xl border border-white/20 bg-white/10 px-3 py-1.5 text-left">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-white/70">Estado</p>
                    <p className="text-sm font-medium text-white">{currentFilters.status !== "all" ? "Filtrado" : "Todas"}</p>
                  </div>
                  <div className="min-w-[130px] rounded-2xl border border-white/20 bg-white/10 px-3 py-1.5 text-left">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-white/70">Búsqueda</p>
                    <p className="text-sm font-medium text-white">{currentFilters.search || "Libre"}</p>
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

          <div className="rounded-3xl border p-4 shadow-sm border-slate-900 from-slate-950/50 via-slate-900/40 to-slate-950/30">
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
                    placeholder="Nombre o slug..."
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
                  <div className="rounded-xl  p-1.5 bg-purple-900/30">
                    <ToggleLeft className="h-3.5 w-3.5 text-purple-400" />
                  </div>
                  Estado
                </Label>
                <div className="relative">
                  <ToggleLeft className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-500" />
                  <select
                    value={currentFilters.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="h-11 w-full appearance-none rounded-xl border border-slate-700/60 bg-slate-900/60 pl-10 pr-10 text-sm font-medium text-slate-200 shadow-sm backdrop-blur-sm transition-all hover:border-purple-500/60 hover:bg-slate-900/70 hover:shadow-md focus:border-purple-500 focus:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-purple-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                    }}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

       

          {hasActiveFilters && (
            <div className="rounded-3xl border border-slate-900 bg-linear-to-r from-slate-900/70 via-slate-900/40 to-slate-900/20 p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-white">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-purple-400" />
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
                    className={`${FILTER_ACTIVE_BADGE_CLASS} border-purple-900/50 text-purple-200`}
                    onClick={() => handleStatusChange("all")}
                  >
                    <ToggleLeft className="h-3.5 w-3.5" />
                    <span className="font-medium">{currentFilters.status === "active" ? "Activas" : "Inactivas"}</span>
                    <div className="rounded-sm p-0.5 transition-colors group-hover:bg-purple-900/40">
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
