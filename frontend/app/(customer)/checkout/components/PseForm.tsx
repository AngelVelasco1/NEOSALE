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
import { useCart } from "../../(cart)/hooks/useCart";
import { CartProductsInfo } from "../../types";

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
    const { cartProducts } = useCart();
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

                const response = await getPSEFinancialInstitutionsApi();

                if (!response.success || !response.data) {
                    throw new Error(response.error || "Error obteniendo instituciones financieras");
                }

                setFinancialInstitutions(response.data);
            } catch (error) {
                console.error("Error cargando instituciones financieras:", error);
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

            const customerData = {
                userId: userId,
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


            const pseData = {
                financialInstitutionCode: formData.financial_institution_code,
            };

            const cartData =
                cartProducts?.map((product: CartProductsInfo) => ({
                    product_id: product.id,
                    quantity: product.quantity,
                    price: product.price,
                    name: product.name || product.title,
                    color_code: product.color_code || "",
                    size: product.size || "",
                })) || []

            const response = await processPSEPaymentFlow(
                customerData,
                orderData,
                pseData,
                undefined,
                cartData
            );

            if (!response.success || !response.data) {
                throw new Error(response.error || "Error creando transacción PSE");
            }

            console.log("Transacción PSE creada con paymentsApi:", {
                id: response.data.transactionId,
                payment_link: response.data.payment_link
            });

            if (response.data.payment_link) {
                // Llamar onSuccess para crear la orden antes de redirigir
                onSuccess(response.data.transactionId);
                window.location.href = response.data.payment_link;
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
            <div className="min-h-[500px] flex items-center justify-center bg-transparent">
                <div className="text-center space-y-5">
                    <div className="relative w-20 h-20 mx-auto">
                        <div className="absolute inset-0 border-4 border-slate-700/50 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-violet-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-2 border-4 border-slate-600/50 rounded-full"></div>
                        <div className="absolute inset-2 border-4 border-t-indigo-500 rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }}></div>
                    </div>
                    <p className="text-base font-semibold text-white">
                        Cargando bancos disponibles...
                    </p>
                </div>
            </div>
        );
    }

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
                        {/* User Type Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-700/50">
                                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-600 via-violet-700 to-indigo-700 flex items-center justify-center shadow-lg shadow-violet-500/30">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-white">
                                    Tipo de Usuario
                                </h3>
                            </div>

                            <RadioGroup
                                value={formData.user_type.toString()}
                                onValueChange={(value) => handleFormChange("user_type", parseInt(value) as 0 | 1)}
                                className="grid grid-cols-2 gap-4"
                            >
                                <label
                                    htmlFor="natural"
                                    className={`relative flex items-center justify-center p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${formData.user_type === 0
                                        ? "border-violet-500 bg-linear-to-br from-violet-50/10 to-indigo-50/10 shadow-lg shadow-violet-500/20"
                                        : "border-slate-600/50 bg-slate-700/30 hover:border-violet-400 hover:bg-violet-50/5 hover:shadow-md"
                                        }`}
                                >
                                    <RadioGroupItem value="0" id="natural" className="sr-only" />
                                    <div className="text-center space-y-2">
                                        <User className={`w-6 h-6 mx-auto ${formData.user_type === 0 ? "text-violet-400" : "text-slate-400"}`} />
                                        <span className={`text-sm font-semibold ${formData.user_type === 0 ? "text-white" : "text-slate-300"}`}>
                                            Persona Natural
                                        </span>
                                    </div>
                                    {formData.user_type === 0 && (
                                        <div className="absolute top-3 right-3">
                                            <CheckCircle2 className="w-5 h-5 text-violet-400" />
                                        </div>
                                    )}
                                </label>

                                <label
                                    htmlFor="juridica"
                                    className={`relative flex items-center justify-center p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${formData.user_type === 1
                                        ? "border-indigo-500 bg-linear-to-br from-indigo-50/10 to-blue-50/10 shadow-lg shadow-indigo-500/20"
                                        : "border-slate-600/50 bg-slate-700/30 hover:border-indigo-400 hover:bg-indigo-50/5 hover:shadow-md"
                                        }`}
                                >
                                    <RadioGroupItem value="1" id="juridica" className="sr-only" />
                                    <div className="text-center space-y-2">
                                        <Building2 className={`w-6 h-6 mx-auto ${formData.user_type === 1 ? "text-indigo-400" : "text-slate-400"}`} />
                                        <span className={`text-sm font-semibold ${formData.user_type === 1 ? "text-white" : "text-slate-300"}`}>
                                            Persona Jurídica
                                        </span>
                                    </div>
                                    {formData.user_type === 1 && (
                                        <div className="absolute top-3 right-3">
                                            <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                                        </div>
                                    )}
                                </label>
                            </RadioGroup>
                        </div>

                        {/* Identification Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-700/50">
                                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-600 via-purple-700 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                    <FileText className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-white">
                                    Información de Identificación
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="docType" className="text-sm font-semibold text-slate-300">
                                        Tipo de Documento
                                    </Label>
                                    <Select
                                        value={formData.user_legal_id_type}

                                        onValueChange={(value) => handleFormChange("user_legal_id_type", value)}
                                    >
                                        <SelectTrigger className="h-11 py-5 bg-slate-700/30 border-slate-600/50 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-white">
                                            <SelectValue placeholder="Seleccionar tipo" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl bg-slate-800 border-slate-700">
                                            <SelectItem value="CC" className="text-white hover:bg-slate-700">Cédula de Ciudadanía</SelectItem>
                                            <SelectItem value="CE" className="text-white hover:bg-slate-700">Cédula de Extranjería</SelectItem>
                                            <SelectItem value="NIT" className="text-white hover:bg-slate-700">NIT</SelectItem>
                                            <SelectItem value="PP" className="text-white hover:bg-slate-700">Pasaporte</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="docNumber" className="text-sm font-semibold text-slate-300">
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
                                        className="h-11 bg-slate-700/30 border-slate-600/50 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-white placeholder:text-slate-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-700/50">
                                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-600 via-violet-700 to-purple-700 flex items-center justify-center shadow-lg shadow-slate-500/30">
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
                                        className="h-11 bg-slate-700/30 border-slate-600/50 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder:text-slate-500"
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
                                        className="h-11 bg-slate-700/30 border-slate-600/50 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder:text-slate-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm font-semibold text-slate-300">
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
                                        className="h-11 bg-slate-700/30 border-slate-600/50 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder:text-slate-500"
                                    />
                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                        <Phone className="w-3 h-3" />
                                        Formato: 3001234567 (sin espacios ni símbolos)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bank Selection Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-700/50">
                                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-600 via-purple-700 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-white">
                                    Selecciona tu Banco
                                </h3>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bank" className="text-sm font-semibold text-slate-300">
                                    Institución Financiera
                                </Label>
                                <Select
                                    value={formData.financial_institution_code}
                                    onValueChange={(value) => handleFormChange("financial_institution_code", value)}
                                >
                                    <SelectTrigger className="h-12 bg-slate-700/30 border-slate-600/50 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white">
                                        <SelectValue placeholder="Seleccionar banco" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl max-h-[300px] bg-slate-800 border-slate-700">
                                        {financialInstitutions.map((institution) => (
                                            <SelectItem
                                                key={institution.financial_institution_code}
                                                value={institution.financial_institution_code}
                                                className="py-3 text-white hover:bg-slate-700"
                                            >
                                                {institution.financial_institution_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Security Info & Submit */}
                        <div className="pt-4 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-linear-to-br from-indigo-600/10 via-purple-600/10 to-blue-600/10 rounded-xl border border-slate-700/50">
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
                                        <Building2 className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Procesado por</p>
                                        <p className="text-sm font-semibold text-white">Tu banco</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center shadow-md">
                                        <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Confirmación</p>
                                        <p className="text-sm font-semibold text-white">Inmediata</p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 text-base font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all"
                                disabled={loading || disabled}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Procesando pago...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="h-5 w-5" />
                                        <span>Pagar ${amount.toLocaleString("es-CO")} COP</span>
                                    </div>
                                )}
                            </Button>

                            <p className="text-center text-xs text-slate-400">
                                Serás redirigido a tu banco para completar la transacción de forma segura
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}