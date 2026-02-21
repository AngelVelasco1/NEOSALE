import { ENVIOCLICK_CONFIG } from "../config/credentials";

interface ShipmentData {
  orderId: number;
  senderCompany: string;
  senderFirstName: string;
  senderLastName: string;
  senderEmail: string;
  senderPhone: string;
  senderAddress: string;
  senderSuburb: string;
  senderCrossStreet: string;
  senderReference: string;
  senderDaneCode: string;
  receiverCompany: string;
  receiverFirstName: string;
  receiverLastName: string;
  receiverEmail: string;
  receiverPhone: string;
  receiverAddress: string;
  receiverSuburb: string;
  receiverCrossStreet: string;
  receiverReference: string;
  receiverDaneCode: string;
  packageWeight: number;
  packageHeight: number;
  packageWidth: number;
  packageLength: number;
  description: string;
  contentValue: number;
  codValue?: number;
  includeGuideCost?: boolean;
  codPaymentMethod?: "cash" | "data_phone";
  idRate: number;
  requestPickup: boolean;
  pickupDate: string;
  insurance: boolean;
}

interface EnvioClickResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

interface TrackingResponse {
  success: boolean;
  data?: {
    guideNumber: string;
    status: string;
    statusDetail: string;
    arrivalDate: string | null;
    realPickupDate?: string | null;
    realDeliveryDate?: string | null;
    receivedBy?: string | null;
  };
  error?: string;
}

interface QuotationRequest {
  packages: Array<{
    weight: number;
    height: number;
    width: number;
    length: number;
  }>;
  description: string;
  contentValue: number;
  codValue?: number;
  includeGuideCost?: boolean;
  codPaymentMethod?: "cash" | "data_phone";
  origin: {
    daneCode: string;
    address: string;
  };
  destination: {
    daneCode: string;
    address: string;
  };
}

interface QuotationResponse {
  success: boolean;
  data?: {
    rates: Array<{
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
    }>;
  };
  error?: string;
}

class EnvioClickService {
  private apiKey: string;
  private apiUrl: string;
  private environment: "sandbox" | "production";

  constructor() {
    this.apiKey = ENVIOCLICK_CONFIG.apiKey;
    this.apiUrl = ENVIOCLICK_CONFIG.apiUrl;
    this.environment = process.env.NODE_ENV === "production" ? "production" : "sandbox";

    if (!this.apiKey) {
      console.warn("ENVIOCLICK_API_KEY no configurada");
    }  }

  private getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      "Authorization": this.apiKey,
    };
  }

  async getShippingQuote(params: QuotationRequest): Promise<QuotationResponse> {
    try {
      if (!this.apiKey) {
        throw new Error("API Key de EnvioClick no configurada");
      }

      const response = await fetch(`${this.apiUrl}/api/v2/quotation`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(params),
      });

      const result = await response.json();

      if (result.status !== "OK") {
        return {
          success: false,
          error: JSON.stringify(result.status_messages) || "Error al obtener cotización",
        };
      }

      return {
        success: true,
        data: {
          rates: result.data.rates,
        },
      };
    } catch (error) {
      console.error("Error en getShippingQuote:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  }

  async createShipment(data: ShipmentData): Promise<EnvioClickResponse> {
    try {
      if (!this.apiKey) {
        throw new Error("API Key de EnvioClick no configurada");
      }

      const payload = {
        idRate: data.idRate,
        myShipmentReference: `NEOSALE_${data.orderId}`,
        external_order_id: data.orderId.toString(),
        requestPickup: data.requestPickup,
        pickupDate: data.pickupDate,
        insurance: data.insurance,
        description: data.description,
        contentValue: data.contentValue,
        ...(data.codValue && {
          codValue: data.codValue,
          includeGuideCost: data.includeGuideCost || false,
          codPaymentMethod: data.codPaymentMethod || "cash",
        }),
        packages: [
          {
            weight: data.packageWeight,
            height: data.packageHeight,
            width: data.packageWidth,
            length: data.packageLength,
          },
        ],
        origin: {
          company: data.senderCompany,
          firstName: data.senderFirstName,
          lastName: data.senderLastName,
          email: data.senderEmail,
          phone: data.senderPhone,
          address: data.senderAddress,
          suburb: data.senderSuburb,
          crossStreet: data.senderCrossStreet,
          reference: data.senderReference,
          daneCode: data.senderDaneCode,
        },
        destination: {
          company: data.receiverCompany,
          firstName: data.receiverFirstName,
          lastName: data.receiverLastName,
          email: data.receiverEmail,
          phone: data.receiverPhone,
          address: data.receiverAddress,
          suburb: data.receiverSuburb,
          crossStreet: data.receiverCrossStreet,
          reference: data.receiverReference,
          daneCode: data.receiverDaneCode,
        },
      };

      // Usar endpoint sandbox en desarrollo, producción en producción
      const endpoint = this.environment === "sandbox" 
        ? `${this.apiUrl}/api/v2/shipment_sandbox`
        : `${this.apiUrl}/api/v2/shipment`;


      const response = await fetch(endpoint, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.status !== "OK") {
        return {
          success: false,
          error: JSON.stringify(result.status_messages) || "Error al crear guía de envío",
        };
      }

      return {
        success: true,
        data: {
          guideNumber: result.data.tracker,
          shipmentId: result.data.idOrder.toString(),
          trackingUrl: `https://www.envioclick.com/track/${result.data.tracker}`,
          labelUrl: result.data.url,
          idOrder: result.data.idOrder,
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

  async trackShipment(trackingCode: string): Promise<TrackingResponse> {
    try {
      if (!this.apiKey) {
        throw new Error("API Key de EnvioClick no configurada");
      }

      const response = await fetch(`${this.apiUrl}/api/v2/track`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ trackingCode }),
      });

      const result = await response.json();

      if (result.status !== "OK") {
        return {
          success: false,
          error: JSON.stringify(result.status_messages) || "Error al consultar tracking",
        };
      }

      return {
        success: true,
        data: {
          guideNumber: trackingCode,
          status: result.data.status,
          statusDetail: result.data.statusDetail,
          arrivalDate: result.data.arrivalDate,
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

  async trackShipmentByOrderId(idOrder: number): Promise<TrackingResponse> {
    try {
      if (!this.apiKey) {
        throw new Error("API Key de EnvioClick no configurada");
      }

      const response = await fetch(
        `${this.apiUrl}/api/v2/track-by-orders/${idOrder}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      const result = await response.json();

      if (result.status !== "OK") {
        return {
          success: false,
          error: typeof result.data === "string" ? result.data : "Error al consultar tracking",
        };
      }

      return {
        success: true,
        data: {
          guideNumber: "",
          status: result.data.status,
          statusDetail: result.data.statusDetail,
          arrivalDate: result.data.arrivalDate,
          realPickupDate: result.data.realPickupDate,
          realDeliveryDate: result.data.realDeliveryDate,
          receivedBy: result.data.receivedBy,
        },
      };
    } catch (error) {
      console.error("Error en trackShipmentByOrderId:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  }

  async cancelShipments(idOrders: number[]): Promise<EnvioClickResponse> {
    try {
      if (!this.apiKey) {
        throw new Error("API Key de EnvioClick no configurada");
      }

      const response = await fetch(
        `${this.apiUrl}/api/v2/cancellation/batch/order`,
        {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify({ idOrders }),
        }
      );

      const result = await response.json();

      if (result.status !== "OK") {
        return {
          success: false,
          error: JSON.stringify(result.status_messages) || "Error al cancelar envío",
        };
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      console.error("Error en cancelShipments:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  }

  mapEnvioClickStatusToOrderStatus(
    envioClickStatus: string
  ): "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" {
    const statusMap: Record<string, "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled"> = {
      "Pendiente de Recolección": "processing",
      "Recolectado": "shipped",
      "En Tránsito": "shipped",
      "En Reparto": "shipped",
      "Entregado": "delivered",
      "Devuelto": "cancelled",
      "Cancelado": "cancelled",
    };

    return statusMap[envioClickStatus] || "processing";
  }
}

export const envioClickService = new EnvioClickService();
export type { 
  ShipmentData, 
  EnvioClickResponse, 
  TrackingResponse,
  QuotationRequest,
  QuotationResponse
};
