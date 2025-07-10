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
  emailVerified: z.boolean().optional(),
  password: z.string()
  .min(1, 'Contraseña es requerida')
  .min(8, 'La Contraseña debe ser minimo de 8 caracteres')
  .max(32, 'La contraseña no debe tener mas de 32 caracteres'),
  phoneNumber: z.string()
    .min(10, 'El número de teléfono debe tener al menos 10 dígitos')
    .max(10, 'El número de teléfono no debe pasar de 10 dígitos')
    .or(z.literal('')) 
    .optional(),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
;

export const updateUserSchema = z.object({
  id: z.number({
    required_error: "ID de usuario requerido",
  }),
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email(),
  emailVerified: z.boolean().optional(),
  password: z.string()
  .min(1, 'Contraseña es requerida')
  .min(8, 'La Contraseña debe ser minimo de 8 caracteres')
  .max(32, 'La contraseña no debe tener mas de 32 caracteres'),   
  phoneNumber: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === '') return true; 
      return val.length >= 10; 
    }, 'El número de teléfono debe tener al menos 10 dígitos')
    .refine((val) => {
      if (!val || val.trim() === '') return true; 
      return val.length <= 10; 
    }, 'El número de teléfono no debe pasar de 10 dígitos'),
   identification: z
    .string()
    .optional()
    .transform((val) => val && val.trim() !== "" ? val.trim() : undefined),
  address: z.string({
    required_error: "Por favor, selecciona una dirección.",
  }),
})