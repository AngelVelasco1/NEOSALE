import { prisma } from "../lib/prisma.js";
import {
  ValidationError,
  NotFoundError,
  DuplicateError,
  handlePrismaError,
} from "../errors/errorsClass.js";

interface Coupon {
  id: number;
  code: string;
  name: string;
  discount_type: string;
  discount_value: number;
  min_purchase_amount: number;
  usage_limit: number | null;
  usage_count: number | null;
  active: boolean;
  expires_at: Date;
  created_at: Date;
}

interface CouponValidationResult {
  valid: boolean;
  coupon?: Coupon;
  discount_amount?: number;
  error?: string;
}

/**
 * Obtiene los cupones destacados (featured) activos
 * Si no hay suficientes destacados, completa con los más recientes
 */
export async function getActiveCoupons(): Promise<Coupon[]> {
  const now = new Date();

  try {
    const coupons = await prisma.coupons.findMany({
      where: {
        active: true,
        deleted_at: null,
        expires_at: {
          gt: now,
        },
      },
      orderBy: [
        { featured: "desc" },
        { expires_at: "asc" },
        { created_at: "desc" },
      ],
      take: 3,
      select: {
        id: true,
        code: true,
        name: true,
        discount_type: true,
        discount_value: true,
        min_purchase_amount: true,
        usage_limit: true,
        usage_count: true,
        active: true,
        expires_at: true,
        created_at: true,
      },
    });

    // Filter manually for usage limit check
    const activeCoupons = coupons.filter((coupon) => {
      if (coupon.usage_limit === null) return true;
      const usageCount = coupon.usage_count || 0;
      return usageCount < coupon.usage_limit;
    });

    return activeCoupons.slice(0, 3).map((coupon) => ({
      ...coupon,
      discount_value: Number(coupon.discount_value),
      min_purchase_amount: Number(coupon.min_purchase_amount || 0),
    }));
  } catch (error: any) {
    console.error("[getActiveCoupons] Error al obtener cupones activos:", error);
    throw handlePrismaError(error);
  }
}

/**
 * Valida un código de cupón contra el subtotal del carrito
 */
export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<CouponValidationResult> {
  // Validación ANTES del try-catch
  if (!code || !code.trim()) {
    throw new ValidationError("Código de cupón requerido");
  }
  if (subtotal <= 0) {
    throw new ValidationError("El subtotal debe ser mayor a 0");
  }

  const now = new Date();

  try {
    // Buscar el cupón
    const coupon = await prisma.coupons.findFirst({
      where: {
        code: code.toUpperCase(),
        active: true,
        deleted_at: null,
        expires_at: {
          gt: now,
        },
      },
      select: {
        id: true,
        code: true,
        name: true,
        discount_type: true,
        discount_value: true,
        min_purchase_amount: true,
        usage_limit: true,
        usage_count: true,
        active: true,
        expires_at: true,
        created_at: true,
      },
    });

    if (!coupon) {
      return {
        valid: false,
        error: "Cupón no encontrado o expirado",
      };
    }

    // Verificar límite de uso
    const usageCount = coupon.usage_count || 0;
    if (coupon.usage_limit && usageCount >= coupon.usage_limit) {
      return {
        valid: false,
        error: "Este cupón ya alcanzó su límite de uso",
      };
    }

    // Verificar monto mínimo de compra
    const minPurchase = Number(coupon.min_purchase_amount || 0);
    if (subtotal < minPurchase) {
      return {
        valid: false,
        error: `Compra mínima de $${minPurchase.toLocaleString()} requerida`,
      };
    }

    // Calcular descuento
    let discount_amount = 0;
    const discountValue = Number(coupon.discount_value);

    if (coupon.discount_type === "percentage") {
      discount_amount = Math.round((subtotal * discountValue) / 100);
    } else if (coupon.discount_type === "fixed") {
      discount_amount = discountValue;
    }

    // Asegurar que el descuento no exceda el subtotal
    discount_amount = Math.min(discount_amount, subtotal);

    return {
      valid: true,
      coupon: {
        ...coupon,
        discount_value: discountValue,
        min_purchase_amount: minPurchase,
      },
      discount_amount,
    };
  } catch (error: any) {
    console.error(`[validateCoupon] Error al validar cupón "${code}":`, error);
    throw handlePrismaError(error);
  }
}

/**
 * Incrementa el contador de uso de un cupón (llamar al crear la orden)
 */
export async function incrementCouponUsage(couponId: number): Promise<void> {
  // Validación ANTES del try-catch
  if (!couponId || couponId <= 0) {
    throw new ValidationError("ID de cupón inválido");
  }

  try {
    await prisma.coupons.update({
      where: { id: couponId },
      data: {
        usage_count: {
          increment: 1,
        },
      },
    });
  } catch (error: any) {
    console.error(`[incrementCouponUsage] Error al incrementar uso del cupón ${couponId}:`, error);
    throw handlePrismaError(error);
  }
}

/**
 * Alterna el estado de featured de un cupón
 */
export async function toggleCouponFeatured(
  couponId: number,
  currentFeatured: boolean
): Promise<void> {
  // Validación ANTES del try-catch
  if (!couponId || couponId <= 0) {
    throw new ValidationError("ID de cupón inválido");
  }
  if (typeof currentFeatured !== "boolean") {
    throw new ValidationError("Estado featured debe ser un booleano");
  }

  try {
    await prisma.coupons.update({
      where: { id: couponId },
      data: {
        featured: !currentFeatured,
      },
    });
  } catch (error: any) {
    console.error(`[toggleCouponFeatured] Error al alternar estado featured del cupón ${couponId}:`, error);
    throw handlePrismaError(error);
  }
}

/**
 * ✅ CREATE - Crear nuevo cupón
 */
export const createCouponService = async (data: {
  code: string;
  name: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_purchase_amount?: number;
  usage_limit?: number;
  expires_at: Date;
}): Promise<Coupon> => {
  // Validación ANTES del try-catch
  if (!data.code || !data.code.trim()) {
    throw new ValidationError("Código de cupón es obligatorio");
  }
  if (!data.name || !data.name.trim()) {
    throw new ValidationError("Nombre de cupón es obligatorio");
  }
  if (!data.discount_type || !["percentage", "fixed"].includes(data.discount_type)) {
    throw new ValidationError("Tipo de descuento debe ser 'percentage' o 'fixed'");
  }
  if (!data.discount_value || data.discount_value <= 0) {
    throw new ValidationError("Valor de descuento debe ser mayor a 0");
  }
  if (data.discount_type === "percentage" && data.discount_value > 100) {
    throw new ValidationError("El descuento porcentual no puede exceder 100%");
  }
  if (!data.expires_at || new Date(data.expires_at) <= new Date()) {
    throw new ValidationError("La fecha de expiración debe ser en el futuro");
  }

  try {
    // Verificar que el código sea único
    const existing = await prisma.coupons.findFirst({
      where: {
        code: data.code.trim().toUpperCase(),
        deleted_at: null,
      },
    });

    if (existing) {
      throw new DuplicateError("Un cupón con este código ya existe");
    }

    // Crear cupón
    const newCoupon = await prisma.coupons.create({
      data: {
        code: data.code.trim().toUpperCase(),
        name: data.name.trim(),
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        min_purchase_amount: data.min_purchase_amount || 0,
        usage_limit: data.usage_limit || null,
        usage_count: 0,
        active: true,
        featured: false,
        expires_at: new Date(data.expires_at),
      },
      select: {
        id: true,
        code: true,
        name: true,
        discount_type: true,
        discount_value: true,
        min_purchase_amount: true,
        usage_limit: true,
        usage_count: true,
        active: true,
        expires_at: true,
        created_at: true,
      },
    });

    return {
      ...newCoupon,
      discount_value: Number(newCoupon.discount_value),
      min_purchase_amount: Number(newCoupon.min_purchase_amount || 0),
    };
  } catch (error: any) {
    if (error instanceof ValidationError || error instanceof DuplicateError) {
      throw error;
    }
    console.error("[createCouponService] Error al crear cupón:", error);
    throw handlePrismaError(error);
  }
};

/**
 * ✅ UPDATE - Actualizar cupón
 */
export const updateCouponService = async (
  couponId: number,
  data: Partial<{
    code: string;
    name: string;
    discount_type: "percentage" | "fixed";
    discount_value: number;
    min_purchase_amount: number;
    usage_limit: number;
    expires_at: Date;
    active: boolean;
  }>
): Promise<Coupon> => {
  // Validación ANTES del try-catch
  if (!couponId || couponId <= 0) {
    throw new ValidationError("ID de cupón inválido");
  }
  if (Object.keys(data).length === 0) {
    throw new ValidationError("Debe proporcionar al menos un campo para actualizar");
  }
  if (data.code && !data.code.trim()) {
    throw new ValidationError("El código de cupón no puede estar vacío");
  }
  if (data.discount_value && data.discount_value <= 0) {
    throw new ValidationError("Valor de descuento debe ser mayor a 0");
  }
  if (data.discount_type && !["percentage", "fixed"].includes(data.discount_type)) {
    throw new ValidationError("Tipo de descuento debe ser 'percentage' o 'fixed'");
  }

  try {
    // Verificar que el cupón existe
    const existing = await prisma.coupons.findUnique({
      where: { id: couponId },
    });

    if (!existing) {
      throw new NotFoundError("Cupón no encontrado");
    }

    // Verificar unicidad del código si se actualiza
    if (data.code && data.code.trim().toUpperCase() !== existing.code) {
      const duplicate = await prisma.coupons.findFirst({
        where: {
          code: data.code.trim().toUpperCase(),
          id: { not: couponId },
          deleted_at: null,
        },
      });

      if (duplicate) {
        throw new DuplicateError("Un cupón con este código ya existe");
      }
    }

    // Actualizar cupón
    const updated = await prisma.coupons.update({
      where: { id: couponId },
      data: {
        ...(data.code && { code: data.code.trim().toUpperCase() }),
        ...(data.name && { name: data.name.trim() }),
        ...(data.discount_type && { discount_type: data.discount_type }),
        ...(data.discount_value && { discount_value: data.discount_value }),
        ...(data.min_purchase_amount !== undefined && {
          min_purchase_amount: data.min_purchase_amount,
        }),
        ...(data.usage_limit !== undefined && { usage_limit: data.usage_limit }),
        ...(data.expires_at && { expires_at: new Date(data.expires_at) }),
        ...(data.active !== undefined && { active: data.active }),
      },
      select: {
        id: true,
        code: true,
        name: true,
        discount_type: true,
        discount_value: true,
        min_purchase_amount: true,
        usage_limit: true,
        usage_count: true,
        active: true,
        expires_at: true,
        created_at: true,
      },
    });

    return {
      ...updated,
      discount_value: Number(updated.discount_value),
      min_purchase_amount: Number(updated.min_purchase_amount || 0),
    };
  } catch (error: any) {
    if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof DuplicateError) {
      throw error;
    }
    console.error(`[updateCouponService] Error al actualizar cupón ${couponId}:`, error);
    throw handlePrismaError(error);
  }
};

/**
 * ✅ DELETE - Eliminar cupón (soft delete)
 */
export const deleteCouponService = async (couponId: number): Promise<void> => {
  // Validación ANTES del try-catch
  if (!couponId || couponId <= 0) {
    throw new ValidationError("ID de cupón inválido");
  }

  try {
    // Verificar que el cupón existe
    const existing = await prisma.coupons.findUnique({
      where: { id: couponId },
    });

    if (!existing) {
      throw new NotFoundError("Cupón no encontrado");
    }

    // Soft delete
    await prisma.coupons.update({
      where: { id: couponId },
      data: {
        deleted_at: new Date(),
        active: false,
      },
    });
  } catch (error: any) {
    if (error instanceof ValidationError || error instanceof NotFoundError) {
      throw error;
    }
    console.error(`[deleteCouponService] Error al eliminar cupón ${couponId}:`, error);
    throw handlePrismaError(error);
  }
};

// ============================================
// ADMIN FUNCTIONS - Coupons
// ============================================

// PUT - Toggle coupon active status
export const toggleCouponStatusService = async (
  couponId: number,
  active: boolean
): Promise<void> => {
  // Validación ANTES del try-catch
  if (!couponId || couponId <= 0) {
    throw new ValidationError("ID de cupón inválido");
  }

  try {
    const existing = await prisma.coupons.findUnique({
      where: { id: couponId },
    });

    if (!existing) {
      throw new NotFoundError("Cupón no encontrado");
    }

    await prisma.coupons.update({
      where: { id: couponId },
      data: { active },
    });
  } catch (error: any) {
    if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
    console.error(
      `[toggleCouponStatusService] Error al cambiar estado de cupón ${couponId}:`,
      error
    );
    throw handlePrismaError(error);
  }
};

// PUT - Toggle coupon featured status (with 3-limit enforcement)
export const toggleCouponFeaturedService = async (
  couponId: number,
  featured: boolean
): Promise<void> => {
  // Validación ANTES del try-catch
  if (!couponId || couponId <= 0) {
    throw new ValidationError("ID de cupón inválido");
  }

  try {
    const existing = await prisma.coupons.findUnique({
      where: { id: couponId },
    });

    if (!existing) {
      throw new NotFoundError("Cupón no encontrado");
    }

    // If trying to set featured to true, check the limit
    if (featured) {
      const activeFeaturedCount = await prisma.coupons.count({
        where: { featured: true, active: true },
      });

      if (activeFeaturedCount >= 3) {
        throw new ValidationError(
          "No se pueden tener más de 3 cupones destacados activos. Desactiva uno primero."
        );
      }
    }

    await prisma.coupons.update({
      where: { id: couponId },
      data: { featured },
    });
  } catch (error: any) {
    if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
    console.error(
      `[toggleCouponFeaturedService] Error al cambiar estado destacado de cupón ${couponId}:`,
      error
    );
    throw handlePrismaError(error);
  }
};

// PUT - Bulk edit coupons (active status)
export const editCouponsService = async (
  couponIds: number[],
  data: { active?: boolean }
): Promise<void> => {
  // Validación ANTES del try-catch
  if (!couponIds || couponIds.length === 0) {
    throw new ValidationError("Debe proporcionar al menos un ID de cupón");
  }
  if (couponIds.some((id) => id <= 0)) {
    throw new ValidationError("Los IDs de cupón deben ser válidos");
  }
  if (Object.keys(data).length === 0) {
    throw new ValidationError("Debe proporcionar al menos un campo para actualizar");
  }

  try {
    // Check if all coupons exist
    const existingCount = await prisma.coupons.count({
      where: { id: { in: couponIds } },
    });

    if (existingCount !== couponIds.length) {
      throw new NotFoundError("Uno o más cupones no fueron encontrados");
    }

    // Update all coupons
    await prisma.coupons.updateMany({
      where: { id: { in: couponIds } },
      data: {
        ...(data.active !== undefined && { active: data.active }),
      },
    });
  } catch (error: any) {
    if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
    console.error("[editCouponsService] Error al editar cupones:", error);
    throw handlePrismaError(error);
  }
};

// DELETE - Bulk soft delete coupons
export const deleteCouponsService = async (couponIds: number[]): Promise<void> => {
  // Validación ANTES del try-catch
  if (!couponIds || couponIds.length === 0) {
    throw new ValidationError("Debe proporcionar al menos un ID de cupón");
  }
  if (couponIds.some((id) => id <= 0)) {
    throw new ValidationError("Los IDs de cupón deben ser válidos");
  }

  try {
    // Check if all coupons exist
    const existingCount = await prisma.coupons.count({
      where: { id: { in: couponIds } },
    });

    if (existingCount !== couponIds.length) {
      throw new NotFoundError("Uno o más cupones no fueron encontrados");
    }

    // Soft delete (mark as deleted)
    await prisma.coupons.updateMany({
      where: { id: { in: couponIds } },
      data: {
        deleted_at: new Date(),
        active: false,
      },
    });
  } catch (error: any) {
    if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
    console.error("[deleteCouponsService] Error al eliminar cupones:", error);
    throw handlePrismaError(error);
  }
};

// GET - Export all coupons for CSV/Excel
export const exportCouponsService = async (): Promise<any[]> => {
  try {
    const coupons = await prisma.coupons.findMany({
      select: {
        id: true,
        code: true,
        discount_type: true,
        discount_value: true,
        min_purchase_amount: true,
        usage_limit: true,
        current_usage: true,
        expires_at: true,
        active: true,
        featured: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: { created_at: "desc" },
    });

    // Format for export
    return coupons.map((c) => ({
      id: c.id,
      code: c.code,
      type: c.discount_type,
      value: Number(c.discount_value),
      minPurchase: Number(c.min_purchase_amount),
      usageLimit: c.usage_limit,
      currentUsage: c.current_usage,
      expiresAt: c.expires_at,
      active: c.active,
      featured: c.featured,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
    }));
  } catch (error: any) {
    console.error("[exportCouponsService] Error al exportar cupones:", error);
    throw handlePrismaError(error);
  }
};
