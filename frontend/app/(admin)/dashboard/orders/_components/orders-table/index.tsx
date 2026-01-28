"use client";

import { useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import OrdersTable from "./Table";
import { getColumns, skeletonColumns } from "./columns";
import TableSkeleton from "../../../../components/shared/table/TableSkeleton";
import TableError from "../../../../components/shared/table/TableError";

import { getSearchParams } from "../../../../helpers/getSearchParams";
import { fetchOrders } from "../../../../services/orders";
import { useAuthorization } from "../../../../hooks/use-authorization";

const STALE_TIME = 60 * 1000;
const GC_TIME = 5 * 60 * 1000;

export default function RecentOrders() {
  const { hasPermission } = useAuthorization();
  const columns = getColumns({ hasPermission });
  const searchParamsObj = useSearchParams();
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
  } = getSearchParams(searchParamsObj);

  // Extraer filtros adicionales de los searchParams
  const minAmount = searchParamsObj.get("minAmount") || undefined;
  const maxAmount = searchParamsObj.get("maxAmount") || undefined;

  const {
    data: orders,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      "orders",
      page,
      limit,
      search,
      status,
      method,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      fetchOrders({
        page,
        limit,
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
    placeholderData: keepPreviousData,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  if (isLoading)
    return <TableSkeleton perPage={limit} columns={skeletonColumns} />;

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
