import { Router } from "express";
import {
  getProductWithVariants,
  checkVariantAvailability,
  getOrderById,
  getUserOrdersWithPayments,
  updateOrderStatus,
} from "../controllers/orders";

export const ordersRoutes = () => {
  const app = Router();

  // Rutas de productos (estas funcionan)
  app.get("/product/:productId/variants", getProductWithVariants);
  app.get(
    "/product/:productId/variants/:colorCode/:size",
    checkVariantAvailability
  );

  // Rutas de órdenes básicas (estas funcionan)
  app.get("/user-orders-with-payments", getUserOrdersWithPayments);
  app.get("/:orderId", getOrderById);
  app.patch("/:orderId/status", updateOrderStatus);

  return app;
};
