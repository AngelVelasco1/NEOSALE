import { Router } from 'express';
import { getProducts, getLatestProducts } from '../controllers/products';

export const productsRoutes = () => {
    const app = Router();
    app.get("/products", getProducts)
    app.get("/latestProducts", getLatestProducts)
    return app;
}