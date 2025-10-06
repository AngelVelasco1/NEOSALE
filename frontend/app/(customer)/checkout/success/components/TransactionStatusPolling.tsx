"use client";

import React, { useEffect, useRef } from "react";
import { RefreshCw } from "lucide-react";
import { getWompiTransactionStatusApi } from "../../services/paymentsApi";

interface WompiTransactionData {
  id: string;
  status: string;
  amount_in_cents: number;
  currency: string;
  reference?: string;
  [key: string]: unknown;
}

interface TransactionStatusPollingProps {
  transactionId: string;
  currentStatus?: string;
  onStatusUpdate: (
    newStatus: string,
    transactionData?: WompiTransactionData
  ) => void;
  pollingInterval?: number; // en milisegundos
  maxPollingAttempts?: number;
  enabled?: boolean;
}

export default function TransactionStatusPolling({
  transactionId,
  currentStatus,
  onStatusUpdate,
  pollingInterval = 10000, // 10 segundos por defecto
  maxPollingAttempts = 30, // 5 minutos máximo (30 * 10s)
  enabled = true,
}: TransactionStatusPollingProps) {
  const pollingCountRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || !transactionId) {
      return;
    }

    // Solo hacer polling si el estado es pendiente o no está definido
    const shouldPoll =
      !currentStatus ||
      ["PENDING", "CREATED", "PROCESSING"].includes(
        currentStatus.toUpperCase()
      );

    if (!shouldPoll) {
      console.log("🛑 Polling detenido - estado final:", currentStatus);
      return;
    }

    console.log("🔄 Iniciando polling para transacción:", transactionId);

    const startPolling = () => {
      intervalRef.current = setInterval(async () => {
        try {
          pollingCountRef.current += 1;
          console.log(
            `🔍 Polling attempt ${pollingCountRef.current}/${maxPollingAttempts}`
          );

          // Verificar si hemos excedido el máximo de intentos
          if (pollingCountRef.current > maxPollingAttempts) {
            console.log("⏰ Máximo de intentos de polling alcanzado");
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return;
          }

          // Consultar estado actualizado de Wompi
          const result = await getWompiTransactionStatusApi(transactionId);

          if (result.success && result.data) {
            const newStatus = result.data.status;
            console.log("📊 Estado obtenido del polling:", newStatus);

            // Si el estado cambió, notificar y detener polling para estados finales
            if (newStatus !== currentStatus) {
              console.log("🔄 Estado cambió de", currentStatus, "a", newStatus);
              onStatusUpdate(newStatus, result.data);

              // Detener polling si llegamos a un estado final
              const finalStates = [
                "APPROVED",
                "DECLINED",
                "ERROR",
                "FAILED",
                "VOIDED",
              ];
              if (finalStates.includes(newStatus.toUpperCase())) {
                console.log(
                  "✅ Estado final alcanzado, deteniendo polling:",
                  newStatus
                );
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                }
              }
            }
          } else {
            console.warn("⚠️ Error en polling o respuesta vacía:", result);
          }
        } catch (error) {
          console.error("❌ Error durante polling:", error);
          // Continuar con el polling a pesar del error
        }
      }, pollingInterval);
    };

    startPolling();

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      pollingCountRef.current = 0;
    };
  }, [
    transactionId,
    currentStatus,
    onStatusUpdate,
    pollingInterval,
    maxPollingAttempts,
    enabled,
  ]);

  // Función para detener manualmente el polling
  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    pollingCountRef.current = 0;
  };

  // Solo mostrar indicador si está haciendo polling activamente
  const isPolling = intervalRef.current !== null;
  const shouldShowPolling =
    enabled &&
    isPolling &&
    (!currentStatus ||
      ["PENDING", "CREATED", "PROCESSING"].includes(
        currentStatus.toUpperCase()
      ));

  if (!shouldShowPolling) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
      <div className="flex items-center gap-2 text-blue-700">
        <RefreshCw className="w-4 h-4 animate-spin" />
        <div className="text-sm">
          <p className="font-medium">Verificando estado del pago...</p>
          <p className="text-xs text-blue-600">
            Intento {pollingCountRef.current} de {maxPollingAttempts}
          </p>
        </div>
      </div>

      <button
        onClick={stopPolling}
        className="text-blue-600 hover:text-blue-800 text-sm underline"
      >
        Detener
      </button>
    </div>
  );
}

// Hook personalizado para usar el polling de manera más fácil
export function useTransactionStatusPolling(
  transactionId: string,
  initialStatus?: string,
  options?: {
    pollingInterval?: number;
    maxPollingAttempts?: number;
    enabled?: boolean;
  }
) {
  const [currentStatus, setCurrentStatus] = React.useState(initialStatus);
  const [transactionData, setTransactionData] =
    React.useState<WompiTransactionData | null>(null);
  const [isPolling, setIsPolling] = React.useState(false);

  const handleStatusUpdate = React.useCallback(
    (newStatus: string, data?: WompiTransactionData) => {
      setCurrentStatus(newStatus);
      setTransactionData(data || null);

      // Detener polling automáticamente para estados finales
      const finalStates = ["APPROVED", "DECLINED", "ERROR", "FAILED", "VOIDED"];
      if (finalStates.includes(newStatus.toUpperCase())) {
        setIsPolling(false);
      }
    },
    []
  );

  React.useEffect(() => {
    const shouldPoll =
      !initialStatus ||
      ["PENDING", "CREATED", "PROCESSING"].includes(
        initialStatus.toUpperCase()
      );
    setIsPolling(shouldPoll && (options?.enabled ?? true));
  }, [initialStatus, options?.enabled]);

  return {
    currentStatus,
    transactionData,
    isPolling,
    handleStatusUpdate,
    setIsPolling,
  };
}
