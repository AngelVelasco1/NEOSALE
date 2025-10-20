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
            <div className="min-h-[500px] flex items-center justify-center">
                <div className="text-center space-y-5">
                    <div className="relative w-20 h-20 mx-auto">
                        <div className="absolute inset-0 border-4 border-purple-100 dark:border-purple-900 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-purple-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-2 border-4 border-blue-100 dark:border-blue-900 rounded-full"></div>
                        <div className="absolute inset-2 border-4 border-t-blue-600 rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }}></div>
                    </div>
                    <p className="text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Cargando bancos disponibles...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto p-1">




            <Card className="border-purple-200/50 dark:border-purple-800/50 shadow-xl shadow-purple-500/10">
                <CardContent className="p-7 space-y-7">
                    {error && (
                        <Alert variant="destructive" className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 rounded-xl">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-sm">{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-7">
                        {/* User Type Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-purple-100 dark:border-purple-900">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
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
                                        ? "border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 shadow-lg shadow-purple-500/20"
                                        : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md"
                                        }`}
                                >
                                    <RadioGroupItem value="0" id="natural" className="sr-only" />
                                    <div className="text-center space-y-2">
                                        <User className={`w-6 h-6 mx-auto ${formData.user_type === 0 ? "text-purple-600 dark:text-purple-400" : "text-slate-400"}`} />
                                        <span className={`text-sm font-semibold ${formData.user_type === 0 ? "text-purple-900 dark:text-purple-100" : "text-slate-700 dark:text-slate-300"}`}>
                                            Persona Natural
                                        </span>
                                    </div>
                                    {formData.user_type === 0 && (
                                        <div className="absolute top-3 right-3">
                                            <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                    )}
                                </label>

                                <label
                                    htmlFor="juridica"
                                    className={`relative flex items-center justify-center p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${formData.user_type === 1
                                        ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 shadow-lg shadow-blue-500/20"
                                        : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md"
                                        }`}
                                >
                                    <RadioGroupItem value="1" id="juridica" className="sr-only" />
                                    <div className="text-center space-y-2">
                                        <Building2 className={`w-6 h-6 mx-auto ${formData.user_type === 1 ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`} />
                                        <span className={`text-sm font-semibold ${formData.user_type === 1 ? "text-blue-900 dark:text-blue-100" : "text-slate-700 dark:text-slate-300"}`}>
                                            Persona Jurídica
                                        </span>
                                    </div>
                                    {formData.user_type === 1 && (
                                        <div className="absolute top-3 right-3">
                                            <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    )}
                                </label>
                            </RadioGroup>
                        </div>

                        {/* Identification Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-purple-100 dark:border-purple-900">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                                    <FileText className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                    Información de Identificación
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="docType" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Tipo de Documento
                                    </Label>
                                    <Select
                                        value={formData.user_legal_id_type}
                                        onValueChange={(value) => handleFormChange("user_legal_id_type", value)}
                                    >
                                        <SelectTrigger className="h-11 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl focus:border-purple-500 dark:focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20">
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
                                    <Label htmlFor="docNumber" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
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
                                        className="h-11 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl focus:border-purple-500 dark:focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-purple-100 dark:border-purple-900">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                                    <Mail className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                    Información de Contacto
                                </h3>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
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
                                        className="h-11 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
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
                                        className="h-11 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
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
                                        className="h-11 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                                    />
                                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                        <Phone className="w-3 h-3" />
                                        Formato: 3001234567 (sin espacios ni símbolos)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bank Selection Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-purple-100 dark:border-purple-900">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-md">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                    Selecciona tu Banco
                                </h3>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bank" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Institución Financiera
                                </Label>
                                <Select
                                    value={formData.financial_institution_code}
                                    onValueChange={(value) => handleFormChange("financial_institution_code", value)}
                                >
                                    <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl focus:border-purple-500 dark:focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20">
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

                        {/* Security Info & Submit */}
                        <div className="pt-4 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-blue-950/30 rounded-xl border border-purple-200/50 dark:border-purple-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-md">
                                        <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">Pago seguro</p>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Encriptación SSL</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-md">
                                        <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">Procesado por</p>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tu banco</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-md">
                                        <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">Confirmación</p>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Inmediata</p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 text-base font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all"
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

                            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                                Serás redirigido a tu banco para completar la transacción de forma segura
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>




        </div>
    );
}