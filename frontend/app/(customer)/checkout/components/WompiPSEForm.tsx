"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Building2, AlertCircle, User, Mail, Phone, FileText, CreditCard, Shield, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    getPSEFinancialInstitutionsApi,
    processPSEPaymentFlow,
    convertToCents,
    type PSEFinancialInstitution,
} from "../services/paymentsApi";

interface PSEFormData {
    user_type: 0 | 1;
    user_legal_id_type: "CC" | "CE" | "NIT" | "PP";
    user_legal_id: string;
    financial_institution_code: string;
    customer_email: string;
    full_name: string;
    phone_number: string;
}

interface WompiPSEFormProps {
    amount: number;
    description: string;
    onSuccess: (paymentId: string) => void;
    onError: (error: Error) => void;
    disabled?: boolean;
    userId: number;
    acceptanceTokens: { [key: string]: string };
}

export default function WompiPSEForm({
    amount,
    description,
    onSuccess,
    onError,
    disabled,
    userId,
    acceptanceTokens,
}: WompiPSEFormProps) {
    const [financialInstitutions, setFinancialInstitutions] = useState<PSEFinancialInstitution[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingInstitutions, setLoadingInstitutions] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const [formData, setFormData] = useState<PSEFormData>({
        user_type: 0,
        user_legal_id_type: "CC",
        user_legal_id: "",
        financial_institution_code: "",
        customer_email: "",
        full_name: "",
        phone_number: "",
    });

    useEffect(() => {
        const loadFinancialInstitutions = async () => {
            try {
                setLoadingInstitutions(true);
                console.log("🏛️ Cargando instituciones financieras PSE con paymentsApi...");

                const response = await getPSEFinancialInstitutionsApi();

                if (!response.success || !response.data) {
                    throw new Error(response.error || "Error obteniendo instituciones financieras");
                }

                setFinancialInstitutions(response.data);
                console.log("✅ Instituciones financieras cargadas:", response.data.length);
            } catch (error) {
                console.error("❌ Error cargando instituciones financieras:", error);
                setError(error instanceof Error ? error.message : "Error desconocido");
                onError(error instanceof Error ? error : new Error("Error cargando bancos PSE"));
            } finally {
                setLoadingInstitutions(false);
            }
        };

        loadFinancialInstitutions();
    }, [onError]);

    const handleFormChange = (field: keyof PSEFormData, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setError(null);
    };

    const validateForm = (): boolean => {
        if (!formData.user_legal_id.trim()) {
            setError("El número de documento es requerido");
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

        if (!formData.phone_number.trim()) {
            setError("El número de teléfono es requerido");
            return false;
        }

        if (!formData.financial_institution_code) {
            setError("Debe seleccionar una institución financiera");
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

        if (formData.user_legal_id_type === "CC" && formData.user_legal_id.length < 6) {
            setError("La cédula debe tener al menos 6 dígitos");
            return false;
        }

        if (formData.user_legal_id_type === "NIT" && formData.user_legal_id.length < 9) {
            setError("El NIT debe tener al menos 9 dígitos");
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

            console.log("💳 Iniciando pago PSE con paymentsApi:", {
                amount,
                user_type: formData.user_type === 0 ? "Natural" : "Jurídica",
                financial_institution: financialInstitutions.find(
                    inst => inst.financial_institution_code === formData.financial_institution_code
                )?.financial_institution_name
            });

            const customerData = {
                email: formData.customer_email,
                name: formData.full_name,
                phone: formData.phone_number,
                documentType: formData.user_legal_id_type,
                documentNumber: formData.user_legal_id,
                userType: formData.user_type,
            };

            const amountInCents = convertToCents(amount);
            const orderData = {
                amount: amountInCents,
                currency: "COP",
                userId,
                description: description || `Pago PSE NEOSALE - ${new Date().toLocaleDateString()}`,
            };

            console.log("💰 Conversión de monto PSE:", {
                amountInPesos: amount,
                amountInCents,
                conversionFactor: 100,
            });

            const pseData = {
                financialInstitutionCode: formData.financial_institution_code,
            };

            const response = await processPSEPaymentFlow(
                customerData,
                orderData,
                pseData,
                undefined,
                []
            );

            if (!response.success || !response.data) {
                throw new Error(response.error || "Error creando transacción PSE");
            }

            console.log("✅ Transacción PSE creada con paymentsApi:", {
                id: response.data.transactionId,
                payment_link: response.data.payment_link
            });

            if (response.data.payment_link) {
                console.log("🔗 Redirigiendo a:", response.data.payment_link);
                window.location.href = response.data.payment_link;
                onSuccess(response.data.transactionId);
            } else {
                throw new Error("No se recibió URL de pago del banco");
            }

        } catch (error) {
            console.error("❌ Error en pago PSE:", error);
            setError(error instanceof Error ? error.message : "Error procesando pago PSE");
            onError(error instanceof Error ? error : new Error("Error procesando pago PSE"));
        } finally {
            setLoading(false);
        }
    };

    if (loadingInstitutions) {
        return (
            <div className="min-h-[600px] flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50/30 to-cyan-50">
                <div className="text-center space-y-6">
                    <div className="relative w-20 h-20 mx-auto">
                        <div className="absolute inset-0 border-4 border-purple-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-2 border-4 border-blue-100 rounded-full"></div>
                        <div className="absolute inset-2 border-4 border-t-blue-500 rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }}></div>
                    </div>
                    <p className="text-lg font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Cargando bancos disponibles...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-cyan-50/30 min-h-screen">
            <div className="mb-8 text-center space-y-3 animate-in fade-in slide-in-from-top duration-700">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 shadow-lg mb-4">
                    <Building2 className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Pago PSE
                </h1>
                <p className="text-gray-600">Paga de forma segura desde tu banco</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100/50 p-8 mb-6 animate-in fade-in slide-in-from-bottom duration-500">
                <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                    <span className="text-lg text-gray-600">Total a pagar</span>
                    <div className="text-right">
                        <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            ${amount.toLocaleString("es-CO")}
                        </p>
                        <p className="text-sm text-gray-500">COP</p>
                    </div>
                </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100/50 overflow-hidden animate-in fade-in slide-in-from-bottom duration-700">
                <div className="p-8 space-y-8">
                    {error && (
                        <Alert variant="destructive" className="border-red-200 bg-red-50 animate-in fade-in slide-in-from-top duration-300">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">Tipo de Usuario</h2>
                            </div>

                            <RadioGroup
                                value={formData.user_type.toString()}
                                onValueChange={(value) => handleFormChange("user_type", parseInt(value) as 0 | 1)}
                                className="grid grid-cols-2 gap-4"
                            >
                                <label
                                    htmlFor="natural"
                                    className={`relative flex items-center justify-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${formData.user_type === 0
                                            ? "border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 shadow-lg scale-105"
                                            : "border-gray-200 bg-gray-50 hover:border-purple-300 hover:bg-purple-50/50"
                                        }`}
                                >
                                    <RadioGroupItem value="0" id="natural" className="sr-only" />
                                    <div className="text-center space-y-2">
                                        <User className={`w-6 h-6 mx-auto ${formData.user_type === 0 ? "text-purple-600" : "text-gray-400"}`} />
                                        <span className={`font-medium ${formData.user_type === 0 ? "text-purple-900" : "text-gray-700"}`}>
                                            Persona Natural
                                        </span>
                                    </div>
                                    {formData.user_type === 0 && (
                                        <div className="absolute top-3 right-3">
                                            <CheckCircle2 className="w-5 h-5 text-purple-600" />
                                        </div>
                                    )}
                                </label>

                                <label
                                    htmlFor="juridica"
                                    className={`relative flex items-center justify-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${formData.user_type === 1
                                            ? "border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg scale-105"
                                            : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/50"
                                        }`}
                                >
                                    <RadioGroupItem value="1" id="juridica" className="sr-only" />
                                    <div className="text-center space-y-2">
                                        <Building2 className={`w-6 h-6 mx-auto ${formData.user_type === 1 ? "text-blue-600" : "text-gray-400"}`} />
                                        <span className={`font-medium ${formData.user_type === 1 ? "text-blue-900" : "text-gray-700"}`}>
                                            Persona Jurídica
                                        </span>
                                    </div>
                                    {formData.user_type === 1 && (
                                        <div className="absolute top-3 right-3">
                                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                        </div>
                                    )}
                                </label>
                            </RadioGroup>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">Información de Identificación</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="docType" className="text-sm font-medium text-gray-700">
                                        Tipo de Documento
                                    </Label>
                                    <Select
                                        value={formData.user_legal_id_type}
                                        onValueChange={(value) => handleFormChange("user_legal_id_type", value)}
                                    >
                                        <SelectTrigger className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all">
                                            <SelectValue placeholder="Seleccionar tipo" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                                            <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                                            <SelectItem value="NIT">NIT</SelectItem>
                                            <SelectItem value="PP">Pasaporte</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="docNumber" className="text-sm font-medium text-gray-700">
                                        Número de Documento
                                    </Label>
                                    <Input
                                        id="docNumber"
                                        type="text"
                                        placeholder="Ingrese su documento"
                                        value={formData.user_legal_id}
                                        onChange={(e) => handleFormChange("user_legal_id", e.target.value)}
                                        onFocus={() => setFocusedField("docNumber")}
                                        onBlur={() => setFocusedField(null)}
                                        disabled={loading}
                                        className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">Información de Contacto</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
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
                                        className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
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
                                        className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                        Número de Teléfono
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
                                        className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all"
                                    />
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <Phone className="w-3 h-3" />
                                        Formato: 3001234567 (sin espacios ni símbolos)
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">Selecciona tu Banco</h2>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bank" className="text-sm font-medium text-gray-700">
                                    Institución Financiera
                                </Label>
                                <Select
                                    value={formData.financial_institution_code}
                                    onValueChange={(value) => handleFormChange("financial_institution_code", value)}
                                >
                                    <SelectTrigger className="h-14 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all">
                                        <SelectValue placeholder="Seleccionar banco" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl max-h-[300px]">
                                        {financialInstitutions.map((institution) => (
                                            <SelectItem
                                                key={institution.financial_institution_code}
                                                value={institution.financial_institution_code}
                                                className="py-3"
                                            >
                                                {institution.financial_institution_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="pt-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 rounded-2xl border border-purple-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                        <Shield className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Pago seguro</p>
                                        <p className="text-sm font-medium text-gray-900">Encriptación SSL</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                        <Building2 className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Procesado por</p>
                                        <p className="text-sm font-medium text-gray-900">Tu banco</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                        <CheckCircle2 className="w-5 h-5 text-cyan-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Confirmación</p>
                                        <p className="text-sm font-medium text-gray-900">Inmediata</p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                                disabled={loading || disabled}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                {loading ? (
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Procesando pago...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="h-5 w-5" />
                                        <span>Pagar ${amount.toLocaleString("es-CO")} COP con PSE</span>
                                    </div>
                                )}
                            </Button>

                            <p className="text-center text-xs text-gray-500">
                                Serás redirigido a tu banco para completar la transacción de forma segura
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
