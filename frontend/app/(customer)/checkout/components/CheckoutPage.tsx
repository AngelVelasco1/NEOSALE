"use client";

import React from "react";
import CardPaymentBrick from "./CardPaymentBrick";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CheckoutPageProps {
  amount: number;
  description: string;
  userId: number;
}

export default function CheckoutPage({
  amount,
  description,
  userId,
}: CheckoutPageProps) {
  const router = useRouter();

  const handlePaymentSuccess = (paymentId: string) => {
    console.log("Pago exitoso:", paymentId);
    toast.success("¡Pago procesado exitosamente!");

    // Redirigir a página de éxito o donde corresponda
    router.push(`/checkout/success?payment=${paymentId}`);
  };

  const handlePaymentError = (error: Error) => {
    console.error("❌ Error en pago:", error);
    toast.error("Error al procesar el pago");

    // Aquí puedes manejar errores específicos, logging, etc.
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Finalizar Compra
            </h1>
            <p className="text-slate-600">
              Completa tu pago de forma segura con MercadoPago
            </p>
          </div>

          <CardPaymentBrick
            amount={amount}
            description={description}
            userId={userId}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />

          <div className="mt-8 text-center">
            <div className="text-xs text-slate-500 space-y-1">
              <p>Al continuar, aceptas nuestros términos y condiciones</p>
              <p>Procesado de forma segura por MercadoPago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
