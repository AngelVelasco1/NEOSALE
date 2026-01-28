import { getDashboardStats, DateRangeParams } from "@/app/(admin)/actions/dashboard/getDashboardStats";
import SalesOverviewClient from "./SalesOverviewClient";
import type {
  MetricCardDescriptor,
  QuickStatDescriptor,
} from "./SalesOverview.types";
import { DEFAULT_METRIC_GOALS, MetricGoalKey } from "./goalPresets";

type GoalOverrides = Partial<Record<MetricGoalKey, number>>;

interface SalesOverviewProps {
  dateRange?: DateRangeParams;
  goalOverrides?: GoalOverrides;
}

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const integerFormatter = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
});

const formatCurrency = (value: number) => currencyFormatter.format(value);
const formatInteger = (value: number) => integerFormatter.format(value);

const metricGoalPresets: Record<MetricGoalKey, {
  label: string;
  formatter: (value: number) => string;
}> = {
  revenue: {
    label: DEFAULT_METRIC_GOALS.revenue.label,
    formatter: formatCurrency,
  },
  orders: {
    label: DEFAULT_METRIC_GOALS.orders.label,
    formatter: formatInteger,
  },
  products: {
    label: DEFAULT_METRIC_GOALS.products.label,
    formatter: formatInteger,
  },
  customers: {
    label: DEFAULT_METRIC_GOALS.customers.label,
    formatter: formatInteger,
  },
};

const formatChange = (value: number): string => {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
};

const getChangeType = (value: number): "increase" | "decrease" | "neutral" => {
  if (value > 0) return "increase";
  if (value < 0) return "decrease";
  return "neutral";
};

const formatRangeLabel = (range?: DateRangeParams) => {
  if (range?.from && range?.to) {
    const start = dateFormatter.format(new Date(range.from));
    const end = dateFormatter.format(new Date(range.to));
    return `${start} – ${end}`;
  }
  return "Últimos 30 días";
};

export default async function SalesOverview({ dateRange, goalOverrides }: SalesOverviewProps) {
  const stats = await getDashboardStats(dateRange);

  const metricConfigs = [
    {
      icon: "revenue",
      title: "Ganancias",
      subtitle: "Ingresos netos",
      rawValue: stats.totalRevenue,
      changeValue: stats.revenueChange,
      gradient: "from-sky-500/40 via-blue-500/40 to-indigo-500/40",
      border: "border-sky-500/25",
      glow: "shadow-sky-500/30",
      iconBg: "bg-white/20",
      valueFormatter: formatCurrency,
      goalKey: "revenue" as const,
      fallbackProgressLabel: "Seguimiento relativo",
    },
    {
      icon: "orders",
      title: "Pedidos totales",
      subtitle: "Volumen confirmado",
      rawValue: stats.totalOrders,
      changeValue: stats.ordersChange,
      gradient: "from-violet-500/35 via-fuchsia-500/40 to-purple-500/35",
      border: "border-purple-500/25",
      glow: "shadow-violet-500/30",
      iconBg: "bg-white/15",
      valueFormatter: formatInteger,
      goalKey: "orders" as const,
      fallbackProgressLabel: "Volumen respecto al período",
    },
    {
      icon: "products",
      title: "Productos vendidos",
      subtitle: "Unidades enviadas",
      rawValue: stats.productsSold,
      changeValue: stats.productsSoldChange,
      gradient: "from-emerald-500/35 via-teal-500/35 to-green-500/35",
      border: "border-emerald-500/25",
      glow: "shadow-emerald-500/30",
      iconBg: "bg-white/15",
      valueFormatter: formatInteger,
      goalKey: "products" as const,
      fallbackProgressLabel: "Dinámica del catálogo",
    },
    {
      icon: "customers",
      title: "Nuevos clientes",
      subtitle: "Altas verificadas",
      rawValue: stats.newCustomers,
      changeValue: stats.customersChange,
      gradient: "from-amber-500/35 via-orange-500/35 to-rose-500/35",
      border: "border-amber-500/20",
      glow: "shadow-amber-500/30",
      iconBg: "bg-white/15",
      valueFormatter: formatInteger,
      goalKey: "customers" as const,
      fallbackProgressLabel: "Crecimiento relativo",
    },
  ] as const;

  const normalizedValues = metricConfigs.map((metric) =>
    metric.rawValue > 0 ? Math.log10(metric.rawValue + 1) : 0
  );
  const maxNormalized = Math.max(...normalizedValues, 1);

  const rangeLabel = formatRangeLabel(dateRange);

  const metrics: MetricCardDescriptor[] = metricConfigs.map((metric, index) => {
    const goalPreset = metricGoalPresets[metric.goalKey];
    const overrideValue = goalOverrides?.[metric.goalKey];
    const baseGoalValue = DEFAULT_METRIC_GOALS[metric.goalKey].value;
    const hasCustomGoal = typeof overrideValue === "number" && overrideValue > 0;
    const goalValue = hasCustomGoal ? overrideValue : baseGoalValue;
    const hasGoal = goalValue > 0;
    const goalProgress = hasGoal
      ? (metric.rawValue / goalValue) * 100
      : undefined;
    const relativeProgress = maxNormalized > 0
      ? (normalizedValues[index] / maxNormalized) * 100
      : 0;
    const computedProgress = goalProgress ?? relativeProgress;
    const normalizedProgress = Math.max(
      0,
      Number.isFinite(computedProgress) ? computedProgress : 0
    );
    const visualProgress =
      hasGoal && metric.rawValue > 0 && normalizedProgress > 0 && normalizedProgress < 1
        ? 1
        : normalizedProgress;

    const goalFormatted = hasGoal
      ? goalPreset.formatter(goalValue)
      : undefined;

    return {
      icon: metric.icon,
      title: metric.title,
      subtitle: metric.subtitle,
      value: metric.valueFormatter(metric.rawValue),
      change: formatChange(metric.changeValue),
      changeType: getChangeType(metric.changeValue),
      gradient: metric.gradient,
      border: metric.border,
      glow: metric.glow,
      iconBg: metric.iconBg,
      progressValue: visualProgress,
      progressLabel: hasGoal ? undefined : metric.fallbackProgressLabel,
      badgeLabel: rangeLabel,
      goalFormatted,
    } satisfies MetricCardDescriptor;
  });

  const quickStats: QuickStatDescriptor[] = [
    {
      icon: "trend",
      title: "Ticket promedio",
      helper: "Ingreso medio por pedido",
      value: formatCurrency(stats.avgOrderValue),
      background: "from-sky-500/20 via-blue-500/5 to-transparent",
      border: "border-sky-500/20",
      accent: "text-sky-200",
    },
    {
      icon: "conversion",
      title: "Tasa de conversión",
      helper: "Sesiones que compran",
      value: `${stats.conversionRate.toFixed(2)}%`,
      background: "from-fuchsia-500/15 via-purple-500/5 to-transparent",
      border: "border-fuchsia-500/20",
      accent: "text-fuchsia-200",
    },
    {
      icon: "pending",
      title: "Pedidos pendientes",
      helper: "Incluye pagos en revisión",
      value: stats.pendingOrders.toLocaleString("es-CO"),
      background: "from-emerald-500/15 via-teal-500/5 to-transparent",
      border: "border-emerald-500/20",
      accent: "text-emerald-200",
    },
    {
      icon: "activeUsers",
      title: "Usuarios activos",
      helper: "Clientes recurrentes",
      value: stats.activeUsers.toLocaleString("es-CO"),
      background: "from-orange-500/15 via-amber-500/5 to-transparent",
      border: "border-orange-500/20",
      accent: "text-orange-200",
    },
  ];



  return (
    <SalesOverviewClient
      metrics={metrics}
      quickStats={quickStats}
    />
  );
}
