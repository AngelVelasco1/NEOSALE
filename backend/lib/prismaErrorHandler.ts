/**
 * Utilidad centralizada para manejar errores de Prisma
 * Convierte errores de Prisma en AppErrors específicos
 */

import { 
  DuplicateError, 
  NotFoundError, 
  ConflictError, 
  AppError 
} from "../errors/errorsClass.js";

export const handlePrismaErrorHelper = (error: any): AppError => {
  // P2002: Constraint violado (unique, primary key)
  if (error.code === "P2002") {
    const fields = (error.meta?.target as string[]) || [];
    const fieldName = fields[0] || "campo";
    return new DuplicateError(
      `El ${fieldName} ya se encuentra registrado en el sistema`
    );
  }

  // P2025: Registro no encontrado
  if (error.code === "P2025") {
    return new NotFoundError("El registro no existe o ya fue eliminado");
  }

  // P2003: Violación de integridad referencial (foreign key)
  if (error.code === "P2003") {
    return new ConflictError(
      "No se puede completar la operación, hay registros relacionados"
    );
  }

  // P2014: No se puede eliminar por relaciones explícitas
  if (error.code === "P2014") {
    return new ConflictError(
      "No se puede eliminar este registro, está siendo usado en otra tabla"
    );
  }

  // P2027: Error de conexión
  if (error.code === "P2027") {
    return new AppError("Error de conexión con la base de datos", 503, "DATABASE_CONNECTION_ERROR");
  }

  // Error genérico de BD
  return new AppError("Error en la base de datos", 500, "DATABASE_ERROR");
};
