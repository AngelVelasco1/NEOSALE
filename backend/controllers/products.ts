import { NextFunction } from "express-serve-static-core";
import {
  getProductsService,
  getLatestProductsService,
  getVariantStockService,
  getOffersService,
  createProductService,
  updateProductService,
  deleteProductService,
} from "../services/products.js";
import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.query.id ? Number(req.query.id) : undefined;
    const category = req.query.category as string | undefined;
    const subcategory = req.query.subcategory as string | undefined;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 20;

    const products = await getProductsService(id, category, subcategory, {
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      data: products,
      pagination: { page, limit },
    });
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
    res.status(200).json({
      success: true,
      data: products,
    });
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
    const productVariant = await getVariantStockService(id, color_code, size);
    res.status(200).json({
      success: true,
      data: productVariant,
    });
  } catch (err) {
    next(err);
  }
};

export const getOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 20;

    const offers = await getOffersService({ page, limit });
    res.status(200).json({
      success: true,
      data: offers,
      pagination: { page, limit },
    });
  } catch (err) {
    console.error("❌ Error en controller getOffers:", err);
    next(err);
  }
};

export const getTrustMetrics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [totalCustomers, totalProducts, totalReviews, positiveReviews] =
      await Promise.all([
        prisma.user.count({ where: { role: "user", active: true } }),
        prisma.products.count({ where: { active: true, stock: { gt: 0 } } }),
        prisma.reviews.count({ where: { active: true } }),
        prisma.reviews.count({
          where: { active: true, rating: { gte: 4 } },
        }),
      ]);

    const positiveReviewRate =
      totalReviews > 0
        ? Math.round((positiveReviews / totalReviews) * 100)
        : 0;

    res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        totalProducts,
        positiveReviewRate,
      },
    });
  } catch (err) {
    console.error("❌ Error en controller getTrustMetrics:", err);
    next(err);
  }
};

export const updateVariant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const variantId = parseInt(id);

    if (isNaN(variantId)) {
      res.status(400).json({
        success: false,
        error: "ID de variante inválido",
      });
      return;
    }

    const { stock, price } = req.body;

    // Validate that at least one field is provided
    if (stock === undefined && price === undefined) {
      res.status(400).json({
        success: false,
        error: "Debe proporcionar stock o price",
      });
      return;
    }

    // Prepare update data
    const updateData: any = {};

    if (stock !== undefined) {
      const stockNumber = Number(stock);
      if (isNaN(stockNumber) || stockNumber < 0) {
        res.status(400).json({
          success: false,
          error: "Stock inválido",
        });
        return;
      }
      updateData.stock = stockNumber;
    }

    if (price !== undefined) {
      const priceNumber = Number(price);
      if (isNaN(priceNumber) || priceNumber < 0) {
        res.status(400).json({
          success: false,
          error: "Precio inválido",
        });
        return;
      }
      updateData.price = priceNumber;
    }

    const updatedVariant = await prisma.product_variants.update({
      where: { id: variantId },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      data: updatedVariant,
    });
  } catch (err) {
    console.error("❌ Error en controller updateVariant:", err);
    next(err);
  }
};

// POST - Create new product
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await createProductService(req.body);

    res.status(201).json({
      success: true,
      data: result,
      message: "Producto creado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

// PUT - Update product
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = parseInt(req.params.id);
    const result = await updateProductService(productId, req.body);

    res.status(200).json({
      success: true,
      data: result,
      message: "Producto actualizado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

// DELETE - Delete product (soft delete)
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = parseInt(req.params.id);
    await deleteProductService(productId);

    res.status(200).json({
      success: true,
      message: "Producto eliminado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};
