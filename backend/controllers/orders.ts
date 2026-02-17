import { NextFunction } from "express-serve-static-core";
import {
  getUserOrdersService,
  getProductWithVariantsService,
  checkVariantAvailabilityService,
  getOrderWithPaymentService,
  getOrderByIdService,
  updateOrderStatusService,
  getUserOrdersWithPaymentsService,
  getOrdersService,
  processWompiOrderWebhook,
  createOrderService
} from "../services/orders.js";
import { Request, Response } from "express";

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const status = req.query.status as string;
    const method = req.query.method as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const minAmount = req.query.minAmount
      ? parseFloat(req.query.minAmount as string)
      : undefined;
    const maxAmount = req.query.maxAmount
      ? parseFloat(req.query.maxAmount as string)
      : undefined;
    const sortBy = req.query.sortBy as string;
    const sortOrder = req.query.sortOrder as string;

    const result = await getOrdersService({
      page,
      limit,
      search,
      status,
      method,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortBy,
      sortOrder,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};
export const getProductWithVariants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
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
    const userId =
      userIdFromQuery || userIdFromHeader
        ? parseInt((userIdFromQuery || userIdFromHeader) as string)
        : null;

    const order = await getOrderByIdService(parseInt(orderId));

    // Si hay userId, verificar que la orden pertenece al usuario
    if (userId && order.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para ver esta orden",
      });
    }

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

    const orders = await getUserOrdersWithPaymentsService(userId);

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

// NUEVO: Crear orden desde payment
export const createOrderFromPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentId, shippingAddressId, couponId } = req.body;

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
    next(error);
  }
};

// NUEVO: Obtener orden con informacion de payment
export const getOrderWithPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;

    const order = await getOrderWithPaymentService(parseInt(orderId));

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// NUEVO: Procesar webhook especifico para ordenes
export const handleOrderWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { transactionId, paymentStatus } = req.body;

    const result = await processWompiOrderWebhook(transactionId, paymentStatus);

    res.json({
      success: true,
      message: "Webhook de orden procesado exitosamente",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
