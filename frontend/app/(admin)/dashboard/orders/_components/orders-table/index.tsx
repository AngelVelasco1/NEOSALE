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

export default function RecentOrders() {
  const { hasPermission } = useAuthorization();
  const columns = getColumns({ hasPermission });
  const { page, limit, search, status, method, startDate, endDate } =
    getSearchParams(useSearchParams());

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
      }),
    placeholderData: keepPreviousData,
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

  // Debug para verificar la estructura de datos de orders
  console.log("🔍 Orders response:", {
    hasData: !!orders.data,
    dataLength: orders.data?.length,
    pagination: orders.pagination,
    paginationKeys: orders.pagination ? Object.keys(orders.pagination) : []
  });

  return (
    <OrdersTable
      columns={columns}
      data={orders.data}
      pagination={orders.pagination}
    />
  );
}
