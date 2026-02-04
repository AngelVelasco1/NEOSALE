import rateLimit from "express-rate-limit";
import type { Request, Response } from "express";

/**
 * Rate Limiter General para todas las rutas API
 * - 100 requests por IP cada 15 minutos
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests
  message: {
    success: false,
    message: "Demasiadas solicitudes, intente más tarde",
    code: "RATE_LIMIT_EXCEEDED",
    retryAfter: "15m",
  },
  standardHeaders: true, // Retorna info en `RateLimit-*` headers
  legacyHeaders: false,
  skip: (req: Request) => {
    // No aplicar rate limit a health checks
    return req.path === "/" || req.path === "/health";
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: "Límite de solicitudes excedido",
      code: "RATE_LIMIT_EXCEEDED",
      retryAfter: "15 minutos",
    });
  },
});

/**
 * Rate Limiter Estricto para Autenticación
 * - 5 intentos por IP cada 15 minutos
 * - Se reinicia cuando el login es exitoso
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos
  message: {
    success: false,
    message: "Demasiados intentos de inicio de sesión, intente más tarde",
    code: "AUTH_RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // No contar intentos exitosos
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: "Demasiados intentos fallidos. Intente de nuevo en 15 minutos",
      code: "AUTH_RATE_LIMIT_EXCEEDED",
      retryAfter: "15 minutos",
    });
  },
});

/**
 * Rate Limiter Moderado para Operaciones de Escritura
 * - 30 requests por IP cada 15 minutos
 * Usado en: POST, PUT, DELETE, PATCH
 */
export const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 30, // máximo 30 requests
  message: {
    success: false,
    message: "Demasiadas solicitudes de escritura, intente más tarde",
    code: "WRITE_RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => {
    // Solo aplicar a métodos de escritura
    return !["POST", "PUT", "DELETE", "PATCH"].includes(req.method);
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: "Límite de escritura excedido",
      code: "WRITE_RATE_LIMIT_EXCEEDED",
      retryAfter: "15 minutos",
    });
  },
});

/**
 * Rate Limiter Muy Estricto para Password Recovery
 * - 3 intentos por IP cada 60 minutos
 * Previene ataques de fuerza bruta
 */
export const passwordRecoveryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutos
  max: 3, // máximo 3 intentos
  message: {
    success: false,
    message: "Demasiados intentos de recuperación de contraseña",
    code: "PASSWORD_RECOVERY_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: "Límite de recuperación excedido. Intente en 1 hora",
      code: "PASSWORD_RECOVERY_LIMIT_EXCEEDED",
      retryAfter: "1 hora",
    });
  },
});

/**
 * Rate Limiter para Upload de Archivos
 * - 20 uploads por IP cada 60 minutos
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutos
  max: 20, // máximo 20 uploads
  message: {
    success: false,
    message: "Límite de carga de archivos excedido",
    code: "UPLOAD_RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: "Límite de carga excedido. Intente en 1 hora",
      code: "UPLOAD_RATE_LIMIT_EXCEEDED",
      retryAfter: "1 hora",
    });
  },
});

/**
 * Rate Limiter para Búsquedas
 * - 60 búsquedas por IP cada 15 minutos
 */
export const searchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 60, // máximo 60 búsquedas
  message: {
    success: false,
    message: "Demasiadas búsquedas, intente más tarde",
    code: "SEARCH_RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => {
    // Solo aplicar a GET requests con parámetros de búsqueda
    return !req.query.search && !req.query.q;
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: "Límite de búsqueda excedido",
      code: "SEARCH_RATE_LIMIT_EXCEEDED",
      retryAfter: "15 minutos",
    });
  },
});

export default {
  apiLimiter,
  authLimiter,
  writeLimiter,
  passwordRecoveryLimiter,
  uploadLimiter,
  searchLimiter,
};
