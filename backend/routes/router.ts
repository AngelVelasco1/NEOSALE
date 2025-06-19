import { Router } from 'express';
import { productsRoutes } from './products.js';

export const initRoutes = () => {
    const app = Router();
    app.use("/use", productsRoutes())
    return app;
}