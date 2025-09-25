"use client";

import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react";

// Tipos para el brick de pago
interface ICardPaymentBrickPayer {
  email?: string;
}

interface ICardPaymentFormData {
  token: string;
  installments: number;
  payer: ICardPaymentBrickPayer;
}

// Extender el tipo Window para el controlador del brick
declare global {
  interface Window {
    cardPaymentBrickController?: {
      unmount: () => void;
    };
  }
}
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { processCardPaymentApi } from "../services/paymentsApi";
import { ErrorsHandler } from "@/app/errors/errorsHandler";
import { useUser } from "@/app/(auth)/context/UserContext";
import { useSession } from "next-auth/react";

// Esquema simplificado para datos adicionales
const additionalDataSchema = z.object({
  notes: z.string().optional(),
});

interface CardPaymentBrickProps {
  amount: number;
  description: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: Error) => void;
  disabled?: boolean;
  userId: number;
}

export default function CardPaymentBrick({
  amount,
  description,
  onSuccess,
  onError,
  disabled = false,
  userId,
}: CardPaymentBrickProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { userProfile } = useUser();
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof additionalDataSchema>>({
    resolver: zodResolver(additionalDataSchema),
    defaultValues: {
      notes: "",
    },
  });

  // Manejar el submit del formulario de pago
  const handleCardPaymentSubmit = async (data: ICardPaymentFormData) => {
    if (disabled || isLoading) return;

    setIsLoading(true);

    try {
      console.log("🔄 Procesando pago con Checkout Bricks:", {
        amount,
        email: data.payer.email,
        installments: data.installments,
        hasToken: !!data.token,
      });

      // Validar que tenemos los datos necesarios
      if (!data.token) {
        throw new Error(
          "No se pudo generar el token de pago. Intenta nuevamente."
        );
      }

      if (!data.payer.email) {
        throw new Error("Email es requerido para procesar el pago.");
      }

      const finalUserId = userId || userProfile?.id;
      if (!finalUserId) {
        throw new Error("Usuario no identificado. Por favor inicia sesión.");
      }

      const paymentData = {
        amount: Math.round(amount),
        email: data.payer.email.toLowerCase().trim(),
        installments: data.installments,
        token: data.token,
        user_id: finalUserId,
      };

      console.log("📤 Enviando datos de pago:", {
        amount: paymentData.amount,
        email: paymentData.email,
        installments: paymentData.installments,
        hasToken: !!paymentData.token,
        user_id: paymentData.user_id,
      });

      const paymentResponse = await processCardPaymentApi(paymentData);

      if (paymentResponse.success && paymentResponse.payment) {
        const payment = paymentResponse.payment;

        // Manejar estados del pago
        switch (payment.status) {
          case "approved":
            ErrorsHandler.showSuccess(
              "¡Pago exitoso!",
              `Tu pago por $${amount.toLocaleString(
                "es-CO"
              )} ha sido aprobado exitosamente.`
            );
            onSuccess(payment.id);
            break;

          case "in_process":
          case "pending":
            ErrorsHandler.showSuccess(
              "Pago en proceso",
              "Tu pago está siendo procesado. Te notificaremos cuando se complete."
            );
            onSuccess(payment.id);
            break;

          case "rejected": {
            const rejectionReason = getRejectReason(payment.status_detail);
            ErrorsHandler.showError("Pago rechazado", rejectionReason);
            onError(new Error(rejectionReason));
            break;
          }

          default:
            throw new Error(`Estado de pago no reconocido: ${payment.status}`);
        }
      } else {
        throw new Error(
          paymentResponse.message || "Error inesperado al procesar el pago"
        );
      }
    } catch (error: unknown) {
      console.error("Error en el proceso de pago:", error);

      let errorMessage =
        "Error al procesar el pago. Por favor intenta nuevamente.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        error &&
        typeof error === "object" &&
        "cause" in error &&
        Array.isArray(error.cause)
      ) {
        errorMessage = error.cause
          .map(
            (cause: { description?: string; message?: string }) =>
              cause.description || cause.message || "Error desconocido"
          )
          .join(", ");
      } else if (error && typeof error === "object" && "status" in error) {
        const statusError = error as { status: number };
        if (statusError.status === 400) {
          errorMessage =
            "Datos de tarjeta inválidos. Verifica la información e intenta nuevamente.";
        } else if (statusError.status === 401) {
          errorMessage =
            "Error de autenticación. Por favor recarga la página e intenta nuevamente.";
        } else if (statusError.status >= 500) {
          errorMessage = "Error del servidor. Por favor intenta más tarde.";
        }
      }

      ErrorsHandler.showError("Error de pago", errorMessage);
      onError(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  const getRejectReason = (statusDetail?: string): string => {
    const rejectionReasons: Record<string, string> = {
      cc_rejected_insufficient_amount: "Fondos insuficientes en la tarjeta",
      cc_rejected_bad_filled_security_code: "Código de seguridad incorrecto",
      cc_rejected_bad_filled_date: "Fecha de vencimiento incorrecta",
      cc_rejected_bad_filled_card_number: "Número de tarjeta incorrecto",
      cc_rejected_call_for_authorize: "Debes autorizar el pago con tu banco",
      cc_rejected_card_disabled: "La tarjeta está deshabilitada",
      cc_rejected_duplicated_payment: "Ya existe un pago idéntico",
      cc_rejected_high_risk: "Pago rechazado por políticas de seguridad",
      cc_rejected_max_attempts: "Has superado el límite de intentos",
      cc_rejected_other_reason:
        "La tarjeta rechazó el pago por motivos no especificados",
      cc_rejected_blacklist: "La tarjeta está en lista negra",
      cc_rejected_card_type_not_allowed:
        "Este tipo de tarjeta no está permitido para este comercio",
      cc_rejected_invalid_installments:
        "Número de cuotas no válido para esta tarjeta",
    };

    return (
      rejectionReasons[statusDetail || ""] ||
      "Tu pago fue rechazado. Intenta con otro método de pago o contacta tu banco."
    );
  };

  useEffect(() => {
    // Inicializar SDK de MercadoPago para Checkout Bricks
    initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, {
      locale: "es-CO",
      advancedFraudPrevention: false,
      trackingDisabled: true,
    });

    // Cleanup al desmontar el componente
    return () => {
      if (window.cardPaymentBrickController) {
        window.cardPaymentBrickController.unmount();
      }
    };
  }, []);

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Pago con Tarjeta de Crédito/Débito</CardTitle>
        <CardDescription>
          {description} - Total a pagar:{" "}
          <strong>${amount.toLocaleString("es-CO")}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Información del usuario */}
          <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
            <p className="font-medium text-blue-800">
              Información de la cuenta:
            </p>
            <p>Email: {userProfile?.email || session?.user?.email}</p>
            {userProfile?.name && <p>Nombre: {userProfile.name}</p>}
          </div>

          {/* Formulario adicional si es necesario */}
          <Form {...form}>
            <form ref={formRef} className="space-y-4">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas adicionales (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Comentarios sobre tu pedido"
                        {...field}
                        disabled={disabled || isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          {/* Checkout Brick */}
          <div className="border rounded-lg p-4">
            <CardPayment
              initialization={{
                amount: amount,
                payer: {
                  email: userProfile?.email || session?.user?.email || "",
                },
              }}
              customization={{
                paymentMethods: {
                  maxInstallments: 12,
                  minInstallments: 1,
                },
                visual: {
                  style: {
                    theme: "default",
                  },
                },
              }}
              onSubmit={handleCardPaymentSubmit}
              onReady={() => {
                console.log("💳 Brick de pago listo");
              }}
              onError={(error) => {
                console.error("❌ Error en Brick:", error);
                ErrorsHandler.showError(
                  "Error en formulario de pago",
                  "Hubo un problema al cargar el formulario de pago. Recarga la página e intenta nuevamente."
                );
              }}
            />
          </div>

          {/* Información de seguridad */}
          <div className="text-xs text-muted-foreground bg-green-50 p-3 rounded-lg space-y-2">
            <p>
              🔒 <strong>Transacción segura:</strong> Tu información está
              protegida con encriptación de grado bancario
            </p>
            <div className="flex items-center gap-2">
              <span>
                💳 <strong>Tarjetas aceptadas:</strong>
              </span>
              <div className="flex gap-1">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                  Visa
                </span>
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                  Mastercard
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                  American Express
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                  Diners
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
