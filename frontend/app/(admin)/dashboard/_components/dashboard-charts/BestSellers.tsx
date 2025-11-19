"use client";

import { Pie } from "react-chartjs-2";
import { useTheme } from "next-themes";
import { TrendingUp } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import Typography from "../../../components/ui/typography";
import useGetMountStatus from "../../../hooks/use-get-mount-status";

export default function BestSellers() {
  const mounted = useGetMountStatus();
  const { theme } = useTheme();

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
              Best Sellers
            </Typography>
            <Typography className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Top performing products
            </Typography>
          </div>

          <TrendingUp className="size-5 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="relative h-[20rem]">
          {mounted ? (
            <>
              <Pie
                data={{
                  labels: [
                    "Green Leaf Lettuce",
                    "Rainbow Chard",
                    "Clementine",
                    "Mint",
                  ],
                  datasets: [
                    {
                      label: "Orders",
                      data: [270, 238, 203, 153],
                      backgroundColor: [
                        "rgb(59, 130, 246)",
                        "rgb(168, 85, 247)",
                        "rgb(249, 115, 22)",
                        "rgb(34, 197, 94)",
                      ],
                      borderColor: theme === "light"
                        ? "rgb(255, 255, 255)"
                        : "rgb(15, 23, 42)",
                      borderWidth: 3,
                      hoverOffset: 8,
                      hoverBorderColor: theme === "light"
                        ? "rgb(255, 255, 255)"
                        : "rgb(15, 23, 42)",
                      hoverBorderWidth: 4,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'bottom',
                      labels: {
                        padding: 16,
                        color: textColor,
                        font: {
                          size: 13,
                          weight: 500,
                        },
                        usePointStyle: true,
                        pointStyle: 'circle',
                      },
                    },
                    tooltip: {
                      backgroundColor: theme === "light"
                        ? "rgba(15, 23, 42, 0.95)"
                        : "rgba(255, 255, 255, 0.95)",
                      titleColor: theme === "light" ? "#fff" : "#0f172a",
                      bodyColor: theme === "light" ? "#fff" : "#0f172a",
                      borderColor: theme === "light"
                        ? "rgba(59, 130, 246, 0.2)"
                        : "rgba(59, 130, 246, 0.5)",
                      borderWidth: 1,
                      padding: 12,
                      cornerRadius: 8,
                      displayColors: true,
                      callbacks: {
                        label: (context) => {
                          const label = context.label || '';
                          const value = context.parsed || 0;
                          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${label}: ${value} orders (${percentage}%)`;
                        },
                      },
                    },
                  },
                }}
              />
            </>
          ) : (
            <Skeleton className="size-full rounded-xl" />
          )}
        </div>
      </div>
    </div>
  );
}
