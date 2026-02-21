import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Eye } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";

import Typography from "@/app/(admin)/components/ui/typography";
import { TableSelect } from "@/app/(admin)/components/shared/table/TableSelect";
import { OrderBadgeVariants } from "@/app/(admin)/constants/badge";
import { OrderStatus } from "@/app/(admin)/services/orders/types";
import { CustomerOrder } from "@/app/(admin)/services/customers/types";

import { changeOrderStatus } from "@/app/(admin)/actions/orders/changeOrderStatus";
import { HasPermission } from "@/app/(admin)/hooks/use-authorization";
import { TooltipWrapper } from "@/app/(admin)/components/shared/table/TableActionTooltip";

// Helper para formatear fecha
const formatDate = (date: Date | string | null) => {
  if (!date) return "—";
  const d = new Date(date);
  return d.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (date: Date | string | null) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Helper para formatear monto
const formatAmount = (amount: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Mapeo de estados
const statusMap: Record<string, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  processing: "Procesando",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

export const getColumns = ({
  hasPermission,
}: {
  hasPermission: HasPermission;
}) => {
  const columns: ColumnDef<CustomerOrder>[] = [
    {
      id: "id",
      header: "ID",
      cell: ({ row }) => (
        <Typography className="font-mono font-semibold">
          #{row.original.id}
        </Typography>
      ),
    },
    {
      id: "date",
      header: "Fecha y Hora",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{formatDate(row.original.created_at)}</span>
          <span className="text-xs text-slate-400">{formatTime(row.original.created_at)}</span>
        </div>
      ),
    },
    {
      id: "shipping_address",
      header: "Dirección de Envío",
      cell: ({ row }) => (
        <div className="max-w-xs">
          <Typography className="truncate font-medium">
            {row.original.shipping_address.address}
          </Typography>
          <Typography className="text-xs text-slate-400">
            {row.original.shipping_address.city}, {row.original.shipping_address.department}
          </Typography>
        </div>
      ),
    },
    {
      id: "payment_method",
      header: "Método de Pago",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <Typography className="capitalize font-medium">
            {row.original.payment_method}
          </Typography>
          <Typography className="text-xs text-slate-400 capitalize">
            {row.original.payment_status}
          </Typography>
        </div>
      ),
    },
    {
      id: "total",
      header: () => <div className="text-right">Total</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <Typography className="font-bold">
            {formatAmount(row.original.total)}
          </Typography>
          {row.original.discount > 0 && (
            <Typography className="text-xs text-green-400">
              -{formatAmount(row.original.discount)}
            </Typography>
          )}
        </div>
      ),
    },
    {
      id: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.original.status as OrderStatus;

        return (
          <Badge
            variant={OrderBadgeVariants[status]}
            className="shrink-0 text-xs capitalize"
          >
            {statusMap[status] || status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Acciones</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1">
          <TooltipWrapper content="Ver detalles de la orden">
            <Button
              size="icon"
              variant="ghost"
              asChild
              className="text-foreground"
            >
              <Link href={`/dashboard/orders/${row.original.id}`}>
                <Eye className="size-5" />
              </Link>
            </Button>
          </TooltipWrapper>
        </div>
      ),
    },
  ];

  if (hasPermission("orders", "canChangeStatus")) {
    columns.push({
      id: "change_status",
      header: "Cambiar Estado",
      cell: ({ row }) => {
        return (
          <TableSelect
            value={row.original.status}
            toastSuccessMessage="Estado de la orden actualizado."
            queryKey="customer-orders"
            onValueChange={(value) =>
              changeOrderStatus(row.original.id, value as OrderStatus)
            }
          >
            <SelectItem value="pending">Pendiente</SelectItem>
            <SelectItem value="paid">Pagado</SelectItem>
            <SelectItem value="processing">Procesando</SelectItem>
            <SelectItem value="shipped">Enviado</SelectItem>
            <SelectItem value="delivered">Entregado</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
          </TableSelect>
        );
      },
    });
  }

  return columns;
};

