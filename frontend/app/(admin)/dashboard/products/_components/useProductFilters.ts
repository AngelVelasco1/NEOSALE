import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchCategoriesDropdown } from "@/app/(admin)/services/categories";
import { fetchBrandsDropdown } from "@/app/(admin)/services/brands";
import { useDebouncedValue } from "./constants";

export interface ProductFiltersState {
  search: string;
  category: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  publishedFilter: string;
  stockFilter: string;
  minStock: string;
  maxStock: string;
}

export function useProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Memoized search params to avoid unnecessary recalculations
  const searchParamsRaw = useMemo(() => searchParams.toString(), [searchParams]);

  // Filters signature for change detection
  const filtersSignature = useMemo(() => {
    const params = new URLSearchParams(searchParamsRaw);
    params.delete("page");
    params.delete("limit");
    return params.toString();
  }, [searchParamsRaw]);

  // Single state object for all filters to reduce re-renders
  const [filters, setFilters] = useState<ProductFiltersState>(() => ({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "all",
    brand: searchParams.get("brand") || "all",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    publishedFilter: searchParams.get("published") || "all",
    stockFilter: searchParams.get("status") || "all",
    minStock: searchParams.get("minStock") || "",
    maxStock: searchParams.get("maxStock") || "",
  }));

  // Debounced search value
  const debouncedSearch = useDebouncedValue(filters.search, 350);
  const isLoadingSearch = filters.search !== debouncedSearch;

  // Memoized current filters for comparison
  const currentFilters = useMemo(() => filters, [filters]);

  // Apply filters function - memoized to prevent unnecessary re-creations
  const applyFilters = useCallback(
    (newFilters: Partial<ProductFiltersState>) => {
      const updatedFilters = { ...currentFilters, ...newFilters };
      const params = new URLSearchParams();

      // Only add params if they differ from defaults
      if (updatedFilters.search) params.set("search", updatedFilters.search);
      if (updatedFilters.category && updatedFilters.category !== "all") params.set("category", updatedFilters.category);
      if (updatedFilters.brand && updatedFilters.brand !== "all") params.set("brand", updatedFilters.brand);
      if (updatedFilters.minPrice) params.set("minPrice", updatedFilters.minPrice);
      if (updatedFilters.maxPrice) params.set("maxPrice", updatedFilters.maxPrice);
      if (updatedFilters.publishedFilter && updatedFilters.publishedFilter !== "all") params.set("published", updatedFilters.publishedFilter);
      if (updatedFilters.stockFilter && updatedFilters.stockFilter !== "all") params.set("status", updatedFilters.stockFilter);
      if (updatedFilters.minStock) params.set("minStock", updatedFilters.minStock);
      if (updatedFilters.maxStock) params.set("maxStock", updatedFilters.maxStock);

      const nextFiltersSignature = params.toString();
      if (nextFiltersSignature === filtersSignature) return;

      params.set("page", "1");
      params.set("limit", searchParams.get("limit") || "10");

      router.push(`/dashboard/products?${params.toString()}`, { scroll: false });
    },
    [currentFilters, filtersSignature, router, searchParams]
  );

  // Effect for debounced search
  useEffect(() => {
    if (debouncedSearch !== currentFilters.search) {
      applyFilters({ search: debouncedSearch });
    }
  }, [debouncedSearch, currentFilters.search, applyFilters]);

  // Effects for price and stock ranges with optimized timers
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters({ minPrice: filters.minPrice, maxPrice: filters.maxPrice });
    }, 800);
    return () => clearTimeout(timer);
  }, [filters.minPrice, filters.maxPrice, applyFilters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters({ minStock: filters.minStock, maxStock: filters.maxStock });
    }, 800);
    return () => clearTimeout(timer);
  }, [filters.minStock, filters.maxStock, applyFilters]);

  // Handler functions - memoized
  const handleSearchChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, category: value }));
    applyFilters({ category: value });
  }, [applyFilters]);

  const handleBrandChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, brand: value }));
    applyFilters({ brand: value });
  }, [applyFilters]);

  const handleMinPriceChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, minPrice: value }));
  }, []);

  const handleMaxPriceChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, maxPrice: value }));
  }, []);

  const handlePublishedFilter = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, publishedFilter: value }));
    applyFilters({ publishedFilter: value });
  }, [applyFilters]);

  const handleStockFilter = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, stockFilter: value }));
    applyFilters({ stockFilter: value });
  }, [applyFilters]);

  const handleMinStockChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, minStock: value }));
  }, []);

  const handleMaxStockChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, maxStock: value }));
  }, []);

  const handleQuickPublished = useCallback((value: string) => {
    const next = currentFilters.publishedFilter === value ? "all" : value;
    handlePublishedFilter(next);
  }, [currentFilters.publishedFilter, handlePublishedFilter]);

  const handleQuickStockStatus = useCallback((value: string) => {
    const next = currentFilters.stockFilter === value ? "all" : value;
    handleStockFilter(next);
  }, [currentFilters.stockFilter, handleStockFilter]);

  const handleQuickPrice = useCallback((min?: string, max?: string) => {
    setFilters(prev => ({ ...prev, minPrice: min || "", maxPrice: max || "" }));
    applyFilters({ minPrice: min || "", maxPrice: max || "" });
  }, [applyFilters]);

  const handleQuickStockRange = useCallback((min?: string, max?: string) => {
    setFilters(prev => ({ ...prev, minStock: min || "", maxStock: max || "" }));
    applyFilters({ minStock: min || "", maxStock: max || "" });
  }, [applyFilters]);

  const handleResetFilters = useCallback(() => {
    const resetState: ProductFiltersState = {
      search: "",
      category: "all",
      brand: "all",
      minPrice: "",
      maxPrice: "",
      publishedFilter: "all",
      stockFilter: "all",
      minStock: "",
      maxStock: "",
    };
    setFilters(resetState);
    applyFilters(resetState);
  }, [applyFilters]);

  // Memoized hasActiveFilters
  const hasActiveFilters = useMemo(
    () =>
      currentFilters.search ||
      currentFilters.category !== "all" ||
      currentFilters.brand !== "all" ||
      currentFilters.minPrice ||
      currentFilters.maxPrice ||
      currentFilters.publishedFilter !== "all" ||
      currentFilters.stockFilter !== "all" ||
      currentFilters.minStock ||
      currentFilters.maxStock,
    [currentFilters]
  );

  // Queries with optimized caching
  const categoriesQuery = useQuery({
    queryKey: ["categories", "dropdown"],
    queryFn: fetchCategoriesDropdown,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });

  const brandsQuery = useQuery({
    queryKey: ["brands", "dropdown"],
    queryFn: fetchBrandsDropdown,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });

  return {
    // State
    filters: currentFilters,
    isLoadingSearch,
    hasActiveFilters,

    // Data
    categories: categoriesQuery.data,
    isLoadingCategories: categoriesQuery.isLoading,
    isErrorCategories: categoriesQuery.isError,

    brands: brandsQuery.data,
    isLoadingBrands: brandsQuery.isLoading,
    isErrorBrands: brandsQuery.isError,

    // Handlers
    handleSearchChange,
    handleCategoryChange,
    handleBrandChange,
    handleMinPriceChange,
    handleMaxPriceChange,
    handlePublishedFilter,
    handleStockFilter,
    handleMinStockChange,
    handleMaxStockChange,
    handleQuickPublished,
    handleQuickStockStatus,
    handleQuickPrice,
    handleQuickStockRange,
    handleResetFilters,
  };
}