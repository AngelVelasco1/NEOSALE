import { Router } from 'express';
import {
  createCardToken,
  processCardPayment,
  processCompleteCardPayment,
  getPaymentStatus,
  refundPayment
} from '../controllers/card-payment.controller';
import { authenticateToken, requireAdmin } from '../middlewares/auth';

export const cardPaymentRoutes = () => {
  const app = Router();

  // Crear token de tarjeta (requiere autenticación)
  app.post('/card/token', authenticateToken, createCardToken);

  // Procesar pago con token existente (requiere autenticación)
  app.post('/card/process', authenticateToken, processCardPayment);

  // Flujo completo: tokenizar y pagar (requiere autenticación)
  app.post('/card/complete', authenticateToken, processCompleteCardPayment);

  // Consultar estado de pago (requiere autenticación)
  app.get('/card/:paymentId', authenticateToken, getPaymentStatus);

  // Reembolsar pago (solo admin)
  app.post('/card/:paymentId/refund', authenticateToken, requireAdmin, refundPayment);

  return app;
};
