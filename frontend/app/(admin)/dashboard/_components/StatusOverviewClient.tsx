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
    <div className="relative overflow-hidden ">
      {/* Background effects */}
    

      <div className="relative z-10 space-y-6 p-2 md:p-3">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-linear-to-br from-white/5 via-white/2 to-transparent p-6 backdrop-blur-sm lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="space-y-3 flex flex-col">
           
            <div className="relative">
              <Typography className="text-3xl font-black tracking-tight bg-linear-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(167,139,250,0.5)]">
                {title}
              </Typography>
              <div className="absolute -inset-2 -z-10 bg-linear-to-r from-violet-600/20 via-fuchsia-600/20 to-purple-600/20 blur-2xl" />
            </div>
            <Typography className="text-sm font-medium text-slate-300/90 leading-relaxed">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-violet-400" />
                {description}
              </span>
            </Typography>
          </div>

          <motion.a
            whileHover={{ x: 6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={ctaHref}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl border border-violet-400/30 bg-linear-to-r from-violet-500/10 via-fuchsia-500/10 to-purple-500/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm shadow-lg shadow-violet-500/20 transition-all duration-300 hover:border-violet-400/50 hover:shadow-xl hover:shadow-violet-500/30"
          >
            <span className="absolute inset-0 bg-linear-to-r from-violet-500/20 via-fuchsia-500/20 to-purple-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative z-10">{ctaLabel}</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.a>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
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
                whileHover={{ y: -8, scale: 1.02 }}
                className={cn(
                  "group relative overflow-hidden rounded-3xl border p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-all duration-500 hover:shadow-[0_30px_80px_rgba(0,0,0,0.6)]",
                  status.border
                )}
              >
                {/* Card background effects */}
                <div className={cn("absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-90", `bg-linear-to-br ${status.gradient}`)} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent" />
                <div className="absolute inset-0 bg-slate-950/30" />
                <div className={cn("absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl opacity-30 transition-all duration-500 group-hover:opacity-50 group-hover:scale-110", status.iconTint.replace('bg-', 'bg-').replace('/20', '/10'))} />

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 h-20 w-20 rounded-full border border-white/5 opacity-20" />
                <div className="absolute bottom-4 left-4 h-12 w-12 rounded-full border border-white/5 opacity-10" />

                <div className="relative space-y-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <Typography className="text-lg font-bold tracking-wide text-white/95 transition-colors duration-300 group-hover:text-white">
                        {status.title}
                      </Typography>
                      <div className="h-0.5 w-8 bg-linear-to-r from-white/40 to-transparent rounded-full" />
                    </div>
                    <div className={cn("relative rounded-2xl p-3 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3", status.iconTint)}>
                      <Icon className="size-6" />
                      <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <Typography className="text-4xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                      {status.count}
                    </Typography>
                    <Typography className="text-sm font-semibold text-white/70 uppercase tracking-wide">
                      pedidos
                    </Typography>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className={cn("rounded-full px-3 py-1.5 font-bold shadow-sm", status.badgeBg, status.badgeText)}>
                      {status.percentage}% del total
                    </span>
                    <span className="text-white/50 font-medium">Objetivo 100%</span>
                  </div>

                  <div className="relative">
                    <div className="h-3 w-full rounded-full bg-white/10 shadow-inner">
                      <div
                        className={cn("h-full rounded-full shadow-sm transition-all duration-700 ease-out", status.progress)}
                        style={{ width: `${status.percentage}%` }}
                      />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-linear-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
