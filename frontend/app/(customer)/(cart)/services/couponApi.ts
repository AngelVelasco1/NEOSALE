"use client";

import { api } from "@/config/api";
import type { Coupon, CouponValidationResponse } from "../types/coupon";

/**
 * Obtiene los últimos 3 cupones activos disponibles
 */
export async function getActiveCoupons(): Promise<Coupon[]> {
  try {
    const response = await api.get(`/api/coupons/active`);
    const data = response.data;
    return data.coupons || [];
  } catch (error) {
    
    return [];
  }
}

/**
 * Valida un código de cupón para el carrito actual
 */
export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<CouponValidationResponse> {
  try {
    const response = await api.post(`/api/coupons/validate`, {
      code,
      subtotal,
    });

    const data = response.data;

    if (data.success === false) {
      return {
        valid: false,
        error: data.message || "Cupón inválido",
      };
    }

    return {
      valid: true,
      coupon: data.coupon,
      discount_amount: data.discount_amount,
    };
  } catch (error) {
    
    return {
      valid: false,
      error: "Error al validar el cupón",
    };
  }
}
