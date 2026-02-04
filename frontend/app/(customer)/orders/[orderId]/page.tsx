"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ErrorsHandler } from "@/app/errors/errorsHandler";
import { getOrderByIdApi, Order } from "../services/ordersApi";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Package,
  Truck,
  CreditCard,
  MapPin,
  Clock,
  ShoppingBag,
  Calendar,
  CheckCircle2,
  Star,
  Receipt,
  ChevronRight,
  Copy,
  Check,
  Box,
  CircleDot,
} from "lucide-react";
import { convertFromCents } from "../../checkout/services/paymentsApi";
import { TrackingTimeline } from "../components/TrackingTimeline";

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setError("ID no válido");
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const orderData = await getOrderByIdApi(parseInt(orderId));
        setOrder(orderData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al cargar";
        setError(errorMessage);
        ErrorsHandler.showError("Error", errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const copyOrderId = () => {
    navigator.clipboard.writeText(order?.id?.toString() || "");
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "confirmed":
      case "approved":
        return {
          bg: "bg-gradient-to-br from-emerald-950/40 to-emerald-900/20",
          text: "text-emerald-300",
          border: "border-emerald-700/60",
          dot: "bg-emerald-500 shadow-lg shadow-emerald-500/30",
          icon: CheckCircle2,
          label: "Confirmado",
          step: 2,
        };
      case "pending":
        return {
          bg: "bg-gradient-to-br from-amber-950/40 to-amber-900/20",
          text: "text-amber-300",
          border: "border-amber-700/60",
          dot: "bg-amber-500 shadow-lg shadow-amber-500/30",
          icon: Clock,
          label: "Pendiente",
          step: 1,
        };
      case "shipped":
        return {
          bg: "bg-gradient-to-br from-blue-950/40 to-blue-900/20",
          text: "text-blue-300",
          border: "border-blue-700/60",
          dot: "bg-blue-500 shadow-lg shadow-blue-500/30",
          icon: Truck,
          label: "Enviado",
          step: 3,
        };
      case "delivered":
        return {
          bg: "bg-gradient-to-br from-green-950/40 to-green-900/20",
          text: "text-green-300",
          border: "border-green-700/60",
          dot: "bg-green-500 shadow-lg shadow-green-500/30",
          icon: Package,
          label: "Entregado",
          step: 4,
        };
      default:
        return {
          bg: "bg-gradient-to-br from-slate-950/40 to-slate-900/20",
          text: "text-slate-300",
          border: "border-slate-700/60",
          dot: "bg-slate-400 shadow-lg shadow-slate-400/30",
          icon: Package,
          label: status,
          step: 0,
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated gradient background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-600/15 to-cyan-600/15 rounded-full blur-3xl animate-pulse opacity-30"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-600/15 to-slate-600/15 rounded-full blur-3xl animate-pulse opacity-30" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-slate-600/8 to-blue-600/8 rounded-full blur-3xl animate-pulse opacity-20" style={{animationDelay: '2s'}}></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center space-y-6 relative z-10"
        >
          {/* Loading Spinner */}
          <div className="w-24 h-24 mx-auto relative">
            {/* Outer rotating ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-blue-500/50"
            />
            
            {/* Middle rotating ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 rounded-full border-2 border-transparent border-t-cyan-500/40 border-r-cyan-500/20"
            />
            
            {/* Inner icon */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center backdrop-blur-sm ring-1 ring-blue-400/30 shadow-lg shadow-blue-500/20">
                <Package className="w-6 h-6 text-blue-300" />
              </div>
            </motion.div>
          </div>

          {/* Loading Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="space-y-2"
          >
            <p className="text-lg font-semibold bg-gradient-to-r from-blue-300 to-slate-300 bg-clip-text text-transparent">
              Cargando detalles del pedido
            </p>
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-sm text-slate-400 font-medium"
            >
              Por favor espera...
            </motion.p>
          </motion.div>

          {/* Loading Dots */}
          <div className="flex justify-center gap-1.5">
            {[0, 1, 2].map((idx) => (
              <motion.div
                key={idx}
                animate={{ 
                  y: [0, -6, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 1.2, 
                  repeat: Infinity,
                  delay: idx * 0.15
                }}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 shadow-md shadow-blue-500/40"
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated gradient background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-600/10 to-rose-600/10 rounded-full blur-3xl animate-pulse opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-slate-600/8 to-blue-600/8 rounded-full blur-3xl animate-pulse opacity-30" style={{animationDelay: '1s'}}></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 max-w-md w-full"
        >
          <Card className="border-rose-800/30 shadow-2xl shadow-slate-950/50 overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-800/70">
            <CardContent className="p-8 text-center space-y-6">
              {/* Error Icon */}
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-rose-500/20 to-red-500/20 flex items-center justify-center ring-1 ring-rose-500/30 shadow-lg shadow-rose-500/20"
              >
                <Package className="w-8 h-8 text-rose-400" />
              </motion.div>

              {/* Error Text */}
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-slate-100">
                  Error al cargar el pedido
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  {error || "No pudimos encontrar el pedido solicitado."}
                </p>
              </div>

              {/* Action Button */}
              <Button 
                onClick={() => router.push("/orders")} 
                className="w-full gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 py-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver a mis pedidos
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status || "pending");
  const StatusIcon = statusConfig.icon;
  const currentStep = statusConfig.step;
  const subtotal = convertFromCents(
    order.order_items?.reduce((sum, item) => sum + item.subtotal, 0) || 0
  );
  const total = order.total || order.total_amount || 0;

  const steps = [
    { id: 1, label: "Pago recibido", icon: CreditCard },
    { id: 2, label: "Confirmado", icon: CheckCircle2 },
    { id: 3, label: "Enviado", icon: Truck },
    { id: 4, label: "Entregado", icon: Package },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-900 relative overflow-hidden">
      {/* Animated gradient background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-600/15 to-cyan-600/15 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-600/15 to-slate-600/15 rounded-full blur-3xl animate-pulse opacity-30" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-slate-600/8 to-blue-600/8 rounded-full blur-3xl animate-pulse opacity-20" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="relative z-10">
      {/* Header */}
      <div className="border-b border-blue-800/20 bg-gradient-to-r from-slate-900/90 via-slate-900/85 to-blue-900/30 backdrop-blur-xl sticky top-0 z-50 shadow-lg shadow-slate-950/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/orders")}
              className="gap-2 -ml-2 hover:bg-blue-900/30 transition-all duration-300 text-slate-300 hover:text-blue-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Mis pedidos</span>
            </Button>

            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={`${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} gap-1.5 px-4 py-1.5 font-semibold border backdrop-blur-sm shadow-md`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${statusConfig.dot}`}
                />
                {statusConfig.label}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <motion.main
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Order Header Card */}
        <motion.div variants={fadeIn} className="mb-6">
          <Card className="overflow-hidden border-blue-800/30 shadow-xl shadow-slate-950/40 hover:shadow-2xl hover:shadow-blue-500/15 transition-all duration-500 bg-gradient-to-br from-slate-900/80 to-slate-800/50">
            <div className="bg-gradient-to-r from-blue-600/20 via-slate-600/10 to-blue-600/15 px-6 py-8 border-b border-blue-800/20 backdrop-blur-sm relative overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-slate-500/5 blur-2xl"></div>
              <div className="relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/30 to-slate-500/20 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-blue-500/30 relative">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-slate-500/10 blur animate-pulse"></div>
                    <Receipt className="w-7 h-7 text-blue-300 relative z-10" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-slate-300 bg-clip-text text-transparent">
                        Pedido #{order.id}
                      </h1>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-blue-800/40 transition-all duration-300"
                        onClick={copyOrderId}
                      >
                        {copiedId ? (
                          <Check className="w-4 h-4 text-emerald-400 font-bold" />
                        ) : (
                          <Copy className="w-4 h-4 text-slate-400" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-slate-300 flex items-center gap-1.5 mt-1 font-medium">
                      <Calendar className="w-4 h-4" />
                      {order.created_at && formatDate(order.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 sm:text-right">
                  <span className="text-sm text-slate-400 font-semibold">Total:</span>
                  <span className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-slate-300 bg-clip-text text-transparent">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
              </div>
            </div>

            {/* Progress Tracker */}
            <CardContent className="p-8">
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-gradient-to-r from-slate-700 to-slate-600 mx-14 sm:mx-20 rounded-full shadow-md shadow-slate-950/20">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full shadow-lg shadow-blue-500/40"
                  />
                </div>

                {/* Steps */}
                <div className="relative grid grid-cols-4 gap-2">
                  {steps.map((step) => {
                    const isCompleted = step.id < currentStep;
                    const isCurrent = step.id === currentStep;
                    const StepIcon = step.icon;

                    return (
                      <div key={step.id} className="flex flex-col items-center">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: step.id * 0.1 }}
                          className={`
                            relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 font-semibold shadow-lg
                            ${
                              isCompleted
                                ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-500/40 ring-2 ring-emerald-400/40"
                                : isCurrent
                                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/50 ring-3 ring-blue-400/30"
                                  : "bg-gradient-to-br from-slate-700 to-slate-800 text-slate-400"
                            }
                          `}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-6 h-6" />
                          ) : (
                            <StepIcon className="w-6 h-6" />
                          )}
                        </motion.div>
                        <span
                          className={`mt-3 text-xs font-semibold text-center leading-tight ${
                            isCompleted || isCurrent
                              ? "text-slate-100"
                              : "text-slate-500"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Products & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Products */}
            <motion.div variants={fadeIn}>
              <Card className="border-blue-800/30 shadow-xl shadow-slate-950/40 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-800/50">
                <CardHeader className="pb-4 bg-gradient-to-r from-slate-900/60 to-blue-900/30 border-b border-blue-800/20 backdrop-blur">
                  <CardTitle className="text-base font-semibold flex items-center gap-3 text-slate-200">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30">
                      <ShoppingBag className="w-4 h-4 text-white" />
                    </div>
                    Productos ({order.order_items?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-800/40">
                    <AnimatePresence>
                      {order.order_items?.map((item, idx) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="p-5 hover:bg-gradient-to-r hover:from-blue-950/30 hover:to-slate-900/40 transition-all duration-300 group"
                        >
                          <div className="flex gap-4">
                            {/* Product Color/Image */}
                            <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ring-1 ring-blue-500/30 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all duration-300"
                              style={{
                                backgroundColor: item.color_code || "#f1f5f9",
                              }}
                            >
                              <Box className="w-6 h-6 text-white/80 drop-shadow-lg font-bold" />
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-slate-100 text-sm line-clamp-1 group-hover:text-blue-300 transition-colors">
                                {item.products?.name || "Producto"}
                              </h3>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {item.products?.brands?.name && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs font-medium bg-gradient-to-r from-blue-900/50 to-blue-800/30 text-blue-300 border-blue-700/60"
                                  >
                                    {item.products.brands.name}
                                  </Badge>
                                )}
                                {item.size && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs font-medium border-slate-700/60 bg-slate-900/30 text-slate-300"
                                  >
                                    Talla: {item.size}
                                  </Badge>
                                )}
                                {item.color_code && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs font-medium gap-1.5 border-slate-700/60 bg-slate-900/30 text-slate-300"
                                  >
                                    <span
                                      className="w-2.5 h-2.5 rounded-full ring-1 ring-slate-400/60"
                                      style={{
                                        backgroundColor: item.color_code,
                                      }}
                                    />
                                    Color
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center justify-between mt-3">
                                <span className="text-sm text-slate-400 font-medium group-hover:text-blue-300 transition-colors">
                                  {formatCurrency(item.price)} × {item.quantity}
                                </span>
                                <span className="font-semibold text-slate-100 group-hover:text-blue-300 transition-colors">
                                  {formatCurrency(item.subtotal)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Info */}
            {order.payment && (
              <motion.div variants={fadeIn}>
                <Card className="border-blue-800/30 shadow-xl shadow-slate-950/40 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-800/50">
                  <CardHeader className="pb-4 bg-gradient-to-r from-slate-900/60 to-blue-900/30 border-b border-blue-800/20 backdrop-blur">
                    <CardTitle className="text-base font-semibold flex items-center gap-3 text-slate-200">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/30">
                        <CreditCard className="w-4 h-4 text-white" />
                      </div>
                      Información de pago
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
                          Método de pago
                        </p>
                        <p className="font-semibold capitalize text-slate-100">
                          {order.payment.payment_method}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
                          Estado
                        </p>
                        <Badge
                          variant="outline"
                          className={`${getStatusConfig(order.payment.payment_status).bg} ${getStatusConfig(order.payment.payment_status).text} ${getStatusConfig(order.payment.payment_status).border} border backdrop-blur-sm font-medium`}
                        >
                          {order.payment.payment_status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
                          Monto pagado
                        </p>
                        <p className="font-semibold text-xl bg-gradient-to-r from-blue-300 to-slate-300 bg-clip-text text-transparent drop-shadow">
                          {formatCurrency(order.payment.amount_in_cents / 100)}
                        </p>
                      </div>
                      {order.payment.transaction_id && (
                        <div className="space-y-2">
                          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
                            ID Transacción
                          </p>
                          <p className="font-mono text-xs truncate text-slate-300 bg-slate-800/50 rounded px-2 py-1.5">
                            {order.payment.transaction_id}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <motion.div variants={fadeIn}>
              <Card className="border-emerald-700/40 shadow-xl shadow-slate-950/40 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-800/50">
                <CardHeader className="pb-4 bg-gradient-to-r from-slate-900/60 to-emerald-900/20 border-b border-emerald-700/40 backdrop-blur">
                  <CardTitle className="text-base font-semibold flex items-center gap-3 text-slate-200">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/30">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    Dirección de envío
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <p className="font-semibold text-slate-100 text-base">
                      {order.addresses.address}
                    </p>
                    <p className="text-sm text-slate-300 font-medium">
                      {order.addresses.city}, {order.addresses.department}
                    </p>
                    <p className="text-sm text-slate-300 font-medium">
                      {order.addresses.country}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Summary */}
            <motion.div variants={fadeIn}>
              <Card className="border-blue-800/30 shadow-xl shadow-slate-950/40 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-800/50">
                <CardHeader className="pb-4 border-b border-blue-800/20 bg-gradient-to-r from-slate-900/60 to-blue-900/20 backdrop-blur">
                  <CardTitle className="text-base font-semibold text-slate-200">
                    Resumen del pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300 font-medium">Subtotal</span>
                    <span className="text-slate-100 font-semibold text-base">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300 font-medium">Envío</span>
                    <span className="font-semibold text-emerald-300 text-base">Gratis</span>
                  </div>
                  <Separator className="bg-gradient-to-r from-blue-800/20 to-slate-700/20" />
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-base font-semibold text-slate-100">Total</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-slate-300 bg-clip-text text-transparent drop-shadow-lg">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Delivery Info */}
            {order.status === "delivered" && order.delivered_at && (
              <motion.div variants={fadeIn}>
                <Card className="border-emerald-700/40 bg-gradient-to-br from-slate-900/80 to-slate-800/50 shadow-xl shadow-slate-950/40 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 ring-1 ring-emerald-400/30 flex-shrink-0">
                        <CheckCircle2 className="w-6 h-6 text-white font-semibold" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-slate-100">
                          Entregado
                        </p>
                        <p className="text-sm text-slate-300 font-medium">
                          {formatDate(order.delivered_at)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Actions */}
            <motion.div variants={fadeIn} className="space-y-4">
              <Button
                className="w-full gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 text-base py-6 uppercase tracking-wide"
                size="lg"
                onClick={() => router.push("/")}
              >
                <ShoppingBag className="w-5 h-5" />
                Seguir comprando
              </Button>

              {order.status === "delivered" && (
                <Button 
                  variant="outline" 
                  className="w-full gap-2 text-slate-300 border-slate-700/60 hover:bg-blue-950/40 hover:border-blue-700/60 font-semibold transition-all duration-300 text-base py-6 uppercase tracking-wide" 
                  size="lg"
                >
                  <Star className="w-5 h-5 text-amber-400" />
                  Calificar productos
                </Button>
              )}
            </motion.div>

            {/* Tracking Timeline Component */}
            <motion.div variants={fadeIn}>
              <TrackingTimeline orderId={parseInt(orderId)} autoUpdate={true} />
            </motion.div>

            {/* Help Card */}
            <motion.div variants={fadeIn}>
              <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 border-blue-800/30 shadow-xl shadow-slate-950/40 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mt-0.5 shadow-md shadow-blue-500/30 ring-1 ring-blue-400/30 flex-shrink-0">
                      <CircleDot className="w-5 h-5 text-white font-semibold" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-slate-100">
                        Seguimiento en tiempo real
                      </p>
                      <p className="text-sm text-slate-300 mt-2 leading-relaxed font-medium">
                        Recibirás actualizaciones por correo electrónico sobre
                        el estado de tu pedido.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.main>
      </div>
    </div>
  );
}
