"use client";

import { useMemo, useCallback } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import CustomersTable from "./Table";
import { getColumns, skeletonColumns } from "./columns";
import TableSkeleton from "@/app/(admin)/components/shared/table/TableSkeleton";
import TableError from "@/app/(admin)/components/shared/table/TableError";

import { getSearchParams } from "@/app/(admin)/helpers/getSearchParams";
import { fetchCustomers } from "@/app/(admin)/services/customers";
import { useAuthorization } from "@/app/(admin)/hooks/use-authorization";
import { useStableSearchParams } from "@/app/(admin)/hooks/use-stable-search-params";

const STALE_TIME = 60 * 1000; // 1 minute
const GC_TIME = 5 * 60 * 1000; // 5 minutes

export default function AllCustomers() {
  const { hasPermission } = useAuthorization();
  const columns = useMemo(() => getColumns({ hasPermission }), [hasPermission]);
  const { searchParams, searchParamsString } = useStableSearchParams();
  const {
    page,
    limit,
    search,
    status,
    sortBy,
    sortOrder
  } = getSearchParams(searchParams);

  // Extraer filtros adicionales de los searchParams
  const minOrders = searchParams.get("minOrders") || undefined;
  const maxOrders = searchParams.get("maxOrders") || undefined;
  const minSpent = searchParams.get("minSpent") || undefined;
  const maxSpent = searchParams.get("maxSpent") || undefined;
  const perPage = limit || 10;

  const queryKey = useMemo(
    () => ["customers", searchParamsString],
    [searchParamsString]
  );

  const queryFn = useCallback(
    () =>
      fetchCustomers({
        page: page || 1,
        limit: perPage,
        search,
        status,
        minOrders,
        maxOrders,
        minSpent,
        maxSpent,
        sortBy,
        sortOrder,
      }),
    [page, perPage, search, status, minOrders, maxOrders, minSpent, maxSpent, sortBy, sortOrder]
  );

  const {
    data: customers,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn,
    placeholderData: keepPreviousData,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  if (isLoading)
    return <TableSkeleton perPage={perPage} columns={skeletonColumns} />;

  if (isError || !customers)
    return (
      <TableError
        errorMessage="Something went wrong while trying to fetch customers."
        refetch={refetch}
      />
    );

  return (
    <CustomersTable
      columns={columns}
      data={customers.data}
      pagination={customers.pagination}
    />
  );
}
