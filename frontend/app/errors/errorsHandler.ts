import { toast } from "sonner";

export interface ApiError {
  success: false;
  message: string;
  code: string;
  isHandleError?: boolean;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

export class ErrorsHandler {
  static async handle(error: unknown): Promise<void> {

    if (this.isHandledError(error)) {
      this.showError(error.message, error.code);
      return;
    }

    if (this.isApiError(error)) {
      this.showError(error.message, error.code);
      return;
    }

    if (error instanceof Error) {
      this.showError(error.message, "CLIENT_ERROR");
      return;
    }

    this.showError("Ha ocurrido un error inesperado", "UNKNOWN_ERROR");
  }

  private static isHandledError(error: unknown): error is ApiError {
    return (
      typeof error === "object" &&
      error !== null &&
      "isHandledError" in error &&
      (error as unknown as ApiError).isHandleError === true &&
      "message" in error &&
      "code" in error
    );
  }

  private static isApiError(error: unknown): error is ApiError {
    return (
      typeof error === "object" &&
      error !== null &&
      "success" in error &&
      "message" in error &&
      "code" in error &&
      (error as ApiError).success === false
    );
  }

  /* Toasts */

  // Error Toast
  static showError(message: string, code: string): void {
    const config = this.getErrorConfig(code);
    toast.error(message, {
      description: config.description,
      duration: config.duration,
      action: config.action
        ? {
            label: config.action.label,
            onClick: config.action.onClick,
          }
        : undefined,
    });
  }

  // Success Toast
  static showSuccess(message: string, description?: string): void {
    toast.success(message, {
      description,
      duration: 3000,
    });
  }

  // Info Toast
  static showInfo(message: string, description?: string): void {
    toast.info(message, {
      description,
      duration: 3000,
    });
  }

  // Configuracion personalizadas por error
  private static getErrorConfig(code: string) {
    const configs: Record<
      string,
      {
        description: string;
        duration: number;
        action?: { label: string; onClick: () => void };
      }
    > = {
      VALIDATION_ERROR: {
        description: "Verifica los datos ingresados",
        duration: 4000,
      },
      DUPLICATE_ERROR: {
        description: "Ya existe un registro con esos datos",
        duration: 4000,
      },
      NOT_FOUND: {
        description: "El recurso solicitado no existe",
        duration: 3000,
      },
      UNAUTHORIZED: {
        description: "Inicia sesión para continuar",
        duration: 5000,
        action: {
          label: "Iniciar sesión",
          onClick: () => (window.location.href = "/login"),
        },
      },
      FORBIDDEN: {
        description: "No tienes permisos para esta acción",
        duration: 4000,
      },
      INTERNAL_ERROR: {
        description: "Intenta nuevamente en unos momentos",
        duration: 6000,
      },
      NETWORK_ERROR: {
        description: "Verifica tu conexión a internet",
        duration: 5000,
        action: {
          label: "Reintentar",
          onClick: () => window.location.reload(),
        },
      },
      default: {
        description: "Error inesperado",
        duration: 4000,
      },
    };

    return configs[code] || configs.default;
  }
}
