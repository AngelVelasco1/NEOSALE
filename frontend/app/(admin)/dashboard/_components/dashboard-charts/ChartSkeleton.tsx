import { Skeleton } from "@/components/ui/skeleton";

interface ChartSkeletonProps {
  title: string;
  description?: string;
}

export default function ChartSkeleton({ title, description }: ChartSkeletonProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/90 dark:bg-slate-950/80 shadow-[0_30px_90px_-60px_rgba(15,23,42,1)] backdrop-blur animate-pulse">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 -right-6 h-32 w-32 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute -bottom-14 -left-8 h-40 w-40 rounded-full bg-purple-500/10 blur-[110px]" />
        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_transparent_55%)]" />
      </div>
      <div className="relative flex flex-col gap-4 px-6 py-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-2xl bg-white/50 dark:bg-slate-900/60" />
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                {title}
              </p>
              <Skeleton className="h-3 w-44 bg-white/60 dark:bg-slate-900/50" />
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {description || "Optimizando métricas en tiempo real..."}
          </p>
        </div>
        <div className="rounded-2xl border border-white/20 dark:border-slate-800/70 bg-white/40 dark:bg-slate-900/40 p-4">
          <Skeleton className="h-48 w-full bg-white/60 dark:bg-slate-900/60 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
