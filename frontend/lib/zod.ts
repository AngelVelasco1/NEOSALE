import { z }  from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, 'Email es requerido').email('Email formato invalido'),
  password: z.string()
  .min(1, 'Contraseña es requerida')
  .min(8, 'La Contraseña debe ser minimo de 8 caracteres')
  .max(32, 'La contraseña no debe tener mas de 32 caracteres')
});


export const registerSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().min(1, 'El Email es requerido').email('Email con un formato invalido'),
  phoneNumber: z.string()
    .min(7, 'El número de teléfono debe tener al menos 7 dígitos')
    .or(z.literal('')) 
    .optional(),   
  password: z.string()
  .min(1, 'Contraseña es requerida')
  .min(8, 'La Contraseña debe ser minimo de 8 caracteres')
  .max(32, 'La contraseña no debe tener mas de 32 caracteres'),
  confirmPassword: z.string(),
  emailVerified: z.boolean().optional(),
  identification: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
;