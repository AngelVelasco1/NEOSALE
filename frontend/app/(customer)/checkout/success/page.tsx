"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Receipt,
  Package,
  CreditCard,
} from "lucide-react";
import {
  getWompiTransactionStatusApi,
  getPaymentFromDatabaseApi,
} from "../services/paymentsApi";
import TransactionStatusPolling from "./components/TransactionStatusPolling";

interface TransactionStatus {
  id?: string;
  status?: string;
  reference?: string;
  amount?: string;
  currency?: string;
}

interface PaymentInfo {
  id: number;
  transaction_id: string;
  payment_status: string;
  payment_method: string;
  amount_in_cents: number;
  currency: string;
  customer_email: string;
  created_at: string;
  approved_at?: string;
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const [transactionData, setTransactionData] = useState<TransactionStatus>({});
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handler para actualizar el estado cuando el polling detecta cambios
  const handlePollingStatusUpdate = async (
    newStatus: string,
    pollingTransactionData?: {
      id: string;
      status: string;
      amount_in_cents: number;
      currency: string;
      reference?: string;
      [key: string]: unknown;
    }
  ) => {
    // Actualizar la base de datos con el nuevo estado
    if (pollingTransactionData?.id) {
      try {
        await fetch(`/api/payments/update-status`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transactionId: pollingTransactionData.id,
            status: newStatus,
            wompiResponse: pollingTransactionData,
          }),
        });
      } catch (updateError) {
        
      }
    }

    setTransactionData((prev) => ({
      ...prev,
      status: newStatus,
      ...(pollingTransactionData && {
        amount: pollingTransactionData.amount_in_cents
          ? (pollingTransactionData.amount_in_cents / 100).toString()
          : prev.amount,
        currency: pollingTransactionData.currency || prev.currency,
        reference: pollingTransactionData.reference || prev.reference,
      }),
    }));

    // Si el estado cambió a APPROVED, re-consultar payment info para obtener datos actualizados
    if (newStatus.toUpperCase() === "APPROVED" && pollingTransactionData?.id) {
      fetchPaymentInfo(pollingTransactionData.id);
    }
  };

  const fetchPaymentInfo = async (transactionId: string) => {
    try {
      const dbResult = await getPaymentFromDatabaseApi(transactionId);
      if (dbResult.success && dbResult.data) {
        const paymentData = Array.isArray(dbResult.data)
          ? dbResult.data[0]
          : dbResult.data;

        if (paymentData) {
          setPaymentInfo(paymentData as PaymentInfo);
          
        }
      }
    } catch (dbError) {
      
    }
  };

  useEffect(() => {
    const initializePageData = async () => {
      try {
        setLoading(true);

        const id = searchParams.get("id");
        const status = searchParams.get("status");
        const reference = searchParams.get("reference");
        const amount = searchParams.get("amount");
        const currency = searchParams.get("currency");

        const initialTransactionData = {
          id: id || undefined,
          status: status || undefined,
          reference: reference || undefined,
          amount: amount || undefined,
          currency: currency || undefined,
        };

        setTransactionData(initialTransactionData);

        if (id) {
          await fetchTransactionDetails(id);
        }
      } catch (error) {
        
        setError("Error cargando información de la transacción");
      } finally {
        setLoading(false);
      }
    };

    initializePageData();
  }, [searchParams]);

  const fetchTransactionDetails = async (transactionId: string) => {
    try {

      try {
        const wompiResult = await getWompiTransactionStatusApi(transactionId);
        if (wompiResult.success && wompiResult.data) {
          // Actualizar datos de transacción con información de Wompi
          const wompiData = wompiResult.data;
          setTransactionData((prev) => ({
            ...prev,
            status: wompiData.status,
            amount: wompiData.amount_in_cents
              ? (wompiData.amount_in_cents / 100).toString()
              : prev.amount,
            currency: wompiData.currency || prev.currency,
            reference: wompiData.reference || prev.reference,
          }));

          
        }
      } catch (wompiError) {
        
        // Continuar con consulta de BD local
      }

      // 2. Consultar payment y orden desde nuestra base de datos
      try {
        const dbResult = await getPaymentFromDatabaseApi(transactionId);
        if (dbResult.success && dbResult.data) {
          const paymentData = Array.isArray(dbResult.data)
            ? dbResult.data[0]
            : dbResult.data;

          if (paymentData) {
            setPaymentInfo(paymentData as PaymentInfo);
            // Si el payment tiene orden asociada, obtener información de la orden
            // Nota: En el nuevo sistema, las órdenes se crean automáticamente por webhook
            // Aquí podrías hacer una consulta adicional para obtener la orden si la necesitas
          }
        }
      } catch (dbError) {
        
      }
    } catch (error) {
      
      setError("Error consultando detalles de la transacción");
    }
  };

  const getStatusInfo = (status?: string) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
      case "SUCCESS":
        return {
          icon: <CheckCircle className="w-16 h-16 text-green-500" />,
          title: "¡Pago aprobado!",
          message:
            "Tu pago ha sido procesado exitosamente y tu orden será creada automáticamente.",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-800",
        };
      case "PENDING":
        return {
          icon: <Clock className="w-16 h-16 text-yellow-500" />,
          title: "Pago pendiente",
          message:
            "Tu pago está siendo procesado. Te notificaremos cuando se complete y se genere tu orden.",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          textColor: "text-yellow-800",
        };
      case "DECLINED":
      case "ERROR":
      case "FAILED":
        return {
          icon: <XCircle className="w-16 h-16 text-red-500" />,
          title: "Pago rechazado",
          message:
            "Tu pago no pudo ser procesado. Por favor, intenta de nuevo.",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-800",
        };
      default:
        return {
          icon: <Clock className="w-16 h-16 text-gray-500" />,
          title: "Estado del pago",
          message: "Estamos verificando el estado de tu pago.",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          textColor: "text-gray-800",
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Consultando información del pago y orden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-red-50 border-red-200 border-2">
            <CardHeader className="text-center">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-2xl font-bold text-red-800">
                Error
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-red-700 mb-6">{error}</p>
              <Button asChild>
                <Link href="/">Volver al inicio</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(transactionData.status);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Componente de polling para actualización automática del estado */}
        {transactionData.id && (
          <TransactionStatusPolling
            transactionId={transactionData.id}
            currentStatus={transactionData.status}
            onStatusUpdate={handlePollingStatusUpdate}
            enabled={true}
            pollingInterval={10000} // 10 segundos
            maxPollingAttempts={18} // 3 minutos máximo
          />
        )}

        {/* Estado principal del pago */}
        <Card
          className={`${statusInfo.bgColor} ${statusInfo.borderColor} border-2`}
        >
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">{statusInfo.icon}</div>
            <CardTitle className={`text-2xl font-bold ${statusInfo.textColor}`}>
              {statusInfo.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <p className={`text-lg ${statusInfo.textColor}`}>
                {statusInfo.message}
              </p>
            </div>

            {/* Detalles de la transacción */}
            {transactionData.id && (
              <div className="bg-white rounded-lg p-4 space-y-3 border">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Detalles de la transacción
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {transactionData.id && (
                    <div>
                      <span className="text-gray-600">ID de transacción:</span>
                      <p className="font-mono text-gray-900 break-all">
                        {transactionData.id}
                      </p>
                    </div>
                  )}

                  {transactionData.reference && (
                    <div>
                      <span className="text-gray-600">Referencia:</span>
                      <p className="font-mono text-gray-900">
                        {transactionData.reference}
                      </p>
                    </div>
                  )}

                  {transactionData.status && (
                    <div>
                      <span className="text-gray-600">Estado:</span>
                      <p className="font-semibold text-gray-900 uppercase">
                        {transactionData.status}
                      </p>
                    </div>
                  )}

                  {transactionData.amount && (
                    <div>
                      <span className="text-gray-600">Monto:</span>
                      <p className="font-semibold text-gray-900">
                        $
                        {Number(transactionData.amount).toLocaleString("es-CO")}{" "}
                        {transactionData.currency || "COP"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Información del payment desde BD */}
            {paymentInfo && (
              <div className="bg-white rounded-lg p-4 space-y-3 border">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Información del payment
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Payment ID:</span>
                    <p className="font-mono text-gray-900">#{paymentInfo.id}</p>
                  </div>

                  <div>
                    <span className="text-gray-600">Método de pago:</span>
                    <p className="font-semibold text-gray-900 uppercase">
                      {paymentInfo.payment_method}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-600">Email del cliente:</span>
                    <p className="text-gray-900">
                      {paymentInfo.customer_email}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-600">Fecha de creación:</span>
                    <p className="text-gray-900">
                      {new Date(paymentInfo.created_at).toLocaleString("es-CO")}
                    </p>
                  </div>

                  {paymentInfo.approved_at && (
                    <div>
                      <span className="text-gray-600">
                        Fecha de aprobación:
                      </span>
                      <p className="text-gray-900">
                        {new Date(paymentInfo.approved_at).toLocaleString(
                          "es-CO"
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Información adicional según el estado */}
            {transactionData.status?.toUpperCase() === "APPROVED" && (
              <div className="bg-green-100 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  ¿Qué sigue ahora?
                </h4>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>
                    • Tu orden será creada automáticamente por nuestro sistema
                  </li>
                  <li>• Recibirás un email de confirmación en breve</li>
                  <li>• Tu pedido será procesado en las próximas 24 horas</li>
                  <li>• Te notificaremos cuando sea enviado</li>
                  <li>• Puedes verificar el estado de tu orden en tu perfil</li>
                </ul>
              </div>
            )}

            {transactionData.status?.toUpperCase() === "PENDING" && (
              <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  Información importante
                </h4>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• El pago puede tardar hasta 24 horas en confirmarse</li>
                  <li>
                    • Una vez confirmado, tu orden se creará automáticamente
                  </li>
                  <li>• Te notificaremos por email cuando se complete</li>
                  <li>• Puedes verificar el estado en tu perfil</li>
                </ul>
              </div>
            )}

            {(transactionData.status?.toUpperCase() === "DECLINED" ||
              transactionData.status?.toUpperCase() === "ERROR" ||
              transactionData.status?.toUpperCase() === "FAILED") && (
                <div className="bg-red-100 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">
                    ¿Qué puedes hacer?
                  </h4>
                  <ul className="text-red-700 text-sm space-y-1">
                    <li>• Verifica que tus datos de pago sean correctos</li>
                    <li>• Asegúrate de tener fondos suficientes</li>
                    <li>• Intenta con otro método de pago</li>
                    <li>• Contacta a tu banco si el problema persiste</li>
                  </ul>
                </div>
              )}

            {/* Botones de acción */}
            <div className="flex flex-col md:flex-row gap-4">
              <Button asChild className="flex-1">
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver al inicio
                </Link>
              </Button>

              {transactionData.status?.toUpperCase() === "APPROVED" && (
                <Button asChild variant="outline" className="flex-1">
                  <Link
                    href="/orders"
                    className="flex items-center justify-center gap-2"
                  >
                    <Package className="w-4 h-4" />
                    Ver mis pedidos
                  </Link>
                </Button>
              )}

              {(transactionData.status?.toUpperCase() === "DECLINED" ||
                transactionData.status?.toUpperCase() === "ERROR" ||
                transactionData.status?.toUpperCase() === "FAILED") && (
                  <Button asChild variant="outline" className="flex-1">
                    <Link
                      href="/checkout"
                      className="flex items-center justify-center gap-2"
                    >
                      Intentar de nuevo
                    </Link>
                  </Button>
                )}
            </div>

            {/* Nota sobre el sistema automático */}
            <div className="text-center text-sm text-gray-600 border-t pt-4">
              <p className="flex items-center justify-center gap-2">
                <Package className="w-4 h-4" />
                Las órdenes se crean automáticamente cuando el pago es aprobado
              </p>
              <p className="mt-2">
                ¿Necesitas ayuda? Contáctanos en{" "}
                <a
                  href="mailto:soporte@neosale.com"
                  className="text-primary hover:underline"
                >
                  soporte@neosale.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
