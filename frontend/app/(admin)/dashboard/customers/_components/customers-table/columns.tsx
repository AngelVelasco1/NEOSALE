import Link from "next/link";
import { ZoomIn, Trash2, ShoppingBag, DollarSign, Calendar } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Typography from "@/app/(admin)/components/ui/typography";

import { Customer } from "@/app/(admin)/services/customers/types";
import { SkeletonColumn } from "@/app/(admin)/types/skeleton";
import { TooltipWrapper } from "@/app/(admin)/components/shared/table/TableActionTooltip";
import { SortableHeader } from "./SortableHeader";

import { deleteCustomer } from "@/app/(admin)/actions/customers/deleteCustomer";
import { HasPermission } from "@/app/(admin)/hooks/use-authorization";

const handleDemoDelete = () => {
  toast.error("Sorry, this feature is not allowed in demo mode", {
    position: "top-center",
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

export const getColumns = ({
  hasPermission,
}: {
  hasPermission: HasPermission;
}) => {
  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: () => <SortableHeader label="Cliente" sortKey="name" />,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <Typography className="font-medium">{row.original.name}</Typography>
          <Typography className="text-xs text-slate-400 truncate max-w-48">
            {row.original.email}
          </Typography>
        </div>
      ),
    },
    {
      id: "phone",
      header: () => <span className="block text-center">Teléfono</span>,
      cell: ({ row }) => (
        <Typography className="block text-center">
          {row.original.phoneNumber || "—"}
        </Typography>
      ),
    },
    {
      accessorKey: "total_orders",
      header: () => <div className="flex items-center justify-center gap-1"><SortableHeader label="Órdenes" sortKey="total_orders" /><ShoppingBag className="h-4 w-4" /></div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge variant={row.original.total_orders > 0 ? "default" : "secondary"} className="font-semibold">
            {row.original.total_orders}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "total_spent",
      header: () => <div className="flex items-center justify-end gap-1"><DollarSign className="h-4 w-4" /><SortableHeader label="Total Gastado" sortKey="total_spent" /></div>,
      cell: ({ row }) => (
        <div className="text-right">
          <Typography className="font-bold text-green-400">
            {formatAmount(row.original.total_spent)}
          </Typography>
        </div>
      ),
    },
    {
      accessorKey: "average_spent",
      header: () => <div className="flex items-center justify-end gap-1"><DollarSign className="h-4 w-4" /><SortableHeader label="Promedio" sortKey="average_spent" /></div>,
      cell: ({ row }) => (
        <div className="text-right">
          <Typography className="font-bold text-green-400">
            {formatAmount(row.original.average_spent)}
          </Typography>
        </div>
      ),
    },
    {
      accessorKey: "last_order_date",
      header: () => <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /><SortableHeader label="Última Orden" sortKey="last_order_date" /></div>,
      cell: ({ row }) => (
        <Typography className="text-sm">
          {formatDate(row.original.last_order_date)}
        </Typography>
      ),
    },
    {
      id: "status",
      header: "Estado",
      cell: ({ row }) => (
        <Badge variant={row.original.active ? "success" : "destructive"}>
          {row.original.active ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      header: () => <span className="block text-center">Acciones</span>,
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-1">
            <TooltipWrapper content="Ver órdenes del cliente">
              <Button
                size="icon"
                asChild
                variant="ghost"
                className="text-foreground hover:text-blue-600 hover:bg-blue-950"
              >
                <Link href={`/dashboard/customer-orders/${row.original.id}`}>
                  <ZoomIn className="size-5" />
                </Link>
              </Button>
            </TooltipWrapper>

            {hasPermission("customers", "canDelete") && (
              <TooltipWrapper content="Eliminar Cliente">
                <Button
                  onClick={handleDemoDelete}
                  variant="ghost"
                  size="icon"
                  className="text-foreground hover:text-red-600 hover:bg-red-950"
                >
                  <Trash2 className="size-5" />
                </Button>
              </TooltipWrapper>
            )}
          </div>
        );
      },
    },
  ];

  return columns;
};

export const skeletonColumns: SkeletonColumn[] = [
  {
    header: "ID",
    cell: <Skeleton className="w-12 h-8" />,
  },
  {
    header: "Cliente",
    cell: <Skeleton className="w-32 h-10" />,
  },
  {
    header: "Teléfono",
    cell: <Skeleton className="w-24 h-8" />,
  },
  {
    header: "Órdenes",
    cell: <Skeleton className="w-16 h-6" />,
  },
  {
    header: "Total Gastado",
    cell: <Skeleton className="w-24 h-8" />,
  },
  {
    header: "Última Orden",
    cell: <Skeleton className="w-24 h-8" />,
  },
  {
    header: "Estado",
    cell: <Skeleton className="w-16 h-6" />,
  },
  {
    header: "Acciones",
    cell: <Skeleton className="w-20 h-8" />,
  },
];
