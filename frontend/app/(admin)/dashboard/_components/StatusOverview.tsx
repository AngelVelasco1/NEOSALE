import { getOrderStatusStats, DateRangeParams } from "@/app/(admin)/actions/dashboard/getDashboardStats";
import StatusOverviewClient, {
  OrderStatusCardDescriptor,
} from "./StatusOverviewClient";

interface StatusOverviewProps {
  dateRange?: DateRangeParams;
}

export default async function StatusOverview({ dateRange }: StatusOverviewProps) {
  const statusStats = await getOrderStatusStats(dateRange);
  const totalOrders = statusStats.total || 1;

  const statuses: OrderStatusCardDescriptor[] = [
    {
      id: "pending",
      icon: "pending",
      title: "Pendiente",
      count: statusStats.pending,
      percentage: Math.round((statusStats.pending / totalOrders) * 100),
      gradient: "from-amber-500/25 via-amber-500/10 to-transparent",
      border: "border-amber-500/20",
      iconTint: "bg-amber-500/15 text-amber-100",
      badgeBg: "bg-amber-500/20",
      badgeText: "text-amber-50",
      progress: "bg-amber-300",
    },
    {
      id: "processing",
      icon: "processing",
      title: "Procesando",
      count: statusStats.processing,
      percentage: Math.round((statusStats.processing / totalOrders) * 100),
      gradient: "from-sky-500/25 via-blue-500/10 to-transparent",
      border: "border-sky-500/20",
      iconTint: "bg-sky-500/15 text-sky-100",
      badgeBg: "bg-sky-500/20",
      badgeText: "text-sky-50",
      progress: "bg-sky-300",
    },
    {
      id: "shipped",
      icon: "shipped",
      title: "En ruta",
      count: statusStats.shipped,
      percentage: Math.round((statusStats.shipped / totalOrders) * 100),
      gradient: "from-violet-500/25 via-purple-500/10 to-transparent",
      border: "border-violet-500/20",
      iconTint: "bg-violet-500/15 text-violet-100",
      badgeBg: "bg-violet-500/20",
      badgeText: "text-violet-50",
      progress: "bg-violet-300",
    },
    {
      id: "delivered",
      icon: "delivered",
      title: "Entregado",
      count: statusStats.delivered,
      percentage: Math.round((statusStats.delivered / totalOrders) * 100),
      gradient: "from-emerald-500/25 via-teal-500/10 to-transparent",
      border: "border-emerald-500/20",
      iconTint: "bg-emerald-500/15 text-emerald-100",
      badgeBg: "bg-emerald-500/20",
      badgeText: "text-emerald-50",
      progress: "bg-emerald-300",
    },
  ];

  return (
    <StatusOverviewClient
      title="Estado de pedidos"
      subtitle="Flujo logístico"
      description={`Seguimiento en tiempo real de ${totalOrders} pedidos activos`}
      ctaLabel="Ver todos los pedidos"
      ctaHref="/dashboard/orders"
      statuses={statuses}
    />
  );
}
