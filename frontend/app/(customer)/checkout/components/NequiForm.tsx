import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Smartphone, AlertCircle, User, Mail, Phone, Shield, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    processNequiPaymentFlow,
    convertToCents,
    type NequiPaymentData,
} from "../services/paymentsApi";

interface NequiFormProps {
    amount: number;
    description: string;
    onSuccess: (paymentId: string) => void;
    onError: (error: Error) => void;
    disabled?: boolean;
    userId: number;
    acceptanceTokens: { [key: string]: string };
}

export default function NequiForm({
    amount,
    description,
    onSuccess,
    onError,
    disabled,
    userId,
    acceptanceTokens,
}: NequiFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        phone_number: "",
        customer_email: "",
        full_name: "",
    });

    const handleFormChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setError(null);
    };

    const validateForm = (): boolean => {
        if (!formData.phone_number.trim()) {
            setError("El número de teléfono es requerido");
            return false;
        }

        if (!formData.customer_email.trim()) {
            setError("El email es requerido");
            return false;
        }

        if (!formData.full_name.trim()) {
            setError("El nombre completo es requerido");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.customer_email)) {
            setError("El email no tiene un formato válido");
            return false;
        }

        const phoneRegex = /^(\+57|57)?[0-9]{10}$/;
        if (!phoneRegex.test(formData.phone_number.replace(/\s+/g, ""))) {
            setError("El teléfono debe tener formato colombiano (ej: 3001234567)");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (disabled) return;

        if (!validateForm()) return;

        try {
            setLoading(true);
            setError(null);

            const customerData = {
                userId,
                email: formData.customer_email,
                name: formData.full_name,
                phone: formData.phone_number,
                documentType: "CC" as const, // Nequi requiere documento, pero no lo solicita en el form
                documentNumber: "123456789", // Placeholder, ajustar según necesidad
                userType: 0 as const, // Persona natural
            };

            const amountInCents = convertToCents(amount);
            const orderData = {
                amount: amountInCents,
                currency: "COP",
                userId,
                description: description || `Pago Nequi NEOSALE - ${new Date().toLocaleDateString()}`,
            };

            const nequiData = {
                phoneNumber: formData.phone_number,
            };

            const response = await processNequiPaymentFlow(
                customerData,
                orderData,
                nequiData,
                undefined,
                []
            );

            if (!response.success || !response.data) {
                throw new Error(response.error || "Error creando transacción Nequi");
            }

            console.log("Transacción Nequi creada con paymentsApi:", {
                id: response.data.transactionId,
                status: response.data.status
            });

            // Nequi no redirige automáticamente, solo confirma la transacción
            onSuccess(response.data.transactionId);

        } catch (error) {
            console.error("❌ Error en pago Nequi:", error);
            setError(error instanceof Error ? error.message : "Error procesando pago Nequi");
            onError(error instanceof Error ? error : new Error("Error procesando pago Nequi"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-3 min-h-screen">
            <Card className="bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50">
                <CardContent className="p-8 space-y-7">
                    {error && (
                        <Alert variant="destructive" className="border-red-500/30 bg-red-600/10 backdrop-blur-sm rounded-xl">
                            <AlertCircle className="h-4 w-4 text-red-400" />
                            <AlertDescription className="text-sm text-red-300">{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-7">
                        {/* Phone Number Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-700/50">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-700 flex items-center justify-center shadow-lg shadow-violet-500/30">
                                    <Smartphone className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-white">
                                    Información de Nequi
                                </h3>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm font-semibold text-slate-300">
                                        Número de teléfono Nequi
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="3001234567"
                                        value={formData.phone_number}
                                        onChange={(e) => handleFormChange("phone_number", e.target.value)}
                                        onFocus={() => setFocusedField("phone")}
                                        onBlur={() => setFocusedField(null)}
                                        disabled={loading}
                                        className="h-11 bg-slate-700/30 border-slate-600/50 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-white placeholder:text-slate-500"
                                    />
                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                        <Phone className="w-3 h-3" />
                                        Número colombiano de 10 dígitos registrado en Nequi
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-700/50">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-700 flex items-center justify-center shadow-lg shadow-violet-500/30">
                                    <Mail className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-white">
                                    Información de Contacto
                                </h3>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-sm font-semibold text-slate-300">
                                        Nombre Completo
                                    </Label>
                                    <Input
                                        id="fullName"
                                        type="text"
                                        placeholder="Nombre(s) Apellido(s)"
                                        value={formData.full_name}
                                        onChange={(e) => handleFormChange("full_name", e.target.value)}
                                        onFocus={() => setFocusedField("fullName")}
                                        onBlur={() => setFocusedField(null)}
                                        disabled={loading}
                                        className="h-11 bg-slate-700/30 border-slate-600/50 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-white placeholder:text-slate-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-semibold text-slate-300">
                                        Correo Electrónico
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="correo@ejemplo.com"
                                        value={formData.customer_email}
                                        onChange={(e) => handleFormChange("customer_email", e.target.value)}
                                        onFocus={() => setFocusedField("email")}
                                        onBlur={() => setFocusedField(null)}
                                        disabled={loading}
                                        className="h-11 bg-slate-700/30 border-slate-600/50 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-white placeholder:text-slate-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Security Info & Submit */}
                        <div className="pt-4 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-gradient-to-br from-violet-600/10 via-purple-600/10 to-indigo-600/10 rounded-xl border border-slate-700/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center shadow-md">
                                        <Shield className="w-5 h-5 text-violet-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Pago seguro</p>
                                        <p className="text-sm font-semibold text-white">Encriptación SSL</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center shadow-md">
                                        <Smartphone className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Procesado por</p>
                                        <p className="text-sm font-semibold text-white">Nequi App</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center shadow-md">
                                        <CheckCircle2 className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Confirmación</p>
                                        <p className="text-sm font-semibold text-white">Push Notification</p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 text-base font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all"
                                disabled={loading || disabled}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Procesando pago...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Smartphone className="h-5 w-5" />
                                        <span>Pagar ${amount.toLocaleString("es-CO")} COP</span>
                                    </div>
                                )}
                            </Button>

                            <p className="text-center text-xs text-slate-400">
                                Recibirás una notificación push en tu app de Nequi para confirmar el pago
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}