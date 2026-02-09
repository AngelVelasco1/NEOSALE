"use client";

import dynamic from "next/dynamic";

const DashboardFilters = dynamic(() => import("./DashboardFilters"), {
  loading: () => (
    <div className="h-24 rounded-3xl border border-white/10 bg-slate-900/60" />
  ),
});

const RecentOrders = dynamic(
  () => import("../orders/_components/orders-table"),
  {
    loading: () => (
      <div className="h-72 rounded-3xl border border-white/10 bg-slate-900/60" />
    ),
  }
);

export function DashboardFiltersClient() {
  return <DashboardFilters />;
}

export function RecentOrdersClient() {
  return <RecentOrders />;
}
