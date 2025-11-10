"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

import DataTable from "@/app/(admin)/components/shared/table/DataTable";
import { DataTableProps } from "@/app/(admin)/types/data-table";
import { Customer } from "@/app/(admin)/services/customers/types";

export default function CustomersTable({
  data,
  columns,
  pagination,
}: DataTableProps<Customer>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <DataTable table={table} pagination={pagination} />;
}
