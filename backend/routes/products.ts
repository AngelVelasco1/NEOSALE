import { Router } from "express";
import {
  getProducts,
  getLatestProducts,
  getVariantStock,
} from "../controllers/products";

export const productsRoutes = () =>
  Router()
    .get("/getProducts", getProducts)
    .get("/getLatestProducts", getLatestProducts)
    .post("/getVariantStock", getVariantStock);
