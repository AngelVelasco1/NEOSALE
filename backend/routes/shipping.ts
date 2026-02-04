import { Router } from "express";
import {
  createShippingGuide,
  updateTracking,
  getTrackingInfo,
  cancelShipping,
  handleWebhook,
} from "../controllers/shipping";

export const shippingRoutes = () =>
  Router()
    // Generar guía de envío
    .post("/create/:orderId", createShippingGuide)
    
    // Actualizar tracking manualmente
    .post("/update-tracking/:orderId", updateTracking)
    
    // Obtener información de tracking
    .get("/tracking/:orderId", getTrackingInfo)
    
    // Cancelar envío
    .post("/cancel/:orderId", cancelShipping)
    
    // Webhook de EnvioClick (sin rate limit para no perder actualizaciones)
    .post("/webhook", handleWebhook);
