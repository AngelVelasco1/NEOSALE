"use client";

import { PenSquare, Trash2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SheetTrigger } from "@/components/ui/sheet";
import { ActionAlertDialog } from "@/app/(admin)/components/shared/ActionAlertDialog";
import { ExportDataButtons } from "@/app/(admin)/components/shared/ExportDataButtons";

import ProductFormSheet from "./form/ProductFormSheet";
import ProductBulkActionSheet from "./form/ProductBulkActionSheet";
import { addProduct } from "@/app/(admin)/actions/products/addProduct";
import { editProducts } from "@/app/(admin)/actions/products/editProducts";
import { deleteProducts } from "@/app/(admin)/actions/products/deleteProducts";
import { exportProducts } from "@/app/(admin)/actions/products/exportProducts";
import { RowSelectionProps } from "@/app/(admin)/types/data-table";
import { useAuthorization } from "@/app/(admin)/hooks/use-authorization";

export default function ProductActions({
  rowSelection,
  setRowSelection,
}: RowSelectionProps) {
  const { hasPermission } = useAuthorization();

  return (
    <Card className="mb-5">
      <div className="flex flex-col xl:flex-row xl:justify-between gap-4">
        <ExportDataButtons action={exportProducts} tableName="products" />

        {(hasPermission("products", "canEdit") ||
          hasPermission("products", "canDelete") ||
          hasPermission("products", "canCreate")) && (
            <div className="flex flex-col sm:flex-row gap-4">
              {hasPermission("products", "canEdit") && (
                <ProductBulkActionSheet
                  action={(formData) =>
                    editProducts(Object.keys(rowSelection), formData)
                  }
                  onSuccess={() => setRowSelection({})}
                >
                  <SheetTrigger asChild>
                    <Button
                      variant="secondary"
                      size="lg"
                      type="button"
                      disabled={!Object.keys(rowSelection).length}
                      className="sm:flex-grow xl:flex-grow-0 transition-opacity duration-300"
                    >
                      <PenSquare className="mr-2 size-4" /> Bulk Action
                    </Button>
                  </SheetTrigger>
                </ProductBulkActionSheet>
              )}

              {hasPermission("products", "canDelete") && (
                <ActionAlertDialog
                  title={`Delete ${Object.keys(rowSelection).length} products?`}
                  description="This action cannot be undone. This will permanently delete the products and their associated data from the database."
                  actionButtonText="Delete Products"
                  toastSuccessMessage="Products deleted successfully"
                  queryKey="products"
                  action={() => deleteProducts(Object.keys(rowSelection))}
                  onSuccess={() => setRowSelection({})}
                >
                  <Button
                    variant="destructive"
                    size="lg"
                    type="button"
                    disabled={!Object.keys(rowSelection).length}
                    className="sm:flex-grow xl:flex-grow-0 transition-opacity duration-300"
                  >
                    <Trash2 className="mr-2 size-4" />
                    Delete
                  </Button>
                </ActionAlertDialog>
              )}

              {hasPermission("products", "canCreate") && (
                <ProductFormSheet
                  title="Add Product"
                  description="Add necessary product information here"
                  submitButtonText="Add Product"
                  actionVerb="added"
                  action={addProduct}
                >
                  <SheetTrigger asChild>
                    <Button
                      variant="default"
                      size="lg"
                      className="sm:flex-grow xl:flex-grow-0"
                    >
                      <Plus className="mr-2 size-4" /> Add Product
                    </Button>
                  </SheetTrigger>
                </ProductFormSheet>
              )}
            </div>
          )}
      </div>
    </Card>
  );
}
