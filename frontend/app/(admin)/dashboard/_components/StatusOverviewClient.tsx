"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock, PackageCheck, Truck } from "lucide-react";
import type { ComponentType } from "react";

import Typography from "@/app/(admin)/components/ui/typography";
import { cn } from "@/lib/utils";

export type IconToken = "pending" | "processing" | "shipped" | "delivered";

export interface OrderStatusCardDescriptor {
  id: string;
  icon: IconToken;
  title: string;
  count: number;
  percentage: number;
  gradient: string;
  border: string;
  iconTint: string;
  badgeBg: string;
  badgeText: string;
  progress: string;
}

export interface StatusOverviewPayload {
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  statuses: OrderStatusCardDescriptor[];
}

const iconMap: Record<IconToken, ComponentType<{ className?: string }>> = {
  pending: Clock,
  processing: PackageCheck,
  shipped: Truck,
  delivered: CheckCircle2,
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 25, scale: 0.98 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.05 * index, duration: 0.4, ease: [0.6, 0.04, 0.28, 0.99] as const },
  }),
};

interface StatusOverviewClientProps extends StatusOverviewPayload {}

export default function StatusOverviewClient({
  title,
  subtitle,
  description,
  ctaHref,
  ctaLabel,
  statuses,
}: StatusOverviewClientProps) {
  return (
    <div className="space-y-6">
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4 rounded-3xl border border-slate-800/60 bg-slate-950/70 p-6 text-white shadow-[0_25px_60px_-30px_rgba(15,23,42,0.8)] lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="space-y-2 flex flex-col">
          <div className="inline-flex items-center w-fit gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {subtitle}
          </div>
          <Typography className="text-2xl font-semibold text-white">
            {title}
          </Typography>
          <Typography className="text-sm text-slate-400">
            {description}
          </Typography>
        </div>

        <motion.a
          whileHover={{ x: 4 }}
          href={ctaHref}
          className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-white/5 px-5 py-2 text-sm font-semibold text-slate-100 transition-all hover:bg-white/10"
        >
          {ctaLabel}
          <ArrowRight className="size-4" />
        </motion.a>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statuses.map((status, index) => {
          const Icon = iconMap[status.icon];
          return (
            <motion.div
              key={status.id}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={index}
              whileHover={{ y: -4 }}
              className={cn(
                "relative overflow-hidden rounded-2xl border p-5 text-white shadow-[0_15px_50px_-35px_rgba(56,189,248,0.7)]",
                status.border
              )}
            >
              <div className={cn("absolute inset-0 opacity-80", `bg-linear-to-br ${status.gradient}`)} />
              <div className="absolute inset-0 bg-slate-950/40" />
              <div className="relative space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <Typography className="text-lg tracking-wide font-semibold text-white/90">
                      {status.title}
                    </Typography>
                    
                  </div>
                  <div className={cn("rounded-2xl p-2", status.iconTint)}>
                    <Icon className="size-5" />
                  </div>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <Typography className="text-3xl font-bold ml-1 text-white">
                    {status.count}
                  </Typography>
                  <Typography className="text-sm text-white/70">
                    pedidos
                  </Typography>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className={cn("rounded-full px-3 py-1", status.badgeBg, status.badgeText)}>
                    {status.percentage}% del total
                  </span>
                  <span className="text-white/60">Objetivo 100%</span>
                </div>

                <div className="h-2 w-full rounded-full bg-white/10">
                  <div
                    className={cn("h-full rounded-full", status.progress)}
                    style={{ width: `${status.percentage}%` }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
