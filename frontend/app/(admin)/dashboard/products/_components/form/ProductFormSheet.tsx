"use client";

import { useRef, useState, useTransition, useEffect, ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldErrors } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";

import {
  FormTextInput,
  FormCategoryInput,
  FormBrandInput,
  FormPriceInput,
  FormTextarea,
} from "@/app/(admin)/components/shared/form";
import FormSubcategoryByCategory from "@/app/(admin)/components/shared/form/FormSubcategoryByCategory";
import { FormSubmitButton } from "@/app/(admin)/components/shared/form/FormSubmitButton";

import { productFormSchema, ProductFormData } from "./schema";
import { objectToFormData } from "@/app/(admin)/helpers/objectToFormData";
import { ProductServerActionResponse } from "@/app/(admin)/types/server-action";
import { ProductColors } from "./ProductColors";
import { ProductVariantsStock } from "./ProductVariantsStock";

// Tamaños disponibles para productos
const AVAILABLE_SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

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
  description,
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
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >(undefined);

  // Estado para manejar múltiples colores
  const [colors, setColors] = useState<Array<{ name: string; code: string }>>(
    []
  );
  const [activeColorTab, setActiveColorTab] = useState<string | null>(null);

  // Stock por variante (color + size)
  const [variantStock, setVariantStock] = useState<Record<string, number>>({});

  // Imágenes por color (cada color puede tener múltiples imágenes)
  const [colorImages, setColorImages] = useState<
    Record<string, Array<{ file: File; preview: string; isPrimary: boolean }>>
  >({});

  // Helper function to generate variant key
  const getVariantKey = (size: string, colorCode: string) =>
    `${size}-${colorCode}`;

  // Update variant stock
  const updateVariantStock = (
    size: string,
    colorCode: string,
    stock: number
  ) => {
    const key = getVariantKey(size, colorCode);
    setVariantStock((prev) => ({ ...prev, [key]: stock }));
  };

  // Get stock for a specific variant
  const getVariantStock = (size: string, colorCode: string) => {
    const key = getVariantKey(size, colorCode);
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
    const totalStock = Object.values(variantStock).reduce(
      (sum, stock) => sum + stock,
      0
    );
    form.setValue("stock", totalStock);
  }, [variantStock, form]);

  // Watch sizes for ProductVariantsStock component
  const watchedSizes = form.watch("sizes") || "";

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
    console.log("[CLIENT] Form submitted, validating...");

    // Validar que haya al menos un color
    if (colors.length === 0) {
      toast.error("Debes agregar al menos un color");
      return;
    }

    // Validar que cada color tenga al menos una imagen
    for (const color of colors) {
      if (!colorImages[color.code] || colorImages[color.code].length === 0) {
        toast.error(`El color "${color.name}" debe tener al menos una imagen`);
        return;
      }
    }

    // Add variant stock data and images to the form data
    const enhancedData = {
      ...data,
      colors: JSON.stringify(colors),
      variantStock: JSON.stringify(variantStock),
      colorImages: JSON.stringify(
        Object.entries(colorImages).reduce(
          (acc, [colorCode, images]) => {
            acc[colorCode] = images.map((img) => ({
              isPrimary: img.isPrimary,
            }));
            return acc;
          },
          {} as Record<string, Array<{ isPrimary: boolean }>>
        )
      ),
    };
    const formData = objectToFormData(enhancedData);

    // Add image files for each color
    Object.entries(colorImages).forEach(([colorCode, images]) => {
      images.forEach((img, index) => {
        formData.append(`colorImage_${colorCode}_${index}`, img.file);
      });
    });

    startTransition(async () => {
      try {
        const result = await action(formData);

        console.log("[CLIENT] Server response:", result);

        if ("validationErrors" in result) {
          console.log(
            "[CLIENT] Validation errors from server:",
            result.validationErrors
          );
          Object.keys(result.validationErrors).forEach((key) => {
            form.setError(key as keyof ProductFormData, {
              message: result.validationErrors![key],
            });
          });

          form.setFocus(
            Object.keys(result.validationErrors)[0] as keyof ProductFormData
          );

          toast.error("Por favor corrige los errores en el formulario");
        } else if ("dbError" in result) {
          console.log("[CLIENT] Database error:", result.dbError);
          toast.error(result.dbError);
        } else {
          console.log("[CLIENT] Success! Product created:", result.product);
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
          setColors([]);
          setColorImages({});
          setActiveColorTab(null);
          setSelectedCategoryId(undefined);
          toast.success(
            `Product "${result.product.name}" ${actionVerb} successfully!`,
            { position: "top-center" }
          );
          queryClient.invalidateQueries({ queryKey: ["products"] });
          setIsSheetOpen(false);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Error al crear el producto. Por favor intenta de nuevo.");
      }
    });
  };

  const onInvalid = (errors: FieldErrors<ProductFormData>) => {
    // Mostrar toast con el primer error
    const firstErrorKey = Object.keys(errors)[0] as keyof ProductFormData;
    const firstError = errors[firstErrorKey];

    if (firstError?.message) {
      toast.error(firstError.message, {
        position: "top-center",
        duration: 4000,
      });
    }

    if (errors.image) {
      imageDropzoneRef.current?.focus();
    } else if (errors.category) {
      categoryRef.current?.focus();
    }
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      {children}

      <SheetContent className="w-full sm:max-w-[95vw] lg:max-w-[85vw] xl:max-w-[1000px] p-0 gap-0 overflow-hidden border-none bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="h-screen w-full flex flex-col relative"
        >
          {/* Background effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none" />

          {/* Header premium */}
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative px-10 py-8 backdrop-blur-2xl bg-linear-to-r from-slate-950/90 via-slate-900/70 to-slate-950/90 border-b border-slate-800/60 shadow-[0_30px_80px_rgba(2,6,23,0.6)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(147,51,234,0.12),transparent_60%)]" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-blue-400/40 to-transparent" />
            <div className="relative flex flex-col gap-6">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                <div className="space-y-2">
                  <SheetTitle className="text-3xl font-bold tracking-tight bg-linear-to-r from-slate-100 via-blue-100 to-slate-100 bg-clip-text text-transparent drop-shadow-sm">
                    {title}
                  </SheetTitle>
                  <p className="text-sm text-slate-400 max-w-2xl">
                    {description || "Gestiona cada detalle de tu catálogo con precisión profesional y una experiencia enfocada en el control total."}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">
                  <span className="hidden md:inline text-slate-600">•</span>
                  <span className="text-slate-400 tracking-[0.25em]">
                    Inventario inteligente
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/70 border border-slate-700/60 shadow-inner shadow-black/30">
                  <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
                  Auto validación activa
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/70 border border-slate-700/60 shadow-inner shadow-black/30">
                  <svg
                    className="w-3.5 h-3.5 text-blue-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 111.414-1.414l2.793 2.793 6.543-6.543a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Control de variantes y stock
                </div>
              </div>
            </div>
          </motion.header>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onInvalid)}
              className="flex flex-col h-[calc(100vh-7rem)]"
            >
              <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 py-6 relative">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-6 max-w-5xl mx-auto"
                  ref={setContainer}
                >
                  {/* Sección: Información del Producto */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                    className="group relative p-8 rounded-2xl bg-linear-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-slate-700/50 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden"
                  >
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-blue-500/5 transition-all duration-500 pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                      {/* Columna Izquierda: Información Básica */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                        className="space-y-5"
                      >
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-700/50">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="flex items-center justify-center size-10 rounded-xl bg-linear-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 shadow-lg shadow-blue-500/20"
                          >
                            <motion.div
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [1, 0.8, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                              className="size-3 rounded-full bg-linear-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/50"
                            />
                          </motion.div>
                          <h3 className="text-base font-bold tracking-wide bg-linear-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent uppercase">
                            Información Básica
                          </h3>
                        </div>

                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                          className="space-y-4"
                        >
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
                        </motion.div>
                      </motion.div>

                      {/* Columna Derecha: Tamaños */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                        className="space-y-5"
                      >
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-700/50">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            className="flex items-center justify-center size-10 rounded-xl bg-linear-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 shadow-lg shadow-orange-500/20"
                          >
                            <motion.div
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [1, 0.8, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.5,
                              }}
                              className="size-3 rounded-full bg-linear-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/50"
                            />
                          </motion.div>
                          <h3 className="text-base font-bold tracking-wide bg-linear-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent uppercase">
                            Tamaños
                          </h3>
                        </div>

                        <div className="space-y-4">
                          <AnimatePresence mode="wait">
                            {(() => {
                              const sizesArray = watchedSizes
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean);

                              if (sizesArray.length > 0) {
                                return (
                                  <motion.div
                                    key="selected-sizes"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-wrap gap-2 p-4 rounded-xl bg-linear-to-br from-slate-800/60 to-slate-900/40 border border-slate-700/50 backdrop-blur-sm"
                                  >
                                    <span className="text-xs font-semibold text-slate-400 mr-2">
                                      Seleccionados:
                                    </span>
                                    {sizesArray.map((size, index) => (
                                      <motion.button
                                        key={`${size}-${index}`}
                                        type="button"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        onClick={() => {
                                          const newSizes = sizesArray.filter(
                                            (s) => s !== size
                                          );
                                          form.setValue(
                                            "sizes",
                                            newSizes.join(", ")
                                          );
                                        }}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-linear-to-r from-orange-500/20 to-orange-600/20 text-orange-300 border border-orange-400/40 rounded-lg hover:from-orange-500/30 hover:to-orange-600/30 hover:border-orange-400/60 transition-all shadow-lg shadow-orange-500/10"
                                      >
                                        {size}
                                        <svg
                                          className="w-3.5 h-3.5"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                          />
                                        </svg>
                                      </motion.button>
                                    ))}
                                  </motion.div>
                                );
                              }
                              return null;
                            })()}
                          </AnimatePresence>

                          <div className="grid grid-cols-3 gap-2.5">
                            {AVAILABLE_SIZES.map((size, index) => {
                              const currentSizes = watchedSizes || "";
                              const sizesArray = currentSizes
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean);
                              const isSelected = sizesArray.includes(size);

                              return (
                                <motion.button
                                  key={size}
                                  type="button"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{
                                    duration: 0.3,
                                    delay: index * 0.03,
                                  }}
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => {
                                    const current =
                                      form.getValues("sizes") || "";
                                    const currentArray = current
                                      .split(",")
                                      .map((s) => s.trim())
                                      .filter(Boolean);

                                    if (isSelected) {
                                      const newSizes = currentArray.filter(
                                        (s) => s !== size
                                      );
                                      form.setValue(
                                        "sizes",
                                        newSizes.join(", ")
                                      );
                                    } else {
                                      const newSizes = [...currentArray, size];
                                      form.setValue(
                                        "sizes",
                                        newSizes.join(", ")
                                      );
                                    }
                                  }}
                                  className={`
                                    relative h-12 px-3 rounded-xl border-2 font-bold text-sm transition-all duration-300 overflow-hidden
                                    ${
                                      isSelected
                                        ? "border-orange-400/60 bg-linear-to-br from-orange-500/30 to-amber-500/20 text-orange-200 shadow-lg shadow-orange-500/25"
                                        : "border-slate-600/40 bg-linear-to-br from-slate-800/40 to-slate-700/20 text-slate-300 hover:border-orange-400/40 hover:from-orange-500/10 hover:to-amber-500/5"
                                    }
                                  `}
                                >
                                  <span className="relative z-10">{size}</span>
                                  {isSelected && (
                                    <motion.div
                                      layoutId="size-selected"
                                      className="absolute inset-0 bg-linear-to-br from-orange-500/20 to-amber-500/10 rounded-xl"
                                      transition={{
                                        type: "spring",
                                        bounce: 0.2,
                                        duration: 0.6,
                                      }}
                                    />
                                  )}
                                </motion.button>
                              );
                            })}
                          </div>

                          {/* Custom size input */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                            className="space-y-3"
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Tamaño personalizado (ej: 3XL, PRO)"
                                className="flex-1 h-12 px-4 rounded-xl border-2 border-slate-600/40 bg-linear-to-br from-slate-800/60 to-slate-900/40 text-slate-200 placeholder:text-slate-500 focus:border-orange-400/60 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 text-sm backdrop-blur-sm"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    const input = e.target as HTMLInputElement;
                                    const customSize = input.value
                                      .trim()
                                      .toUpperCase();

                                    if (customSize) {
                                      const current =
                                        form.getValues("sizes") || "";
                                      const currentArray = current
                                        .split(",")
                                        .map((s) => s.trim())
                                        .filter(Boolean);

                                      if (!currentArray.includes(customSize)) {
                                        const newSizes = [
                                          ...currentArray,
                                          customSize,
                                        ];
                                        form.setValue(
                                          "sizes",
                                          newSizes.join(", ")
                                        );
                                      }

                                      input.value = "";
                                    }
                                  }
                                }}
                              />
                              <motion.button
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  const button = e.currentTarget;
                                  const container = button.parentElement;
                                  const input = container?.querySelector(
                                    "input"
                                  ) as HTMLInputElement;
                                  const customSize = input?.value
                                    .trim()
                                    .toUpperCase();

                                  if (customSize) {
                                    const current =
                                      form.getValues("sizes") || "";
                                    const currentArray = current
                                      .split(",")
                                      .map((s) => s.trim())
                                      .filter(Boolean);

                                    if (!currentArray.includes(customSize)) {
                                      const newSizes = [
                                        ...currentArray,
                                        customSize,
                                      ];
                                      form.setValue(
                                        "sizes",
                                        newSizes.join(", ")
                                      );
                                    }

                                    input.value = "";
                                  }
                                }}
                                className="h-12 px-5 rounded-xl border-2 border-orange-500/40 bg-linear-to-r from-orange-500/20 to-amber-500/10 text-orange-300 font-bold text-sm hover:border-orange-400/60 hover:from-orange-500/30 hover:to-amber-500/20 transition-all duration-300 flex items-center justify-center shadow-lg shadow-orange-500/20"
                                aria-label="Agregar tamaño personalizado"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                              </motion.button>
                            </div>
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => form.setValue("sizes", "")}
                              className="w-full h-11 px-4 rounded-xl border-2 border-red-500/40 bg-linear-to-r from-red-500/20 to-red-400/10 text-red-300 font-bold text-sm hover:border-red-400/60 hover:from-red-500/30 hover:to-red-400/20 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
                              aria-label="Limpiar todos los tamaños"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Limpiar Todo
                            </motion.button>
                          </motion.div>

                          {form.formState.errors.sizes && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-sm text-red-400 mt-2 flex items-center gap-2"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {form.formState.errors.sizes.message}
                            </motion.p>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Sección: Colores del Producto */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                    className="group relative p-8 rounded-2xl bg-linear-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-slate-700/50 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 overflow-hidden"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-purple-500/0 via-pink-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:via-pink-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none" />

                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-3 pb-4 border-b border-slate-700/50">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          className="flex items-center justify-center size-10 rounded-xl bg-linear-to-br from-purple-500/20 to-pink-600/10 border border-purple-500/30 shadow-lg shadow-purple-500/20"
                        >
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [1, 0.8, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 1,
                            }}
                            className="size-3 rounded-full bg-linear-to-br from-purple-400 to-pink-600 shadow-lg shadow-purple-500/50"
                          />
                        </motion.div>
                        <h3 className="text-base font-bold tracking-wide bg-linear-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent uppercase">
                          Colores e Imágenes
                        </h3>
                      </div>

                      <div>
                        <ProductColors
                          colors={colors}
                          setColors={setColors}
                          colorImages={colorImages}
                          setColorImages={setColorImages}
                          activeColorTab={activeColorTab}
                          setActiveColorTab={setActiveColorTab}
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Sección: Stock por Variante */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                    className="group relative p-8 rounded-2xl bg-linear-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-slate-700/50 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 overflow-hidden"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-green-500/0 via-emerald-500/0 to-green-500/0 group-hover:from-green-500/5 group-hover:via-emerald-500/5 group-hover:to-green-500/5 transition-all duration-500 pointer-events-none" />

                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-3 pb-4 border-b border-slate-700/50">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: -10 }}
                          className="flex items-center justify-center size-10 rounded-xl bg-linear-to-br from-green-500/20 to-emerald-600/10 border border-green-500/30 shadow-lg shadow-green-500/20"
                        >
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [1, 0.8, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 1.5,
                            }}
                            className="size-3 rounded-full bg-linear-to-br from-green-400 to-emerald-600 shadow-lg shadow-green-500/50"
                          />
                        </motion.div>
                        <h3 className="text-base font-bold tracking-wide bg-linear-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent uppercase">
                          Stock por Variante
                        </h3>
                      </div>

                      <div>
                        <ProductVariantsStock
                          colors={colors}
                          sizes={watchedSizes}
                          variantStock={variantStock}
                          updateVariantStock={updateVariantStock}
                          getVariantStock={getVariantStock}
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Sección: Precios y Dimensiones */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                    className="group relative p-8 rounded-2xl bg-linear-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-slate-700/50 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-500/0 via-cyan-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-500 pointer-events-none" />

                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-3 pb-4 border-b border-slate-700/50">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="flex items-center justify-center size-10 rounded-xl bg-linear-to-br from-blue-500/20 to-cyan-600/10 border border-blue-500/30 shadow-lg shadow-blue-500/20"
                        >
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [1, 0.8, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 2,
                            }}
                            className="size-3 rounded-full bg-linear-to-br from-blue-400 to-cyan-600 shadow-lg shadow-blue-500/50"
                          />
                        </motion.div>
                        <h3 className="text-base font-bold tracking-wide bg-linear-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent uppercase">
                          Precios y Dimensiones
                        </h3>
                      </div>

                      <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.75 }}
                          >
                            <FormPriceInput
                              control={form.control}
                              name="price"
                              label="Precio"
                              placeholder="e.g., 9999"
                            />
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.75 }}
                          >
                            <FormTextInput
                              control={form.control}
                              name="weight_grams"
                              label="Peso (gramos)"
                              placeholder="e.g., 500"
                              type="number"
                            />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Sección: Categorización */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                    className="group relative p-8 rounded-2xl bg-linear-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-slate-700/50 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 overflow-hidden"
                  >
                    <div
                      className="absolute inset-x-0 rounded-2xl bg-linear-to-br from-purple-500/0 via-indigo-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:via-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none"
                      style={{ top: -12, bottom: -12 }}
                    />

                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-3 pb-4 border-b border-slate-700/50">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          className="flex items-center justify-center size-10 rounded-xl bg-linear-to-br from-purple-500/20 to-indigo-600/10 border border-purple-500/30 shadow-lg shadow-purple-500/20"
                        >
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [1, 0.8, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 2.5,
                            }}
                            className="size-3 rounded-full bg-linear-to-br from-purple-400 to-indigo-600 shadow-lg shadow-purple-500/50"
                          />
                        </motion.div>
                        <h3 className="text-base font-bold tracking-wide bg-linear-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent uppercase">
                          Categorización
                        </h3>
                      </div>

                      <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.85 }}
                          >
                            <FormCategoryInput
                              control={form.control}
                              name="category"
                              label="Categoría"
                              container={container || undefined}
                              ref={categoryRef}
                            />
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.9 }}
                          >
                            <FormSubcategoryByCategory
                              control={form.control}
                              name="subcategory"
                              label="Subcategoría"
                              container={container || undefined}
                              categoryId={selectedCategoryId}
                              onSubcategoryChange={() => {}}
                            />
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.95 }}
                          >
                            <FormBrandInput
                              control={form.control}
                              name="brand"
                              label="Marca"
                              container={container || undefined}
                            />
                          </motion.div>
                        </div>

                        {!selectedCategoryId && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 1 }}
                            className="relative p-4 rounded-xl bg-linear-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 backdrop-blur-sm"
                          >
                            <div className="flex items-start gap-3">
                              <svg
                                className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <p className="text-sm text-blue-300">
                                <strong className="font-semibold">Tip:</strong>{" "}
                                Selecciona primero una categoría para filtrar las
                                subcategorías relacionadas
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
            
                <motion.footer
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 }}
                  className="max-w-5xl mx-auto mt-10 relative z-10"
                >
                  <div className="relative flex flex-col md:flex-row md:items-center gap-6 rounded-2xl border border-slate-800/70 bg-linear-to-br from-slate-950/95 via-slate-900/85 to-slate-950/95 p-6 shadow-[0_45px_90px_rgba(2,6,23,0.65)] overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(59,130,246,0.12),transparent_45%)] pointer-events-none" />
                    <div className="absolute inset-0 bg-[linear-gradient(310deg,rgba(16,185,129,0.08),transparent_55%)] pointer-events-none" />
                    <div className="relative flex-1 space-y-2">
                      <p className="text-base font-semibold text-slate-100 flex items-center gap-2">
                        <span className="inline-flex items-center justify-center size-7 rounded-full bg-emerald-500/10 border border-emerald-400/40 text-emerald-200 shadow-inner shadow-emerald-500/20">
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 111.414-1.414l2.793 2.793 6.543-6.543a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                        Todo listo para publicar
                      </p>
                      <p className="text-sm text-slate-400">
                        Validamos imágenes, colores y stock por variante antes de confirmar el producto.
                      </p>
                    </div>

                    <div className="relative w-full md:w-auto">
                      <FormSubmitButton
                        isPending={isPending}
                        className="w-full md:w-auto px-8 h-12 text-sm font-semibold tracking-wide bg-linear-to-r from-black via-slate-950 to-slate-900 hover:via-slate-800 hover:to-slate-900 text-slate-100 shadow-[0_25px_55px_rgba(0,0,0,0.65)] rounded-xl border border-slate-800/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100/20 relative overflow-hidden group transition-all duration-500"
                      >
                        <motion.div
                          animate={{
                            backgroundPosition: ["0% 0%", "200% 0%"],
                          }}
                          transition={{
                            duration: 3.5,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent opacity-40"
                        />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_60%)] opacity-40" />
                        {isPending ? (
                          <span className="flex items-center justify-center gap-3 relative z-10">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="size-5 border-3 border-slate-200/30 border-t-white/80 rounded-full"
                            />
                            <motion.span
                              animate={{ opacity: [1, 0.5, 1] }}
                              transition={{ duration: 1.2, repeat: Infinity }}
                              className="text-slate-100"
                            >
                              Procesando tu solicitud...
                            </motion.span>
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2 relative z-10">
                            {submitButtonText}
                            <motion.svg
                              className="size-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              animate={{ x: [0, 6, 0] }}
                              transition={{ duration: 1.4, repeat: Infinity }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </motion.svg>
                          </span>
                        )}
                      </FormSubmitButton>
                    </div>
                  </div>
                </motion.footer>
              </div>

          
            </form>
          </Form>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
