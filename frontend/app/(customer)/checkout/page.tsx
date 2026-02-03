"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
import { useSendOrderEmail } from "../hooks/useSendOrderEmail";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ShoppingCart,
  MapPin,
  CreditCard,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Package,
  Sparkles
} from "lucide-react";
import { useUserSafe } from "@/app/(auth)/hooks/useUserSafe";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
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
  const { sendOrderEmailSilently } = useSendOrderEmail();

  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const { userProfile } = useUserSafe();

  // Step management
  const [currentStep, setCurrentStep] = useState(1);

  // Verificar email verificado - solo cuando userProfile esté cargado
  useEffect(() => {
    // Esperar a que userProfile esté cargado y sea definitivo
    if (!userProfile) return;
    
    // Si el usuario tiene sesión pero su email NO está verificado (es null)
    if (session?.user && userProfile.emailVerified === null) {
      toast.error('Debes verificar tu email antes de realizar compras', {
        description: 'Revisa tu bandeja de entrada y verifica tu email.',
        duration: 5000,
      });
      router.push('/');
    }
      
  }, [session, userProfile, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.replace("/login");
      return;
    }
  }, [isInitializing, isAuthenticated, router]);

  useEffect(() => {
    // Solo mostrar error de carrito vacío cuando:
    // 1. La inicialización haya terminado
    // 2. El carrito haya terminado de cargar
    // 3. Y esté realmente vacío
    if (!isInitializing && !cartLoading && (!cartProducts || cartProducts.length === 0)) {
      ErrorsHandler.showError(
        "Carrito vacío",
        "No hay productos en tu carrito"
      );
      router.push("/productsCart");
    }
  }, [cartProducts, isInitializing, cartLoading, router]);


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
    async (paymentId: string) => {
      setIsProcessingOrder(true);

      try {
        if (!selectedAddress) {
          throw new Error("Debes seleccionar una dirección de envío");
        }

        if (!selectedAddress.id) {
          throw new Error("La dirección seleccionada no es válida");
        }

        const orderData = {
          paymentId: paymentId,
          shippingAddressId: selectedAddress.id,
          couponId: undefined,
        };

        const order = await createOrderApi(orderData);

        await clearCart();

        // Enviar email de confirmación de orden
        sendOrderEmailSilently({
          orderId: (order.order_id || order.id || '').toString(),
          items: cartProducts?.map((item) => ({
            productName: item.name || 'Producto',
            quantity: item.quantity || 1,
            price: item.price || 0,
          })) || [],
          subtotal: subtotal || 0,
          shipping: shipping || 0,
          taxes: taxes || 0,
          discount: 0,
          total: total || 0,
          shippingAddress: {
            street: selectedAddress.address || '',
            city: selectedAddress.city || '',
            state: selectedAddress.department || '',
            zipCode: '000000',
            country: selectedAddress.country || 'Colombia',
          },
        }).catch((err) => {
          console.warn('Email de confirmación no enviado:', err);
        });

        setCurrentStep(3);

        ErrorsHandler.showSuccess(
          "¡Orden completada!",
          `Tu orden #${order.order_id || order.id} ha sido procesada exitosamente`
        );

        setTimeout(() => {
          router.push(`/orders/${order.order_id || order.id}`);
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
      sendOrderEmailSilently,
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
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-16 h-16 mx-auto mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl"
            />
          </div>
          <p className="text-slate-300 font-semibold text-lg">
            Cargando información del checkout...
          </p>
        </motion.div>
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
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-linear-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-slate-700/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-slate-100">Error</CardTitle>
            <CardDescription className="text-slate-400">
              No pudimos cargar la información necesaria para el checkout
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-400">{error}</p>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => fetchData()}
              className="border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-slate-300"
            >
              Reintentar
            </Button>
            <Button
              onClick={() => router.push("/productsCart")}
              className="text-white"
              style={{
                backgroundImage: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              Volver al carrito
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-linear-to-br from-indigo-500/10 to-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-linear-to-br from-blue-500/10 to-slate-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header with progress */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12"
        >
          <div className="flex items-center gap-5 mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.1
              }}
              className="relative p-5 rounded-2xl bg-linear-to-br from-purple-700 via-indigo-600 to-indigo-700 shadow-2xl shadow-indigo-500/40"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 rounded-2xl bg-linear-to-br from-indigo-400 to-blue-400 blur-xl"
              />
              <ShoppingCart className="w-8 h-8 text-white relative z-10" />
            </motion.div>
            <div>
              <h1 className="text-5xl font-extrabold bg-linear-to-r from-slate-100 via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                Finalizar compra
              </h1>
              <p className="text-slate-400 mt-2 text-lg flex items-center gap-2">
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
            <div className="flex items-center justify-between max-w-4xl mx-auto">
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
                            w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 relative
                            ${step.completed
                              ? 'bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-600 shadow-2xl shadow-emerald-500/40'
                              : step.active
                                ? 'bg-linear-to-br from-indigo-600 via-purple-600 to-indigo-700 shadow-2xl shadow-indigo-500/40'
                                : 'bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50'
                            }
                          `}
                        >
                          {(step.active || step.completed) && (
                            <motion.div
                              animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.4, 0.2, 0.4],
                              }}
                              transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              className={`absolute inset-0 rounded-2xl blur-xl ${step.completed
                                ? 'bg-linear-to-br from-emerald-400 to-cyan-500'
                                : 'bg-linear-to-br from-indigo-500 to-purple-500'
                                }`}
                            />
                          )}

                          <StepIcon
                            className={`w-8 h-8 relative z-10 transition-colors ${step.completed || step.active
                              ? 'text-white'
                              : 'text-slate-400'
                              }`}
                          />
                        </div>

                        <motion.div
                          className={`
                            absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-lg
                            ${step.completed
                              ? 'bg-linear-to-br from-emerald-400 to-teal-500 text-white'
                              : step.active
                                ? 'bg-linear-to-br from-indigo-500 to-purple-600 text-white'
                                : 'bg-slate-700 text-slate-300 border border-slate-700'
                            }
                          `}
                          whileHover={{ scale: 1.1 }}
                        >
                          {step.completed ? '✓' : step.number}
                        </motion.div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="mt-4 text-center"
                      >
                        <p
                          className={`text-sm font-bold transition-colors ${step.active
                            ? 'text-slate-100'
                            : step.completed
                              ? 'text-emerald-400'
                              : 'text-slate-400'
                            }`}
                        >
                          {step.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {step.description}
                        </p>
                      </motion.div>
                    </div>

                    {!isLast && (
                      <div className="flex-1 h-1 mx-6 mt-10 relative rounded-full overflow-hidden">
                        <div className="absolute inset-0 bg-slate-500/60" />
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{
                            scaleX: step.completed ? 1 : 0
                          }}
                          transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                          className="absolute inset-0 bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 origin-left"
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </motion.div>


        </motion.div>

        {/* Navigation buttons */}
        {
          currentStep === 1 ? (
            ""
          ) :
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-12 mb-6 flex justify-between"
            >
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                disabled={isProcessingOrder}
                className="bg-linear-to-br from-slate-800 to-slate-900 text-slate-100 border-slate-700/50 hover:border-slate-600 px-6 py-6 rounded-2xl text-sm font-semibold shadow-lg hover:shadow-slate-700/50 transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </motion.div>
        }
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
                    className="mt-8 flex justify-between gap-4"
                  >
                    <Button
                      variant="outline"
                      onClick={() => router.push("/productsCart")}
                      className="bg-linear-to-br from-slate-800 to-slate-900 text-slate-100 border-slate-700/50 hover:border-slate-600 px-6 py-6 rounded-2xl text-sm font-semibold shadow-lg hover:shadow-slate-700/50 transition-all"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Volver al carrito
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      disabled={!selectedAddress}
                      className="px-8 py-6 text-sm font-semibold rounded-2xl bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-600 text-white shadow-2xl shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                  <Card className="bg-linear-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-2 border-emerald-500/30 shadow-2xl shadow-emerald-500/20">
                    <CardHeader className="text-center pb-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                          delay: 0.2
                        }}
                        className="relative mx-auto mb-6 w-24 h-24 rounded-full bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-2xl shadow-emerald-500/50"
                      >
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="absolute inset-0 rounded-full bg-linear-to-br from-emerald-400 to-cyan-500 blur-xl"
                        />
                        <CheckCircle className="w-12 h-12 text-white relative z-10" />
                      </motion.div>
                      <CardTitle className="text-4xl font-extrabold bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                        ¡Orden confirmada!
                      </CardTitle>
                      <CardDescription className="text-slate-300 text-lg mt-3">
                        Tu orden ha sido procesada exitosamente
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Order details */}
                      <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 space-y-6 border border-slate-700/50">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-linear-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
                            <Package className="w-6 h-6 text-indigo-400" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-400 mb-1">Total de productos</p>
                            <p className="text-xl font-bold text-slate-100">{cartProducts.length} artículos</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-linear-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                            <MapPin className="w-6 h-6 text-cyan-400" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-400 mb-1">Dirección de envío</p>
                            <p className="text-xl font-bold text-slate-100">{selectedAddress?.address}</p>
                          </div>
                        </div>

                        <div className="pt-6 border-t border-slate-700/50">
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-slate-300">Total pagado:</span>
                            <span className="text-3xl font-extrabold bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                              ${total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-center space-y-3 py-4">
                        <p className="text-slate-300 flex items-center justify-center gap-2">
                          <Sparkles className="w-4 h-4 text-indigo-400" />
                          Recibirás un correo de confirmación con los detalles de tu orden
                        </p>
                        <motion.p
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-slate-400 text-sm"
                        >
                          Redirigiendo en unos segundos...
                        </motion.p>
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
