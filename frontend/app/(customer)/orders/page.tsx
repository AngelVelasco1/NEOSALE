"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Calendar,
  CreditCard,
  MapPin,
  Eye,
  ShoppingBag,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
} from "lucide-react";
import { ErrorsHandler } from "@/app/errors/errorsHandler";
import { getUserOrdersApi, type Order } from "./services/ordersApi";
import { motion, AnimatePresence } from "framer-motion";
import ReviewableProducts from "../components/ReviewableProducts";

export default function OrdersPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);

        if (status === "loading") {
          return;
        }

        if (status === "unauthenticated" || !session) {
          ErrorsHandler.showError(
            "Inicia sesión",
            "Debes iniciar sesión para ver tus órdenes"
          );
          router.push("/login");
          return;
        }

        const userOrders = await getUserOrdersApi();
        setOrders(userOrders);
      } catch (err) {
        console.error("Error loading orders:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Error al cargar las órdenes";
        setError(errorMessage);
        ErrorsHandler.showError("Error", "No pudimos cargar tus órdenes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [session, status, router]);

  const getStatusBadge = (status: Order["status"]) => {
    const statusConfig = {
      pending: {
        label: "Pendiente",
        className: "bg-amber-500/20 text-amber-300 border border-amber-500/40",
        icon: Clock,
      },
      paid: {
        label: "Pagado",
        className: "bg-blue-500/20 text-blue-300 border border-blue-500/40",
        icon: CreditCard,
      },
      confirmed: {
        label: "Confirmado",
        className:
          "bg-purple-500/20 text-purple-300 border border-purple-500/40",
        icon: CheckCircle2,
      },
      shipped: {
        label: "Enviado",
        className: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40",
        icon: Truck,
      },
      delivered: {
        label: "Entregado",
        className:
          "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40",
        icon: CheckCircle2,
      },
      cancelled: {
        label: "Cancelado",
        className: "bg-red-500/20 text-red-300 border border-red-500/40",
        icon: XCircle,
      },
    };

    const config = status ? statusConfig[status] : statusConfig.pending;
    const StatusIcon = config.icon;

    return (
      <Badge
        className={`${config.className} font-medium flex items-center gap-1.5 px-3 py-1.5 text-xs`}
      >
        <StatusIcon className="w-3.5 h-3.5" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Fecha no disponible";

    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-indigo-500/10 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin shadow-lg shadow-indigo-500/50"></div>
          </div>
          <p className="text-lg font-semibold bg-gradient-to-r from-slate-200 via-indigo-200 to-slate-200 bg-clip-text text-transparent">
            Cargando tus órdenes...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-900 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mt-20"
        >
          <Card className="border-red-500/20 bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-red-500/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center border border-red-500/20">
                  <XCircle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-slate-100">
                    Error al cargar
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    No pudimos cargar tus órdenes
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">{error}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 md:py-12 relative overflow-hidden">
      {/* Gradient Orbs Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-indigo-400/5 animate-pulse"
            style={{
              width: Math.random() * 4 + 1 + "px",
              height: Math.random() * 4 + 1 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animationDelay: Math.random() * 5 + "s",
              animationDuration: Math.random() * 4 + 3 + "s",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/5 p-8 relative overflow-hidden">
            {/* Glass effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 pointer-events-none"></div>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative">
              <div className="flex items-start gap-5">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: 0.1,
                  }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900/90 flex items-center justify-center shadow-lg shadow-indigo-500/30 border border-white/10"
                >
                  <ShoppingBag className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-100 via-indigo-200 to-slate-100 bg-clip-text text-transparent mb-2">
                    Mis Órdenes
                  </h1>
                  <p className="text-slate-500 text-sm md:text-base">
                    Gestiona y revisa el estado de tus compras
                  </p>
                </div>
              </div>

              {orders.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-4"
                >
                  <div className="text-right">
                    <p className="text-sm text-slate-500 mb-1 font-medium">Total órdenes</p>
                    <p className="text-2xl font-bold text-slate-100">
                      {orders.length}
                    </p>
                  </div>
                  <div className="w-px h-12 bg-white/10"></div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 mb-1 font-medium">
                      Total invertido
                    </p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                      $
                      {orders
                        .reduce(
                          (sum, order) =>
                            sum + (order.total || order.total_amount || 0),
                          0
                        )
                        .toLocaleString("es-CO")}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Stats Cards */}
            {orders.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/5"
              >
                {[
                  {
                    label: "Entregadas",
                    count: orders.filter((o) => o.status === "delivered")
                      .length,
                    color: "emerald",
                    bgColor: "from-emerald-500/10 to-green-500/10",
                    borderColor: "border-emerald-500/20",
                    textColor: "text-emerald-400",
                  },
                  {
                    label: "En tránsito",
                    count: orders.filter((o) => o.status === "shipped").length,
                    color: "cyan",
                    bgColor: "from-cyan-500/10 to-blue-500/10",
                    borderColor: "border-cyan-500/20",
                    textColor: "text-cyan-400",
                  },
                  {
                    label: "Confirmadas",
                    count: orders.filter(
                      (o) => o.status === "confirmed" || String(o.status) === "paid"
                    ).length,
                    color: "indigo",
                    bgColor: "from-indigo-500/10 to-violet-500/10",
                    borderColor: "border-indigo-500/20",
                    textColor: "text-indigo-400",
                  },
                  {
                    label: "Pendientes",
                    count: orders.filter((o) => o.status === "pending").length,
                    color: "amber",
                    bgColor: "from-amber-500/10 to-orange-500/10",
                    borderColor: "border-amber-500/20",
                    textColor: "text-amber-400",
                  },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className={`relative overflow-hidden bg-gradient-to-br ${stat.bgColor} backdrop-blur-sm border ${stat.borderColor} rounded-2xl p-5 hover:scale-105 hover:shadow-lg hover:shadow-${stat.color}-500/10 transition-all duration-300 group`}
                  >
                    <div className="absolute inset-0 bg-slate-900/50 pointer-events-none"></div>
                    <div className="relative">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                        {stat.label}
                      </p>
                      <p className={`text-3xl font-bold ${stat.textColor}`}>
                        {stat.count}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Reviewable Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/5 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 pointer-events-none"></div>
            <div className="relative">
              <ReviewableProducts />
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-slate-900/70 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 pointer-events-none"></div>
              <CardContent className="text-center py-20 px-4 relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2,
                  }}
                  className="relative w-32 h-32 mx-auto mb-8"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-3xl flex items-center justify-center shadow-xl backdrop-blur-sm border border-white/10">
                    <Package className="w-16 h-16 text-indigo-300" />
                  </div>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-slate-100 mb-3"
                >
                  No tienes órdenes aún
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-slate-500 mb-8 max-w-md mx-auto"
                >
                  Cuando realices tu primera compra, todos los detalles
                  aparecerán aquí para que puedas hacer seguimiento
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={() => router.push("/")}
                    className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/30 h-12 px-8 text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105 border border-white/10"
                  >
                    Explorar productos
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-5">
            <AnimatePresence>
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card className="bg-slate-900/70 backdrop-blur-xl border border-white/5 hover:border-indigo-500/30 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 rounded-2xl overflow-hidden group relative">
                    {/* Glass effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 pointer-events-none"></div>
                    {/* Card Header */}
                    <CardHeader className="pb-4 bg-gradient-to-r from-slate-900/80 to-slate-800/80 border-b border-white/5 relative">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-700 via-blue-800 to-slate-950/90 flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0 border border-white/10">
                            <Package className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-1">
                              Orden #{order.id || order.order_id || "N/A"}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-slate-500" />
                              <span className="text-sm text-slate-400">
                                {formatDate(order.created_at)}
                              </span>
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex flex-col items-start lg:items-end gap-3">
                          {getStatusBadge(order.status)}
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm text-slate-500 font-medium">
                              Total:
                            </span>
                            <p className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                              $
                              {(
                                order.total ||
                                order.total_amount ||
                                0
                              ).toLocaleString("es-CO")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 space-y-6">
                      {/* Products Section */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-slate-100 text-base flex items-center gap-2">
                            <div className="w-1.5 h-5 bg-gradient-to-b from-indigo-500 to-violet-500 rounded-full" />
                            Productos
                          </h4>
                          <span className="text-sm text-slate-500 font-medium">
                            {order.order_items?.length || 0}{" "}
                            {order.order_items?.length === 1
                              ? "artículo"
                              : "artículos"}
                          </span>
                        </div>

                        <div className="space-y-3">
                          {order.order_items?.map((item, idx) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 + idx * 0.05 }}
                              className="flex items-center justify-between bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-white/5 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all group/item"
                            >
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div
                                  className="w-12 h-12 rounded-lg shadow-lg flex-shrink-0 ring-2 ring-indigo-500/20"
                                  style={{
                                    backgroundColor:
                                      item.color_code || "#6366f1",
                                  }}
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-slate-100 truncate text-base mb-1">
                                    {item.products?.name || "Producto"}
                                  </p>
                                  <div className="flex items-center gap-3 text-sm text-slate-500">
                                    {item.products?.brands?.name && (
                                      <>
                                        <span className="font-medium text-slate-400">
                                          {item.products.brands.name}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-indigo-500/30" />
                                      </>
                                    )}
                                    <span>
                                      Talla:{" "}
                                      <span className="font-medium text-slate-400">
                                        {item.size}
                                      </span>
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-indigo-500/30" />
                                    <span>
                                      Cant:{" "}
                                      <span className="font-medium text-slate-400">
                                        {item.quantity}
                                      </span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="ml-4 text-right">
                                <p className="font-bold text-slate-100 text-lg">
                                  $
                                  {(
                                    item.subtotal ||
                                    (item.price || item.unit_price || 0) *
                                    item.quantity
                                  ).toLocaleString("es-CO")}
                                </p>
                                <p className="text-xs text-slate-500">
                                  $
                                  {(
                                    item.price ||
                                    item.unit_price ||
                                    0
                                  ).toLocaleString("es-CO")}{" "}
                                  c/u
                                </p>
                              </div>
                            </motion.div>
                          )) || []}
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-3 p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/5">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 shadow-sm flex items-center justify-center flex-shrink-0 border border-white/10">
                            <MapPin className="w-5 h-5 text-indigo-400" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-600 mb-0.5 font-medium">
                              ID de orden
                            </p>
                            <p className="font-semibold text-slate-200">
                              #{order.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/5">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 shadow-sm flex items-center justify-center flex-shrink-0 border border-white/10">
                            <CreditCard className="w-5 h-5 text-cyan-400" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-600 mb-0.5 font-medium">
                              Método de pago
                            </p>
                            <p className="font-semibold text-slate-200">
                              {order.payment?.payment_method ||
                                "No especificado"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 pt-2">
                        <Button
                          variant="outline"
                          size="default"
                          onClick={() => router.push(`/orders/${order.id}`)}
                          className="border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 hover:border-indigo-500/50 text-indigo-300 font-medium shadow-sm backdrop-blur-sm"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver detalles completos
                        </Button>

                        {order.status === "delivered" && (
                          <Button
                            variant="outline"
                            size="default"
                            className="border-slate-600/30 bg-slate-600/10 hover:bg-slate-600/20 hover:border-slate-600/50 text-slate-300 font-medium shadow-sm backdrop-blur-sm"
                          >
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Comprar de nuevo
                          </Button>
                        )}

                        {(order.status === "pending" ||
                          order.status === "confirmed") && (
                            <Button
                              variant="outline"
                              size="default"
                              className="border-red-500/30 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/50 text-red-300 font-medium shadow-sm backdrop-blur-sm"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Cancelar orden
                            </Button>
                          )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
