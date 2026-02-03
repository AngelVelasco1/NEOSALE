import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-hidden rounded-2xl backdrop-blur-lg bg-slate-900/10 border border-slate-600/30">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm font-medium", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead 
    ref={ref} 
    className={cn(
      "[&_tr]:border-b [&_tr]:border-slate-600/40",
      "bg-linear-to-r from-slate-800/50 to-slate-700/50",
      "backdrop-blur-sm",
      className
    )} 
    {...props} 
  />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      "[&_tr:last-child]:border-0",
      "[&_tr]:transition-all [&_tr]:duration-200",
      className
    )}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t border-slate-600/40",
      "bg-linear-to-r from-slate-800/60 to-slate-700/60",
      "backdrop-blur-sm font-semibold [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-slate-600/30",
      "transition-all duration-200 ease-in-out",
      "hover:bg-slate-800/40",
      "hover:shadow-sm hover:scale-[1.01]",
      "data-[state=selected]:bg-slate-800/60",
      "data-[state=selected]:shadow-md",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-14 px-6 text-left align-middle font-bold text-xs uppercase tracking-wider",
      "text-slate-300",
      "bg-linear-to-r from-slate-200 to-slate-400",
      "bg-clip-text text-transparent",
      "[&:has([role=checkbox])]:pr-0 relative",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "px-6 py-4 align-middle font-medium",
      "text-slate-200",
      "[&:has([role=checkbox])]:pr-0",
      "transition-colors duration-200",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(
      "mt-6 text-sm font-medium text-slate-400",
      "bg-linear-to-r from-slate-600 to-slate-700",
      "bg-clip-text text-transparent",
      className
    )}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
