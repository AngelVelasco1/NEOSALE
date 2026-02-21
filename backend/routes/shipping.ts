import { Router } from "express";
import {
  getShippingQuote,
  createShippingGuide,
  updateTracking,
  getTrackingInfo,
  cancelShipping,
  handleWebhook,
} from "../controllers/shipping";

export const shippingRoutes = () =>
  Router()
    // Obtener cotización de envío
    .get("/quote/:orderId", getShippingQuote)
    
    // Generar guía de envío (requiere idRate de la cotización)
    .post("/create/:orderId", createShippingGuide)
    
    // Actualizar tracking manualmente
    .post("/update-tracking/:orderId", updateTracking)
    
    // Obtener información de tracking
    .get("/tracking/:orderId", getTrackingInfo)
    
    // Cancelar envío
    .post("/cancel/:orderId", cancelShipping)
    
    // Webhook de EnvioClick
    .post("/webhook", handleWebhook);
