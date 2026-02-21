"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

import DataTable from "@/app/(admin)/components/shared/table/DataTable";
import { DataTableWithRowSelectionProps } from "@/app/(admin)//types/data-table";
import { Product } from "@/app/(admin)//services/products/types";

export default function ProductsTable({
  data,
  columns,
  pagination,
  rowSelection,
  setRowSelection,
}: DataTableWithRowSelectionProps<Product>) {

  // useReactTable ya está optimizado internamente con memoization
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => String(row.id),
    state: {
      rowSelection,
    },
    onRowSelectionChange: (updater) => {
      const newSelectionState =
        typeof updater === "function" ? updater(rowSelection) : updater;

      setRowSelection(newSelectionState);
    },
    meta: { sectionLabel: "Productos" },
    // Optimizaciones adicionales
    enableRowSelection: true,
    enableMultiRowSelection: true,
  });

  return <DataTable table={table} pagination={pagination} />;
}
