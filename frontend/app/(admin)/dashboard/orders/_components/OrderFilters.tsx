"use client";

import { useState, useEffect, useCallback, useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";


import { DownloadCloud, Loader2, Search, X, Tag, TrendingUp, Calendar, DollarSign } from "lucide-react";

import { cn } from "@/lib/utils";


import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/app/(admin)/components/shared/DatePicker";

import { exportAsCSV } from "@/app/(admin)/helpers/exportData";
import { exportOrders } from "@/app/(admin)/actions/orders/exportOrders";
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

const STATUS_QUICK_FILTERS = [
  { label: "Pendientes", value: "pending" },
  { label: "Procesando", value: "processing" },
  { label: "Entregados", value: "delivered" },
  { label: "Cancelados", value: "cancelled" },
];

const METHOD_QUICK_FILTERS = [
  { label: "Transferencia bancaria (PSE)", value: "PSE" },
  { label: "Tarjeta", value: "CARD" },
  { label: "Nequi", value: "NEQUI" },
];

const AMOUNT_QUICK_FILTERS = [
  { label: "Ticket Alto", min: "300" },
  { label: "Ticket Premium", min: "800" },
  { label: "Ticket Bajo", max: "100" },
];

type FilterState = {
  search: string;
  status: string;
  method: string;
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
};

const STATUS_LABELS: Record<string, string> = {
  all: "Todos",
  pending: "Pendientes",
  processing: "Procesando",
  delivered: "Entregados",
  cancelled: "Cancelados",
};

const METHOD_LABELS: Record<string, string> = {
  all: "Todos",
  PSE: "Transferencia bancaria (PSE)",
  CARD: "Tarjeta",
  NEQUI: "Nequi",
};

// Memoizar constantes de etiquetas para evitar recreaciones
const LABELS_MEMO = {
  STATUS_LABELS,
  METHOD_LABELS,
  STATUS_QUICK_FILTERS,
  METHOD_QUICK_FILTERS,
  AMOUNT_QUICK_FILTERS,
};

const formatCurrency = (value: string) => {
  if (!value) return "";
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return value;
  }
  return `$${parsed.toLocaleString()}`;
};

export default function OrderFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Estado sincronizado con URL - memoizado
  const currentFilters = useMemo(
    () => ({
      search: searchParams.get("search") || "",
      status: searchParams.get("status") || "all",
      method: searchParams.get("method") || "all",
      startDate: searchParams.get("start-date") || "",
      endDate: searchParams.get("end-date") || "",
      minAmount: searchParams.get("minAmount") || "",
      maxAmount: searchParams.get("maxAmount") || "",
    }),
    [searchParams]
  );

  // Estado local para inputs con debounce
  const [searchValue, setSearchValue] = useState(currentFilters.search);
  const [minAmountValue, setMinAmountValue] = useState(currentFilters.minAmount);
  const [maxAmountValue, setMaxAmountValue] = useState(currentFilters.maxAmount);

  // Sincronizar estado local cuando los filtros cambian (ej: reset)
  useEffect(() => {
    setSearchValue(currentFilters.search);
    setMinAmountValue(currentFilters.minAmount);
    setMaxAmountValue(currentFilters.maxAmount);
  }, [currentFilters.search, currentFilters.minAmount, currentFilters.maxAmount]);

  // Aplicar filtros - memoizado para evitar recreación
  const applyFilters = useCallback(
    (newFilters: FilterState) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newFilters.search) params.set("search", newFilters.search);
      else params.delete("search");

      if (newFilters.status && newFilters.status !== "all") params.set("status", newFilters.status);
      else params.delete("status");

      if (newFilters.method && newFilters.method !== "all") params.set("method", newFilters.method);
      else params.delete("method");

      if (newFilters.startDate) params.set("start-date", newFilters.startDate);
      else params.delete("start-date");

      if (newFilters.endDate) params.set("end-date", newFilters.endDate);
      else params.delete("end-date");

      if (newFilters.minAmount) params.set("minAmount", newFilters.minAmount);
      else params.delete("minAmount");

      if (newFilters.maxAmount) params.set("maxAmount", newFilters.maxAmount);
      else params.delete("maxAmount");

      params.set("page", "1");
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Handlers optimizados con useCallback
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const handleMinAmountChange = useCallback((value: string) => {
    setMinAmountValue(value);
  }, []);

  const handleMaxAmountChange = useCallback((value: string) => {
    setMaxAmountValue(value);
  }, []);

  const handleStatusChange = useCallback(
    (value: string) => {
      applyFilters({ ...currentFilters, status: value });
    },
    [currentFilters, applyFilters]
  );

  const handleMethodChange = useCallback(
    (value: string) => {
      applyFilters({ ...currentFilters, method: value });
    },
    [currentFilters, applyFilters]
  );

  const handleSetStartDate = useCallback(
    (date: string) => {
      applyFilters({ ...currentFilters, startDate: date });
    },
    [currentFilters, applyFilters]
  );

  const handleSetEndDate = useCallback(
    (date: string) => {
      applyFilters({ ...currentFilters, endDate: date });
    },
    [currentFilters, applyFilters]
  );

  const handleQuickStatus = useCallback(
    (value: string) => {
      const nextValue = currentFilters.status === value ? "all" : value;
      handleStatusChange(nextValue);
    },
    [currentFilters.status, handleStatusChange]
  );

  const handleQuickMethod = useCallback(
    (value: string) => {
      const nextValue = currentFilters.method === value ? "all" : value;
      handleMethodChange(nextValue);
    },
    [currentFilters.method, handleMethodChange]
  );

  const handleQuickAmount = useCallback(
    (min?: string, max?: string) => {
      setMinAmountValue(min || "");
      setMaxAmountValue(max || "");
      applyFilters({
        ...currentFilters,
        minAmount: min || "",
        maxAmount: max || "",
      });
    },
    [currentFilters, applyFilters]
  );

  const handleResetFilters = useCallback(() => {
    setSearchValue("");
    setMinAmountValue("");
    setMaxAmountValue("");
    applyFilters({
      search: "",
      status: "all",
      method: "all",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
    });
  }, [applyFilters]);

  const handleOrdersDownload = useCallback(() => {
    toast.info(`Downloading orders...`);
    startTransition(async () => {
      const result = await exportOrders();
      if (result.error) {
        toast.error(result.error);
      } else if (result.data) {
        exportAsCSV(result.data, "Orders");
      }
    });
  }, []);

  // Consolidar debounce en un único efecto para búsqueda y montos
  useEffect(() => {
    const timer = setTimeout(() => {
      // Solo aplicar filtros si hay cambios reales
      if (
        searchValue !== currentFilters.search ||
        minAmountValue !== currentFilters.minAmount ||
        maxAmountValue !== currentFilters.maxAmount
      ) {
        applyFilters({
          ...currentFilters,
          search: searchValue,
          minAmount: minAmountValue,
          maxAmount: maxAmountValue,
        });
      }
    }, 600); // Reducido de 800ms a 600ms para mejor UX

    return () => clearTimeout(timer);
  }, [searchValue, minAmountValue, maxAmountValue, currentFilters, applyFilters]);

  // Calcular valores memoizados solo cuando sea necesario
  const ticketNarrative = useMemo(() => {
    if (currentFilters.minAmount && currentFilters.maxAmount) {
      return `${formatCurrency(currentFilters.minAmount)} - ${formatCurrency(currentFilters.maxAmount)}`;
    }
    if (currentFilters.minAmount) {
      return `Desde ${formatCurrency(currentFilters.minAmount)}`;
    }
    if (currentFilters.maxAmount) {
      return `Hasta ${formatCurrency(currentFilters.maxAmount)}`;
    }
    return "Ticket libre";
  }, [currentFilters.minAmount, currentFilters.maxAmount]);

  const heroHighlights = useMemo(
    () => [
      {
        label: "Estado",
        value:
          currentFilters.status === "all"
            ? "Estados mixtos"
            : STATUS_LABELS[currentFilters.status] || currentFilters.status,
      },
      {
        label: "Método",
        value:
          currentFilters.method === "all"
            ? "Método flexible"
            : METHOD_LABELS[currentFilters.method] || currentFilters.method,
      },
      {
        label: "Ticket",
        value: ticketNarrative,
      },
    ],
    [currentFilters.status, currentFilters.method, ticketNarrative]
  );

  const hasActiveFilters = useMemo(
    () =>
      currentFilters.search ||
      currentFilters.status !== "all" ||
      currentFilters.method !== "all" ||
      currentFilters.startDate ||
      currentFilters.endDate ||
      currentFilters.minAmount ||
      currentFilters.maxAmount,
    [
      currentFilters.search,
      currentFilters.status,
      currentFilters.method,
      currentFilters.startDate,
      currentFilters.endDate,
      currentFilters.minAmount,
      currentFilters.maxAmount,
    ]
  );

  // Memoizar clase de chip para evitar cálculos repetidos
  const chipClass = useCallback(
    (isActive: boolean) =>
      isActive
        ? cn(
            FILTER_CHIP_CLASS,
            FILTER_CHIP_ACTIVE_CLASS,
            "bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-400 text-white border-transparent shadow-lg shadow-emerald-900/35"
          )
        : cn(
            FILTER_CHIP_CLASS,
            "border-emerald-900/45 bg-slate-900/60 text-slate-200 hover:border-emerald-400/70 hover:text-white"
          ),
    []
  );

  return (
    <Card className={FILTER_CARD_CLASS}>
      <div className="space-y-2">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800/50 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white shadow-lg shadow-emerald-900/25">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.4),transparent_55%)]"
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute -right-6 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-emerald-400/25 blur-3xl" aria-hidden="true" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-200/70">Panel estratégico</p>
                <p className="text-3xl font-semibold tracking-tight">Control de pedidos</p>
              </div>
             
              <div className="flex flex-wrap gap-3">
                {heroHighlights.map((highlight) => (
                  <div
                    key={highlight.label}
                    className="min-w-[130px] rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-left"
                  >
                    <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-white/70">{highlight.label}</p>
                    <p className="text-sm font-medium text-white">{highlight.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                className={`${FILTER_RESET_BUTTON_CLASS} text-white/80 transition-all hover:text-white`}
                onClick={handleResetFilters}
              >
                Reiniciar filtros
              </button>
              <Button
                type="button"
                onClick={handleOrdersDownload}
                disabled={isPending}
                size="sm"
                className="h-11 rounded-2xl bg-linear-to-r from-emerald-400 via-teal-500 to-cyan-500 px-5 text-xs font-semibold uppercase tracking-[0.28em] text-white shadow-md shadow-emerald-700/20 transition-all hover:scale-[1.01]"
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <DownloadCloud className="mr-2 h-4 w-4" />
                )}
                Descargar CSV
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
            <div className="pointer-events-none absolute -right-10 top-6 h-24 w-24 rounded-full bg-purple-500/30 blur-3xl" aria-hidden="true" />
            <div className="relative space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">Estados</p>
                  <p className="mt-1 text-sm text-slate-300">Prioriza la etapa de fulfillment que necesita atención.</p>
                </div>
                <span className="rounded-2xl bg-purple-900/40 p-2 text-purple-200">
                  <Tag className="h-4 w-4" />
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {STATUS_QUICK_FILTERS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    className={chipClass(currentFilters.status === preset.value)}
                    onClick={() => handleQuickStatus(preset.value)}
                  >
                    <Tag className="h-3.5 w-3.5" />
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
            <div className="pointer-events-none absolute -left-6 bottom-0 h-24 w-24 rounded-full bg-emerald-400/30 blur-3xl" aria-hidden="true" />
            <div className="relative space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">Métodos</p>
                  <p className="mt-1 text-sm text-slate-300">Detecta tendencias de pago y ajusta tus campañas.</p>
                </div>
                <span className="rounded-2xl bg-emerald-900/40 p-2 text-emerald-200">
                  <TrendingUp className="h-4 w-4" />
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {METHOD_QUICK_FILTERS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    className={chipClass(currentFilters.method === preset.value)}
                    onClick={() => handleQuickMethod(preset.value)}
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
            <div className="pointer-events-none absolute right-0 top-0 h-16 w-16 rounded-full bg-amber-400/30 blur-2xl" aria-hidden="true" />
          <div className="space-y-5">
              <div className="rounded-2xl  shadow-sm bg-slate-900/60">
                <div className="flex items-start justify-between">
                  <div>
                    <p className={FILTER_LABEL_CLASS}>Ticket objetivo</p>
                    <p className="mt-1 text-sm text-slate-300">Define el rango económico ideal para tu análisis.</p>
                  </div>
                  <span className="rounded-2xl bg-emerald-900/40 p-2 text-emerald-200">
                    <DollarSign className="h-4 w-4" />
                  </span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold text-slate-100">Monto mínimo $</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      min="0"
                      className={`${FILTER_INPUT_CLASS} focus:border-emerald-500 focus:ring-emerald-500/30`}
                      value={minAmountValue}
                      onChange={(e) => handleMinAmountChange(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold text-slate-100">Monto máximo $</Label>
                    <Input
                      type="number"
                      placeholder="1000000"
                      min="0"
                      className={`${FILTER_INPUT_CLASS} focus:border-emerald-500 focus:ring-emerald-500/30`}
                      value={maxAmountValue}
                      onChange={(e) => handleMaxAmountChange(e.target.value)}
                    />
                  </div>
                </div>
              </div>

            
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-900 bg-linear-to-br from-slate-950/50 via-slate-900/40 to-slate-950/30 p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 flex-col gap-2">
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
                  placeholder="Buscar por cliente, email..."
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

            <div className="flex flex-1 flex-col gap-3 rounded-2xl  bg-slate-900/60 p-4  md:flex-row md:items-end md:gap-4">
              <div className="space-y-2 flex-1">
                <Label className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                  <div className="rounded-xl bg-orange-900/30 p-1.5">
                    <Calendar className="h-3.5 w-3.5 text-orange-400" />
                  </div>
                  Inicio
                </Label>
                <DatePicker className="h-11" date={currentFilters.startDate} setDate={handleSetStartDate} />
              </div>

              <div className="space-y-2 flex-1">
                <Label className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                  <div className="rounded-xl bg-orange-900/30 p-1.5">
                    <Calendar className="h-3.5 w-3.5 text-orange-400" />
                  </div>
                  Fin
                </Label>
                <DatePicker className="h-11" date={currentFilters.endDate} setDate={handleSetEndDate} />
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
                  <div className="rounded-sm bg-transparent p-0.5 transition-colors group-hover:bg-blue-900/40">
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
                  <Tag className="h-3.5 w-3.5" />
                  <span className="font-medium">{STATUS_LABELS[currentFilters.status] || currentFilters.status}</span>
                  <div className="rounded-sm bg-transparent p-0.5 transition-colors group-hover:bg-purple-900/40">
                    <X className="h-3 w-3" />
                  </div>
                </Badge>
              )}
              {currentFilters.method !== "all" && (
                <Badge
                  variant="secondary"
                  className={`${FILTER_ACTIVE_BADGE_CLASS} border-green-900/50 text-green-200`}
                  onClick={() => handleMethodChange("all")}
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span className="font-medium">{METHOD_LABELS[currentFilters.method] || currentFilters.method}</span>
                  <div className="rounded-sm bg-transparent p-0.5 transition-colors group-hover:bg-green-900/40">
                    <X className="h-3 w-3" />
                  </div>
                </Badge>
              )}
              {(currentFilters.startDate || currentFilters.endDate) && (
                <Badge
                  variant="secondary"
                  className={`${FILTER_ACTIVE_BADGE_CLASS} border-orange-900/50 text-orange-100`}
                  onClick={() => {
                    handleSetStartDate("");
                    handleSetEndDate("");
                  }}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="font-medium">Rango de Fechas</span>
                  <div className="ml-1 rounded-sm p-0.5 transition-colors group-hover:bg-orange-900/40">
                    <X className="h-3 w-3" />
                  </div>
                </Badge>
              )}
              {currentFilters.minAmount && (
                <Badge
                  variant="secondary"
                  className={`${FILTER_ACTIVE_BADGE_CLASS} border-green-900/50 text-green-200`}
                  onClick={() => handleMinAmountChange("")}
                >
                  <DollarSign className="h-3.5 w-3.5" />
                  <span className="font-medium">Min: {formatCurrency(currentFilters.minAmount)}</span>
                  <div className="ml-1 rounded-sm p-0.5 transition-colors group-hover:bg-green-900/40">
                    <X className="h-3 w-3" />
                  </div>
                </Badge>
              )}
              {currentFilters.maxAmount && (
                <Badge
                  variant="secondary"
                  className={`${FILTER_ACTIVE_BADGE_CLASS} border-green-900/50 text-green-200`}
                  onClick={() => handleMaxAmountChange("")}
                >
                  <DollarSign className="h-3.5 w-3.5" />
                  <span className="font-medium">Max: {formatCurrency(currentFilters.maxAmount)}</span>
                  <div className="ml-1 rounded-sm p-0.5 transition-colors group-hover:bg-green-900/40">
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
