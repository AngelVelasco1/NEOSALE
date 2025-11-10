"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { getColumns } from "./columns";
import DataTable from "@/app/(admin)/components/shared/table/DataTable";
import { DataTableProps } from "@/app/(admin)/types/data-table";
import { CustomerOrder } from "@/app/(admin)/services/customers/types";
import { useAuthorization } from "@/app/(admin)/hooks/use-authorization";

export default function CustomerOrdersTable({
  data,
}: Omit<DataTableProps<CustomerOrder>, "columns" | "pagination">) {
  const { hasPermission } = useAuthorization();
  const columns = getColumns({ hasPermission });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <DataTable
      table={table}
      pagination={{
        limit: 0,
        current: 0,
        items: 0,
        pages: 0,
        next: null,
        prev: null,
      }}
    />
  );
}
