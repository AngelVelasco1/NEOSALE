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
          bg: "bg-emerald-50 dark:bg-emerald-950/30",
          text: "text-emerald-700 dark:text-emerald-400",
          border: "border-emerald-200 dark:border-emerald-800",
          dot: "bg-emerald-500",
          icon: CheckCircle2,
          label: "Confirmado",
          step: 2,
        };
      case "pending":
        return {
          bg: "bg-amber-50 dark:bg-amber-950/30",
          text: "text-amber-700 dark:text-amber-400",
          border: "border-amber-200 dark:border-amber-800",
          dot: "bg-amber-500",
          icon: Clock,
          label: "Pendiente",
          step: 1,
        };
      case "shipped":
        return {
          bg: "bg-blue-50 dark:bg-blue-950/30",
          text: "text-blue-700 dark:text-blue-400",
          border: "border-blue-200 dark:border-blue-800",
          dot: "bg-blue-500",
          icon: Truck,
          label: "Enviado",
          step: 3,
        };
      case "delivered":
        return {
          bg: "bg-green-50 dark:bg-green-950/30",
          text: "text-green-700 dark:text-green-400",
          border: "border-green-200 dark:border-green-800",
          dot: "bg-green-500",
          icon: Package,
          label: "Entregado",
          step: 4,
        };
      default:
        return {
          bg: "bg-muted",
          text: "text-muted-foreground",
          border: "border-border",
          dot: "bg-muted-foreground",
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <div className="relative w-16 h-16 mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-3 border-primary/20 rounded-full border-t-primary"
            />
            <Package className="absolute inset-0 m-auto w-6 h-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            Cargando detalles del pedido...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
              <Package className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-1">
                Error al cargar el pedido
              </h2>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button onClick={() => router.push("/orders")} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a mis pedidos
            </Button>
          </CardContent>
        </Card>
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
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/orders")}
              className="gap-2 -ml-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Mis pedidos</span>
            </Button>

            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={`${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} gap-1.5 px-3 py-1`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}
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
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 px-6 py-5 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Receipt className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl font-bold">Pedido #{order.id}</h1>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={copyOrderId}
                      >
                        {copiedId ? (
                          <Check className="w-3.5 h-3.5 text-green-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {order.created_at && formatDate(order.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-baseline gap-1 sm:text-right">
                  <span className="text-sm text-muted-foreground">Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Tracker */}
            <CardContent className="p-6">
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted mx-12 sm:mx-16">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-primary rounded-full"
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
                            relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                            ${
                              isCompleted
                                ? "bg-primary text-primary-foreground"
                                : isCurrent
                                  ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                                  : "bg-muted text-muted-foreground"
                            }
                          `}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <StepIcon className="w-5 h-5" />
                          )}
                        </motion.div>
                        <span
                          className={`mt-2 text-xs font-medium text-center ${
                            isCompleted || isCurrent
                              ? "text-foreground"
                              : "text-muted-foreground"
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
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-primary" />
                    Productos ({order.order_items?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    <AnimatePresence>
                      {order.order_items?.map((item, idx) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex gap-4">
                            {/* Product Color/Image */}
                            <div
                              className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 ring-1 ring-border"
                              style={{
                                backgroundColor: item.color_code || "#f1f5f9",
                              }}
                            >
                              <Box className="w-6 h-6 text-white/80 drop-shadow" />
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm line-clamp-1">
                                {item.products?.name || "Producto"}
                              </h3>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {item.products?.brands?.name && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs font-normal"
                                  >
                                    {item.products.brands.name}
                                  </Badge>
                                )}
                                {item.size && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs font-normal"
                                  >
                                    Talla: {item.size}
                                  </Badge>
                                )}
                                {item.color_code && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs font-normal gap-1"
                                  >
                                    <span
                                      className="w-2.5 h-2.5 rounded-full ring-1 ring-border"
                                      style={{
                                        backgroundColor: item.color_code,
                                      }}
                                    />
                                    Color
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-sm text-muted-foreground">
                                  {formatCurrency(item.price)} × {item.quantity}
                                </span>
                                <span className="font-semibold">
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
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-primary" />
                      Información de pago
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Método de pago
                        </p>
                        <p className="font-medium capitalize">
                          {order.payment.payment_method}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Estado
                        </p>
                        <Badge
                          variant="outline"
                          className={`${getStatusConfig(order.payment.payment_status).bg} ${getStatusConfig(order.payment.payment_status).text} ${getStatusConfig(order.payment.payment_status).border}`}
                        >
                          {order.payment.payment_status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          Monto pagado
                        </p>
                        <p className="font-semibold text-primary">
                          {formatCurrency(order.payment.amount_in_cents / 100)}
                        </p>
                      </div>
                      {order.payment.transaction_id && (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            ID Transacción
                          </p>
                          <p className="font-mono text-xs truncate">
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
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Dirección de envío
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="font-medium">{order.addresses.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.addresses.city}, {order.addresses.department}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.addresses.country}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Summary */}
            <motion.div variants={fadeIn}>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">
                    Resumen del pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Envío</span>
                    <span className="text-green-600">Gratis</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-lg text-primary">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Delivery Info */}
            {order.status === "delivered" && order.delivered_at && (
              <motion.div variants={fadeIn}>
                <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-700 dark:text-green-400">
                          Entregado
                        </p>
                        <p className="text-xs text-green-600/80 dark:text-green-500">
                          {formatDate(order.delivered_at)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Actions */}
            <motion.div variants={fadeIn} className="space-y-3">
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={() => router.push("/")}
              >
                <ShoppingBag className="w-4 h-4" />
                Seguir comprando
              </Button>

              {order.status === "delivered" && (
                <Button variant="outline" className="w-full gap-2 bg-transparent" size="lg">
                  <Star className="w-4 h-4" />
                  Calificar productos
                </Button>
              )}
            </motion.div>

            {/* Help Card */}
            <motion.div variants={fadeIn}>
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <CircleDot className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">
                        Seguimiento en tiempo real
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
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
  );
}
