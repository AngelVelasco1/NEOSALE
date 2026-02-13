import { z } from "zod";

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
const strongPasswordMessage = "La contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial (@$!%*?&)";

// Patrones maliciosos para prevenir SQL injection y XSS
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT|JAVASCRIPT|ONERROR|ONLOAD)\b)/i,
  /(--|;|\/\*|\*\/|xp_|sp_)/i,
  /(<script|<iframe|<object|<embed|javascript:|data:text\/html)/i,
];

const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<iframe|<object|<embed/i,
  /javascript:/i,
  /on\w+\s*=/i, // onclick, onerror, etc
];

// Función para validar que no contenga patrones maliciosos
const isSafeString = (value: string): boolean => {
  if (!value) return true;
  
  // Verificar SQL injection
  for (const pattern of SQL_INJECTION_PATTERNS) {
    if (pattern.test(value)) {
      return false;
    }
  }
  
  // Verificar XSS
  for (const pattern of XSS_PATTERNS) {
    if (pattern.test(value)) {
      return false;
    }
  }
  
  return true;
};

// Validación personalizada para nombres seguros
const safeNameValidation = z.string()
  .trim()
  .min(1, 'El nombre es requerido')
  .min(2, 'El nombre debe tener al menos 2 caracteres')
  .max(100, 'El nombre no debe exceder 100 caracteres')
  .refine((val) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/.test(val), {
    message: 'El nombre solo puede contener letras, espacios, guiones y apóstrofes',
  })
  .refine(isSafeString, {
    message: 'El nombre contiene caracteres no permitidos',
  });


export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email es requerido')
    .email('Email formato invalido')
    .max(255, 'El email no debe exceder 255 caracteres')
    .refine(isSafeString, {
      message: 'El email contiene caracteres no permitidos',
    }),
  password: z.string()
    .min(1, 'Contraseña es requerida')
    .min(8, 'La Contraseña debe ser minimo de 8 caracteres')
    .max(32, 'La contraseña no debe tener mas de 32 caracteres')
});


export const registerSchema = z.object({
  name: safeNameValidation,
  email: z.string()
    .trim()
    .min(1, 'El Email es requerido')
    .email('Email con un formato invalido')
    .max(255, 'El email no debe exceder 255 caracteres')
    .refine(isSafeString, {
      message: 'El email contiene caracteres no permitidos',
    }),
  emailVerified: z.date().optional(),
  password: z.string()
    .min(1, 'Contraseña es requerida')
    .min(8, 'La Contraseña debe ser minimo de 8 caracteres')
    .max(32, 'La contraseña no debe tener mas de 32 caracteres')
    .regex(strongPasswordRegex, strongPasswordMessage),
  phone_number: z.string()
    .trim()
    .optional()
    .refine((val) => val === undefined || val === '' || /^[0-9]{10}$/.test(val),
      'Ingresa un número válido de 10 dígitos'),
  confirmPassword: z.string().min(1, 'Debes confirmar tu contraseña'),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar los términos y condiciones',
  }),
  acceptPrivacy: z.boolean().refine((val) => val === true, {
    message: 'Debes autorizar el tratamiento de datos personales',
  }),
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
    .regex(strongPasswordRegex, strongPasswordMessage),
  newPassword: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(32, 'La contraseña no debe tener más de 32 caracteres')
    .regex(strongPasswordRegex, strongPasswordMessage),
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