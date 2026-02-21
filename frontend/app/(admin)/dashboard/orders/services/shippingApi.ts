import { api } from "@/config/api";
import type {
  ShippingGuideResponse,
  TrackingInfoResponse,
  QuotationResponse,
} from "@/app/(customer)/orders/services/shippingApi";

/**
 * API de Shipping para Admin Dashboard
 */

/**
 * Obtener cotización de envío (Admin)
 */
export const getShippingQuoteAdmin = async (
  orderId: number
): Promise<QuotationResponse> => {
  try {
    const response = await api.get(`/api/shipping/quote/${orderId}`);
    return response.data;
  } catch (error: any) {
    
    return {
      success: false,
      message: error.response?.data?.message || "Error al obtener cotización",
    };
  }
};

/**
 * Crear guía de envío (Admin)
 */
export const createShippingGuideAdmin = async (
  orderId: number,
  idRate: number,
  requestPickup: boolean = false,
  insurance: boolean = true
): Promise<ShippingGuideResponse> => {
  try {
    const response = await api.post(`/api/shipping/create/${orderId}`, {
      idRate,
      requestPickup,
      insurance,
    });
    return response.data;
  } catch (error: any) {
    
    return {
      success: false,
      error: error.response?.data?.message || "Error al crear guía de envío",
    };
  }
};

/**
 * Actualizar tracking manualmente (Admin)
 */
export const updateTrackingAdmin = async (
  orderId: number
): Promise<TrackingInfoResponse> => {
  try {
    const response = await api.post(`/api/shipping/update-tracking/${orderId}`);
    return response.data;
  } catch (error: any) {
    
    return {
      success: false,
      message: error.response?.data?.message || "Error al actualizar tracking",
    };
  }
};

/**
 * Cancelar envío (Admin)
 */
export const cancelShippingAdmin = async (
  orderId: number
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post(`/api/shipping/cancel/${orderId}`);
    return response.data;
  } catch (error: any) {
    
    return {
      success: false,
      message: error.response?.data?.message || "Error al cancelar envío",
    };
  }
};

/**
 * Obtener tracking info (Admin)
 */
export const getTrackingInfoAdmin = async (
  orderId: number
): Promise<TrackingInfoResponse> => {
  try {
    const response = await api.get(`/api/shipping/tracking/${orderId}`);
    return response.data;
  } catch (error: any) {
    
    return {
      success: false,
      message: error.response?.data?.message || "Error al obtener tracking",
    };
  }
};
