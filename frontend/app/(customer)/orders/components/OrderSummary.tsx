"use client";

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CartProductsInfo } from '../../types';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Truck, Shield, CheckCircle2 } from 'lucide-react';

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
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const hasDiscount = total > 100000; // Envío gratis se calcula con el total (incluye IVA)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-4"
    >
      <Card className="overflow-hidden border-0 shadow-2xl shadow-purple-500/10 ring-1 ring-purple-500/10 bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-sm">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

        {/* Header mejorado */}
        <CardHeader className="pb-4 pt-6 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.1
                }}
                className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30"
              >
                <ShoppingBag className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  Resumen de compra
                </h3>
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 ring-1 ring-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-medium"
                >
                  {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
                </Badge>
              </div>
            </div>

          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-6 pb-6">
          {/* Lista de productos con scroll */}
          <div className="space-y-3 max-h-[280px] overflow-y-auto py-1 px-2 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
            <AnimatePresence>
              {cartItems.map((item, index) => (
                <motion.div
                  key={`${item.id}-${item.color_code}-${item.size}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="group relative  rounded-2xl p-4 bg-gradient-to-br from-card to-card/50 hover:from-blue-500/5 hover:to-purple-500/5 transition-all duration-300 shadow-sm hover:shadow-md ring-1 ring-purple-500/10 hover:ring-purple-500/30"
                >
                  {/* Decorative corner gradient */}


                  <div className="relative flex justify-between items-center gap-4">
                    <div className="flex-1 min-w-0 space-y-2">
                      <p className="text-sm font-semibold truncate group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                        {item.title || item.name}
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-500/10 ring-1 ring-blue-500/20">
                          <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-400">
                            Cantidad:
                          </span>
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-300">
                            {item.quantity}
                          </span>
                        </div>

                        {item.color_code && (
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 ring-1 ring-purple-500/20">
                            <div
                              className="w-3 h-3 rounded-full ring-2 ring-white dark:ring-gray-800 shadow-sm"
                              style={{ backgroundColor: item.color_code }}
                            />
                            <span className="text-[10px] font-medium text-purple-700 dark:text-purple-400">
                              {item.color}
                            </span>
                          </div>
                        )}

                        {item.size && (
                          <div className="px-2 py-1 rounded-lg bg-gradient-to-r from-indigo-500/10 to-blue-500/10 ring-1 ring-indigo-500/20">
                            <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-400">
                              Talla: {item.size}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right space-y-1 flex-shrink-0">
                      <p className="text-base font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                        ${(item.price * item.quantity).toLocaleString('es-CO')}
                      </p>
                      <p className="text-[10px] text-muted-foreground/70 font-medium">
                        ${item.price.toLocaleString('es-CO')} c/u
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Separator className="bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

          {/* Desglose de costos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">${subtotal.toLocaleString('es-CO')}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Envío</span>
              </div>
              <div className="flex items-center gap-2">
                {shipping === 0 ? (
                  <>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-[10px] px-2 py-0">
                      GRATIS
                    </Badge>
                    <span className="font-medium line-through text-muted-foreground text-xs">
                      $15.000
                    </span>
                  </>
                ) : (
                  <span className="font-medium">${shipping.toLocaleString('es-CO')}</span>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">IVA (19%)</span>
              <span className="font-medium">${taxes.toLocaleString('es-CO')}</span>
            </div>

            {hasDiscount && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-between items-center text-sm p-2 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 ring-1 ring-green-500/20"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 dark:text-green-400 font-medium">Descuento aplicado</span>
                </div>
                <span className="text-green-700 dark:text-green-400 font-bold">-$15.000</span>
              </motion.div>
            )}
          </motion.div>

          <Separator className="bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

          {/* Total destacado */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative p-4 rounded-2xl bg-gradient-to-br from-blue-500/15 via-indigo-500/15 to-blue-600/15 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-500/20"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total a pagar</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  ${total.toLocaleString('es-CO')}
                </p>
              </div>

            </div>
          </motion.div>

          {/* Beneficios y garantías */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-2.5 p-4 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border-2 border-slate-200/90"
          >
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium">Envío rápido y seguro</p>
                <p className="text-[10px] text-muted-foreground">3-5 días hábiles a todo el país</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                <Shield className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium">Compra 100% protegida</p>
                <p className="text-[10px] text-muted-foreground">Con metodos seguros de pago y envio</p>
              </div>
            </div>


          </motion.div>

          {/* Estado de procesamiento */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 ring-2 ring-blue-500/30">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-5 h-5 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <div className="absolute inset-0 w-5 h-5 border-3 border-blue-400/30 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                        Procesando tu orden
                      </p>
                      <p className="text-xs text-blue-600/70 dark:text-blue-400/70">
                        Por favor espera un momento...
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Información de envío gratis - Calculado con el total (incluye IVA) */}
          {!hasDiscount && total < 100000 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 ring-1 ring-amber-500/20"
            >
              <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                💡 Añade ${(100000 - total).toLocaleString('es-CO')} más para envío gratis
              </p>
              <div className="mt-2 h-1.5 bg-amber-200/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(total / 100000) * 100}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                />
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}