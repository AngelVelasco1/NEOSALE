"use client";

import { useState } from "react";
import { Truck, Package, AlertCircle, ExternalLink, RefreshCw, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { createShippingGuideAdmin } from "../services/shippingApi";
import { toast } from "sonner";

interface CreateShippingGuideProps {
  orderId: number;
  orderStatus: string;
  hasGuide: boolean;
  guideNumber?: string;
  trackingUrl?: string;
  onSuccess?: () => void;
}

export function CreateShippingGuide({
  orderId,
  orderStatus,
  hasGuide,
  guideNumber,
  trackingUrl,
  onSuccess,
}: CreateShippingGuideProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState<"PAID" | "COLLECT">("PAID");
  const [result, setResult] = useState<any>(null);
  const [showSandboxGuide, setShowSandboxGuide] = useState(false);

  const handleCreateGuide = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await createShippingGuideAdmin(orderId, paymentType);

      if (response.success && response.data) {
        setResult(response.data);
        toast.success("Guía de envío creada exitosamente");
        onSuccess?.();
      } else {
        toast.error(response.error || "Error al crear guía");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al crear guía de envío");
    } finally {
      setLoading(false);
    }
  };

  if (hasGuide) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="flex items-center gap-1">
          <Package className="w-3 h-3" />
          {guideNumber}
        </Badge>
        {trackingUrl && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => window.open(trackingUrl, "_blank")}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  }

  const canCreateGuide = ["paid", "processing"].includes(orderStatus);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          disabled={!canCreateGuide}
          className="gap-2"
        >
          <Truck className="w-4 h-4" />
          Generar Guía
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generar Guía de Envío</DialogTitle>
          <DialogDescription>
            Crear guía de envío con EnvioClick para la orden #{orderId}
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Pago</label>
              <Select
                value={paymentType}
                onValueChange={(value) =>
                  setPaymentType(value as "PAID" | "COLLECT")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PAID">Pago Anticipado</SelectItem>
                  <SelectItem value="COLLECT">Contraentrega</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Selecciona si el cliente ya pagó o pagará al recibir
              </p>
            </div>

            {orderStatus !== "paid" && orderStatus !== "processing" && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  La orden debe estar en estado "Pagada" o "Procesando" para
                  generar una guía.
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleCreateGuide}
              disabled={loading || !canCreateGuide}
              className="w-full"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4 mr-2" />
                  Generar Guía
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <Alert className="bg-green-50 border-green-200">
              <Package className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                ¡Guía creada exitosamente!
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Número de Guía</p>
                <p className="font-mono font-semibold text-lg">
                  {result.guideNumber}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.open(result.trackingUrl, "_blank")}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver Tracking
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    if (result.labelUrl?.includes('sandbox')) {
                      setShowSandboxGuide(true);
                    } else {
                      window.open(result.labelUrl, "_blank");
                    }
                  }}
                >
                  <Package className="w-4 h-4 mr-2" />
                  {result.labelUrl?.includes('sandbox') ? 'Ver Guía (Sandbox)' : 'Descargar Etiqueta'}
                </Button>
              </div>

              {result.labelUrl?.includes('sandbox') && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                  <p className="font-medium">⚠️ Modo Sandbox - Guía de Prueba</p>
                  <p className="text-xs mt-1">
                    Esta es una guía ficticia. No se generará envío real ni se cobrará.
                    Para guías reales, cambia a modo producción.
                  </p>
                </div>
              )}

              {result.estimatedDeliveryDate && (
                <p className="text-sm text-gray-600 text-center">
                  Entrega estimada:{" "}
                  {new Date(result.estimatedDeliveryDate).toLocaleDateString(
                    "es-CO",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>
              )}
            </div>

            <Button
              onClick={() => {
                setOpen(false);
                setResult(null);
              }}
              variant="secondary"
              className="w-full"
            >
              Cerrar
            </Button>
          </div>
        )}
      </DialogContent>

      {/* Modal para mostrar guía sandbox */}
      <Dialog open={showSandboxGuide} onOpenChange={setShowSandboxGuide}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Guía de Envío - Modo Sandbox
            </DialogTitle>
            <DialogDescription>
              Esta es una guía de prueba. No es válida para envíos reales.
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
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                  SANDBOX
                </Badge>
                <p className="text-xs text-gray-500 mt-1">Orden #{orderId}</p>
              </div>
            </div>

            {/* Barcode simulado */}
            <div className="bg-white p-4 rounded border border-gray-300 text-center">
              <div className="font-mono text-2xl font-bold tracking-wider">
                {result?.guideNumber || 'SANDBOX123456789'}
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
                  <p className="font-semibold">Cliente de Prueba</p>
                  <p className="text-sm">Dirección de ejemplo</p>
                  <p className="text-sm">Ciudad, Colombia</p>
                  <p className="text-sm">Tel: 300-000-0000</p>
                </div>
              </div>
            </div>

            {/* Información de transportadora */}
            <div className="bg-white p-3 rounded border border-gray-300">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 font-semibold">TRANSPORTADORA</p>
                  <p className="font-bold text-lg">ENVIA</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-semibold">PESO</p>
                  <p className="font-semibold">1.0 kg</p>
                </div>
              </div>
            </div>

            {/* Advertencia */}
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 text-xs">
                <strong>Modo Sandbox:</strong> Esta guía es solo para pruebas. No es válida para envíos reales.
                Para generar guías reales, configura NODE_ENV=production en el backend.
              </AlertDescription>
            </Alert>
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
    </Dialog>
  );
}
