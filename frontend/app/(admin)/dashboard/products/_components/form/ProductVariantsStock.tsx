"use client";

import { Input } from "@/app/(admin)/components/ui/input";
import { Label } from "@/app/(admin)/components/ui/label";
import { Badge } from "@/app/(admin)/components/ui/badge";

interface ColorData {
  name: string;
  code: string;
}

interface ProductVariantsStockProps {
  colors: Array<ColorData>;
  sizes: string;
  variantStock: Record<string, number>;
  updateVariantStock: (size: string, colorCode: string, stock: number) => void;
  getVariantStock: (size: string, colorCode: string) => number;
}

export function ProductVariantsStock({
  colors,
  sizes,
  variantStock,
  updateVariantStock,
  getVariantStock
}: ProductVariantsStockProps) {
  const sizesArray = sizes.split(",").map(s => s.trim()).filter(Boolean);

  if (colors.length === 0 || sizesArray.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-slate-800/40 border border-slate-600/30 text-center">
        <p className="text-sm text-slate-400">
          {colors.length === 0
            ? "Agrega al menos un color para configurar el stock"
            : "Selecciona al menos una talla para configurar el stock"}
        </p>
      </div>
    );
  }

  const totalStock = Object.values(variantStock).reduce((sum, stock) => sum + stock, 0);

  return (
    <div className="space-y-4">
      {/* Total stock badge */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-linear-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30">
        <Label className="text-sm font-medium text-orange-200">Stock Total</Label>
        <Badge className="bg-orange-500 text-white text-lg font-bold px-4 py-1.5">
          {totalStock} unidades
        </Badge>
      </div>

      {/* Stock grid by color */}
      <div className="space-y-6">
        {colors.map((color) => {
          const colorTotal = sizesArray.reduce(
            (sum, size) => sum + getVariantStock(size, color.code),
            0
          );

          return (
            <div
              key={color.code}
              className="p-4 rounded-xl bg-slate-800/40 border border-slate-600/30 space-y-3"
            >
              {/* Color header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-600/30">
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-lg border-2 border-white/50"
                    style={{ backgroundColor: color.code }}
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{color.name}</p>
                    <p className="text-xs text-slate-400 font-mono">{color.code}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-slate-300">
                  {colorTotal} unidades
                </Badge>
              </div>

              {/* Size inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {sizesArray.map((size) => (
                  <div key={`${color.code}-${size}`} className="space-y-1.5">
                    <Label className="text-xs font-medium text-slate-300">
                      Talla {size}
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      value={getVariantStock(size, color.code)}
                      onChange={(e) =>
                        updateVariantStock(size, color.code, parseInt(e.target.value) || 0)
                      }
                      className="bg-slate-700/50 border-slate-600/50 text-slate-200 text-center font-semibold h-10"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            colors.forEach((color) => {
              sizesArray.forEach((size) => {
                updateVariantStock(size, color.code, 0);
              });
            });
          }}
          className="flex-1 px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-300 text-sm font-medium hover:bg-slate-700 hover:border-slate-500 transition-colors"
        >
          Limpiar todo
        </button>
        <button
          type="button"
          onClick={() => {
            const stockValue = prompt("Ingresa el stock para todas las variantes:");
            if (stockValue !== null) {
              const stock = parseInt(stockValue) || 0;
              colors.forEach((color) => {
                sizesArray.forEach((size) => {
                  updateVariantStock(size, color.code, stock);
                });
              });
            }
          }}
          className="flex-1 px-4 py-2 rounded-lg bg-orange-500/20 border border-orange-400/30 text-orange-300 text-sm font-medium hover:bg-orange-500/30 transition-colors"
        >
          Aplicar a todo
        </button>
      </div>
    </div>
  );
}
