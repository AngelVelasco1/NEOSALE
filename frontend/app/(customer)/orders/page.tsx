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
    const statusConfig: Record<string, {
      label: string;
      className: string;
      icon: any;
      bgIcon: string;
    }> = {
      pending: {
        label: "Pendiente",
        className: "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-200 border border-amber-500/40 shadow-lg shadow-amber-500/10",
        icon: Clock,
        bgIcon: "from-amber-500/30 to-orange-500/30",
      },
      paid: {
        label: "Pagado",
        className: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-200 border border-blue-500/40 shadow-lg shadow-blue-500/10",
        icon: CreditCard,
        bgIcon: "from-blue-500/30 to-cyan-500/30",
      },
      processing: {
        label: "Procesando",
        className: "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-200 border border-indigo-500/40 shadow-lg shadow-indigo-500/10",
        icon: Package,
        bgIcon: "from-indigo-500/30 to-purple-500/30",
      },
      confirmed: {
        label: "Confirmado",
        className: "bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-200 border border-purple-500/40 shadow-lg shadow-purple-500/10",
        icon: CheckCircle2,
        bgIcon: "from-purple-500/30 to-violet-500/30",
      },
      shipped: {
        label: "En tránsito",
        className: "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-200 border border-cyan-500/40 shadow-lg shadow-cyan-500/10",
        icon: Truck,
        bgIcon: "from-cyan-500/30 to-blue-500/30",
      },
      delivered: {
        label: "Entregado",
        className: "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-200 border border-emerald-500/40 shadow-lg shadow-emerald-500/10",
        icon: CheckCircle2,
        bgIcon: "from-emerald-500/30 to-green-500/30",
      },
      cancelled: {
        label: "Cancelado",
        className: "bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-200 border border-red-500/40 shadow-lg shadow-red-500/10",
        icon: XCircle,
        bgIcon: "from-red-500/30 to-rose-500/30",
      },
    };

    const config = (status && statusConfig[status]) ? statusConfig[status] : statusConfig.pending;
    const StatusIcon = config.icon;

    return (
      <Badge
        className={`${config.className} font-bold flex items-center gap-2.5 px-4 py-2 text-sm rounded-xl backdrop-blur-sm`}
      >
        <div className={`w-5 h-5 rounded-lg bg-gradient-to-br ${config.bgIcon} flex items-center justify-center`}>
          <StatusIcon className="w-3 h-3 text-white" />
        </div>
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
          className="text-center space-y-8"
        >
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin shadow-xl shadow-indigo-500/40"></div>
            <div className="absolute inset-4 border-2 border-violet-500/30 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <p className="text-xl font-bold bg-gradient-to-r from-white via-indigo-100 to-white bg-clip-text text-transparent">
              Cargando tus órdenes...
            </p>
            <p className="text-slate-400 text-sm">
              Estamos obteniendo la información más reciente
            </p>
          </div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900/30 to-slate-950 py-8 md:py-12 relative overflow-hidden">
      {/* Enhanced Gradient Orbs Background - Dashboard Style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_50%)] rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-[radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.1),transparent_50%)] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.08),transparent_50%)] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03),transparent_50%)] rounded-full blur-3xl"></div>
      </div>
      {/* Enhanced Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-400/10 to-cyan-400/10 animate-pulse"
            style={{
              width: Math.random() * 8 + 3 + "px",
              height: Math.random() * 8 + 3 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animationDelay: Math.random() * 10 + "s",
              animationDuration: Math.random() * 8 + 5 + "s",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Enhanced Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="bg-gradient-to-br from-slate-950 via-slate-900/30 to-slate-950 rounded-3xl border border-blue-500/20 text-white shadow-[0_25px_80px_rgba(59,130,246,0.25)] p-8 md:p-10 relative overflow-hidden">
            {/* Dashboard-style Background effects */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_50%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.1),transparent_50%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-size-[40px_40px] opacity-30" />
            <div className="pointer-events-none absolute -top-40 left-10 h-80 w-80 rounded-full bg-blue-500/10 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-40 right-10 h-80 w-80 rounded-full bg-cyan-500/8 blur-[100px]" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative">
              <div className="flex items-start gap-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: 0.1,
                  }}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-700 flex items-center justify-center shadow-xl shadow-indigo-500/40 border border-white/20"
                >
                  <ShoppingBag className="w-10 h-10 text-white" />
                </motion.div>
                <div>
                  <div className="relative">
                    <h1 className="mb-0 font-semibold text-4xl md:text-5xl bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                      Mis Pedidos
                    </h1>
                    <div className="absolute -inset-2 -z-10 bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-sky-600/20 blur-2xl" />
                  </div>
                  <p className="max-w-2xl text-base md:text-lg leading-relaxed text-slate-300/90 mt-3">
                    Gestiona y revisa el estado de tus compras con facilidad
                  </p>
                </div>
              </div>

              {orders.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-6"
                >
                  <div className="text-right">
                    <p className="text-sm text-slate-500 mb-2 font-medium uppercase tracking-wide">Total órdenes</p>
                    <p className="text-3xl font-bold text-white">
                      {orders.length}
                    </p>
                  </div>
                  <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 mb-2 font-medium uppercase tracking-wide">
                      Total invertido
                    </p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
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

            {/* Enhanced Stats Cards */}
            {orders.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10 pt-8 border-t border-slate-700/40"
              >
                {[
                  {
                    label: "Entregadas",
                    count: orders.filter((o) => o.status === "delivered")
                      .length,
                    gradient: "from-emerald-500/40 via-green-600/30 to-emerald-700/35",
                    border: "border-emerald-500/30",
                    textColor: "text-emerald-200",
                    iconGradient: "from-emerald-600/50 to-green-600/40",
                    iconColor: "text-emerald-200",
                    progressGradient: "from-emerald-400 via-green-400 to-emerald-400",
                    dotColor: "bg-emerald-400/60",
                  },
                  {
                    label: "En tránsito",
                    count: orders.filter((o) => o.status === "shipped").length,
                    gradient: "from-cyan-500/40 via-blue-600/30 to-cyan-700/35",
                    border: "border-cyan-500/30",
                    textColor: "text-cyan-200",
                    iconGradient: "from-cyan-600/50 to-blue-600/40",
                    iconColor: "text-cyan-200",
                    progressGradient: "from-cyan-400 via-blue-400 to-cyan-400",
                    dotColor: "bg-cyan-400/60",
                  },
                  {
                    label: "Confirmadas",
                    count: orders.filter(
                      (o) => o.status === "confirmed" || String(o.status) === "paid"
                    ).length,
                    gradient: "from-indigo-500/40 via-violet-600/30 to-indigo-700/35",
                    border: "border-indigo-500/30",
                    textColor: "text-indigo-200",
                    iconGradient: "from-indigo-600/50 to-violet-600/40",
                    iconColor: "text-indigo-200",
                    progressGradient: "from-indigo-400 via-violet-400 to-indigo-400",
                    dotColor: "bg-indigo-400/60",
                  },
                  {
                    label: "Pendientes",
                    count: orders.filter((o) => o.status === "pending").length,
                    gradient: "from-amber-500/40 via-orange-600/30 to-amber-700/35",
                    border: "border-amber-500/30",
                    textColor: "text-amber-200",
                    iconGradient: "from-amber-600/50 to-orange-600/40",
                    iconColor: "text-amber-200",
                    progressGradient: "from-amber-400 via-orange-400 to-amber-400",
                    dotColor: "bg-amber-400/60",
                  },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + idx * 0.08 }}
                    className={`relative overflow-hidden group rounded-2xl border ${stat.border} p-6 text-white shadow-lg hover:shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-105`}
                  >
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-60`} />
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />
                    
                    {/* Top Border Accent */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    
                    {/* Corner Accent */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-30 blur-2xl -mr-16 -mt-16 group-hover:opacity-40 transition-opacity duration-300`} />

                    {/* Content */}
                    <div className="relative z-10 space-y-4">
                      {/* Header with Icon and Label */}
                      <div className="flex items-center justify-between">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.iconGradient} flex items-center justify-center border border-white/20 shadow-lg group-hover:shadow-lg transition-shadow`}>
                          <CheckCircle2 className={`w-5 h-5 ${stat.iconColor}`} />
                        </div>
                        <div className={`w-2 h-2 rounded-full ${stat.dotColor} animate-pulse shadow-lg`}></div>
                      </div>

                      {/* Label */}
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
                          {stat.label}
                        </p>
                        {/* Count */}
                        <p className={`text-4xl font-bold ${stat.textColor} drop-shadow-lg`}>
                          {stat.count}
                        </p>
                      </div>

                      {/* Progress Bar */}
                      <div className="pt-2">
                        <div className="w-full bg-slate-800/60 rounded-full h-2 overflow-hidden border border-white/10">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((stat.count / orders.length) * 100, 100)}%` }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 + idx * 0.1 }}
                            className={`h-full bg-gradient-to-r ${stat.progressGradient} rounded-full shadow-lg`}
                          />
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                          {Math.round((stat.count / (orders.length || 1)) * 100)}% del total
                        </p>
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-300 bg-gradient-to-br ${stat.gradient} blur-xl`} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Enhanced Reviewable Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-10"
        >
          <div className="bg-slate-950/70 backdrop-blur-2xl rounded-3xl shadow-[0_25px_80px_-15px_rgba(59,130,246,0.25)] border border-blue-500/20 p-8 md:p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.06),transparent_50%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-size-[40px_40px] opacity-20" />
            <div className="absolute -top-40 left-10 h-80 w-80 rounded-full bg-blue-500/8 blur-[100px]" />
            <div className="absolute -bottom-40 right-10 h-80 w-80 rounded-full bg-cyan-500/6 blur-[100px]" />
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
            <Card className="bg-slate-950/70 backdrop-blur-2xl border border-blue-500/20 shadow-[0_25px_80px_-15px_rgba(59,130,246,0.25)] rounded-3xl overflow-hidden relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.06),transparent_50%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-size-[40px_40px] opacity-20" />
              <div className="absolute -top-40 left-10 h-80 w-80 rounded-full bg-blue-500/8 blur-[100px]" />
              <div className="absolute -bottom-40 right-10 h-80 w-80 rounded-full bg-cyan-500/6 blur-[100px]" />
              <CardContent className="text-center py-24 px-8 relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2,
                  }}
                  className="relative w-40 h-40 mx-auto mb-10"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-indigo-500/20 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20">
                    <Package className="w-20 h-20 text-blue-300" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-lg border border-white/20">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-white mb-4"
                >
                  No tienes órdenes aún
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-slate-400 mb-10 max-w-lg mx-auto text-lg leading-relaxed"
                >
                  Cuando realices tu primera compra, todos los detalles aparecerán aquí para que puedas hacer seguimiento completo de tus pedidos.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={() => router.push("/")}
                    className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 hover:from-blue-400 hover:via-cyan-400 hover:to-indigo-400 text-white shadow-2xl shadow-blue-500/30 h-14 px-10 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105 border border-white/20 hover:shadow-blue-500/40"
                  >
                    Explorar productos
                    <ChevronRight className="w-6 h-6 ml-3" />
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
                  <Card className="bg-slate-950/70 backdrop-blur-2xl border border-blue-500/20 hover:border-blue-400/40 shadow-[0_25px_80px_-15px_rgba(59,130,246,0.25)] hover:shadow-[0_35px_100px_-15px_rgba(59,130,246,0.35)] transition-all duration-500 rounded-3xl overflow-hidden group relative">
                    {/* Dashboard-style Background effects */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),transparent_50%)]" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.06),transparent_50%)]" />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-size-[40px_40px] opacity-20" />
                    <div className="pointer-events-none absolute -top-40 left-10 h-80 w-80 rounded-full bg-blue-500/8 blur-[100px]" />
                    <div className="pointer-events-none absolute -bottom-40 right-10 h-80 w-80 rounded-full bg-cyan-500/6 blur-[100px]" />

                    {/* Enhanced Card Header */}
                    <CardHeader className="pb-6 bg-slate-950/50 border-b border-blue-500/20 relative">
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent_50%)]" />
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative">
                        <div className="flex items-start gap-5">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-600 to-indigo-700 flex items-center justify-center shadow-xl shadow-blue-500/40 flex-shrink-0 border border-white/20 group-hover:shadow-blue-500/50 transition-shadow duration-300">
                            <Package className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
                              Orden #{order.id || order.order_id || "N/A"}
                              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shadow-lg shadow-indigo-400/50"></div>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-3">
                              <Calendar className="w-5 h-5 text-slate-300" />
                              <span className="text-base text-slate-200 font-medium">
                                {formatDate(order.created_at)}
                              </span>
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex flex-col items-start lg:items-end gap-4">
                          {getStatusBadge(order.status)}
                          <div className="flex items-baseline gap-3">
                            <span className="text-sm text-slate-400 font-medium uppercase tracking-wide">
                              Total:
                            </span>
                            <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
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

                    <CardContent className="p-8 space-y-8">
                      {/* Enhanced Products Section */}
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="font-bold text-white text-lg flex items-center gap-3">
                            <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 via-violet-500 to-blue-500 rounded-full"></div>
                            Productos
                          </h4>
                          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/10">
                            <Package className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-300 font-medium">
                              {order.order_items?.length || 0} {order.order_items?.length === 1 ? "artículo" : "artículos"}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {order.order_items?.map((item, idx) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 + idx * 0.05 }}
                              className="flex items-center justify-between bg-slate-900/50 backdrop-blur-sm p-5 rounded-2xl border border-blue-500/15 hover:border-blue-400/30 hover:shadow-xl hover:shadow-blue-500/15 transition-all duration-300 group/item"
                            >
                              <div className="flex items-center gap-5 flex-1 min-w-0">
                                <div
                                  className="w-14 h-14 rounded-xl shadow-2xl flex-shrink-0 ring-3 ring-indigo-500/40 group-hover:ring-indigo-400/60 transition-all duration-300"
                                  style={{
                                    backgroundColor: item.color_code || "#6366f1",
                                  }}
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-white truncate text-lg mb-2 group-hover:text-indigo-200 transition-colors duration-300">
                                    {item.products?.name || "Producto"}
                                  </p>
                                  <div className="flex items-center gap-4 text-sm text-slate-300">
                                    {item.products?.brands?.name && (
                                      <>
                                        <span className="font-semibold text-white px-3 py-1 bg-gradient-to-r from-indigo-600/20 to-violet-600/20 rounded-lg border border-indigo-500/20">
                                          {item.products.brands.name}
                                        </span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/60"></div>
                                      </>
                                    )}
                                    <span className="flex items-center gap-2">
                                      <span className="font-medium">Talla:</span>
                                      <span className="text-white font-semibold px-2 py-0.5 bg-gradient-to-r from-slate-600/50 to-slate-500/50 rounded-md border border-slate-400/20">
                                        {item.size}
                                      </span>
                                    </span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/60"></div>
                                    <span className="flex items-center gap-2">
                                      <span className="font-medium">Cant:</span>
                                      <span className="text-white font-semibold px-2 py-0.5 bg-gradient-to-r from-slate-600/50 to-slate-500/50 rounded-md border border-slate-400/20">
                                        {item.quantity}
                                      </span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="ml-6 text-right">
                                <p className="font-bold text-white text-xl mb-1">
                                  $
                                  {(
                                    item.subtotal ||
                                    (item.price || item.unit_price || 0) *
                                    item.quantity
                                  ).toLocaleString("es-CO")}
                                </p>
                                <p className="text-sm text-slate-300">
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

                      

                      {/* Enhanced Actions */}
                      <div className="flex flex-wrap gap-4 pt-4">
                        <Button
                          onClick={() => router.push(`/orders/${order.id}`)}
                          className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 hover:from-blue-400 hover:via-cyan-400 hover:to-indigo-400 text-white shadow-2xl shadow-blue-500/30 h-12 text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105 border-none hover:shadow-blue-500/40"
                        >
                          <Eye className="w-5 h-5 mr-3" />
                          Ver detalles completos
                        </Button>

                        {order.status === "delivered" && (
                          <Button
                            variant="outline"
                            size="default"
                            className="border-slate-600/50 bg-slate-900/70 hover:bg-slate-800/90 hover:border-slate-500/70 text-slate-200 font-semibold shadow-xl backdrop-blur-sm h-12 px-6 text-base rounded-xl transition-all duration-300 hover:scale-105"
                          >
                            <ShoppingBag className="w-5 h-5 mr-3" />
                            Comprar de nuevo
                          </Button>
                        )}

                        {(order.status === "pending" ||
                          order.status === "confirmed") && (
                            <Button
                              variant="outline"
                              size="default"
                              className="border-red-500/50 bg-red-500/15 hover:bg-red-500/25 hover:border-red-500/70 text-red-200 font-semibold shadow-xl backdrop-blur-sm h-12 px-6 text-base rounded-xl transition-all duration-300 hover:scale-105"
                            >
                              <XCircle className="w-5 h-5 mr-3" />
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
