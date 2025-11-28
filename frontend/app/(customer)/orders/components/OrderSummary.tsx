"use client";

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CartProductsInfo } from '../../types';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Truck, Shield, CheckCircle2, Sparkles } from 'lucide-react';

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
  const hasDiscount = total > 100000;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-4"
    >
      <Card className="relative overflow-hidden border border-slate-700/50 shadow-2xl bg-slate-800/40 backdrop-blur-xl">
        {/* Subtle animated gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-slate-800/50 via-slate-900/50 to-slate-800/50" />


        {/* Decorative animated border */}
        <div className="absolute top-0 left-0 right-0 h-0
        5 bg-linear-to-r from-transparent via-indigo-500 to-transparent">
          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            className="h-full w-1/3 bg-linear-to-r from-transparent via-cyan-400 to-transparent blur-sm"
          />
        </div>

        {/* Header */}
        <CardHeader className="relative pb-5 pt-6 px-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                className="relative p-3 rounded-2xl bg-linear-to-br from-violet-600 via-violet-700 to-violet-800 shadow-lg shadow-violet-500/30"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-2xl bg-linear-to-br from-violet-500 to-violet-600 blur-xl"
                />
                <ShoppingBag className="w-5 h-5 text-white relative z-10" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  Resumen de compra
                </h3>
                <Badge
                  variant="secondary"
                  className="mt-1.5 bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 text-slate-300 font-semibold text-xs"
                >
                  {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-6 px-6 pb-6 pt-6">
          {/* Products list with scroll */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto py-1 px-1 scrollbar-thin scrollbar-thumb-slate-600/50 scrollbar-track-transparent">
            <AnimatePresence>
              {cartItems.map((item, index) => (
                <motion.div
                  key={`${item.id}-${item.color_code}-${item.size}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="group relative rounded-2xl p-4 bg-slate-700/30 hover:bg-slate-700/50 backdrop-blur-sm transition-all duration-300 border border-slate-600/50 hover:border-slate-500/70 shadow-lg hover:shadow-xl"
                >
                  <div className="relative flex justify-between items-center gap-4">
                    <div className="flex-1 min-w-0 space-y-2.5">
                      <p className="text-sm font-bold text-white truncate">
                        {item.title || item.name}
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/50 backdrop-blur-sm border border-slate-600/50">
                          <span className="text-[10px] font-semibold text-slate-300">
                            Cantidad:
                          </span>
                          <span className="text-[10px] font-bold text-white">
                            {item.quantity}
                          </span>
                        </div>

                        {item.color_code && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/50 backdrop-blur-sm border border-slate-600/50">
                            <div
                              className="w-3 h-3 rounded-full ring-2 ring-slate-400/50 shadow-md"
                              style={{ backgroundColor: item.color_code }}
                            />
                            <span className="text-[10px] font-semibold text-slate-300">
                              {item.color}
                            </span>
                          </div>
                        )}

                        {item.size && (
                          <div className="px-3 py-1.5 rounded-lg bg-slate-700/50 backdrop-blur-sm border border-slate-600/50">
                            <span className="text-[10px] font-semibold text-slate-300">
                              Talla: {item.size}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right space-y-1 shrink-0">
                      <p className="text-base font-extrabold text-white">
                        ${(item.price * item.quantity).toLocaleString('es-CO')}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        ${item.price.toLocaleString('es-CO')} c/u
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Separator className="bg-slate-700/50" />

          {/* Cost breakdown */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400 font-medium">Subtotal</span>
              <span className="font-bold text-white">${subtotal.toLocaleString('es-CO')}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-slate-700/50 backdrop-blur-sm">
                  <Truck className="w-3.5 h-3.5 text-slate-300" />
                </div>
                <span className="text-slate-400 font-medium">Envío</span>
              </div>
              <div className="flex items-center gap-2">
                {shipping === 0 ? (
                  <>
                    <Badge className="bg-linear-to-r from-emerald-500 to-teal-500 text-white border-0 text-[10px] px-3 py-0.5 font-bold shadow-lg shadow-emerald-500/30">
                      GRATIS
                    </Badge>
                    <span className="font-semibold line-through text-slate-500 text-xs">
                      $15.000
                    </span>
                  </>
                ) : (
                  <span className="font-bold text-white">${shipping.toLocaleString('es-CO')}</span>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400 font-medium">IVA (19%)</span>
              <span className="font-bold text-white">${taxes.toLocaleString('es-CO')}</span>
            </div>

            {hasDiscount && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-between items-center text-sm p-3 rounded-xl bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/30"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Descuento aplicado</span>
                </div>
                <span className="text-emerald-400 font-extrabold">-$15.000</span>
              </motion.div>
            )}
          </motion.div>

          <Separator className="bg-slate-700/50" />

          {/* Total highlighted */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative p-6 rounded-2xl bg-linear-to-br from-violet-600/20 via-violet-700/20 to-slate-950/60 backdrop-blur-sm border border-violet-500/30 shadow-2xl shadow-violet-500/20"
          >
            <motion.div
              animate={{ scale: [1, 1.02, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-2xl bg-linear-to-br from-violet-600/20 to-slate-800/20 blur-xl"
            />

            <div className="relative flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  Total a pagar
                </p>
                <p className="text-4xl font-extrabold text-white">
                  ${total.toLocaleString('es-CO')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Benefits and guarantees */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3 p-4 rounded-2xl bg-slate-700/30 backdrop-blur-sm border border-slate-600/50"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-700/50 backdrop-blur-sm border border-slate-600/50">
                <Truck className="w-4 h-4 text-slate-300" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-white">Envío rápido y seguro</p>
                <p className="text-[10px] text-slate-400 mt-0.5">3-5 días hábiles a todo el país</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-700/50 backdrop-blur-sm border border-slate-600/50">
                <Shield className="w-4 h-4 text-slate-300" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-white">Compra 100% protegida</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Métodos seguros de pago y envío</p>
              </div>
            </div>
          </motion.div>

          {/* Processing state */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 rounded-2xl bg-violet-600/10 backdrop-blur-sm border border-violet-500/30">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-5 h-5 border-3 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                      <div className="absolute inset-0 w-5 h-5 border-3 border-violet-500/30 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-violet-300">
                        Procesando tu orden
                      </p>
                      <p className="text-xs text-violet-400/70">
                        Por favor espera un momento...
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Free shipping info */}
          {!hasDiscount && total < 100000 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="p-4 rounded-2xl bg-violet-600/10 backdrop-blur-sm border border-violet-500/30"
            >
              <p className="text-xs text-violet-300 font-bold mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Añade ${(100000 - total).toLocaleString('es-CO')} más para envío gratis
              </p>
              <div className="relative h-2 bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(total / 100000) * 100}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="h-full bg-linear-to-r from-violet-500 via-violet-600 to-violet-700 rounded-full shadow-lg shadow-violet-500/50"
                />
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}