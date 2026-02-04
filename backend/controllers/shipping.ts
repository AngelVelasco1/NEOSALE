import { NextFunction, Request, Response } from "express";
import {
  createShippingGuideService,
  updateTrackingService,
  getTrackingInfoService,
  cancelShippingService,
  processWebhookService,
} from "../services/shipping";

/**
 * Generar guía de envío para una orden
 */
export const createShippingGuide = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;
    const { paymentType = "PAID" } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "ID de orden requerido",
      });
    }

    const result = await createShippingGuideService(
      parseInt(orderId),
      paymentType
    );

    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar tracking de una orden
 */
export const updateTracking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "ID de orden requerido",
      });
    }

    const result = await updateTrackingService(parseInt(orderId));

    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener información de tracking
 */
export const getTrackingInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "ID de orden requerido",
      });
    }

    const result = await getTrackingInfoService(parseInt(orderId));

    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Cancelar envío
 */
export const cancelShipping = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "ID de orden requerido",
      });
    }

    const result = await cancelShippingService(parseInt(orderId));

    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Webhook para recibir actualizaciones de EnvioClick
 */
export const handleWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const webhookData = req.body;

    console.log("📦 Webhook recibido de EnvioClick:", webhookData);

    const result = await processWebhookService(webhookData);

    // Siempre responder 200 OK para confirmar recepción
    res.status(200).json({
      success: true,
      message: "Webhook procesado",
      processed: result.success,
    });
  } catch (error) {
    console.error("Error procesando webhook:", error);
    // Aún así responder 200 para que EnvioClick no reintente
    res.status(200).json({
      success: false,
      message: "Error procesando webhook",
    });
  }
};
