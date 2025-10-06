import { Router } from "express";
import {
  getProductWithVariants,
  checkVariantAvailability,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/orders";
/* import { authenticateToken } from '../middlewares/auth';
 */
export const ordersRoutes = () => {
  const app = Router();

  // Rutas de productos (estas funcionan)
  app.get("/product/:productId/variants", getProductWithVariants);
  app.get(
    "/product/:productId/variants/:colorCode/:size",
    checkVariantAvailability
  );

  // Rutas de órdenes básicas (estas funcionan)
  app.get("/user-orders", getUserOrders);
  app.get("/:orderId", getOrderById);
  app.patch("/:orderId/status", updateOrderStatus);

  return app;
};
