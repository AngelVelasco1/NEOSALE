import { Router } from 'express';
import { productsRoutes } from './products';
import { usersRoutes } from './users';
import { cartRoutes } from './cart';
import { ordersRoutes } from './orders';
import mercadopagoRoutes from './mercadopago.routes';
import {cardPaymentRoutes} from './card-payment.routes';

export const initRoutes = () => {
    const app = Router();
    app.use("/users", usersRoutes())
    app.use("/products", productsRoutes())
    app.use("/cart", cartRoutes())
    app.use("/orders", ordersRoutes())
    app.use("/payments", mercadopagoRoutes)
    app.use("/card-payments", cardPaymentRoutes)
    return app;
}