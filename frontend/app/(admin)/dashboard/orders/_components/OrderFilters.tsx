"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DownloadCloud, Loader2, Search, X, Tag, TrendingUp, Calendar, DollarSign } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/app/(admin)/components/shared/DatePicker";

import { exportAsCSV } from "@/app/(admin)/helpers/exportData";
import { exportOrders } from "@/app/(admin)/actions/orders/exportOrders";

export default function OrderFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Estado local para inputs con debounce
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [minAmountValue, setMinAmountValue] = useState(searchParams.get("minAmount") || "");
  const [maxAmountValue, setMaxAmountValue] = useState(searchParams.get("maxAmount") || "");

  // Estado sincronizado con URL
  const currentFilters = {
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "all",
    method: searchParams.get("method") || "all",
    startDate: searchParams.get("start-date") || "",
    endDate: searchParams.get("end-date") || "",
    minAmount: searchParams.get("minAmount") || "",
    maxAmount: searchParams.get("maxAmount") || "",
  };

  const handleOrdersDownload = () => {
    toast.info(`Downloading orders...`);

    startTransition(async () => {
      const result = await exportOrders();

      if (result.error) {
        toast.error(result.error);
      } else if (result.data) {
        exportAsCSV(result.data, "Orders");
      }
    });
  };

  // Función para aplicar filtros automáticamente
  const applyFilters = useCallback((newFilters: Record<string, string>) => {
    const params = new URLSearchParams();

    // Búsqueda
    if (newFilters.search) {
      params.set("search", newFilters.search);
    }

    // Estado
    if (newFilters.status && newFilters.status !== "all") {
      params.set("status", newFilters.status);
    }

    // Método
    if (newFilters.method && newFilters.method !== "all") {
      params.set("method", newFilters.method);
    }

    // Fechas
    if (newFilters.startDate) {
      params.set("start-date", newFilters.startDate);
    }
    if (newFilters.endDate) {
      params.set("end-date", newFilters.endDate);
    }

    // Rangos de monto
    if (newFilters.minAmount) {
      params.set("minAmount", newFilters.minAmount);
    }
    if (newFilters.maxAmount) {
      params.set("maxAmount", newFilters.maxAmount);
    }

    // Mantener sorting si existe
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);

    // Resetear a página 1
    params.set("page", "1");

    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  // Handlers para cambios inmediatos (dropdowns y fechas)
  const handleStatusChange = (value: string) => {
    applyFilters({ ...currentFilters, status: value });
  };

  const handleMethodChange = (value: string) => {
    applyFilters({ ...currentFilters, method: value });
  };

  const handleSetStartDate = (date: string) => {
    applyFilters({ ...currentFilters, startDate: date });
  };

  const handleSetEndDate = (date: string) => {
    applyFilters({ ...currentFilters, endDate: date });
  };

  // Handler para búsqueda con debounce
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  // Handlers para rangos con debounce
  const handleMinAmountChange = (value: string) => {
    setMinAmountValue(value);
  };

  const handleMaxAmountChange = (value: string) => {
    setMaxAmountValue(value);
  };

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== currentFilters.search) {
        applyFilters({ ...currentFilters, search: searchValue });
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Debounce para monto mínimo
  useEffect(() => {
    const timer = setTimeout(() => {
      if (minAmountValue !== currentFilters.minAmount) {
        applyFilters({ ...currentFilters, minAmount: minAmountValue });
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [minAmountValue]);

  // Debounce para monto máximo
  useEffect(() => {
    const timer = setTimeout(() => {
      if (maxAmountValue !== currentFilters.maxAmount) {
        applyFilters({ ...currentFilters, maxAmount: maxAmountValue });
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [maxAmountValue]);

  const hasActiveFilters =
    currentFilters.search ||
    currentFilters.status !== "all" ||
    currentFilters.method !== "all" ||
    currentFilters.startDate ||
    currentFilters.endDate ||
    currentFilters.minAmount ||
    currentFilters.maxAmount;

  return (
    <Card className="mb-8 overflow-hidden border-0 bg-linear-to-br from-white via-slate-50 to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/30 backdrop-blur-sm">
      <div className="p-6 space-y-5">
        {/* Header con botón de descarga */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Filtros de Órdenes</h3>
          <Button
            type="button"
            onClick={handleOrdersDownload}
            disabled={isPending}
            size="sm"
            className="h-9 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            ) : (
              <DownloadCloud className="mr-2 h-3.5 w-3.5" />
            )}
            Descargar CSV
          </Button>
        </div>

        {/* Grid principal de filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-2">
          {/* Búsqueda */}
          <div className="md:col-span-3 lg:col-span-4 space-y-2.5">
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
                placeholder="Buscar por cliente, email..."
                className="h-12 pl-12 pr-12 text-base bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
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
          <div className="flex justify-around items-center w-full lg:justify-evenly lg:col-span-4">
            <div className=" space-y-3">
              <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/30">
                  <Tag className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                </div>
                Estado
              </Label>
              <Select value={currentFilters.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="h-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-purple-300 dark:hover:border-purple-700 transition-colors shadow-sm">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-xl">
                  <SelectItem value="all" className="rounded-lg">Todos</SelectItem>
                  <SelectItem value="pending" className="rounded-lg">Pendiente</SelectItem>
                  <SelectItem value="processing" className="rounded-lg">Procesando</SelectItem>
                  <SelectItem value="delivered" className="rounded-lg">Entregado</SelectItem>
                  <SelectItem value="cancelled" className="rounded-lg">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Método de Pago */}
            <div className=" space-y-3">
              <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30">
                  <TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                </div>
                Método
              </Label>
              <Select value={currentFilters.method} onValueChange={handleMethodChange}>
                <SelectTrigger className="h-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-green-300 dark:hover:border-green-700 transition-colors shadow-sm">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-xl">
                  <SelectItem value="all" className="rounded-lg">Todos</SelectItem>
                  <SelectItem value="card" className="rounded-lg">Tarjeta</SelectItem>
                  <SelectItem value="cash" className="rounded-lg">Efectivo</SelectItem>
                  <SelectItem value="credit" className="rounded-lg">Crédito</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Fecha Inicio */}
            <div className=" space-y-2.5">
              <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-orange-100 dark:bg-orange-900/30">
                  <Calendar className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                </div>
                Inicio
              </Label>
              <DatePicker date={currentFilters.startDate} setDate={handleSetStartDate} />
            </div>

            {/* Fecha Fin */}
            <div className=" space-y-2.5">
              <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-orange-100 dark:bg-orange-900/30">
                  <Calendar className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                </div>
                Fin
              </Label>
              <DatePicker date={currentFilters.endDate} setDate={handleSetEndDate} />
            </div>
          </div>
          {/* Estado */}

        </div>

        <Separator className="dark:bg-slate-700/50" />

        {/* Grid secundario - Rangos de monto */}
        <div className="grid grid-cols-2 gap-5">
          {/* Monto Mínimo */}
          <div className="space-y-2.5">
            <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30">
                <DollarSign className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              </div>
              Monto Mínimo $
            </Label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              className="h-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
              value={minAmountValue}
              onChange={(e) => handleMinAmountChange(e.target.value)}
            />
          </div>

          {/* Monto Máximo */}
          <div className="space-y-2.5">
            <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30">
                <DollarSign className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              </div>
              Monto Máximo $
            </Label>
            <Input
              type="number"
              placeholder="1000000"
              min="0"
              className="h-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
              value={maxAmountValue}
              onChange={(e) => handleMaxAmountChange(e.target.value)}
            />
          </div>
        </div>

        {/* Filtros activos */}
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
                {currentFilters.status !== "all" && (
                  <Badge
                    variant="secondary"
                    className="gap-1.5 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors pl-2 pr-1.5 py-1.5 border border-purple-200 dark:border-purple-800 capitalize"
                    onClick={() => handleStatusChange("all")}
                  >
                    <Tag className="h-3.5 w-3.5" />
                    <span className="font-medium">{currentFilters.status}</span>
                    <div className="ml-1 p-0.5 rounded-sm hover:bg-purple-200 dark:hover:bg-purple-800">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.method !== "all" && (
                  <Badge
                    variant="secondary"
                    className="gap-1.5 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors pl-2 pr-1.5 py-1.5 border border-green-200 dark:border-green-800 capitalize"
                    onClick={() => handleMethodChange("all")}
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span className="font-medium">{currentFilters.method}</span>
                    <div className="ml-1 p-0.5 rounded-sm hover:bg-green-200 dark:hover:bg-green-800">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {(currentFilters.startDate || currentFilters.endDate) && (
                  <Badge
                    variant="secondary"
                    className="gap-1.5 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors pl-2 pr-1.5 py-1.5 border border-orange-200 dark:border-orange-800"
                    onClick={() => {
                      handleSetStartDate("");
                      handleSetEndDate("");
                    }}
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="font-medium">Rango de Fechas</span>
                    <div className="ml-1 p-0.5 rounded-sm hover:bg-orange-200 dark:hover:bg-orange-800">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.minAmount && (
                  <Badge
                    variant="secondary"
                    className="gap-1.5 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors pl-2 pr-1.5 py-1.5 border border-green-200 dark:border-green-800"
                    onClick={() => handleMinAmountChange("")}
                  >
                    <DollarSign className="h-3.5 w-3.5" />
                    <span className="font-medium">Min: ${parseInt(currentFilters.minAmount).toLocaleString()}</span>
                    <div className="ml-1 p-0.5 rounded-sm hover:bg-green-200 dark:hover:bg-green-800">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.maxAmount && (
                  <Badge
                    variant="secondary"
                    className="gap-1.5 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors pl-2 pr-1.5 py-1.5 border border-green-200 dark:border-green-800"
                    onClick={() => handleMaxAmountChange("")}
                  >
                    <DollarSign className="h-3.5 w-3.5" />
                    <span className="font-medium">Max: ${parseInt(currentFilters.maxAmount).toLocaleString()}</span>
                    <div className="ml-1 p-0.5 rounded-sm hover:bg-green-200 dark:hover:bg-green-800">
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
