import { NextFunction } from "express-serve-static-core";
import {
  getProductsService,
  getLatestProductsService,
  getVariantStockService,
} from "../services/products.js";
import { Request, Response } from "express";

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.query.id ? Number(req.query.id) : undefined;
    const category = req.query.category as string | undefined;
    const subcategory = req.query.subcategory as string | undefined;

    const products = await getProductsService(id, category, subcategory);

    res.status(200).json(products);
  } catch (err) {
    console.error("❌ Error en controller:", err);
    next(err);
  }
};
export const getLatestProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await getLatestProductsService();
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

export const getVariantStock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, color_code, size } = req.body;

    if (!id || !color_code || !size) {
      res.status(400).json({
        error: "Faltan parámetros requeridos",
        required: ["product_id", "color_code", "size"],
      });
      return;
    }

    const productVariant = await getVariantStockService(id, color_code, size);
    res.status(200).json(productVariant);
  } catch (err) {
    next(err);
  }
};
