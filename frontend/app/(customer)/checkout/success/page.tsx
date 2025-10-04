"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, ArrowLeft, Receipt } from "lucide-react";

interface TransactionStatus {
  id?: string;
  status?: string;
  reference?: string;
  amount?: string;
  currency?: string;
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const [transactionData, setTransactionData] = useState<TransactionStatus>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Extraer parámetros de la URL devueltos por Wompi
    const id = searchParams.get("id");
    const status = searchParams.get("status");
    const reference = searchParams.get("reference");
    const amount = searchParams.get("amount");
    const currency = searchParams.get("currency");

    setTransactionData({
      id: id || undefined,
      status: status || undefined,
      reference: reference || undefined,
      amount: amount || undefined,
      currency: currency || undefined,
    });

    setLoading(false);

    // Log para debugging
    console.log("📄 Datos de transacción recibidos:", {
      id,
      status,
      reference,
      amount,
      currency,
    });
  }, [searchParams]);

  const getStatusInfo = (status?: string) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
      case "SUCCESS":
        return {
          icon: <CheckCircle className="w-16 h-16 text-green-500" />,
          title: "¡Pago aprobado!",
          message: "Tu pago ha sido procesado exitosamente.",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-800",
        };
      case "PENDING":
        return {
          icon: <Clock className="w-16 h-16 text-yellow-500" />,
          title: "Pago pendiente",
          message:
            "Tu pago está siendo procesado. Te notificaremos cuando se complete.",
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
          <p>Procesando información del pago...</p>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(transactionData.status);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
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
                  <Receipt className="w-5 h-5" />
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

            {/* Información adicional según el estado */}
            {transactionData.status?.toUpperCase() === "APPROVED" && (
              <div className="bg-green-100 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">
                  ¿Qué sigue ahora?
                </h4>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Recibirás un email de confirmación en breve</li>
                  <li>• Tu pedido será procesado en las próximas 24 horas</li>
                  <li>• Te notificaremos cuando sea enviado</li>
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
                    <Receipt className="w-4 h-4" />
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

            {/* Nota sobre soporte */}
            <div className="text-center text-sm text-gray-600">
              <p>
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
