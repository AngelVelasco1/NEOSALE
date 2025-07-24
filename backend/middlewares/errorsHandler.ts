import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../errors/errorsClass";

export const errorsHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`🔥 Error capturado en middleware:`, {
    name: error.name,
    message: error.message,
    code: error.code,
    stack: error.stack?.split("\n")[0], // Solo primera línea del stack
    isPrismaError: error instanceof Prisma.PrismaClientKnownRequestError,
    url: req.url,
    method: req.method,
  });

  // ✅ Verificar errores de Prisma PRIMERO
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.log(`📝 Prisma error detectado - Code: ${error.code}`, error.meta);

    if (error.code === "P2001" || error.code === "P2010") {
      const field = error.message;
      const fieldName = field.includes("Email")
        ? "email"
        : field.includes("Phone")
        ? "teléfono"
        : "campo";

      return res.status(409).json({
        success: false,
        message: `Este ${fieldName} ya está registrado`,
        code: "DUPLICATE_ERROR",
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Recurso no encontrado",
        code: "NOT_FOUND",
      });
    }

    // Otros errores de Prisma
    return res.status(400).json({
      success: false,
      message: "Error en la base de datos",
      code: "DATABASE_ERROR",
    });
  }

  // Errores personalizados
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      code: error.code,
    });
  }

  // Errores de validación de Zod u otros
  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: error.message,
      code: "VALIDATION_ERROR",
    });
  }

  // Rutas no encontradas
  if (error.name === "NotFoundError") {
    return res.status(404).json({
      success: false,
      message: error.message,
      code: "NOT_FOUND",
    });
  }

  // ✅ Error genérico (último recurso)
  console.error("❌ Error no manejado específicamente:", error);
  return res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    code: "INTERNAL_ERROR",
  });
};
