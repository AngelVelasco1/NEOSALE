import { Router } from "express";
import { productsRoutes } from "./products";
import { usersRoutes } from "./users";
import { cartRoutes } from "./cart";
import { addressesRoutes } from "./addresses";
import { reviewsRoutes } from "./reviews";
import { paymentsRoutes } from "./payments";
import { ordersRoutes } from "./orders";

export const initRoutes = () => {
  const app = Router();
  app.use("/users", usersRoutes());
  app.use("/products", productsRoutes());
  app.use("/cart", cartRoutes());
  app.use("/orders", ordersRoutes());
  app.use("/addresses", addressesRoutes());
  app.use("/reviews", reviewsRoutes());
  app.use("/payments", paymentsRoutes());

  return app;
};
