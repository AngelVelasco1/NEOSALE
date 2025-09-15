import { Router } from 'express';
import { 
  createOrder,
  getProductWithVariants,
  checkVariantAvailability,
  handlePaymentWebhook,
  getOrderById,
  getUserOrders,
  updateOrderStatus
} from '../controllers/orders';
import { authenticateToken } from '../middlewares/auth';

export const ordersRoutes = () => {
    const app = Router();
    
    app.post("/create", authenticateToken, createOrder);
    
    // Obtener producto con variantes disponibles
    app.get("/product/:productId/variants", getProductWithVariants);
    
    // Verificar disponibilidad de variante específica
    app.get("/product/:productId/variants/:colorCode/:size", checkVariantAvailability);
    
    // Carrito de compras
    
    // Gestión de órdenes
    app.get("/user-orders", authenticateToken, getUserOrders);
    app.get("/:orderId", authenticateToken, getOrderById);
    app.patch("/:orderId/status", updateOrderStatus); // Sin auth para webhooks
    
    // Webhook de MercadoPago para notificaciones de pago (público)
    app.post("/webhook/mercadopago", handlePaymentWebhook);

    return app;
}