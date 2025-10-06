import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtDecrypt } from "jose";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: number;
      email: string;
      name: string;
      role: string;
    };
  }
}

// Interfaz para el payload del JWT de NextAuth
interface NextAuthJwtPayload extends JwtPayload {
  sub?: string;
  email?: string;
  name?: string;
  role?: string;
}

// Función para extraer token de NextAuth desde cookies
const extractNextAuthToken = (req: Request): string | null => {
  // NextAuth v5 (AuthJS) usa estos nombres de cookies
  const sessionToken =
    req.cookies?.["authjs.session-token"] || // AuthJS v5
    req.cookies?.["next-auth.session-token"] || // NextAuth v4 (HTTP)
    req.cookies?.["__Secure-next-auth.session-token"] || // NextAuth v4 (HTTPS)
    req.cookies?.["__Secure-authjs.session-token"]; // AuthJS v5 (HTTPS)

  // También revisar el header Authorization como fallback
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader && authHeader.split(" ")[1];

  console.log("🍪 Cookies disponibles:", Object.keys(req.cookies || {}));
  console.log("🔑 Session token encontrado:", !!sessionToken);
  console.log("📝 Bearer token:", !!bearerToken);

  return sessionToken || bearerToken;
};

// Función simple para obtener la sesión desde las cookies de NextAuth v5
const getSessionFromCookies = async (req: Request) => {
  try {
    // Intentar obtener el token de sesión
    const sessionToken = extractNextAuthToken(req);
    if (!sessionToken) {
      return null;
    }

    console.log("� Obteniendo sesión desde cookies NextAuth v5...");

    // Método más simple: usar el secret raw para desencriptar
    const authSecret = process.env.AUTH_SECRET;
    if (!authSecret) {
      console.log("❌ AUTH_SECRET no configurado");
      return null;
    }

    try {
      // Intentar desencriptar JWE con el secret expandido a 64 bytes
      const rawSecret = Buffer.from(authSecret, "base64");
      console.log("🔑 Secret base64 decodificado:", rawSecret.length, "bytes");

      // A256CBC-HS512 necesita exactamente 64 bytes (512 bits)
      let encryptionKey: Uint8Array;

      if (rawSecret.length === 32) {
        // Si tenemos 32 bytes, duplicar para llegar a 64 bytes
        const expandedSecret = Buffer.concat([rawSecret, rawSecret]);
        encryptionKey = new Uint8Array(expandedSecret);
        console.log("🔑 Secret duplicado a", expandedSecret.length, "bytes");
      } else if (rawSecret.length >= 64) {
        // Si ya tenemos 64 o más bytes, usar los primeros 64
        encryptionKey = new Uint8Array(rawSecret.slice(0, 64));
        console.log("🔑 Secret truncado a 64 bytes");
      } else {
        // Si tenemos menos de 32 bytes, extender con padding
        const paddedSecret = Buffer.alloc(64);
        rawSecret.copy(paddedSecret);
        // Rellenar el resto repitiendo el secret
        for (let i = rawSecret.length; i < 64; i++) {
          paddedSecret[i] = rawSecret[i % rawSecret.length];
        }
        encryptionKey = new Uint8Array(paddedSecret);
        console.log("🔑 Secret extendido a", paddedSecret.length, "bytes");
      }

      const { payload } = await jwtDecrypt(sessionToken, encryptionKey);

      console.log("🎯 Sesión desencriptada exitosamente:", {
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
      });

      if (payload.sub) {
        const userId = parseInt(payload.sub as string);
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        });

        if (user) {
          console.log("✅ Usuario encontrado:", user.email);
          return {
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            },
          };
        }
      }
    } catch (jweError) {
      console.log("⚠️ Error desencriptando JWE:", (jweError as Error).message);
    }

    return null;
  } catch (error) {
    console.log("❌ Error obteniendo sesión:", error);
    return null;
  }
};

// Creamos un objeto authMiddleware que contiene todas las funciones
export const authMiddleware = {
  // Middleware para verificar token
  verifyToken: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("🔐 Iniciando verificación de autenticación...");

      // TEMPORAL: Para desarrollo, permitir un token básico
      const authHeader = req.headers["authorization"];
      const bearerToken = authHeader && authHeader.split(" ")[1];

      if (bearerToken === "dev-token") {
        console.log("🚀 Usando token de desarrollo");
        req.user = {
          id: 1,
          email: "test@test.com",
          name: "Usuario de Prueba",
          role: "user",
        };
        return next();
      }

      // NUEVO: Usar la función simplificada para obtener la sesión
      const session = await getSessionFromCookies(req);
      if (session && session.user) {
        console.log("✅ Sesión obtenida exitosamente:", session.user.email);
        req.user = session.user;
        return next();
      }

      console.log("❌ No se pudo obtener la sesión");
      res.status(401).json({
        success: false,
        message: "Token de acceso requerido. Por favor, inicia sesión.",
      });
    } catch (error) {
      console.error("❌ Error de autenticación:", error);
      res.status(500).json({
        success: false,
        message: "Error interno de autenticación",
      });
    }
  },

  // Middleware para requerir rol de administrador
  isAdmin: (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Acceso denegado. Se requieren permisos de administrador.",
      });
    }

    next();
  },

  // Middleware opcional de autenticación (para rutas públicas con datos extra si está logueado)
  optional: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = extractNextAuthToken(req);

      // También revisar si viene userId en el body (para casos donde el frontend lo envía directamente)
      const userIdFromBody = req.body?.userId;
      if (userIdFromBody && typeof userIdFromBody === "number") {
        try {
          const user = await prisma.user.findUnique({
            where: {
              id: userIdFromBody,
            },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
            },
          });

          if (user) {
            req.user = {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
            return next();
          }
        } catch (error) {
          console.log("Error validando usuario desde body:", error);
        }
      }

      if (token && token !== "null" && token !== "undefined") {
        // TEMPORAL: Para desarrollo
        if (token === "dev-token") {
          req.user = {
            id: 1,
            email: "test@test.com",
            name: "Usuario de Prueba",
            role: "user",
          };
          return next();
        }

        try {
          // Intentar con JWT primero
          const nextAuthSecret =
            process.env.NEXTAUTH_SECRET || "fallback-secret";
          const decoded = jwt.verify(
            token,
            nextAuthSecret
          ) as NextAuthJwtPayload;

          if (decoded && decoded.sub) {
            const user = await prisma.user.findUnique({
              where: {
                id: parseInt(decoded.sub),
              },
              select: {
                id: true,
                email: true,
                name: true,
                role: true,
              },
            });

            if (user) {
              req.user = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
              };
              return next();
            }
          }
        } catch {
          // Si JWT falla, continuar sin usuario (autenticación opcional)
          console.log("Error decodificando JWT, continuando sin usuario");
        }
      }

      // Continuar sin usuario autenticado (opcional auth)
      next();
    } catch (error) {
      // En caso de error, continuar sin usuario
      console.log("Error en autenticación opcional:", error);
      next();
    }
  },
};

export const authenticateToken = authMiddleware.verifyToken;
export const requireAdmin = authMiddleware.isAdmin;
export const optionalAuth = authMiddleware.optional;
