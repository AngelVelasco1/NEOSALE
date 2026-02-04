import { api } from "@/config/api";

export interface ShipmentData {
  orderId: number;
  paymentType?: "PAID" | "COLLECT";
}

export interface TrackingEvent {
  date: string;
  status: string;
  description: string;
  location?: string;
}

export interface ShippingGuideResponse {
  success: boolean;
  message?: string;
  data?: {
    guideNumber: string;
    shipmentId: string;
    trackingUrl: string;
    labelUrl: string;
    estimatedDeliveryDate?: string;
  };
  error?: string;
}

export interface TrackingInfoResponse {
  success: boolean;
  data?: {
    id: number;
    status: string;
    envioclick_guide_number: string | null;
    envioclick_tracking_url: string | null;
    envioclick_status: string | null;
    tracking_number: string | null;
    carrier: string | null;
    tracking_history: TrackingEvent[];
    last_tracking_update: string | null;
    shipped_at: string | null;
    delivered_at: string | null;
  };
  message?: string;
}

/**
 * API de Shipping - EnvioClick Integration
 */

/**
 * Crear guía de envío para una orden
 */
export const createShippingGuide = async (
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
      error: error.response?.data?.message || error.message || "Error al crear guía de envío",
    };
  }
};

/**
 * Actualizar tracking de una orden manualmente
 */
export const updateTracking = async (
  orderId: number
): Promise<TrackingInfoResponse> => {
  try {
    const response = await api.post(`/shipping/update-tracking/${orderId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error updating tracking:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Error al actualizar tracking",
    };
  }
};

/**
 * Obtener información de tracking de una orden
 */
export const getTrackingInfo = async (
  orderId: number
): Promise<TrackingInfoResponse> => {
  try {
    const response = await api.get(`/shipping/tracking/${orderId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching tracking info:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Error al obtener información de tracking",
    };
  }
};

/**
 * Cancelar envío
 */
export const cancelShipping = async (
  orderId: number
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post(`/shipping/cancel/${orderId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error canceling shipping:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Error al cancelar envío",
    };
  }
};

/**
 * Hook para polling de tracking (actualización automática)
 */
export const startTrackingPolling = (
  orderId: number,
  onUpdate: (data: TrackingInfoResponse) => void,
  intervalMs: number = 60000 // 1 minuto por defecto
): NodeJS.Timeout => {
  const poll = async () => {
    const data = await getTrackingInfo(orderId);
    if (data.success) {
      onUpdate(data);
    }
  };

  // Primera llamada inmediata
  poll();

  // Polling cada intervalMs
  return setInterval(poll, intervalMs);
};
