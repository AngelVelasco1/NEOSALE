"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CartProductsInfo } from '../../types';
import React from 'react';

interface OrderSummaryProps {
  cartItems: CartProductsInfo[];
  subtotal: number;
  shipping: number;
  taxes: number;
  total: number;
  isProcessing?: boolean;
}

export const OrderSummary = ({
  cartItems,
  subtotal,
  shipping,
  taxes,
  total,
  isProcessing = false
}: OrderSummaryProps) => {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Resumen de tu orden</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Lista de productos */}
        <div className="space-y-3">
          {cartItems.map((item, index) => (
            <div key={`${item.id}-${item.color_code}-${item.size}-${index}`} className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.title || item.name}</p>
                <p className="text-sm text-muted-foreground">
                  Cantidad: {item.quantity}
                </p>
                {item.color_code && (
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: item.color_code }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {item.color || item.color_code}
                    </span>
                  </div>
                )}
                {item.size && (
                  <p className="text-xs text-muted-foreground">
                    Talla: {item.size}
                  </p>
                )}
              </div>
              <p className="text-sm font-medium ml-2">
                ${(item.price * item.quantity).toLocaleString('es-CO')}
              </p>
            </div>
          ))}
        </div>

        <Separator />

        {/* Totales */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString('es-CO')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Envío</span>
            <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
              {shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString('es-CO')}`}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>IVA (19%)</span>
            <span>${taxes.toLocaleString('es-CO')}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toLocaleString('es-CO')}</span>
          </div>
        </div>

        {/* Información adicional */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Envío gratis en compras superiores a $100.000</p>
          <p>• Tiempo de entrega: 2-3 días hábiles</p>
          <p>• Garantía de satisfacción 100%</p>
        </div>

        {/* Estado del proceso */}
        {isProcessing && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Procesando tu orden...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}