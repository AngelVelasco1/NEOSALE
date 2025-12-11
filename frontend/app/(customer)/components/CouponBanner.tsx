"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, X, TrendingUp, Clock, ChevronRight } from "lucide-react";
import { getActiveCoupons } from "../(cart)/services/couponApi";
import type { Coupon } from "../(cart)/types/coupon";
import Link from "next/link";

export default function CouponBanner() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        if (coupons.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % coupons.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [coupons.length]);

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

    if (loading || coupons.length === 0 || !isVisible) {
        return null;
    }

    const currentCoupon = coupons[currentIndex];
    const daysLeft = getDaysUntilExpiry(currentCoupon.expires_at);
    const isExpiringSoon = daysLeft <= 3;

    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="w-full sticky top-0 left-0 right-0 bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-600 shadow-lg"
        >
            <div className="container mx-auto px-4">
                <div className="relative flex items-center justify-between py-3 gap-4">
                    {/* Left: Icon */}
                    <div className="hidden sm:flex items-center gap-2 shrink-0">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Tag className="w-5 h-5 text-white" />
                        </div>
                    </div>

                    {/* Center: Coupon Info */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentCoupon.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex-1 flex flex-wrap items-center justify-center gap-3 text-white"
                        >
                            <span className="font-bold text-base">{currentCoupon.name}</span>
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold">
                                {formatDiscount(currentCoupon)}
                            </span>
                            <code className="hidden md:inline-block px-3 py-1 bg-white/90 text-indigo-600 rounded-lg text-sm font-mono font-bold">
                                {currentCoupon.code}
                            </code>

                            <div className="flex items-center gap-3 text-sm">
                                {currentCoupon.min_purchase_amount > 0 && (
                                    <span className="flex items-center gap-1 opacity-90">
                                        <TrendingUp className="w-3 h-3" />
                                        Min ${Number(currentCoupon.min_purchase_amount).toLocaleString()}
                                    </span>
                                )}
                                <span className={`flex items-center gap-1 ${isExpiringSoon ? "animate-pulse font-bold" : "opacity-90"}`}>
                                    <Clock className="w-3 h-3" />
                                    {isExpiringSoon ? `¡${daysLeft} días!` : `${daysLeft} días`}
                                </span>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Right: CTA & Close */}
                    <div className="flex items-center gap-2 shrink-0">
                        <Link
                            href="/productsCart"
                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 hover:bg-indigo-50 rounded-lg font-semibold text-sm transition-colors shadow-lg"
                        >
                            Usar ahora
                            <ChevronRight className="w-4 h-4" />
                        </Link>

                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            aria-label="Cerrar banner"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Indicators */}
                    {coupons.length > 1 && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {coupons.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-1 rounded-full transition-all ${index === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"
                                        }`}
                                    aria-label={`Ir a cupón ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
