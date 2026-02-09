import React from "react";
import { Metadata } from "next";
import {
  BarChart3,
  Clock,
  PackageSearch,
  ShieldCheck,
} from "lucide-react";

import PageTitle from "../components/shared/PageTitle";
import SalesOverview from "./_components/SalesOverview";
import StatusOverview from "./_components/StatusOverview";
import DashboardCharts from "./_components/dashboard-charts";
import DashboardFilters from "./_components/DashboardFilters";
import RecentOrders from "./orders/_components/orders-table";
import { GOAL_PARAM_MAP, MetricGoalKey } from "./_components/goalPresets";

export const metadata: Metadata = {
  title: "Dashboard",
};

// Allow short-lived caching to reduce load while keeping data fresh
export const revalidate = 60;

type GoalParamName = (typeof GOAL_PARAM_MAP)[MetricGoalKey];

type DashboardSearchParams = {
  from?: string;
  to?: string;
  preset?: string;
} & Partial<Record<GoalParamName, string>>;

interface DashboardPageProps {
  searchParams: Promise<DashboardSearchParams>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  
  let dateRange: { from: string; to: string };
  if (params.from && params.to) {
    dateRange = { from: params.from, to: params.to };
  } else {
    // Default: este mes (mismo que DashboardFilters)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    dateRange = {
      from: startOfMonth.toISOString(),
      to: now.toISOString()
    };
  }

  const dateFormatter = new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formatRangeDate = (value: string) => {
    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime())
      ? "Fecha no disponible"
      : dateFormatter.format(parsedDate);
  };

  const dateRangeLabel = `${formatRangeDate(dateRange.from)} – ${formatRangeDate(
    dateRange.to
  )}`;

  const goalOverrides = (Object.keys(GOAL_PARAM_MAP) as MetricGoalKey[]).reduce(
    (acc, key) => {
      const paramName = GOAL_PARAM_MAP[key] as GoalParamName;
      const raw = params[paramName];
      const parsed = raw ? Number(raw) : NaN;
      if (Number.isFinite(parsed) && parsed > 0) {
        acc[key] = parsed;
      }
      return acc;
    },
    {} as Partial<Record<MetricGoalKey, number>>
  );


  return (
    <>
      <section className="">
        <DashboardFilters />
        <div className="space-y-8 mb-8">
          <SalesOverview dateRange={dateRange} goalOverrides={goalOverrides} />
          <StatusOverview dateRange={dateRange} />
          <DashboardCharts dateRange={dateRange} />
        </div>
      </section>

      <section className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-linear-to-br from-slate-950 via-slate-900/30 to-slate-950 text-white shadow-[0_25px_80px_rgba(59,130,246,0.25)]">
          {/* Background effects */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_50%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.1),transparent_50%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-size-[40px_40px] opacity-30" />
          <div className="pointer-events-none absolute -top-40 left-10 h-80 w-80 rounded-full bg-blue-500/10 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-40 right-10 h-80 w-80 rounded-full bg-cyan-500/8 blur-[100px]" />

          <div className="relative flex flex-col gap-4 px-4 py-6 md:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-6">
                <div className="group relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-3xl bg-linear-to-br from-blue-500/20 via-cyan-500/20 to-sky-500/20 backdrop-blur-sm border border-blue-400/30 shadow-lg shadow-blue-500/20">
                  <div className="absolute inset-0 bg-linear-to-br from-blue-500/30 via-cyan-500/30 to-sky-500/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <PackageSearch className="relative z-10 h-8 w-8 text-blue-200 transition-colors duration-300 group-hover:text-white" />
                  <div className="absolute -inset-1 -z-10 bg-linear-to-r from-blue-600/20 via-cyan-600/20 to-sky-600/20 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <div className="space-y-1">
                  <div className="relative">
                    <h2 className="mb-0 font-semibold text-xl bg-linear-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                      Pedidos Recientes
                    </h2>
                    <div className="absolute -inset-2 -z-10 bg-linear-to-r from-blue-600/20 via-cyan-600/20 to-sky-600/20 blur-2xl" />
                  </div>
                  <p className="max-w-2xl text-sm leading-relaxed text-slate-300/90">
                    <span className="inline-flex items-center">
                      Revisa los últimos pedidos realizados en tu tienda y mantente al tanto de su estado y progreso.
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="group relative overflow-hidden rounded-2xl border border-blue-400/30 bg-linear-to-r from-blue-500/10 via-cyan-500/10 to-sky-500/10 px-5 py-3 backdrop-blur-sm shadow-lg shadow-blue-500/20 transition-all duration-300 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/30">
                  <span className="absolute inset-0 bg-linear-to-r from-blue-500/20 via-cyan-500/20 to-sky-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative z-10 flex items-center gap-3">
                    <Clock className="h-4 w-4 text-blue-300 transition-colors duration-300 group-hover:text-blue-100" />
                    <span className="font-bold tracking-wide text-slate-100 transition-colors duration-300 group-hover:text-white">
                      {dateRangeLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <RecentOrders />
      </section>
    </>
  );
}
