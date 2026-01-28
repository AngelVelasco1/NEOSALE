"use client";

import * as React from "react";
import { Table as TableType, flexRender } from "@tanstack/react-table";
import { Activity, Inbox, ListChecks, Rows, Table2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";
import Typography from "../../../components/ui/typography";
import { Pagination as PaginationType } from "../../../types/pagination";
import { useUpdateQueryString } from "../../../hooks/use-update-query-string";
import { getPaginationButtons } from "../../../helpers/getPaginationButtons";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> {
  table: TableType<TData>;
  pagination: PaginationType;
}


export default function DataTable<TData>({
  table,
  pagination,
}: DataTableProps<TData>) {
  const updateQueryString = useUpdateQueryString({ scroll: false });
  const paginationButtons = getPaginationButtons({
    totalPages: pagination.pages,
    currentPage: pagination.current,
  });

  const totalRows = table.getRowModel().rows.length;
  const selectedRows = table.getSelectedRowModel().rows.length;
  const showingFrom = pagination.items
    ? Math.max((pagination.current - 1) * pagination.limit + 1, 1)
    : 0;
  const showingTo = pagination.items
    ? Math.min(pagination.current * pagination.limit, pagination.items)
    : 0;

  const summaryCopy = React.useMemo(() => {
    if (!pagination.items) {
      return "No hay registros con los filtros actuales.";
    }
    if (selectedRows) {
      return `${selectedRows} registro${selectedRows === 1 ? "" : "s"} listo${selectedRows === 1 ? "" : "s"
        } para acciones.`;
    }
    return "Vista sincronizada con la última actualización.";
  }, [pagination.items, selectedRows]);

  const tableLabel =
    (table.options.meta as { sectionLabel?: string } | undefined)?.sectionLabel ??
    "Resumen de tabla";


  return (
    <div className="group/table relative overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-800/60 bg-white/95 dark:bg-slate-950/85 backdrop-blur-xl shadow-lg shadow-blue-100/40 dark:shadow-blue-950/40">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 -right-10 h-48 w-48 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(120deg,rgba(15,23,42,0.2)_1px,transparent_1px)] bg-size-[160px_160px]" />
      </div>

      <div className="relative flex flex-col gap-4 border-b border-slate-200/60 px-6 py-5 dark:border-slate-800/70 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-200">
            <Table2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-300 dark:text-slate-300">
              {tableLabel}
            </p>
      
            <p className="text-sm leading-6 text-slate-400/90 dark:text-slate-400/90">
              {summaryCopy}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200/60 bg-white/80 px-3 py-1.5 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200">
            <Rows className="h-4 w-4" />
            <span>Total filtrado: {totalRows}</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200/60 bg-white/80 px-3 py-1.5 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200">
            <Activity className="h-4 w-4" />
            <span>
              Ventana: {showingFrom || 0} - {showingTo || 0}
            </span>
          </div>
          {selectedRows > 0 && (
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-emerald-600 dark:text-emerald-200">
              <ListChecks className="h-4 w-4" />
              <span>{selectedRows} seleccionado{selectedRows === 1 ? "" : "s"}</span>
            </div>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-linear-to-r from-white via-slate-50/60 to-white dark:from-slate-900/80 dark:via-blue-950/20 dark:to-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/60"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="uppercase whitespace-nowrap font-semibold text-slate-500 dark:text-slate-300 text-[11px] tracking-[0.25em] leading-none py-4 px-4 first:pl-6 last:pr-6"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "group/row border-b border-slate-100/60 dark:border-slate-900/40 transition-all duration-300",
                    "odd:bg-white even:bg-slate-50/70 dark:odd:bg-transparent dark:even:bg-slate-950/20",
                    "hover:bg-linear-to-r hover:from-white hover:via-blue-50/40 hover:to-white dark:hover:from-slate-900/60 dark:hover:via-blue-950/20 dark:hover:to-slate-900/60",
                    "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1",
                    row.getIsSelected() &&
                    "bg-linear-to-r from-blue-50/60 via-blue-50/40 to-blue-50/60 dark:from-blue-950/40 dark:via-blue-950/20 dark:to-blue-950/40"
                  )}
                  style={{ animationDelay: `${row.index * 20}ms` }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-3.5 px-4 first:pl-6 last:pr-6 text-sm leading-6 text-slate-700 dark:text-slate-100"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.options.columns.length}
                  className="h-56 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2.5 py-10">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-100 to-indigo-100/80 text-blue-400 shadow-sm dark:from-slate-800 dark:to-slate-700/80 dark:text-blue-200">
                      <Inbox className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                      <Typography className="text-slate-600 dark:text-slate-400 font-semibold text-base">
                        No se encontraron resultados
                      </Typography>
                      <Typography className="text-xs text-slate-500 dark:text-slate-500">
                        Intenta ajustar tus filtros o criterios de búsqueda
                      </Typography>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación Moderna */}
      {pagination && pagination.items > 0 && (
        <div className="space-y-4 border-t border-slate-200/70 bg-linear-to-r from-white via-slate-50/80 to-white px-6 py-4 dark:border-slate-800 dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-950">
          <div className="flex flex-col gap-3 text-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                Mostrando
              </span>
              <div className="px-3 py-1.5 bg-linear-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/40 dark:to-indigo-800/40 rounded-lg border border-indigo-200 dark:border-indigo-700 font-bold text-indigo-700 dark:text-indigo-300 shadow-sm">
                {showingFrom} - {showingTo}
              </div>
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                de <span className="font-bold text-slate-800 dark:text-slate-200">{pagination.items}</span> resultados
              </span>
            </div>
            <Pagination className="justify-center lg:justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => {
                      const prevPage = pagination.current - 1;
                      if (prevPage >= 1) {
                        updateQueryString("page", prevPage.toString());
                      }
                    }}
                    disabled={pagination.current <= 1}
                  />
                </PaginationItem>

                {paginationButtons?.map((page, index) => (
                  <PaginationItem key={`page-${index}-${page}`}>
                    {page === "..." ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => {
                          updateQueryString("page", page.toString());
                        }}
                        isActive={page === pagination.current}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => {
                      const nextPage = pagination.current + 1;
                      if (nextPage <= pagination.pages) {
                        updateQueryString("page", nextPage.toString());
                      }
                    }}
                    disabled={pagination.current >= pagination.pages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>


        </div>
      )}
    </div>
  );
}
