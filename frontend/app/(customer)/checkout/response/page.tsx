"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  CreditCard,
  Mail,
  MapPin,
  Calendar,
  Receipt,
} from "lucide-react";

interface TransactionData {
  id: string;
  status: "APPROVED" | "DECLINED" | "PENDING" | "ERROR" | "VOIDED";
  amount_in_cents: number;
  reference: string;
  customer_email: string;
  currency: string;
  payment_method?: {
    type: string;
    installments?: number;
    last_four?: string;
    brand?: string;
  };
  status_message?: string;
  created_at: string;
  finalized_at?: string;
  shipping_address?: {
    address_line_1: string;
    address_line_2?: string;
    city: string;
    region: string;
    country: string;
    postal_code: string;
    name?: string;
  };
}

export default function PaymentResponsePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [transactionData, setTransactionData] =
    useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transactionId = searchParams.get("id");

  const fetchTransactionStatus = async () => {
    if (!transactionId) {
      setError("ID de transacción no encontrado en la URL");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/payments/transaction/${transactionId}`
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Error consultando transacción");
      }

      setTransactionData(result.data);
    } catch (err) {
      console.error("Error consultando estado de transacción:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionStatus();
  }, [transactionId]);

  const getStatusConfig = (status: TransactionData["status"]) => {
    switch (status) {
      case "APPROVED":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          badgeVariant: "default" as const,
          title: "¡Pago Exitoso!",
          description: "Tu pago ha sido procesado correctamente.",
        };
      case "DECLINED":
        return {
          icon: XCircle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          badgeVariant: "destructive" as const,
          title: "Pago Rechazado",
          description: "Tu pago no pudo ser procesado.",
        };
      case "PENDING":
        return {
          icon: Clock,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          badgeVariant: "secondary" as const,
          title: "Pago Pendiente",
          description: "Tu pago está siendo procesado.",
        };
      case "ERROR":
        return {
          icon: AlertTriangle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          badgeVariant: "destructive" as const,
          title: "Error en el Pago",
          description: "Ocurrió un error procesando tu pago.",
        };
      case "VOIDED":
        return {
          icon: XCircle,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          badgeVariant: "secondary" as const,
          title: "Pago Anulado",
          description: "El pago ha sido anulado.",
        };
      default:
        return {
          icon: AlertTriangle,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          badgeVariant: "secondary" as const,
          title: "Estado Desconocido",
          description: "No se pudo determinar el estado del pago.",
        };
    }
  };

  const formatAmount = (amountInCents: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(amountInCents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRetry = () => {
    router.push("/checkout");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const handleViewOrders = () => {
    router.push("/orders");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="flex gap-3">
              <Button onClick={fetchTransactionStatus} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
              <Button onClick={handleGoHome}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Ir al Inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!transactionData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="text-center py-8">
            <p>No se encontraron datos de la transacción.</p>
            <Button onClick={handleGoHome} className="mt-4">
              Ir al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig = getStatusConfig(transactionData.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className={`${statusConfig.bgColor} ${statusConfig.borderColor}`}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`rounded-full p-3 ${statusConfig.bgColor}`}>
              <StatusIcon className={`w-12 h-12 ${statusConfig.color}`} />
            </div>
          </div>
          <CardTitle className={`text-2xl ${statusConfig.color}`}>
            {statusConfig.title}
          </CardTitle>
          <p className="text-gray-600">{statusConfig.description}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Estado y Mensaje */}
          <div className="flex items-center justify-between">
            <span className="font-medium">Estado:</span>
            <Badge variant={statusConfig.badgeVariant}>
              {transactionData.status}
            </Badge>
          </div>

          {transactionData.status_message && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                {transactionData.status_message}
              </p>
            </div>
          )}

          {/* Información de la Transacción */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              Detalles de la Transacción
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">ID de Transacción:</span>
                <span className="font-mono text-xs">{transactionData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Referencia:</span>
                <span className="font-mono">{transactionData.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monto:</span>
                <span className="font-semibold text-lg">
                  {formatAmount(transactionData.amount_in_cents)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Moneda:</span>
                <span>{transactionData.currency}</span>
              </div>
            </div>
          </div>

          {/* Método de Pago */}
          {transactionData.payment_method && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Método de Pago
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo:</span>
                  <span>{transactionData.payment_method.type}</span>
                </div>
                {transactionData.payment_method.brand && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Marca:</span>
                    <span>{transactionData.payment_method.brand}</span>
                  </div>
                )}
                {transactionData.payment_method.last_four && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Terminada en:</span>
                    <span>****{transactionData.payment_method.last_four}</span>
                  </div>
                )}
                {transactionData.payment_method.installments && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cuotas:</span>
                    <span>{transactionData.payment_method.installments}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Información del Cliente */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Información del Cliente
            </h3>
            <div className="text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span>{transactionData.customer_email}</span>
              </div>
            </div>
          </div>

          {/* Dirección de Envío */}
          {transactionData.shipping_address && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Dirección de Envío
              </h3>
              <div className="text-sm space-y-1">
                <p>{transactionData.shipping_address.address_line_1}</p>
                {transactionData.shipping_address.address_line_2 && (
                  <p>{transactionData.shipping_address.address_line_2}</p>
                )}
                <p>
                  {transactionData.shipping_address.city},{" "}
                  {transactionData.shipping_address.region}
                </p>
                <p>
                  {transactionData.shipping_address.country} -{" "}
                  {transactionData.shipping_address.postal_code}
                </p>
              </div>
            </div>
          )}

          {/* Fechas */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Fechas
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Creado:</span>
                <span>{formatDate(transactionData.created_at)}</span>
              </div>
              {transactionData.finalized_at && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Finalizado:</span>
                  <span>{formatDate(transactionData.finalized_at)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Acciones */}
          <div className="border-t pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              {transactionData.status === "APPROVED" ? (
                <>
                  <Button onClick={handleViewOrders} className="flex-1">
                    Ver Mis Pedidos
                  </Button>
                  <Button
                    onClick={handleGoHome}
                    variant="outline"
                    className="flex-1"
                  >
                    Continuar Comprando
                  </Button>
                </>
              ) : transactionData.status === "DECLINED" ||
                transactionData.status === "ERROR" ? (
                <>
                  <Button onClick={handleRetry} className="flex-1">
                    Intentar Nuevamente
                  </Button>
                  <Button
                    onClick={handleGoHome}
                    variant="outline"
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Ir al Inicio
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={fetchTransactionStatus}
                    variant="outline"
                    className="flex-1"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Actualizar Estado
                  </Button>
                  <Button
                    onClick={handleGoHome}
                    variant="outline"
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Ir al Inicio
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
