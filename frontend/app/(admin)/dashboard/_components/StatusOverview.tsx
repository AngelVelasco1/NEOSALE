import {
  Clock,
  PackageCheck,
  Truck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";
import Typography from "@/app/(admin)/components/ui/typography";
import { getOrderStatusStats, DateRangeParams } from "@/app/(admin)/actions/dashboard/getDashboardStats";


interface OrderStatus {
  icon: ReactNode;
  title: string;
  count: number;
  percentage: number;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface StatusOverviewProps {
  dateRange?: DateRangeParams;
}

export default async function StatusOverview({ dateRange }: StatusOverviewProps) {
  const statusStats = await getOrderStatusStats(dateRange);
  const totalOrders = statusStats.total || 1;

  const statuses: OrderStatus[] = [
    {
      icon: <Clock className="size-5" />,
      title: "Pending",
      count: statusStats.pending,
      percentage: Math.round((statusStats.pending / totalOrders) * 100),
      color: "text-amber-700 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
      borderColor: "border-amber-300 dark:border-amber-900/50",
    },
    {
      icon: <PackageCheck className="size-5" />,
      title: "Processing",
      count: statusStats.processing,
      percentage: Math.round((statusStats.processing / totalOrders) * 100),
      color: "text-blue-700 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      borderColor: "border-blue-300 dark:border-blue-900/50",
    },
    {
      icon: <Truck className="size-5" />,
      title: "Shipped",
      count: statusStats.shipped,
      percentage: Math.round((statusStats.shipped / totalOrders) * 100),
      color: "text-purple-700 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      borderColor: "border-purple-300 dark:border-purple-900/50",
    },
    {
      icon: <CheckCircle2 className="size-5" />,
      title: "Delivered",
      count: statusStats.delivered,
      percentage: Math.round((statusStats.delivered / totalOrders) * 100),
      color: "text-emerald-700 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      borderColor: "border-emerald-300 dark:border-emerald-900/50",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography component="h3" className="text-lg font-semibold text-slate-900 dark:text-white">
            Estado de Pedidos
          </Typography>
          <Typography className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Distribución actual de pedidos por estado
          </Typography>
        </div>
        <a href="/dashboard/orders" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors">
          Ver todos los pedidos
          <ArrowRight className="size-4" />
        </a>
      </div>

      {/* Status Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statuses.map((status, index) => (
          <div
            key={`status-${index}`}
            className={cn(
              "relative group rounded-xl border p-4 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/80 dark:hover:shadow-black/30 hover:-translate-y-0.5",
              status.bgColor,
              status.borderColor
            )}
          >
            {/* Icon Badge */}
            <div className={cn(
              "inline-flex p-2.5 rounded-lg mb-3",
              status.title === "Pending" && "bg-amber-100 dark:bg-amber-950/50",
              status.title === "Processing" && "bg-blue-100 dark:bg-blue-950/50",
              status.title === "Shipped" && "bg-purple-100 dark:bg-purple-950/50",
              status.title === "Delivered" && "bg-emerald-100 dark:bg-emerald-950/50"
            )}>
              <div className={status.color}>
                {status.icon}
              </div>
            </div>

            {/* Status Info */}
            <div className="space-y-1">
              <Typography className={cn("text-xs font-medium", status.color)}>
                {status.title}
              </Typography>

              <div className="flex items-baseline gap-2">
                <Typography className="text-2xl font-bold text-slate-900 dark:text-white">
                  {status.count}
                </Typography>
                <Typography className="text-xs text-slate-500 dark:text-slate-400">
                  orders
                </Typography>
              </div>
            </div>

            {/* Percentage Badge */}
            <div className={cn(
              "absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-semibold",
              status.title === "Pending" && "bg-amber-200 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300",
              status.title === "Processing" && "bg-blue-200 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300",
              status.title === "Shipped" && "bg-purple-200 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300",
              status.title === "Delivered" && "bg-emerald-200 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300"
            )}>
              {status.percentage}%
            </div>

            {/* Progress Bar */}
            <div className="mt-3 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  status.color.replace("text-", "bg-")
                )}
                style={{ width: `${status.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>


    </div>
  );
}
