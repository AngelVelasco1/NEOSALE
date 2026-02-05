import { prisma } from "../lib/prisma";
import { envioClickService, ShipmentData, QuotationRequest } from "./envioclick";
import { NotFoundError } from "../errors/errorsClass";

/**
 * Obtener cotización de envío para una orden
 */
export const getShippingQuoteService = async (orderId: number) => {
  try {
    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      include: {
        addresses: {
          select: {
            address: true,
            city: true,
            department: true,
          },
        },
        order_items: {
          include: {
            products: {
              select: {
                weight_grams: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundError("Orden no encontrada");
    }

    // Calcular peso total en KG
    const totalWeightGrams = order.order_items.reduce(
      (acc, item) => acc + (item.products.weight_grams * item.quantity),
      0
    );
    const totalWeightKg = Math.max(totalWeightGrams / 1000, 1); // Mínimo 1 kg

    // Dimensiones estimadas del paquete (puedes ajustar según tu lógica)
    const packageDimensions = {
      height: 10, // cm
      width: 15,  // cm
      length: 20, // cm
    };

    // Códigos DANE (debes tener una tabla o servicio para mapear ciudades a códigos DANE)
    // Bogotá: 11001000
    const originDaneCode = process.env.STORE_DANE_CODE || "11001000";
    const destinationDaneCode = "11001000"; // Debes implementar un mapeo real

    const quotationRequest: QuotationRequest = {
      packages: [
        {
          weight: totalWeightKg,
          height: packageDimensions.height,
          width: packageDimensions.width,
          length: packageDimensions.length,
        },
      ],
      description: "Productos NeoSale",
      contentValue: order.subtotal,
      origin: {
        daneCode: originDaneCode,
        address: process.env.STORE_ADDRESS || "Calle 123 #45-67",
      },
      destination: {
        daneCode: destinationDaneCode,
        address: order.addresses.address,
      },
    };

    const result = await envioClickService.getShippingQuote(quotationRequest);

    if (!result.success || !result.data) {
      return {
        success: false,
        message: result.error || "Error al obtener cotización",
      };
    }

    return {
      success: true,
      data: result.data.rates,
    };
  } catch (error) {
    console.error("Error en getShippingQuoteService:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
};

/**
 * Crear guía de envío para una orden
 * Requiere un idRate obtenido de una cotización previa
 */
export const createShippingGuideService = async (
  orderId: number,
  idRate: number,
  requestPickup: boolean = false,
  insurance: boolean = true
) => {
  try {
    // Obtener información de la orden
    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      include: {
        users: {
          select: {
            name: true,
            phoneNumber: true,
            email: true,
          },
        },
        addresses: {
          select: {
            address: true,
            city: true,
            department: true,
            country: true,
          },
        },
        order_items: {
          include: {
            products: {
              select: {
                name: true,
                weight_grams: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundError("Orden no encontrada");
    }

    if (order.envioclick_guide_number) {
      return {
        success: false,
        message: "Esta orden ya tiene una guía de envío generada",
        guideNumber: order.envioclick_guide_number,
      };
    }

    // Calcular peso total en KG
    const totalWeightGrams = order.order_items.reduce(
      (acc, item) => acc + (item.products.weight_grams * item.quantity),
      0
    );
    const totalWeightKg = Math.max(totalWeightGrams / 1000, 1);

    // Dimensiones del paquete
    const packageDimensions = {
      height: 10,
      width: 15,
      length: 20,
    };

    // Dividir nombre del cliente
    const fullName = order.users.name || "Cliente";
    const nameParts = fullName.trim().split(" ");
    const receiverFirstName = nameParts[0] || "Cliente";
    const receiverLastName = nameParts.slice(1).join(" ") || "N/A";

    // Datos de remitente
    const storeName = process.env.STORE_NAME || "NeoSale";
    const storeNameParts = storeName.split(" ");
    const senderFirstName = storeNameParts[0] || "Neo";
    const senderLastName = storeNameParts.slice(1).join(" ") || "Sale";

    // Fecha de recolección (mañana)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const pickupDate = tomorrow.toISOString().split("T")[0]; // YYYY-MM-DD

    // Códigos DANE
    const originDaneCode = process.env.STORE_DANE_CODE || "11001000";
    const destinationDaneCode = "11001000"; // Implementar mapeo real

    // Preparar datos del envío según la API de EnvioClick
    const shipmentData: ShipmentData = {
      orderId: order.id,
      idRate: idRate,
      requestPickup: requestPickup,
      pickupDate: pickupDate,
      insurance: insurance,
      description: "Productos NeoSale",
      contentValue: order.subtotal,
      
      // Dimensiones del paquete
      packageWeight: totalWeightKg,
      packageHeight: packageDimensions.height,
      packageWidth: packageDimensions.width,
      packageLength: packageDimensions.length,
      
      // Datos del remitente (origen)
      senderCompany: process.env.STORE_NAME || "NeoSale",
      senderFirstName: senderFirstName,
      senderLastName: senderLastName,
      senderEmail: process.env.STORE_EMAIL || "contacto@neosale.com",
      senderPhone: (process.env.STORE_PHONE || "3001234567").slice(-10),
      senderAddress: process.env.STORE_ADDRESS || "Calle 123 #45-67",
      senderSuburb: process.env.STORE_SUBURB || "Centro",
      senderCrossStreet: process.env.STORE_CROSS_STREET || "N/A",
      senderReference: process.env.STORE_REFERENCE || "Edificio principal",
      senderDaneCode: originDaneCode,
      
      // Datos del destinatario
      receiverCompany: "N/A",
      receiverFirstName: receiverFirstName,
      receiverLastName: receiverLastName,
      receiverEmail: order.users.email || "cliente@example.com",
      receiverPhone: (order.users.phoneNumber || "3000000000").slice(-10),
      receiverAddress: order.addresses.address,
      receiverSuburb: "N/A",
      receiverCrossStreet: "N/A",
      receiverReference: "N/A",
      receiverDaneCode: destinationDaneCode,
    };

    // Crear guía en EnvioClick
    const result = await envioClickService.createShipment(shipmentData);

    if (!result.success || !result.data) {
      return {
        success: false,
        message: result.error || "Error al crear guía de envío",
      };
    }

    // Actualizar orden con información de la guía
    await prisma.orders.update({
      where: { id: orderId },
      data: {
        envioclick_guide_number: result.data.guideNumber,
        envioclick_shipment_id: result.data.shipmentId,
        envioclick_tracking_url: result.data.trackingUrl,
        envioclick_label_url: result.data.labelUrl,
        envioclick_status: "Pendiente de Recolección",
        tracking_number: result.data.guideNumber,
        carrier: "EnvioClick",
        status: "processing",
        updated_at: new Date(),
      },
    });

    return {
      success: true,
      message: "Guía de envío creada exitosamente",
      data: result.data,
    };
  } catch (error) {
    console.error("Error en createShippingGuideService:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
};

/**
 * Actualizar tracking de una orden
 */
export const updateTrackingService = async (orderId: number) => {
  try {
    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      select: {
        envioclick_guide_number: true,
        envioclick_shipment_id: true,
        envioclick_status: true,
      },
    });

    if (!order) {
      throw new NotFoundError("Orden no encontrada");
    }

    // Intentar rastrear por número de orden de EnvioClick si existe
    let trackingResult;
    if (order.envioclick_shipment_id) {
      trackingResult = await envioClickService.trackShipmentByOrderId(
        parseInt(order.envioclick_shipment_id)
      );
    } else if (order.envioclick_guide_number) {
      // Si no existe shipment_id, intentar por número de guía
      trackingResult = await envioClickService.trackShipment(
        order.envioclick_guide_number
      );
    } else {
      throw new NotFoundError("Orden sin información de envío");
    }

    if (!trackingResult.success || !trackingResult.data) {
      return {
        success: false,
        message: trackingResult.error || "Error al consultar tracking",
      };
    }

    const { status, statusDetail, arrivalDate, realPickupDate, realDeliveryDate, receivedBy } =
      trackingResult.data;

    // Mapear estado de EnvioClick a estado de orden
    const orderStatus =
      envioClickService.mapEnvioClickStatusToOrderStatus(status);

    // Actualizar orden
    const updateData: any = {
      envioclick_status: status,
      status: orderStatus,
      last_tracking_update: new Date(),
      updated_at: new Date(),
    };

    // Si fue entregado, actualizar delivered_at
    if (status === "Entregado") {
      updateData.delivered_at = realDeliveryDate ? new Date(realDeliveryDate) : new Date();
    }

    // Si fue recolectado y no tiene shipped_at
    if (status === "Recolectado" || status === "En Tránsito") {
      updateData.shipped_at = realPickupDate ? new Date(realPickupDate) : new Date();
    }

    await prisma.orders.update({
      where: { id: orderId },
      data: updateData,
    });

    return {
      success: true,
      message: "Tracking actualizado",
      data: {
        status,
        statusDetail,
        arrivalDate,
        realPickupDate,
        realDeliveryDate,
        receivedBy,
      },
    };
  } catch (error) {
    console.error("Error en updateTrackingService:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
};

/**
 * Obtener información de tracking
 */
export const getTrackingInfoService = async (orderId: number) => {
  const order = await prisma.orders.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      status: true,
      envioclick_guide_number: true,
      envioclick_tracking_url: true,
      envioclick_status: true,
      tracking_number: true,
      carrier: true,
      tracking_history: true,
      last_tracking_update: true,
      shipped_at: true,
      delivered_at: true,
    },
  });

  if (!order) {
    throw new NotFoundError("Orden no encontrada");
  }

  return {
    success: true,
    data: order,
  };
};

/**
 * Cancelar envío
 */
export const cancelShippingService = async (orderId: number) => {
  try {
    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      select: {
        envioclick_guide_number: true,
        envioclick_shipment_id: true,
        status: true,
      },
    });

    if (!order || !order.envioclick_shipment_id) {
      throw new NotFoundError("Orden sin guía de envío");
    }

    if (order.status === "delivered") {
      return {
        success: false,
        message: "No se puede cancelar un envío ya entregado",
      };
    }

    // Cancelar en EnvioClick (requiere el idOrder de EnvioClick)
    const result = await envioClickService.cancelShipments([
      parseInt(order.envioclick_shipment_id)
    ]);

    if (!result.success) {
      return {
        success: false,
        message: result.error || "Error al cancelar envío",
      };
    }

    // Actualizar orden
    await prisma.orders.update({
      where: { id: orderId },
      data: {
        envioclick_status: "Cancelado",
        status: "cancelled",
        cancelled_at: new Date(),
        updated_at: new Date(),
      },
    });

    return {
      success: true,
      message: "Envío cancelado exitosamente",
      data: result.data,
    };
  } catch (error) {
    console.error("Error en cancelShippingService:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
};

/**
 * Procesar webhook de EnvioClick
 */
export const processWebhookService = async (webhookData: any) => {
  try {
    const { guide_number, status, event, location, timestamp } = webhookData;

    if (!guide_number) {
      return {
        success: false,
        message: "Número de guía no proporcionado",
      };
    }

    // Buscar orden por número de guía
    const order = await prisma.orders.findFirst({
      where: { envioclick_guide_number: guide_number },
    });

    if (!order) {
      console.warn(`⚠️ Orden no encontrada para guía: ${guide_number}`);
      return {
        success: false,
        message: "Orden no encontrada",
      };
    }

    // Obtener historial actual
    const currentHistory = Array.isArray(order.tracking_history)
      ? order.tracking_history
      : [];

    // Agregar nuevo evento
    const newEvent = {
      date: timestamp || new Date().toISOString(),
      status,
      description: event,
      location,
    };

    const updatedHistory = [...currentHistory, newEvent];

    // Mapear estado
    const orderStatus =
      envioClickService.mapEnvioClickStatusToOrderStatus(status);

    // Preparar datos de actualización
    const updateData: any = {
      envioclick_status: status,
      status: orderStatus,
      last_tracking_update: new Date(),
      tracking_history: updatedHistory,
      updated_at: new Date(),
    };

    // Actualizar timestamps según estado
    if (status === "DELIVERED") {
      updateData.delivered_at = new Date();
    } else if (status === "PICKED_UP" && !order.shipped_at) {
      updateData.shipped_at = new Date();
    }

    await prisma.orders.update({
      where: { id: order.id },
      data: updateData,
    });

    console.log(
      `✅ Webhook procesado - Orden ${order.id}, Estado: ${status}`
    );

    return {
      success: true,
      message: "Webhook procesado exitosamente",
    };
  } catch (error) {
    console.error("Error en processWebhookService:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
};
