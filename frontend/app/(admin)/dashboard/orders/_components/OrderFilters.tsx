"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DownloadCloud, Loader2, Search, Filter, X, Tag, TrendingUp, Calendar } from "lucide-react";

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
import { DatePicker } from "@/app/(admin)/components/shared/DatePicker";

import { exportAsCSV } from "@/app/(admin)/helpers/exportData";
import { exportOrders } from "@/app/(admin)/actions/orders/exportOrders";

export default function OrderFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "",
    method: searchParams.get("method") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  });

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

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.status && filters.status !== "all")
      params.set("status", filters.status);
    if (filters.method && filters.method !== "all")
      params.set("method", filters.method);
    if (filters.startDate) params.set("start-date", filters.startDate);
    if (filters.endDate) params.set("end-date", filters.endDate);

    params.set("page", "1");
    params.set("limit", searchParams.get("limit") || "10");
    router.push(`/orders?${params.toString()}`);
  };

  const handleReset = () => {
    setFilters({
      search: "",
      status: "",
      method: "",
      startDate: "",
      endDate: "",
    });
    router.push("/orders");
  };

  const handleSetStartDate = (date: string) => {
    setFilters({ ...filters, startDate: date });
  };

  const handleSetEndDate = (date: string) => {
    setFilters({ ...filters, endDate: date });
  };

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    (filters.status && filters.status !== "all") ||
    (filters.method && filters.method !== "all") ||
    filters.startDate !== "" ||
    filters.endDate !== "";

  return (
    <Card className="mb-6 p-5 border border-slate-200/60 dark:border-slate-700/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50 rounded-xl">
      <form onSubmit={handleFilter} className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {hasActiveFilters && (
              <Badge className="ml-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs">
                Activo
              </Badge>
            )}
          </div>
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
            Descargar
          </Button>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Buscar por cliente..."
              className="h-10 pl-9 pr-3 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all text-sm"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          {/* Status Select */}
          <div className="relative">
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({ ...filters, status: value })}
            >
              <SelectTrigger className="h-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm capitalize">
                <div className="flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-blue-500" />
                  <SelectValue placeholder="Estado" />
                </div>
              </SelectTrigger>

              <SelectContent className="rounded-lg border-slate-200 dark:border-slate-700">
                <SelectItem value="all" className="text-sm">Todos</SelectItem>
                <SelectItem value="pending" className="text-sm">Pendiente</SelectItem>
                <SelectItem value="processing" className="text-sm">Procesando</SelectItem>
                <SelectItem value="delivered" className="text-sm">Entregado</SelectItem>
                <SelectItem value="cancelled" className="text-sm">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Method Select */}
          <div className="relative">
            <Select
              value={filters.method}
              onValueChange={(value) => setFilters({ ...filters, method: value })}
            >
              <SelectTrigger className="h-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm capitalize">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5 text-purple-500" />
                  <SelectValue placeholder="Método" />
                </div>
              </SelectTrigger>

              <SelectContent className="rounded-lg border-slate-200 dark:border-slate-700">
                <SelectItem value="all" className="text-sm">Todos</SelectItem>
                <SelectItem value="card" className="text-sm">Tarjeta</SelectItem>
                <SelectItem value="cash" className="text-sm">Efectivo</SelectItem>
                <SelectItem value="credit" className="text-sm">Crédito</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1 h-10 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-all duration-200"
            >
              <Filter className="h-3.5 w-3.5 mr-1.5" />
              Aplicar
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 px-4 rounded-lg text-sm transition-all duration-200"
              onClick={handleReset}
              disabled={!hasActiveFilters}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Date Pickers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              Fecha Inicio
            </Label>
            <DatePicker date={filters.startDate} setDate={handleSetStartDate} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              Fecha Fin
            </Label>
            <DatePicker date={filters.endDate} setDate={handleSetEndDate} />
          </div>
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
            {filters.status && filters.status !== "all" && (
              <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs capitalize">
                <Tag className="h-3 w-3 mr-1" />
                {filters.status}
              </Badge>
            )}
            {filters.method && filters.method !== "all" && (
              <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs capitalize">
                <TrendingUp className="h-3 w-3 mr-1" />
                {filters.method}
              </Badge>
            )}
            {(filters.startDate || filters.endDate) && (
              <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                Rango de Fechas
              </Badge>
            )}
          </div>
        )}
      </form>
    </Card>
  );
}
