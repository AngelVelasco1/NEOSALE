import { prisma } from "../lib/prisma";

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
}

/**
 * Valida un código de cupón contra el subtotal del carrito
 */
export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<CouponValidationResult> {
  const now = new Date();

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
}

/**
 * Incrementa el contador de uso de un cupón (llamar al crear la orden)
 */
export async function incrementCouponUsage(couponId: number): Promise<void> {
  await prisma.coupons.update({
    where: { id: couponId },
    data: {
      usage_count: {
        increment: 1,
      },
    },
  });
}

/**
 * Alterna el estado de featured de un cupón
 */
export async function toggleCouponFeatured(
  couponId: number,
  currentFeatured: boolean
): Promise<void> {
  await prisma.coupons.update({
    where: { id: couponId },
    data: {
      featured: !currentFeatured,
    },
  });
}
