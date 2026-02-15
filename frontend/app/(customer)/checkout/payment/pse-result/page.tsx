"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type TransactionStatus = "APPROVED" | "DECLINED" | "PENDING" | "ERROR" | "UNKNOWN";

interface TransactionResult {
    id: string;
    status: TransactionStatus;
    status_message?: string;
    amount_in_cents?: number;
    currency?: string;
    payment_method?: {
        type: string;
        user_type: number;
        financial_institution_code: string;
    };
    created_at?: string;
}

export default function PSEResultPage() {
    const [loading, setLoading] = useState(true);
    const [transactionResult, setTransactionResult] = useState<TransactionResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pollingCount, setPollingCount] = useState(0);

    const searchParams = useSearchParams();
    const router = useRouter();

    const transactionId = searchParams.get("id") || searchParams.get("transaction_id");
    useEffect(() => {
   

        if (!transactionId) {
            setError("No se encontró ID de transacción en la URL");
            setLoading(false);
            return;
        }

        // Iniciar polling para verificar el estado de la transacción
        const checkTransactionStatus = async () => {
            try {
                const response = await fetch(`/api/payments/transaction/${transactionId}`);

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.message || "Error consultando estado de transacción");
                }

                const transaction = result.data;
                setTransactionResult(transaction);

                // Si la transacción está en estado final, detener polling
                if (["APPROVED", "DECLINED", "ERROR"].includes(transaction.status)) {
                    
                    setLoading(false);
                } else if (pollingCount >= 20) {
                    // Timeout después de ~2 minutos
                    
                    setError("Tiempo de espera agotado. Verifica el estado en tu banco.");
                    setLoading(false);
                } else {
                    // Continuar polling
                    setPollingCount(prev => prev + 1);
                    setTimeout(checkTransactionStatus, 6000); // Cada 6 segundos
                }

            } catch (error) {
                
                setError(error instanceof Error ? error.message : "Error desconocido");
                setLoading(false);
            }
        };

        checkTransactionStatus();
    }, [transactionId, pollingCount]);

    const getStatusIcon = (status: TransactionStatus) => {
        switch (status) {
            case "APPROVED":
                return <CheckCircle className="h-16 w-16 text-green-500" />;
            case "DECLINED":
            case "ERROR":
                return <XCircle className="h-16 w-16 text-red-500" />;
            case "PENDING":
                return <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />;
            default:
                return <AlertCircle className="h-16 w-16 text-yellow-500" />;
        }
    };

    const getStatusMessage = (status: TransactionStatus, statusMessage?: string) => {
        if (statusMessage) return statusMessage;

        switch (status) {
            case "APPROVED":
                return "¡Pago exitoso! Tu transacción ha sido aprobada.";
            case "DECLINED":
                return "Pago rechazado. Verifica los datos e intenta nuevamente.";
            case "PENDING":
                return "Transacción en proceso. Por favor espera...";
            case "ERROR":
                return "Error en la transacción. Contacta soporte si persiste.";
            default:
                return "Estado de transacción desconocido.";
        }
    };

    const getStatusColor = (status: TransactionStatus) => {
        switch (status) {
            case "APPROVED":
                return "border-green-200 bg-green-50";
            case "DECLINED":
            case "ERROR":
                return "border-red-200 bg-red-50";
            case "PENDING":
                return "border-blue-200 bg-blue-50";
            default:
                return "border-yellow-200 bg-yellow-50";
        }
    };

    const handleBackToShopping = () => {
        if (transactionResult?.status === "APPROVED") {
            // Redirigir a página de éxito/orden
            router.push("/orders");
        } else {
            // Volver al checkout
            router.push("/checkout");
        }
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center text-red-600">Error</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert variant="destructive">
                            <XCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>

                        <Button onClick={handleBackToShopping} className="w-full">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver al inicio
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <Card className={`w-full max-w-md ${transactionResult ? getStatusColor(transactionResult.status) : ""}`}>
                <CardHeader>
                    <CardTitle className="text-center">Resultado del Pago PSE</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* ICON & STATUS */}
                    <div className="flex flex-col items-center space-y-4">
                        {loading || !transactionResult ? (
                            <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
                        ) : (
                            getStatusIcon(transactionResult.status)
                        )}

                        <div className="text-center">
                            <h3 className="text-xl font-semibold mb-2">
                                {loading || !transactionResult ? "Verificando pago..." :
                                    transactionResult.status === "APPROVED" ? "¡Pago Exitoso!" :
                                        transactionResult.status === "DECLINED" ? "Pago Rechazado" :
                                            transactionResult.status === "PENDING" ? "Pago en Proceso" :
                                                "Estado Desconocido"}
                            </h3>

                            <p className="text-muted-foreground">
                                {loading || !transactionResult ?
                                    `Consultando estado... (${pollingCount + 1}/20)` :
                                    getStatusMessage(transactionResult.status, transactionResult.status_message)
                                }
                            </p>
                        </div>
                    </div>

                    {/* TRANSACTION DETAILS */}
                    {transactionResult && (
                        <div className="space-y-2 text-sm border-t pt-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">ID Transacción:</span>
                                <span className="font-mono text-xs">{transactionResult.id}</span>
                            </div>

                            {transactionResult.amount_in_cents && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Monto:</span>
                                    <span className="font-semibold">
                                        ${(transactionResult.amount_in_cents / 100).toLocaleString()} {transactionResult.currency || "COP"}
                                    </span>
                                </div>
                            )}

                            {transactionResult.payment_method?.financial_institution_code && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Banco:</span>
                                    <span>{transactionResult.payment_method.financial_institution_code}</span>
                                </div>
                            )}

                            {transactionResult.created_at && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Fecha:</span>
                                    <span>{new Date(transactionResult.created_at).toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ACTIONS */}
                    {!loading && (
                        <div className="space-y-2">
                            <Button onClick={handleBackToShopping} className="w-full">
                                {transactionResult?.status === "APPROVED" ? (
                                    <>Ver mis pedidos</>
                                ) : (
                                    <>
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Volver al checkout
                                    </>
                                )}
                            </Button>

                            {transactionResult?.status === "PENDING" && (
                                <p className="text-xs text-center text-muted-foreground">
                                    Tu pago puede tardar unos minutos en procesarse
                                </p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
