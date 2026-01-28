"use client";

import { useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import CouponsTable from "./Table";
import { getColumns, skeletonColumns } from "./columns";
import TableSkeleton from "@/app/(admin)/components/shared/table/TableSkeleton";
import TableError from "@/app/(admin)/components/shared/table/TableError";

import { fetchCoupons } from "@/app/(admin)/services/coupons";
import { RowSelectionProps } from "@/app/(admin)/types/data-table";
import { useAuthorization } from "@/app/(admin)/hooks/use-authorization";

const STALE_TIME = 60 * 1000;
const GC_TIME = 5 * 60 * 1000;

export default function AllCoupons({
  rowSelection,
  setRowSelection,
}: RowSelectionProps) {
  const { hasPermission } = useAuthorization();
  const columns = getColumns({ hasPermission });
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const discountType = searchParams.get("discountType") || "";
  const featured = searchParams.get("featured") || "";
  const minDiscount = searchParams.get("minDiscount") ? Number(searchParams.get("minDiscount")) : undefined;
  const maxDiscount = searchParams.get("maxDiscount") ? Number(searchParams.get("maxDiscount")) : undefined;
  const sortBy = searchParams.get("sortBy") || "";
  const sortOrder = searchParams.get("sortOrder") || "";

  const {
    data: coupons,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["coupons", page, limit, search, status, discountType, featured, minDiscount, maxDiscount, sortBy, sortOrder],
    queryFn: () => fetchCoupons({ page, limit, search, status, discountType, featured, minDiscount, maxDiscount, sortBy, sortOrder }),
    placeholderData: keepPreviousData,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  if (isLoading)
    return <TableSkeleton perPage={limit} columns={skeletonColumns} />;

  if (isError || !coupons)
    return (
      <TableError
        errorMessage="Something went wrong while trying to fetch coupons."
        refetch={refetch}
      />
    );


  return (
    <CouponsTable
      columns={columns}
      data={coupons.data}
      pagination={coupons.pagination}
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
    />
  );
}
