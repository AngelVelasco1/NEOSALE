import { Router } from "express";
import {
  createOrder,
  getProductWithVariants,
  checkVariantAvailability,
  handlePaymentWebhook,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/orders";
/* import { authenticateToken } from '../middlewares/auth';
 */
export const ordersRoutes = () => {
  const app = Router();

  app.post("/create", createOrder);

  app.get("/product/:productId/variants", getProductWithVariants);

  app.get(
    "/product/:productId/variants/:colorCode/:size",
    checkVariantAvailability
  );

  app.get("/user-orders", getUserOrders);
  app.get("/:orderId", getOrderById);
  app.patch("/:orderId/status", updateOrderStatus); // Sin auth para webhooks

  app.post("/webhook/mercadopago", handlePaymentWebhook);

  return app;
};
