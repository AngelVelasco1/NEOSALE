"use client";

import { useRef, useState, useTransition, useEffect, ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldErrors } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";

import {
  FormTextInput,
  FormCategoryInput,
  FormImageInput,
  FormPriceInput,
  FormTextarea,
} from "@/app/(admin)/components/shared/form";
import { FormSubmitButton } from "@/app/(admin)/components/shared/form/FormSubmitButton";

import { productFormSchema, ProductFormData } from "./schema";
import { objectToFormData } from "@/app/(admin)/helpers/objectToFormData";
import { ProductServerActionResponse } from "@/app/(admin)/types/server-action";
import FormSubcategoryInput from "@/app/(admin)/components/shared/form/FormSubcategoryInput";

type BaseProductFormProps = {
  title: string;
  description: string;
  submitButtonText: string;
  actionVerb: string;
  children: ReactNode;
  action: (formData: FormData) => Promise<ProductServerActionResponse>;
};

type AddProductFormProps = BaseProductFormProps & {
  initialData?: never;
  previewImage?: never;
};

type EditProductFormProps = BaseProductFormProps & {
  initialData: Partial<ProductFormData>;
  previewImage: string;
};

type ProductFormProps = AddProductFormProps | EditProductFormProps;

export default function ProductFormSheet({
  title,

  submitButtonText,
  actionVerb,
  initialData,
  previewImage,
  children,
  action,
}: ProductFormProps) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const imageDropzoneRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLButtonElement>(null);
  const [sizes, setSizes] = useState<string[]>([]);
  const [variantStock, setVariantStock] = useState<Record<string, number>>({});

  // Helper function to generate variant key
  const getVariantKey = (size: string, color: string) => `${size}-${color}`;

  // Update variant stock when size or color changes
  const updateVariantStock = (size: string, stock: number) => {
    const color = form.watch("color") || "Default";
    const key = getVariantKey(size, color);
    setVariantStock(prev => ({ ...prev, [key]: stock }));
  };

  // Get stock for a specific variant
  const getVariantStock = (size: string) => {
    const color = form.watch("color") || "Default";
    const key = getVariantKey(size, color);
    return variantStock[key] || 0;
  };

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      image: initialData?.image || undefined,
      sku: initialData?.sku || "",
      category: initialData?.category || "",
      subcategory: initialData?.subcategory || "",
      brand: initialData?.brand || "",
      price: initialData?.price || 0,
      stock: initialData?.stock || 0,
      weight_grams: initialData?.weight_grams || 0,
      sizes: initialData?.sizes || "",
      color: initialData?.color || "",
      color_code: initialData?.color_code || "#000000",
    },
  });

  useEffect(() => {
    if (initialData && isSheetOpen) {
      form.reset({
        name: initialData.name || "",
        description: initialData.description || "",
        image: initialData.image || undefined,
        sku: initialData.sku || "",
        category: initialData.category || "",
        subcategory: initialData.subcategory || "",
        brand: initialData.brand || "",
        price: initialData.price || 0,
        stock: initialData.stock || 0,
        weight_grams: initialData.weight_grams || 0,
        sizes: initialData.sizes || "",
        color: initialData.color || "",
        color_code: initialData.color_code || "#000000",
      });
    }
  }, [initialData, isSheetOpen, form]);

  // Auto-update total stock when variant stocks change
  useEffect(() => {
    const currentSizes = form.watch("sizes") || "";
    const selectedSizes = currentSizes.split(",").map(s => s.trim()).filter(Boolean);

    const totalStock = Object.entries(variantStock)
      .filter(([key]) => {
        const size = key.split('-')[0];
        return selectedSizes.includes(size);
      })
      .reduce((total, [, stock]) => total + stock, 0);

    form.setValue("stock", totalStock);
  }, [variantStock, form.watch("sizes"), form]);

  const onSubmit = (data: ProductFormData) => {
    // Add variant stock data to the form data
    const enhancedData = {
      ...data,
      variantStock: JSON.stringify(variantStock)
    };
    const formData = objectToFormData(enhancedData);

    startTransition(async () => {
      const result = await action(formData);

      if ("validationErrors" in result) {
        Object.keys(result.validationErrors).forEach((key) => {
          form.setError(key as keyof ProductFormData, {
            message: result.validationErrors![key],
          });
        });

        form.setFocus(
          Object.keys(result.validationErrors)[0] as keyof ProductFormData
        );
      } else if ("dbError" in result) {
        toast.error(result.dbError);
      } else {
        form.reset({
          name: "",
          description: "",
          image: undefined,
          sku: "",
          category: "",
          brand: "",
          price: 0,
          stock: 0,
          weight_grams: 0,
          sizes: "",
          color: "",
          color_code: "#000000",
        });
        setVariantStock({});
        setSizes([]);
        toast.success(
          `Product "${result.product.name}" ${actionVerb} successfully!`,
          { position: "top-center" }
        );
        queryClient.invalidateQueries({ queryKey: ["products"] });
        setIsSheetOpen(false);
      }
    });
  };

  const onInvalid = (errors: FieldErrors<ProductFormData>) => {
    if (errors.image) {
      imageDropzoneRef.current?.focus();
    } else if (errors.category) {
      categoryRef.current?.focus();
    }
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      {children}

      <SheetContent className="w-full sm:max-w-[95vw] lg:max-w-[85vw] xl:max-w-[700px] p-0! gap-0! overflow-hidden border-2 border-l-slate-400/40 border-b-0 border-t-0 b-r-0  rounded-bl-2xl rounded-tl-2xl bg-linear-to-br from-slate-950 via-slate-900 to-slate-900 shadow-2xl shadow-indigo-500/20">
        <div className="h-screen w-full m-0 p-0 flex flex-col bg-linear-to-br from-slate-900/95 via-slate-800/90 to-slate-700/85 backdrop-blur-xl">
          {/* Header mejorado con gradiente premium */}
          <div className="relative px-8 py-6 bg-linear-to-r from-slate-950/90 via-slate-800/70 to-slate-950/90 b border-none">
            <div className="absolute inset-0 bg-[url('/imgs/grid.svg')] opacity-5" />
            <div className="relative space-y-1">
              <SheetTitle className="text-3xl font-bold tracking-tight bg-linear-to-r from-slate-300 via-slate-200 to-slate-300 bg-clip-text text-transparent">
                {title}
              </SheetTitle>

            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onInvalid)}
              className="flex flex-col h-[calc(100vh-7rem)]"
            >
              <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 py-4 bg-linear-to-b from-slate-950/50 via-slate-900/30 to-slate-800/20">
                <div
                  className="space-y-4 max-w-5xl mx-auto"
                  ref={setContainer}
                >
                  {/* Sección: Información Básica */}
                  <div className="group relative space-y-4 p-7 rounded-2xl  border-border/40 bg-linear-to-br from-card via-card/95 to-card/90 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-primary/30 hover:-translate-y-1 
                  
                   border-none">

                    <div className="relative space-y-4">
                      <FormTextInput
                        control={form.control}
                        name="name"
                        label="Nombre"
                        placeholder="Añade un nombre descriptivo para el producto"
                      />

                      <FormTextarea
                        control={form.control}
                        name="description"
                        label="Descripcion"
                        placeholder="Añade una descripcion detallada del producto"
                      />

                      <FormImageInput
                        control={form.control}
                        name="image"
                        label="Imagenes"
                        previewImage={previewImage}
                        ref={imageDropzoneRef}
                      />
                    </div>
                  </div>

                  <div className="group relative space-y-6 p-7 rounded-2xl border-none bg-linear-to-br from-card via-card/95 to-card/90 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-orange-500/30 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative flex items-center gap-3 pb-3 ">
                      <div className="flex items-center justify-center size-8 rounded-xl bg-linear-to-br from-orange-500/20 to-orange-500/10 border border-orange-500/20">
                        <div className="size-2.5 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50 animate-pulse" />
                      </div>
                      <h3 className="text-base font-bold tracking-wide text-foreground/90 uppercase">
                        Variantes
                      </h3>
                    </div>

                    <div className="relative space-y-6">
                      <div className="space-y-4">
                        <label className="text-md font-medium text-foreground">Tamaños</label>

                        {(() => {
                          const currentSizes = form.watch("sizes") || "";
                          const sizesArray = currentSizes.split(",").map(s => s.trim()).filter(Boolean);

                          if (sizesArray.length > 0) {
                            return (
                              <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-800/40 border border-slate-600/30">
                                <span className="text-xs font-medium text-slate-400 mr-2">Selected:</span>
                                {sizesArray.map((size, index) => (
                                  <button
                                    key={`${size}-${index}`}
                                    type="button"
                                    onClick={() => {
                                      const newSizes = sizesArray.filter(s => s !== size);
                                      form.setValue("sizes", newSizes.join(", "));
                                    }}
                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-400/30 rounded-md hover:bg-orange-500/30 transition-colors"
                                  >
                                    {size}
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        })()}

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                          {sizes.map((size) => {
                            const currentSizes = form.watch("sizes") || "";
                            const sizesArray = currentSizes.split(",").map(s => s.trim()).filter(Boolean);
                            const isSelected = sizesArray.includes(size);

                            return (
                              <button
                                key={size}
                                type="button"
                                onClick={() => {
                                  const current = form.getValues("sizes") || "";
                                  const currentArray = current.split(",").map(s => s.trim()).filter(Boolean);

                                  if (isSelected) {
                                    const newSizes = currentArray.filter(s => s !== size);
                                    form.setValue("sizes", newSizes.join(", "));
                                  } else {
                                    const newSizes = [...currentArray, size];
                                    form.setValue("sizes", newSizes.join(", "));
                                  }
                                }}
                                className={`
                                  relative h-12 px-4 rounded-xl border-2 font-semibold text-sm transition-all duration-200
                                  ${isSelected
                                    ? "border-orange-400 bg-linear-to-br from-orange-500/20 to-amber-500/10 text-orange-300 shadow-lg shadow-orange-500/20"
                                    : "border-slate-600/50 bg-linear-to-br from-slate-800/50 to-slate-700/30 text-slate-300 hover:border-orange-400/50 hover:bg-linear-to-br hover:from-orange-500/10 hover:to-amber-500/5"
                                  }
                                `}
                              >
                                <span className="relative z-10">{size}</span>
                                {isSelected && (
                                  <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 to-amber-500/5 rounded-xl" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Clear all and Custom size input */}
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setSizes([]);
                              form.setValue("sizes", "");
                            }}
                            className="h-10 px-4 rounded-lg border-2 border-red-500/40 bg-linear-to-r from-red-500/20 to-red-400/10 text-red-300 font-semibold text-sm hover:border-red-400/60 hover:from-red-500/30 hover:to-red-400/20 transition-all duration-200"
                          >
                            Clear All
                          </button>
                          <input
                            type="text"
                            placeholder="Add custom size (e.g., 3XL)"
                            className="flex-1 h-10 px-3 rounded-lg border-2 border-slate-600/50 bg-slate-800/50 text-slate-200 placeholder:text-slate-400 focus:border-orange-400/60 focus:outline-none transition-colors text-sm"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const input = e.target as HTMLInputElement;
                                const customSize = input.value.trim().toUpperCase();

                                if (customSize) {
                                  // Add to sizes array if not already exists
                                  if (!sizes.includes(customSize)) {
                                    setSizes(prev => [...prev, customSize]);
                                  }

                                  // Add to form field
                                  const current = form.getValues("sizes") || "";
                                  const currentArray = current.split(",").map(s => s.trim()).filter(Boolean);

                                  if (!currentArray.includes(customSize)) {
                                    const newSizes = [...currentArray, customSize];
                                    form.setValue("sizes", newSizes.join(", "));
                                  }

                                  input.value = "";
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              const input = (e.target as HTMLButtonElement).previousElementSibling as HTMLInputElement;
                              const customSize = input.value.trim().toUpperCase();

                              if (customSize) {
                                // Add to sizes array if not already exists
                                if (!sizes.includes(customSize)) {
                                  setSizes(prev => [...prev, customSize]);
                                }

                                // Add to form field
                                const current = form.getValues("sizes") || "";
                                const currentArray = current.split(",").map(s => s.trim()).filter(Boolean);

                                if (!currentArray.includes(customSize)) {
                                  const newSizes = [...currentArray, customSize];
                                  form.setValue("sizes", newSizes.join(", "));
                                }

                                input.value = "";
                              }
                            }}
                            className="h-10 px-4 rounded-lg border-2 border-orange-500/40 bg-linear-to-r from-orange-500/20 to-amber-500/10 text-orange-300 font-semibold text-sm hover:border-orange-400/60 hover:from-orange-500/30 hover:to-amber-500/20 transition-all duration-200"
                          >
                            Add
                          </button>
                        </div>

                        {form.formState.errors.sizes && (
                          <p className="text-sm text-red-400 mt-1">
                            {form.formState.errors.sizes.message}
                          </p>
                        )}
                      </div>

                      {/* Variant Stock Management */}
                      {sizes.length > 0 && (
                        <div className="space-y-4">
                          <label className="text-sm font-medium text-foreground">Stock por Variante</label>
                          <div className="p-4 rounded-xl bg-slate-800/30 border-2 border-slate-600/30">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="size-4 rounded bg-current" style={{ backgroundColor: form.watch("color_code") || "#000000" }} />
                                <span className="text-sm font-medium text-slate-300">
                                  {form.watch("color") || "Sin color"}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                {sizes.map((size) => {
                                  const currentSizes = form.watch("sizes") || "";
                                  const selectedSizes = currentSizes.split(",").map(s => s.trim()).filter(Boolean);
                                  const isActive = selectedSizes.includes(size);

                                  if (!isActive) return null;

                                  return (
                                    <div key={size} className="space-y-2">
                                      <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50 border border-slate-600/40">
                                        <span className="font-semibold text-slate-200 text-sm">{size}</span>
                                        <input
                                          type="number"
                                          min="0"
                                          value={getVariantStock(size)}
                                          onChange={(e) => updateVariantStock(size, parseInt(e.target.value) || 0)}
                                          className="w-16 h-8 px-2 text-center rounded border border-slate-600/50 bg-slate-800/50 text-slate-200 text-sm focus:border-orange-400/60 focus:outline-none transition-colors"
                                          placeholder="0"
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Total stock calculation */}
                              <div className="mt-4 p-3 rounded-lg bg-slate-700/30 border border-slate-600/30">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-slate-300">Stock Total:</span>
                                  <span className="text-lg font-bold text-orange-300">
                                    {Object.entries(variantStock)
                                      .filter(([key]) => {
                                        const size = key.split('-')[0];
                                        const currentSizes = form.watch("sizes") || "";
                                        const selectedSizes = currentSizes.split(",").map(s => s.trim()).filter(Boolean);
                                        return selectedSizes.includes(size);
                                      })
                                      .reduce((total, [, stock]) => total + stock, 0)
                                    }
                                  </span>
                                </div>
                              </div>

                              {/* Quick actions */}
                              <div className="flex gap-2 mt-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentSizes = form.watch("sizes") || "";
                                    const selectedSizes = currentSizes.split(",").map(s => s.trim()).filter(Boolean);
                                    const color = form.watch("color") || "Default";
                                    const updates: Record<string, number> = {};
                                    selectedSizes.forEach(size => {
                                      updates[getVariantKey(size, color)] = 10;
                                    });
                                    setVariantStock(prev => ({ ...prev, ...updates }));
                                  }}
                                  className="px-3 py-1.5 text-xs font-medium rounded-md border border-green-500/40 bg-green-500/10 text-green-300 hover:bg-green-500/20 transition-colors"
                                >
                                  Set All to 10
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentSizes = form.watch("sizes") || "";
                                    const selectedSizes = currentSizes.split(",").map(s => s.trim()).filter(Boolean);
                                    const color = form.watch("color") || "Default";
                                    const updates: Record<string, number> = {};
                                    selectedSizes.forEach(size => {
                                      updates[getVariantKey(size, color)] = 0;
                                    });
                                    setVariantStock(prev => ({ ...prev, ...updates }));
                                  }}
                                  className="px-3 py-1.5 text-xs font-medium rounded-md border border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-colors"
                                >
                                  Clear All
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <FormTextInput
                          control={form.control}
                          name="color"
                          label="Nombre del color"
                          placeholder="e.g., Navy Blue"
                        />

                        <div className="space-y-3">
                          <label className="text-sm font-medium text-foreground inline">Color</label>
                          <div className="flex flex-col items-start gap-4">
                            {/* Color Info Display with Integrated Picker */}
                            <div className="flex-1 relative">
                              <div className="px-4 py-3 rounded-xl bg-linear-to-r from-slate-700/60 to-slate-600/40 border-2 border-slate-500/40 backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                  {/* Color Picker integrated in the preview */}
                                  <div className="relative size-8">
                                    <input
                                      type="color"
                                      value={form.watch("color_code") || "#000000"}
                                      onChange={(e) => {
                                        form.setValue("color_code", e.target.value);
                                      }}
                                      className="absolute inset-0 w-8 h-8 opacity-0 cursor-pointer z-10"
                                    />
                                    <div
                                      className="size-8 rounded-lg border-2 border-slate-400/50 shadow-md transition-all duration-200 hover:scale-110 hover:shadow-lg cursor-pointer relative overflow-hidden"
                                      style={{
                                        backgroundColor: form.watch("color_code") || "#000000",
                                      }}
                                    >
                                      {/* Hover indicator */}
                                      <div className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-colors rounded-lg flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white/60 opacity-0 hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex flex-col flex-1">
                                    <input
                                      type="text"
                                      value={form.watch("color_code") || ""}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.match(/^#[0-9A-Fa-f]{0,6}$/)) {
                                          form.setValue("color_code", value);
                                        }
                                      }}
                                      placeholder="#1E40AF"
                                      className="w-28 h-10 px-3 rounded-lg border-2 border-slate-600/50 bg-slate-800/50 text-slate-200 placeholder:text-slate-400 focus:border-orange-400/60 focus:outline-none transition-colors text-sm font-mono"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>

                          {form.formState.errors.color_code && (
                            <p className="text-sm text-red-400 mt-1">
                              {form.formState.errors.color_code.message}
                            </p>
                          )}
                        </div>


                      </div>
                    </div>
                  </div>

                  <div className="group relative space-y-6 p-7 rounded-2xl border-none bg-linear-to-br from-card via-card/95 to-card/90 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-blue-500/30 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative flex items-center gap-3 pb-3 ">
                      <div className="flex items-center justify-center size-8 rounded-xl bg-linear-to-br from-blue-500/20 to-blue-500/10 border border-blue-500/20">
                        <div className="size-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 animate-pulse" />
                      </div>
                      <h3 className="text-base font-bold tracking-wide text-foreground/90 uppercase">
                        Inventario
                      </h3>
                    </div>

                    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <FormTextInput
                        control={form.control}
                        name="sku"
                        label="Codigo"
                        placeholder="e.g., ABC-12345"
                      />

                      <div className="space-y-2">
                        <FormTextInput
                          control={form.control}
                          name="stock"
                          label="Stock Total"
                          placeholder="Se calcula automáticamente"
                          type="number"
                          readOnly
                        />
                        <p className="text-xs text-slate-400">Este valor se calcula automáticamente sumando todas las variantes</p>
                      </div>
                    </div>
                  </div>

                  {/* Sección: Categorización */}
                  <div className="group relative space-y-6 p-7 rounded-2xl border-none bg-linear-to-br from-card via-card/95 to-card/90 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-purple-500/30 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative flex items-center gap-3 pb-3">
                      <div className="flex items-center justify-center size-8 rounded-xl bg-linear-to-br from-purple-500/20 to-purple-500/10 border border-purple-500/20">
                        <div className="size-2.5 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50 animate-pulse" />
                      </div>
                      <h3 className="text-base font-bold tracking-wide text-foreground/90 uppercase">
                        Categorización
                      </h3>
                    </div>

                    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <FormCategoryInput
                        control={form.control}
                        name="category"
                        label="Categoría"
                        container={container || undefined}
                        ref={categoryRef}
                      />

                      <FormTextInput
                        control={form.control}
                        name="subcategory"
                        label="Subcategoría"
                        container={container || undefined}
                      />
                    </div>
                  </div>

                  {/* Sección: Pricing & Dimensions */}
                  <div className="group relative space-y-6 p-7 rounded-2xl border-none bg-linear-to-br from-card via-card/95 to-card/90 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-green-500/30 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-linear-to-br from-green-500/5 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative flex items-center gap-3 pb-3 ">
                      <div className="flex items-center justify-center size-8 rounded-xl bg-linear-to-br from-green-500/20 to-green-500/10 border border-green-500/20">
                        <div className="size-2.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50 animate-pulse" />
                      </div>
                      <h3 className="text-base font-bold tracking-wide text-foreground/90 uppercase">
                        Precios
                      </h3>
                    </div>

                    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <FormPriceInput
                        control={form.control}
                        name="price"
                        label="Precio"
                        placeholder="e.g., 9999"
                      />

                      <FormTextInput
                        control={form.control}
                        name="weight_grams"
                        label="Peso (grams)"
                        placeholder="e.g., 500"
                        type="number"
                      />
                    </div>
                  </div>

                  {/* Sección: Variantes */}

                </div>
              {/* Footer premium con animación */}
              <div className="px-8 py-5 ">
                <div className="max-w-5xl h-full flex items-end mx-auto p-0">
                  <FormSubmitButton
                    isPending={isPending}
                    className="w-full h-14 bg-amber-50 text-base font-bold tracking-wide bg-linear-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary hover:to-primary/90 shadow-xl hover:shadow-2xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] rounded-xl border border-primary/20"
                  >
                    {isPending ? (
                      <span className="flex items-center justify-center gap-3">
                        <div className="size-5 border-3 border-primary-foreground/30  rounded-full animate-spin " />
                        <span className="animate-pulse">Processing your request...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2 text-slate-700">
                        {submitButtonText}
                       
                      </span>
                    )}
                  </FormSubmitButton>
                </div>
              </div>
              </div>

            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
