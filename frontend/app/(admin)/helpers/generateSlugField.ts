import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";

type SlugifyOptions<T> = {
  sourceField: Path<T>;
  targetField: Path<T>;
};

// ...existing code...
function nativeSlugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD") // Quita acentos
    .replace(/[\u0300-\u036f]/g, "") // Elimina diacríticos
    .replace(/[^a-z0-9\s-]/g, "") // Elimina caracteres no alfanuméricos
    .trim()
    .replace(/\s+/g, "-") // Reemplaza espacios por guiones
    .replace(/-+/g, "-"); // Evita guiones dobles
}

export function generateSlugField<T extends FieldValues>(
  form: UseFormReturn<T>,
  options: SlugifyOptions<T>
) {
  const { sourceField, targetField } = options;

  const sourceValue = form.getValues(sourceField);

  if (sourceValue && typeof sourceValue === "string") {
    const generatedSlug = nativeSlugify(sourceValue) as PathValue<T, Path<T>>;

    form.setValue(targetField, generatedSlug, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }
}
