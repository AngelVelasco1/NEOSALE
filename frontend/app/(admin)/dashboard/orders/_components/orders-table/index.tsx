"use client";

import { useMemo, useCallback } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import OrdersTable from "./Table";
import { getColumns, skeletonColumns } from "./columns";
import TableSkeleton from "../../../../components/shared/table/TableSkeleton";
import TableError from "../../../../components/shared/table/TableError";

import { getSearchParams } from "../../../../helpers/getSearchParams";
import { fetchOrders } from "../../../../services/orders";
import { useAuthorization } from "../../../../hooks/use-authorization";
import { useStableSearchParams } from "../../../../hooks/use-stable-search-params";

const STALE_TIME = 60 * 1000;
const GC_TIME = 5 * 60 * 1000;

export default function RecentOrders() {
  const { hasPermission } = useAuthorization();
  const columns = useMemo(() => getColumns({ hasPermission }), [hasPermission]);
  const { searchParams, searchParamsString } = useStableSearchParams();
  const {
    page,
    limit,
    search,
    status,
    method,
    startDate,
    endDate,
    sortBy,
    sortOrder
  } = getSearchParams(searchParams);

  // Extraer filtros adicionales de los searchParams
  const minAmount = searchParams.get("minAmount") || undefined;
  const maxAmount = searchParams.get("maxAmount") || undefined;
  const perPage = limit || 10;

  const queryKey = useMemo(
    () => ["orders", searchParamsString],
    [searchParamsString]
  );

  const queryFn = useCallback(
    () =>
      fetchOrders({
        page: page || 1,
        limit: perPage,
        search,
        status,
        method,
        startDate,
        endDate,
        minAmount,
        maxAmount,
        sortBy,
        sortOrder,
      }),
    [page, perPage, search, status, method, startDate, endDate, minAmount, maxAmount, sortBy, sortOrder]
  );

  const {
    data: orders,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn,
    placeholderData: keepPreviousData,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
    retry: 1,
  });

  if (isLoading)
    return <TableSkeleton perPage={perPage} columns={skeletonColumns} />;

  if (isError || !orders)
    return (
      <TableError
        errorMessage="Something went wrong while trying to fetch orders."
        refetch={refetch}
      />
    );

  return (
    <OrdersTable
      columns={columns}
      data={orders.data}
      pagination={orders.pagination}
    />
  );
}
