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
  FormPriceInput,
  FormTextarea,
} from "@/app/(admin)/components/shared/form";
import FormSubcategoryByCategory from "@/app/(admin)/components/shared/form/FormSubcategoryByCategory";
import { FormSubmitButton } from "@/app/(admin)/components/shared/form/FormSubmitButton";

import { productFormSchema, ProductFormData } from "./schema";
import { objectToFormData } from "@/app/(admin)/helpers/objectToFormData";
import { ProductServerActionResponse } from "@/app/(admin)/types/server-action";

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
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [variantImages, setVariantImages] = useState<Record<string, Array<{ file: File; preview: string; isPrimary: boolean }>>>({});
  const [activeVariantTab, setActiveVariantTab] = useState<string | null>(null);

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

  // Watch category changes to update subcategory options
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "category" && value.category) {
        const categoryId = parseInt(value.category);
        setSelectedCategoryId(isNaN(categoryId) ? undefined : categoryId);
        // Reset subcategory when category changes
        form.setValue("subcategory", "");
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);
  
  const onSubmit = (data: ProductFormData) => {
    // Add variant stock data and images to the form data
    const enhancedData = {
      ...data,
      variantStock: JSON.stringify(variantStock),
      variantImages: JSON.stringify(
        Object.entries(variantImages).reduce((acc, [key, images]) => {
          acc[key] = images.map(img => ({ isPrimary: img.isPrimary }));
          return acc;
        }, {} as Record<string, Array<{ isPrimary: boolean }>>)
      )
    };
    const formData = objectToFormData(enhancedData);
    
    // Add image files
    Object.entries(variantImages).forEach(([variantKey, images]) => {
      images.forEach((img, index) => {
        formData.append(`variantImage_${variantKey}_${index}`, img.file);
      });
    });

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
        setSelectedCategoryId(undefined);
        setVariantImages({});
        setActiveVariantTab(null);
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

      <SheetContent className="w-full sm:max-w-[95vw] lg:max-w-[85vw] xl:max-w-[1200px] p-0! gap-0! overflow-hidden border-2 border-l-slate-400/40 border-b-0 border-t-0 b-r-0  rounded-bl-2xl rounded-tl-2xl bg-linear-to-br from-slate-950 via-slate-900 to-slate-900 shadow-2xl shadow-indigo-500/20">
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
              <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 py-6 bg-linear-to-b from-slate-950/50 via-slate-900/30 to-slate-800/20">
                <div
                  className="space-y-6 max-w-5xl mx-auto"
                  ref={setContainer}
                >
                  {/* Sección: Información del Producto y Variantes */}
                  <div className="group relative p-8 rounded-2xl border-none bg-linear-to-br from-card via-card/95 to-card/90 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-primary/30 hover:-translate-y-1">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Columna Izquierda: Información Básica */}
                      <div className="space-y-5">
                        <div className="flex items-center gap-3 pb-3 border-b border-slate-700/50">
                          <div className="flex items-center justify-center size-8 rounded-xl bg-linear-to-br from-blue-500/20 to-blue-500/10 border border-blue-500/20">
                            <div className="size-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 animate-pulse" />
                          </div>
                          <h3 className="text-base font-bold tracking-wide text-foreground/90 uppercase">
                            Información Básica
                          </h3>
                        </div>
                        
                        <div className="space-y-4">
                          <FormTextInput
                            control={form.control}
                            name="name"
                            label="Nombre"
                            placeholder="Añade un nombre descriptivo para el producto"
                          />
                          
                          <FormTextInput
                            control={form.control}
                            name="sku"
                            label="SKU / Código"
                            placeholder="e.g., ABC-12345"
                          />

                          <FormTextarea
                            control={form.control}
                            name="description"
                            label="Descripción"
                            placeholder="Añade una descripción detallada del producto"
                          />
                        </div>
                      </div>

                      {/* Columna Derecha: Tamaños */}
                      <div className="space-y-5">
                        <div className="flex items-center gap-3 pb-3 border-b border-slate-700/50">
                          <div className="flex items-center justify-center size-8 rounded-xl bg-linear-to-br from-orange-500/20 to-orange-500/10 border border-orange-500/20">
                            <div className="size-2.5 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50 animate-pulse" />
                          </div>
                          <h3 className="text-base font-bold tracking-wide text-foreground/90 uppercase">
                            Tamaños
                          </h3>
                        </div>
                        
                        <div className="space-y-4">
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

                          <div className="grid grid-cols-3 gap-2">
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
                                    relative h-11 px-3 rounded-xl border-2 font-semibold text-sm transition-all duration-200
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

                          {/* Custom size and clear */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Custom size (3XL)"
                                className="flex-1 h-11 px-4 rounded-lg border-2 border-slate-600/50 bg-slate-800/50 text-slate-200 placeholder:text-slate-400 focus:border-orange-400/60 focus:outline-none transition-colors text-sm"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const input = e.target as HTMLInputElement;
                                    const customSize = input.value.trim().toUpperCase();

                                    if (customSize) {
                                      if (!sizes.includes(customSize)) {
                                        setSizes(prev => [...prev, customSize]);
                                      }

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
                                  const button = e.target as HTMLButtonElement;
                                  const container = button.parentElement;
                                  const input = container?.querySelector('input') as HTMLInputElement;
                                  const customSize = input.value.trim().toUpperCase();

                                  if (customSize) {
                                    if (!sizes.includes(customSize)) {
                                      setSizes(prev => [...prev, customSize]);
                                    }

                                    const current = form.getValues("sizes") || "";
                                    const currentArray = current.split(",").map(s => s.trim()).filter(Boolean);

                                    if (!currentArray.includes(customSize)) {
                                      const newSizes = [...currentArray, customSize];
                                      form.setValue("sizes", newSizes.join(", "));
                                    }

                                    input.value = "";
                                  }
                                }}
                                className="h-11 px-4 rounded-lg border-2 border-orange-500/40 bg-linear-to-r from-orange-500/20 to-amber-500/10 text-orange-300 font-semibold text-sm hover:border-orange-400/60 hover:from-orange-500/30 hover:to-amber-500/20 transition-all duration-200 whitespace-nowrap flex items-center justify-center"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSizes([]);
                                form.setValue("sizes", "");
                              }}
                              className="w-full h-10 px-4 rounded-lg border-2 border-red-500/40 bg-linear-to-r from-red-500/20 to-red-400/10 text-red-300 font-semibold text-sm hover:border-red-400/60 hover:from-red-500/30 hover:to-red-400/20 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Clear All
                            </button>
                          </div>

                          {form.formState.errors.sizes && (
                            <p className="text-sm text-red-400 mt-1">
                              {form.formState.errors.sizes.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                    <div className="group relative space-y-6 p-8 rounded-2xl border-none bg-linear-to-br from-card via-card/95 to-card/90 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-green-500/30 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-linear-to-br from-green-500/5 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative flex items-center gap-3 pb-3 border-b border-slate-700/50">
                      <div className="flex items-center justify-center size-8 rounded-xl bg-linear-to-br from-green-500/20 to-green-500/10 border border-green-500/20">
                        <div className="size-2.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50 animate-pulse" />
                      </div>
                      <h3 className="text-base font-bold tracking-wide text-foreground/90 uppercase">
                        Stock y Precios
                      </h3>
                    </div>

                    <div className="relative space-y-6">
                          {/* Stock Management */}
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
                                {(() => {
                                  const currentSizes = form.watch("sizes") || "";
                                  const selectedSizes = currentSizes.split(",").map(s => s.trim()).filter(Boolean);
                                  
                                  return selectedSizes.map((size) => (
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
                                  ));
                                })()}
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
                              <div className="grid grid-cols-2 gap-3 mt-4">
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
                                  className="h-10 px-4 text-sm font-semibold rounded-lg border-2 border-green-500/40 bg-linear-to-r from-green-500/20 to-green-400/10 text-green-300 hover:border-green-400/60 hover:from-green-500/30 hover:to-green-400/20 transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
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
                                  className="h-10 px-4 text-sm font-semibold rounded-lg border-2 border-red-500/40 bg-linear-to-r from-red-500/20 to-red-400/10 text-red-300 hover:border-red-400/60 hover:from-red-500/30 hover:to-red-400/20 transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Clear Stock
                                </button>
                              </div>
                              </div>
                            </div>
                          </div>

                      {/* Precios, Dimensiones y Color */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <FormPriceInput
                          control={form.control}
                          name="price"
                          label="Precio"
                          placeholder="e.g., 9999"
                        />

                        <FormTextInput
                          control={form.control}
                          name="weight_grams"
                          label="Peso (gramos)"
                          placeholder="e.g., 500"
                          type="number"
                        />
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-foreground">Código de Color</label>
                          <div className="relative">
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-linear-to-r from-slate-700/60 to-slate-600/40 border-2 border-slate-500/40 backdrop-blur-sm">
                              <div className="relative size-10">
                                <input
                                  type="color"
                                  value={form.watch("color_code") || "#000000"}
                                  onChange={(e) => {
                                    form.setValue("color_code", e.target.value);
                                  }}
                                  className="absolute inset-0 w-10 h-10 opacity-0 cursor-pointer z-10"
                                />
                                <div
                                  className="size-10 rounded-lg border-2 border-slate-400/50 shadow-md transition-all duration-200 hover:scale-110 hover:shadow-lg cursor-pointer"
                                  style={{
                                    backgroundColor: form.watch("color_code") || "#000000",
                                  }}
                                />
                              </div>
                              <input
                                type="text"
                                value={form.watch("color_code") || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value.match(/^#[0-9A-Fa-f]{0,6}$/)) {
                                    form.setValue("color_code", value);
                                  }
                                }}
                                placeholder="#000000"
                                className="flex-1 h-10 px-3 rounded-lg border-2 border-slate-600/50 bg-slate-800/50 text-slate-200 placeholder:text-slate-400 focus:border-green-400/60 focus:outline-none transition-colors text-sm font-mono"
                              />
                            </div>
                          </div>
                          {form.formState.errors.color_code && (
                            <p className="text-sm text-red-400 mt-1">
                              {form.formState.errors.color_code.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Nombre del Color */}
                      <div className="grid grid-cols-1 gap-6">
                        <FormTextInput
                          control={form.control}
                          name="color"
                          label="Nombre del Color"
                          placeholder="e.g., Navy Blue, Forest Green"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sección: Imágenes del Producto */}
                  <div className="group relative space-y-6 p-8 rounded-2xl border-none bg-linear-to-br from-card via-card/95 to-card/90 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-pink-500/30 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-linear-to-br from-pink-500/5 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative flex items-center gap-3 pb-3 ">
                      <div className="flex items-center justify-center size-8 rounded-xl bg-linear-to-br from-pink-500/20 to-pink-500/10 border border-pink-500/20">
                        <div className="size-2.5 rounded-full bg-pink-500 shadow-lg shadow-pink-500/50 animate-pulse" />
                      </div>
                      <h3 className="text-base font-bold tracking-wide text-foreground/90 uppercase">
                        Imágenes
                      </h3>
                    </div>

                    <div className="relative space-y-6">
                      {/* Images Management */}
                      <div className="space-y-4">
                        {(() => {
                          const currentSizes = form.watch("sizes") || "";
                          const currentColor = form.watch("color") || "Sin Color";
                          const sizesArray = currentSizes.split(",").map(s => s.trim()).filter(Boolean);
                          const hasVariants = sizesArray.length > 0;

                          if (!hasVariants) {
                            // No variants - show simple image upload
                            const generalKey = "general";
                            return (
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <label className="text-sm font-medium text-foreground">Imágenes del Producto</label>
                                  <span className="text-xs text-slate-400">Agrega múltiples imágenes</span>
                                </div>
                                
                                <div className="p-6 rounded-xl bg-slate-800/30 border-2 border-slate-600/30 space-y-4">
                                  {/* Upload Area */}
                                  <div className="relative">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      multiple
                                      id="general-images"
                                      className="hidden"
                                      onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        if (files.length === 0) return;

                                        const newImages = files.map((file, index) => ({
                                          file,
                                          preview: URL.createObjectURL(file),
                                          isPrimary: (variantImages[generalKey]?.length || 0) === 0 && index === 0
                                        }));

                                        setVariantImages(prev => ({
                                          ...prev,
                                          [generalKey]: [...(prev[generalKey] || []), ...newImages]
                                        }));
                                        
                                        e.target.value = "";
                                      }}
                                    />
                                    <label
                                      htmlFor="general-images"
                                      className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-600/50 rounded-xl cursor-pointer hover:border-pink-400/60 hover:bg-slate-800/50 transition-all duration-200"
                                    >
                                      <svg className="w-16 h-16 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      <span className="text-base font-semibold text-slate-300 mb-2">Agregar imágenes</span>
                                      <span className="text-sm text-slate-500">Click aquí o arrastra archivos</span>
                                      <span className="text-xs text-slate-600 mt-2">Puedes seleccionar múltiples imágenes</span>
                                    </label>
                                  </div>

                                  {/* Image Grid */}
                                  {variantImages[generalKey]?.length > 0 && (
                                    <div>
                                      <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm text-slate-400">
                                          {variantImages[generalKey].length} {variantImages[generalKey].length === 1 ? 'imagen' : 'imágenes'}
                                        </span>
                                      </div>
                                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {variantImages[generalKey].map((img, index) => (
                                          <div key={index} className="group relative aspect-square rounded-lg overflow-hidden border-2 border-slate-600/40 hover:border-pink-400/60 transition-all duration-200">
                                            <img
                                              src={img.preview}
                                              alt={`Imagen ${index + 1}`}
                                              className="w-full h-full object-cover"
                                            />
                                            
                                            {/* Image Controls Overlay */}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                                              {/* Primary Badge */}
                                              {img.isPrimary && (
                                                <div className="absolute top-2 left-2 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-xs font-bold text-black shadow-lg flex items-center gap-1.5">
                                                  <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                  </svg>
                                                  Principal
                                                </div>
                                              )}
                                              
                                              {/* Set as Primary Button */}
                                              {!img.isPrimary && (
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    setVariantImages(prev => ({
                                                      ...prev,
                                                      [generalKey]: prev[generalKey].map((image, i) => ({
                                                        ...image,
                                                        isPrimary: i === index
                                                      }))
                                                    }));
                                                  }}
                                                  className="px-3 py-1.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-xs font-semibold text-black transition-colors shadow-lg"
                                                >
                                                  Marcar Principal
                                                </button>
                                              )}
                                              
                                              {/* Delete Button */}
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  URL.revokeObjectURL(img.preview);
                                                  setVariantImages(prev => {
                                                    const updated = prev[generalKey].filter((_, i) => i !== index);
                                                    if (img.isPrimary && updated.length > 0) {
                                                      updated[0].isPrimary = true;
                                                    }
                                                    return {
                                                      ...prev,
                                                      [generalKey]: updated
                                                    };
                                                  });
                                                }}
                                                className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 text-xs font-semibold text-white transition-colors shadow-lg"
                                              >
                                                Eliminar
                                              </button>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {variantImages[generalKey]?.length === 0 && (
                                    <div className="text-center py-8 text-slate-500 text-sm">
                                      No hay imágenes agregadas
                                    </div>
                                  )}
                                </div>
                                
                                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
                                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                  </svg>
                                  <p className="text-sm text-blue-300">
                                    <strong className="font-semibold">Tip:</strong> La primera imagen que agregues será la imagen principal. Puedes cambiarla después.
                                  </p>
                                </div>
                              </div>
                            );
                          }

                          // Has variants - show variant-based image upload
                          return (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-foreground">Imágenes por Variante</label>
                                <span className="text-xs text-slate-400">Selecciona una variante para agregar imágenes</span>
                              </div>
                              
                              <div className="p-6 rounded-xl bg-slate-800/30 border-2 border-slate-600/30 space-y-4">
                                {/* Variant Tabs */}
                                <div className="flex flex-wrap gap-2">
                                  {sizesArray.map((size) => {
                                    const variantKey = getVariantKey(size, currentColor);
                                    const imageCount = variantImages[variantKey]?.length || 0;
                                    const isActive = activeVariantTab === variantKey;
                                    
                                    return (
                                      <button
                                        key={variantKey}
                                        type="button"
                                        onClick={() => setActiveVariantTab(isActive ? null : variantKey)}
                                        className={`
                                          relative px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200
                                          ${isActive 
                                            ? 'bg-gradient-to-r from-pink-500/30 to-purple-500/30 border-2 border-pink-400/60 text-pink-200 shadow-lg' 
                                            : 'bg-slate-700/50 border-2 border-slate-600/40 text-slate-300 hover:border-pink-400/40 hover:bg-slate-700/70'
                                          }
                                        `}
                                      >
                                        <span>{size} - {currentColor}</span>
                                        {imageCount > 0 && (
                                          <span className={`
                                            ml-2 px-1.5 py-0.5 rounded-full text-xs font-bold
                                            ${isActive ? 'bg-pink-500 text-white' : 'bg-blue-500 text-white'}
                                          `}>
                                            {imageCount}
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>

                                {/* Image Upload Section */}
                                {activeVariantTab && (
                                  <div className="space-y-4 animate-in fade-in-50 duration-300">
                                    <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-600/30">
                                      <p className="text-sm text-slate-300 mb-3">
                                        <strong>Variante seleccionada:</strong> {activeVariantTab.split('-')[0]} - {activeVariantTab.split('-')[1]}
                                      </p>
                                      
                                      {/* Upload Area */}
                                      <div className="relative">
                                        <input
                                          type="file"
                                          accept="image/*"
                                          multiple
                                          id={`variant-images-${activeVariantTab}`}
                                          className="hidden"
                                          onChange={(e) => {
                                            const files = Array.from(e.target.files || []);
                                            if (files.length === 0) return;

                                            const newImages = files.map((file, index) => ({
                                              file,
                                              preview: URL.createObjectURL(file),
                                              isPrimary: (variantImages[activeVariantTab]?.length || 0) === 0 && index === 0
                                            }));

                                            setVariantImages(prev => ({
                                              ...prev,
                                              [activeVariantTab]: [...(prev[activeVariantTab] || []), ...newImages]
                                            }));
                                            
                                            e.target.value = "";
                                          }}
                                        />
                                        <label
                                          htmlFor={`variant-images-${activeVariantTab}`}
                                          className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-600/50 rounded-xl cursor-pointer hover:border-pink-400/60 hover:bg-slate-800/50 transition-all duration-200"
                                        >
                                          <svg className="w-12 h-12 text-slate-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                          </svg>
                                          <span className="text-sm font-medium text-slate-300">Agregar imágenes</span>
                                          <span className="text-xs text-slate-500 mt-1">Click o arrastra archivos aquí</span>
                                        </label>
                                      </div>

                                      {/* Image Grid */}
                                      {variantImages[activeVariantTab]?.length > 0 && (
                                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                          {variantImages[activeVariantTab].map((img, index) => (
                                            <div key={index} className="group relative aspect-square rounded-lg overflow-hidden border-2 border-slate-600/40 hover:border-pink-400/60 transition-all duration-200">
                                              <img
                                                src={img.preview}
                                                alt={`Variant ${index + 1}`}
                                                className="w-full h-full object-cover"
                                              />
                                              
                                              {/* Image Controls Overlay */}
                                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                                                {/* Primary Badge */}
                                                {img.isPrimary && (
                                                  <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-yellow-500 text-xs font-bold text-black shadow-lg">
                                                    ⭐ Principal
                                                  </div>
                                                )}
                                                
                                                {/* Set as Primary Button */}
                                                {!img.isPrimary && (
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      setVariantImages(prev => ({
                                                        ...prev,
                                                        [activeVariantTab]: prev[activeVariantTab].map((image, i) => ({
                                                          ...image,
                                                          isPrimary: i === index
                                                        }))
                                                      }));
                                                    }}
                                                    className="px-3 py-1.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-xs font-semibold text-black transition-colors shadow-lg"
                                                  >
                                                    Marcar Principal
                                                  </button>
                                                )}
                                                
                                                {/* Delete Button */}
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    URL.revokeObjectURL(img.preview);
                                                    setVariantImages(prev => {
                                                      const updated = prev[activeVariantTab].filter((_, i) => i !== index);
                                                      if (img.isPrimary && updated.length > 0) {
                                                        updated[0].isPrimary = true;
                                                      }
                                                      return {
                                                        ...prev,
                                                        [activeVariantTab]: updated
                                                      };
                                                    });
                                                  }}
                                                  className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 text-xs font-semibold text-white transition-colors shadow-lg"
                                                >
                                                  Eliminar
                                                </button>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {!activeVariantTab && (
                                  <div className="p-8 text-center">
                                    <svg className="w-12 h-12 mx-auto mb-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                    </svg>
                                    <p className="text-sm text-slate-400">Selecciona una variante para agregar imágenes</p>
                                  </div>
                                )}
                              </div>
                              
                              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
                                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-blue-300">
                                  <strong className="font-semibold">Tip:</strong> Cada variante puede tener múltiples imágenes. La primera será la principal.
                                </p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Sección: Stock y Precios */}
                

                  {/* Sección: Categorización */}
                  <div className="group relative space-y-6 p-8 rounded-2xl border-none bg-linear-to-br from-card via-card/95 to-card/90 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-purple-500/30 hover:-translate-y-1">
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

                      <FormSubcategoryByCategory
                        control={form.control}
                        name="subcategory"
                        label="Subcategoría"
                        container={container || undefined}
                        categoryId={selectedCategoryId}
                        onSubcategoryChange={(subcategoryId) => {
                          console.log("Subcategory selected:", subcategoryId);
                        }}
                      />
                    </div>

                    {/* Category selection helper */}
                    {!selectedCategoryId && (
                      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-blue-300">
                          <strong className="font-semibold">Tip:</strong> Selecciona primero una categoría para filtrar las subcategorías relacionadas
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
  
              {/* Footer premium con animación */}
              <div className="px-8 py-5 border-t-2 border-indigo-400/40 bg-linear-to-t from-slate-950/95 via-slate-900/90 to-slate-800/85 backdrop-blur-2xl shadow-2xl shadow-indigo-500/20">
                <div className="max-w-5xl mx-auto">
                  <FormSubmitButton
                    isPending={isPending}
                    className="w-full h-14 text-base font-bold tracking-wide bg-linear-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary hover:to-primary/90 shadow-xl hover:shadow-2xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] rounded-xl border border-primary/20"
                  >
                    {isPending ? (
                      <span className="flex items-center justify-center gap-3">
                        <div className="size-5 border-3 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        <span className="animate-pulse">Procesando tu solicitud...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        {submitButtonText}
                        <svg
                          className="size-5 transition-transform group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </span>
                    )}
                  </FormSubmitButton>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
