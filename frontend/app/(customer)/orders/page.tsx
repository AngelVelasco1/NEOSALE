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
import { Package, Calendar, CreditCard, MapPin, Eye, ShoppingBag, Truck, CheckCircle2, XCircle, Clock, TrendingUp, ChevronRight } from "lucide-react";
import { ErrorsHandler } from "@/app/errors/errorsHandler";
import { getUserOrdersApi, type Order } from "./services/ordersApi";
import { motion, AnimatePresence } from "framer-motion";

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
        className: "bg-amber-50 text-amber-700 border border-amber-200",
        icon: Clock
      },
      paid: {
        label: "Pagado",
        className: "bg-blue-50 text-blue-700 border border-blue-200",
        icon: CreditCard
      },
      confirmed: {
        label: "Confirmado",
        className: "bg-indigo-50 text-indigo-700 border border-indigo-200",
        icon: CheckCircle2
      },
      shipped: {
        label: "Enviado",
        className: "bg-cyan-50 text-cyan-700 border border-cyan-200",
        icon: Truck
      },
      delivered: {
        label: "Entregado",
        className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        icon: CheckCircle2
      },
      cancelled: {
        label: "Cancelado",
        className: "bg-red-50 text-red-700 border border-red-200",
        icon: XCircle
      },
    };

    const config = status ? statusConfig[status] : statusConfig.pending;
    const StatusIcon = config.icon;

    return (
      <Badge className={`${config.className} font-medium flex items-center gap-1.5 px-3 py-1.5 text-xs`}>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-lg font-semibold text-gray-700">Cargando tus órdenes...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mt-20"
        >
          <Card className="border-red-200 bg-white shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-red-900">Error al cargar</CardTitle>
                  <CardDescription className="text-red-600">No pudimos cargar tus órdenes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{error}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white rounded-3xl shadow-lg border border-blue-100/50 p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-5">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg"
                >
                  <ShoppingBag className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    Mis Órdenes
                  </h1>
                  <p className="text-gray-600 text-sm md:text-base">
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
                    <p className="text-sm text-gray-500 mb-1">Total órdenes</p>
                    <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                  </div>
                  <div className="w-px h-12 bg-gray-200"></div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Total invertido</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      ${orders.reduce((sum, order) => sum + (order.total || order.total_amount || 0), 0).toLocaleString("es-CO")}
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
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100"
              >
                {[
                  { label: 'Entregadas', count: orders.filter(o => o.status === 'delivered').length, color: 'emerald', bgColor: 'from-emerald-500 to-green-500' },
                  { label: 'En tránsito', count: orders.filter(o => o.status === 'shipped').length, color: 'cyan', bgColor: 'from-cyan-500 to-blue-500' },
                  { label: 'Confirmadas', count: orders.filter(o => o.status === 'confirmed' || o.status === 'paid').length, color: 'indigo', bgColor: 'from-indigo-500 to-blue-600' },
                  { label: 'Pendientes', count: orders.filter(o => o.status === 'pending').length, color: 'amber', bgColor: 'from-amber-500 to-orange-500' },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="relative overflow-hidden bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.bgColor} opacity-5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500`}></div>
                    <div className="relative">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{stat.label}</p>
                      <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.count}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white border border-blue-100/50 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="text-center py-20 px-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  className="relative w-32 h-32 mx-auto mb-8"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl flex items-center justify-center shadow-xl">
                    <Package className="w-16 h-16 text-blue-500" />
                  </div>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-gray-900 mb-3"
                >
                  No tienes órdenes aún
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 mb-8 max-w-md mx-auto"
                >
                  Cuando realices tu primera compra, todos los detalles aparecerán aquí para que puedas hacer seguimiento
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={() => router.push("/")}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg h-12 px-8 text-base font-semibold rounded-xl"
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
                  <Card className="bg-white border border-blue-100/50 hover:border-blue-200 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">

                    {/* Card Header */}
                    <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-blue-50/30 border-b border-gray-100">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg flex-shrink-0">
                            <Package className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-1">
                              Orden #{order.id || order.order_id || "N/A"}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{formatDate(order.created_at)}</span>
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex flex-col items-start lg:items-end gap-3">
                          {getStatusBadge(order.status)}
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm text-gray-500 font-medium">Total:</span>
                            <p className="text-2xl font-bold text-gray-900">
                              ${(order.total || order.total_amount || 0).toLocaleString("es-CO")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 space-y-6">

                      {/* Products Section */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900 text-base flex items-center gap-2">
                            <div className="w-1.5 h-5 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                            Productos
                          </h4>
                          <span className="text-sm text-gray-500 font-medium">
                            {order.order_items?.length || 0} {order.order_items?.length === 1 ? 'artículo' : 'artículos'}
                          </span>
                        </div>

                        <div className="space-y-3">
                          {order.order_items?.map((item, idx) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 + idx * 0.05 }}
                              className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-blue-50/30 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group/item"
                            >
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div
                                  className="w-12 h-12 rounded-lg shadow-md flex-shrink-0 ring-2 ring-white"
                                  style={{ backgroundColor: item.color_code || '#e5e7eb' }}
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-gray-900 truncate text-base mb-1">
                                    {item.products?.name || "Producto"}
                                  </p>
                                  <div className="flex items-center gap-3 text-sm text-gray-600">
                                    {item.products?.brands?.name && (
                                      <>
                                        <span className="font-medium text-gray-700">{item.products.brands.name}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                                      </>
                                    )}
                                    <span>Talla: <span className="font-medium text-gray-700">{item.size}</span></span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                    <span>Cant: <span className="font-medium text-gray-700">{item.quantity}</span></span>
                                  </div>
                                </div>
                              </div>
                              <div className="ml-4 text-right">
                                <p className="font-bold text-gray-900 text-lg">
                                  ${(item.subtotal || (item.price || item.unit_price || 0) * item.quantity).toLocaleString("es-CO")}
                                </p>
                                <p className="text-xs text-gray-500">
                                  ${(item.price || item.unit_price || 0).toLocaleString("es-CO")} c/u
                                </p>
                              </div>
                            </motion.div>
                          )) || []}
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-gray-100">
                          <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">ID de orden</p>
                            <p className="font-semibold text-gray-900">#{order.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-gray-100">
                          <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                            <CreditCard className="w-5 h-5 text-cyan-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Método de pago</p>
                            <p className="font-semibold text-gray-900">{order.payment?.payment_method || "No especificado"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 pt-2">
                        <Button
                          variant="outline"
                          size="default"
                          onClick={() => router.push(`/orders/${order.id}`)}
                          className="border-blue-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-blue-700 font-medium shadow-sm"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver detalles completos
                        </Button>

                        {order.status === "delivered" && (
                          <Button
                            variant="outline"
                            size="default"
                            className="border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-700 font-medium shadow-sm"
                          >
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Comprar de nuevo
                          </Button>
                        )}

                        {(order.status === "pending" || order.status === "confirmed") && (
                          <Button
                            variant="outline"
                            size="default"
                            className="border-red-200 bg-white hover:bg-red-50 hover:border-red-300 text-red-700 font-medium shadow-sm"
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
