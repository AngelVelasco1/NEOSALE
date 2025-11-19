import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";
import Typography from "@/app/(admin)/components/ui/typography";

interface MetricCard {
  icon: ReactNode;
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease" | "neutral";
  subtitle: string;
  gradient: string;
  iconBg: string;
}

export default function SalesOverview() {
  const metrics: MetricCard[] = [
    {
      icon: <DollarSign className="size-6" />,
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      changeType: "increase",
      subtitle: "from last month",
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      icon: <ShoppingCart className="size-6" />,
      title: "Total Orders",
      value: "2,350",
      change: "+12.5%",
      changeType: "increase",
      subtitle: "from last month",
      gradient: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-50 dark:bg-purple-500/10",
    },
    {
      icon: <Package className="size-6" />,
      title: "Products Sold",
      value: "8,420",
      change: "+8.2%",
      changeType: "increase",
      subtitle: "from last month",
      gradient: "from-emerald-500 to-emerald-600",
      iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      icon: <Users className="size-6" />,
      title: "New Customers",
      value: "573",
      change: "-3.1%",
      changeType: "decrease",
      subtitle: "from last month",
      gradient: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-50 dark:bg-orange-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography component="h2" className="text-2xl font-bold text-slate-900 dark:text-white">
            Resumen de Ventas
          </Typography>
          <Typography className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Métricas clave e indicadores de rendimiento
          </Typography>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={`metric-${index}`}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-950/50 transition-all duration-300 hover:-translate-y-1"
          >
            {/* Background Gradient Overlay */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl",
              metric.gradient
            )} />

            <div className="relative">
              {/* Icon */}
              <div className={cn(
                "inline-flex items-center justify-center rounded-xl p-3 mb-4",
                metric.iconBg
              )}>
                <div className={cn(
                  metric.gradient.includes("blue") && "text-blue-600 dark:text-blue-400",
                  metric.gradient.includes("purple") && "text-purple-600 dark:text-purple-400",
                  metric.gradient.includes("emerald") && "text-emerald-600 dark:text-emerald-400",
                  metric.gradient.includes("orange") && "text-orange-600 dark:text-orange-400"
                )}>
                  {metric.icon}
                </div>
              </div>

              {/* Title */}
              <Typography className="text-sm font-medium ms-2 text-slate-600 dark:text-slate-400 mb-2">
                {metric.title}
              </Typography>

              {/* Value */}
              <div className="flex items-baseline gap-3 mb-3">
                <Typography className="text-3xl font-bold text-slate-900 dark:text-white">
                  {metric.value}
                </Typography>

                {/* Change Indicator */}
                <div className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
                  metric.changeType === "increase" && "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
                  metric.changeType === "decrease" && "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400",
                  metric.changeType === "neutral" && "bg-slate-100 dark:bg-slate-500/10 text-slate-700 dark:text-slate-400"
                )}>
                  {metric.changeType === "increase" ? (
                    <ArrowUpRight className="size-3" />
                  ) : metric.changeType === "decrease" ? (
                    <ArrowDownRight className="size-3" />
                  ) : null}
                  {metric.change}
                </div>
              </div>

              {/* Subtitle */}
              <Typography className="text-xs text-slate-500 dark:text-slate-400">
                {metric.subtitle}
              </Typography>

              {/* Progress Bar */}
              <div className="mt-4 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full bg-gradient-to-r rounded-full transition-all duration-500",
                    metric.gradient
                  )}
                  style={{
                    width: metric.changeType === "increase" ? "75%" : "45%"
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-lg">
              <TrendingUp className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <Typography className="text-xs block text-blue-700 dark:text-blue-400 font-medium">
                Avg Order Value
              </Typography>
              <Typography className="text-lg font-bold text-blue-900 dark:text-blue-300">
                $192.47
              </Typography>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border border-purple-200 dark:border-purple-900/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-500/10 rounded-lg">
              <ShoppingCart className="size-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <Typography className="text-xs block text-purple-700 dark:text-purple-400 font-medium">
                Conversion Rate
              </Typography>
              <Typography className="text-lg font-bold text-purple-900 dark:text-purple-300">
                3.24%
              </Typography>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-500/10 rounded-lg">
              <Package className="size-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <Typography className="text-xs block text-emerald-700 dark:text-emerald-400 font-medium">
                Pending Orders
              </Typography>
              <Typography className="text-lg font-bold text-emerald-900 dark:text-emerald-300">
                47
              </Typography>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 border border-orange-200 dark:border-orange-900/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-500/10 rounded-lg">
              <Users className="size-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <Typography className="text-xs block text-orange-700 dark:text-orange-400 font-medium">
                Active Users
              </Typography>
              <Typography className="text-lg font-bold text-orange-900 dark:text-orange-300">
                1,259
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
