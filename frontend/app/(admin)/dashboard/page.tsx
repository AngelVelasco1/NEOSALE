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
import RecentOrders from "./orders/_components/orders-table";
import DashboardFilters from "./_components/DashboardFilters";
import { GOAL_PARAM_MAP, MetricGoalKey } from "./_components/goalPresets";

export const metadata: Metadata = {
  title: "Dashboard",
};

// Disable caching for this page to ensure real-time updates
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-r from-slate-950 via-slate-900 to-slate-950 text-white shadow-2xl shadow-blue-900/30">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.25),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[140px_140px] opacity-30" />
          <div className="relative flex flex-col gap-8 px-3 py-7 md:px-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-5">
                <div className="flex h-14 w-15 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                  <PackageSearch className="h-7 w-7 text-white" />
                </div>
                <div className="space-y-3">
                  <PageTitle component="h2" className="mb-0 text-white">
                    Pedidos Recientes
                  </PageTitle>
                  <p className="max-w-2xl text-sm leading-relaxed text-slate-300">
                    Revisa los últimos pedidos realizados en tu tienda y mantente al tanto de su estado y progreso.
                  </p>
                 
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-4 py-2">
                  <Clock className="h-4 w-4 text-blue-200" />
                  <span className="font-medium tracking-wide text-slate-100">
                    {dateRangeLabel}
                  </span>
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
