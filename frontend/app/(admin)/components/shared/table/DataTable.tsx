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
  const { updateQueryString, isPending: isUpdatingPage } = useUpdateQueryString({ scroll: false });
  const totalPages = pagination.pages || 1;
  const isFirstPage = pagination.current <= 1;
  const isLastPage = pagination.current >= totalPages;

  const handlePageChange = React.useCallback(
    (nextPage: number) => {
      if (Number.isNaN(nextPage)) return;
      if (nextPage < 1 || nextPage > totalPages) return;
      if (nextPage === pagination.current) return;

      updateQueryString("page", nextPage.toString());
    },
    [pagination.current, totalPages, updateQueryString]
  );
  
  const paginationButtons = React.useMemo(
    () => getPaginationButtons({
      totalPages,
      currentPage: pagination.current,
    }),
    [totalPages, pagination.current]
  );

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
    <div className="group/table relative overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-950/85 backdrop-blur-xl shadow-lg shadow-blue-950/40">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 -right-10 h-48 w-48 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(120deg,rgba(15,23,42,0.2)_1px,transparent_1px)] bg-size-[160px_160px]" />
      </div>

      <div className="relative flex flex-col gap-4 border-b border-slate-800/70 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-200">
            <Table2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              {tableLabel}
            </p>
      
            <p className="text-sm leading-6 text-slate-400/90">
              {summaryCopy}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-slate-200 shadow-sm">
            <Rows className="h-4 w-4" />
            <span>Total filtrado: {totalRows}</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-slate-200 shadow-sm">
            <Activity className="h-4 w-4" />
            <span>
              Ventana: {showingFrom || 0} - {showingTo || 0}
            </span>
          </div>
          {selectedRows > 0 && (
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-emerald-200">
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
                className="bg-linear-to-r from-slate-900/80 via-blue-950/20 to-slate-900/80 border-b border-slate-800/60"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="uppercase whitespace-nowrap font-semibold text-slate-300 text-[11px] tracking-[0.25em] leading-none py-4 px-4 first:pl-6 last:pr-6"
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
                    "group/row border-b border-slate-900/40 transition-all duration-300",
                    "odd:bg-transparent even:bg-slate-950/20",
                    "hover:bg-linear-to-r hover:from-slate-900/60 hover:via-blue-950/20 hover:to-slate-900/60",
                    "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1",
                    row.getIsSelected() &&
                    "bg-linear-to-r from-blue-950/40 via-blue-950/20 to-blue-950/40"
                  )}
                  style={{ animationDelay: `${row.index * 20}ms` }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-3.5 px-4 first:pl-6 last:pr-6 text-sm leading-6 text-slate-100"
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
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-slate-800 to-slate-700/80 text-blue-200 shadow-sm">
                      <Inbox className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                      <Typography className="text-slate-400 font-semibold text-base block">
                        No se encontraron resultados
                      </Typography>
                      <Typography className="text-xs text-slate-500">
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
        <div className="space-y-4 border-t border-slate-800 bg-linear-to-r from-slate-950 via-slate-900/60 to-slate-950 px-6 py-4">
          <div className="flex flex-col gap-3 text-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-slate-400 font-medium">
                Mostrando
              </span>
              <div className="px-3 py-1.5 bg-linear-to-br from-indigo-900/40 to-indigo-800/40 rounded-lg border border-indigo-700 font-bold text-indigo-300 shadow-sm">
                {showingFrom} - {showingTo}
              </div>
              <span className="text-slate-400 font-medium">
                de <span className="font-bold text-slate-200">{pagination.items}</span> resultados
              </span>
            </div>
            <Pagination className="justify-center lg:justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(pagination.current - 1)}
                    disabled={isFirstPage || isUpdatingPage}
                  />
                </PaginationItem>

                {paginationButtons?.map((page, index) => (
                  <PaginationItem key={`page-${index}-${page}`}>
                    {page === "..." ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={page === pagination.current}
                        disabled={isUpdatingPage}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(pagination.current + 1)}
                    disabled={isLastPage || isUpdatingPage}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
          {isUpdatingPage && (
            <span className="text-xs font-medium text-slate-500" aria-live="polite">
              Cargando página...
            </span>
          )}

        </div>
      )}
    </div>
  );
}
