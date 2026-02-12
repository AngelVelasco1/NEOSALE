/**
 * Utilidades de seguridad para validar y sanitizar inputs
 * Previene SQL Injection, XSS y otros ataques comunes
 */

// Patrones maliciosos comunes
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT|JAVASCRIPT|ONERROR|ONLOAD)\b)/i,
  /(--|;|\/\*|\*\/|xp_|sp_)/i,
  /(<script|<iframe|<object|<embed|javascript:|data:text\/html)/i,
  /(\bOR\b|\bAND\b).*[=<>]/i, // OR 1=1, AND 1=1, etc.
];

const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<iframe|<object|<embed/i,
  /javascript:/i,
  /on\w+\s*=/i, // onclick, onerror, onload, etc
  /data:text\/html/i,
];

const HTML_TAG_PATTERN = /<[^>]*>/g;
const SCRIPT_TAG_PATTERN = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

/**
 * Verifica si un string contiene patrones de SQL injection
 */
export const containsSQLInjection = (value: string): boolean => {
  if (!value || typeof value !== 'string') return false;
  
  return SQL_INJECTION_PATTERNS.some(pattern => pattern.test(value));
};

/**
 * Verifica si un string contiene patrones de XSS
 */
export const containsXSS = (value: string): boolean => {
  if (!value || typeof value !== 'string') return false;
  
  return XSS_PATTERNS.some(pattern => pattern.test(value));
};

/**
 * Verifica si un string es seguro (no contiene patrones maliciosos)
 */
export const isSafeString = (value: string): boolean => {
  if (!value || typeof value !== 'string') return true;
  
  return !containsSQLInjection(value) && !containsXSS(value);
};

/**
 * Sanitiza un string removiendo tags HTML y scripts
 */
export const sanitizeHTML = (value: string): string => {
  if (!value || typeof value !== 'string') return value;
  
  // Remover scripts primero
  let sanitized = value.replace(SCRIPT_TAG_PATTERN, '');
  
  // Remover todos los tags HTML
  sanitized = sanitized.replace(HTML_TAG_PATTERN, '');
  
  // Decodificar entidades HTML comunes
  sanitized = sanitized
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&');
  
  return sanitized.trim();
};

/**
 * Valida que un nombre sea seguro (solo letras, espacios, guiones y apóstrofes)
 */
export const isValidName = (name: string): boolean => {
  if (!name || typeof name !== 'string') return false;
  
  const trimmedName = name.trim();
  
  // Verificar longitud
  if (trimmedName.length < 2 || trimmedName.length > 100) return false;
  
  // Verificar que solo contenga caracteres permitidos
  const namePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
  if (!namePattern.test(trimmedName)) return false;
  
  // Verificar que no contenga patrones maliciosos
  return isSafeString(trimmedName);
};

/**
 * Valida que un email sea seguro
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  
  const trimmedEmail = email.trim();
  
  // Verificar longitud
  if (trimmedEmail.length > 255) return false;
  
  // Verificar formato
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(trimmedEmail)) return false;
  
  // Verificar que no contenga patrones maliciosos
  return isSafeString(trimmedEmail);
};

/**
 * Valida que un teléfono sea seguro (solo números)
 */
export const isValidPhone = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') return true; // Optional field
  
  const trimmedPhone = phone.trim();
  if (trimmedPhone === '') return true; // Empty is valid (optional)
  
  // Solo números, 10 dígitos
  const phonePattern = /^[0-9]{10}$/;
  return phonePattern.test(trimmedPhone);
};

/**
 * Valida inputs de registro de usuario
 */
export const validateRegisterInput = (data: {
  name: string;
  email: string;
  password: string;
  phone_number?: string;
  identification?: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Validar nombre
  if (!isValidName(data.name)) {
    errors.push('Nombre inválido o contiene caracteres no permitidos');
  }
  
  // Validar email
  if (!isValidEmail(data.email)) {
    errors.push('Email inválido o contiene caracteres no permitidos');
  }
  
  // Validar teléfono (opcional)
  if (data.phone_number && !isValidPhone(data.phone_number)) {
    errors.push('Número de teléfono inválido');
  }
  
  // Validar identificación (opcional, solo números)
  if (data.identification) {
    const trimmedId = data.identification.trim();
    if (trimmedId && !/^[0-9]+$/.test(trimmedId)) {
      errors.push('La identificación solo puede contener números');
    }
  }
  
  // Validar contraseña
  if (!data.password || data.password.length < 8 || data.password.length > 32) {
    errors.push('La contraseña debe tener entre 8 y 32 caracteres');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Valida inputs de actualización de usuario
 */
export const validateUpdateUserInput = (data: {
  name?: string;
  email?: string;
  phone_number?: string;
  identification?: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Validar nombre si está presente
  if (data.name && !isValidName(data.name)) {
    errors.push('Nombre inválido o contiene caracteres no permitidos');
  }
  
  // Validar email si está presente
  if (data.email && !isValidEmail(data.email)) {
    errors.push('Email inválido o contiene caracteres no permitidos');
  }
  
  // Validar teléfono si está presente
  if (data.phone_number && !isValidPhone(data.phone_number)) {
    errors.push('Número de teléfono inválido');
  }
  
  // Validar identificación si está presente
  if (data.identification) {
    const trimmedId = data.identification.trim();
    if (trimmedId && !/^[0-9]+$/.test(trimmedId)) {
      errors.push('La identificación solo puede contener números');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};
