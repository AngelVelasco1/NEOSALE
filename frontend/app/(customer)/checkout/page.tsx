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

import { Address } from "../(addresses)/services/addressesApi";
import { createOrderApi } from "../orders/services/ordersApi";
import { useAddresses } from "./hooks/useAddresses";
import { useUser } from "@/app/(auth)/context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  MapPin,
  CreditCard,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Package
} from "lucide-react";

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

  // Step management
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!cartLoading && (!cartProducts || cartProducts.length === 0)) {
      ErrorsHandler.showError(
        "Carrito vacío",
        "No hay productos en tu carrito"
      );
    }
  }, [cartProducts, cartLoading, router]);

  const subtotal = cartProducts && cartProducts.length > 0 ? getSubTotal() : 0;
  const shipping = 0;
  const taxes = subtotal * 0.19;
  const total = subtotal + shipping + taxes;

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const addresses = await getUserAddresses();
      setUserAddresses(addresses);

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

        const order = await createOrderApi(orderData);

        await clearCart();

        // Move to confirmation step
        setCurrentStep(3);

        ErrorsHandler.showSuccess(
          "¡Orden completada!",
          `Tu orden #${order.id} ha sido procesada exitosamente`
        );

        // Redirect after showing confirmation
        setTimeout(() => {
          router.push(`/checkout/success?order_id=${order.id}`);
        }, 3000);
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

  const handlePaymentError = useCallback((error: Error) => {
    console.error("Payment error:", error);
    ErrorsHandler.showError(
      "Error de pago",
      "Hubo un problema procesando tu pago. Por favor intenta nuevamente."
    );
  }, []);

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

  // Step navigation handlers
  const handleNextStep = () => {
    if (currentStep === 1 && !selectedAddress) {
      ErrorsHandler.showError(
        "Dirección requerida",
        "Por favor selecciona o agrega una dirección de envío"
      );
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1 && currentStep !== 3) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Steps configuration
  const steps = [
    {
      number: 1,
      title: "Envío",
      description: "Dirección de entrega",
      icon: MapPin,
      completed: currentStep > 1,
      active: currentStep === 1,
    },
    {
      number: 2,
      title: "Pago",
      description: "Método de pago",
      icon: CreditCard,
      completed: currentStep > 2,
      active: currentStep === 2,
    },
    {
      number: 3,
      title: "Confirmación",
      description: "Revisar orden",
      icon: CheckCircle,
      completed: false,
      active: currentStep === 3,
    },
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with progress */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.1
              }}
              className="p-4 rounded-xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 shadow-lg shadow-slate-900/30 ring-1 ring-slate-700/50"
            >
              <ShoppingCart className="w-8 h-8 text-slate-100" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                Finalizar compra
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1 text-base">
                Paso {currentStep} de 3: {steps[currentStep - 1].description}
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isLast = index === steps.length - 1;

                return (
                  <React.Fragment key={step.number}>
                    <div className="flex flex-col items-center relative z-10">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 20,
                          delay: 0.3 + index * 0.1
                        }}
                        className="relative"
                      >
                        <div
                          className={`
                            w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-500 relative
                            ${step.completed
                              ? 'bg-gradient-to-br from-emerald-500/90 to-teal-600/90 shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-400/30'
                              : step.active
                                ? 'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 shadow-lg shadow-slate-900/40 ring-1 ring-slate-700/50'
                                : 'bg-slate-100 dark:bg-slate-800/40 ring-1 ring-slate-200 dark:ring-slate-700/50'
                            }
                          `}
                        >
                          {(step.active || step.completed) && (
                            <motion.div
                              animate={{
                                scale: [1, 1.15, 1],
                                opacity: [0.3, 0.15, 0.3],
                              }}
                              transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              className={`absolute inset-0 rounded-xl blur-md ${step.completed
                                ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                                : 'bg-gradient-to-br from-slate-700 to-slate-900'
                                }`}
                            />
                          )}

                          <StepIcon
                            className={`w-7 h-7 relative z-10 transition-colors ${step.completed
                                ? 'text-white'
                                : step.active
                                  ? 'text-slate-100'
                                  : 'text-slate-400 dark:text-slate-500'
                              }`}
                          />
                        </div>

                        <div
                          className={`
                            absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm
                            ${step.completed
                              ? 'bg-emerald-500 text-white ring-2 ring-emerald-400/40'
                              : step.active
                                ? 'bg-slate-700 text-slate-100 ring-2 ring-slate-600/40'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 ring-1 ring-slate-300 dark:ring-slate-600'
                            }
                          `}
                        >
                          {step.completed ? '✓' : step.number}
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="mt-3 text-center"
                      >
                        <p
                          className={`text-sm font-semibold transition-colors ${step.active
                              ? 'text-slate-900 dark:text-slate-100'
                              : step.completed
                                ? 'text-emerald-600 dark:text-emerald-500'
                                : 'text-slate-500 dark:text-slate-400'
                            }`}
                        >
                          {step.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">
                          {step.description}
                        </p>
                      </motion.div>
                    </div>

                    {!isLast && (
                      <div className="flex-1 h-0.5 mx-4 mt-8 relative">
                        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 rounded-full" />
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{
                            scaleX: step.completed ? 1 : 0
                          }}
                          transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                          className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full origin-left"
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="relative h-0.5 w-full max-w-4xl mx-auto rounded-full overflow-hidden mt-8"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700" />
            <motion.div
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-500/40 dark:via-slate-400/30 to-transparent"
            />
          </motion.div>
        </motion.div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Step Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping Address */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ShippingAddressForm
                    addresses={userAddresses}
                    selectedAddress={selectedAddress}
                    onAddressSelect={setSelectedAddress}
                    onAddNewAddress={handleCreateAddress}
                    onCreateAddress={handleCreateAddress}
                    userId={userProfile?.id ?? 0}
                    onAddressesChange={fetchData}
                  />

                  {/* Navigation buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 flex justify-between"
                  >
                    <Button
                      variant="outline"
                      onClick={() => router.push("/cart")}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Volver al carrito
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      disabled={!selectedAddress}
                      className="bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 text-white shadow-md"
                    >
                      Continuar al pago
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                </motion.div>
              )}

              {/* Step 2: Payment Methods */}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <PaymentMethods
                    amount={total}
                    description={`Orden de ${cartProducts.length} producto(s)`}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    disabled={!selectedAddress || isProcessingOrder}
                    userId={userProfile?.id ?? 0}
                  />

                  {/* Navigation buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 flex justify-between"
                  >
                    <Button
                      variant="outline"
                      onClick={handlePreviousStep}
                      disabled={isProcessingOrder}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Volver
                    </Button>
                  </motion.div>
                </motion.div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border-2 border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                    <CardHeader className="text-center pb-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                          delay: 0.2
                        }}
                        className="mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
                      >
                        <CheckCircle className="w-10 h-10 text-white" />
                      </motion.div>
                      <CardTitle className="text-3xl font-bold text-emerald-600 dark:text-emerald-500">
                        ¡Orden confirmada!
                      </CardTitle>
                      <CardDescription className="text-base mt-2">
                        Tu orden ha sido procesada exitosamente
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Order details */}
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700">
                            <Package className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Total de productos</p>
                            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{cartProducts.length} artículos</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700">
                            <MapPin className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Dirección de envío</p>
                            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{selectedAddress?.street}</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                          <div className="flex justify-between text-2xl font-bold">
                            <span className="text-slate-900 dark:text-slate-100">Total pagado:</span>
                            <span className="text-emerald-600 dark:text-emerald-500">
                              ${total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                        <p>Recibirás un correo de confirmación con los detalles de tu orden</p>
                        <p className="mt-2">Redirigiendo en unos segundos...</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right column - Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-4">
              <OrderSummary
                cartItems={cartProducts}
                subtotal={subtotal}
                shipping={shipping}
                taxes={taxes}
                total={total}
                isProcessing={isProcessingOrder}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}