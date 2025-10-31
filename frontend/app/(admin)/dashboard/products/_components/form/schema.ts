import * as z from "zod";

const MAX_FILE_SIZE_MB = 3;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024; // 3MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const fileSchema = z
  .instanceof(File, { message: "Product image is required" })
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    `File size must be less than ${MAX_FILE_SIZE_MB}MB`
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Only .jpg, .jpeg, .png and .webp formats are supported"
  );

export const productFormSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Product name is required" })
      .max(255, "Product name must be 255 characters or less"),
    description: z
      .string()
      .min(1, { message: "Product description is required" })
      .max(500, "Product description must be 500 characters or less"),
    image: z.union([fileSchema, z.string().url()]),
    sku: z
      .string()
      .min(1, { message: "SKU is required" })
      .max(100, "SKU must be 100 characters or less")
      .regex(/^[A-Z0-9-]+$/, {
        message: "SKU must be alphanumeric (uppercase) and can contain hyphens",
      }),
    category: z.string().min(1, { message: "Category is required" }),
    brand: z.string().min(1, { message: "Brand is required" }),
    costPrice: z.coerce
      .number({
        invalid_type_error: "Cost price must be a number",
      })
      .positive({ message: "Cost price must be greater than zero" })
      .finite(),
    salesPrice: z.coerce
      .number({
        invalid_type_error: "Sales price must be a number",
      })
      .positive({ message: "Sales price must be greater than zero" })
      .finite(),
    stock: z.coerce
      .number({
        invalid_type_error: "Stock must be a number",
      })
      .int({ message: "Stock must be a whole number" })
      .min(0, { message: "Stock cannot be negative" }),
    weightGrams: z.coerce
      .number({
        invalid_type_error: "Weight must be a number",
      })
      .int({ message: "Weight must be a whole number" })
      .positive({ message: "Weight must be greater than zero" }),
    sizes: z
      .string()
      .min(1, { message: "At least one size is required" })
      .max(255, "Sizes must be 255 characters or less"),
    color: z
      .string()
      .min(1, { message: "Color name is required" })
      .max(255, "Color name must be 255 characters or less"),
    colorCode: z
      .string()
      .min(1, { message: "Color code is required" })
      .regex(/^#[0-9A-Fa-f]{6}$/, {
        message: "Color code must be a valid hex color (e.g., #FF5733)",
      }),
  })
  .superRefine((data, ctx) => {
    if (data.salesPrice <= data.costPrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sales price must be greater than cost price",
        path: ["salesPrice"],
      });
    }
  });

export const productBulkFormSchema = z
  .object({
    published: z.coerce.boolean().optional(),
    category: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (typeof data.published === "undefined" && data.category === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one of the fields must be filled.",
        path: ["published"],
      });
    }
  });

export type ProductFormData = z.infer<typeof productFormSchema>;
export type ProductBulkFormData = z.infer<typeof productBulkFormSchema>;
