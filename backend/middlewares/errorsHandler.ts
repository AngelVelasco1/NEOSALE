import { Request, Response } from "express";
import { Prisma } from "../prisma/generated/prisma/client.js";
import { AppError } from "../errors/errorsClass";

/* eslint-disable no-undef */
// process está disponible en Node.js

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
  // Prevenir exposición de información en headers
  res.removeHeader("X-Powered-By");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  
  // Solo loggear detalles completos en desarrollo
  if (process.env.NODE_ENV === "development") {
    console.error(`Error capturado en middleware:`, {
      name: error.name,
      message: error.message,
      code: "code" in error ? error.code : "N/A",
      stack: error.stack?.split("\n")[0], 
      isPrismaError: error instanceof Prisma.PrismaClientKnownRequestError,
      url: req.url,
      method: req.method,
    });
  } else {
    // En producción, solo loggear información básica sin exponer rutas
    console.error(`Error capturado:`, {
      type: error.name,
      code: "code" in error ? error.code : "N/A",
    });
  }

  // Errores de Prisma
  if (isPrismaKnownError(error)) {
  

    if (error.code === "P2001" || error.code === "P2010") {
      const target = error.meta?.target as string[] | undefined;
      const fieldName = target?.[0] || "campo";

      const friendlyName =
          fieldName.includes("email")
          ? "email"
          : fieldName.includes("phone")
          ? "teléfono"
          : fieldName.includes("identification")
          ? "Identificacion"
          : "campo"

      res.status(409).json({
        success: false,
        message: `Este ${friendlyName} ya está registrado`,
        code: "DUPLICATE_ERROR",
      });
      return; 
    }

    if (error.code === "P2025") {
      res.status(404).json({
        success: false,
        message: "Recurso no encontrado",
        code: "NOT_FOUND",
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: "Error en la base de datos",
      code: "DATABASE_ERROR",
    });
    return;
  }
  if (isPrismaValidationError(error)) {
     res.status(400).json({
      success: false,
      message: "Error de validación en los datos",
      code: "PRISMA_VALIDATION_ERROR",
    });
    return
  }

  // Errores personalizados de la aplicación
  if (isAppError(error)) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      code: error.code,
    });
    return;
  }

  // ✅ Errores de validación
  if (isValidationError(error)) {
    res.status(400).json({
      success: false,
      message: error.message,
      code: "VALIDATION_ERROR",
    });
    return;
  }

  // ✅ Errores de recurso no encontrado
  if (isNotFoundError(error)) {
    res.status(404).json({
      success: false,
      message: error.message,
      code: "NOT_FOUND",
    });
    return;
  }

  //  Errores de autorización
  if (
    error.name === "UnauthorizedError" ||
    error.name === "JsonWebTokenError"
  ) {
    res.status(401).json({
      success: false,
      message: "Token de acceso inválido o expirado",
      code: "UNAUTHORIZED",
    });
    return;
  }

  if (error.name === "TokenExpiredError") {
    res.status(401).json({
      success: false,
      message: "El token ha expirado",
      code: "TOKEN_EXPIRED",
    });
    return;
  }

  //  Error genérico 
  if (process.env.NODE_ENV === "development") {
    console.error("Error no manejado específicamente:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
  }

  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    code: "INTERNAL_ERROR",
  });
};
