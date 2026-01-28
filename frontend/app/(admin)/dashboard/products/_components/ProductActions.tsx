"use client";

import { Trash2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SheetTrigger } from "@/components/ui/sheet";
import { ActionAlertDialog } from "@/app/(admin)/components/shared/ActionAlertDialog";
import { ExportDataButtons } from "@/app/(admin)/components/shared/ExportDataButtons";

import ProductFormSheet from "./form/ProductFormSheet";
import { addProduct } from "@/app/(admin)/actions/products/addProduct";
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
    <Card className="relative w-full overflow-hidden rounded-2xl border border-white/15 bg-[radial-gradient(circle_at_10%_20%,rgba(79,70,229,0.12),transparent_40%),radial-gradient(circle_at_90%_15%,rgba(45,212,191,0.12),transparent_38%),linear-gradient(120deg,rgba(7,14,26,0.8),rgba(10,18,32,0.9),rgba(6,25,36,0.9))] p-5 mb-4 text-white shadow-[0_25px_70px_-32px_rgba(14,165,233,0.55)] backdrop-blur-lg">
      <div className="flex gap-4 flex-row lg:flex-wrap items-center justify-between">
        <div className="space-y-2">
        
          <div className="flex flex-wrap gap-2">
            <ExportDataButtons action={exportProducts} tableName="products" />
          </div>
        </div>

        {(hasPermission("products", "canDelete") || hasPermission("products", "canCreate")) && (
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
                  className="h-11 px-4 rounded-xl border-red-400/60 bg-red-500/15 text-red-100/90 backdrop-blur hover:bg-red-500/25 hover:text-white disabled:opacity-50 transition-all text-sm font-semibold"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar {selectedCount > 0 && `(${selectedCount})`}
                </Button>
              </ActionAlertDialog>
            )}

            {hasPermission("products", "canCreate") && (
              <ProductFormSheet
                title="Agregar Producto"
                description="Gestiona cada detalle de tu catálogo con precisión profesional"
                submitButtonText="Agregar Producto"
                actionVerb="agregado"
                action={addProduct}
              >
                <SheetTrigger asChild>
                  <Button
                    size="default"
                    className="h-11 px-4 rounded-xl bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 text-slate-950 font-semibold shadow-[0_12px_30px_-12px_rgba(34,197,235,0.6)] transition-all hover:shadow-[0_18px_38px_-12px_rgba(34,197,235,0.75)]"
                  >
                    <Plus className="mr-2 h-4 w-4" />Agregar producto
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
