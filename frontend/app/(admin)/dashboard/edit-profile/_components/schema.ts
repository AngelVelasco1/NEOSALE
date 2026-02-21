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
  .instanceof(File)
  .refine(
    (file) => file.size === 0 || file.size <= MAX_FILE_SIZE,
    `File size must be less than ${MAX_FILE_SIZE_MB}MB`
  )
  .refine(
    (file) => file.size === 0 || ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Only .jpg, .jpeg, .png and .webp formats are supported"
  )
  .optional();

export const profileFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Your name is required" })
    .max(100, "Your name must be 100 characters or less")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/, {
      message: "Name can only contain letters, spaces, hyphens and apostrophes",
    }),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{7,14}$/, {
      message:
        "Invalid phone number format. Must be 8-15 digits, optionally starting with +",
    })
    .optional()
    .or(z.literal("")),
  image: z.union([
    fileSchema,
    z.string().url().optional(),
    z.literal(""),
  ]),
  currentPassword: z.string().optional().or(z.literal("")),
  newPassword: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || val.length >= 8,
      { message: "Password must be at least 8 characters" }
    )
    .refine(
      (val) => !val || /[A-Z]/.test(val),
      { message: "Password must contain at least one uppercase letter" }
    )
    .refine(
      (val) => !val || /[a-z]/.test(val),
      { message: "Password must contain at least one lowercase letter" }
    )
    .refine(
      (val) => !val || /[0-9]/.test(val),
      { message: "Password must contain at least one number" }
    )
    .refine(
      (val) => !val || /[^A-Za-z0-9]/.test(val),
      { message: "Password must contain at least one special character" }
    ),
  confirmPassword: z.string().optional().or(z.literal("")),
})
.refine(
  (data) => {
    // Si hay nueva contraseña, debe haber contraseña actual
    if (data.newPassword && !data.currentPassword) {
      return false;
    }
    return true;
  },
  {
    message: "Current password is required to set a new password",
    path: ["currentPassword"],
  }
)
.refine(
  (data) => {
    // Si hay nueva contraseña, debe coincidir con confirmación
    if (data.newPassword && data.newPassword !== data.confirmPassword) {
      return false;
    }
    return true;
  },
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);

export type ProfileFormData = z.infer<typeof profileFormSchema>;
