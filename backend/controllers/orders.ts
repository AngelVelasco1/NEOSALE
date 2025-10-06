import { NextFunction } from "express-serve-static-core";
import {
  createOrderService,
  getProductWithVariantsService,
  checkVariantAvailabilityService,
  getOrderByIdService,
  getUserOrdersService,
  updateOrderStatusService,
  getOrderWithPaymentService,
  processWompiOrderWebhook,
  getUserOrdersWithPaymentsService,
} from "../services/orders";
import { Request, Response } from "express";

/* export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, quantity, colorCode, size, shippingAddressId } =
      req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
      });
      return;
    }

    if (!productId || !quantity || quantity <= 0 || !shippingAddressId) {
      res.status(400).json({
        success: false,
        message:
          "Datos de orden inválidos. Se requiere productId, quantity > 0 y shippingAddressId",
      });
      return;
    }

    const result = await createOrderService({
      userId,
      productId,
      quantity,
      colorCode,
      size,
      shippingAddressId,
    });

    res.status(201).json({
      success: true,
      message: "Orden creada exitosamente",
      data: {
        orderId: result.orderId,
        paymentLink: result.paymentLink,
        preferenceId: result.preferenceId,
        total: result.total,
      },
    });
  } catch (err) {
    next(err);
  }
};
 */
export const getProductWithVariants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;

    if (!productId || isNaN(parseInt(productId))) {
      res.status(400).json({
        success: false,
        message: "ID de producto inválido",
      });
      return;
    }

    const product = await getProductWithVariantsService(parseInt(productId));

    res.json({
      success: true,
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

// Verificar disponibilidad de variante
export const checkVariantAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, colorCode, size } = req.params;

    if (!productId || !colorCode || !size) {
      return res.status(400).json({
        success: false,
        message: "Parámetros requeridos: productId, colorCode, size",
      });
    }

    const availability = await checkVariantAvailabilityService(
      parseInt(productId),
      colorCode,
      size
    );

    res.json({
      success: true,
      data: availability,
    });
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;

    // Obtener user_id desde query params o header X-User-ID
    const userIdFromQuery = req.query.user_id;
    const userIdFromHeader = req.headers["x-user-id"];
    const userId = parseInt((userIdFromQuery || userIdFromHeader) as string);

    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "user_id es requerido como query parameter o X-User-ID header",
      });
    }

    console.log("🔍 Obteniendo orden por ID:", {
      orderId: parseInt(orderId),
      userId,
    });

    const order = await getOrderByIdService(parseInt(orderId));

    // Verificar que la orden pertenece al usuario
    if (order.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para ver esta orden",
      });
    }

    console.log("✅ Orden obtenida:", {
      orderId: order.id,
      userId,
      status: order.status,
    });

    res.json({
      success: true,
      data: order,
    });
  } catch (err) {
    console.error("❌ Error en getOrderById:", err);
    next(err);
  }
};

// Obtener todas las órdenes del usuario
export const getUserOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
      });
    }

    const orders = await getUserOrdersService(userId);

    res.json({
      success: true,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserOrdersWithPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userIdFromQuery = req.query.user_id;
    const userIdFromHeader = req.headers["x-user-id"];
    const userId = parseInt((userIdFromQuery || userIdFromHeader) as string);

    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "user_id es requerido como query parameter o X-User-ID header",
      });
    }

    console.log("🔍 Obteniendo órdenes para usuario:", userId);

    const orders = await getUserOrdersWithPaymentsService(userId);

    console.log("✅ Órdenes obtenidas:", {
      userId,
      ordersCount: orders.length,
    });

    res.json({
      success: true,
      data: orders,
    });
  } catch (err) {
    console.error("❌ Error en getUserOrdersWithPayments:", err);
    next(err);
  }
};

// Actualizar estado de orden (solo para admin o webhooks)
export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validar que el usuario es admin o que viene de webhook de MercadoPago
    if (
      req.user?.role !== "admin" &&
      req.headers["x-webhook-source"] !== "mercadopago"
    ) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para actualizar esta orden",
      });
    }

    const order = await updateOrderStatusService(parseInt(orderId), status);

    res.json({
      success: true,
      message: "Estado de orden actualizado",
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

// 🆕 NUEVO: Crear orden desde payment
export const createOrderFromPayment = async (req: Request, res: Response) => {
  try {
    const { paymentId, shippingAddressId, couponId } = req.body;

    if (!paymentId || !shippingAddressId) {
      return res.status(400).json({
        success: false,
        message: "paymentId y shippingAddressId son requeridos",
      });
    }

    const result = await createOrderService({
      paymentId,
      shippingAddressId,
      couponId,
    });

    res.status(201).json({
      success: true,
      message: "Orden creada exitosamente desde payment",
      data: result,
    });
  } catch (error) {
    console.error("❌ Error en createOrderFromPayment:", error);
    res.status(500).json({
      success: false,
      message: "Error creando orden desde payment",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

// 🆕 NUEVO: Obtener orden con información de payment
export const getOrderWithPayment = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
      });
    }

    const order = await getOrderWithPaymentService(parseInt(orderId));

    // Verificar que la orden pertenece al usuario (excepto si es admin)
    if (order.user_id !== userId && req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para ver esta orden",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("❌ Error en getOrderWithPayment:", error);
    res.status(500).json({
      success: false,
      message: "Error obteniendo orden con payment",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

// 🎯 NUEVO: Procesar webhook específico para órdenes
export const handleOrderWebhook = async (req: Request, res: Response) => {
  try {
    const { transactionId, paymentStatus } = req.body;

    if (!transactionId || !paymentStatus) {
      return res.status(400).json({
        success: false,
        message: "transactionId y paymentStatus son requeridos",
      });
    }

    const result = await processWompiOrderWebhook(transactionId, paymentStatus);

    res.json({
      success: true,
      message: "Webhook de orden procesado exitosamente",
      data: result,
    });
  } catch (error) {
    console.error("❌ Error en handleOrderWebhook:", error);
    res.status(500).json({
      success: false,
      message: "Error procesando webhook de orden",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};
