"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { getTrackingInfo } from "../services/shippingApi";

interface UseTrackingNotificationsProps {
  orderId: number;
  enabled?: boolean;
  interval?: number;
}

/**
 * Hook para recibir notificaciones cuando el webhook actualiza el tracking
 * Hace polling periódico y muestra toast cuando detecta cambios
 */
export function useTrackingNotifications({
  orderId,
  enabled = true,
  interval = 30000, // 30 segundos
}: UseTrackingNotificationsProps) {
  const lastStatusRef = useRef<string | null>(null);
  const lastEventCountRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled || !orderId) return;

    const checkUpdates = async () => {
      try {
        const result = await getTrackingInfo(orderId);

        if (!result.success || !result.data) return;

        const currentStatus = result.data.envioclick_status;
        const currentEventCount = result.data.tracking_history?.length || 0;

        // Primera carga - solo guardar referencias
        if (lastStatusRef.current === null) {
          lastStatusRef.current = currentStatus;
          lastEventCountRef.current = currentEventCount;
          return;
        }

        // Detectar cambio de estado
        if (currentStatus && currentStatus !== lastStatusRef.current) {
          const statusLabels: Record<string, string> = {
            CREATED: "Guía Creada",
            PICKED_UP: "Paquete Recogido",
            IN_TRANSIT: "En Tránsito",
            OUT_FOR_DELIVERY: "En Ruta de Entrega",
            DELIVERED: "Entregado",
            CANCELLED: "Cancelado",
            RETURNED: "Devuelto",
          };

          toast.success("📦 Actualización de Envío", {
            description: `Tu pedido ahora está: ${
              statusLabels[currentStatus] || currentStatus
            }`,
            duration: 5000,
          });

          lastStatusRef.current = currentStatus;
        }

        // Detectar nuevos eventos
        if (currentEventCount > lastEventCountRef.current) {
          const newEventsCount = currentEventCount - lastEventCountRef.current;
          
          toast.info("🔔 Nueva Actualización", {
            description: `${newEventsCount} nueva${
              newEventsCount > 1 ? "s" : ""
            } actualización${newEventsCount > 1 ? "es" : ""} de tracking`,
            duration: 4000,
          });

          lastEventCountRef.current = currentEventCount;
        }
      } catch (error) {
        console.error("Error checking tracking updates:", error);
      }
    };

    // Primera verificación inmediata
    checkUpdates();

    // Polling periódico
    const intervalId = setInterval(checkUpdates, interval);

    return () => clearInterval(intervalId);
  }, [orderId, enabled, interval]);
}
