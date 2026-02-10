import { Router } from "express";
import { productsRoutes } from "./products";
import { usersRoutes } from "./users";
import { cartRoutes } from "./cart";
import { addressesRoutes } from "./addresses";
import { reviewsRoutes } from "./reviews";
import { paymentsRoutes } from "./payments";
import { ordersRoutes } from "./orders";
import { categoriesRoutes } from "./categories";
import { brandsRoutes } from "./brands";
import { storeSettingsRoutes } from "./storeSettings";
import { searchRoutes } from "./search";
import couponsRoutes from "./coupons";
import notificationsRoutes from "./notifications";
import { shippingRoutes } from "./shipping";
import emailsRoutes from "./emails";

export const initRoutes = () => {
  const app = Router();
  app.use("/users", usersRoutes());
  app.use("/products", productsRoutes());
  app.use("/brands", brandsRoutes());
  app.use("/cart", cartRoutes());
  app.use("/orders", ordersRoutes());
  app.use("/addresses", addressesRoutes());
  app.use("/reviews", reviewsRoutes());
  app.use("/payments", paymentsRoutes());
  app.use("/categories", categoriesRoutes());
  app.use("/store-settings", storeSettingsRoutes());
  app.use("/search", searchRoutes());
  app.use("/coupons", couponsRoutes);
  app.use("/notifications", notificationsRoutes);
  app.use("/shipping", shippingRoutes());
  app.use("/emails", emailsRoutes);

  return app;
};
