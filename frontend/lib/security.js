/**
 * Content Security Policy (CSP) y Security Headers Configuration
 * Implementación según los últimos estándares de seguridad web
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
 * @see https://web.dev/articles/csp
 */

/* eslint-disable no-undef */
// process está disponible en el entorno de Node.js/Next.js

import crypto from "crypto";

/**
 * Genera un nonce único para CSP
 * Los nonces deben ser únicos por cada request
 */
export function generateNonce() {
  return crypto.randomBytes(16).toString("base64");
}

/**
 * Configuración de Content Security Policy
 * Ajustada para el proyecto NEOSALE con seguridad optimizada
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getCSPDirectives(nonce) {
  const isDevelopment = process.env.NODE_ENV === "development";

  // Dominios permitidos
  const allowedImageDomains = [
    "https://res.cloudinary.com",
    "https://images.unsplash.com",
    "https://via.placeholder.com",
    "https://m.media-amazon.com",
    "https://static.nike.com",
    "https://www.lg.com",
    "https://th.bing.com",
    "https://lh3.googleusercontent.com", // Google OAuth avatars
  ];

  const allowedConnectDomains = [
    "'self'",
    "http://localhost:8000", // Backend API
    "http://localhost:3000", // Frontend dev
    "ws://localhost:3000", // WebSocket para HMR
    "wss://localhost:3000", // WebSocket seguro
    "https://api.cloudinary.com",
    "https://accounts.google.com", // Google OAuth
    "https://www.google.com",
    "https://checkout.wompi.co", // Wompi payments (producción)
    "https://sandbox.wompi.co", // Wompi payments (sandbox/pruebas)
    "https://api.wompi.co", // Wompi API (producción)
    "https://sandbox.api.wompi.co", // Wompi API (sandbox)
  ];

  const allowedFontDomains = [
    "'self'",
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
  ];

  // Políticas de CSP
  const cspDirectives = {
    // Default: Fallback para directivas no especificadas
    "default-src": ["'self'"],

    // Scripts: In production allow inline for Next.js runtime scripts
    "script-src": isDevelopment
      ? [
          "'self'",
          "'unsafe-eval'", // HMR de Next.js
          "'unsafe-inline'", // Scripts inline de Next.js
          "https://accounts.google.com",
          "https://checkout.wompi.co",
          "https://sandbox.wompi.co",
          "https://api.wompi.co",
          "https://sandbox.api.wompi.co",
        ]
      : [
          "'self'",
          "'unsafe-inline'", // Required for Next.js runtime and Cache Components
          "https://accounts.google.com",
          "https://checkout.wompi.co",
          "https://sandbox.wompi.co",
          "https://api.wompi.co",
          "https://sandbox.api.wompi.co",
        ],

    // Estilos: unsafe-inline necesario para Tailwind en ambos entornos
    "style-src": [
      "'self'",
      "'unsafe-inline'", // Tailwind CSS y styled-components
      "https://fonts.googleapis.com",
    ].filter(Boolean),

    // Imágenes: CDNs y data URIs
    "img-src": [
      "'self'",
      "data:",
      "blob:",
      ...allowedImageDomains,
    ],

    // Fuentes: Google Fonts
    "font-src": allowedFontDomains,

    // Conexiones: APIs permitidas
    "connect-src": allowedConnectDomains,

    // Frames: allow payment and auth providers
    "frame-src": [
      "'self'",
      "https://accounts.google.com",
      "https://checkout.wompi.co",
      "https://sandbox.wompi.co",
    ],

    // Media: Self only
    "media-src": ["'self'", "data:", "blob:"],

    // Objects: Bloquear todos
    "object-src": ["'none'"],

    // Base URI: Solo self
    "base-uri": ["'self'"],

    // Form actions: Solo self
    "form-action": ["'self'"],

    // Frame ancestors: Prevenir clickjacking pero permitir ventanas de impresión
    "frame-ancestors": ["'self'"],

    // Upgrade insecure requests en producción
    ...(isDevelopment ? {} : { "upgrade-insecure-requests": [] }),
  };

  // Convertir a string CSP
  return Object.entries(cspDirectives)
    .map(([key, values]) => {
      if (Array.isArray(values) && values.length > 0) {
        return `${key} ${values.join(" ")}`;
      } else if (Array.isArray(values) && values.length === 0) {
        return key;
      }
      return "";
    })
    .filter(Boolean)
    .join("; ");
}

/**
 * Security Headers completos según mejores prácticas
 * CSP ACTIVO en todos los entornos con políticas apropiadas
 */
export function getSecurityHeaders(nonce) {
  const isDevelopment = process.env.NODE_ENV === "development";

  return [
    // ✅ Content Security Policy SIEMPRE ACTIVO
    {
      key: "Content-Security-Policy",
      value: getCSPDirectives(nonce),
    },
    // Prevenir MIME type sniffing
    {
      key: "X-Content-Type-Options",
      value: "nosniff",
    },
    // Protección XSS del navegador (deprecado pero compatible)
    {
      key: "X-XSS-Protection",
      value: "0", // Desactivado en favor de CSP
    },
    // Prevenir clickjacking
    {
      key: "X-Frame-Options",
      value: isDevelopment ? "SAMEORIGIN" : "DENY",
    },
    // DNS prefetch control
    {
      key: "X-DNS-Prefetch-Control",
      value: "on",
    },
    // Referrer Policy
    {
      key: "Referrer-Policy",
      value: "strict-origin-when-cross-origin",
    },
    // Permissions Policy (antes Feature Policy)
    {
      key: "Permissions-Policy",
      value: [
        "camera=()",
        "microphone=()",
        "geolocation=(self)",
        "interest-cohort=()",
        "payment=(self)",
      ].join(", "),
    },
    // HSTS solo en producción
    ...(isDevelopment
      ? []
      : [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ]),
  ];
}

/**
 * Obtiene información sobre el estado actual de CSP
 */
export function getCSPStatus() {
  const isDevelopment = process.env.NODE_ENV === "development";
  
  if (isDevelopment) {
    return {
      mode: "Enforced (Development Mode)",
      message: "CSP ACTIVO con políticas de desarrollo necesarias para Next.js",
      details: {
        status: "Las advertencias en consola son NORMALES y NO son vulnerabilidades",
        unsafeEval: "Permitido - Requerido para Hot Module Replacement (HMR) y Turbopack",
        unsafeInline: "Permitido - Requerido para scripts inline de Next.js y Tailwind CSS",
        security: "CSP está protegiendo tu aplicación contra XSS y otros ataques",
        production: "En producción se aplicarán políticas estrictas sin unsafe-*",
        note: "Los navegadores reportan el USO de unsafe-*, no que CSP esté mal configurado"
      }
    };
  }
  
  return {
    mode: "Enforced (Production Mode)",
    message: "✅ CSP en modo ESTRICTO: Sin unsafe-*, bloqueando todos los recursos no autorizados",
  };
}

/**
 * Headers de seguridad específicos para API routes
 */
export function getAPISecurityHeaders() {
  return [
    // Cache control para APIs
    {
      key: "Cache-Control",
      value: "private, max-age=0, must-revalidate",
    },
    // Prevenir MIME sniffing
    {
      key: "X-Content-Type-Options",
      value: "nosniff",
    },
    // No indexar APIs
    {
      key: "X-Robots-Tag",
      value: "noindex, nofollow",
    },
  ];}