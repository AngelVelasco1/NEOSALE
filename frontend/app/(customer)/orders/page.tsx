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
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-lg font-semibold text-purple-200">
            Cargando tus órdenes...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mt-20"
        >
          <Card className="border-red-500/30 bg-slate-800/60 backdrop-blur-md shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-red-200">
                    Error al cargar
                  </CardTitle>
                  <CardDescription className="text-red-300">
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
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 py-8 md:py-12 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-500/10 animate-pulse"
            style={{
              width: Math.random() * 6 + 2 + "px",
              height: Math.random() * 6 + 2 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animationDelay: Math.random() * 3 + "s",
              animationDuration: Math.random() * 3 + 2 + "s",
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
          <div className="bg-slate-800/60 backdrop-blur-md rounded-3xl shadow-2xl border border-purple-500/20 p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
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
                  className="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
                >
                  <ShoppingBag className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent mb-2">
                    Mis Órdenes
                  </h1>
                  <p className="text-slate-400 text-sm md:text-base">
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
                    <p className="text-sm text-slate-400 mb-1">Total órdenes</p>
                    <p className="text-2xl font-bold text-purple-200">
                      {orders.length}
                    </p>
                  </div>
                  <div className="w-px h-12 bg-purple-500/30"></div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400 mb-1">
                      Total invertido
                    </p>
                    <p className="text-2xl font-bold bg-linear-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
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
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-purple-500/20"
              >
                {[
                  {
                    label: "Entregadas",
                    count: orders.filter((o) => o.status === "delivered")
                      .length,
                    color: "emerald",
                    bgColor: "from-emerald-500/20 to-green-500/20",
                    borderColor: "border-emerald-500/30",
                    textColor: "text-emerald-300",
                  },
                  {
                    label: "En tránsito",
                    count: orders.filter((o) => o.status === "shipped").length,
                    color: "cyan",
                    bgColor: "from-cyan-500/20 to-blue-500/20",
                    borderColor: "border-cyan-500/30",
                    textColor: "text-cyan-300",
                  },
                  {
                    label: "Confirmadas",
                    count: orders.filter(
                      (o) => o.status === "confirmed" || String(o.status) === "paid"
                    ).length,
                    color: "purple",
                    bgColor: "from-purple-500/20 to-pink-500/20",
                    borderColor: "border-purple-500/30",
                    textColor: "text-purple-300",
                  },
                  {
                    label: "Pendientes",
                    count: orders.filter((o) => o.status === "pending").length,
                    color: "amber",
                    bgColor: "from-amber-500/20 to-orange-500/20",
                    borderColor: "border-amber-500/30",
                    textColor: "text-amber-300",
                  },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className={`relative overflow-hidden bg-linear-to-br ${stat.bgColor} backdrop-blur-sm border ${stat.borderColor} rounded-2xl p-5 hover:scale-105 transition-all duration-300 group`}
                  >
                    <div className="relative">
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
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
          <div className="bg-slate-800/60 backdrop-blur-md rounded-3xl shadow-2xl border border-purple-500/20 p-8">
            <ReviewableProducts />
          </div>
        </motion.div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-slate-800/60 backdrop-blur-md border border-purple-500/20 shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="text-center py-20 px-4">
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
                  <div className="absolute inset-0 bg-linear-to-br from-purple-500/30 to-pink-500/30 rounded-3xl flex items-center justify-center shadow-xl backdrop-blur-sm">
                    <Package className="w-16 h-16 text-purple-300" />
                  </div>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-purple-200 mb-3"
                >
                  No tienes órdenes aún
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-slate-400 mb-8 max-w-md mx-auto"
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
                    className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30 h-12 px-8 text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105"
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
                  <Card className="bg-slate-800/60 backdrop-blur-md border border-purple-500/20 hover:border-purple-500/40 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 rounded-2xl overflow-hidden group">
                    {/* Card Header */}
                    <CardHeader className="pb-4 bg-linear-to-r from-slate-800/80 to-purple-900/30 border-b border-purple-500/20">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg flex-shrink-0">
                            <Package className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-bold text-purple-200 flex items-center gap-2 mb-1">
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
                            <span className="text-sm text-slate-400 font-medium">
                              Total:
                            </span>
                            <p className="text-2xl font-bold bg-linear-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
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
                          <h4 className="font-semibold text-purple-200 text-base flex items-center gap-2">
                            <div className="w-1.5 h-5 bg-linear-to-b from-purple-500 to-pink-500 rounded-full" />
                            Productos
                          </h4>
                          <span className="text-sm text-slate-400 font-medium">
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
                              className="flex items-center justify-between bg-slate-700/40 backdrop-blur-sm p-4 rounded-xl border border-purple-500/20 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10 transition-all group/item"
                            >
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div
                                  className="w-12 h-12 rounded-lg shadow-lg flex-shrink-0 ring-2 ring-purple-500/30"
                                  style={{
                                    backgroundColor:
                                      item.color_code || "#6366f1",
                                  }}
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-purple-100 truncate text-base mb-1">
                                    {item.products?.name || "Producto"}
                                  </p>
                                  <div className="flex items-center gap-3 text-sm text-slate-400">
                                    {item.products?.brands?.name && (
                                      <>
                                        <span className="font-medium text-slate-300">
                                          {item.products.brands.name}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-purple-500/50" />
                                      </>
                                    )}
                                    <span>
                                      Talla:{" "}
                                      <span className="font-medium text-slate-300">
                                        {item.size}
                                      </span>
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-purple-500/50" />
                                    <span>
                                      Cant:{" "}
                                      <span className="font-medium text-slate-300">
                                        {item.quantity}
                                      </span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="ml-4 text-right">
                                <p className="font-bold text-purple-200 text-lg">
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-purple-500/20">
                        <div className="flex items-center gap-3 p-4 bg-slate-700/40 backdrop-blur-sm rounded-xl border border-purple-500/20">
                          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-500/30 to-pink-500/30 shadow-sm flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-purple-300" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-0.5">
                              ID de orden
                            </p>
                            <p className="font-semibold text-purple-200">
                              #{order.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-slate-700/40 backdrop-blur-sm rounded-xl border border-purple-500/20">
                          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-cyan-500/30 to-blue-500/30 shadow-sm flex items-center justify-center flex-shrink-0">
                            <CreditCard className="w-5 h-5 text-cyan-300" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-0.5">
                              Método de pago
                            </p>
                            <p className="font-semibold text-purple-200">
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
                          className="border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 hover:border-purple-500/60 text-purple-300 font-medium shadow-sm backdrop-blur-sm"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver detalles completos
                        </Button>

                        {order.status === "delivered" && (
                          <Button
                            variant="outline"
                            size="default"
                            className="border-slate-500/40 bg-slate-500/10 hover:bg-slate-500/20 hover:border-slate-500/60 text-slate-300 font-medium shadow-sm backdrop-blur-sm"
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
                              className="border-red-500/40 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/60 text-red-300 font-medium shadow-sm backdrop-blur-sm"
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
