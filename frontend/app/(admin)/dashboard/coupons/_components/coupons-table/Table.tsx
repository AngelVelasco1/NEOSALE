"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

import DataTable from "@/app/(admin)/components/shared/table/DataTable";
import { DataTableWithRowSelectionProps } from "@/app/(admin)/types/data-table";
import { Coupon } from "@/app/(admin)/services/coupons/types";

export default function CouponsTable({
  data,
  columns,
  pagination,
  rowSelection,
  setRowSelection,
}: DataTableWithRowSelectionProps<Coupon>) {
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
        meta: { sectionLabel: "Cupones" },

  });

  return <DataTable table={table} pagination={pagination} />;
}
