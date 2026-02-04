import { prisma } from "../lib/prisma";
import { envioClickService, ShipmentData } from "./envioclick";
import { NotFoundError } from "../errors/errorsClass";

/**
 * Crear guía de envío para una orden
 */
export const createShippingGuideService = async (
  orderId: number,
  paymentType: "PAID" | "COLLECT" = "PAID"
) => {
  try {
    // Obtener información de la orden
    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      include: {
        User_orders_user_idToUser: {
          select: {
            name: true,
            phone_number: true,
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

    // Calcular peso total
    const totalWeight = order.order_items.reduce(
      (acc, item) => acc + (item.products.weight_grams * item.quantity),
      0
    );

    // Datos de remitente (tu tienda)
    const senderName = process.env.STORE_NAME || "NeoSale";
    const senderPhone = process.env.STORE_PHONE || "3001234567";
    const senderAddress = process.env.STORE_ADDRESS || "Calle 123 #45-67";
    const senderCity = process.env.STORE_CITY || "Bogotá";

    // Preparar datos del envío
    const shipmentData: ShipmentData = {
      orderId: order.id,
      senderName,
      senderPhone,
      senderAddress,
      senderCity,
      receiverName: order.User_orders_user_idToUser.name || "Cliente",
      receiverPhone: order.User_orders_user_idToUser.phone_number || "",
      receiverAddress: order.addresses.address,
      receiverCity: order.addresses.city,
      receiverDepartment: order.addresses.department,
      packageWeight: totalWeight,
      packageValue: order.total,
      paymentType,
      observations: order.user_note || undefined,
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
        envioclick_status: "CREATED",
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
        tracking_history: true,
      },
    });

    if (!order || !order.envioclick_guide_number) {
      throw new NotFoundError("Orden sin guía de envío");
    }

    // Consultar tracking en EnvioClick
    const trackingResult = await envioClickService.trackShipment(
      order.envioclick_guide_number
    );

    if (!trackingResult.success || !trackingResult.data) {
      return {
        success: false,
        message: trackingResult.error || "Error al consultar tracking",
      };
    }

    const { status, currentLocation, estimatedDelivery, events } =
      trackingResult.data;

    // Mapear estado de EnvioClick a estado de orden
    const orderStatus =
      envioClickService.mapEnvioClickStatusToOrderStatus(status);

    // Actualizar orden
    const updateData: any = {
      envioclick_status: status,
      status: orderStatus,
      last_tracking_update: new Date(),
      tracking_history: events,
      updated_at: new Date(),
    };

    // Si fue entregado, actualizar delivered_at
    if (status === "DELIVERED" && !order.tracking_history) {
      updateData.delivered_at = new Date();
    }

    // Si fue enviado y no tiene shipped_at
    if (
      ["IN_TRANSIT", "OUT_FOR_DELIVERY"].includes(status) &&
      orderStatus === "shipped"
    ) {
      updateData.shipped_at = new Date();
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
        currentLocation,
        estimatedDelivery,
        events,
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
  try {
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
  } catch (error) {
    console.error("Error en getTrackingInfoService:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
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
        status: true,
      },
    });

    if (!order || !order.envioclick_guide_number) {
      throw new NotFoundError("Orden sin guía de envío");
    }

    if (order.status === "delivered") {
      return {
        success: false,
        message: "No se puede cancelar un envío ya entregado",
      };
    }

    // Cancelar en EnvioClick
    const result = await envioClickService.cancelShipment(
      order.envioclick_guide_number
    );

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
        envioclick_status: "CANCELLED",
        cancelled_at: new Date(),
        updated_at: new Date(),
      },
    });

    return {
      success: true,
      message: "Envío cancelado exitosamente",
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
