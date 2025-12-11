"use client";

import { Package } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import { differenceInDays } from "date-fns";

import Typography from "../../../components/ui/typography";
import {
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { CategorySalesData, DateRangeParams } from "../../../actions/dashboard/getChartData";

interface BestSellersProps {
  data: CategorySalesData[];
  totalOrders: number;
  dateRange?: DateRangeParams;
}

export default function BestSellers({ data, totalOrders, dateRange }: BestSellersProps) {
  // Modern vibrant color palette aligned with brand colors
  const colors = [
    "hsl(217, 91%, 60%)",   // blue (primary brand)
    "hsl(271, 81%, 56%)",   // purple (secondary brand)
    "hsl(25, 95%, 53%)",    // orange
    "hsl(142, 76%, 36%)",   // emerald
    "hsl(346, 77%, 50%)",   // red
    "hsl(262, 83%, 58%)",   // violet
    "hsl(199, 89%, 48%)",   // cyan
    "hsl(48, 96%, 53%)",    // yellow
  ];

  const chartConfig = data.reduce<Record<string, { label: string; color: string }>>(
    (config, item, index) => {
      // Sanitize category name for CSS variable (remove spaces and special chars)
      const sanitizedKey = item.category.toLowerCase().replace(/[^a-z0-9]/g, '');

      return {
        ...config,
        [sanitizedKey]: {
          label: item.category,
          color: colors[index % colors.length],
        }
      };
    },
    {}
  );

  // Calculate total for display
  const totalSales = data.reduce((sum, item) => sum + item.sales, 0);
  // totalOrders now comes from props (unique orders count)

  // Calculate period description
  const getPeriodDescription = () => {
    if (!dateRange?.from || !dateRange?.to) {
      return "período seleccionado";
    }

    const from = typeof dateRange.from === 'string' ? new Date(dateRange.from) : dateRange.from;
    const to = typeof dateRange.to === 'string' ? new Date(dateRange.to) : dateRange.to;
    const days = differenceInDays(to, from) + 1;

    if (days === 1) return "1 día";
    if (days > 1) return `${days} días`;

  };

  const periodDescription = getPeriodDescription();

  // Format data for recharts with explicit colors
  const chartData = data.map((item, index) => {
    return {
      category: item.category,
      sales: item.sales,
      orders: item.orders,
      fill: colors[index % colors.length],
      percentage: ((item.sales / totalSales) * 100).toFixed(1),
    };
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-linear-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <Typography className="text-lg block font-bold text-slate-900 dark:text-white">
              Ventas por Categoría
            </Typography>
            <Typography className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Distribución de ventas • {periodDescription}
            </Typography>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-linear-to-r from-blue-100 to-purple-100 dark:from-blue-950/50 dark:to-purple-950/50 rounded-lg border border-blue-200/50 dark:border-blue-900/50">
              <Typography className="text-sm font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {totalOrders} órdenes
              </Typography>
            </div>
            <div className="p-2 bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-950/50 dark:to-purple-950/50 rounded-lg">
              <Package className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-[400px] text-slate-500 dark:text-slate-400">
            <div className="text-center">
              <Package className="size-12 mx-auto mb-2 opacity-50" />
              <Typography className="text-sm">No hay datos disponibles</Typography>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* Pie Chart */}
            <div className="flex-1 w-full">
              <ChartContainer config={chartConfig} className="h-[350px] w-full">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;

                      const data = payload[0].payload;

                      return (
                        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-4 min-w-[220px]">
                          {/* Category Header with Color Indicator */}
                          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                            <div
                              className="w-3 h-3 rounded-full shrink-0 ring-2 ring-white dark:ring-slate-900 shadow-sm"
                              style={{ backgroundColor: data.fill }}
                            />
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {data.category}
                            </span>
                          </div>

                          {/* Stats Grid */}
                          <div className="flex flex-col gap-2.5">
                            <div className="flex items-center justify-between gap-6">
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                Ventas:
                              </span>
                              <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                                ${Number(data.sales).toLocaleString()}
                              </span>
                            </div>

                            <div className="flex items-center justify-between gap-6">
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                Órdenes:
                              </span>
                              <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                                {data.orders}
                              </span>
                            </div>

                            <div className="flex items-center justify-between gap-6 pt-2 border-t border-slate-100 dark:border-slate-800">
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                Del total:
                              </span>
                              <span className="font-mono font-bold text-sm bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {data.percentage}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Pie
                    data={chartData}
                    dataKey="sales"
                    nameKey="category"
                    innerRadius={70}
                    outerRadius={120}
                    strokeWidth={3}
                    paddingAngle={3}
                    stroke="hsl(var(--background))"
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-slate-900 dark:fill-white text-3xl font-bold"
                              >
                                ${(totalSales / 1000).toFixed(1)}K
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 28}
                                className="fill-slate-500 dark:fill-slate-400 text-sm font-medium"
                              >
                                Total Ventas
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>

            {/* Legend with Category Names */}
            <div className="w-full lg:w-64 flex flex-col gap-2">
              <Typography className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Categorías
              </Typography>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                {chartData.map((item) => (
                  <div
                    key={item.category}
                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div
                      className="w-4 h-4 rounded-full shrink-0 ring-2 ring-white dark:ring-slate-900"
                      style={{ backgroundColor: item.fill }}
                    />
                    <div className="flex-1 min-w-0">
                      <Typography className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {item.category}
                      </Typography>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <Typography className="text-xs text-slate-500 dark:text-slate-400">
                          {item.percentage}%
                        </Typography>
                        <Typography className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                          ${(item.sales / 1000).toFixed(1)}K
                        </Typography>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
