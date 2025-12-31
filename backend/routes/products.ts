import { Router } from "express";
import {
  getProducts,
  getLatestProducts,
  getVariantStock,
  getOffers,
} from "../controllers/products";

export const productsRoutes = () =>
  Router()
    .get("/getProducts", getProducts)
    .get("/getLatestProducts", getLatestProducts)
    .get("/getOffers", getOffers)
    .post("/getVariantStock", getVariantStock);
