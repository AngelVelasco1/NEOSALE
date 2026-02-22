import Link from "next/link";
import { ZoomIn, PenSquare, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Badge } from "@/app/(admin)/components/ui/badge";
import { Button } from "@/app/(admin)/components/ui/button";
import { Checkbox } from "@/app/(admin)/components/ui/checkbox";
import Typography from "@/app/(admin)/components/ui/typography";
import { Skeleton } from "@/app/(admin)/components/ui/skeleton";
import { formatAmount } from "@/app/(admin)/helpers/formatAmount";

import { ImagePlaceholder } from "@/app/(admin)/components/shared/ImagePlaceholder";
import { SheetTooltip } from "@/app/(admin)/components/shared/table/TableActionTooltip";
import { TableActionAlertDialog } from "@/app/(admin)/components/shared/table/TableActionAlertDialog";
import { SortableHeader } from "./SortableHeader";
import ProductFormSheet from "../form/ProductFormSheet";
import { Product } from "@/app/(admin)/services/products/types";
import { SkeletonColumn } from "@/app/(admin)/types/skeleton";

import { editProduct } from "@/app/(admin)/actions/products/editProduct";
import { deleteProduct } from "@/app/(admin)/actions/products/deleteProduct";
import { HasPermission } from "@/app/(admin)/hooks/use-authorization";

export const getColumns = ({
  hasPermission,
}: {
  hasPermission: HasPermission;
}) => {
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: () => <SortableHeader label="Nombre" sortKey="name" />,
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
          <ImagePlaceholder
            src={row.original.image_url || row.original.images?.[0]?.image_url || ''}
            alt={row.original.name}
            width={32}
            height={32}
            className="h-9 w-9 rounded-xl"
          />

          <Typography className="capitalize block truncate">
            {row.original.name}
          </Typography>
        </div>
      ),
    },
    {
      header: "Categoría",
      cell: ({ row }) => (
        <Typography
          className={cn(
            "block max-w-52 truncate",
            !row.original.categories?.name && "pl-8"
          )}
        >
          {row.original.categories?.name || "—"}
        </Typography>
      ),
    },
    {
      accessorKey: "price",
      header: () => <SortableHeader label="Precio" sortKey="price" />,
      cell: ({ row }) => {
        return formatAmount(row.original.price);
      },
    },
    {
      header: "Descripción",
      cell: ({ row }) => {
        const description = row.original.description?.trim();

        return (
          <span
            className="block max-w-32 text-wrap  text-sm text-slate-300"
            title={description || "Sin descripción"}
          >
            {description || "—"}
          </span>
        );
      }
      ,
    },
    {
      accessorKey: "stock",
      header: () => <SortableHeader label="Stock" sortKey="stock" />,
      cell: ({ row }) => {
        // Use the aggregate stock field from the product directly.
        // product_variants are not included in the admin list query for performance.
        const stock = row.original.stock ?? 0;

        return (
          <div className="flex flex-col gap-1">
            <span className="font-medium">{stock}</span>
          </div>
        );
      },
    },
    {
      header: "Estado",
      cell: ({ row }) => {
        const stock = row.original.stock ?? 0;
        const status = stock > 0 ? "Disponible" : "agotado";

        return (
          <Badge
            variant={stock > 0 ? "success" : "destructive"}
            className="shrink-0 text-xs"
          >
            {status === "Disponible" ? "Disponible" : "Agotado"}
          </Badge>
        );
      },
    },
    {
      header: "Ver",
      cell: ({ row }) => (
        <Button size="icon" asChild variant="ghost" className="text-foreground">
          <Link href={`/dashboard/products/${row.original.id}`}>
            <ZoomIn className="size-5" />
          </Link>
        </Button>
      ),
    },
  ];



  if (
    hasPermission("products", "canDelete") ||
    hasPermission("products", "canEdit")
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
            {hasPermission("products", "canEdit") && (
              <ProductFormSheet
                key={row.original.id}
                title="Update Products"
                description="Update necessary product information here"
                submitButtonText="Update Product"
                actionVerb="updated"
                initialData={{
                  name: row.original.name,
                  description: row.original.description ?? "",
                  image: row.original.image_url,
                  sku: row.original.sku || "",
                  category: row.original.category_id?.toString() || "",
                  brand: row.original.brand_id?.toString() || "",
                  price: row.original.price || 0,
                  stock: row.original.stock || 0,
                  weight_grams: row.original.weight_grams || 0,
                  sizes: row.original.sizes || "",
                  color: row.original.images?.[0]?.color || "",
                  color_code: row.original.images?.[0]?.color_code || "#000000",
                }}
                action={(formData) => editProduct(String(row.original.id), formData)}
                previewImage={row.original.image_url || '/placeholder.svg'}
              >
                <SheetTooltip content="Edit Product">
                  <PenSquare className="size-5" />
                </SheetTooltip>
              </ProductFormSheet>
            )}

            {hasPermission("products", "canDelete") && (
              <TableActionAlertDialog
                title={`Delete ${row.original.name}?`}
                description="This action cannot be undone. This will permanently delete the product and its associated data from the database."
                tooltipContent="Delete Product"
                actionButtonText="Delete Product"
                toastSuccessMessage={`Product "${row.original.name}" deleted successfully!`}
                queryKey="products"
                action={() => deleteProduct(String(row.original.id))}
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
    header: "Nombre del producto",
    cell: (
      <div className="flex gap-2 items-center">
        <Skeleton className="size-8 rounded-full" />

        <Skeleton className="w-28 h-8" />
      </div>
    ),
  },
  {
    header: "Categoría",
    cell: <Skeleton className="w-32 h-8" />,
  },
  {
    header: "Precio",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "Precio de venta",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "Stock",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "Estado",
    cell: <Skeleton className="w-24 h-8" />,
  },
  {
    header: "Ver",
    cell: <Skeleton className="w-8 h-8" />,
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
