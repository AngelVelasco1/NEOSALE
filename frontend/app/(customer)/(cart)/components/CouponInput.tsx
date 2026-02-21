"use client";

import { useState, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, X, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateCoupon } from "../services/couponApi";
import type { AppliedCoupon } from "../types/coupon";

interface CouponInputProps {
    subtotal: number;
    onCouponApplied: (coupon: AppliedCoupon) => void;
    onCouponRemoved: () => void;
    appliedCoupon: AppliedCoupon | null;
}

export default function CouponInput({
    subtotal,
    onCouponApplied,
    onCouponRemoved,
    appliedCoupon,
}: CouponInputProps) {
    const [code, setCode] = useState("");
    const [isValidating, setIsValidating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleApplyCoupon = async () => {
        if (!code.trim()) {
            setError("Ingresa un código de cupón");
            return;
        }

        setIsValidating(true);
        setError(null);

        try {
            const result = await validateCoupon(code.trim().toUpperCase(), subtotal);

            if (result.valid && result.coupon && result.discount_amount !== undefined) {
                onCouponApplied({
                    coupon: result.coupon,
                    discount_amount: result.discount_amount,
                });
                setCode("");
                setError(null);
            } else {
                setError(result.error || "Cupón inválido");
            }
        } catch {
            setError("Error al validar el cupón");
        } finally {
            setIsValidating(false);
        }
    };

    const handleRemoveCoupon = () => {
        onCouponRemoved();
        setCode("");
        setError(null);
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !appliedCoupon) {
            handleApplyCoupon();
        }
    };

    return (
        <div className="space-y-3">
            {/* Applied Coupon Display */}
            <AnimatePresence>
                {appliedCoupon && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        className="bg-linear-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-xl p-3"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <Check className="w-4 h-4 text-green-400 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-green-300 truncate">
                                        {appliedCoupon.coupon.name}
                                    </p>
                                    <p className="text-xs text-green-400 font-medium">
                                        -${appliedCoupon.discount_amount.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleRemoveCoupon}
                                className="h-8 w-8 p-0 text-green-300 hover:text-green-200 hover:bg-green-500/20 shrink-0"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Input Form */}
            {!appliedCoupon && (
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <Input
                                type="text"
                                placeholder="Cupón"
                                value={code}
                                onChange={(e) => {
                                    setCode(e.target.value.toUpperCase());
                                    setError(null);
                                }}
                                onKeyPress={handleKeyPress}
                                disabled={isValidating}
                                className="h-10 pl-10 bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20 uppercase font-mono text-sm"
                            />
                        </div>
                        <Button
                            onClick={handleApplyCoupon}
                            disabled={isValidating || !code.trim()}
                            className="h-10 bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0 px-4 text-sm"
                        >
                            {isValidating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Aplicar"
                            )}
                        </Button>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-2"
                            >
                                <AlertCircle className="w-3 h-3 shrink-0" />
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
