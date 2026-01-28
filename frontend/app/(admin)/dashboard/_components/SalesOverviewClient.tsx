"use client";

import { motion, type Variants } from "framer-motion";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Package,
  TrendingUp,
  Users,
} from "lucide-react";

import Typography from "@/app/(admin)/components/ui/typography";
import { cn } from "@/lib/utils";

import type {
  MetricCardDescriptor,
  QuickStatDescriptor,
  SalesHeroDescriptor,
  SalesOverviewPayload,
  IconToken,
} from "./SalesOverview.types";
import { BiDollar, BiShoppingBag } from "react-icons/bi";

const iconMap: Record<IconToken, React.ComponentType<{ className?: string }>> = {
  revenue: BiDollar,
  orders: Package,
  products: BiShoppingBag,
  customers: Users,
  trend: TrendingUp,
  conversion: Activity,
  pending: Package,
  activeUsers: Users,
};

const changeTone: Record<"increase" | "decrease" | "neutral", string> = {
  increase: "bg-emerald-500/15 text-emerald-300",
  decrease: "bg-rose-500/15 text-rose-300",
  neutral: "bg-slate-500/20 text-slate-200",
};



const cardVariants: Variants = {
  hidden: { opacity: 0, y: 35, scale: 0.96 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: index * 0.08, duration: 0.5, ease: [0.33, 1, 0.68, 1] as const },
  }),
};

const quickStatVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + index * 0.06, duration: 0.45, ease: "easeOut" },
  }),
};

function ChangeBadge({
  change,
  changeType,
}: Pick<MetricCardDescriptor, "change" | "changeType">) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        changeTone[changeType]
      )}
    >
      {changeType === "increase" && <ArrowUpRight className="size-3" />}
      {changeType === "decrease" && <ArrowDownRight className="size-3" />}
      {change}
    </motion.span>
  );
}





interface MetricGridProps {
  metrics: MetricCardDescriptor[];
}

function MetricGrid({ metrics }: MetricGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => {
        const Icon = iconMap[metric.icon];
        const rawProgress = Math.max(0, metric.progressValue ?? 0);
        const clampedProgress = Math.min(100, rawProgress);
        const animatedProgress =
          rawProgress > 0 && clampedProgress < 1 ? 1 : clampedProgress;
        const progressLabel =
          rawProgress <= 0
            ? "0%"
            : rawProgress < 1
              ? "<1%"
              : `${Math.round(rawProgress)}%`;

        return (
          <motion.div
            key={metric.title}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            custom={index}
            whileHover={{ y: -6, scale: 1.01 }}
            className={cn(
              "relative overflow-hidden rounded-3xl border bg-slate-950/70 p-6 text-white shadow-[0_30px_80px_-35px_rgba(14,165,233,0.65)] transition-all",
              metric.border,
              metric.glow
            )}
          >
            <div className={cn("absolute inset-0 opacity-90", `bg-linear-to-br ${metric.gradient}`)} />
            <div className="absolute inset-0 bg-slate-950/50" />
            <div className="absolute inset-x-8 top-0 h-px bg-white/10" />
            <div className="relative flex h-full flex-col gap-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                 
              
                  <Typography className="text-lg font-semibold text-white">
                    {metric.title}
                  </Typography>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-white/40 opacity-60 blur-lg" />
                  <div className={cn(
                    "relative rounded-2xl border border-white/20 p-3 shadow-inner shadow-slate-900/60 backdrop-blur",
                    metric.iconBg
                  )}>
                    <Icon className="size-5 text-white" />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <Typography className="text-3xl font-bold text-white">
                    {metric.value}
                  </Typography>
                 
                </div>
                <ChangeBadge change={metric.change} changeType={metric.changeType} />
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-200">
                  <span>Progreso</span>
                  <span>{progressLabel}</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${animatedProgress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, ease: [0.33, 1, 0.68, 1] }}
                    className="h-full rounded-full bg-linear-to-r from-white via-sky-200 to-indigo-200 shadow-[0_0_25px_rgba(59,130,246,0.7)]"
                    aria-valuenow={clampedProgress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    role="progressbar"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

interface QuickStatsProps {
  quickStats: QuickStatDescriptor[];
}

function QuickStatsGrid({ quickStats }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {quickStats.map((stat, index) => {
        const Icon = iconMap[stat.icon];
        return (
          <motion.div
            key={stat.title}
            variants={quickStatVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={index}
            whileHover={{ y: -4 }}
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-white shadow-[0_15px_40px_-25px_rgba(148,163,184,0.6)]",
              stat.border
            )}
          >
            <div className={cn("absolute inset-0 opacity-80", `bg-linear-to-br ${stat.background}`)} />
            <div className="absolute inset-0 bg-slate-950/40" />
            <div className="relative flex items-start gap-3">
              <div className="relative">
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-white/40 opacity-60 blur-lg transition group-hover:opacity-90" />
                <div className="relative rounded-2xl border border-white/15 bg-white/10 p-2.5">
                  <Icon className={cn("size-5", stat.accent)} />
                </div>
              </div>
              <div className="space-y-1">
                <Typography className="text-xl block font-semibold text-white">
                  {stat.value}
                </Typography>
                <Typography className="text-[10px] block font-semibold uppercase tracking-[0.25em] text-slate-300">
                  {stat.title}
                </Typography>
                <Typography className="text-[11px] text-slate-300">
                  {stat.helper}
                </Typography>
              </div>
            </div>
            <div className="mt-4 h-px w-full bg-linear-to-r from-transparent via-white/30 to-transparent" />
          </motion.div>
        );
      })}
    </div>
  );
}

export default function SalesOverviewClient({
  metrics,
  quickStats,
}: SalesOverviewPayload) {
  return (
    <div className="space-y-8">
      <MetricGrid metrics={metrics} />
      <QuickStatsGrid quickStats={quickStats} />
    </div>
  );
}
