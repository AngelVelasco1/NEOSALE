import { Router } from "express";
import {
  addProductToCart,
  getCart,
  deleteProductFromCart,
  updateQuantityInCart,
} from "../controllers/cart";

export const cartRoutes = () =>
  Router()
    .get("/getCart", getCart)
    .post("/addProduct", addProductToCart)
    .delete("/deleteProduct", deleteProductFromCart)
    .put("/updateProduct", updateQuantityInCart);
