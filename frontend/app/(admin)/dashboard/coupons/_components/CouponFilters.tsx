"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, ToggleLeft, Percent, DollarSign, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CouponFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state for inputs
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [discountType, setDiscountType] = useState(searchParams.get("discountType") || "all");
  const [minDiscount, setMinDiscount] = useState(searchParams.get("minDiscount") || "");
  const [maxDiscount, setMaxDiscount] = useState(searchParams.get("maxDiscount") || "");

  // Apply filters callback
  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Preserve sorting
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);

    // Apply filters
    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }

    if (status && status !== "all") {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    if (discountType && discountType !== "all") {
      params.set("discountType", discountType);
    } else {
      params.delete("discountType");
    }

    if (minDiscount) {
      params.set("minDiscount", minDiscount);
    } else {
      params.delete("minDiscount");
    }

    if (maxDiscount) {
      params.set("maxDiscount", maxDiscount);
    } else {
      params.delete("maxDiscount");
    }

    params.set("page", "1");
    params.set("limit", searchParams.get("limit") || "10");

    router.push(`/dashboard/coupons?${params.toString()}`, { scroll: false });
  }, [search, status, discountType, minDiscount, maxDiscount, searchParams, router]);

  // Debounce for search and numeric inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 800);

    return () => clearTimeout(timer);
  }, [search, minDiscount, maxDiscount, applyFilters]);

  // Immediate apply for dropdowns
  useEffect(() => {
    applyFilters();
  }, [status, discountType]);

  // Clear individual filter
  const clearFilter = (filterName: string) => {
    switch (filterName) {
      case "search":
        setSearch("");
        break;
      case "status":
        setStatus("all");
        break;
      case "discountType":
        setDiscountType("all");
        break;
      case "minDiscount":
        setMinDiscount("");
        break;
      case "maxDiscount":
        setMaxDiscount("");
        break;
    }
  };

  // Check if has active filters
  const hasActiveFilters =
    search.trim() !== "" ||
    (status && status !== "all") ||
    (discountType && discountType !== "all") ||
    minDiscount !== "" ||
    maxDiscount !== "";

  return (
    <Card className="mb-6 p-6 border-0 bg-gradient-to-br from-white via-slate-50 to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 backdrop-blur-xl shadow-xl rounded-2xl">
      <div className="space-y-5">
        {/* Main Filters Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search - 2 columns */}
          <div className="lg:col-span-2 relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input
              type="search"
              placeholder="Buscar por código o nombre..."
              className="h-11 pl-10 pr-4 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-600/30 transition-all text-sm shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative group">
            <ToggleLeft className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-10" />
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-11 pl-10 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-sm">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="expired">Expirados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Discount Type Filter */}
          <div className="relative group">
            <Percent className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-10" />
            <Select value={discountType} onValueChange={setDiscountType}>
              <SelectTrigger className="h-11 pl-10 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-sm">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="percentage">Porcentaje</SelectItem>
                <SelectItem value="fixed">Fijo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Discount Range Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Min Discount */}
          <div className="relative group">
            <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input
              type="number"
              placeholder="Descuento mínimo"
              className="h-11 pl-10 pr-4 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-600/30 transition-all text-sm shadow-sm"
              value={minDiscount}
              onChange={(e) => setMinDiscount(e.target.value)}
              min="0"
            />
          </div>

          {/* Max Discount */}
          <div className="relative group">
            <TrendingUp className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input
              type="number"
              placeholder="Descuento máximo"
              className="h-11 pl-10 pr-4 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-600/30 transition-all text-sm shadow-sm"
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(e.target.value)}
              min="0"
            />
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              Filtros activos:
            </span>
            {search && (
              <Badge
                className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors cursor-pointer text-xs font-medium px-3 py-1.5 gap-1.5"
                onClick={() => clearFilter("search")}
              >
                <Search className="h-3 w-3" />
                {search}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            )}
            {status && status !== "all" && (
              <Badge
                className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors cursor-pointer text-xs font-medium px-3 py-1.5 gap-1.5"
                onClick={() => clearFilter("status")}
              >
                <ToggleLeft className="h-3 w-3" />
                {status === "active" ? "Activos" : "Expirados"}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            )}
            {discountType && discountType !== "all" && (
              <Badge
                className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors cursor-pointer text-xs font-medium px-3 py-1.5 gap-1.5"
                onClick={() => clearFilter("discountType")}
              >
                <Percent className="h-3 w-3" />
                {discountType === "percentage" ? "Porcentaje" : "Fijo"}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            )}
            {minDiscount && (
              <Badge
                className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors cursor-pointer text-xs font-medium px-3 py-1.5 gap-1.5"
                onClick={() => clearFilter("minDiscount")}
              >
                <DollarSign className="h-3 w-3" />
                Min: {minDiscount}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            )}
            {maxDiscount && (
              <Badge
                className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors cursor-pointer text-xs font-medium px-3 py-1.5 gap-1.5"
                onClick={() => clearFilter("maxDiscount")}
              >
                <TrendingUp className="h-3 w-3" />
                Max: {maxDiscount}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
