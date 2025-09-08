import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: number;
      email: string;
      name: string;
      role: string;
    };
  }
}

// Creamos un objeto authMiddleware que contiene todas las funciones
export const authMiddleware = {
  // Middleware para verificar token
  verifyToken: async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Por ahora, un middleware básico que permite desarrollo
    // En producción, esto debe validar tokens reales de NextAuth
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }

    // TEMPORAL: Para desarrollo, permitir un token básico
    if (token === 'dev-token') {
      // Usuario de prueba para desarrollo
      req.user = {
        id: 1,
        email: 'test@test.com',
        name: 'Usuario de Prueba',
        role: 'user'
      };
      return next();
    }

    // TODO: Aquí integrar validación real con NextAuth
    // Por ejemplo:
    // const session = await getServerSession(req, res, authOptions);
    // if (!session) return res.status(401).json({ error: 'No autorizado' });
    
    // Buscar usuario por token (implementación temporal)
    const user = await prisma.user.findFirst({
      where: {
        // Aquí deberías buscar por session token real de NextAuth
        email: 'temp@example.com' // Temporal
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno de autenticación'
    });
  }
  },

  // Middleware para requerir rol de administrador
  isAdmin: (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Usuario no autenticado'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador.'
    });
  }

  next();
  },

  // Middleware opcional de autenticación (para rutas públicas con datos extra si está logueado)
  optional: async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token && token !== 'null' && token !== 'undefined') {
      // Intentar autenticar, pero no fallar si no es válido
      try {
        // Implementar validación opcional aquí
        const user = await prisma.user.findFirst({
          where: {
            active: true
            // Validación de token aquí
          },
          select: {
            id: true,
            email: true,
            name: true,
            role: true
          }
        });

        if (user) {
          req.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          };
        }
      } catch (error) {
        // Ignorar errores en autenticación opcional
        console.log('Optional auth failed:', error);
      }
    }

    next();
  } catch (error) {
    // En caso de error, continuar sin usuario
    next(error);
  }
  }
};

// También mantenemos las exportaciones individuales para compatibilidad con código existente
export const authenticateToken = authMiddleware.verifyToken;
export const requireAdmin = authMiddleware.isAdmin;
export const optionalAuth = authMiddleware.optional;
