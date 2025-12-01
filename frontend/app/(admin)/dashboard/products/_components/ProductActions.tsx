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
  const selectedCount = Object.keys(rowSelection).length;

  return (
    <Card className="mb-6 p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-xl">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Export Section */}
        <div className="flex flex-col sm:flex-row gap-2">
          <ExportDataButtons action={exportProducts} tableName="products" />
        </div>

        {/* Action Buttons Section */}
        {(hasPermission("products", "canEdit") ||
          hasPermission("products", "canDelete") ||
          hasPermission("products", "canCreate")) && (
            <div className="flex flex-col sm:flex-row gap-2.5">


              {hasPermission("products", "canDelete") && (
                <ActionAlertDialog
                  title={`¿Eliminar ${selectedCount} producto${selectedCount !== 1 ? 's' : ''}?`}
                  description="Esta acción no se puede deshacer. Los productos y sus datos asociados serán eliminados permanentemente de la base de datos."
                  actionButtonText="Eliminar Productos"
                  toastSuccessMessage="Productos eliminados exitosamente"
                  queryKey="products"
                  action={() => deleteProducts(Object.keys(rowSelection))}
                  onSuccess={() => setRowSelection({})}
                >
                  <Button
                    variant="outline"
                    size="default"
                    type="button"
                    disabled={!selectedCount}
                    className="h-10 px-4 rounded-lg border-red-300 dark:border-red-800 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50 transition-all text-sm font-medium"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar {selectedCount > 0 && `(${selectedCount})`}
                  </Button>
                </ActionAlertDialog>
              )}

              {hasPermission("products", "canCreate") && (
                <ProductFormSheet
                  title="Agregar Producto"
                  submitButtonText="Agregar Producto"
                  actionVerb="agregado"
                  action={addProduct}
                >
                  <SheetTrigger asChild>
                    <Button
                      size="default"
                      className="h-10 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium shadow-sm hover:shadow-md transition-all text-sm"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Agregar Producto
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
