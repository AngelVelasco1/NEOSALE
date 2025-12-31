"use client";

import React, { forwardRef, Ref, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Control, FieldValues, Path } from "react-hook-form";

import {
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormControl,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/(admin)/components/ui/select";

import { fetchSubcategoriesByCategoryDropdown } from "@/app/(admin)/services/categories";
import FetchDropdownContainer from "@/app/(admin)/components/shared/FetchDropdownContainer";

type Subcategory = {
    id: number;
    name: string;
};

type FormSubcategoryByCategoryProps<TFormData extends FieldValues> = {
    control: Control<TFormData>;
    name: Path<TFormData>;
    label: string;
    container?: HTMLDivElement;
    categoryId?: number;
    onSubcategoryChange?: (subcategoryId: string | null) => void;
};

const FormSubcategoryByCategory = forwardRef(function FormSubcategoryByCategoryRender<
    TFormData extends FieldValues
>(
    {
        control,
        name,
        label,
        container,
        categoryId,
        onSubcategoryChange
    }: FormSubcategoryByCategoryProps<TFormData>,
    ref: Ref<HTMLButtonElement>
) {
    const [currentCategoryId, setCurrentCategoryId] = useState<number | undefined>(categoryId);

    // Update when categoryId prop changes
    useEffect(() => {
        setCurrentCategoryId(categoryId);
    }, [categoryId]);

    const {
        data: subcategories,
        isLoading,
        isError,
        refetch,
    } = useQuery<Subcategory[]>({
        queryKey: ["subcategories", "by-category", currentCategoryId],
        queryFn: () => fetchSubcategoriesByCategoryDropdown(currentCategoryId),
        staleTime: 5 * 60 * 1000,
        enabled: true, // Always enabled, will return all subcategories if no categoryId
    });

    // Refetch when category changes
    useEffect(() => {
        refetch();
    }, [currentCategoryId, refetch]);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="space-y-4">
                    <FormLabel className="text-md font-medium text-foreground/90">
                        {label}
                    </FormLabel>

                    <div className="space-y-2 h-12">
                        <Select
                            value={field.value}
                            onValueChange={(value) => {
                                field.onChange(value);
                                onSubcategoryChange?.(value === "all" ? null : value);
                            }}
                            disabled={isLoading}
                        >
                            <FormControl className="px-4 mt-2 rounded-xl border-2 border-slate-500/30 text-slate-200 placeholder:text-slate-400/70 focus:ring-0 focus:ring-offset-0 shadow-sm transition-all duration-200 ">
                                <SelectTrigger ref={ref} className="md:basis-1/5 h-12">
                                    <SelectValue
                                        placeholder={
                                            isLoading
                                                ? "Cargando..."
                                                : currentCategoryId
                                                    ? "Subcategorías de la categoría"
                                                    : "Todas las subcategorías"
                                        }
                                    />
                                </SelectTrigger>
                            </FormControl>

                            <SelectContent className="max-h-56 bg-slate-900/95" portalContainer={container}>
                                <FetchDropdownContainer
                                    isLoading={isLoading}
                                    isError={isError}
                                    errorMessage="Error al cargar subcategorías"
                                >
                                    <SelectItem key="all" value="all">
                                        {currentCategoryId ? "Todas de esta categoría" : "Todas las subcategorías"}
                                    </SelectItem>

                                    {!isLoading &&
                                        !isError &&
                                        subcategories &&
                                        subcategories.map((subcategory: Subcategory) => (
                                            <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                                                {subcategory.name}
                                            </SelectItem>
                                        ))}

                                    {!isLoading && !isError && subcategories && subcategories.length === 0 && (
                                        <SelectItem key="empty" value="" disabled>
                                            {currentCategoryId
                                                ? "Esta categoría no tiene subcategorías"
                                                : "No hay subcategorías disponibles"
                                            }
                                        </SelectItem>
                                    )}
                                </FetchDropdownContainer>
                            </SelectContent>
                        </Select>

                        <FormMessage />
                    </div>
                </FormItem>
            )}
        />
    );
}) as <TFormData extends FieldValues>(
    props: FormSubcategoryByCategoryProps<TFormData> & { ref?: Ref<HTMLButtonElement> }
) => React.ReactElement;

export default FormSubcategoryByCategory;