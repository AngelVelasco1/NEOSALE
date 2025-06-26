import { Router } from 'express';
import { productsRoutes } from './products.js';
import { usersRoutes } from './users.js';

export const initRoutes = () => {
    const app = Router();
    app.use("/use", productsRoutes())
    app.use("/use", usersRoutes())

    return app;
}