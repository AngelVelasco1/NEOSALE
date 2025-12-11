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

interface WeeklySalesProps {
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
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-linear-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <Typography className="text-lg block font-bold text-slate-900 dark:text-white">
              Ventas y Órdenes
            </Typography>
            <Typography className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Análisis del período seleccionado • {periodDescription}
            </Typography>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-linear-to-r from-blue-100 to-purple-100 dark:from-blue-950/50 dark:to-purple-950/50 rounded-lg border border-blue-200/50 dark:border-blue-900/50">
              <Typography className="text-sm font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ${totalSales.toLocaleString()}
              </Typography>
            </div>
            <div className="px-3 py-1.5 bg-linear-to-r from-orange-100 to-red-100 dark:from-orange-950/50 dark:to-red-950/50 rounded-lg border border-orange-200/50 dark:border-orange-900/50">
              <Typography className="text-sm font-bold bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {totalOrders} órdenes
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <Tabs defaultValue="sales">
          <TabsList className="w-full grid grid-cols-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <TabsTrigger
              value="sales"
              className={cn(
                "rounded-lg font-semibold transition-all duration-200",
                "data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600",
                "data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25",
                "data-[state=inactive]:text-slate-600 dark:data-[state=inactive]:text-slate-400"
              )}
            >
              <DollarSign className="size-4 mr-2" />
              Ventas
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className={cn(
                "rounded-lg font-semibold transition-all duration-200",
                "data-[state=active]:bg-linear-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500",
                "data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/25",
                "data-[state=inactive]:text-slate-600 dark:data-[state=inactive]:text-slate-400"
              )}
            >
              <TrendingUp className="size-4 mr-2" />
              Órdenes
            </TabsTrigger>
          </TabsList>

          {/* Sales Chart */}
          <TabsContent value="sales" className="mt-6">
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
              <BarChart
                accessibilityLayer
                data={data}
                margin={{ top: 20, right: 20, left: 10, bottom: data.length > 14 ? 60 : 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-slate-200 dark:stroke-slate-800"
                  vertical={false}
                  opacity={0.5}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  className="text-xs font-medium fill-slate-600 dark:fill-slate-400"
                  angle={data.length > 14 ? -45 : 0}
                  textAnchor={data.length > 14 ? "end" : "middle"}
                  height={data.length > 14 ? 60 : 30}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  className="text-xs font-medium fill-slate-600 dark:fill-slate-400"
                  tickFormatter={(value) => `$${value >= 1000 ? (value / 1000).toFixed(1) + 'K' : value}`}
                />
                <ChartTooltip
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;

                    const data = payload[0].payload;

                    return (
                      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-blue-200 dark:border-blue-700 rounded-xl shadow-2xl p-4 min-w-[200px]">
                        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                          <div className="w-3 h-3 rounded-full bg-linear-to-br from-blue-500 to-purple-600 shrink-0 shadow-sm" />
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {data.date}
                          </span>
                        </div>

                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-center justify-between gap-6">
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                              Ventas:
                            </span>
                            <span className="font-mono font-bold text-base bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              ${Number(data.sales).toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-6">
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                              Órdenes:
                            </span>
                            <span className="font-mono font-semibold text-sm text-slate-700 dark:text-slate-300">
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
          <TabsContent value="orders" className="mt-6">
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
              <BarChart
                accessibilityLayer
                data={data}
                margin={{ top: 20, right: 20, left: 10, bottom: data.length > 14 ? 60 : 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-slate-200 dark:stroke-slate-800"
                  vertical={false}
                  opacity={0.5}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  className="text-xs font-medium fill-slate-600 dark:fill-slate-400"
                  angle={data.length > 14 ? -45 : 0}
                  textAnchor={data.length > 14 ? "end" : "middle"}
                  height={data.length > 14 ? 60 : 30}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  className="text-xs font-medium fill-slate-600 dark:fill-slate-400"
                  allowDecimals={false}
                />
                <ChartTooltip
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;

                    const data = payload[0].payload;

                    return (
                      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-orange-200 dark:border-orange-700 rounded-xl shadow-2xl p-4 min-w-[200px]">
                        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                          <div className="w-3 h-3 rounded-full bg-linear-to-br from-orange-500 to-red-500 shrink-0 shadow-sm" />
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {data.date}
                          </span>
                        </div>

                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-center justify-between gap-6">
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                              Órdenes:
                            </span>
                            <span className="font-mono font-bold text-base bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                              {data.orders}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-6">
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                              Ventas:
                            </span>
                            <span className="font-mono font-semibold text-sm text-slate-700 dark:text-slate-300">
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
