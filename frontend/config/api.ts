import axios from "axios";
import { FRONT_CONFIG } from "./credentials";
import { ErrorsHandler } from "@/app/errors/errorsHandler";

export const api = axios.create({
  baseURL: `http://${FRONT_CONFIG.host}:${FRONT_CONFIG.port}`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  withCredentials: true, 
});

// ✅ Interceptor de request para debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 Request: ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor que captura todas las respuestas
api.interceptors.response.use(
  // Función para respuestas exitosas (status 2xx)
  (response) => {
    console.log(`✅ Response: ${response.status}`, {
      url: response.config.url,
      data: response.data
    });

    // Verificar si el backend devolvió success: false con status 200
    if (response.data?.success === false) {
      console.log('⚠️ Backend devolvió success: false con status 200');
      const error = {
        ...response.data,
        isHandledError: true,
      };
      throw error;
    }
    return response;
  },

  // ✅ Función mejorada para respuestas con error (status 4xx, 5xx)
  async (error) => {
    console.error("❌ Error interceptado por Axios:", {
      message: error.message,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      } : 'No response',
      request: error.request ? 'Request made but no response' : 'No request',
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    });

    // ✅ Error de red/conexión (sin response)
    if (!error.response) {
      console.error('🌐 Network/Connection error detected');
      
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

      throw networkError;
    }

    // ✅ Error con respuesta del servidor
    const { response } = error;
    console.log(`🚨 Server responded with error: ${response.status}`);
    
    try {
      const errorData = response.data;
      console.log('📝 Datos del error del servidor:', {
        status: response.status,
        errorData: errorData,
        hasCorrectFormat: errorData?.success === false && errorData?.message && errorData?.code,
        rawData: JSON.stringify(errorData)
      });

      // Verificar si el backend devolvió el formato correcto
      if (errorData?.success === false && errorData?.message && errorData?.code) {
        console.log('✅ Error con formato correcto detectado:', {
          message: errorData.message,
          code: errorData.code
        });
        
        // Marcar como manejado para evitar duplicados
        errorData.isHandledError = true;

        // Mostrar toast inmediatamente
        ErrorsHandler.handle(errorData);
        throw errorData;
      }
      
    } catch (parseError) {
      console.error('❌ Could not parse error response:', parseError);
    }

    // ✅ Error genérico si no se pudo parsear o no tiene formato correcto
    console.log('⚠️ Error sin formato correcto, usando genérico para status:', response.status);
    
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
      return "Conflicto con datos existentes";
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
