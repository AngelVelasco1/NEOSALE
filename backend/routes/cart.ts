import { Router } from 'express';
import { addProductToCart, getCart, deleteProductFromCart, updateQuantityInCart } from '../controllers/cart';

export const cartRoutes = () => {
    const app = Router();
    app.get("/getCart", getCart)
    app.post("/addProduct", addProductToCart)
    app.delete("/deleteProduct", deleteProductFromCart)
    app.put("/updateProduct", updateQuantityInCart)
    return app;
}