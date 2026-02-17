import { Router } from "express";
import { productsRoutes } from "./products.js";
import { usersRoutes } from "./users.js";
import { cartRoutes } from "./cart.js";
import { addressesRoutes } from "./addresses.js";
import { reviewsRoutes } from "./reviews.js";
import { paymentsRoutes } from "./payments.js";
import { ordersRoutes } from "./orders.js";
import { categoriesRoutes } from "./categories.js";
import { brandsRoutes } from "./brands.js";
import { storeSettingsRoutes } from "./storeSettings.js";
import { searchRoutes } from "./search.js";
import couponsRoutes from "./coupons.js";
import notificationsRoutes from "./notifications.js";
import { shippingRoutes } from "./shipping.js";
import emailsRoutes from "./emails.js";
import { adminRoutes } from "./admin.js";

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
  app.use("/admin", adminRoutes()); // ✅ Admin routes

  return app;
};
