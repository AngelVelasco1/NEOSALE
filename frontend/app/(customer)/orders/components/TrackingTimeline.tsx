"use client";

import { useEffect, useState } from "react";
import { 
  Package, MapPin, Clock, CheckCircle, Truck, XCircle, FileText, 
  ExternalLink, Printer, AlertCircle, Calendar, MapPinned, Zap,
  TrendingUp, RefreshCw, CopyIcon, Check
} from "lucide-react";
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

const statusGradients: Record<string, string> = {
  CREATED: "from-blue-600 to-blue-400",
  PICKED_UP: "from-purple-600 to-purple-400",
  IN_TRANSIT: "from-cyan-600 to-cyan-400",
  OUT_FOR_DELIVERY: "from-orange-600 to-orange-400",
  DELIVERED: "from-emerald-600 to-emerald-400",
  CANCELLED: "from-red-600 to-red-400",
  RETURNED: "from-slate-600 to-slate-400",
};

const statusProgressPercentage: Record<string, number> = {
  CREATED: 25,
  PICKED_UP: 50,
  IN_TRANSIT: 75,
  OUT_FOR_DELIVERY: 85,
  DELIVERED: 100,
  CANCELLED: 0,
  RETURNED: 0,
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

const statusDescriptions: Record<string, string> = {
  CREATED: "Tu pedido ha sido procesado y la guía de envío ha sido creada",
  PICKED_UP: "Tu paquete ha sido recogido del almacén",
  IN_TRANSIT: "Tu paquete está en camino hacia tu destino",
  OUT_FOR_DELIVERY: "Tu paquete está siendo entregado hoy",
  DELIVERED: "Tu paquete ha sido entregado exitosamente",
  CANCELLED: "Tu envío ha sido cancelado",
  RETURNED: "Tu paquete ha sido devuelto",
};

// Mapping de estados de orden a estados de tracking
const orderStatusToTrackingStatus: Record<string, string> = {
  pending: "CREATED",
  confirmed: "PICKED_UP",
  shipped: "IN_TRANSIT",
  delivered: "DELIVERED",
  cancelled: "CANCELLED",
};

// Función para obtener el estado sincronizado
const getSyncedTrackingStatus = (
  envioClickStatus: string | undefined,
  orderStatus: string | undefined
): string => {
  // Si hay estado de tracking de envioclick, usarlo
  if (envioClickStatus && envioClickStatus !== "CREATED") {
    return envioClickStatus;
  }
  
  // Si no, usar el estado de la orden
  if (orderStatus) {
    return orderStatusToTrackingStatus[orderStatus.toLowerCase()] || "CREATED";
  }
  
  return "CREATED";
};

export function TrackingTimeline({
  orderId,
  autoUpdate = false,
  updateInterval = 300000, // 5 minutos por defecto (300000ms) para evitar rate limiting
  orderData,
}: TrackingTimelineProps) {
  const [loading, setLoading] = useState(true);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSandboxGuide, setShowSandboxGuide] = useState(false);
  const [copiedGuide, setCopiedGuide] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [nextRetryTime, setNextRetryTime] = useState<Date | null>(null);

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
    
    // Si está en rate limit, no intentar cargar
    if (isRateLimited && nextRetryTime && new Date() < nextRetryTime) {
      const minutosRestantes = Math.ceil(
        (nextRetryTime.getTime() - new Date().getTime()) / 1000 / 60
      );
      setError(
        `Límite de solicitudes alcanzado. Por favor espera ${minutosRestantes} minuto${minutosRestantes > 1 ? 's' : ''}.`
      );
      setLoading(false);
      return;
    }
    
    const result = await getTrackingInfo(orderId);
    
    if (result.success && result.data) {
      setTrackingData(result.data);
      setIsRateLimited(false);
      setNextRetryTime(null);
    } else {
      // Verificar si es un error de rate limiting
      if (result.message?.includes('Límite de solicitudes')) {
        setIsRateLimited(true);
        const retryTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos
        setNextRetryTime(retryTime);
        setError(result.message);
      } else {
        setError(result.message || "No se pudo cargar el tracking");
        setIsRateLimited(false);
      }
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadTracking();
    setIsRefreshing(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedGuide(true);
    setTimeout(() => setCopiedGuide(false), 2000);
  };

  if (loading) {
    return (
      <Card className="border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-800">
        <CardHeader className="border-b border-slate-700/50">
          <Skeleton className="h-6 w-48 bg-slate-700" />
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <Skeleton className="h-24 w-full bg-slate-700" />
          <Skeleton className="h-24 w-full bg-slate-700" />
          <Skeleton className="h-24 w-full bg-slate-700" />
        </CardContent>
      </Card>
    );
  }

  if (error || !trackingData) {
    const isRateLimitError = error?.includes('Límite de solicitudes');
    
    return (
      <Card className="border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-800">
        <CardHeader className="border-b border-slate-700/50">
          <CardTitle className="text-lg text-white">Seguimiento del Envío</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="mb-4 flex justify-center">
              {isRateLimitError ? (
                <div className="rounded-full bg-yellow-500/20 p-4">
                  <Clock className="w-12 h-12 text-yellow-400" />
                </div>
              ) : (
                <div className="rounded-full bg-slate-700/50 p-4">
                  <Package className="w-12 h-12 text-slate-400" />
                </div>
              )}
            </div>
            
            {isRateLimitError ? (
              <>
                <h3 className="text-white font-semibold mb-2">Límite de solicitudes alcanzado</h3>
                <p className="text-yellow-300 mb-4">
                  {error}
                </p>
                <p className="text-slate-400 text-sm mb-6">
                  Esto es normal para proteger nuestros servidores. El tracking se actualizará automáticamente cuando sea posible.
                </p>
                <div className="space-y-2">
                  <p className="text-xs text-slate-500">⏳ Próximo intento disponible en:</p>
                  {nextRetryTime && (
                    <p className="font-mono text-cyan-400">
                      {nextRetryTime.toLocaleTimeString("es-CO")}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <p className="text-slate-300 mb-4">
                  {error || "No hay información de envío disponible"}
                </p>
                <Button 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {isRefreshing ? "Actualizando..." : "Reintentar"}
                </Button>
              </>
            )}
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
    estimated_delivery_date,
    shipping_cost,
  } = trackingData;

  const events: TrackingEvent[] = Array.isArray(tracking_history)
    ? tracking_history
    : [];

  // Sincronizar estado del tracking con el estado de la orden
  const syncedStatus = getSyncedTrackingStatus(envioclick_status, orderData?.status);
  const progressPercentage = statusProgressPercentage[syncedStatus] || 0;
  const statusGradient = statusGradients[syncedStatus] || "from-slate-600 to-slate-400";

  return (
    <Card className="border-slate-700/50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Header con gradiente */}
      <CardHeader className="border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-transparent pb-6">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-2xl flex items-center gap-3 text-white">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-cyan-600/20">
              <Package className="w-6 h-6 text-cyan-400" />
            </div>
            Seguimiento del Envío
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-slate-300 hover:text-white hover:bg-slate-700/50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge className={`bg-gradient-to-r ${statusGradient} text-white border-0 text-sm`}>
                {statusLabels[syncedStatus] || syncedStatus}
              </Badge>
              {orderData?.status && (
                <span className="text-xs text-slate-500">
                  ({orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)})
                </span>
              )}
            </div>
            <span className="text-xs text-slate-400">{progressPercentage}% completado</span>
          </div>
          <div className="h-2 bg-slate-700/60 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${statusGradient} transition-all duration-500 rounded-full`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>
              {syncedStatus === "DELIVERED" 
                ? "Entregado" 
                : syncedStatus === "CANCELLED" 
                ? "Cancelado" 
                : `${statusDescriptions[syncedStatus]}`.substring(0, 50) + "..."}
            </span>
            {orderData?.status && (
              <span className="flex items-center gap-1 text-violet-400">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                Sincronizado
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Guía de Envío */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-slate-800/60 to-slate-700/40 border border-slate-700/50 hover:border-blue-500/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <FileText className="w-3 h-3 inline mr-1" />
                Número de Guía
              </p>
              {envioclick_guide_number && (
                <button
                  onClick={() => copyToClipboard(envioclick_guide_number)}
                  className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  {copiedGuide ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <CopyIcon className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
            {envioclick_guide_number ? (
              <>
                <p className="font-mono font-bold text-lg text-white mb-3">
                  {envioclick_guide_number}
                </p>
                {carrier && (
                  <p className="text-xs text-slate-400">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    Transportadora: <span className="text-cyan-400 font-semibold">{carrier}</span>
                  </p>
                )}
              </>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-yellow-400 font-medium">⏳ Pendiente de generación</p>
                <p className="text-xs text-slate-400">
                  El vendedor está preparando tu envío. La guía se generará pronto.
                </p>
              </div>
            )}
            
            {/* Botón para ver guía */}
            <Button
              size="sm"
              className="w-full mt-3 bg-gradient-to-r from-blue-600/80 to-cyan-600/80 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
              onClick={() => {
                if (envioclick_label_url?.includes('sandbox')) {
                  setShowSandboxGuide(true);
                } else if (envioclick_label_url) {
                  window.open(envioclick_label_url, "_blank");
                } else {
                  // Si no hay URL, mostrar la vista previa simulada
                  setShowSandboxGuide(true);
                }
              }}
            >
              <FileText className="w-3 h-3 mr-2" />
              {envioclick_guide_number ? "Ver Guía" : "Vista Previa"}
            </Button>
          </div>

          {/* Fecha estimada de entrega */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-900/30 to-slate-700/40 border border-slate-700/50">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <Calendar className="w-3 h-3 inline mr-1" />
              Entrega Estimada
            </p>
            {estimated_delivery_date ? (
              <>
                <p className="font-bold text-lg text-emerald-400 mb-1">
                  {new Date(estimated_delivery_date).toLocaleDateString("es-CO", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(estimated_delivery_date).toLocaleTimeString("es-CO", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })} aprox.
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-400">Por confirmar</p>
            )}
          </div>

          {/* Ubicación actual */}
          {events.length > 0 && events[0].location && (
            <div className="p-4 rounded-lg bg-gradient-to-br from-orange-900/20 to-slate-700/40 border border-orange-700/40">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <MapPinned className="w-3 h-3 inline mr-1 text-orange-400" />
                Ubicación Actual
              </p>
              <p className="font-semibold text-orange-300">{events[0].location}</p>
              <p className="text-xs text-slate-400 mt-1">
                {new Date(events[0].date).toLocaleString("es-CO")}
              </p>
            </div>
          )}

          {/* Estado de la Orden Sincronizado */}
          {orderData?.status && (
            <div className="p-4 rounded-lg bg-gradient-to-br from-violet-900/20 to-slate-700/40 border border-violet-700/40">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Package className="w-3 h-3 inline mr-1 text-violet-400" />
                Estado de la Orden
              </p>
              <p className="font-bold text-lg text-violet-300 mb-2 capitalize">
                {orderData.status}
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-xs text-slate-400">Sincronizado con tracking</span>
              </div>
            </div>
          )}

          {/* Costo de envío */}
          {shipping_cost && (
            <div className="p-4 rounded-lg bg-gradient-to-br from-slate-800/60 to-slate-700/40 border border-slate-700/50">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Zap className="w-3 h-3 inline mr-1" />
                Costo de Envío
              </p>
              <p className="font-bold text-lg text-blue-400">
                ${shipping_cost.toLocaleString("es-CO")}
              </p>
            </div>
          )}
        </div>

        {/* Botones de Acción */}
        {envioclick_guide_number && (
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
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
            {envioclick_tracking_url && (
              <Button
                variant="outline"
                className="flex-1 border-slate-600 hover:bg-slate-700 text-slate-300"
                onClick={() => window.open(envioclick_tracking_url, "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Tracking Completo
              </Button>
            )}
          </div>
        )}

        {/* Timeline Mejorado */}
        {events.length > 0 ? (
          <div className="pt-4 border-t border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-300 mb-6 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Historial de Eventos
            </h3>
            <div className="relative space-y-4">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 to-transparent" />
              
              {events.map((event, index) => {
                const Icon = statusIcons[event.status] || Package;
                const gradient = statusGradients[event.status] || "from-slate-600 to-slate-400";
                const isLatest = index === 0;
                
                return (
                  <div key={index} className="relative flex gap-4 pl-4">
                    <div
                      className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center z-10 ring-2 ring-slate-900 ${
                        isLatest ? 'ring-4 ring-cyan-500/30 shadow-lg shadow-cyan-500/20' : ''
                      }`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-4 hover:border-slate-600/70 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-white">
                              {statusLabels[event.status] || event.status}
                            </p>
                            {isLatest && (
                              <Badge variant="secondary" className="mt-1 bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs">
                                Más reciente
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="w-3 h-3" />
                            {new Date(event.date).toLocaleString("es-CO", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                        
                        {event.description && (
                          <p className="text-sm text-slate-300 mb-2">
                            {event.description}
                          </p>
                        )}

                        {event.location && (
                          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 rounded px-2 py-1 w-fit">
                            <MapPin className="w-3 h-3 text-cyan-400" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 border-t border-slate-700/50">
            <Package className="w-10 h-10 mx-auto mb-2 text-slate-600" />
            <p className="text-slate-400">No hay eventos de tracking registrados aún</p>
            <p className="text-xs text-slate-500 mt-1">Se actualizará cuando el paquete se procese</p>
          </div>
        )}

        {/* Última Actualización */}
        {last_tracking_update && (
          <div className="text-xs text-slate-500 text-center pt-4 border-t border-slate-700/50 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" />
            Última actualización: {new Date(last_tracking_update).toLocaleString("es-CO")}
          </div>
        )}
      </CardContent>

      {/* Modal Profesional para Guía Sandbox */}
      <Dialog open={showSandboxGuide} onOpenChange={setShowSandboxGuide}>
        <DialogContent className="max-w-3xl bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Package className="w-5 h-5 text-cyan-400" />
              Guía de Envío
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Información completa de tu envío
            </DialogDescription>
          </DialogHeader>

          <div className="border border-slate-700/60 rounded-lg p-8 space-y-6 bg-gradient-to-br from-slate-800/40 to-slate-700/20 my-4">
            {/* Header Premium */}
            <div className="flex justify-between items-start pb-6 border-b border-slate-700">
              <div>
                <h3 className="font-bold text-2xl text-white">NEOSALE</h3>
                <p className="text-sm text-slate-400 mt-1">Guía de Envío Oficial</p>
              </div>
              <div className="text-right">
                {envioclick_label_url?.includes('sandbox') && (
                  <Badge className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 mb-2">
                    🧪 MODO PRUEBA
                  </Badge>
                )}
                <p className="text-xs text-slate-400 font-mono">Orden #{orderId}</p>
                <p className="text-xs text-slate-500 mt-1">{new Date().toLocaleDateString("es-CO")}</p>
              </div>
            </div>

            {/* Barcode Premium */}
            <div className="bg-white rounded-lg p-6 flex flex-col items-center border border-slate-600">
              <div className="font-mono text-3xl font-bold tracking-wider text-slate-900 mb-4">
                {envioclick_guide_number || 'SANDBOX-123456789'}
              </div>
              <div className="flex justify-center gap-0.5 h-16 items-center">
                {Array.from({length: 50}).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-slate-900"
                    style={{height: Math.random() > 0.5 ? '100%' : '70%'}}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-600 mt-4 font-semibold">
                {envioclick_guide_number || 'SANDBOX123456789'}
              </p>
            </div>

            {/* Info Grid Mejorado */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/40 border border-slate-700/60 rounded-lg p-4">
                <p className="text-xs text-slate-400 font-bold uppercase mb-2 tracking-wide">Remitente</p>
                <div className="space-y-1">
                  <p className="font-semibold text-white">NEOSALE</p>
                  <p className="text-sm text-slate-300">Calle 123 #45-67</p>
                  <p className="text-sm text-slate-300">Bogotá, D.C.</p>
                  <p className="text-sm text-slate-300">Colombia</p>
                  <p className="text-sm text-cyan-400 font-mono mt-2">+57 300-123-4567</p>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-700/40 rounded-lg p-4">
                <p className="text-xs text-slate-400 font-bold uppercase mb-2 tracking-wide">Destinatario</p>
                <div className="space-y-1">
                  {orderData?.addresses ? (
                    <>
                      <p className="font-semibold text-white">{orderData.addresses.address || '---'}</p>
                      <p className="text-sm text-slate-300">{orderData.addresses.city || '---'}</p>
                      <p className="text-sm text-slate-300">
                        {orderData.addresses.department || ''}{orderData.addresses.country ? ` - ${orderData.addresses.country}` : ''}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-slate-400">No hay información de dirección disponible</p>
                  )}
                </div>
              </div>
            </div>

            {/* Detalles de Transportador */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-900/40 border border-slate-700/60 rounded-lg p-4">
                <p className="text-xs text-slate-400 font-bold uppercase mb-2">Transportadora</p>
                <p className="text-xl font-bold text-cyan-400">{carrier || 'ENVIA'}</p>
              </div>
              <div className="bg-slate-900/40 border border-slate-700/60 rounded-lg p-4">
                <p className="text-xs text-slate-400 font-bold uppercase mb-2">Peso</p>
                <p className="text-xl font-bold text-white">1.0 kg</p>
              </div>
              <div className="bg-slate-900/40 border border-slate-700/60 rounded-lg p-4">
                <p className="text-xs text-slate-400 font-bold uppercase mb-2">Servicio</p>
                <p className="text-sm font-bold text-emerald-400">Estándar</p>
              </div>
            </div>

            {/* Advertencia Sandbox */}
            {envioclick_label_url?.includes('sandbox') && (
              <Alert className="border-yellow-600/50 bg-yellow-500/10">
                <Zap className="h-4 w-4 text-yellow-400" />
                <AlertDescription className="text-yellow-300 text-sm ml-2">
                  <strong>Modo Sandbox:</strong> Esta guía es solo para pruebas y validación. No es válida para envíos reales. Únicamente para desarrolladores.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-2 pt-4">
            <Button
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              onClick={() => window.print()}
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimir Guía
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-slate-600 hover:bg-slate-700 text-slate-300"
              onClick={() => copyToClipboard(envioclick_guide_number)}
            >
              <CopyIcon className="w-4 h-4 mr-2" />
              {copiedGuide ? 'Copiado' : 'Copiar Número'}
            </Button>
            <Button
              variant="ghost"
              className="flex-1 text-slate-300 hover:text-white hover:bg-slate-700"
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