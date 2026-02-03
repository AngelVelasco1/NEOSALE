"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    DollarSign,
    CheckCircle2,
    Star,
    Eye
} from "lucide-react";
import { convertFromCents } from "../../checkout/services/paymentsApi";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } as const
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } }
};

const cardHoverVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.02, transition: { type: "spring" as const, stiffness: 400, damping: 25 } }
};

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params?.orderId as string;
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                const errorMessage = err instanceof Error ? err.message : "Error al cargar";
                setError(errorMessage);
                ErrorsHandler.showError("Error", errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    const getStatusConfig = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'paid':
            case 'confirmed':
            case 'approved':
                return {
                    color: 'from-emerald-500 to-green-500',
                    bgColor: 'bg-emerald-500/10',
                    textColor: 'text-emerald-400',
                    borderColor: 'border-emerald-500/20',
                    icon: CheckCircle2,
                    label: 'Confirmado',
                    step: 2
                };
            case 'pending':
                return {
                    color: 'from-amber-500 to-orange-500',
                    bgColor: 'bg-amber-500/10',
                    textColor: 'text-amber-400',
                    borderColor: 'border-amber-500/20',
                    icon: Clock,
                    label: 'Pendiente',
                    step: 1
                };
            case 'shipped':
                return {
                    color: 'from-cyan-500 to-blue-500',
                    bgColor: 'bg-cyan-500/10',
                    textColor: 'text-cyan-400',
                    borderColor: 'border-cyan-500/20',
                    icon: Truck,
                    label: 'Enviado',
                    step: 3
                };
            case 'delivered':
                return {
                    color: 'from-green-500 to-emerald-600',
                    bgColor: 'bg-green-500/10',
                    textColor: 'text-green-400',
                    borderColor: 'border-green-500/20',
                    icon: Package,
                    label: 'Entregado',
                    step: 4
                };
            default:
                return {
                    color: 'from-slate-500 to-slate-600',
                    bgColor: 'bg-slate-500/10',
                    textColor: 'text-slate-400',
                    borderColor: 'border-slate-500/20',
                    icon: Package,
                    label: status,
                    step: 0
                };
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 flex items-center justify-center">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-6">
                    <div className="relative w-24 h-24 mx-auto">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-4 border-indigo-500/20 rounded-full border-t-transparent" />
                        <Package className="absolute inset-8 text-indigo-400" />
                    </div>
                    <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="text-lg font-semibold text-indigo-300">Cargando...</motion.p>
                </motion.div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
                <div className="max-w-2xl mx-auto px-4">
                    <Card className="bg-slate-900/80 backdrop-blur-xl border border-red-500/20 rounded-3xl">
                        <CardContent className="p-8 space-y-6 text-center">
                            <p className="text-slate-300 text-lg">{error}</p>
                            <Button onClick={() => router.push('/orders')} className="bg-indigo-600 hover:bg-indigo-700">
                                Volver
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const statusConfig = getStatusConfig(order.status || 'pending');
    const StatusIcon = statusConfig.icon;
    const currentStep = statusConfig.step;
    const subtotal = convertFromCents(order.order_items?.reduce((sum, item) => sum + item.subtotal, 0) || 0);
    const total = order.total || order.total_amount || 0;

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12 relative overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-0 -left-40 w-96 h-96 bg-linear-to-br from-indigo-600 to-violet-600 rounded-full blur-3xl" />
                <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.15, 0.08] }} transition={{ duration: 10, repeat: Infinity, delay: 1 }} className="absolute top-1/3 -right-32 w-80 h-80 bg-linear-to-tr from-violet-500 to-cyan-500 rounded-full blur-3xl" />
                <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.1, 0.05] }} transition={{ duration: 12, repeat: Infinity, delay: 2 }} className="absolute bottom-0 left-1/2 w-96 h-96 bg-linear-to-t from-emerald-500 to-cyan-500 rounded-full blur-3xl" />
            </div>

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div variants={itemVariants as any} className="mb-10 flex items-center justify-between">
                    <Button variant="outline" onClick={() => router.push('/orders')} className="border-slate-700/50 bg-slate-900/50">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Button>
                    <motion.div whileHover={{ scale: 1.05 }} className={`px-6 py-3 rounded-3xl border-2 ${statusConfig.bgColor} ${statusConfig.borderColor} ${statusConfig.textColor} flex items-center gap-2 font-bold shadow-lg`}>
                        <StatusIcon className="w-5 h-5" />
                        {statusConfig.label}
                    </motion.div>
                </motion.div>

                {/* HERO SECTION */}
                <motion.div variants={itemVariants as any} className="mb-10">
                    <div className="relative rounded-4xl bg-linear-to-br from-slate-900 via-indigo-900/40 to-slate-900 backdrop-blur-xl border-2 border-indigo-500/30 shadow-2xl overflow-hidden">
                        <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} className="absolute -top-32 -right-32 w-96 h-96 bg-linear-to-br from-indigo-500 to-violet-500 rounded-full blur-3xl" />

                        <div className="relative p-8 md:p-12 z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                {/* Order ID */}
                                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex items-center gap-6">
                                    <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="w-20 h-20 rounded-3xl bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0 shadow-2xl">
                                        <Package className="w-10 h-10 text-white" />
                                    </motion.div>
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-400 uppercase tracking-widest mb-2 font-semibold">Orden</p>
                                        <motion.p animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 3, repeat: Infinity }} className="text-5xl md:text-6xl font-black bg-linear-to-r from-indigo-300 via-violet-300 to-indigo-300 bg-clip-text text-transparent leading-none">
                                            #{order.id}
                                        </motion.p>
                                    </div>
                                </motion.div>

                                {/* Stats Grid */}
                                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 gap-4">
                                    <div className="rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/30 p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <DollarSign className="w-5 h-5 text-emerald-400" />
                                            <p className="text-xs text-slate-400 font-bold">TOTAL</p>
                                        </div>
                                        <p className="text-2xl font-black text-emerald-300">{formatCurrency(total)}</p>
                                    </div>
                                    <div className="rounded-2xl bg-cyan-500/20 border-2 border-cyan-500/30 p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar className="w-5 h-5 text-cyan-400" />
                                            <p className="text-xs text-slate-400 font-bold">FECHA</p>
                                        </div>
                                        <p className="text-lg font-bold text-white">{order.created_at ? new Date(order.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' }) : ''}</p>
                                    </div>
                                    <div className="rounded-2xl bg-violet-500/20 border-2 border-violet-500/30 p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <ShoppingBag className="w-5 h-5 text-violet-400" />
                                            <p className="text-xs text-slate-400 font-bold">ITEMS</p>
                                        </div>
                                        <p className="text-2xl font-bold text-white">{order.order_items?.length || 0}</p>
                                    </div>
                                <div className="space-y-4">
                                    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                                        <div className="flex items-start gap-4">
                                            <MapPin className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
                                            <div>
                                                <p className="text-sm text-slate-400 mb-2 font-semibold">Dirección</p>
                                                <p className="text-lg font-bold text-white mb-1">{order.addresses.address}, {order.addresses.city}</p>
                                                <p className="text-sm text-slate-400">{order.addresses.department}, {order.addresses.country}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {order.status === 'delivered' && order.delivered_at && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/40 p-6">
                                            <div className="flex items-center gap-4">
                                                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                                <div><p className="text-sm text-slate-400 font-semibold">Entregado el</p>
                                                    <p className="text-lg font-bold text-white">{order.delivered_at ? new Date(order.delivered_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                                </motion.div>
                            </div>

                            {/* Divider */}
                            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4, duration: 0.8 }} className="h-1 bg-linear-to-r from-indigo-500 via-violet-500 to-emerald-500 rounded-full origin-left mb-8" />

                            {/* Timeline - Modern Step Tracker */}
                            <div className="py-12 px-6 rounded-3xl bg-linear-to-r from-slate-900/40 via-indigo-900/20 to-slate-900/40 border border-indigo-500/20 backdrop-blur-sm">
                                <div className="space-y-8">
                                    {/* Progress Bar with Animation */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm font-bold text-slate-400">Seguimiento de tu pedido</span>
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full bg-linear-to-r ${statusConfig.color} text-white`}>{statusConfig.label}</span>
                                        </div>
                                        <div className="relative h-2 bg-slate-700/50 rounded-full overflow-hidden border border-slate-600/50">
                                            <motion.div 
                                                initial={{ width: 0 }} 
                                                animate={{ width: `${(currentStep / 4) * 100}%` }} 
                                                transition={{ duration: 1.2, ease: "easeOut" }}
                                                className={`h-full bg-linear-to-r ${statusConfig.color} rounded-full shadow-lg`}
                                                style={{ boxShadow: `0 0 20px rgba(139, 92, 246, 0.6)` }}
                                            />
                                            <motion.div 
                                                animate={{ opacity: [0.5, 1, 0.5] }} 
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className={`absolute inset-0 bg-linear-to-r ${statusConfig.color} rounded-full opacity-30`}
                                            />
                                        </div>
                                    </div>

                                    {/* Step Boxes Grid */}
                                    <div className="grid grid-cols-4 gap-3 md:gap-4">
                                        {[
                                            { id: 1, label: 'Pago', desc: 'Procesado', icon: Clock },
                                            { id: 2, label: 'Confirmado', desc: 'En revisión', icon: CheckCircle2 },
                                            { id: 3, label: 'Enviado', desc: 'En tránsito', icon: Truck },
                                            { id: 4, label: 'Entregado', desc: 'Completado', icon: Package }
                                        ].map((step, idx) => {
                                            const isCompleted = step.id < currentStep;
                                            const isCurrent = step.id === currentStep;
                                            const isPending = step.id > currentStep;
                                            const StepIcon = step.icon;

                                            return (
                                                <motion.div
                                                    key={step.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 + idx * 0.1, type: "spring", stiffness: 100 }}
                                                    whileHover={!isPending ? { scale: 1.05 } : {}}
                                                    className={`relative rounded-2xl p-4 md:p-5 border-2 transition-all duration-500 ${
                                                        isCompleted
                                                            ? `bg-linear-to-br from-emerald-500/20 to-green-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/20`
                                                            : isCurrent
                                                            ? `bg-linear-to-br from-indigo-500/30 to-violet-500/20 border-indigo-400/80 shadow-lg shadow-indigo-500/40`
                                                            : `bg-slate-700/30 border-slate-600/50 shadow-sm`
                                                    }`}
                                                >
                                                    {/* Animated Background */}
                                                    {isCurrent && (
                                                        <motion.div
                                                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                                                            transition={{ duration: 2, repeat: Infinity }}
                                                            className="absolute inset-0 bg-linear-to-br from-indigo-400/20 to-violet-400/10 rounded-2xl"
                                                        />
                                                    )}

                                                    {/* Icon Box */}
                                                    <div className={`relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl mx-auto mb-3 ${
                                                        isCompleted
                                                            ? `bg-linear-to-br from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/40`
                                                            : isCurrent
                                                            ? `bg-linear-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/60`
                                                            : `bg-slate-600 shadow-sm`
                                                    }`}>
                                                        <StepIcon className="w-6 h-6 md:w-7 md:h-7 text-white relative z-10" />
                                                        
                                                        {/* Completion Badge */}
                                                        {isCompleted && (
                                                            <motion.div
                                                                initial={{ scale: 0, rotate: -180 }}
                                                                animate={{ scale: 1, rotate: 0 }}
                                                                className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center border-2 border-emerald-950"
                                                            >
                                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-950" />
                                                            </motion.div>
                                                        )}

                                                        {/* Current Pulse Ring */}
                                                        {isCurrent && (
                                                            <motion.div
                                                                animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
                                                                transition={{ duration: 2, repeat: Infinity }}
                                                                className="absolute inset-0 rounded-xl border-2 border-white"
                                                            />
                                                        )}
                                                    </div>

                                                    {/* Labels */}
                                                    <div className="text-center relative z-10">
                                                        <motion.p
                                                            animate={isCurrent ? { fontWeight: 900 } : {}}
                                                            className={`text-xs md:text-sm font-bold transition-colors ${
                                                                isCompleted
                                                                    ? 'text-emerald-300'
                                                                    : isCurrent
                                                                    ? 'text-indigo-300'
                                                                    : 'text-slate-400'
                                                            }`}
                                                        >
                                                            {step.label}
                                                        </motion.p>
                                                        <p className={`text-xs mt-1 transition-colors ${
                                                            isCompleted
                                                                ? 'text-emerald-400/70'
                                                                : isCurrent
                                                                ? 'text-indigo-300/70'
                                                                : 'text-slate-500/50'
                                                        }`}>
                                                            {step.desc}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* PRODUCTS GRID */}
                    <motion.div variants={itemVariants as any} className="mb-10">
                    <motion.h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                        <ShoppingBag className="w-8 h-8 text-indigo-400" />
                        Productos
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {order.order_items?.map((item, idx) => (
                                <motion.div key={item.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.08 }} whileHover="hover" variants={cardHoverVariants as any} className="rounded-3xl bg-linear-to-br from-slate-900/60 to-slate-800/40 border-2 border-white/10 backdrop-blur-xl overflow-hidden shadow-xl hover:border-indigo-500/40">
                                    <div className="h-24 w-full flex items-center justify-center text-4xl font-black text-white/80" style={{ backgroundColor: item.color_code || '#64748b' }}>●</div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{item.products?.name || 'Producto'}</h3>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {item.products?.brands?.name && <Badge className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">{item.products.brands.name}</Badge>}
                                            {item.products?.categories?.name && <Badge className="text-xs bg-violet-500/20 text-violet-300 border border-violet-500/40">{item.products.categories.name}</Badge>}
                                        </div>
                                        <div className="space-y-2 mb-4 pb-4 border-b border-white/10">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-400">Cantidad:</span>
                                                <span className="font-bold">{item.quantity}</span>
                                            </div>
                                            {item.size && <div className="flex justify-between text-sm"><span className="text-slate-400">Talla:</span><span className="font-bold">{item.size}</span></div>}
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div><p className="text-xs text-slate-400">Unit.</p><p className="font-semibold">{formatCurrency(item.price)}</p></div>
                                            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-right">
                                                <p className="text-xs text-slate-400">Subtotal</p>
                                                <p className="text-2xl font-black bg-linear-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">{formatCurrency(item.subtotal)}</p>
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT: Payment & Shipping */}
                    <motion.div variants={itemVariants as any} className="lg:col-span-2 space-y-8">
                        {order.payment && (
                            <div className="rounded-4xl bg-linear-to-br from-cyan-900/30 to-blue-900/20 border-2 border-cyan-500/30 shadow-2xl p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-3xl bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                                        <CreditCard className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Pago</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                                        <p className="text-sm text-slate-400 mb-2 font-semibold">Método</p>
                                        <p className="text-lg font-bold text-white capitalize">{order.payment.payment_method}</p>
                                    </div>
                                    <div className="rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 p-5">
                                        <p className="text-sm text-slate-400 mb-2 font-semibold">Estado</p>
                                        <Badge className={`${getStatusConfig(order.payment.payment_status).bgColor} ${getStatusConfig(order.payment.payment_status).textColor} border`}>{order.payment.payment_status}</Badge>
                                    </div>
                                    <div className="rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/30 p-5">
                                        <p className="text-sm text-slate-400 mb-2 font-semibold">Monto</p>
                                        <p className="text-2xl font-black text-emerald-300">{formatCurrency(order.payment.amount_in_cents / 100)}</p>
                                    </div>
                                    <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                                        <p className="text-sm text-slate-400 mb-2 font-semibold">Transacción</p>
                                        <p className="text-xs font-mono text-slate-300 truncate">{order.payment.transaction_id}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                     
                    </motion.div>

                    {/* RIGHT: Sidebar */}
                    <motion.div variants={itemVariants as any} className="space-y-8">
                        {/* Summary */}
                        

                        {/* Actions */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="space-y-4">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button className="w-full h-14 text-white font-bold rounded-2xl" 
                                  style={{
                                    backgroundImage: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`,
                                    boxShadow: `0 10px 25px -5px rgba(var(--color-primary-rgb), 0.3)`
                                  }}
                                  onClick={() => router.push('/')}
                                > 
                                    <ShoppingBag className="w-5 h-5 mr-2" />
                                    Seguir comprando
                                </Button>
                            </motion.div>
                            {order.status === 'delivered' && (
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Button variant="outline" className="w-full h-14 border-2 font-bold rounded-2xl"
                                      style={{
                                        borderColor: `rgba(var(--color-accent-rgb), 0.4)`,
                                        backgroundColor: `rgba(var(--color-accent-rgb), 0.1)`,
                                        color: `var(--color-accent)`
                                      }}
                                    >
                                        <Star className="w-5 h-5 mr-2" />
                                        Comprar de nuevo
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Info */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} whileHover={{ scale: 1.02 }} className="rounded-2xl bg-linear-to-br from-violet-900/30 to-indigo-900/20 border-2 border-violet-500/30 p-5">
                            <div className="flex items-start gap-3">
                                <Eye className="w-5 h-5 text-violet-400 shrink-0 mt-1" />
                                <div><p className="text-sm font-bold text-white mb-1">Seguimiento en tiempo real</p>
                                    <p className="text-xs text-slate-400">Recibiras actualizaciones por correo</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
