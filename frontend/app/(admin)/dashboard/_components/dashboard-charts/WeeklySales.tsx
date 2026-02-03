"use client";

import { TrendingUp, DollarSign } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { differenceInDays } from "date-fns";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import Typography from "../../../components/ui/typography";
import { cn } from "@/lib/utils";
import { DailyData, DateRangeParams } from "../../../actions/dashboard/getChartData";

export interface WeeklySalesProps {
  data: DailyData[];
  dateRange?: DateRangeParams;
}

export default function WeeklySales({ data, dateRange }: WeeklySalesProps) {
  const chartConfig = {
    sales: {
      label: "Ventas",
      color: "hsl(217, 91%, 60%)", // blue-500
    },
    orders: {
      label: "Órdenes",
      color: "hsl(25, 95%, 53%)", // orange-500
    },
  };

  // Calculate totals for display
  const totalSales = data.reduce((sum, item) => sum + item.sales, 0);
  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);

  // Calculate period description based on date range
  const getPeriodDescription = () => {
    if (!dateRange?.from || !dateRange?.to) {
      return `${data.length} ${data.length === 1 ? 'día' : 'días'}`;
    }

    const from = typeof dateRange.from === 'string' ? new Date(dateRange.from) : dateRange.from;
    const to = typeof dateRange.to === 'string' ? new Date(dateRange.to) : dateRange.to;
    const days = differenceInDays(to, from) + 1; // +1 para incluir ambos días

    return `${days} ${days === 1 ? 'día' : 'días'}`;
  };

  const periodDescription = getPeriodDescription();

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/85 shadow-[0_25px_80px_-60px_rgba(15,23,42,1)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-10 top-0 h-48 w-48 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-56 w-56 rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute left-1/2 top-1/3 h-40 w-40 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute right-1/3 bottom-1/4 h-32 w-32 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_55%)]" />
      </div>

      {/* Header */}
      <div className="relative border-b border-white/10 px-6 py-4 backdrop-blur-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <Typography className="block text-2xl font-semibold text-white">
              Ventas y Órdenes
            </Typography>
            <Typography className="text-sm text-slate-400">
              Análisis del período • {periodDescription}
            </Typography>
          </div>

          <div className="flex w-fit items-stretch justify-end gap-3 sm:justify-end md:w-auto">
            <div className="relative flex flex-1 min-w-[100px] overflow-hidden rounded-2xl border border-blue-500/20 bg-blue-500/5 px-4 py-2.5">
              <div className="absolute inset-0 bg-linear-to-br from-white/15 to-transparent" />
              <div className="relative flex w-full items-center justify-between gap-3">
                <div className="rounded-2xl bg-blue-500/20 p-2 text-blue-100">
                  <DollarSign className="size-4" />
                </div>
                <div className="flex flex-col">
                  <Typography className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-200">
                    Ventas
                  </Typography>
                  <Typography className="text-md font-semibold text-white">
                    ${totalSales.toLocaleString()}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="relative flex flex-1 min-w-[100px] overflow-hidden rounded-2xl border border-orange-500/20 bg-orange-500/5 px-4 py-2.5">
              <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent" />
              <div className="relative flex w-full items-center justify-between gap-3">
                <div className="rounded-2xl bg-orange-500/20 p-2 text-orange-100">
                  <TrendingUp className="size-4" />
                </div>
                <div className="flex flex-col">
                  <Typography className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-200">
                    Órdenes
                  </Typography>
                  <Typography className="text-md font-semibold text-white">
                    {totalOrders.toLocaleString()} órdenes
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative p-6">
        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList className="flex w-full flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur sm:w-auto sm:flex-row">
            <TabsTrigger
              value="sales"
              className={cn(
                "w-fit rounded-xl px-4 py-2 text-sm font-semibold transition-all",
                "flex items-center justify-center gap-2 whitespace-nowrap sm:w-auto",
                "data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500",
                "data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30",
                "data-[state=inactive]:text-slate-400"
              )}
            >
              <DollarSign className="mr-2 size-4" />
              Ventas
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className={cn(
                "w-full rounded-xl px-4 py-2 text-sm font-semibold transition-all",
                "flex items-center justify-center gap-2 whitespace-nowrap sm:w-auto",
                "data-[state=active]:bg-linear-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500",
                "data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/30",
                "data-[state=inactive]:text-slate-400"
              )}
            >
              <TrendingUp className="mr-2 size-4" />
              Órdenes
            </TabsTrigger>
          </TabsList>

          {/* Sales Chart */}
          <TabsContent value="sales">
            <ChartContainer
              config={chartConfig}
              className="h-[360px] w-full rounded-3xl border border-white/10 bg-white/3 p-4 backdrop-blur"
            >
              <BarChart
                accessibilityLayer
                data={data}
                margin={{ top: 20, right: 20, left: 10, bottom: data.length > 14 ? 60 : 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-slate-800"
                  vertical={false}
                  opacity={0.5}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  className="text-xs font-medium fill-slate-400"
                  angle={data.length > 14 ? -45 : 0}
                  textAnchor={data.length > 14 ? "end" : "middle"}
                  height={data.length > 14 ? 60 : 30}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  className="text-xs font-medium fill-slate-400"
                  tickFormatter={(value) => `$${value >= 1000 ? (value / 1000).toFixed(1) + 'K' : value}`}
                />
                <ChartTooltip
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;

                    const data = payload[0].payload;

                    return (
                      <div className="bg-slate-900/95 backdrop-blur-md border-2 order-blue-700 rounded-xl shadow-2xl p-4 min-w-[200px]">
                        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-700">
                          <div className="w-3 h-3 rounded-full bg-linear-to-br from-blue-500 to-purple-600 shrink-0 shadow-sm" />
                          <span className="text-sm font-boldtext-white">
                            {data.date}
                          </span>
                        </div>

                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-center justify-between gap-6">
                            <span className="text-xs font-medium text-slate-400">
                              Ventas:
                            </span>
                            <span className="font-mono font-bold text-base bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              ${Number(data.sales).toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-6">
                            <span className="text-xs font-medium text-slate-400">
                              Órdenes:
                            </span>
                            <span className="font-mono font-semibold text-sm text-slate-300">
                              {data.orders}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
                <Bar
                  dataKey="sales"
                  fill="hsl(217, 91%, 60%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </TabsContent>

          {/* Orders Chart */}
          <TabsContent value="orders">
            <ChartContainer
              config={chartConfig}
              className="h-[360px] w-full rounded-3xl border border-white/10 bg-white/3 p-4 backdrop-blur"
            >
              <BarChart
                accessibilityLayer
                data={data}
                margin={{ top: 20, right: 20, left: 10, bottom: data.length > 14 ? 60 : 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-slate-800"
                  vertical={false}
                  opacity={0.5}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  className="text-xs font-medium fill-slate-400"
                  angle={data.length > 14 ? -45 : 0}
                  textAnchor={data.length > 14 ? "end" : "middle"}
                  height={data.length > 14 ? 60 : 30}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  className="text-xs font-medium fill-slate-400"
                  allowDecimals={false}
                />
                <ChartTooltip
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;

                    const data = payload[0].payload;

                    return (
                      <div className="bg-slate-900/95 backdrop-blur-md border-2 border-orange-700 rounded-xl shadow-2xl p-4 min-w-[200px]">
                        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-700">
                          <div className="w-3 h-3 rounded-full bg-linear-to-br from-orange-500 to-red-500 shrink-0 shadow-sm" />
                          <span className="text-sm font-bold text-white">
                            {data.date}
                          </span>
                        </div>

                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-center justify-between gap-6">
                            <span className="text-xs font-medium text-slate-400">
                              Órdenes:
                            </span>
                            <span className="font-mono font-bold text-base bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                              {data.orders}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-6">
                            <span className="text-xs font-medium text-slate-400">
                              Ventas:
                            </span>
                            <span className="font-mono font-semibold text-sm text-slate-400">
                              ${Number(data.sales).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
                <Bar
                  dataKey="orders"
                  fill="hsl(25, 95%, 53%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
