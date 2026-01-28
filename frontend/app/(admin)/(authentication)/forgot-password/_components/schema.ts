import * as z from "zod";

export const passwordResetFormSchema = z.object({
  email: z
    .string()
    .min(1, "Ingresa tu correo electrónico")
    .email("Proporciona un correo válido"),
});
