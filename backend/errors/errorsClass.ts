export class AppError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Errores específicos que heredan de AppError
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso no encontrado') {
    super(message, 404, 'NOT_FOUND');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class DuplicateError extends AppError {
  constructor(message: string) {
    super(message, 409, 'DUPLICATE_ERROR');
    Object.setPrototypeOf(this, DuplicateError.prototype);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'No autorizado') {
    super(message, 401, 'UNAUTHORIZED');
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Acceso denegado') {
    super(message, 403, 'FORBIDDEN');
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

// Utilidad para manejar errores de Prisma
export const handlePrismaError = (error: any): AppError => {
  if (error.code === 'P2002') {
    const fields = (error.meta?.target as string[]) || [];
    const fieldName = fields[0] || 'campo';
    return new DuplicateError(
      `El ${fieldName} ya se encuentra registrado en el sistema`
    );
  }

  if (error.code === 'P2025') {
    return new NotFoundError('El registro no existe o ya fue eliminado');
  }

  if (error.code === 'P2003') {
    return new ConflictError('Violación de integridad referencial en la base de datos');
  }

  if (error.code === 'P2014') {
    return new ConflictError('No se puede eliminar este registro, está siendo usado en otra tabla');
  }

  if (error.code === 'P2027') {
    return new AppError('Error de conexión con la base de datos', 503, 'DATABASE_CONNECTION_ERROR');
  }

  return new AppError('Error en la base de datos', 500, 'DATABASE_ERROR');
};