import React, { Fragment } from "react";
import { Metadata } from "next";

import PageTitle from "../components/shared/PageTitle";
import SalesOverview from "./_components/SalesOverview";
import StatusOverview from "./_components/StatusOverview";
import DashboardCharts from "./_components/dashboard-charts";
import RecentOrders from "./orders/_components/orders-table";
import DashboardFilters from "./_components/DashboardFilters";

export const metadata: Metadata = {
  title: "Dashboard",
};

// Disable caching for this page to ensure real-time updates
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface DashboardPageProps {
  searchParams: Promise<{
    from?: string;
    to?: string;
    preset?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  
  let dateRange;
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

  return (
    <>
      <section className="">
        <DashboardFilters />

        <div className="space-y-8 mb-8">
          <SalesOverview dateRange={dateRange} />
          <StatusOverview dateRange={dateRange} />
          <DashboardCharts dateRange={dateRange} />
        </div>
      </section>

      <section>
        <PageTitle component="h2">Pedidos Recientes</PageTitle>

        <RecentOrders />
      </section>
    </>
  );
}
