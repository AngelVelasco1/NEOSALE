import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn(className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      "flex flex-row items-center gap-1.5",
      "p-1 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm",
      "border-none dark:border-slate-700/60",
      "shadow-lg shadow-slate-900/5 dark:shadow-black/20",
      className
    )}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("flex items-center", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  className?: string
  isActive?: boolean
} & React.ComponentProps<"button">

const PaginationLink = ({
  className,
  isActive,
  ...props
}: PaginationLinkProps) => (
  <button
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:pointer-events-none disabled:opacity-50",
      "h-9 w-9 relative overflow-hidden group",
      // Estados normales
      !isActive && [
        "bg-linear-to-br from-white via-slate-50/80 to-white dark:from-slate-800 dark:via-slate-700/80 dark:to-slate-800",
        "border border-slate-300/60 dark:border-slate-600/50",
        "text-slate-700 dark:text-slate-300",
        "shadow-sm hover:shadow-md",
        "hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-700 dark:hover:to-slate-600",
        "hover:border-slate-400/70 dark:hover:border-slate-500/70",
        "hover:text-slate-900 dark:hover:text-slate-100",
        "hover:scale-105 active:scale-95"
      ],
      // Estado activo
      isActive && [
        "bg-linear-to-br from-indigo-600 via-indigo-700 to-indigo-800",
        "border border-indigo-600 dark:border-indigo-500",
        "text-white shadow-lg shadow-indigo-500/25",
        "hover:from-indigo-700 hover:to-indigo-900",
        "hover:shadow-indigo-500/30",
        "scale-110"
      ],
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  children?: React.ReactNode
}) => (
  <button
    aria-label="Go to previous page"
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:pointer-events-none disabled:opacity-50",
      "gap-2 pl-3 pr-4 h-9 min-w-[100px] group relative overflow-hidden",
      // Estilos normales
      "bg-linear-to-r from-slate-600 via-slate-700 to-slate-800 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900",
      "border border-slate-700/50 dark:border-slate-600/50",
      "text-white shadow-md hover:shadow-lg",
      "hover:from-slate-700 hover:to-slate-900 dark:hover:from-slate-600 dark:hover:to-slate-800",
      "hover:border-slate-600 dark:hover:border-slate-500",
      "hover:scale-105 active:scale-95",
      // Estado deshabilitado
      "disabled:from-slate-300 disabled:to-slate-400 dark:disabled:from-slate-700 dark:disabled:to-slate-800",
      "disabled:text-slate-500 dark:disabled:text-slate-400",
      "disabled:border-slate-400 dark:disabled:border-slate-600",
      "disabled:shadow-none disabled:scale-100",
      className
    )}
    {...props}
  >
    <ChevronLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
    <span className="font-medium">{children || "Anterior"}</span>
  </button>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  children?: React.ReactNode
}) => (
  <button
    aria-label="Go to next page"
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:pointer-events-none disabled:opacity-50",
      "gap-2 pl-4 pr-3 h-9 min-w-[100px] group relative overflow-hidden",
      // Estilos normales
      "bg-linear-to-r from-slate-600 via-slate-700 to-slate-800 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900",
      "border border-slate-700/50 dark:border-slate-600/50",
      "text-white shadow-md hover:shadow-lg",
      "hover:from-slate-700 hover:to-slate-900 dark:hover:from-slate-600 dark:hover:to-slate-800",
      "hover:border-slate-600 dark:hover:border-slate-500",
      "hover:scale-105 active:scale-95",
      // Estado deshabilitado
      "disabled:from-slate-300 disabled:to-slate-400 dark:disabled:from-slate-700 dark:disabled:to-slate-800",
      "disabled:text-slate-500 dark:disabled:text-slate-400",
      "disabled:border-slate-400 dark:disabled:border-slate-600",
      "disabled:shadow-none disabled:scale-100",
      className
    )}
    {...props}
  >
    <span className="font-medium">{children || "Siguiente"}</span>
    <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
  </button>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn(
      "flex min-w-9 h-9 items-center justify-center",
      "text-slate-500 dark:text-slate-400 text-lg font-bold",
      "rounded-lg transition-all duration-300",
      "hover:bg-slate-100 dark:hover:bg-slate-800",
      "hover:text-slate-700 dark:hover:text-slate-300",
      className
    )}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4 opacity-70" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
