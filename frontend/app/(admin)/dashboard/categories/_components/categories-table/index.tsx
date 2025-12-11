"use client";

import { useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import CategoriesTable from "./Table";
import { getColumns, skeletonColumns } from "./columns";
import TableSkeleton from "@/app/(admin)/components/shared/table/TableSkeleton";
import TableError from "@/app/(admin)/components/shared/table/TableError";

import { getSearchParams } from "@/app/(admin)/helpers/getSearchParams";
import { fetchCategories } from "@/app/(admin)/services/categories";
import { RowSelectionProps } from "@/app/(admin)/types/data-table";
import { useAuthorization } from "@/app/(admin)/hooks/use-authorization";

export default function AllCategories({
  rowSelection,
  setRowSelection,
}: RowSelectionProps) {
  const { hasPermission } = useAuthorization();
  const columns = getColumns({ hasPermission });
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const sortOrder = searchParams.get("sortOrder") || "";
  const status = searchParams.get("status") || "";

  const {
    data: categories,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["categories", page, limit, search, sortBy, sortOrder, status],
    queryFn: () => fetchCategories({ page, limit, search, sortBy, sortOrder, status }),
    placeholderData: keepPreviousData,
  });

  if (isLoading)
    return <TableSkeleton perPage={limit} columns={skeletonColumns} />;

  if (isError || !categories)
    return (
      <TableError
        errorMessage="Something went wrong while trying to fetch categories."
        refetch={refetch}
      />
    );

  // Debug para verificar la estructura de datos de categorías
  console.log("🔍 Categories response:", {
    hasData: !!categories.data,
    dataLength: categories.data?.length,
    pagination: categories.pagination,
    paginationKeys: categories.pagination ? Object.keys(categories.pagination) : []
  });

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
