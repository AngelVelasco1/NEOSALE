"use client";

import React, { useState, useTransition, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQueryClient, useQuery } from "@tanstack/react-query";

import { getSubcategoriesDropdown } from "@/app/(admin)/actions/categories/getCategories";

type Subcategory = {
  id: number;
  name: string;
};

import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";


import {
  FormTextInput,
  FormTextarea,
} from "@/app/(admin)/components/shared/form";
import { FormSubmitButton } from "@/app/(admin)/components/shared/form/FormSubmitButton";

import { categoryFormSchema, CategoryFormData } from "./schema";

type ExtendedCategoryFormData = CategoryFormData & {
  subcategories?: string;
};
import { objectToFormData } from "@/app/(admin)/helpers/objectToFormData";
import { CategoryServerActionResponse } from "@/app/(admin)/types/server-action";

type BaseCategoryFormProps = {
  title: string;
  submitButtonText: string;
  actionVerb: string;
  children: React.ReactNode;
  action: (formData: FormData) => Promise<CategoryServerActionResponse>;
};

type AddCategoryFormProps = BaseCategoryFormProps & {
  initialData?: never;
  previewImage?: never;
};

type EditCategoryFormProps = BaseCategoryFormProps & {
  initialData: Partial<CategoryFormData>;
  previewImage?: never;
};

type CategoryFormProps = AddCategoryFormProps | EditCategoryFormProps;

export default function CategoryFormSheet({
  title,
  submitButtonText,
  actionVerb,
  initialData,
  children,
  action,
}: CategoryFormProps) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);

  // Fetch existing subcategories
  const {
    data: existingSubcategories = [],
    isLoading: isLoadingSubcategories,
  } = useQuery<Subcategory[]>({
    queryKey: ["subcategories", "dropdown"],
    queryFn: () => getSubcategoriesDropdown(),
    staleTime: 5 * 60 * 1000,
  });

  const form = useForm<ExtendedCategoryFormData>({
    resolver: zodResolver(categoryFormSchema.extend({
      subcategories: z.string().default(""),
    })),
    defaultValues: {
      name: "",
      description: "",
      subcategories: "",
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        subcategories: "",
      });
    }
  }, [form, initialData]);

  const onSubmit = (data: ExtendedCategoryFormData) => {
    // Add selected subcategories to form data
    const enhancedData = {
      ...data,
      subcategories: selectedSubcategories.join(","),
    };
    const formData = objectToFormData(enhancedData);

    startTransition(async () => {
      const result = await action(formData);

      if ("validationErrors" in result) {
        Object.keys(result.validationErrors).forEach((key) => {
          form.setError(key as keyof CategoryFormData, {
            message: result.validationErrors![key],
          });
        });

        form.setFocus(
          Object.keys(result.validationErrors)[0] as keyof CategoryFormData
        );
      } else if ("dbError" in result) {
        toast.error(result.dbError);
      } else {
        form.reset();
        setSelectedSubcategories([]);
        toast.success(
          `Category "${result.category.name}" ${actionVerb} successfully!`,
          { position: "top-center" }
        );
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        setIsSheetOpen(false);
      }
    });
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
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col h-[calc(100vh-7rem)]"
            >
              <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 py-4 bg-linear-to-b from-slate-950/50 via-slate-900/30 to-slate-800/20">
                <div className="space-y-4 max-w-5xl mx-auto">
                  {/* Sección: Información Básica */}
                  <div className="group relative space-y-4 p-7 rounded-2xl border-border/40 bg-linear-to-br from-card via-card/95 to-card/90 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-primary/30 hover:-translate-y-1 border-none">
                    <div className="relative flex items-center gap-3 pb-3">
                      <div className="flex items-center justify-center size-8 rounded-xl bg-linear-to-br from-blue-500/20 to-blue-500/10 border border-blue-500/20">
                        <div className="size-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 animate-pulse" />
                      </div>
                      <h3 className="text-base font-bold tracking-wide text-foreground/90 uppercase">
                        Información 
                      </h3>
                    </div>

                    <div className="relative space-y-4">
                      <FormTextInput
                        control={form.control}
                        name="name"
                        label="Nombre de Categoría"
                        placeholder="Añade un nombre descriptivo para la categoría"
                      />

                      <FormTextarea
                        control={form.control}
                        name="description"
                        label="Descripción"
                        placeholder="Añade una descripción detallada de la categoría"
                      />
                    </div>
                  </div>

                  {/* Sección: Subcategorías */}
                  <div className="group relative space-y-6 p-7 rounded-2xl border-none bg-linear-to-br from-card via-card/95 to-card/90 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-purple-500/30 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative flex items-center gap-3 pb-3">
                      <div className="flex items-center justify-center size-8 rounded-xl bg-linear-to-br from-purple-500/20 to-purple-500/10 border border-purple-500/20">
                        <div className="size-2.5 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50 animate-pulse" />
                      </div>
                      <h3 className="text-base font-bold tracking-wide text-foreground/90 uppercase">
                        Subcategorías
                      </h3>
                    </div>

                    <div className="relative space-y-6">
                      <p className="text-sm text-muted-foreground">
                        Selecciona subcategorías existentes o crea nuevas. Las nuevas se crearán automáticamente.
                      </p>

                      <div className="space-y-2">
                        <input
                          {...form.register("subcategories")}
                          type="hidden"
                          value={selectedSubcategories.join(",")}
                        />
                      </div>

                      {/* Existing subcategories as selectable chips */}
                      {!isLoadingSubcategories && existingSubcategories.length > 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
                            <span className="text-sm font-semibold text-slate-200">Subcategorías existentes</span>
                          </div>
                          <div className="relative p-4 rounded-xl bg-linear-to-br from-slate-800/60 via-slate-800/40 to-slate-900/40 border-2 border-slate-700/50 backdrop-blur-sm shadow-lg shadow-slate-900/20">
                            <div className="flex flex-wrap gap-2.5 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                              {existingSubcategories.map((subcategory) => {
                                const isSelected = selectedSubcategories.includes(subcategory.name);
                                return (
                                  <button
                                    key={subcategory.id}
                                    type="button"
                                    onClick={() => {
                                      if (isSelected) {
                                        setSelectedSubcategories(prev =>
                                          prev.filter(name => name !== subcategory.name)
                                        );
                                      } else {
                                        setSelectedSubcategories(prev => [...prev, subcategory.name]);
                                      }
                                    }}
                                    className={`
                                      group relative inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105 active:scale-95
                                      ${isSelected
                                        ? "bg-linear-to-r from-blue-600 to-blue-500 text-white border-2 border-blue-400/40 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
                                        : "bg-linear-to-r from-slate-700/80 to-slate-700/60 text-slate-300 border-2 border-slate-600/40 hover:border-slate-500/60 hover:from-slate-700 hover:to-slate-600/80 shadow-md hover:shadow-lg"
                                      }
                                    `}
                                  >
                                    <span className="relative z-10">{subcategory.name}</span>
                                    {isSelected && (
                                      <span className="relative z-10 flex items-center justify-center size-4 rounded-full bg-white/20 text-white text-xs font-bold">
                                        ✓
                                      </span>
                                    )}
                                    {!isSelected && (
                                      <span className="absolute inset-0 rounded-lg bg-linear-to-r from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

              
                      {/* Create new subcategory input */}
                      <div className="space-y-3">
                        <div className="text-sm font-medium text-foreground flex items-center gap-2">
                          <span className="size-2 rounded-full bg-green-500 shadow-sm"></span>
                          Crear nueva subcategoría:
                        </div>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            placeholder="Nombre de nueva subcategoría"
                            className="flex-1 h-12 px-4 rounded-xl border-2 border-slate-600/50 bg-slate-800/50 text-slate-200 placeholder:text-slate-400 focus:border-green-400/60 focus:outline-none transition-colors text-sm font-medium"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const input = e.target as HTMLInputElement;
                                const subcategoryName = input.value.trim();

                                if (subcategoryName && !selectedSubcategories.includes(subcategoryName)) {
                                  setSelectedSubcategories((prev: string[]) => [...prev, subcategoryName]);
                                  input.value = "";
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              const input = (e.target as HTMLButtonElement).previousElementSibling as HTMLInputElement;
                              const subcategoryName = input.value.trim();

                              if (subcategoryName && !selectedSubcategories.includes(subcategoryName)) {
                                setSelectedSubcategories((prev: string[]) => [...prev, subcategoryName]);
                                input.value = "";
                              }
                            }}
                            className="h-12 px-6 rounded-xl border-2 border-green-500/40 bg-linear-to-r from-green-500/20 to-emerald-500/10 text-green-300 font-semibold text-sm hover:border-green-400/60 hover:from-green-500/30 hover:to-emerald-500/20 transition-all duration-200"
                          >
                            Crear
                          </button>
                        </div>
                      </div>

                      {/* Loading state */}
                      {isLoadingSubcategories && (
                        <div className="flex items-center justify-center py-8">
                          <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-3 border-purple-500/30 border-t-purple-500"></div>
                            <span className="text-sm text-slate-300 font-medium">Cargando subcategorías...</span>
                          </div>
                        </div>
                      )}
                    </div>
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
