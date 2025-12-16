"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useState } from "react";

export default function ReviewsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    router.push(`/dashboard/reviews?${params.toString()}`);
  };

  const handleRatingChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("rating");
    } else {
      params.set("rating", value);
    }
    router.push(`/dashboard/reviews?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchValue.trim()) {
      params.set("search", searchValue.trim());
    } else {
      params.delete("search");
    }
    router.push(`/dashboard/reviews?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchValue("");
    router.push("/dashboard/reviews");
  };

  const hasFilters =
    searchParams.has("status") ||
    searchParams.has("rating") ||
    searchParams.has("search");

  return (
    <div className="mt-4 space-y-4">
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Buscar por producto o usuario..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="border-slate-700/50 bg-slate-800/50 pl-10 text-slate-100 placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <Button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/30"
        >
          Buscar
        </Button>
      </form>

      <div className="flex flex-wrap gap-3">
        <Select
          defaultValue={searchParams.get("status") || "all"}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[180px] border-slate-700/50 bg-slate-800/50 text-slate-100 hover:border-slate-600/50 focus:ring-2 focus:ring-blue-500/20 transition-all">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent className="border-slate-700/50 bg-slate-900">
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="approved">Aprobadas</SelectItem>
          </SelectContent>
        </Select>

        <Select
          defaultValue={searchParams.get("rating") || "all"}
          onValueChange={handleRatingChange}
        >
          <SelectTrigger className="w-[180px] border-slate-700/50 bg-slate-800/50 text-slate-100 hover:border-slate-600/50 focus:ring-2 focus:ring-blue-500/20 transition-all">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent className="border-slate-700/50 bg-slate-900">
            <SelectItem value="all">Todos los ratings</SelectItem>
            <SelectItem value="5">⭐⭐⭐⭐⭐ (5)</SelectItem>
            <SelectItem value="4">⭐⭐⭐⭐ (4)</SelectItem>
            <SelectItem value="3">⭐⭐⭐ (3)</SelectItem>
            <SelectItem value="2">⭐⭐ (2)</SelectItem>
            <SelectItem value="1">⭐ (1)</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="border-rose-500/30 bg-rose-950/30 text-rose-400 hover:bg-rose-950/50 hover:border-rose-500/50 transition-all"
          >
            <X className="mr-2 h-4 w-4" />
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
}
