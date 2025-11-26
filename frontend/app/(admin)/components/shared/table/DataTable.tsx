"use client";

import * as React from "react";
import { Table as TableType, flexRender } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  const handlePaginationButton = (page: number) => {
    updateQueryString("page", page.toString());
  };

  const handlePaginationPrev = () => {
    if (pagination.prev) {
      updateQueryString("page", pagination.prev.toString());
    }
  };

  const handlePaginationNext = () => {
    if (pagination.next) {
      updateQueryString("page", pagination.next.toString());
    }
  };

  return (
    <div className="rounded-xl border border-slate-200/60 dark:border-slate-700/50 overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50">
      {/* Data Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-linear-to-r from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-800/80 dark:via-blue-950/20 dark:to-slate-800/80 border-b border-slate-200/80 dark:border-slate-700/50"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="uppercase whitespace-nowrap font-bold text-slate-700 dark:text-slate-300 text-xs tracking-wider py-3 px-4 first:pl-6 last:pr-6"
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
                    "border-b border-slate-100/60 dark:border-slate-800/40 transition-all duration-200",
                    "hover:bg-linear-to-r hover:from-slate-50/80 hover:via-blue-50/20 hover:to-slate-50/80 dark:hover:from-slate-800/40 dark:hover:via-blue-950/10 dark:hover:to-slate-800/40",
                    row.getIsSelected() && "bg-linear-to-r from-blue-50/60 via-blue-50/40 to-blue-50/60 dark:from-blue-950/30 dark:via-blue-950/20 dark:to-blue-950/30 hover:from-blue-50 hover:to-blue-50 dark:hover:from-blue-950/40 dark:hover:to-blue-950/40"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-3 px-4 first:pl-6 last:pr-6 text-slate-600 dark:text-slate-300 text-sm"
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
                    <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200/80 dark:from-slate-800 dark:to-slate-700/80 flex items-center justify-center shadow-sm">
                      <svg
                        className="w-8 h-8 text-slate-400 dark:text-slate-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
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

      {/* Pagination */}
      {pagination.items > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3.5 bg-linear-to-r from-slate-50/80 via-blue-50/20 to-slate-50/80 dark:from-slate-800/40 dark:via-blue-950/10 dark:to-slate-800/40 border-t border-slate-200/60 dark:border-slate-700/50">
          {/* Results Info */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              Mostrando
            </span>
            <span className="px-2.5 py-1 bg-linear-to-br from-white to-slate-50/80 dark:from-slate-800 dark:to-slate-700/80 rounded-lg border border-slate-200/80 dark:border-slate-700/60 font-bold text-slate-700 dark:text-slate-300 shadow-sm">
              {Math.max((pagination.current - 1) * pagination.limit + 1, 1)} - {Math.min(pagination.current * pagination.limit, pagination.items)}
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              de <span className="font-bold text-slate-700 dark:text-slate-300">{pagination.items}</span>
            </span>
          </div>

          {/* Pagination Controls */}
          <Pagination>
            <PaginationContent className="flex-wrap gap-1.5">
              <PaginationItem>
                <button
                  onClick={handlePaginationPrev}
                  disabled={!pagination.prev}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
                    "border",
                    pagination.prev
                      ? "bg-linear-to-br from-white to-slate-50/80 dark:from-slate-800 dark:to-slate-700/80 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/60 hover:shadow-md hover:scale-[1.02] shadow-sm"
                      : "bg-slate-100/80 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 border-slate-200/60 dark:border-slate-700/40 cursor-not-allowed opacity-50"
                  )}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Anterior</span>
                </button>
              </PaginationItem>

              {paginationButtons.map((page, index) => (
                <PaginationItem key={`page-${index}`}>
                  {page === "..." ? (
                    <div className="px-2 py-1.5 text-slate-400 dark:text-slate-600">
                      <PaginationEllipsis />
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePaginationButton(page)}
                      className={cn(
                        "min-w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200 border",
                        page === pagination.current
                          ? "bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-slate-200 dark:to-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-200 shadow-lg shadow-slate-900/20 dark:shadow-slate-100/10 scale-105"
                          : "bg-linear-to-br from-white to-slate-50/80 dark:from-slate-800 dark:to-slate-700/80 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/60 hover:shadow-md hover:scale-[1.05] shadow-sm"
                      )}
                    >
                      {page}
                    </button>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <button
                  onClick={handlePaginationNext}
                  disabled={!pagination.next}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
                    "border",
                    pagination.next
                      ? "bg-linear-to-br from-white to-slate-50/80 dark:from-slate-800 dark:to-slate-700/80 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/60 hover:shadow-md hover:scale-[1.02] shadow-sm"
                      : "bg-slate-100/80 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 border-slate-200/60 dark:border-slate-700/40 cursor-not-allowed opacity-50"
                  )}
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
