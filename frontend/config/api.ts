import axios from "axios";
import { FRONT_CONFIG } from "./credentials.js";
import { ErrorsHandler } from "@/app/errors/errorsHandler";

export const api = axios.create({
  baseURL: FRONT_CONFIG.api_origin,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  withCredentials: true, 
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (response.data?.success === false) {
      
      const error = {
        ...response.data,
        isHandledError: true,
      };
      throw error;
    }
    return response;
  },

  async (error) => {
    if (!error.response) {
      
      
      // Verificar tipos específicos de errores de red
      if (error.code === 'ECONNREFUSED') {
        const networkError = {
          success: false,
          message: 'El servidor no está disponible',
          code: 'SERVER_UNAVAILABLE',
          isHandledError: true
        };
        ErrorsHandler.handle(networkError);
        throw networkError;
      }
      
      if (error.code === 'ENOTFOUND') {
        const networkError = {
          success: false,
          message: 'No se pudo conectar al servidor',
          code: 'DNS_ERROR',
          isHandledError: true
        };
        ErrorsHandler.handle(networkError);
        throw networkError;
      }
      
      // Error de red genérico
      const networkError = {
        success: false,
        message: "Error de conexión con el servidor",
        code: "NETWORK_ERROR",
        isHandledError: true,
      };

      ErrorsHandler.handle(networkError);
      throw networkError;
    }

    // Error con respuesta del servidor
    const { response } = error;
    
    
    try {
      const errorData = response.data;

      if (errorData?.success === false && errorData?.message && errorData?.code) {
        
        
        // Marcar como manejado para evitar duplicados
        errorData.isHandledError = true;

        // Mostrar toast inmediatamente
        ErrorsHandler.handle(errorData);
        throw errorData;
      }
      
    } catch (parseError) {
      
    }

    // ✅ Error genérico si no se pudo parsear o no tiene formato correcto
    
    
    const genericError = {
      success: false,
      message: getErrorMessage(response.status),
      code: getErrorCode(response.status),
      isHandledError: true,
    };

    ErrorsHandler.handle(genericError);
    throw genericError;
  }
);

// Funciones helper para mapear status codes
function getErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return "Datos inválidos";
    case 401:
      return "No autorizado";
    case 403:
      return "Acceso denegado";
    case 404:
      return "Recurso no encontrado";
    case 409:
      return "Conflicto: Recurso ya existe";
    case 422:
      return "Datos no procesables";
    case 500:
      return "Error interno del servidor";
    case 502:
      return "Servidor no disponible";
    case 503:
      return "Servicio no disponible";
    default:
      return `Error del servidor (${status})`;
  }
}

function getErrorCode(status: number): string {
  switch (status) {
    case 400:
      return "VALIDATION_ERROR";
    case 401:
      return "UNAUTHORIZED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 409:
      return "DUPLICATE_ERROR";
    case 422:
      return "VALIDATION_ERROR";
    case 500:
      return "INTERNAL_ERROR";
    default:
      return "SERVER_ERROR";
  }
}
