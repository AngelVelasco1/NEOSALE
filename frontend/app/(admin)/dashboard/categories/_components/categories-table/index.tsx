"use client";

import { useMemo, useCallback } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import CategoriesTable from "./Table";
import { getColumns, skeletonColumns } from "./columns";
import TableSkeleton from "@/app/(admin)/components/shared/table/TableSkeleton";
import TableError from "@/app/(admin)/components/shared/table/TableError";

import { getSearchParams } from "@/app/(admin)/helpers/getSearchParams";
import { fetchCategories } from "@/app/(admin)/services/categories";
import { RowSelectionProps } from "@/app/(admin)/types/data-table";
import { useAuthorization } from "@/app/(admin)/hooks/use-authorization";
import { useStableSearchParams } from "@/app/(admin)/hooks/use-stable-search-params";

const STALE_TIME = 60 * 1000;
const GC_TIME = 5 * 60 * 1000;

export default function AllCategories({
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
    sortBy,
    sortOrder,
    status,
  } = getSearchParams(searchParams);
  const perPage = limit || 10;

  const queryKey = useMemo(
    () => ["categories", searchParamsString],
    [searchParamsString]
  );

  const queryFn = useCallback(
    () =>
      fetchCategories({
        page: page || 1,
        limit: limit || 10,
        search,
        sortBy,
        sortOrder,
        status,
      }),
    [page, limit, search, sortBy, sortOrder, status]
  );

  const {
    data: categories,
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

  if (isError || !categories)
    return (
      <TableError
        errorMessage="Something went wrong while trying to fetch categories."
        refetch={refetch}
      />
    );


  return (
    <CategoriesTable
      columns={columns}
      data={categories.data}
      pagination={categories.pagination}
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
    />
  );
}
