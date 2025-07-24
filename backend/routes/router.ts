import { Router } from 'express';
import { productsRoutes } from './products.js';
import { usersRoutes } from './users.js';

export const initRoutes = () => {
    const app = Router();
    app.use("/users", usersRoutes())
    app.use("/products", productsRoutes())

    return app;
}