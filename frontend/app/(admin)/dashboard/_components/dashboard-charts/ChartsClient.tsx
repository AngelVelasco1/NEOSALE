"use client";

import dynamic from "next/dynamic";

import ChartSkeleton from "./ChartSkeleton";
import type { WeeklySalesProps } from "./WeeklySales";
import type { CategoriesSellsProps } from "./CategoriesSells";
import { DailyData, CategorySalesData, DateRangeParams } from "../../../actions/dashboard/getChartData";

const WeeklySalesDynamic = dynamic<WeeklySalesProps>(
  () => import("./WeeklySales"),
  {
    ssr: false,
    loading: () => (
      <ChartSkeleton title="Ventas y Órdenes" description="Preparando métricas consolidadas..." />
    ),
  }
);

const CategoriesSellsDynamic = dynamic<CategoriesSellsProps>(
  () => import("./CategoriesSells"),
  {
    ssr: false,
    loading: () => (
      <ChartSkeleton title="Ventas por Categoría" description="Combinando participación por segmento..." />
    ),
  }
);

interface ChartsClientProps {
  dailyData: DailyData[];
  categoryData: CategorySalesData[];
  totalOrders: number;
  dateRange?: DateRangeParams;
}

export default function ChartsClient({
  dailyData,
  categoryData,
  totalOrders,
  dateRange,
}: ChartsClientProps) {
  return (
    <>
      <WeeklySalesDynamic data={dailyData} dateRange={dateRange} />
      <CategoriesSellsDynamic data={categoryData} totalOrders={totalOrders} dateRange={dateRange} />
    </>
  );
}
