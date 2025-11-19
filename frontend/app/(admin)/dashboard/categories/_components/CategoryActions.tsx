"use client";

import { PenSquare, Trash2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SheetTrigger } from "@/components/ui/sheet";
import { ActionAlertDialog } from "../../../components/shared/ActionAlertDialog";
import { ExportDataButtons } from "../../../components/shared/ExportDataButtons";

import CategoryFormSheet from "./form/CategoryFormSheet";
import CategoryBulkActionSheet from "./form/CategoryBulkActionSheet";
import { addCategory } from "../../../actions/categories/addCategory";
import { deleteCategories } from "../../../actions/categories/deleteCategories";
import { exportCategories } from "../../../actions/categories/exportCategories";
import { editCategories } from "../../../actions/categories/editCategories";
import { RowSelectionProps } from "../../../types/data-table";
import { useAuthorization } from "../../../hooks/use-authorization";

export default function CategoryActions({
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
          <ExportDataButtons action={exportCategories} tableName="categories" />
        </div>

        {/* Action Buttons Section */}
        {(hasPermission("categories", "canEdit") ||
          hasPermission("categories", "canDelete") ||
          hasPermission("categories", "canCreate")) && (
            <div className="flex flex-col sm:flex-row gap-2.5">
              {hasPermission("categories", "canEdit") && (
                <CategoryBulkActionSheet
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
                </CategoryBulkActionSheet>
              )}

              {hasPermission("categories", "canDelete") && (
                <ActionAlertDialog
                  title={`¿Eliminar ${selectedCount} categoría${selectedCount !== 1 ? 's' : ''}?`}
                  description="Esta acción no se puede deshacer. Las categorías y sus datos asociados serán eliminados permanentemente de la base de datos."
                  actionButtonText="Eliminar Categorías"
                  toastSuccessMessage="Categorías eliminadas exitosamente"
                  queryKey="categories"
                  action={() => deleteCategories(Object.keys(rowSelection))}
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

              {hasPermission("categories", "canCreate") && (
                <CategoryFormSheet
                  title="Agregar Categoría"
                  description="Ingresa la información necesaria de la categoría"
                  submitButtonText="Agregar Categoría"
                  actionVerb="agregado"
                  action={addCategory}
                >
                  <SheetTrigger asChild>
                    <Button
                      size="default"
                      className="h-10 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium shadow-sm hover:shadow-md transition-all text-sm"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Agregar Categoría
                    </Button>
                  </SheetTrigger>
                </CategoryFormSheet>
              )}
            </div>
          )}
      </div>
    </Card>
  );
}
