"use client";

import { useState } from "react";
import { RefreshCw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { updateTrackingAdmin, cancelShippingAdmin } from "../services/shippingApi";
import { toast } from "sonner";

interface ShippingActionsProps {
  orderId: number;
  hasGuide: boolean;
  orderStatus: string;
  onUpdate?: () => void;
}

export function ShippingActions({
  orderId,
  hasGuide,
  orderStatus,
  onUpdate,
}: ShippingActionsProps) {
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);

  const handleUpdateTracking = async () => {
    setLoadingUpdate(true);
    try {
      const response = await updateTrackingAdmin(orderId);
      
      if (response.success) {
        toast.success("Tracking actualizado correctamente");
        onUpdate?.();
      } else {
        toast.error(response.message || "Error al actualizar tracking");
      }
    } catch (error) {
      toast.error("Error al actualizar tracking");
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleCancelShipping = async () => {
    setLoadingCancel(true);
    try {
      const response = await cancelShippingAdmin(orderId);
      
      if (response.success) {
        toast.success("Envío cancelado correctamente");
        onUpdate?.();
      } else {
        toast.error(response.message || "Error al cancelar envío");
      }
    } catch (error) {
      toast.error("Error al cancelar envío");
    } finally {
      setLoadingCancel(false);
    }
  };

  if (!hasGuide) {
    return null;
  }

  const canCancel = !["delivered", "cancelled"].includes(orderStatus);

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={handleUpdateTracking}
        disabled={loadingUpdate}
      >
        {loadingUpdate ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <RefreshCw className="w-4 h-4" />
        )}
        <span className="ml-2">Actualizar</span>
      </Button>

      {canCancel && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="destructive"
              disabled={loadingCancel}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Cancelar Envío
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Cancelar envío?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción cancelará la guía de envío en EnvioClick. No se
                podrá revertir. ¿Deseas continuar?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No, mantener</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancelShipping}
                className="bg-red-600 hover:bg-red-700"
              >
                Sí, cancelar envío
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
