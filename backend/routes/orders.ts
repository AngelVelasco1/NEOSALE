import { Router } from "express";
import {
  getOrders,
  getProductWithVariants,
  checkVariantAvailability,
  getOrderById,
  getUserOrdersWithPayments,
  updateOrderStatus,
} from "../controllers/orders";

export const ordersRoutes = () => {
  return Router()
    .get("/", getOrders)
    .get("/product/:productId/variants", getProductWithVariants)
    .get(
      "/product/:productId/variants/:colorCode/:size",
      checkVariantAvailability
    )
    .get("/user-orders-with-payments", getUserOrdersWithPayments)
    .get("/:orderId", getOrderById)
    .patch("/:orderId/status", updateOrderStatus);
};
