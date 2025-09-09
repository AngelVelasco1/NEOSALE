import { Router } from 'express';
import { productsRoutes } from './products';
import { usersRoutes } from './users';
import { cartRoutes } from './cart';
import { ordersRoutes } from './orders';
import { paymentRoutes } from './payments';

export const initRoutes = () => {
    const app = Router();
    app.use("/users", usersRoutes())
    app.use("/products", productsRoutes())
    app.use("/cart", cartRoutes())
    app.use("/orders", ordersRoutes())
    app.use("/payments", paymentRoutes())
    return app;
}