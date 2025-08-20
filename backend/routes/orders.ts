import { Router } from 'express';
import { createOrder } from '../controllers/orders';

export const ordersRoutes = () => {
    const app = Router();
    app.post("/createOrder", createOrder)

    return app;
}