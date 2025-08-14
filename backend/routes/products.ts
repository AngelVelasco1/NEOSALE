import { Router } from 'express';
import { getProducts, getLatestProducts, getVariantStock } from '../controllers/products';

export const productsRoutes = () => {
    const app = Router();
    app.get("/getProducts", getProducts)
    app.get("/getLatestProducts", getLatestProducts)
    app.post("/getVariantStock", getVariantStock)
    return app;
}