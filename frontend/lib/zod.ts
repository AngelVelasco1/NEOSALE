import { z }  from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, 'Email es requerido').email('Email formato invalido'),
  password: z.string()
  .min(1, 'Contraseña es requerida')
  .min(8, 'La Contraseña debe ser minimo de 8 caracteres')
  .max(32, 'La contraseña no debe tener mas de 32 caracteres')
});


export const registerSchema = z.object({
  name: z.string().min(1, 'Email es requerido').email('Email formato invalido'),
  email: z.string().min(1, 'Email es requerido').email('Email formato invalido'),
  phoneNumber: z.string()
    .min(7, 'El número de teléfono debe tener al menos 7 dígitos')
    .or(z.literal('')) // Permite que el campo sea un string vacío ''
    .optional(),       // Permite que el campo no exista (undefined)
  password: z.string()
  .min(1, 'Contraseña es requerida')
  .min(8, 'La Contraseña debe ser minimo de 8 caracteres')
  .max(32, 'La contraseña no debe tener mas de 32 caracteres')
});