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
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const hasDiscount = total > 100000;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-4"
    >
      <Card className="relative overflow-hidden border-0 shadow-2xl shadow-indigo-500/20 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-blue-600/10 to-indigo-500/10" />

        {/* Decorative animated border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent">
          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            className="h-full w-1/3 bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-sm"
          />
        </div>

        {/* Header */}
        <CardHeader className="relative pb-4 pt-6 px-6 border-b border-slate-700/50">
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
                className="relative p-3 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 shadow-lg shadow-indigo-500/40"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-400 blur-lg"
                />
                <ShoppingBag className="w-5 h-5 text-white relative z-10" />
              </motion.div>
              <div>
                <h3 className="text-xl font-extrabold bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent flex items-center gap-2">
                  Resumen de compra
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </h3>
                <Badge
                  variant="secondary"
                  className="mt-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 font-semibold text-xs"
                >
                  {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-6 px-6 pb-6 pt-6">
          {/* Lista de productos con scroll */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto py-1 px-1 scrollbar-thin scrollbar-thumb-indigo-500/50 scrollbar-track-slate-800/50">
            <AnimatePresence>
              {cartItems.map((item, index) => (
                <motion.div
                  key={`${item.id}-${item.color_code}-${item.size}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="group relative rounded-xl p-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 hover:from-slate-800/70 hover:to-slate-900/70 transition-all duration-300 shadow-lg hover:shadow-xl border border-slate-700/50 hover:border-indigo-500/30"
                >
                  {/* Hover glow effect */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-xl"
                  />

                  <div className="relative flex justify-between items-center gap-4">
                    <div className="flex-1 min-w-0 space-y-2.5">
                      <p className="text-sm font-bold text-slate-100 truncate group-hover:bg-gradient-to-r group-hover:from-indigo-300 group-hover:to-purple-300 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                        {item.title || item.name}
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-indigo-500/40">
                          <span className="text-[10px] font-semibold text-indigo-300">
                            Cantidad:
                          </span>
                          <span className="text-[10px] font-bold text-indigo-200">
                            {item.quantity}
                          </span>
                        </div>

                        {item.color_code && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/40">
                            <div
                              className="w-3 h-3 rounded-full ring-2 ring-slate-200/50 shadow-md"
                              style={{ backgroundColor: item.color_code }}
                            />
                            <span className="text-[10px] font-semibold text-purple-300">
                              {item.color}
                            </span>
                          </div>
                        )}

                        {item.size && (
                          <div className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/40">
                            <span className="text-[10px] font-semibold text-cyan-300">
                              Talla: {item.size}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right space-y-1 flex-shrink-0">
                      <p className="text-base font-extrabold bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
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

          <Separator className="bg-gradient-to-r from-transparent via-slate-600 to-transparent" />

          {/* Desglose de costos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-3.5"
          >
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400 font-medium">Subtotal</span>
              <span className="font-bold text-slate-200">${subtotal.toLocaleString('es-CO')}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                  <Truck className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <span className="text-slate-400 font-medium">Envío</span>
              </div>
              <div className="flex items-center gap-2">
                {shipping === 0 ? (
                  <>
                    <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0 text-[10px] px-2.5 py-0.5 font-bold shadow-lg shadow-emerald-500/30">
                      GRATIS
                    </Badge>
                    <span className="font-semibold line-through text-slate-500 text-xs">
                      $15.000
                    </span>
                  </>
                ) : (
                  <span className="font-bold text-slate-200">${shipping.toLocaleString('es-CO')}</span>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400 font-medium">IVA (19%)</span>
              <span className="font-bold text-slate-200">${taxes.toLocaleString('es-CO')}</span>
            </div>

            {hasDiscount && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-between items-center text-sm p-3 rounded-xl bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 font-bold">Descuento aplicado</span>
                </div>
                <span className="text-emerald-300 font-extrabold">-$15.000</span>
              </motion.div>
            )}
          </motion.div>

          <Separator className="bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

          {/* Total destacado */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative p-5 rounded-2xl bg-gradient-to-br from-indigo-600/30 via-purple-600/30 to-indigo-700/30 border-2 border-indigo-500/40 shadow-2xl shadow-indigo-500/30"
          >
            <motion.div
              animate={{
                scale: [1, 1.02, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-xl"
            />

            <div className="relative flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-400 font-semibold mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Total a pagar
                </p>
                <p className="text-4xl font-extrabold bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
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
            className="space-y-3 p-4 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-500/40">
                <Truck className="w-4 h-4 text-indigo-300" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-200">Envío rápido y seguro</p>
                <p className="text-[10px] text-slate-400 mt-0.5">3-5 días hábiles a todo el país</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/40">
                <Shield className="w-4 h-4 text-purple-300" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-200">Compra 100% protegida</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Métodos seguros de pago y envío</p>
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
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-2 border-indigo-500/40">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-5 h-5 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      <div className="absolute inset-0 w-5 h-5 border-3 border-indigo-400/30 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-indigo-300">
                        Procesando tu orden
                      </p>
                      <p className="text-xs text-indigo-400/80">
                        Por favor espera un momento...
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Información de envío gratis */}
          {!hasDiscount && total < 100000 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="p-4 rounded-2xl bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30"
            >
              <p className="text-xs text-amber-300 font-bold mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Añade ${(100000 - total).toLocaleString('es-CO')} más para envío gratis
              </p>
              <div className="relative h-2 bg-amber-950/50 rounded-full overflow-hidden border border-amber-700/30">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(total / 100000) * 100}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-full shadow-lg shadow-amber-500/50"
                />
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}