"use client";

import { useMemo, useCallback } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import ProductsTable from "./Table";
import { getColumns, skeletonColumns } from "./columns";
import TableSkeleton from "@/app/(admin)/components/shared/table/TableSkeleton";
import TableError from "@/app/(admin)/components/shared/table/TableError";

import { getSearchParams } from "@/app/(admin)/helpers/getSearchParams";
import { fetchProducts } from "@/app/(admin)/services/products";
import { RowSelectionProps } from "@/app/(admin)/types/data-table";
import { useAuthorization } from "@/app/(admin)/hooks/use-authorization";
import { useStableSearchParams } from "@/app/(admin)/hooks/use-stable-search-params";

// Configuración optimizada para cache
const STALE_TIME = 3 * 60 * 1000; // 3 minutos - datos frescos por más tiempo
const GC_TIME = 10 * 60 * 1000; // 10 minutos - mantener en cache más tiempo

export default function AllProducts({
  rowSelection,
  setRowSelection,
}: RowSelectionProps) {
  const { hasPermission } = useAuthorization();
  
  // Memoizar columnas para evitar recalculos en cada render
  const columns = useMemo(
    () => getColumns({ hasPermission }),
    [hasPermission]
  );
  
  const { searchParams, searchParamsString } = useStableSearchParams();

  const {
    page,
    limit,
    search,
    category,
    price,
    published,
    status,
    date,
    sortBy,
    sortOrder,
  } = getSearchParams(searchParams);

  // Obtener params adicionales
  const brand = searchParams.get("brand") || undefined;
  const minPrice = searchParams.get("minPrice") || undefined;
  const maxPrice = searchParams.get("maxPrice") || undefined;
  const minStock = searchParams.get("minStock") || undefined;
  const maxStock = searchParams.get("maxStock") || undefined;

  // Usar string de parámetros como dependencia para evitar refetches innecesarios
  const queryKey = useMemo(
    () => [
      "products",
      searchParamsString,
    ],
    [searchParamsString]
  );

  const queryFn = useCallback(
    () =>
      fetchProducts({
        page: page || 1,
        limit: limit || 10,
        search,
        category,
        brand,
        priceSort: price,
        minPrice,
        maxPrice,
        status,
        minStock,
        maxStock,
        published,
        dateSort: date,
        sortBy,
        sortOrder,
      }),
    [page, limit, search, category, brand, price, minPrice, maxPrice, status, minStock, maxStock, published, date, sortBy, sortOrder]
  );

  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn,
    placeholderData: keepPreviousData,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    // Las siguientes opciones ya están en el QueryClient global
    // pero se pueden sobreescribir aquí si es necesario
  });

  if (isLoading)
    return <TableSkeleton perPage={limit} columns={skeletonColumns} />;

  if (isError || !products)
    return (
      <TableError
        errorMessage="Something went wrong while trying to fetch products."
        refetch={refetch}
      />
    );



  return (
    <ProductsTable
      columns={columns}
      data={products.data}
      pagination={products.pagination}
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
    />
  );
}
