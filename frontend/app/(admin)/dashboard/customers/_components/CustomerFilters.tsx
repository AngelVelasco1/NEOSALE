"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  X,
  DollarSign,
  ShieldCheck,
  ShoppingBag,
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

export default function CustomerFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estado local para el input de búsqueda y rangos
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [minOrdersValue, setMinOrdersValue] = useState(searchParams.get("minOrders") || "");
  const [maxOrdersValue, setMaxOrdersValue] = useState(searchParams.get("maxOrders") || "");
  const [minSpentValue, setMinSpentValue] = useState(searchParams.get("minSpent") || "");
  const [maxSpentValue, setMaxSpentValue] = useState(searchParams.get("maxSpent") || "");

  // Estado sincronizado con URL
  const currentFilters = {
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "all",
    minOrders: searchParams.get("minOrders") || "",
    maxOrders: searchParams.get("maxOrders") || "",
    minSpent: searchParams.get("minSpent") || "",
    maxSpent: searchParams.get("maxSpent") || "",
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

    // Rango de órdenes
    if (newFilters.minOrders) {
      params.set("minOrders", newFilters.minOrders);
    }
    if (newFilters.maxOrders) {
      params.set("maxOrders", newFilters.maxOrders);
    }

    // Rango de gasto
    if (newFilters.minSpent) {
      params.set("minSpent", newFilters.minSpent);
    }
    if (newFilters.maxSpent) {
      params.set("maxSpent", newFilters.maxSpent);
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

  // Handlers para cambios inmediatos (dropdowns)
  const handleStatusChange = (value: string) => {
    applyFilters({ ...currentFilters, status: value });
  };

  // Handler para búsqueda con debounce
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  // Handlers para rangos con debounce
  const handleMinOrdersChange = (value: string) => {
    setMinOrdersValue(value);
  };

  const handleMaxOrdersChange = (value: string) => {
    setMaxOrdersValue(value);
  };

  const handleMinSpentChange = (value: string) => {
    setMinSpentValue(value);
  };

  const handleMaxSpentChange = (value: string) => {
    setMaxSpentValue(value);
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

  // Debounce para órdenes mínimas
  useEffect(() => {
    const timer = setTimeout(() => {
      if (minOrdersValue !== currentFilters.minOrders) {
        applyFilters({ ...currentFilters, minOrders: minOrdersValue });
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [minOrdersValue]);

  // Debounce para órdenes máximas
  useEffect(() => {
    const timer = setTimeout(() => {
      if (maxOrdersValue !== currentFilters.maxOrders) {
        applyFilters({ ...currentFilters, maxOrders: maxOrdersValue });
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [maxOrdersValue]);

  // Debounce para gasto mínimo
  useEffect(() => {
    const timer = setTimeout(() => {
      if (minSpentValue !== currentFilters.minSpent) {
        applyFilters({ ...currentFilters, minSpent: minSpentValue });
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [minSpentValue]);

  // Debounce para gasto máximo
  useEffect(() => {
    const timer = setTimeout(() => {
      if (maxSpentValue !== currentFilters.maxSpent) {
        applyFilters({ ...currentFilters, maxSpent: maxSpentValue });
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [maxSpentValue]);

  const hasActiveFilters =
    currentFilters.search ||
    currentFilters.status !== "all" ||
    currentFilters.minOrders ||
    currentFilters.maxOrders ||
    currentFilters.minSpent ||
    currentFilters.maxSpent;

  return (
    <Card className="mb-8 overflow-hidden border-0 bg-linear-to-br from-white via-slate-50 to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/30 backdrop-blur-sm">
      <div className="p-6 space-y-5">
        {/* Grid principal de filtros - Búsqueda + Selectores principales */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Búsqueda - ocupa más espacio */}
          <div className="lg:col-span-9 space-y-2.5">
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
                placeholder="Buscar por nombre, email..."
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

          {/* Estado */}
          <div className="lg:col-span-3 space-y-2.5">
            <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30">
                <ShieldCheck className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              </div>
              Estado
            </Label>
            <Select value={currentFilters.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="h-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-green-300 dark:hover:border-green-700 transition-colors shadow-sm">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-xl">
                <SelectItem value="all" className="rounded-lg">Todos</SelectItem>
                <SelectItem value="true" className="rounded-lg">Activos</SelectItem>
                <SelectItem value="false" className="rounded-lg">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator className="dark:bg-slate-700/50" />

        {/* Grid secundario - Rangos numéricos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {/* Órdenes Mínimas */}
          <div className="space-y-2.5">
            <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/30">
                <ShoppingBag className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              </div>
              Min Órdenes
            </Label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              className="h-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm"
              value={minOrdersValue}
              onChange={(e) => handleMinOrdersChange(e.target.value)}
            />
          </div>

          {/* Órdenes Máximas */}
          <div className="space-y-2.5">
            <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/30">
                <ShoppingBag className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              </div>
              Max Órdenes
            </Label>
            <Input
              type="number"
              placeholder="100"
              min="0"
              className="h-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm"
              value={maxOrdersValue}
              onChange={(e) => handleMaxOrdersChange(e.target.value)}
            />
          </div>

          {/* Gasto Mínimo */}
          <div className="space-y-2.5">
            <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30">
                <DollarSign className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              </div>
              Min Gastado $
            </Label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              className="h-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
              value={minSpentValue}
              onChange={(e) => handleMinSpentChange(e.target.value)}
            />
          </div>

          {/* Gasto Máximo */}
          <div className="space-y-2.5">
            <Label className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30">
                <DollarSign className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              </div>
              Max Gastado $
            </Label>
            <Input
              type="number"
              placeholder="1000000"
              min="0"
              className="h-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
              value={maxSpentValue}
              onChange={(e) => handleMaxSpentChange(e.target.value)}
            />
          </div>
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
                {currentFilters.status !== "all" && (
                  <Badge
                    variant="secondary"
                    className="gap-1.5 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors pl-2 pr-1.5 py-1.5 border border-green-200 dark:border-green-800"
                    onClick={() => handleStatusChange("all")}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span className="font-medium">{currentFilters.status === "true" ? "Activos" : "Inactivos"}</span>
                    <div className="ml-1 p-0.5 rounded-sm hover:bg-green-200 dark:hover:bg-green-800">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.minOrders && (
                  <Badge
                    variant="secondary"
                    className="gap-1.5 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors pl-2 pr-1.5 py-1.5 border border-purple-200 dark:border-purple-800"
                    onClick={() => handleMinOrdersChange("")}
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span className="font-medium">Min Órdenes: {currentFilters.minOrders}</span>
                    <div className="ml-1 p-0.5 rounded-sm hover:bg-purple-200 dark:hover:bg-purple-800">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.maxOrders && (
                  <Badge
                    variant="secondary"
                    className="gap-1.5 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors pl-2 pr-1.5 py-1.5 border border-purple-200 dark:border-purple-800"
                    onClick={() => handleMaxOrdersChange("")}
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span className="font-medium">Max Órdenes: {currentFilters.maxOrders}</span>
                    <div className="ml-1 p-0.5 rounded-sm hover:bg-purple-200 dark:hover:bg-purple-800">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.minSpent && (
                  <Badge
                    variant="secondary"
                    className="gap-1.5 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors pl-2 pr-1.5 py-1.5 border border-green-200 dark:border-green-800"
                    onClick={() => handleMinSpentChange("")}
                  >
                    <DollarSign className="h-3.5 w-3.5" />
                    <span className="font-medium">Min: ${parseInt(currentFilters.minSpent).toLocaleString()}</span>
                    <div className="ml-1 p-0.5 rounded-sm hover:bg-green-200 dark:hover:bg-green-800">
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                )}
                {currentFilters.maxSpent && (
                  <Badge
                    variant="secondary"
                    className="gap-1.5 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors pl-2 pr-1.5 py-1.5 border border-green-200 dark:border-green-800"
                    onClick={() => handleMaxSpentChange("")}
                  >
                    <DollarSign className="h-3.5 w-3.5" />
                    <span className="font-medium">Max: ${parseInt(currentFilters.maxSpent).toLocaleString()}</span>
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
