import { Router } from "express";
import {
  getActiveCouponsController,
  validateCouponController,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleFeatured,
} from "../controllers/coupons.js";

const router = Router();

// GET - Obtener cupones activos
router.get("/active", getActiveCouponsController);

// POST - Validar código de cupón
router.post("/validate", validateCouponController);

// POST - Crear nuevo cupón
router.post("/", createCoupon);

// PUT - Actualizar cupón
router.put("/:id", updateCoupon);

// DELETE - Eliminar cupón (soft delete)
router.delete("/:id", deleteCoupon);

// PATCH - Alternar estado featured del cupón
router.patch("/:id/toggle-featured", toggleFeatured);

export default router;
