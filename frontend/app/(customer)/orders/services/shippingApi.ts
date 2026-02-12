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

export interface ShippingRate {
  idRate: number;
  idProduct: number;
  product: string;
  idCarrier: number;
  carrier: string;
  flete: number;
  minimumInsurance: number;
  extraInsurance: number;
  deliveryDays: number;
  quotationType: string;
  cod: boolean;
  codDetails: any;
}

export interface QuotationResponse {
  success: boolean;
  data?: ShippingRate[];
  message?: string;
}

/**
 * API de Shipping - EnvioClick Integration
 */

/**
 * Obtener cotización de envío para una orden
 */
export const getShippingQuote = async (
  orderId: number
): Promise<QuotationResponse> => {
  try {
    const response = await api.get(`/api/shipping/quote/${orderId}`);
    return response.data;
  } catch (error: any) {
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Error al obtener cotización de envío",
    };
  }
};

/**
 * Crear guía de envío para una orden
 */
export const createShippingGuide = async (
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
    const response = await api.post(`/api/shipping/update-tracking/${orderId}`);
    return response.data;
  } catch (error: any) {
    
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
    const response = await api.get(`/api/shipping/tracking/${orderId}`);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "Error al obtener información de tracking";
    
    
    return {
      success: false,
      message: message,
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
    const response = await api.post(`/api/shipping/cancel/${orderId}`);
    return response.data;
  } catch (error: any) {
    
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
  intervalMs: number = 300000 // 5 minutos por defecto
): NodeJS.Timeout => {
  const poll = async () => {
    try {
      const data = await getTrackingInfo(orderId);
      onUpdate(data);
    } catch (error) {
      
    }
  };

  // Primera llamada después de un pequeño delay
  setTimeout(poll, 1000);

  // Polling cada intervalMs
  return setInterval(poll, intervalMs);
};
