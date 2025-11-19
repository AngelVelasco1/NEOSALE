"use client";

import { PenSquare, Trash2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SheetTrigger } from "@/components/ui/sheet";
import { ActionAlertDialog } from "@/app/(admin)/components/shared/ActionAlertDialog";
import { ExportDataButtons } from "@/app/(admin)/components/shared/ExportDataButtons";

import CouponFormSheet from "./form/CouponFormSheet";
import CouponBulkActionSheet from "./form/CouponBulkActionSheet";
import { addCoupon } from "@/app/(admin)/actions/coupons/addCoupon";
import { deleteCoupons } from "@/app/(admin)/actions/coupons/deleteCoupons";
import { exportCoupons } from "@/app/(admin)/actions/coupons/exportCoupons";
import { RowSelectionProps } from "@/app/(admin)/types/data-table";
import { editCategories } from "@/app/(admin)/actions/categories/editCategories";
import { useAuthorization } from "@/app/(admin)/hooks/use-authorization";

export default function CouponActions({
  rowSelection,
  setRowSelection,
}: RowSelectionProps) {
  const { hasPermission } = useAuthorization();

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <Card className="mb-6 p-5 border border-slate-200/60 dark:border-slate-700/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50 rounded-xl">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Export Section */}
        <div className="flex flex-col sm:flex-row gap-2">
          <ExportDataButtons action={exportCoupons} tableName="coupons" />
        </div>

        {/* Action Buttons Section */}
        {(hasPermission("coupons", "canEdit") ||
          hasPermission("coupons", "canDelete") ||
          hasPermission("coupons", "canCreate")) && (
            <div className="flex flex-col sm:flex-row gap-2.5">
              {hasPermission("coupons", "canEdit") && (
                <CouponBulkActionSheet
                  action={(formData) =>
                    editCategories(Object.keys(rowSelection), formData)
                  }
                  onSuccess={() => setRowSelection({})}
                >
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="default"
                      type="button"
                      disabled={!selectedCount}
                      className="h-10 px-4 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-50 transition-all text-sm font-medium"
                    >
                      <PenSquare className="mr-2 h-4 w-4" />
                      Editar {selectedCount > 0 && `(${selectedCount})`}
                    </Button>
                  </SheetTrigger>
                </CouponBulkActionSheet>
              )}

              {hasPermission("coupons", "canDelete") && (
                <ActionAlertDialog
                  title={`¿Eliminar ${selectedCount} cupón${selectedCount !== 1 ? 'es' : ''}?`}
                  description="Esta acción no se puede deshacer. Los cupones y sus datos asociados serán eliminados permanentemente de la base de datos."
                  actionButtonText="Eliminar Cupones"
                  toastSuccessMessage="Cupones eliminados exitosamente"
                  queryKey="coupons"
                  action={() => deleteCoupons(Object.keys(rowSelection))}
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

              {hasPermission("coupons", "canCreate") && (
                <CouponFormSheet
                  title="Agregar Cupón"
                  description="Ingresa la información necesaria del cupón"
                  submitButtonText="Agregar Cupón"
                  actionVerb="agregado"
                  action={addCoupon}
                >
                  <SheetTrigger asChild>
                    <Button
                      size="default"
                      className="h-10 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium shadow-sm hover:shadow-md transition-all text-sm"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Agregar Cupón
                    </Button>
                  </SheetTrigger>
                </CouponFormSheet>
              )}
            </div>
          )}
      </div>
    </Card>
  );
}
