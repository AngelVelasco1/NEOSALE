import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonColumn } from "@/types/skeleton";

type Props = {
  columns: SkeletonColumn[];
  perPage?: number;
};

export default function TableSkeleton({ columns, perPage = 10 }: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white/90 dark:bg-slate-950/85 shadow-[0_35px_120px_-60px_rgba(15,23,42,1)] backdrop-blur">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 -right-10 h-48 w-48 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_55%)]" />
      </div>

      <div className="relative flex flex-col gap-4 border-b border-white/10 px-6 py-6 dark:border-white/5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <Skeleton className="h-12 w-12 rounded-2xl bg-white/40 dark:bg-slate-800/60" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-32 bg-white/60 dark:bg-slate-800/60" />
            <Skeleton className="h-4 w-56 bg-white/50 dark:bg-slate-800/50" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
          <Skeleton className="h-8 w-32 rounded-2xl bg-white/50 dark:bg-slate-800/70" />
          <Skeleton className="h-8 w-28 rounded-2xl bg-white/50 dark:bg-slate-800/70" />
          <Skeleton className="h-8 w-36 rounded-2xl bg-white/50 dark:bg-slate-800/70" />
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-linear-to-r from-white via-slate-50/80 to-white dark:from-slate-900/70 dark:via-blue-950/20 dark:to-slate-900/70 border-b border-white/10 dark:border-slate-900/60">
              {columns.map((column, index) => (
                <TableHead
                  key={`header-${index}`}
                  className="uppercase whitespace-nowrap text-[11px] font-semibold tracking-[0.3em] text-slate-400 dark:text-slate-500 py-4 px-4 first:pl-6 last:pr-6"
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: perPage }).map((_, rowIndex) => (
              <TableRow
                key={`row-${rowIndex}`}
                className="border-b border-white/5 dark:border-slate-900/40 animate-pulse odd:bg-white even:bg-slate-50/60 dark:odd:bg-transparent dark:even:bg-slate-950/20"
                style={{ animationDelay: `${rowIndex * 40}ms` }}
              >
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={`row-${rowIndex}-col-${colIndex}`}
                    className="py-4 px-4 first:pl-6 last:pr-6"
                  >
                    <div className="flex items-center gap-3">
                      {column.cell}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="relative border-t border-white/10 bg-linear-to-r from-white via-slate-50/80 to-white px-6 py-5 dark:border-slate-900/50 dark:from-slate-950 dark:via-slate-900/70 dark:to-slate-950">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-40 bg-white/60 dark:bg-slate-800/60" />
            <Skeleton className="h-9 w-24 bg-white/60 dark:bg-slate-800/60" />
          </div>
          <div className="flex items-center gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={`pagination-skeleton-${index}`}
                className="h-9 w-9 rounded-full bg-white/60 dark:bg-slate-800/60"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
