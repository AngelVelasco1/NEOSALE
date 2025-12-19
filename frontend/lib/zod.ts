import { z } from "zod";

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
  emailVerified: z.date().optional(),
  password: z.string()
    .min(1, 'Contraseña es requerida')
    .min(8, 'La Contraseña debe ser minimo de 8 caracteres')
    .max(32, 'La contraseña no debe tener mas de 32 caracteres'),
  phone_number: z.string()
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
  phone_number: z
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

export const updateUserPasswordSchema = z.object({
  id: z.number({
    required_error: "ID de usuario requerido",
  }),
  currentPassword: z.string()
    .min(1, 'Contraseña actual es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(32, 'La contraseña no debe tener más de 32 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'La contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial (@$!%*?&)'
    ),
  newPassword: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(32, 'La contraseña no debe tener más de 32 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'La contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial (@$!%*?&)'
    ),
  confirmPassword: z.string()
    .min(1, 'Confirmación de contraseña es requerida')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export const createAddressSchema = z.object({
  address: z.string()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(200, 'La dirección no debe exceder 200 caracteres'),
  country: z.string()
    .min(2, 'El país debe tener al menos 2 caracteres')
    .max(100, 'El país no debe exceder 100 caracteres'),
  city: z.string()
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(100, 'La ciudad no debe exceder 100 caracteres'),
  department: z.string()
    .min(2, 'El departamento debe tener al menos 2 caracteres')
    .max(100, 'El departamento no debe exceder 100 caracteres'),
  is_default: z.boolean().optional().default(false),
});

export const updateAddressSchema = z.object({
  address: z.string()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(200, 'La dirección no debe exceder 200 caracteres')
    .optional(),
  country: z.string()
    .min(2, 'El país debe tener al menos 2 caracteres')
    .max(100, 'El país no debe exceder 100 caracteres')
    .optional(),
  city: z.string()
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(100, 'La ciudad no debe exceder 100 caracteres')
    .optional(),
  department: z.string()
    .min(2, 'El departamento debe tener al menos 2 caracteres')
    .max(100, 'El departamento no debe exceder 100 caracteres')
    .optional(),
  is_default: z.boolean().optional(),
});