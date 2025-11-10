"use client";

import * as React from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

import DataTable from "@/app/(admin)//components/shared/table/DataTable";
import { DataTableProps } from "@/app/(admin)//types/data-table";
import { Staff } from "@/app/(admin)//services/staff/types";

export default function StaffTable({
  data,
  columns,
  pagination,
}: DataTableProps<Staff>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <DataTable table={table} pagination={pagination} />;
}
