import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../errors/errorsClass";



interface ValidationError extends Error {
  name: "ValidationError";
  details?: unknown[];
}

interface NotFoundError extends Error {
  name: "NotFoundError";
}

interface DatabaseError extends Error {
  code?: string;
  constraint?: string;
  detail?: string;
  table?: string;
  column?: string;
}

type AppErrorTypes =
  | Prisma.PrismaClientKnownRequestError
  | Prisma.PrismaClientUnknownRequestError
  | Prisma.PrismaClientRustPanicError
  | Prisma.PrismaClientInitializationError
  | Prisma.PrismaClientValidationError
  | AppError
  | ValidationError
  | NotFoundError
  | DatabaseError
  | Error;

const isPrismaKnownError = (
  error: Error
): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Prisma.PrismaClientKnownRequestError;
};

const isPrismaValidationError = (
  error: Error
): error is Prisma.PrismaClientValidationError => {
  return error instanceof Prisma.PrismaClientValidationError;
};

const isAppError = (error: Error): error is AppError => {
  return error instanceof AppError;
};

const isValidationError = (error: Error): error is ValidationError => {
  return error.name === "ValidationError";
};

const isNotFoundError = (error: Error): error is NotFoundError => {
  return error.name === "NotFoundError";
};

export const errorsHandler = (
  error: AppErrorTypes,
  req: Request,
  res: Response,
): void => {
  console.error(` Error capturado en middleware:`, {
    name: error.name,
    message: error.message,
    code: "code" in error ? error.code : "N/A",
    stack: error.stack?.split("\n")[0], // Solo primera línea del stack
    isPrismaError: error instanceof Prisma.PrismaClientKnownRequestError,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Errores de Prisma
  if (isPrismaKnownError(error)) {
    console.log(`📝Prisma error - Code: ${error.code}`, error.meta);

    if (error.code === "P2001" || error.code === "P2010") {
      const target = error.meta?.target as string[] | undefined;
      const fieldName = target?.[0] || "campo";

      const friendlyName =
        fieldName.includes("email")
          ? "email"
          : fieldName.includes("phone")
          ? "teléfono"
          : fieldName;

      res.status(409).json({
        success: false,
        message: `Este ${friendlyName} ya está registrado`,
        code: "DUPLICATE_ERROR",
        details: { field: fieldName },
        timestamp: new Date().toISOString(),
      });
      return; 
    }

    if (error.code === "P2025") {
      res.status(404).json({
        success: false,
        message: "Recurso no encontrado",
        code: "NOT_FOUND",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: "Error en la base de datos",
      code: "DATABASE_ERROR",
      details: { prismaCode: error.code },
      timestamp: new Date().toISOString(),
    });
    return;
  }
  if (isPrismaValidationError(error)) {
     res.status(400).json({
      success: false,
      message: "Error de validación en los datos",
      code: "PRISMA_VALIDATION_ERROR",
      details: { message: error.message },
      timestamp: new Date().toISOString(),
    });
    return
  }

  // Errores personalizados de la aplicación
  if (isAppError(error)) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      code: error.code,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // ✅ Errores de validación
  if (isValidationError(error)) {
    res.status(400).json({
      success: false,
      message: error.message,
      code: "VALIDATION_ERROR",
      details: error.details || null,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // ✅ Errores de recurso no encontrado
  if (isNotFoundError(error)) {
    res.status(404).json({
      success: false,
      message: error.message,
      code: "NOT_FOUND",
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // ✅ Errores de autorización
  if (
    error.name === "UnauthorizedError" ||
    error.name === "JsonWebTokenError"
  ) {
    res.status(401).json({
      success: false,
      message: "Token de acceso inválido o expirado",
      code: "UNAUTHORIZED",
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (error.name === "TokenExpiredError") {
    res.status(401).json({
      success: false,
      message: "El token ha expirado",
      code: "TOKEN_EXPIRED",
      timestamp: new Date().toISOString(),
    });
    return;
  }

  //  Error genérico 
  console.error("Error no manejado específicamente:", {
    name: error.name,
    message: error.message,
    stack: error.stack,
  });

  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    code: "INTERNAL_ERROR",
    timestamp: new Date().toISOString(),
  });
};
