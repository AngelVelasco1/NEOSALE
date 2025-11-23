import { PenSquare, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { Badge } from "@/app/(admin)/components/ui/badge";
import { Button } from "@/app/(admin)/components/ui/button";
import Typography from "@/app/(admin)/components/ui/typography";
import { Skeleton } from "@/app/(admin)/components/ui/skeleton";

import { TableSwitch } from "@/app/(admin)/components/shared/table/TableSwitch";
import { ImagePlaceholder } from "@/app/(admin)/components/shared/ImagePlaceholder";
import { TooltipWrapper } from "@/app/(admin)/components/shared/table/TableActionTooltip";
import { SheetTooltip } from "@/app/(admin)/components/shared/table/TableActionTooltip";
import { TableActionAlertDialog } from "@/app/(admin)/components/shared/table/TableActionAlertDialog";
import StaffFormSheet from "../form/StaffFormSheet";
import { StaffBadgeVariants } from "@/app/(admin)/constants/badge";
import { SkeletonColumn } from "@/app/(admin)/types/skeleton";
import { Staff } from "@/app/(admin)/services/staff/types";
import { formatDate } from "@/lib/date-utils";

import { editStaff } from "@/app/(admin)/actions/staff/editStaff";
import { deleteStaff } from "@/app/(admin)/actions/staff/deleteStaff";
import { toggleStaffPublishedStatus } from "@/app/(admin)/actions/staff/toggleStaffStatus";
import { HasPermission, IsSelf } from "@/app/(admin)/hooks/use-authorization";

const handleDemoDelete = () => {
  toast.error("Sorry, this feature is not allowed in demo mode", {
    position: "top-center",
  });
};

export const getColumns = ({
  hasPermission,
  isSelf,
}: {
  hasPermission: HasPermission;
  isSelf: IsSelf;
}) => {
  const columns: ColumnDef<Staff>[] = [
    {
      header: "Nombre",
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
          <ImagePlaceholder
            src={row.original.image || "/imgs/person.png"}
            alt={row.original.name}
            width={32}
            height={32}
            className="size-8 rounded-full"
          />

          <Typography className="capitalize block truncate">
            {row.original.name}
          </Typography>
        </div>
      ),
    },
    {
      header: "Email",
      cell: ({ row }) => (
        <Typography className="block max-w-52 truncate">
          {row.original.email}
        </Typography>
      ),
    },
    {
      header: () => <span className="block text-center">Teléfono</span>,
      id: "phone",
      cell: ({ row }) => (
        <Typography className="block text-center">
          {row.original.phone_number || "—"}
        </Typography>
      ),
    },
    {
      header: "Fecha de Ingreso",
      cell: ({ row }) => formatDate.medium(row.original.created_at),
    },
    {
      header: "Rol",
      cell: ({ row }) => (
        <Typography className="capitalize font-medium">
          {row.original.role}
        </Typography>
      ),
    },
    {
      header: "Estado",
      cell: ({ row }) => {
        const status = row.original.active ? "active" : "inactive";

        return (
          <Badge
            variant={StaffBadgeVariants[status]}
            className="shrink-0 text-xs capitalize"
          >
            {status}
          </Badge>
        );
      },
    },
  ];




  columns.splice(7, 0, {
    header: () => <span className="block text-center">Acciones</span>,
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center gap-1">
          {isSelf(row.id) && (
            <StaffFormSheet
              key={row.original.id}
              title="Update Staff"
              description="Update necessary staff information here"
              submitButtonText="Update Staff"
              actionVerb="updated"
              initialData={{
                name: row.original.name,
                phone: row.original.phone_number ?? "",
                image: row.original.image ?? undefined,
              }}
              action={(formData) => editStaff(row.original.id, formData)}
              previewImage={row.original.image ?? undefined}
              staffEmail={row.original.email}
            >
              <SheetTooltip
                buttonClassName={
                  !hasPermission("staff", "canEdit") ? "ml-5" : undefined
                }
                content="Edit Profile"
              >
                <PenSquare className="size-5" />
              </SheetTooltip>
            </StaffFormSheet>
          )}

          {hasPermission("staff", "canDelete") && (
            <TooltipWrapper content="Delete Staff">
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
            //   title={`Delete ${row.original.name}?`}
            //   description="This action cannot be undone. This will permanently delete the staff and associated data from the database."
            //   tooltipContent="Delete Staff"
            //   actionButtonText="Delete Staff"
            //   toastSuccessMessage={`Staff "${row.original.name}" deleted successfully!`}
            //   queryKey="staff"
            //   action={() => deleteStaff(row.original.id)}
            // >
            //   <Trash2 className="size-5" />
            // </TableActionAlertDialog>
          )}
        </div>
      );
    },
  });

  return columns;
};

export const skeletonColumns: SkeletonColumn[] = [
  {
    header: "Nombre",
    cell: (
      <div className="flex gap-2 items-center">
        <Skeleton className="size-8 rounded-full" />

        <Skeleton className="w-28 h-8" />
      </div>
    ),
  },
  {
    header: "Email",
    cell: <Skeleton className="w-32 h-8" />,
  },
  {
    header: "Teléfono",
    cell: <Skeleton className="w-20 h-10" />,
  },
  {
    header: "Fecha de Ingreso",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "Rol",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "Estado",
    cell: <Skeleton className="w-24 h-8" />,
  },
  {
    header: "Publicado",
    cell: <Skeleton className="w-16 h-10" />,
  },
  {
    header: "Acciones",
    cell: <Skeleton className="w-20 h-8" />,
  },
];
