"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    CheckCircle,
    Clock,
    AlertCircle,
    ShoppingBag,
    Calendar,
    Hash,
    DollarSign,
    FileText,
    User,
    Home,
    ChevronRight,
    Info,
    CheckCircle2,
    Download,
    Share2,
    Star
} from "lucide-react";
import { convertFromCents } from "../../checkout/services/paymentsApi";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

const cardHoverVariants = {
    rest: { scale: 1, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
    hover: {
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 25
        }
    }
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
            setError("ID de orden no válido");
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
                console.error("Error fetching order:", err);
                const errorMessage = err instanceof Error ? err.message : "Error al cargar la orden";
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
                    description: 'Tu pago ha sido procesado exitosamente',
                    step: 2,
                    glowColor: 'shadow-emerald-500/30'
                };
            case 'pending':
                return {
                    color: 'from-amber-500 to-orange-500',
                    bgColor: 'bg-amber-500/10',
                    textColor: 'text-amber-400',
                    borderColor: 'border-amber-500/20',
                    icon: Clock,
                    label: 'Pendiente',
                    description: 'Esperando confirmación de pago',
                    step: 1,
                    glowColor: 'shadow-amber-500/30'
                };
            case 'shipped':
                return {
                    color: 'from-cyan-500 to-blue-500',
                    bgColor: 'bg-cyan-500/10',
                    textColor: 'text-cyan-400',
                    borderColor: 'border-cyan-500/20',
                    icon: Truck,
                    label: 'Enviado',
                    description: 'Tu pedido está en camino',
                    step: 3,
                    glowColor: 'shadow-cyan-500/30'
                };
            case 'delivered':
                return {
                    color: 'from-green-500 to-emerald-600',
                    bgColor: 'bg-green-500/10',
                    textColor: 'text-green-400',
                    borderColor: 'border-green-500/20',
                    icon: Package,
                    label: 'Entregado',
                    description: 'Tu pedido ha sido entregado',
                    step: 4,
                    glowColor: 'shadow-green-500/30'
                };
            case 'cancelled':
            case 'declined':
            case 'error':
                return {
                    color: 'from-red-500 to-rose-500',
                    bgColor: 'bg-red-500/10',
                    textColor: 'text-red-400',
                    borderColor: 'border-red-500/20',
                    icon: AlertCircle,
                    label: 'Cancelado',
                    description: 'Esta orden ha sido cancelada',
                    step: 0,
                    glowColor: 'shadow-red-500/30'
                };
            default:
                return {
                    color: 'from-slate-500 to-slate-600',
                    bgColor: 'bg-slate-500/10',
                    textColor: 'text-slate-400',
                    borderColor: 'border-slate-500/20',
                    icon: Package,
                    label: status,
                    description: 'Estado de la orden',
                    step: 0,
                    glowColor: 'shadow-slate-500/30'
                };
        }
    };

    const getOrderSteps = () => [
        {
            id: 1,
            label: 'Pago Pendiente',
            icon: Clock,
            description: 'Esperando confirmación',
            color: 'from-amber-400 to-orange-400'
        },
        {
            id: 2,
            label: 'Confirmado',
            icon: CheckCircle2,
            description: 'Pago procesado',
            color: 'from-emerald-400 to-green-400'
        },
        {
            id: 3,
            label: 'Enviado',
            icon: Truck,
            description: 'En camino',
            color: 'from-cyan-400 to-blue-400'
        },
        {
            id: 4,
            label: 'Entregado',
            icon: Package,
            description: 'Completado',
            color: 'from-green-400 to-emerald-500'
        }
    ];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 py-12 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-6"
                >
                    <div className="relative w-24 h-24 mx-auto">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-4 border-indigo-500/20 rounded-full border-t-transparent"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-2 border-4 border-indigo-500 rounded-full border-t-transparent shadow-lg shadow-indigo-500/50"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Package className="w-8 h-8 text-indigo-400" />
                        </div>
                    </div>
                    <motion.p
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-lg font-semibold bg-gradient-to-r from-slate-200 via-indigo-200 to-slate-200 bg-clip-text text-transparent"
                    >
                        Cargando información de la orden...
                    </motion.p>
                </motion.div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 py-12">
                <div className="max-w-2xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 100 }}
                    >
                        <Card className="bg-slate-900/80 backdrop-blur-xl border border-red-500/20 shadow-2xl shadow-red-500/10 rounded-3xl overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-slate-900/90 to-red-900/30 border-b border-red-500/20 pb-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                    className="flex items-center gap-4"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/30 border border-white/10">
                                        <AlertCircle className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-slate-100 text-2xl">Error al cargar la orden</CardTitle>
                                        <p className="text-sm text-red-400 mt-1">No se pudo obtener la información</p>
                                    </div>
                                </motion.div>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <p className="text-slate-300 text-center text-lg">{error || "No se pudo cargar la información de la orden"}</p>
                                <div className="flex gap-3 justify-center">
                                    <Button
                                        variant="outline"
                                        onClick={() => router.push('/orders')}
                                        className="border-slate-600/30 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 h-12 px-6"
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Volver a órdenes
                                    </Button>
                                    <Button
                                        onClick={() => window.location.reload()}
                                        className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white h-12 px-6 shadow-lg shadow-indigo-500/30"
                                    >
                                        Reintentar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        );
    }

    const statusConfig = getStatusConfig(order.status || 'pending');
    const StatusIcon = statusConfig.icon;
    const orderSteps = getOrderSteps();
    const currentStep = statusConfig.step;

    const subtotal = convertFromCents(order.order_items?.reduce((sum, item) => sum + item.subtotal, 0) || 0);
    const shipping = subtotal >= 100000 ? 0 : 15000;
    const taxes = Math.round(subtotal * 0.19);
    const total = convertFromCents(order.total || 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 relative overflow-hidden">
            {/* Gradient Orbs Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
            </div>
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-violet-500/5 to-indigo-500/5 rounded-full blur-3xl"
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
            >
                {/* Header Navigation */}
                <motion.div variants={itemVariants} className="mb-6">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/orders')}
                        className="border-slate-700/50 bg-slate-900/70 backdrop-blur-xl hover:bg-slate-800/70 hover:shadow-lg hover:shadow-indigo-500/10 text-slate-300 transition-all duration-300 h-11"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver a mis órdenes
                    </Button>
                </motion.div>

                {/* Hero Header Card */}
                <motion.div variants={itemVariants} className="mb-8">
                    <motion.div
                        whileHover="hover"
                        initial="rest"
                        variants={cardHoverVariants}
                    >
                        <Card className="bg-slate-900/70 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl overflow-hidden">
                            <div className="relative overflow-hidden">
                                {/* Gradient Background */}

                                <CardContent className="p-8 relative">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                        <div className="flex items-start gap-5">
                                            <motion.div
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
                                                className={`relative w-20 h-20 rounded-2xl bg-linear-to-br ${statusConfig.color} flex items-center justify-center shadow-2xl ${statusConfig.glowColor}`}
                                            >
                                                <Package className="w-10 h-10 text-white" />
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                    className="absolute inset-0 rounded-2xl bg-white/20"
                                                />
                                            </motion.div>
                                            <div>
                                                <motion.div
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.4 }}
                                                    className="flex items-center gap-3 mb-3"
                                                >
                                                    <h1 className="text-4xl font-bold text-slate-100">
                                                        Orden #{order.id}
                                                    </h1>
                                                </motion.div>
                                                <motion.div
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.5 }}
                                                    className="flex flex-wrap items-center gap-3 mb-2"
                                                >
                                                    <Badge className={`${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} border font-semibold px-4 py-2 text-sm flex items-center gap-2 shadow-md`}>
                                                        <StatusIcon className="w-5 h-5" />
                                                        {statusConfig.label}
                                                    </Badge>
                                                    <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-800/50 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/5">
                                                        <Calendar className="w-4 h-4" />
                                                        {order.created_at && formatDate(order.created_at)}
                                                    </div>
                                                </motion.div>
                                                <motion.p
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.6 }}
                                                    className="text-sm text-slate-500 font-medium"
                                                >
                                                    {statusConfig.description}
                                                </motion.p>
                                            </div>
                                        </div>

                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.5, type: "spring" }}
                                            className="flex flex-col items-start lg:items-end gap-3"
                                        >
                                            <p className="text-sm text-slate-500 font-medium">Total pagado</p>
                                            <motion.p
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="text-5xl font-bold bg-gradient-to-r from-indigo-300 via-slate-200 to-indigo-300 bg-clip-text text-transparent"
                                            >
                                                {formatCurrency(total)}
                                            </motion.p>
                                            <div className="flex gap-2 mt-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-slate-700/50 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:shadow-lg hover:shadow-indigo-500/10 transition-all"
                                                >
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Descargar
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-slate-700/50 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:shadow-lg hover:shadow-indigo-500/10 transition-all"
                                                >
                                                    <Share2 className="w-4 h-4 mr-2" />
                                                    Compartir
                                                </Button>
                                            </div>
                                        </motion.div>
                                    </div>
                                </CardContent>
                            </div>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* Order Progress Tracker */}
                <motion.div variants={itemVariants} className="mb-8">
                    <motion.div whileHover="hover" initial="rest" variants={cardHoverVariants}>
                        <Card className="bg-slate-900/70 backdrop-blur-xl border border-white/5 shadow-xl rounded-3xl overflow-hidden">
                            <CardHeader className=" border-b border-white/5 pb-5">
                                <CardTitle className="flex items-center gap-3 text-2xl text-slate-100">
                                    <motion.div
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                        className={`w-12 h-12 rounded-xl bg-linear-to-br ${statusConfig.color} flex items-center justify-center shadow-lg`}
                                    >
                                        <Info className="w-6 h-6 text-white" />
                                    </motion.div>
                                    Seguimiento del Pedido
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                {/* Progress Tracker */}
                                <div className="relative py-8">
                                    <div className="flex items-center justify-between relative">
                                        {/* Progress Line */}
                                        <div className="absolute top-6 left-0 right-0 h-1 bg-slate-800 mx-auto" style={{ width: 'calc(100% - 3rem)' }} />
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(currentStep / 4) * 100}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className={`absolute top-6 left-0 h-1 bg-gradient-to-r ${statusConfig.color}`}
                                            style={{ maxWidth: 'calc(100% - 3rem)' }}
                                        />

                                        {orderSteps.map((step, index) => {
                                            const StepIcon = step.icon;
                                            const isCompleted = step.id <= currentStep;
                                            const isCurrent = step.id === currentStep;
                                            const isCancelled = currentStep === 0;

                                            return (
                                                <motion.div
                                                    key={step.id}
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                                                    className="flex flex-col items-center flex-1 relative z-10"
                                                >
                                                    {/* Step Circle */}
                                                    <motion.div
                                                        whileHover={{ scale: 1.1 }}
                                                        className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isCancelled
                                                            ? 'bg-linear-to-br from-red-400 to-rose-500 shadow-lg shadow-red-200'
                                                            : isCompleted
                                                                ? `bg-linear-to-br ${step.color} shadow-lg shadow-green-200`
                                                                : isCurrent
                                                                    ? `bg-linear-to-br ${step.color} shadow-xl ${statusConfig.glowColor}`
                                                                    : 'bg-gray-100 border-2 border-gray-300'
                                                            }`}
                                                    >
                                                        <StepIcon
                                                            className={`w-7 h-7 ${isCancelled || isCompleted || isCurrent ? 'text-white' : 'text-gray-400'
                                                                }`}
                                                        />
                                                        {isCurrent && !isCancelled && (
                                                            <>
                                                                <motion.div
                                                                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                                                                    transition={{ duration: 2, repeat: Infinity }}
                                                                    className="absolute -inset-2 rounded-2xl border-2 border-blue-400"
                                                                />
                                                                <motion.div
                                                                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                                                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                                                    className="absolute -inset-3 rounded-2xl border-2 border-cyan-400"
                                                                />
                                                            </>
                                                        )}
                                                        {isCompleted && !isCurrent && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-md"
                                                            >
                                                                <CheckCircle2 className="w-3 h-3 text-white" />
                                                            </motion.div>
                                                        )}
                                                    </motion.div>

                                                    {/* Step Label */}
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.3 + index * 0.1 }}
                                                        className="text-center mt-4 max-w-28"
                                                    >
                                                        <p
                                                            className={`text-sm font-bold mb-1 ${isCancelled
                                                                ? 'text-red-600'
                                                                : isCompleted
                                                                    ? 'text-green-600'
                                                                    : isCurrent
                                                                        ? 'text-blue-600'
                                                                        : 'text-gray-400'
                                                                }`}
                                                        >
                                                            {step.label}
                                                        </p>
                                                        <p className="text-xs text-gray-500 leading-tight">{step.description}</p>
                                                    </motion.div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Current Status Badge */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="text-center mt-6"
                                >
                                    <div
                                        className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl ${statusConfig.bgColor} ${statusConfig.borderColor} border shadow-lg`}
                                    >
                                        <StatusIcon className={`w-5 h-5 ${statusConfig.textColor}`} />
                                        <div className="text-left">
                                            <p className={`font-bold ${statusConfig.textColor}`}>{statusConfig.label}</p>
                                            <p className="text-xs text-slate-500">{statusConfig.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Content */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
                        {/* Products Card */}
                        <motion.div whileHover="hover" initial="rest" variants={cardHoverVariants}>
                            <Card className="bg-slate-900/70 backdrop-blur-xl border border-white/5 shadow-xl rounded-3xl overflow-hidden">
                                <CardHeader className=" border-b border-white/5 pb-5">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-3 text-2xl text-slate-100">
                                            <motion.div
                                                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                                                transition={{ duration: 0.5 }}
                                                className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg"
                                            >
                                                <ShoppingBag className="w-6 h-6 text-white" />
                                            </motion.div>
                                            Productos
                                        </CardTitle>
                                        <Badge variant="outline" className="text-sm font-semibold bg-slate-800/50 border-slate-700/50 text-slate-300 px-4 py-2">
                                            {order.order_items?.length || 0}{' '}
                                            {order.order_items?.length === 1 ? 'artículo' : 'artículos'}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <AnimatePresence mode="popLayout">
                                        {order.order_items?.map((item, index) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, x: -30 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 30 }}
                                                transition={{
                                                    delay: index * 0.1,
                                                    type: "spring",
                                                    stiffness: 100
                                                }}
                                                whileHover={{ scale: 1.02, x: 5 }}
                                                className="group relative bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
                                            >
                                                {/* Decorative Element */}
                                                <motion.div
                                                    className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-violet-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                                                />

                                                <div className="flex items-start gap-5">
                                                    {/* Product Color Preview */}
                                                    <motion.div
                                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                                        className="relative w-20 h-20 rounded-2xl shadow-lg flex-shrink-0 ring-4 ring-white overflow-hidden"
                                                        style={{ backgroundColor: item.color_code || '#e5e7eb' }}
                                                    >
                                                        <motion.div
                                                            animate={{
                                                                scale: [1, 1.2, 1],
                                                                opacity: [0.3, 0.1, 0.3]
                                                            }}
                                                            transition={{ duration: 2, repeat: Infinity }}
                                                            className="absolute inset-0 bg-white"
                                                        />
                                                    </motion.div>

                                                    {/* Product Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-slate-100 text-xl mb-3 group-hover:text-indigo-400 transition-colors">
                                                            {item.products?.name || 'Producto'}
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2 mb-4">
                                                            {item.products?.brands?.name && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs bg-slate-800/50 font-medium border-indigo-500/30 text-indigo-300"
                                                                >
                                                                    {item.products.brands.name}
                                                                </Badge>
                                                            )}
                                                            {item.products?.categories?.name && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs bg-slate-800/50 font-medium border-cyan-500/30 text-cyan-300"
                                                                >
                                                                    {item.products.categories.name}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                                            <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/5">
                                                                <Package className="w-4 h-4 text-indigo-400" />
                                                                <span>
                                                                    Cantidad: <strong className="text-slate-300">{item.quantity}</strong>
                                                                </span>
                                                            </div>
                                                            {item.size && (
                                                                <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/5">
                                                                    <span>
                                                                        Talla: <strong className="text-slate-300">{item.size}</strong>
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {item.color_code && (
                                                                <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/5">
                                                                    <div
                                                                        className="w-5 h-5 rounded-full border-2 border-slate-700 shadow-sm"
                                                                        style={{ backgroundColor: item.color_code }}
                                                                    />
                                                                    <span>Color</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="text-right flex-shrink-0">
                                                        <motion.p
                                                            whileHover={{ scale: 1.05 }}
                                                            className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent mb-1"
                                                        >
                                                            {formatCurrency(item.subtotal)}
                                                        </motion.p>
                                                        <p className="text-sm text-slate-600 font-medium">
                                                            {formatCurrency(item.price)} c/u
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Payment Information */}
                        {order.payment && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <motion.div whileHover="hover" initial="rest" variants={cardHoverVariants}>
                                    <Card className="bg-white/90 backdrop-blur-md border-2 border-blue-100 shadow-xl rounded-3xl overflow-hidden">
                                        <CardHeader className="bg-linear-to-r from-cyan-50 via-blue-50 to-cyan-50 border-b border-gray-100 pb-5">
                                            <CardTitle className="flex items-center gap-3 text-2xl">
                                                <motion.div
                                                    whileHover={{ rotateY: 180 }}
                                                    transition={{ duration: 0.6 }}
                                                    className="w-12 h-12 rounded-xl bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg"
                                                >
                                                    <CreditCard className="w-6 h-6 text-white" />
                                                </motion.div>
                                                Información de Pago
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {[
                                                    {
                                                        icon: CreditCard,
                                                        label: 'Método de pago',
                                                        value: order.payment.payment_method,
                                                        type: 'text',
                                                        color: 'from-indigo-500 to-violet-500'
                                                    },
                                                    {
                                                        icon: CheckCircle,
                                                        label: 'Estado del pago',
                                                        value: order.payment.payment_status,
                                                        type: 'badge',
                                                        color: 'from-emerald-500 to-green-500'
                                                    },
                                                    {
                                                        icon: DollarSign,
                                                        label: 'Monto pagado',
                                                        value: formatCurrency(order.payment.amount_in_cents / 100),
                                                        type: 'amount',
                                                        color: 'from-violet-500 to-indigo-500'
                                                    },
                                                    {
                                                        icon: Hash,
                                                        label: 'ID de transacción',
                                                        value: order.payment.transaction_id,
                                                        type: 'code',
                                                        color: 'from-indigo-500 to-cyan-500'
                                                    }
                                                ].map((field, idx) => (
                                                    <motion.div
                                                        key={field.label}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.1 * idx }}
                                                        whileHover={{ scale: 1.02 }}
                                                        className="space-y-3 p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/5 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all"
                                                    >
                                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                                            <div className={`w-8 h-8 rounded-lg bg-linear-to-br ${field.color} flex items-center justify-center shadow-md`}>
                                                                <field.icon className="w-4 h-4 text-white" />
                                                            </div>
                                                            {field.label}
                                                        </div>
                                                        {field.type === 'badge' ? (
                                                            <Badge
                                                                className={`${getStatusConfig(field.value as string).bgColor
                                                                    } ${getStatusConfig(field.value as string).textColor} ${getStatusConfig(field.value as string).borderColor
                                                                    } border-2 text-sm px-4 py-2 font-semibold`}
                                                            >
                                                                {field.value as string}
                                                            </Badge>
                                                        ) : field.type === 'code' ? (
                                                            <p className="font-mono text-sm text-slate-200 bg-slate-900/50 px-4 py-3 rounded-lg border border-white/10 shadow-sm">
                                                                {field.value as string}
                                                            </p>
                                                        ) : field.type === 'amount' ? (
                                                            <p className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                                                                {field.value as string}
                                                            </p>
                                                        ) : (
                                                            <p className="font-bold text-slate-100 text-lg capitalize">
                                                                {field.value as string}
                                                            </p>
                                                        )}
                                                    </motion.div>
                                                ))}
                                            </div>
                                            {order.payment.created_at && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.5 }}
                                                    className="mt-6 pt-6 border-t border-white/5"
                                                >
                                                    <div className="flex items-center gap-3 p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/5">
                                                        <Calendar className="w-5 h-5 text-indigo-400" />
                                                        <div>
                                                            <p className="text-xs text-slate-400 mb-1">Fecha y hora del pago</p>
                                                            <p className="font-bold text-slate-100">{formatDate(order.payment.created_at)}</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Shipping Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <motion.div whileHover="hover" initial="rest" variants={cardHoverVariants}>
                                <Card className="bg-slate-900/70 backdrop-blur-xl border border-white/5 shadow-xl rounded-3xl overflow-hidden">
                                    <CardHeader className=" border-b border-white/5 pb-5">
                                        <CardTitle className="flex items-center gap-3 text-2xl text-slate-100">
                                            <motion.div
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg"
                                            >
                                                <MapPin className="w-6 h-6 text-white" />
                                            </motion.div>
                                            Información de Envío
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                className="flex items-start gap-4 p-5 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/5 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all"
                                            >
                                                <Home className="w-6 h-6 text-indigo-400 mt-1 flex-shrink-0" />
                                                <div className="flex-1">
                                                    <p className="text-sm text-slate-400 mb-2 font-medium">Dirección de entrega</p>
                                                    <p className="font-bold text-slate-100 text-lg mb-2">
                                                        {order.addresses?.address || 'Dirección de envío no disponible'}
                                                    </p>
                                                    {order.addresses?.city && order.addresses?.department && (
                                                        <p className="text-sm text-slate-400 flex items-center gap-2">
                                                            <MapPin className="w-4 h-4" />
                                                            {order.addresses.city}, {order.addresses.department},{' '}
                                                            {order.addresses.country}
                                                        </p>
                                                    )}
                                                </div>
                                            </motion.div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    className="flex items-center gap-4 p-5 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/5 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all"
                                                >
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md">
                                                        <Truck className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-400 mb-1">Costo de envío</p>
                                                        <p className="text-xl font-bold text-slate-100">
                                                            {formatCurrency(shipping)}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    className="flex items-center gap-4 p-5 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/5 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/10 transition-all"
                                                >
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md">
                                                        <Package className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-400 mb-1">Estado de envío</p>
                                                        <p className="text-xl font-bold text-slate-100 capitalize">
                                                            {order.status || 'Pendiente'}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Right Column - Sidebar */}
                    <motion.div variants={itemVariants} className="space-y-6">
                        {/* Order Summary - Sticky */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="sticky top-6"
                        >
                            <motion.div whileHover="hover" initial="rest" variants={cardHoverVariants}>
                                <Card className="bg-slate-900/70 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl overflow-hidden">
                                    <CardHeader className=" border-b border-white/5 pb-5">
                                        <CardTitle className="flex items-center gap-3 text-2xl text-slate-100">
                                            <motion.div
                                                animate={{ rotate: [0, 5, -5, 0] }}
                                                transition={{ duration: 3, repeat: Infinity }}
                                                className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg"
                                            >
                                                <FileText className="w-6 h-6 text-white" />
                                            </motion.div>
                                            Resumen
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-5">
                                        <div className="space-y-4">
                                            {[
                                                { label: 'Subtotal', value: subtotal, icon: DollarSign },
                                                { label: 'Envío', value: shipping, icon: Truck, special: shipping === 0 },
                                                { label: 'IVA (19%)', value: taxes, icon: FileText }
                                            ].map((item, idx) => (
                                                <motion.div
                                                    key={item.label}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 * idx }}
                                                    className="flex items-center justify-between text-slate-300 p-3 rounded-xl bg-slate-800/50 backdrop-blur-sm hover:bg-slate-800/70 transition-colors"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <item.icon className="w-4 h-4 text-slate-400" />
                                                        <span className="font-medium">{item.label}</span>
                                                    </div>
                                                    <span className="font-bold text-lg text-slate-100">
                                                        {item.special ? (
                                                            <span className="text-green-400 font-bold">Gratis</span>
                                                        ) : (
                                                            formatCurrency(item.value)
                                                        )}
                                                    </span>
                                                </motion.div>
                                            ))}
                                        </div>

                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.4 }}
                                            className="pt-5 border-t border-white/10"
                                        >
                                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-indigo-500/20">
                                                <span className="text-xl font-bold text-slate-100">Total</span>
                                                <motion.span
                                                    animate={{ scale: [1, 1.05, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                    className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent"
                                                >
                                                    {formatCurrency(total)}
                                                </motion.span>
                                            </div>
                                        </motion.div>

                                        {shipping === 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.5 }}
                                                className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-2xl border border-green-500/20"
                                            >
                                                <CheckCircle className="w-6 h-6 text-green-400 mt-0.5 flex-shrink-0" />
                                                <p className="text-sm text-green-300 font-medium">
                                                    <strong className="block mb-1">¡Envío gratis!</strong>
                                                    Aplicado en compras mayores a $100,000
                                                </p>
                                            </motion.div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>

                        {/* Order Details Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <motion.div whileHover="hover" initial="rest" variants={cardHoverVariants}>
                                <Card className="bg-slate-900/70 backdrop-blur-xl border border-white/5 shadow-xl rounded-3xl overflow-hidden">
                                    <CardHeader className=" border-b border-white/5 pb-5">
                                        <CardTitle className="flex items-center gap-3 text-xl text-slate-100">
                                            <motion.div
                                                whileHover={{ rotate: 360 }}
                                                transition={{ duration: 0.6 }}
                                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg"
                                            >
                                                <Info className="w-5 h-5 text-white" />
                                            </motion.div>
                                            Detalles
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-4">
                                        {[
                                            { icon: Hash, label: 'ID de orden', value: `#${order.id}` },
                                            { icon: Calendar, label: 'Fecha de creación', value: order.created_at ? formatDate(order.created_at) : 'N/A' },
                                            { icon: User, label: 'ID de usuario', value: `#${order.user_id}` }
                                        ].map((detail, idx) => (
                                            <motion.div
                                                key={detail.label}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 * idx }}
                                                whileHover={{ x: 5 }}
                                                className="flex items-center gap-3 p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/5 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md">
                                                    <detail.icon className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-slate-400 mb-0.5">{detail.label}</p>
                                                    <p className="font-bold text-slate-100">{detail.value}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="space-y-3"
                        >
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    className="w-full h-14 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-700 hover:via-violet-700 hover:to-indigo-700 text-white shadow-2xl shadow-indigo-500/20 font-bold text-lg rounded-2xl"
                                    onClick={() => router.push('/')}
                                >
                                    Seguir comprando
                                    <ChevronRight className="w-5 h-5 ml-2" />
                                </Button>
                            </motion.div>
                            {order.status === 'delivered' && (
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        variant="outline"
                                        className="w-full h-14 border-2 border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-600/50 text-slate-100 font-bold text-lg rounded-2xl shadow-lg"
                                    >
                                        <Star className="w-5 h-5 mr-2" />
                                        Comprar de nuevo
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
