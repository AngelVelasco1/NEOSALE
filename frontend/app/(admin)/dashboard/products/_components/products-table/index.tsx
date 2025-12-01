"use client";

import { useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import ProductsTable from "./Table";
import { getColumns, skeletonColumns } from "./columns";
import TableSkeleton from "@/app/(admin)/components/shared/table/TableSkeleton";
import TableError from "@/app/(admin)/components/shared/table/TableError";

import { getSearchParams } from "@/app/(admin)/helpers/getSearchParams";
import { fetchProducts } from "@/app/(admin)/services/products";
import { RowSelectionProps } from "@/app/(admin)/types/data-table";
import { useAuthorization } from "@/app/(admin)/hooks/use-authorization";

export default function AllProducts({
  rowSelection,
  setRowSelection,
}: RowSelectionProps) {
  const { hasPermission } = useAuthorization();
  const columns = getColumns({ hasPermission });
  const searchParams = useSearchParams();

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

  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      "products",
      page,
      limit,
      search,
      category,
      brand,
      price,
      minPrice,
      maxPrice,
      published,
      status,
      minStock,
      maxStock,
      date,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      fetchProducts({
        page,
        limit,
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
    placeholderData: keepPreviousData,
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
