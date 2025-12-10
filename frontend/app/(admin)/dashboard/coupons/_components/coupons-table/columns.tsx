import { PenSquare, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/date-utils";

import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import Typography from "@/app/(admin)/components/ui/typography";
import { Badge } from "@/components/ui/badge";

import { TableSwitch } from "@/app/(admin)/components/shared/table/TableSwitch";
import { TableFeaturedButton } from "@/app/(admin)/components/shared/table/TableFeaturedButton";
import { SheetTooltip } from "@/app/(admin)/components/shared/table/TableActionTooltip";
import { TableActionAlertDialog } from "@/app/(admin)/components/shared/table/TableActionAlertDialog";
import CouponFormSheet from "../form/CouponFormSheet";
import { CouponBadgeVariants } from "@/app/(admin)/constants/badge";
import { SkeletonColumn } from "@/app/(admin)/types/skeleton";
import { Coupon, CouponStatus } from "@/app/(admin)/services/coupons/types";
import SortableHeader from "./SortableHeader";

import { editCoupon } from "@/app/(admin)/actions/coupons/editCoupon";
import { deleteCoupon } from "@/app/(admin)/actions/coupons/deleteCoupon";
import { toggleCouponActiveStatus } from "@/app/(admin)/actions/coupons/toggleCouponStatus";
import { toggleCouponFeatured } from "@/app/(admin)/actions/coupons/toggleCouponFeatured";
import { HasPermission } from "@/app/(admin)/hooks/use-authorization";

export const getColumns = ({
  hasPermission,
}: {
  hasPermission: HasPermission;
}) => {
  const columns: ColumnDef<Coupon>[] = [
    {
      accessorKey: "name",
      header: () => <SortableHeader column="name" label="Nombre" />,
      cell: ({ row }) => (
        <Typography className="capitalize block truncate font-semibold">
          {row.original.name}
        </Typography>
      ),
    },
    {
      accessorKey: "code",
      header: () => <SortableHeader column="code" label="Código" />,
      cell: ({ row }) => (
        <Typography className="uppercase">{row.original.code}</Typography>
      ),
    },
    {
      accessorKey: "discount_value",
      header: () => <SortableHeader column="discount_value" label="Descuento" />,
      cell: ({ row }) => {
        const discountType = row.original.discount_type;
        const value = Number(row.original.discount_value);

        if (discountType === "fixed") {
          return <Typography className="font-medium">${value.toLocaleString()}</Typography>;
        }

        return <Typography className="font-medium">{value}%</Typography>;
      },
    },
    {
      accessorKey: "usage_count",
      header: () => <SortableHeader column="usage_count" label="Uso" />,
      cell: ({ row }) => {
        const used = row.original.usage_count || 0;
        const limit = row.original.usage_limit;
        return <Typography>{limit ? `${used}/${limit}` : `${used}/∞`}</Typography>;
      },
    },
    {
      accessorKey: "created_at",
      header: () => <SortableHeader column="created_at" label="Fecha de Creación" />,
      cell: ({ row }) => <Typography>{formatDate.medium(row.original.created_at)}</Typography>,
    },
    {
      accessorKey: "expires_at",
      header: () => <SortableHeader column="expires_at" label="Expira" />,
      cell: ({ row }) => <Typography>{formatDate.medium(row.original.expires_at)}</Typography>,
    },
    {
      accessorKey: "featured",
      header: "Destacado",
      cell: ({ row }) => {
        return (
          <Badge
            variant={row.original.featured ? "success" : "outline"}
            className="shrink-0 text-xs capitalize"
          >
            {row.original.featured ? "Sí" : "No"}
          </Badge>
        );
      },
    },
    {
      header: "Estado",
      cell: ({ row }) => {
        const currentTime = new Date();
        const expiresAt = new Date(row.original.expires_at);

        const status: CouponStatus =
          currentTime > expiresAt ? "expired" : "active";

        return (
          <Badge
            variant={CouponBadgeVariants[status]}
            className="shrink-0 text-xs capitalize"
          >
            {status === "active" ? "Disponible" : "Expirado"}
          </Badge>
        );
      },
    },
  ];



  if (
    hasPermission("coupons", "canDelete") ||
    hasPermission("coupons", "canEdit")
  ) {
    columns.splice(0, 0, {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    });

    columns.splice(9, 0, {
      header: "Acciones",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            {hasPermission("coupons", "canTogglePublished") && (

              <div className="pl-5">
                <TableSwitch
                  checked={row.original.active}
                  toastSuccessMessage="Coupon status updated successfully."
                  queryKey="coupons"
                  onCheckedChange={() =>
                    toggleCouponActiveStatus(
                      row.original.id,
                      row.original.active
                    )
                  }
                />
              </div>

            )}

            {hasPermission("coupons", "canEdit") && (
              <TableFeaturedButton
                couponId={row.original.id}
                initialFeatured={row.original.featured}
                queryKey="coupons"
                onToggle={toggleCouponFeatured}
              />
            )}

            {hasPermission("coupons", "canEdit") && (
              <CouponFormSheet
                key={row.original.id}
                title="Update Coupon"
                description="Update necessary coupon information here"
                submitButtonText="Update Coupon"
                actionVerb="updated"
                initialData={{
                  name: row.original.name,
                  code: row.original.code,
                  expiresAt: new Date(row.original.expires_at),
                  isPercentageDiscount:
                    row.original.discount_type === "percentage",
                  discountValue: Number(row.original.discount_value),
                  minPurchaseAmount: row.original.min_purchase_amount
                    ? Number(row.original.min_purchase_amount)
                    : undefined,
                  usageLimit: row.original.usage_limit || undefined,
                }}
                action={(formData) => editCoupon(row.original.id, formData)}
              >
                <SheetTooltip content="Edit Coupon">
                  <PenSquare className="size-5" />
                </SheetTooltip>
              </CouponFormSheet>
            )}

            {hasPermission("coupons", "canDelete") && (
              <TableActionAlertDialog
                title={`Delete ${row.original.name}?`}
                description="This action cannot be undone. This will permanently delete the coupon and its associated data from the database."
                tooltipContent="Delete Coupon"
                actionButtonText="Delete Coupon"
                toastSuccessMessage={`Coupon "${row.original.name}" deleted successfully!`}
                queryKey="coupons"
                action={() => deleteCoupon(row.original.id)}
              >
                <Trash2 className="size-5" />
              </TableActionAlertDialog>
            )}
          </div>
        );
      },
    });
  }

  return columns;
};

export const skeletonColumns: SkeletonColumn[] = [
  {
    header: <Checkbox disabled checked={false} />,
    cell: <Skeleton className="size-4 rounded-sm" />,
  },
  {
    header: "Nombre",
    cell: <Skeleton className="w-28 h-8" />,
  },
  {
    header: "Código",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "Descuento",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "Activo",
    cell: <Skeleton className="w-16 h-10" />,
  },
  {
    header: "Uso",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "Fecha de Creación",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "Expira",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "Estado",
    cell: <Skeleton className="w-20 h-10" />,
  },
  {
    header: "Acciones",
    cell: <Skeleton className="w-20 h-8" />,
  },
];
