import { Router } from 'express';
import { productsRoutes } from './products';
import { usersRoutes } from './users';

export const initRoutes = () => {
    const app = Router();
    app.use("/users", usersRoutes())
    app.use("/products", productsRoutes())

    return app;
}