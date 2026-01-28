"use client";

import { forwardRef, Ref, useState, useTransition } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Control, FieldValues, Path } from "react-hook-form";
import { Plus, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { fetchBrandsDropdown } from "@/app/(admin)/services/brands";
import { createBrand } from "@/app/(admin)/actions/brands/createBrand";
import FetchDropdownContainer from "@/app/(admin)/components/shared/FetchDropdownContainer";

type FormBrandInputProps<TFormData extends FieldValues> = {
  control: Control<TFormData>;
  name: Path<TFormData>;
  label: string;
  container?: HTMLDivElement;
};

const FormBrandInput = forwardRef(function FormBrandInputRender<
  TFormData extends FieldValues
>(
  { control, name, label, container }: FormBrandInputProps<TFormData>,
  ref: Ref<HTMLButtonElement>
) {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandDescription, setNewBrandDescription] = useState("");
  const [brandImage, setBrandImage] = useState<File | null>(null);
  const [brandImagePreview, setBrandImagePreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    data: brands,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["brands", "dropdown"],
    queryFn: () => fetchBrandsDropdown(),
    staleTime: 5 * 60 * 1000,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen no debe superar 5MB");
        return;
      }
      setBrandImage(file);
      setBrandImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setBrandImage(null);
    if (brandImagePreview) {
      URL.revokeObjectURL(brandImagePreview);
      setBrandImagePreview(null);
    }
  };

  const handleCreateBrand = async (field: any) => {
    if (!newBrandName.trim()) {
      toast.error("Ingresa un nombre para la marca");
      return;
    }

    startTransition(async () => {
      try {
        if (brandImage) {
          toast.info("Subiendo imagen...");
        }

        const result = await createBrand(
          newBrandName.trim(),
          newBrandDescription.trim() || undefined,
          brandImage || undefined
        );

        if (result.success) {
          toast.success(`Marca "${result.brand.name}" creada exitosamente`);
          
          // Invalidate and refetch brands
          await queryClient.invalidateQueries({ queryKey: ["brands", "dropdown"] });
          
          // Set the newly created brand as selected
          field.onChange(result.brand.id.toString());
          
          // Reset form
          setNewBrandName("");
          setNewBrandDescription("");
          handleRemoveImage();
          setIsCreating(false);
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        console.error("Error creating brand:", error);
        toast.error("Error al crear la marca");
      }
    });
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel className="text-md font-medium text-foreground/90">
            {label}
          </FormLabel>

          <div className="space-y-3">
            {!isCreating ? (
              <>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <FormControl className="px-4 mt-2 rounded-xl border-2 border-slate-500/30 text-slate-200 placeholder:text-slate-400/70 focus:ring-0 focus:ring-offset-0 shadow-sm transition-all duration-200">
                    <SelectTrigger ref={ref} className="md:basis-1/5 h-12">
                      <SelectValue placeholder="Selecciona una marca" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className="max-h-56 bg-slate-900/95" portalContainer={container}>
                    <FetchDropdownContainer
                      isLoading={isLoading}
                      isError={isError}
                      errorMessage="Failed to load brands"
                    >
                      {!isLoading &&
                        !isError &&
                        brands &&
                        brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id.toString()}>
                            {brand.name}
                          </SelectItem>
                        ))}
                    </FetchDropdownContainer>
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreating(true)}
                  className="w-full h-11 rounded-xl border-2 border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 text-purple-300 hover:border-purple-400/50 hover:from-purple-500/20 hover:to-fuchsia-500/20 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Crear nueva marca
                </Button>
              </>
            ) : (
              <div className="space-y-4 p-5 rounded-xl border-2 border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-slate-800/90">
                <div className="flex items-center gap-2 mb-2">
                  <Plus className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-semibold text-purple-300">Nueva Marca</span>
                </div>
                
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">Nombre *</label>
                  <Input
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    placeholder="Ej: Nike, Adidas, Samsung..."
                    className="h-10 rounded-lg border-2 border-slate-600/40 bg-slate-950/60 text-slate-200 placeholder:text-slate-500 focus:border-purple-400/60"
                    disabled={isPending}
                  />
                </div>

                {/* Description Input */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">Descripción (opcional)</label>
                  <Textarea
                    value={newBrandDescription}
                    onChange={(e) => setNewBrandDescription(e.target.value)}
                    placeholder="Breve descripción de la marca..."
                    className="min-h-[60px] rounded-lg border-2 border-slate-600/40 bg-slate-950/60 text-slate-200 placeholder:text-slate-500 focus:border-purple-400/60 resize-none"
                    disabled={isPending}
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">Logo/Imagen (opcional)</label>
                  
                  {brandImagePreview ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-purple-500/30 bg-slate-950/60">
                      <Image
                        src={brandImagePreview}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        disabled={isPending}
                        className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-red-600/90 hover:bg-red-500 flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-slate-600/40 bg-slate-950/40 hover:border-purple-400/60 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-slate-500 mb-2" />
                      <span className="text-xs text-slate-500">Click para subir imagen</span>
                      <span className="text-xs text-slate-600 mt-1">PNG, JPG (máx. 5MB)</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={isPending}
                      />
                    </label>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    onClick={() => handleCreateBrand(field)}
                    disabled={isPending || !newBrandName.trim()}
                    className="flex-1 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white hover:from-purple-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      "Crear"
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      setNewBrandName("");
                      setNewBrandDescription("");
                      handleRemoveImage();
                    }}
                    disabled={isPending}
                    className="h-10 px-4 rounded-lg border-2 border-slate-600/40 bg-slate-800/40 text-slate-300 hover:bg-slate-700/40"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}) as <TFormData extends FieldValues>(
  props: FormBrandInputProps<TFormData> & { ref?: Ref<HTMLButtonElement> }
) => React.ReactElement;

export default FormBrandInput;

  
