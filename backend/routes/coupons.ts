import { Router } from "express";
import {
  getActiveCoupons,
  validateCoupon,
  toggleCouponFeatured,
} from "../services/coupons";

const router = Router();

/**
 * Obtiene los últimos 3 cupones activos disponibles
 */
router.get("/active", async (req, res, next) => {
  try {
    const coupons = await getActiveCoupons();
    res.json({ coupons });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/customers/coupons/validate
 * Valida un código de cupón para el carrito actual
 */
router.post("/validate", async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;

    if (!code || subtotal === undefined) {
      return res.status(400).json({
        message: "Código y subtotal son requeridos",
      });
    }

    const result = await validateCoupon(code, subtotal);

    if (!result.valid) {
      return res.status(400).json({
        message: result.error || "Cupón inválido",
      });
    }

    res.json({
      coupon: result.coupon,
      discount_amount: result.discount_amount,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/customers/coupons/:id/toggle-featured
 * Alterna el estado featured de un cupón
 */
router.post("/:id/toggle-featured", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { currentFeatured } = req.body;

    if (currentFeatured === undefined) {
      return res.status(400).json({
        message: "currentFeatured es requerido",
      });
    }

    await toggleCouponFeatured(Number(id), currentFeatured);

    res.json({
      message: "Estado featured actualizado exitosamente",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
