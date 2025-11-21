import Link from "next/link";
import { ZoomIn, PenSquare, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Typography from "@/app/(admin)/components/ui/typography";

import { SheetTooltip } from "@/app/(admin)/components/shared/table/TableActionTooltip";
import { TableActionAlertDialog } from "@/app/(admin)/components/shared/table/TableActionAlertDialog";
import CustomerFormSheet from "../form/CustomerFormSheet";
import { Customer } from "@/app/(admin)/services/customers/types";
import { SkeletonColumn } from "@/app/(admin)/types/skeleton";
import { TooltipWrapper } from "@/app/(admin)/components/shared/table/TableActionTooltip";

import { editCustomer } from "@/app/(admin)/actions/customers/editCustomer";
import { deleteCustomer } from "@/app/(admin)/actions/customers/deleteCustomer";
import { HasPermission } from "@/app/(admin)/hooks/use-authorization";

const handleDemoDelete = () => {
  toast.error("Sorry, this feature is not allowed in demo mode", {
    position: "top-center",
  });
};

export const getColumns = ({
  hasPermission,
}: {
  hasPermission: HasPermission;
}) => {
  const columns: ColumnDef<Customer>[] = [
    {
      header: "id",
      cell: ({ row }) => (
        <Typography className="uppercase">
          {row.id.slice(-4)}
        </Typography>
      ),
    },
    {
      header: "name",
      cell: ({ row }) => row.original.name,
    },
    {
      header: "email",
      cell: ({ row }) => (
        <Typography className="block max-w-52 xl:max-w-60 truncate">
          {row.original.email}
        </Typography>
      ),
    },
    {
      header: () => <span className="block text-center">phone</span>,
      id: "phone",
      cell: ({ row }) => (
        <Typography className="block text-center">
          {row.original.phone_number || "—"}
        </Typography>
      ),
    },
    {
      header: () => <span className="block text-center">actions</span>,
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-1">
            <TooltipWrapper content="View Customer Orders">
              <Button
                size="icon"
                asChild
                variant="ghost"
                className="text-foreground"
              >
                <Link href={`/customer-orders/${row.id}`}>
                  <ZoomIn className="size-5" />
                </Link>
              </Button>
            </TooltipWrapper>

            {hasPermission("customers", "canEdit") && (
              <CustomerFormSheet
                key={row.id}
                title="Update Customers"
                description="Update necessary customer information here"
                submitButtonText="Update Customer"
                actionVerb="updated"
                initialData={{
                  name: row.original.name,
                  email: row.original.email,
                  phone: row.original.phone_number ?? "",
                }}
                action={(formData) => editCustomer(row.id, formData)}
              >
                <SheetTooltip content="Edit Customer">
                  <PenSquare className="size-5" />
                </SheetTooltip>
              </CustomerFormSheet>
            )}

            {hasPermission("customers", "canDelete") && (
              <TooltipWrapper content="Delete Customer">
                <Button
                  onClick={handleDemoDelete}
                  variant="ghost"
                  size="icon"
                  className="text-foreground"
                >
                  <Trash2 className="size-5" />
                </Button>
              </TooltipWrapper>

              // <TableActionAlertDialog
              //   title={`Delete ${row.name}?`}
              //   description="This action cannot be undone. This will permanently delete this customer and associated data from the database."
              //   tooltipContent="Delete Customer"
              //   actionButtonText="Delete Customer"
              //   toastSuccessMessage={`Customer "${row.name}" deleted successfully!`}
              //   queryKey="customers"
              //   action={() => deleteCustomer(row.id)}
              // >
              //   <Trash2 className="size-5" />
              // </TableActionAlertDialog>
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
    header: "id",
    cell: <Skeleton className="w-10 h-8" />,
  },
  {
    header: "joining date",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "name",
    cell: <Skeleton className="w-24 h-8" />,
  },
  {
    header: "email",
    cell: <Skeleton className="w-32 h-8" />,
  },
  {
    header: "phone",
    cell: <Skeleton className="w-20 h-10" />,
  },
  {
    header: "actions",
    cell: <Skeleton className="w-24 h-8" />,
  },
];
