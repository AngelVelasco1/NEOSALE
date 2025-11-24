"use client";

import { forwardRef, Ref } from "react";
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
} from "@/components/ui/select";

import { fetchCategoriesDropdown } from "@/app/(admin)/services/categories";
import FetchDropdownContainer from "@/app/(admin)/components/shared/FetchDropdownContainer";

type FormCategoryInputProps<TFormData extends FieldValues> = {
  control: Control<TFormData>;
  name: Path<TFormData>;
  label: string;
  container?: HTMLDivElement;
};

const FormCategoryInput = forwardRef(function FormCategoryInputRender<
  TFormData extends FieldValues
>(
  { control, name, label, container }: FormCategoryInputProps<TFormData>,
  ref: Ref<HTMLButtonElement>
) {
  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories", "dropdown"],
    queryFn: () => fetchCategoriesDropdown(),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-4 ">
          <FormLabel className="text-md font-medium text-foreground/90 ">
            {label}
          </FormLabel>

          <div className="space-y-2 h-12">
            <Select

              value={field.value}
              onValueChange={(value) => field.onChange(value)}
            >
              <FormControl className="px-4 mt-2 rounded-xl border-2 border-slate-500/30 text-slate-200 placeholder:text-slate-400/70 focus:ring-0 focus:ring-offset-0 shadow-sm transition-all duration-200 ">
                <SelectTrigger ref={ref} className="md:basis-1/5 h-12">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
              </FormControl>

              <SelectContent className="max-h-56 bg-slate-900/95" portalContainer={container}>
                <FetchDropdownContainer
                  isLoading={isLoading}
                  isError={isError}
                  errorMessage="Failed to load categories"
                >


                  {!isLoading &&
                    !isError &&
                    categories &&
                    categories!.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
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
  props: FormCategoryInputProps<TFormData> & { ref?: Ref<HTMLButtonElement> }
) => React.ReactElement;

export default FormCategoryInput;
