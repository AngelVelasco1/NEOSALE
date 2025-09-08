import { Router } from 'express';
import mercadopagoController from '../controllers/mercadopago.controller';
import {authMiddleware} from '../middlewares/auth';

const router = Router();

/**
 * Rutas para la integración con MercadoPago
 * Todas las rutas están prefijadas con /api/payments
 */

// Crear preferencia de pago (checkout)
router.post('/create-preference', authMiddleware.verifyToken, mercadopagoController.createPreference);

// Procesar pago con tarjeta directamente
router.post('/process-card', authMiddleware.verifyToken, mercadopagoController.processCardPayment);

// Webhook para recibir notificaciones de MercadoPago
// Esta ruta no requiere autenticación ya que es llamada por MercadoPago
router.post('/webhook', mercadopagoController.webhook);

// Obtener información de un pago específico
router.get('/:id', authMiddleware.verifyToken, mercadopagoController.getPayment);

// Reembolsar un pago
router.post('/:id/refund', authMiddleware.verifyToken, authMiddleware.isAdmin, mercadopagoController.refundPayment);

// Obtener métodos de pago disponibles
router.get('/payment-methods', mercadopagoController.getPaymentMethods);

export default router;
