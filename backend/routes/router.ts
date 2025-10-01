import { Router } from "express";
import { productsRoutes } from "./products";
import { usersRoutes } from "./users";
import { cartRoutes } from "./cart";
import { ordersRoutes } from "./orders";
import { paymentRoutes } from "./payments";
import { addressesRoutes } from "./addresses";
import { reviewsRoutes } from "./reviews";

export const initRoutes = () => {
  const app = Router();
  app.use("/users", usersRoutes());
  app.use("/products", productsRoutes());
  app.use("/cart", cartRoutes());
  app.use("/orders", ordersRoutes());
  app.use("/payments", paymentRoutes());
  app.use("/addresses", addressesRoutes());
  app.use("/reviews", reviewsRoutes());

  return app;
};
