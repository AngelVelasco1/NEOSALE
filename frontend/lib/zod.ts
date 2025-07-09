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
    .min(7, 'El número de teléfono debe tener al menos 7 dígitos')
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
    .optional()
,   
  phoneNumber: z.string().optional(),
  identification: z.string().optional(),
  role: z.enum(['user', 'admin']).optional(),
  address: z.string({
    required_error: "Por favor, selecciona una dirección.",
  }),
})