import { NextFunction } from "express-serve-static-core";
import {
  createOrderService,
  getProductWithVariantsService,
  checkVariantAvailabilityService,
  getUserCartService,
  addToCartService,
  processPaymentWebhook,
  getOrderByIdService,
  getUserOrdersService,
  updateOrderStatusService
} from "../services/orders";
import { Request, Response } from "express";

// Crear una nueva orden y obtener el link de pago
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, quantity, colorCode, size, shippingAddressId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no autenticado' 
      });
    }

    // Validaciones básicas
    if (!productId || !quantity || quantity <= 0 || !shippingAddressId) {
      return res.status(400).json({
        success: false,
        message: 'Datos de orden inválidos. Se requiere productId, quantity > 0 y shippingAddressId'
      });
    }

    const result = await createOrderService({
      userId,
      productId,
      quantity,
      colorCode,
      size,
      shippingAddressId
    });

    res.status(201).json({
      success: true,
      message: 'Orden creada exitosamente',
      data: {
        orderId: result.orderId,
        paymentLink: result.paymentLink,
        preferenceId: result.preferenceId,
        total: result.total
      }
    });

  } catch (err) {
    next(err);
  }
};

// Obtener producto con variantes
export const getProductWithVariants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;

    if (!productId || isNaN(parseInt(productId))) {
      return res.status(400).json({
        success: false,
        message: 'ID de producto inválido'
      });
    }

    const product = await getProductWithVariantsService(parseInt(productId));

    res.json({
      success: true,
      data: product
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
        message: 'Parámetros requeridos: productId, colorCode, size'
      });
    }

    const availability = await checkVariantAvailabilityService(
      parseInt(productId),
      colorCode,
      size
    );

    res.json({
      success: true,
      data: availability
    });

  } catch (err) {
    next(err);
  }
};

// Obtener carrito del usuario
export const getUserCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no autenticado' 
      });
    }

    const cart = await getUserCartService(userId);

    res.json({
      success: true,
      data: cart
    });

  } catch (err) {
    next(err);
  }
};

// Agregar producto al carrito
export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, quantity, colorCode, size } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no autenticado' 
      });
    }

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos. Se requiere productId y quantity > 0'
      });
    }

    const result = await addToCartService(
      userId,
      productId,
      quantity,
      colorCode,
      size
    );

    res.status(201).json({
      success: true,
      message: 'Producto agregado al carrito',
      data: result
    });

  } catch (err) {
    next(err);
  }
};

// Webhook de MercadoPago
export const handlePaymentWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, data } = req.body;

    // Verificar que sea un evento de pago
    if (type !== 'payment') {
      return res.status(200).json({
        success: true,
        message: 'Evento no procesado'
      });
    }

    await processPaymentWebhook(data.id);

    res.status(200).json({
      success: true,
      message: 'Webhook procesado correctamente'
    });

  } catch (err) {
    console.error('Error en webhook de MercadoPago:', err);
    next(err);
  }
};

// Obtener una orden por ID
export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no autenticado' 
      });
    }

    const order = await getOrderByIdService(parseInt(orderId));

    // Verificar que la orden pertenece al usuario (excepto si es admin)
    if (order.user_id !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver esta orden'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (err) {
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
        message: 'Usuario no autenticado' 
      });
    }

    const orders = await getUserOrdersService(userId);

    res.json({
      success: true,
      data: orders
    });

  } catch (err) {
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
    if (req.user?.role !== 'admin' && req.headers['x-webhook-source'] !== 'mercadopago') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para actualizar esta orden'
      });
    }

    const order = await updateOrderStatusService(parseInt(orderId), status);

    res.json({
      success: true,
      message: 'Estado de orden actualizado',
      data: order
    });

  } catch (err) {
    next(err);
  }
};
