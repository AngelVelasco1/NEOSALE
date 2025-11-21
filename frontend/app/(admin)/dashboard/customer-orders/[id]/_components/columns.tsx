import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/date-utils";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { SelectItem } from "@/components/ui/select";
import { formatAmount } from "@/app/(admin)/helpers/formatAmount";

import Typography from "@/app/(admin)/components/ui/typography";
import { TableSelect } from "@/app/(admin)/components/shared/table/TableSelect";
import { OrderBadgeVariants } from "@/app/(admin)/constants/badge";
import { OrderStatus } from "@/app/(admin)/services/orders/types";
import { CustomerOrder } from "@/app/(admin)/services/customers/types";

import { changeOrderStatus } from "@/app/(admin)/actions/orders/changeOrderStatus";
import { HasPermission } from "@/app/(admin)/hooks/use-authorization";

export const getColumns = ({
  hasPermission,
}: {
  hasPermission: HasPermission;
}) => {
  const columns: ColumnDef<CustomerOrder>[] = [
    {
      header: "invoice no",
      cell: ({ row }) => row.original.invoice_no,
    },
    {
      header: "order time",
      cell: ({ row }) =>
        `${formatDate.medium(row.original.created_at)} ${formatDate.time(row.original.created_at)}`,
    },
    {
      header: "shipping address",
      cell: ({ row }) => (
        <span className="block max-w-72 truncate">
          {row.original.customers?.address}
        </span>
      ),
    },
    {
      header: "phone",
      cell: ({ row }) => (
        <Typography className={cn(!row.original.customers.phone && "pl-6")}>
          {row.original.customers.phone || "—"}
        </Typography>
      ),
    },
    {
      header: "method",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.payment_method}</span>
      ),
    },
    {
      header: "amount",
      cell: ({ row }) => formatAmount(row.original.total_amount),
    },
    {
      header: "status",
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <Badge
            variant={OrderBadgeVariants[status]}
            className="flex-shrink-0 text-xs capitalize"
          >
            {status}
          </Badge>
        );
      },
    },
  ];

  if (hasPermission("orders", "canChangeStatus")) {
    columns.push({
      header: "action",
      cell: ({ row }) => {
        return (
          <TableSelect
            value={row.original.status}
            toastSuccessMessage="Order status updated successfully."
            queryKey="orders"
            onValueChange={(value) =>
              changeOrderStatus(row.original.id, value as OrderStatus)
            }
          >
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </TableSelect>
        );
      },
    });
  }

  return columns;
};
