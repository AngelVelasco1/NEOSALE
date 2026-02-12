"use client";

import { FRONT_CONFIG } from "@/config/credentials.js";
import type { Coupon, CouponValidationResponse } from "../types/coupon";

const API_URL = FRONT_CONFIG.api_origin;

/**
 * Obtiene los últimos 3 cupones activos disponibles
 */
export async function getActiveCoupons(): Promise<Coupon[]> {
  try {
    const response = await fetch(`${API_URL}/api/coupons/active`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Error al obtener cupones");
    }

    const data = await response.json();
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
    const response = await fetch(`${API_URL}/api/coupons/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ code, subtotal }),
    });

    const data = await response.json();

    if (!response.ok) {
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
