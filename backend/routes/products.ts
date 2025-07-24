import { Router } from 'express';
import { getProducts, getLatestProducts } from '../controllers/products';

export const productsRoutes = () => {
    const app = Router();
    app.get("/getProducts", getProducts)
    app.get("/getLatestProducts", getLatestProducts)
    return app;
}