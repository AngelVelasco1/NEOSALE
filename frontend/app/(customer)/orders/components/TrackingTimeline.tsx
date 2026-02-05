"use client";

import { useEffect, useState } from "react";
import { Package, MapPin, Clock, CheckCircle, Truck, XCircle, FileText, ExternalLink, Printer, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  getTrackingInfo,
  startTrackingPolling,
  type TrackingEvent,
} from "../services/shippingApi";
import { Skeleton } from "@/components/ui/skeleton";

interface TrackingTimelineProps {
  orderId: number;
  autoUpdate?: boolean;
  updateInterval?: number;
  orderData?: any;
}

const statusIcons: Record<string, any> = {
  CREATED: Package,
  PICKED_UP: Truck,
  IN_TRANSIT: Truck,
  OUT_FOR_DELIVERY: MapPin,
  DELIVERED: CheckCircle,
  CANCELLED: XCircle,
  RETURNED: XCircle,
};

const statusColors: Record<string, string> = {
  CREATED: "bg-blue-500",
  PICKED_UP: "bg-purple-500",
  IN_TRANSIT: "bg-yellow-500",
  OUT_FOR_DELIVERY: "bg-orange-500",
  DELIVERED: "bg-green-500",
  CANCELLED: "bg-red-500",
  RETURNED: "bg-gray-500",
};

const statusLabels: Record<string, string> = {
  CREATED: "Guía Creada",
  PICKED_UP: "Recogido",
  IN_TRANSIT: "En Tránsito",
  OUT_FOR_DELIVERY: "En Ruta de Entrega",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
  RETURNED: "Devuelto",
};

export function TrackingTimeline({
  orderId,
  autoUpdate = false,
  updateInterval = 60000,
  orderData,
}: TrackingTimelineProps) {
  const [loading, setLoading] = useState(true);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSandboxGuide, setShowSandboxGuide] = useState(false);

  useEffect(() => {
    loadTracking();

    if (autoUpdate) {
      const intervalId = startTrackingPolling(
        orderId,
        (data) => {
          if (data.success && data.data) {
            setTrackingData(data.data);
          }
        },
        updateInterval
      );

      return () => clearInterval(intervalId);
    }
  }, [orderId, autoUpdate, updateInterval]);

  const loadTracking = async () => {
    setLoading(true);
    setError(null);
    const result = await getTrackingInfo(orderId);
    
    if (result.success && result.data) {
      setTrackingData(result.data);
    } else {
      setError(result.message || "No se pudo cargar el tracking");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !trackingData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tracking del Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">
              {error || "No hay información de envío disponible"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const {
    envioclick_guide_number,
    envioclick_tracking_url,
    envioclick_label_url,
    envioclick_status,
    tracking_history = [],
    carrier,
    last_tracking_update,
  } = trackingData;

  const events: TrackingEvent[] = Array.isArray(tracking_history)
    ? tracking_history
    : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="w-5 h-5" />
            Seguimiento del Envío
          </CardTitle>
          {envioclick_status && (
            <Badge className={statusColors[envioclick_status]}>
              {statusLabels[envioclick_status] || envioclick_status}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Información de Guía */}
        <div className="p-4 bg-gray-50 rounded-lg space-y-3">
          {envioclick_guide_number ? (
            <>
              <div>
                <p className="text-sm text-gray-600">Número de Guía</p>
                <p className="font-mono font-semibold">{envioclick_guide_number}</p>
                {carrier && (
                  <p className="text-xs text-gray-500 mt-1">
                    Transportadora: {carrier}
                  </p>
                )}
              </div>
              
              <Button
                variant="default"
                size="sm"
                className="w-full"
                onClick={() => {
                  if (envioclick_label_url?.includes('sandbox')) {
                    setShowSandboxGuide(true);
                  } else if (envioclick_label_url) {
                    window.open(envioclick_label_url, "_blank");
                  }
                }}
              >
                <FileText className="w-4 h-4 mr-2" />
                Ver Guía de Envío
              </Button>
            </>
          ) : (
            <div className="text-center py-4">
              <Package className="w-10 h-10 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-3">
                Aún no se ha generado la guía de envío
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log("Abriendo modal de guía");
                  setShowSandboxGuide(true);
                }}
              >
                <FileText className="w-4 h-4 mr-2" />
                Vista Previa de Guía
              </Button>
            </div>
          )}
        </div>

        {/* Timeline de Eventos */}
        {events.length > 0 ? (
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-6">
              {events.map((event, index) => {
                const Icon = statusIcons[event.status] || Package;
                const color = statusColors[event.status] || "bg-gray-500";
                
                return (
                  <div key={index} className="relative flex gap-4">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full ${color} flex items-center justify-center z-10`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">
                            {statusLabels[event.status] || event.status}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {event.description}
                          </p>
                          {event.location && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {new Date(event.date).toLocaleString("es-CO", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Package className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>No hay eventos de tracking registrados</p>
          </div>
        )}

        {/* Última Actualización */}
        {last_tracking_update && (
          <div className="text-xs text-gray-500 text-center pt-4 border-t">
            Última actualización:{" "}
            {new Date(last_tracking_update).toLocaleString("es-CO")}
          </div>
        )}
      </CardContent>

      {/* Modal para mostrar guía sandbox */}
      <Dialog open={showSandboxGuide} onOpenChange={setShowSandboxGuide}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Guía de Envío
            </DialogTitle>
            <DialogDescription>
              Información de tu guía de envío
            </DialogDescription>
          </DialogHeader>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 space-y-4 bg-gray-50">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-xl">NEOSALE</h3>
                <p className="text-sm text-gray-600">Guía de Envío</p>
              </div>
              <div className="text-right">
                {envioclick_label_url?.includes('sandbox') && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    MODO PRUEBA
                  </Badge>
                )}
                <p className="text-xs text-gray-500 mt-1">Orden #{orderId}</p>
              </div>
            </div>

            {/* Barcode simulado */}
            <div className="bg-white p-4 rounded border border-gray-300 text-center">
              <div className="font-mono text-2xl font-bold tracking-wider">
                {envioclick_guide_number || 'SANDBOX123456789'}
              </div>
              <div className="mt-2 flex justify-center gap-0.5">
                {Array.from({length: 40}).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-black"
                    style={{height: Math.random() > 0.5 ? '40px' : '30px'}}
                  />
                ))}
              </div>
            </div>

            {/* Información del envío */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="bg-white p-3 rounded border border-gray-300">
                  <p className="text-xs text-gray-500 font-semibold mb-1">REMITENTE</p>
                  <p className="font-semibold">NEOSALE</p>
                  <p className="text-sm">Calle 123 #45-67</p>
                  <p className="text-sm">Bogotá, Colombia</p>
                  <p className="text-sm">Tel: 300-123-4567</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="bg-white p-3 rounded border border-gray-300">
                  <p className="text-xs text-gray-500 font-semibold mb-1">DESTINATARIO</p>
                  <p className="font-semibold">{orderData?.shipping_address?.name || 'Nombre no disponible'}</p>
                  <p className="text-sm">{orderData?.shipping_address?.address1}</p>
                  {orderData?.shipping_address?.address2 && (
                    <p className="text-sm">{orderData?.shipping_address?.address2}</p>
                  )}
                  <p className="text-sm">{orderData?.shipping_address?.city}, {orderData?.shipping_address?.state}</p>
                  <p className="text-sm">Tel: {orderData?.shipping_address?.phone}</p>
                </div>
              </div>
            </div>

            {/* Información de transportadora */}
            <div className="bg-white p-3 rounded border border-gray-300">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 font-semibold">TRANSPORTADORA</p>
                  <p className="font-bold text-lg">{carrier || 'ENVIA'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-semibold">PESO</p>
                  <p className="font-semibold">1.0 kg</p>
                </div>
              </div>
            </div>

            {/* Advertencia sandbox */}
            {envioclick_label_url?.includes('sandbox') && (
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800 text-xs">
                  <strong>Modo Sandbox:</strong> Esta guía es solo para pruebas. No es válida para envíos reales.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.print()}
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onClick={() => setShowSandboxGuide(false)}
            >
              Cerrar
            </Button>
      </div>
    </DialogContent>
  </Dialog>
</Card>
  );
}