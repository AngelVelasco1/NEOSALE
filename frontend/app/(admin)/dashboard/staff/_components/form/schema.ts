import { z } from "zod";

export const staffFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must not exceed 100 characters" }),
  phone: z
    .string()
    .regex(/^[0-9\s\-\+\(\)]+$/, { message: "Invalid phone number format" })
    .optional()
    .or(z.literal("")),
  image: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      { message: "File size must not exceed 5MB" }
    )
    .refine(
      (file) => !file || file.type.startsWith("image/"),
      { message: "File must be an image" }
    ),
});

export type StaffFormData = z.infer<typeof staffFormSchema>;
