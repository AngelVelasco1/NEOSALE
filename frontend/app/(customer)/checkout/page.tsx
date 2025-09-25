"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ErrorsHandler } from "@/app/errors/errorsHandler";
import { useCart } from "../(cart)/hooks/useCart";

import { ShippingAddressForm } from "./components/ShippingAddressForm";
import { PaymentMethods } from "./components/PaymentMethods";
import { OrderSummary } from "../orders/components/OrderSummary";

import { Address } from "./services/addressesApi";
import { createOrderApi } from "../orders/services/ordersApi";
import { useAddresses } from "./hooks/useAddresses";
import { useUser } from "@/app/(auth)/context/UserContext";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    getUserAddresses,
    createAddress,
    getDefaultAddress,
    isAuthenticated,
  } = useAddresses();
  const {
    cartProducts,
    isLoading: cartLoading,
    getSubTotal,
    clearCart,
  } = useCart();

  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const { userProfile } = useUser();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
  }, [isAuthenticated, router]);

  // ✅ VALIDAR CARRITO
  useEffect(() => {
    if (!cartLoading && (!cartProducts || cartProducts.length === 0)) {
      ErrorsHandler.showError(
        "Carrito vacío",
        "No hay productos en tu carrito"
      );
      router.replace("/cart");
      return;
    }
  }, [cartProducts, cartLoading, router]);

  const subtotal = cartProducts && cartProducts.length > 0 ? getSubTotal() : 0;
  const shipping = 0;
  const taxes = subtotal * 0.19;
  const total = subtotal + shipping + taxes;

  // ✅ CARGAR DATOS DEL CHECKOUT
  const fetchData = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Cargar direcciones del usuario
      const addresses = await getUserAddresses();
      setUserAddresses(addresses);

      // Intentar obtener la dirección predeterminada
      const defaultAddress = await getDefaultAddress();
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (addresses.length > 0) {
        setSelectedAddress(addresses[0]);
      } else {
        setSelectedAddress(null);
      }
    } catch (err) {
      console.error("Error loading checkout data:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Hubo un error al cargar los datos necesarios para el checkout";
      setError(errorMessage);
      ErrorsHandler.showError(
        "Error",
        "No pudimos cargar la información necesaria para el checkout"
      );
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, getUserAddresses, getDefaultAddress]);

  useEffect(() => {
    if (
      !cartLoading &&
      isAuthenticated &&
      cartProducts &&
      cartProducts.length > 0
    ) {
      fetchData();
    }
  }, [cartLoading, isAuthenticated, cartProducts, fetchData]);

  // ✅ MANEJAR ÉXITO DE PAGO - CORREGIDO
  const handlePaymentSuccess = useCallback(
    async (paymentId: string, paymentMethod?: string) => {
      setIsProcessingOrder(true);

      try {
        if (!selectedAddress) {
          throw new Error("Debes seleccionar una dirección de envío");
        }

        if (!selectedAddress.id) {
          throw new Error("La dirección seleccionada no es válida");
        }

        // ✅ CREAR ORDEN CON EL PAYMENT_ID RECIBIDO
        const orderData = {
          payment_id: paymentId,
          address_id: selectedAddress.id,
          items: cartProducts.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            unit_price: item.price,
            color_code: item.color_code,
            size: item.size,
          })),
          subtotal,
          taxes,
          shipping,
          total,
          payment_method: paymentMethod || "card",
        };

        console.log("Creando orden con datos:", orderData);

        const order = await createOrderApi(orderData);

        // ✅ LIMPIAR CARRITO DESPUÉS DE ORDEN EXITOSA
        await clearCart();

        ErrorsHandler.showSuccess(
          "¡Orden completada!",
          `Tu orden #${order.id} ha sido procesada exitosamente`
        );

        router.push(`/checkout/success?order_id=${order.id}`);
      } catch (error) {
        console.error("Error creating order:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Hubo un problema al crear tu orden";
        ErrorsHandler.showError("Error", errorMessage);
      } finally {
        setIsProcessingOrder(false);
      }
    },
    [
      selectedAddress,
      cartProducts,
      subtotal,
      taxes,
      shipping,
      total,
      clearCart,
      router,
    ]
  );

  // ✅ MANEJAR ERROR DE PAGO
  const handlePaymentError = useCallback((error: Error) => {
    console.error("Payment error:", error);
    ErrorsHandler.showError(
      "Error de pago",
      "Hubo un problema procesando tu pago. Por favor intenta nuevamente."
    );
  }, []);

  // ✅ MANEJAR CREACIÓN DE NUEVA DIRECCIÓN
  const handleCreateAddress = useCallback(
    async (addressData: any) => {
      try {
        const newAddress = await createAddress(addressData);
        setUserAddresses((prev) => [...prev, newAddress]);
        setSelectedAddress(newAddress);
        ErrorsHandler.showSuccess("Éxito", "Dirección creada exitosamente");
      } catch (error) {
        console.error("Error creating address:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error al crear la dirección";
        ErrorsHandler.showError("Error", errorMessage);
      }
    },
    [createAddress]
  );

  // ✅ LOADING STATES
  if (cartLoading || isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Cargando información del checkout...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!cartProducts || cartProducts.length === 0) {
    return null;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              No pudimos cargar la información necesaria para el checkout
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" onClick={() => fetchData()}>
              Reintentar
            </Button>
            <Button onClick={() => router.push("/cart")}>
              Volver al carrito
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 px-4">
          <h1 className="text-2xl font-bold">Finalizar compra</h1>
          <p className="text-muted-foreground">Completa tu orden</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
          {/* Información de envío y pago */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dirección de envío */}
            <ShippingAddressForm
              addresses={userAddresses}
              selectedAddress={selectedAddress}
              onAddressSelect={setSelectedAddress}
              onAddNewAddress={handleCreateAddress}
              onCreateAddress={handleCreateAddress}
            />

            {/* Métodos de pago */}
            <PaymentMethods
              amount={total}
              description={`Orden de ${cartProducts.length} producto(s)`}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              disabled={!selectedAddress || isProcessingOrder}
              userId={userProfile?.id ?? 0}
            />
          </div>

          {/* Resumen de la orden */}
          <div className="lg:col-span-1">
            <OrderSummary
              cartItems={cartProducts}
              subtotal={subtotal}
              shipping={shipping}
              taxes={taxes}
              total={total}
              isProcessing={isProcessingOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
