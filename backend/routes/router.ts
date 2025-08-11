import { Router } from 'express';
import { productsRoutes } from './products';
import { usersRoutes } from './users';
import { cartRoutes } from './cart';

export const initRoutes = () => {
    const app = Router();
    app.use("/users", usersRoutes())
    app.use("/products", productsRoutes())
    app.use("/cart", cartRoutes())
    return app;
}