import { api } from "@/config/api";
import type {
  ShippingGuideResponse,
  TrackingInfoResponse,
} from "@/app/(customer)/orders/services/shippingApi";

/**
 * API de Shipping para Admin Dashboard
 */

/**
 * Crear guía de envío (Admin)
 */
export const createShippingGuideAdmin = async (
  orderId: number,
  paymentType: "PAID" | "COLLECT" = "PAID"
): Promise<ShippingGuideResponse> => {
  try {
    const response = await api.post(`/shipping/create/${orderId}`, {
      paymentType,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error creating shipping guide:", error);
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
    const response = await api.post(`/shipping/update-tracking/${orderId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error updating tracking:", error);
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
    const response = await api.post(`/shipping/cancel/${orderId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error canceling shipping:", error);
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
    const response = await api.get(`/shipping/tracking/${orderId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching tracking info:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al obtener tracking",
    };
  }
};
