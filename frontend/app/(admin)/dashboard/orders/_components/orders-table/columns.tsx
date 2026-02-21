import Link from "next/link";
import { ZoomIn } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/date-utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SelectItem } from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../../components/ui/tooltip";
import { formatAmount } from "../../../../helpers/formatAmount";

import { TableSelect } from "../../../../components/shared/table/TableSelect";
import { OrderBadgeVariants } from "../../../../constants/badge";
import { Order, OrderStatus } from "../../../../services/orders/types";
import { SkeletonColumn } from "../../../../types/skeleton";
import { SortableHeader } from "./SortableHeader";
import { changeOrderStatus } from "../../../../actions/orders/changeOrderStatus";
import { PrintInvoiceButton } from "./PrintInvoiceButton";
import { HasPermission } from "../../../../hooks/use-authorization";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { translateOrderStatus } from "@/app/(admin)/lib/translations";
import { getOrderStatuses } from "../../../../services/orders/getOrderStatuses";

const removeLetters = (word: string): string => {
  return word.replace(/[^\d]/g, '');
};

export const getColumns = ({
  hasPermission,
}: {
  hasPermission: HasPermission;
}) => {
  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: () => <SortableHeader label="N.º Orden" sortKey="id" />,
      cell: ({ row }) => { return removeLetters(row.original.payment_id.toString()) },
    },
    {
      accessorKey: "created_at",
      header: () => <SortableHeader label="Fecha y Hora" sortKey="created_at" />,
      cell: ({ row }) =>
        `${formatDate.medium(row.original.created_at)} ${formatDate.time(row.original.created_at)}`,
    },
    {
      id: "customer",
      header: "Cliente",
      cell: ({ row }) => (
        <span className="block max-w-52 truncate">
          {row.original.User?.name || "Cliente sin nombre"}
        </span>
      ),
    },
    {
      id: "method",
      header: "Método",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.payment?.payment_method || "N/A"}</span>
      ),
    },
    {
      accessorKey: "total",
      header: () => <SortableHeader label="Monto" sortKey="total" />,
      cell: ({ row }) => formatAmount(row.original.total),
    },
    {
      accessorKey: "status",
      header: () => <SortableHeader label="Estado" sortKey="status" />,
      cell: ({ row }) => {
        const status = row.original.status;
        const translatedStatus = translateOrderStatus(status);

        return (
          <Badge
            variant={OrderBadgeVariants[status]}
            className="shrink-0 text-xs capitalize"
          >
            {translatedStatus}
          </Badge>
        );
      },
    },
    {
      header: "Factura",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            {hasPermission("orders", "canPrint") && (
              <PrintInvoiceButton orderId={row.original.id.toString()} />
            )}
            <TooltipProvider>  <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground"
                  asChild
                >
                  <Link href={`/dashboard/orders/${row.original.id}`}>
                    <ZoomIn className="size-5" />
                  </Link>
                </Button>
              </TooltipTrigger>

              <TooltipContent>
                <p>Ver Factura</p>
              </TooltipContent>
            </Tooltip></TooltipProvider>

          </div>
        );
      },
    },
  ];

  // Obtener los estados disponibles del servicio
  const orderStatuses = getOrderStatuses();

  if (hasPermission("orders", "canChangeStatus")) {
    columns.splice(6, 0, {
      header: "Acción",
      cell: ({ row }) => {
        return (
          <TableSelect
            value={row.original.status}
            toastSuccessMessage="Estado de la orden actualizado exitosamente."
            queryKey="orders"
            onValueChange={(value) =>
              changeOrderStatus(row.original.id, value as OrderStatus)
            }
          >
            {orderStatuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </TableSelect>
        );
      },
    });
  }

  return columns;
};

export const skeletonColumns: SkeletonColumn[] = [
  {
    header: "N.º Factura",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "Fecha y Hora",
    cell: <Skeleton className="w-32 h-8" />,
  },
  {
    header: "Cliente",
    cell: <Skeleton className="w-32 h-8" />,
  },
  {
    header: "Método",
    cell: <Skeleton className="w-14 h-8" />,
  },
  {
    header: "Monto",
    cell: <Skeleton className="w-16 h-8" />,
  },
  {
    header: "Estado",
    cell: <Skeleton className="w-16 h-8" />,
  },
  {
    header: "Acción",
    cell: <Skeleton className="w-24 h-10" />,
  },
  {
    header: "Factura",
    cell: <Skeleton className="w-20 h-8" />,
  },
];
