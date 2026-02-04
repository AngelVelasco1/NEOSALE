"use client";

import { useState } from "react";
import { Truck, Package, AlertCircle, ExternalLink, RefreshCw } from "lucide-react";
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
                  onClick={() => window.open(result.labelUrl, "_blank")}
                >
                  <Package className="w-4 h-4 mr-2" />
                  Descargar Etiqueta
                </Button>
              </div>

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
    </Dialog>
  );
}
