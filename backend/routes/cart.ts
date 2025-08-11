import { Router } from 'express';
import { addProductToCart, getCart, deleteProductFromCart } from '../controllers/cart';

export const cartRoutes = () => {
    const app = Router();
    app.get("/getCart", getCart)
    app.post("/addProduct", addProductToCart)
    app.delete("/deleteProduct", deleteProductFromCart)
    return app;
}