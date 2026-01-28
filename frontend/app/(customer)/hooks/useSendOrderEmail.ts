'use client';

import { useState } from 'react';
import { useUserSafe } from '@/app/(auth)/hooks/useUserSafe';

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface SendOrderEmailParams {
  orderId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  taxes: number;
  discount?: number;
  total: number;
  shippingAddress: ShippingAddress;
  trackingUrl?: string;
}

/**
 * Hook personalizado para enviar emails de confirmación de orden
 * 
 * @example
 * ```tsx
 * const { sendOrderEmail, isSending, error } = useSendOrderEmail();
 * 
 * const handleSendEmail = async () => {
 *   await sendOrderEmail({
 *     orderId: '12345',
 *     items: [{ productName: 'Product 1', quantity: 2, price: 100 }],
 *     subtotal: 200,
 *     shipping: 10,
 *     taxes: 20,
 *     total: 230,
 *     shippingAddress: { street: '123 Main St', city: 'Bogotá', ... }
 *   });
 * };
 * ```
 */
export function useSendOrderEmail() {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userProfile } = useUserSafe();

  /**
   * Envía un email de confirmación de orden al usuario logueado
   */
  const sendOrderEmail = async (params: SendOrderEmailParams) => {
    // Validar que el usuario esté logueado
    if (!userProfile?.email) {
      const errorMsg = 'Usuario no autenticado. Inicia sesión para enviar el email.';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    setIsSending(true);
    setError(null);

    try {
      const response = await fetch('/api/orders/send-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al enviar email de confirmación');
      }

      return data;
    } catch (err: any) {
      const errorMsg = err.message || 'Error desconocido al enviar email';
      setError(errorMsg);
      console.error('❌ Error enviando email:', err);
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  /**
   * Envía un email de forma silenciosa (no lanza error si falla)
   * Útil para no bloquear el flujo de la aplicación
   */
  const sendOrderEmailSilently = async (params: SendOrderEmailParams) => {
    try {
      await sendOrderEmail(params);
      return { success: true };
    } catch (err) {
      console.warn('⚠️ Email no enviado (silent mode):', err);
      return { success: false, error: err };
    }
  };

  return {
    sendOrderEmail,
    sendOrderEmailSilently,
    isSending,
    error,
    userEmail: userProfile?.email || null,
    userName: userProfile?.name || null,
  };
}
