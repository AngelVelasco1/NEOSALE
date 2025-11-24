import * as z from "zod";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Category name is required" })
    .max(100, "Category name must be 100 characters or less"),
  description: z
    .string()
    .min(1, { message: "Category description is required" })
    .max(1000, "Category description must be 1000 characters or less"),
});

export const categoryBulkFormSchema = z.object({
  published: z.coerce.boolean(),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
export type CategoryBulkFormData = z.infer<typeof categoryBulkFormSchema>;
