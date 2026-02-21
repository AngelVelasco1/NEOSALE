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
      "flex flex-row items-center gap-2 rounded-full bg-slate-950 px-3 py-2 text-slate-200 shadow-[0_8px_20px_-12px_rgba(0,0,0,0.7)]",
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
      "inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:pointer-events-none disabled:opacity-40",
      "border-slate-700/60 bg-slate-900 text-slate-300 hover:border-cyan-500 hover:text-white",
      isActive && "border-cyan-400 bg-cyan-500/20 text-cyan-200",
      className
    )}
    type="button"
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
      "inline-flex h-10 min-w-[110px] items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 text-sm font-medium text-slate-200 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:pointer-events-none disabled:opacity-40",
      "hover:border-cyan-500 hover:text-white",
      className
    )}
    type="button"
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>{children || "Anterior"}</span>
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
      "inline-flex h-10 min-w-[110px] items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 text-sm font-medium text-slate-200 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:pointer-events-none disabled:opacity-40",
      "hover:border-cyan-500 hover:text-white",
      className
    )}
    type="button"
    {...props}
  >
    <span>{children || "Siguiente"}</span>
    <ChevronRight className="h-4 w-4" />
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
      "flex h-9 min-w-9 items-center justify-center rounded-full text-sm font-semibold text-slate-500",
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
