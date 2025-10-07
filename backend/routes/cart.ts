import { Router } from "express";
import {
  addProductToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart";

export const cartRoutes = () =>
  Router()
    .get("/getCart", getCart)
    .post("/addProduct", addProductToCart)
    .put("/updateProduct", updateCartItem)
    .delete("/deleteProduct", removeCartItem)
    .delete("/clearCart", clearCart);
