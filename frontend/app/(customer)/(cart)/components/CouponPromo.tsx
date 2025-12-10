"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Tag, Clock, TrendingUp, Copy, Check } from "lucide-react";
import { getActiveCoupons } from "../services/couponApi";
import type { Coupon } from "../types/coupon";
import { Badge } from "@/components/ui/badge";

interface CouponPromoProps {
    onCouponSelect?: (code: string) => void;
}

export default function CouponPromo({ onCouponSelect }: CouponPromoProps) {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const activeCoupons = await getActiveCoupons();
                setCoupons(activeCoupons.slice(0, 3));
            } catch (error) {
                console.error("Error loading coupons:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCoupons();
    }, []);

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);

        if (onCouponSelect) {
            onCouponSelect(code);
        }
    };

    const formatDiscount = (coupon: Coupon) => {
        if (coupon.discount_type === "percentage") {
            return `${coupon.discount_value}% OFF`;
        }
        return `$${Number(coupon.discount_value).toLocaleString()} OFF`;
    };

    const getDaysUntilExpiry = (expiresAt: string) => {
        const now = new Date();
        const expiry = new Date(expiresAt);
        const diffTime = expiry.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/60 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
                    <h3 className="text-xl font-bold text-slate-100">Cupones Disponibles</h3>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-slate-800/50 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (coupons.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/60 shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500"
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl">
                    <Sparkles className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-100">Cupones Disponibles</h3>
                    <p className="text-sm text-slate-400">Ahorra en tu compra</p>
                </div>
            </div>

            {/* Coupons List */}
            <div className="space-y-3">
                <AnimatePresence>
                    {coupons.map((coupon, index) => {
                        const daysLeft = getDaysUntilExpiry(coupon.expires_at);
                        const isExpiringSoon = daysLeft <= 3;
                        const isCopied = copiedCode === coupon.code;

                        return (
                            <motion.div
                                key={coupon.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative bg-gradient-to-r from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-xl p-4 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer"
                                onClick={() => handleCopyCode(coupon.code)}
                            >
                                {/* Background Pattern */}
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />

                                <div className="relative flex items-center justify-between gap-4">
                                    {/* Left: Icon & Info */}
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg shrink-0">
                                            <Tag className="w-5 h-5 text-indigo-400" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-slate-100 truncate">{coupon.name}</h4>
                                                <Badge variant="success" className="shrink-0 text-xs">
                                                    {formatDiscount(coupon)}
                                                </Badge>
                                            </div>

                                            {/* Conditions */}
                                            <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                                                {coupon.min_purchase_amount > 0 && (
                                                    <span className="flex items-center gap-1">
                                                        <TrendingUp className="w-3 h-3" />
                                                        Compra mín: ${Number(coupon.min_purchase_amount).toLocaleString()}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {isExpiringSoon ? (
                                                        <span className="text-amber-400 font-medium">
                                                            ¡Expira en {daysLeft} {daysLeft === 1 ? "día" : "días"}!
                                                        </span>
                                                    ) : (
                                                        `Válido ${daysLeft} días`
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Code & Copy Button */}
                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        <div className="flex items-center gap-2">
                                            <code className="px-3 py-1.5 bg-slate-900/80 border border-slate-600 rounded-lg text-indigo-300 font-mono text-sm font-bold">
                                                {coupon.code}
                                            </code>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/50 rounded-lg transition-colors"
                                            >
                                                {isCopied ? (
                                                    <Check className="w-4 h-4 text-green-400" />
                                                ) : (
                                                    <Copy className="w-4 h-4 text-indigo-400" />
                                                )}
                                            </motion.button>
                                        </div>

                                        {coupon.usage_limit && (
                                            <span className="text-xs text-slate-500">
                                                {coupon.usage_limit - (coupon.usage_count || 0)} usos restantes
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Expiring Soon Alert */}
                                {isExpiringSoon && (
                                    <div className="mt-3 pt-3 border-t border-amber-500/20">
                                        <div className="flex items-center gap-2 text-xs text-amber-400">
                                            <Sparkles className="w-3 h-3" />
                                            <span className="font-medium">¡Úsalo pronto antes de que expire!</span>
                                        </div>
                                    </div>
                                )}

                                {/* Copied Feedback */}
                                <AnimatePresence>
                                    {isCopied && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute top-2 right-2 px-3 py-1.5 bg-green-500/90 text-white text-xs font-medium rounded-lg shadow-lg"
                                        >
                                            ¡Código copiado!
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Footer Hint */}
            <div className="mt-4 pt-4 border-t border-slate-700/50">
                <p className="text-xs text-slate-400 text-center">
                    <Tag className="w-3 h-3 inline-block mr-1" />
                    Haz clic en cualquier cupón para copiar el código
                </p>
            </div>
        </motion.div>
    );
}
