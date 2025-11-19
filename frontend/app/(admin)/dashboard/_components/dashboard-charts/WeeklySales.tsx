"use client";

import { Line } from "react-chartjs-2";
import { useTheme } from "next-themes";
import { TrendingUp, DollarSign, DollarSignIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import Typography from "../../../components/ui/typography";
import { getPastDates } from "../../../helpers/getPastDates";
import useGetMountStatus from "../../../hooks/use-get-mount-status";
import { cn } from "@/lib/utils";

export default function WeeklySales() {
  const labels = getPastDates(7);
  const { theme } = useTheme();
  const mounted = useGetMountStatus();

  const gridColor = theme === "light"
    ? "rgba(203, 213, 225, 0.5)"
    : "rgba(51, 65, 85, 0.5)";

  const textColor = theme === "light"
    ? "rgb(71, 85, 105)"
    : "rgb(203, 213, 225)";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <Typography className="text-lg block font-bold text-slate-900 dark:text-white">
              Weekly Performance
            </Typography>
            <Typography className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Last 7 days overview
            </Typography>
          </div>
          <DollarSignIcon className="size-5 text-white" />

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
                "data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600",
                "data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25",
                "data-[state=inactive]:text-slate-600 dark:data-[state=inactive]:text-slate-400"
              )}
            >
              <DollarSign className="size-4 mr-2" />
              Sales
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className={cn(
                "rounded-lg font-semibold transition-all duration-200",
                "data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500",
                "data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/25",
                "data-[state=inactive]:text-slate-600 dark:data-[state=inactive]:text-slate-400"
              )}
            >
              <TrendingUp className="size-4 mr-2" />
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="relative h-72 mt-6">
            {mounted ? (
              <Line
                data={{
                  labels,
                  datasets: [
                    {
                      label: "Sales",
                      data: [400, 300, 100, 250, 200, 300, 1000],
                      borderColor: "rgb(59, 130, 246)",
                      backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                        gradient.addColorStop(0, "rgba(59, 130, 246, 0.3)");
                        gradient.addColorStop(1, "rgba(168, 85, 247, 0.05)");
                        return gradient;
                      },
                      borderWidth: 3,
                      fill: true,
                      tension: 0.4,
                      pointRadius: 5,
                      pointBackgroundColor: "rgb(59, 130, 246)",
                      pointBorderColor: "#fff",
                      pointBorderWidth: 2,
                      pointHoverRadius: 7,
                      pointHoverBackgroundColor: "rgb(59, 130, 246)",
                      pointHoverBorderColor: "#fff",
                      pointHoverBorderWidth: 3,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  interaction: {
                    intersect: false,
                    mode: 'index',
                  },
                  scales: {
                    y: {
                      grid: {
                        color: gridColor,
                        lineWidth: 1,
                      },
                      border: {
                        display: false,
                      },
                      ticks: {
                        stepSize: 200,
                        callback: function (value) {
                          return "$" + value;
                        },
                        padding: 8,
                        color: textColor,
                        font: {
                          size: 12,
                          weight: 500,
                        },
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                      border: {
                        display: false,
                      },
                      ticks: {
                        padding: 8,
                        color: textColor,
                        font: {
                          size: 12,
                          weight: 500,
                        },
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      backgroundColor: theme === "light" ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
                      titleColor: theme === "light" ? "#fff" : "#0f172a",
                      bodyColor: theme === "light" ? "#fff" : "#0f172a",
                      borderColor: theme === "light" ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.5)",
                      borderWidth: 1,
                      padding: 12,
                      cornerRadius: 8,
                      displayColors: false,
                      callbacks: {
                        label: (context) =>
                          `${context.dataset.label}: $${context.parsed.y}`,
                      },
                    },
                  },
                }}
              />
            ) : (
              <Skeleton className="size-full rounded-xl" />
            )}
          </TabsContent>

          <TabsContent value="orders" className="relative h-72 mt-6">
            {mounted ? (
              <Line
                data={{
                  labels,
                  datasets: [
                    {
                      label: "Orders",
                      data: [3, 3, 1, 4, 1, 1, 2],
                      borderColor: "rgb(249, 115, 22)",
                      backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                        gradient.addColorStop(0, "rgba(249, 115, 22, 0.3)");
                        gradient.addColorStop(1, "rgba(239, 68, 68, 0.05)");
                        return gradient;
                      },
                      borderWidth: 3,
                      fill: true,
                      tension: 0.4,
                      pointRadius: 5,
                      pointBackgroundColor: "rgb(249, 115, 22)",
                      pointBorderColor: "#fff",
                      pointBorderWidth: 2,
                      pointHoverRadius: 7,
                      pointHoverBackgroundColor: "rgb(249, 115, 22)",
                      pointHoverBorderColor: "#fff",
                      pointHoverBorderWidth: 3,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  interaction: {
                    intersect: false,
                    mode: 'index',
                  },
                  scales: {
                    y: {
                      grid: {
                        color: gridColor,
                        lineWidth: 1,
                      },
                      border: {
                        display: false,
                      },
                      ticks: {
                        stepSize: 1,
                        padding: 8,
                        color: textColor,
                        font: {
                          size: 12,
                          weight: 500,
                        },
                      },
                      min: 0,
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                      border: {
                        display: false,
                      },
                      ticks: {
                        padding: 8,
                        color: textColor,
                        font: {
                          size: 12,
                          weight: 500,
                        },
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      backgroundColor: theme === "light" ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
                      titleColor: theme === "light" ? "#fff" : "#0f172a",
                      bodyColor: theme === "light" ? "#fff" : "#0f172a",
                      borderColor: theme === "light" ? "rgba(249, 115, 22, 0.2)" : "rgba(249, 115, 22, 0.5)",
                      borderWidth: 1,
                      padding: 12,
                      cornerRadius: 8,
                      displayColors: false,
                    },
                  },
                }}
              />
            ) : (
              <Skeleton className="size-full rounded-xl" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
