import { PenSquare, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "../../../../components/ui/checkbox";
import { Skeleton } from "../../../../components/ui/skeleton";
import Typography from "../../../../components/ui/typography";

import { TableSwitch } from "../../../../components/shared/table/TableSwitch";
import { SheetTooltip } from "../../../../components/shared/table/TableActionTooltip";
import { TableActionAlertDialog } from "../../../../components/shared/table/TableActionAlertDialog";
import { SortableHeader } from "./SortableHeader";
import CategoryFormSheet from "../form/CategoryFormSheet";
import { Category } from "../../../../services/categories/types";
import { SkeletonColumn } from "../../../../types/skeleton";

import { editCategory } from "../../../../actions/categories/editCategory";
import { deleteCategory } from "../../../../actions/categories/deleteCategory";
import { toggleCategoryPublishedStatus } from "../../../../actions/categories/toggleCategoryStatus";
import { HasPermission } from "../../../../hooks/use-authorization";

export const getColumns = ({
  hasPermission,
}: {
  hasPermission: HasPermission;
}) => {
  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: () => <SortableHeader label="Nombre" sortKey="name" />,
      cell: ({ row }) => (
        <Typography
          className={`font-semibold ${!row.original.active ? 'text-muted-foreground line-through' : ''
            }`}
        >
          {row.original.name}
        </Typography>
      ),
    },
    {
      accessorKey: "description",
      header: () => <SortableHeader label="Descripción" sortKey="description" />,
      cell: ({ row }) => (
        <Typography
          className={`block max-w-md xl:max-w-lg truncate ${!row.original.active ? 'text-muted-foreground line-through' : ''
            }`}
        >
          {row.original.description}
        </Typography>
      ),
    },
  ];

  if (hasPermission("categories", "canTogglePublished")) {
    columns.splice(3, 0, {
      header: "Publicado",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <TableSwitch
            checked={row.original.active}
            toastSuccessMessage="Category status updated successfully."
            queryKey="categories"
            onCheckedChange={() =>
              toggleCategoryPublishedStatus(
                row.original.id,
                row.original.active
              )
            }
          />
          <span className={`text-xs font-medium ${row.original.active
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400'
            }`}>
            {row.original.active ? 'Activa' : 'Inactiva'}
          </span>
        </div>
      ),
    });
  }

  if (
    hasPermission("categories", "canDelete") ||
    hasPermission("categories", "canEdit")
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

    columns.splice(4, 0, {
      header: "Acciones",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            {hasPermission("categories", "canEdit") && (
              <CategoryFormSheet
                key={row.original.id}
                title="Update Category"
                submitButtonText="Update Category"
                actionVerb="updated"
                initialData={{
                  name: row.original.name,
                  description: row.original.description ?? "",
                }}
                action={(formData) => editCategory(row.original.id, formData)}
              >
                <SheetTooltip content="Edit Category">
                  <PenSquare className="size-5" />
                </SheetTooltip>
              </CategoryFormSheet>
            )}

            {hasPermission("categories", "canDelete") && (
              <TableActionAlertDialog
                title={`Eliminar ${row.original.name}?`}
                description="Esta acción no se puede deshacer. La categoría y sus datos asociados serán eliminados permanentemente."
                tooltipContent="Eliminar Categoría"
                actionButtonText="Eliminar Categoría"
                toastSuccessMessage={`Categoría "${row.original.name}" eliminada correctamente!`}
                queryKey="categories"
                action={() => deleteCategory(row.original.id)}
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
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "Descripción",
    cell: <Skeleton className="w-lg h-8" />,
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
