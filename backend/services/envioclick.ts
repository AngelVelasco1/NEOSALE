import { ENVIOCLICK_CONFIG } from "../config/credentials";

interface ShipmentData {
  orderId: number;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  senderCity: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  receiverCity: string;
  receiverDepartment: string;
  packageWeight: number; // en gramos
  packageValue: number; // valor declarado
  paymentType: "PAID" | "COLLECT"; // Pago anticipado o contraentrega
  observations?: string;
}

interface EnvioClickResponse {
  success: boolean;
  data?: {
    guideNumber: string;
    shipmentId: string;
    trackingUrl: string;
    labelUrl: string;
    estimatedDeliveryDate?: string;
  };
  error?: string;
  message?: string;
}

interface TrackingEvent {
  date: string;
  status: string;
  description: string;
  location?: string;
}

interface TrackingResponse {
  success: boolean;
  data?: {
    guideNumber: string;
    status: string;
    currentLocation?: string;
    estimatedDelivery?: string;
    events: TrackingEvent[];
  };
  error?: string;
}

/**
 * Servicio de integración con EnvioClick Pro
 * Documentación: https://apidoc.envioclickpro.com.co/
 */
class EnvioClickService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = ENVIOCLICK_CONFIG.apiKey;
    this.apiUrl = ENVIOCLICK_CONFIG.apiUrl;

    if (!this.apiKey) {
      console.warn("⚠️ ENVIOCLICK_API_KEY no configurada en variables de entorno");
    }
  }

  /**
   * Headers comunes para todas las peticiones
   */
  private getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${this.apiKey}`,
      "Accept": "application/json",
    };
  }

  /**
   * Crear una guía de envío
   */
  async createShipment(data: ShipmentData): Promise<EnvioClickResponse> {
    try {
      if (!this.apiKey) {
        throw new Error("API Key de EnvioClick no configurada");
      }

      const payload = {
        order_reference: `NEOSALE_${data.orderId}`,
        sender: {
          name: data.senderName,
          phone: data.senderPhone,
          address: data.senderAddress,
          city: data.senderCity,
        },
        receiver: {
          name: data.receiverName,
          phone: data.receiverPhone,
          address: data.receiverAddress,
          city: data.receiverCity,
          department: data.receiverDepartment,
        },
        package: {
          weight: data.packageWeight,
          declared_value: data.packageValue,
        },
        payment_type: data.paymentType,
        observations: data.observations || "",
      };

      const response = await fetch(`${this.apiUrl}/v1/shipments`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.message || "Error al crear guía de envío",
        };
      }

      return {
        success: true,
        data: {
          guideNumber: result.guide_number,
          shipmentId: result.shipment_id,
          trackingUrl: result.tracking_url,
          labelUrl: result.label_url,
          estimatedDeliveryDate: result.estimated_delivery,
        },
      };
    } catch (error) {
      console.error("Error en createShipment:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  }

  /**
   * Consultar estado de un envío
   */
  async trackShipment(guideNumber: string): Promise<TrackingResponse> {
    try {
      if (!this.apiKey) {
        throw new Error("API Key de EnvioClick no configurada");
      }

      const response = await fetch(
        `${this.apiUrl}/v1/tracking/${guideNumber}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.message || "Error al consultar tracking",
        };
      }

      return {
        success: true,
        data: {
          guideNumber: result.guide_number,
          status: result.status,
          currentLocation: result.current_location,
          estimatedDelivery: result.estimated_delivery,
          events: result.events.map((event: any) => ({
            date: event.date,
            status: event.status,
            description: event.description,
            location: event.location,
          })),
        },
      };
    } catch (error) {
      console.error("Error en trackShipment:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  }

  /**
   * Cancelar un envío
   */
  async cancelShipment(guideNumber: string): Promise<EnvioClickResponse> {
    try {
      if (!this.apiKey) {
        throw new Error("API Key de EnvioClick no configurada");
      }

      const response = await fetch(
        `${this.apiUrl}/v1/shipments/${guideNumber}/cancel`,
        {
          method: "POST",
          headers: this.getHeaders(),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.message || "Error al cancelar envío",
        };
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Error en cancelShipment:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  }

  /**
   * Obtener cotización de envío
   */
  async getShippingQuote(
    originCity: string,
    destinationCity: string,
    weight: number,
    declaredValue: number
  ): Promise<EnvioClickResponse> {
    try {
      if (!this.apiKey) {
        throw new Error("API Key de EnvioClick no configurada");
      }

      const params = new URLSearchParams({
        origin: originCity,
        destination: destinationCity,
        weight: weight.toString(),
        declared_value: declaredValue.toString(),
      });

      const response = await fetch(
        `${this.apiUrl}/v1/quotes?${params.toString()}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.message || "Error al obtener cotización",
        };
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Error en getShippingQuote:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  }

  /**
   * Mapear estado de EnvioClick a estado de orden
   */
  mapEnvioClickStatusToOrderStatus(
    envioClickStatus: string
  ): "pending" | "paid" | "processing" | "shipped" | "delivered" {
    const statusMap: Record<string, "pending" | "paid" | "processing" | "shipped" | "delivered"> = {
      "CREATED": "processing",
      "PICKED_UP": "shipped",
      "IN_TRANSIT": "shipped",
      "OUT_FOR_DELIVERY": "shipped",
      "DELIVERED": "delivered",
      "RETURNED": "processing",
      "CANCELLED": "processing",
    };

    return statusMap[envioClickStatus] || "processing";
  }
}

export const envioClickService = new EnvioClickService();
export type { ShipmentData, EnvioClickResponse, TrackingEvent, TrackingResponse };
