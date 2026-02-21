"use client";

import { useMemo, useCallback } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import CouponsTable from "./Table";
import { getColumns, skeletonColumns } from "./columns";
import TableSkeleton from "@/app/(admin)/components/shared/table/TableSkeleton";
import TableError from "@/app/(admin)/components/shared/table/TableError";

import { getSearchParams } from "@/app/(admin)/helpers/getSearchParams";
import { fetchCoupons } from "@/app/(admin)/services/coupons";
import { RowSelectionProps } from "@/app/(admin)/types/data-table";
import { useAuthorization } from "@/app/(admin)/hooks/use-authorization";
import { useStableSearchParams } from "@/app/(admin)/hooks/use-stable-search-params";

const STALE_TIME = 60 * 1000;
const GC_TIME = 5 * 60 * 1000;

export default function AllCoupons({
  rowSelection,
  setRowSelection,
}: RowSelectionProps) {
  const { hasPermission } = useAuthorization();
  const columns = useMemo(() => getColumns({ hasPermission }), [hasPermission]);
  const { searchParams, searchParamsString } = useStableSearchParams();
  const {
    page,
    limit,
    search,
    status,
    sortBy,
    sortOrder,
  } = getSearchParams(searchParams);

  const discountType = searchParams.get("discountType") || undefined;
  const featured = searchParams.get("featured") || undefined;
  const minDiscountValue = searchParams.get("minDiscount");
  const maxDiscountValue = searchParams.get("maxDiscount");
  const minDiscount = minDiscountValue ? Number(minDiscountValue) : undefined;
  const maxDiscount = maxDiscountValue ? Number(maxDiscountValue) : undefined;
  const perPage = limit || 10;

  const queryKey = useMemo(
    () => ["coupons", searchParamsString],
    [searchParamsString]
  );

  const queryFn = useCallback(
    () =>
      fetchCoupons({
        page: page || 1,
        limit: perPage,
        search,
        status,
        discountType,
        featured,
        minDiscount,
        maxDiscount,
        sortBy,
        sortOrder,
      }),
    [page, perPage, search, status, discountType, featured, minDiscount, maxDiscount, sortBy, sortOrder]
  );

  const {
    data: coupons,
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
