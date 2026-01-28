"use client";

import { useMemo, useState } from "react";
import { DollarSign, Package } from "lucide-react";
import { Cell, Label, Pie, PieChart } from "recharts";
import { differenceInDays } from "date-fns";

import Typography from "../../../components/ui/typography";
import {
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { CategorySalesData, DateRangeParams } from "../../../actions/dashboard/getChartData";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS = [
  "hsl(217, 91%, 60%)",
  "hsl(271, 81%, 56%)",
  "hsl(25, 95%, 53%)",
  "hsl(142, 76%, 36%)",
  "hsl(346, 77%, 50%)",
  "hsl(262, 83%, 58%)",
  "hsl(199, 89%, 48%)",
  "hsl(48, 96%, 53%)",
];

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 0,
});

export interface CategoriesSellsProps {
  data: CategorySalesData[];
  totalOrders: number;
  dateRange?: DateRangeParams;
}

export default function CategoriesSells({ data, totalOrders, dateRange }: CategoriesSellsProps) {

  const [activeSlice, setActiveSlice] = useState<number | null>(null);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => b.sales - a.sales);
  }, [data]);

  const chartConfig = sortedData.reduce<Record<string, { label: string; color: string }>>(
    (config, item, index) => {
      // Sanitize category name for CSS variable (remove spaces and special chars)
      const sanitizedKey = item.category.toLowerCase().replace(/[^a-z0-9]/g, '');

      return {
        ...config,
        [sanitizedKey]: {
          label: item.category,
          color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
        }
      };
    },
    {}
  );

  // Calculate total for display
  const totalSales = sortedData.reduce((sum, item) => sum + item.sales, 0);
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
  const chartData = useMemo(() => {
    return sortedData.map((item, index) => {
      const share = totalSales > 0 ? (item.sales / totalSales) * 100 : 0;
      return {
        category: item.category,
        sales: item.sales,
        orders: item.orders,
        fill: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
        percentage: share,
      };
    });
  }, [sortedData, totalSales]);

  const highlightedIndex = activeSlice ?? (chartData.length ? 0 : null);
  const highlightedCategory =
    highlightedIndex !== null ? chartData[highlightedIndex] : undefined;
  const topCategory = chartData[0];
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  return (
    <div className="relative overflow-hidden rounded-[34px] border border-slate-200/70 dark:border-slate-800 bg-white/95 dark:bg-slate-950/85">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-0 h-60 w-60 rounded-full bg-cyan-500/15 blur-[140px]" />
        <div className="absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-fuchsia-500/12 blur-[160px]" />
      </div>

      <div className="relative border-b border-white/10 px-6 py-5 backdrop-blur">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <Typography className="block text-2xl font-semibold text-white">
              Ventas por Categoría
            </Typography>
            <Typography className="text-sm text-white/70">
              Distribución de ventas • {periodDescription || "período seleccionado"}
            </Typography>
          </div>
        
        </div>
      </div>

      <div className="relative px-6 mt-3">
        
          <div className="rounded-3xl flex justify-between border border-white/10 bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent px-5 py-3 text-white shadow-inner shadow-emerald-900/30">
           <div>
             <p className="text-[11px] uppercase tracking-[0.3em] text-emerald-100">Top categoría</p>
            <p className="text-lg font-semibold">
              {topCategory ? topCategory.category : "Sin datos"}
            </p>
           </div>
            <p className="text-xs text-white/70">
              {topCategory ? `${topCategory.percentage.toFixed(1)}% del total` : "Aún sin registros"}
            </p>
          </div>
      </div>

      {/* Content */}
      <div className="relative p-5">
        {data.length === 0 ? (
          <div className="flex h-[400px] items-center justify-center text-white/60">
            <div className="text-center">
              <Package className="size-12 mx-auto mb-2 opacity-40" />
              <Typography className="text-sm text-white/70">No hay datos disponibles</Typography>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 items-center lg:flex-row lg:items-start">
            {/* Pie Chart */}
            <div className="flex-1 w-full">
              <ChartContainer
                config={chartConfig}
                className="h-[300px] w-full rounded-3xl border border-white/10 bg-white/10 dark:bg-slate-900/40 p-4 shadow-[0_30px_80px_-60px_rgba(15,23,42,1)] backdrop-blur-xl"
              >
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
                                {currencyFormatter.format(data.sales)}
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
                              <span className="font-mono font-bold text-sm bg-linear-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                                {data.percentage.toFixed(1)}%
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
                    innerRadius={60}
                    outerRadius={110}
                    strokeWidth={3}
                    paddingAngle={3}
                    stroke="hsl(var(--background))"
                    onMouseLeave={() => setActiveSlice(null)}
                    onMouseEnter={(_, index) => setActiveSlice(index)}
                  >
                    {chartData.map((slice, index) => (
                      <Cell
                        key={slice.category}
                        fill={slice.fill}
                        fillOpacity={highlightedIndex === null || highlightedIndex === index ? 1 : 0.3}
                        stroke={slice.fill}
                        strokeWidth={highlightedIndex === index ? 4 : 2}
                      />
                    ))}
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
                                className="fill-slate-900 dark:fill-white text-2xl font-bold"
                              >
                                {currencyFormatter.format(totalSales)}
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

              {chartData.length > 0 && (
                <div className="mt-3 flex w-full flex-wrap items-center justify-center gap-3 rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur">
                  {chartData.map((item, index) => {
                    const isActive = highlightedIndex === index;
                    return (
                      <button
                        key={item.category}
                        type="button"
                        onMouseEnter={() => setActiveSlice(index)}
                        onFocus={() => setActiveSlice(index)}
                        onClick={() => setActiveSlice(index)}
                        className={cn(
                          "flex items-center gap-2 rounded-full px-2 py-1.5 text-xs font-semibold transition",
                          isActive
                            ? "bg-white/10 text-white"
                            : "bg-white/5 text-white/70 hover:bg-white/10"
                        )}
                      >
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: item.fill }}
                        />
                        <span className="truncate max-w-[120px] text-left">
                          {item.category}
                        </span>
                        <span className="text-white/60">
                          {item.percentage.toFixed(1)}%
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

         
          </div>
        )}
      </div>
    </div>
  );
}
