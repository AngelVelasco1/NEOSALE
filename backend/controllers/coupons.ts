import { Request, Response, NextFunction } from "express";
import {
  getActiveCoupons,
  validateCoupon,
  toggleCouponFeatured,
  createCouponService,
  updateCouponService,
  deleteCouponService,
} from "../services/coupons.js";

// GET - Retrieve active coupons
export const getActiveCouponsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const coupons = await getActiveCoupons();
    res.status(200).json({
      success: true,
      data: coupons,
      message: "Cupones activos obtenidos exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

// POST - Validate coupon code
export const validateCouponController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code, subtotal } = req.body;

    if (!code || subtotal === undefined) {
      return res.status(400).json({
        success: false,
        message: "Código y subtotal son requeridos",
      });
    }

    const result = await validateCoupon(code, subtotal);

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        message: result.error || "Cupón inválido",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        coupon: result.coupon,
        discount_amount: result.discount_amount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST - Create new coupon
export const createCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await createCouponService(req.body);

    res.status(201).json({
      success: true,
      data: result,
      message: "Cupón creado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

// PUT - Update coupon
export const updateCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const couponId = parseInt(req.params.id);
    const result = await updateCouponService(couponId, req.body);

    res.status(200).json({
      success: true,
      data: result,
      message: "Cupón actualizado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

// DELETE - Delete coupon (soft delete)
export const deleteCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const couponId = parseInt(req.params.id);
    await deleteCouponService(couponId);

    res.status(200).json({
      success: true,
      message: "Cupón eliminado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

// PATCH - Toggle coupon featured status
export const toggleFeatured = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const couponId = parseInt(req.params.id);
    const { currentFeatured } = req.body;
    
    if (typeof currentFeatured !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "El estado featured debe ser un booleano",
      });
    }
    
    await toggleCouponFeatured(couponId, currentFeatured);

    res.status(200).json({
      success: true,
      message: "Estado destacado del cupón actualizado",
    });
  } catch (error) {
    next(error);
  }
};
