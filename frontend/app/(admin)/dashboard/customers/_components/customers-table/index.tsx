"use client";

import { useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import CustomersTable from "./Table";
import { getColumns, skeletonColumns } from "./columns";
import TableSkeleton from "@/app/(admin)/components/shared/table/TableSkeleton";
import TableError from "@/app/(admin)/components/shared/table/TableError";

import { getSearchParams } from "@/app/(admin)/helpers/getSearchParams";
import { fetchCustomers } from "@/app/(admin)/services/customers";
import { useAuthorization } from "@/app/(admin)/hooks/use-authorization";

const STALE_TIME = 60 * 1000; // 1 minute
const GC_TIME = 5 * 60 * 1000; // 5 minutes

export default function AllCustomers() {
  const { hasPermission } = useAuthorization();
  const columns = getColumns({ hasPermission });
  const searchParamsObj = useSearchParams();
  const {
    page,
    limit,
    search,
    status,
    sortBy,
    sortOrder
  } = getSearchParams(searchParamsObj);

  // Extraer filtros adicionales de los searchParams
  const minOrders = searchParamsObj.get("minOrders") || undefined;
  const maxOrders = searchParamsObj.get("maxOrders") || undefined;
  const minSpent = searchParamsObj.get("minSpent") || undefined;
  const maxSpent = searchParamsObj.get("maxSpent") || undefined;

  const {
    data: customers,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["User", page, limit, search, status, minOrders, maxOrders, minSpent, maxSpent, sortBy, sortOrder],
    queryFn: () => fetchCustomers({
      page,
      limit,
      search,
      status,
      minOrders,
      maxOrders,
      minSpent,
      maxSpent,
      sortBy,
      sortOrder
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
