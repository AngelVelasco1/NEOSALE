"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Wallet2Icon, Building, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import WompiContractsAcceptance from "./WompiContractsAcceptance";
import WompiCardForm from "./CardForm";
import WompiPSEForm from "./PseForm";
import NequiForm from "./NequiForm";

interface PaymentMethodsProps {
  amount: number;
  description: string;
  userId?: number;
  onPaymentSuccess: (paymentId: string, paymentMethod: string) => void;
  onPaymentError: (error: Error) => void;
  disabled?: boolean;
}

type PaymentMethod = "credit_card" | "pse" | "nequi";

export const PaymentMethods = ({
  amount,
  description,
  onPaymentSuccess,
  onPaymentError,
  disabled,
  userId,
}: PaymentMethodsProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("credit_card");
  const [contractsAccepted, setContractsAccepted] = useState(false);
  const [acceptanceTokens, setAcceptanceTokens] = useState<{
    [key: string]: string;
  }>({});

  const paymentMethods = [
    {
      id: "credit_card" as PaymentMethod,
      name: "Tarjeta de Crédito/Débito",
      description: "Visa, Mastercard, American Express",
      icon: CreditCard,
      available: true,
      comingSoon: false,
    },
    {
      id: "pse" as PaymentMethod,
      name: "PSE",
      description: "Pagos Seguros en Línea",
      icon: Building,
      available: true,
      comingSoon: false,
    },
    {
      id: "nequi" as PaymentMethod,
      name: "Nequi",
      description: "Paga de forma segura con Nequi",
      icon: Wallet2Icon,
      available: true,
      comingSoon: false,
    }
  ];

  const handlePaymentSuccess = (paymentId: string) => {
    onPaymentSuccess(paymentId, selectedPaymentMethod);
  };

  const handleContractsAcceptance = (
    allAccepted: boolean,
    tokens: { [key: string]: string }
  ) => {
    setContractsAccepted(allAccepted);
    setAcceptanceTokens(tokens);

  };

  const renderPaymentForm = () => {
    switch (selectedPaymentMethod) {
      case "credit_card":
        return (
          <WompiCardForm
            amount={amount}
            description={description}
            onSuccess={handlePaymentSuccess}
            onError={onPaymentError}
            disabled={disabled || !contractsAccepted}
            userId={userId || 0}
            acceptanceTokens={acceptanceTokens}
          />
        );

      case "pse":
        return (
          <WompiPSEForm
            amount={amount}
            description={description}
            onSuccess={handlePaymentSuccess}
            onError={onPaymentError}
            disabled={disabled || !contractsAccepted}
            userId={userId || 0}
            acceptanceTokens={acceptanceTokens}
          />
        );
      case "nequi":
        return (
          <NequiForm
            amount={amount}
            description={description}
            onSuccess={handlePaymentSuccess}
            onError={onPaymentError}
            disabled={disabled || !contractsAccepted}
            userId={userId || 0}
            acceptanceTokens={acceptanceTokens}
          />
        );

      default:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg mx-auto py-12"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.2
                }}
                className="relative w-24 h-24 mx-auto mb-6"
              >
                {/* Animated rings */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.2, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 blur-xl"
                />
                <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-purple-500/40">
                  {paymentMethods.find((m) => m.id === selectedPaymentMethod)
                    ?.icon &&
                    React.createElement(
                      paymentMethods.find(
                        (m) => m.id === selectedPaymentMethod
                      )!.icon,
                      { className: "w-12 h-12 text-white drop-shadow-lg" }
                    )}
                </div>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
              >
                {
                  paymentMethods.find((m) => m.id === selectedPaymentMethod)
                    ?.name
                }
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground/80 mb-6"
              >
                Este método de pago estará disponible próximamente.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Badge
                  variant="secondary"
                  className="px-4 py-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 ring-1 ring-purple-500/20 text-purple-600 dark:text-purple-400 font-medium shadow-sm"
                >
                  Próximamente disponible
                </Badge>
              </motion.div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative space-y-8 p-8 rounded-3xl bg-gradient-to-br from-card via-card to-card/50 shadow-xl shadow-blue-500/10 ring-1 ring-purple-500/10 backdrop-blur-sm  border-none"
    >
      {/* Decorative top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-t-3xl" />

      {/* Decorative corner accents */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl" />
      <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 rounded-full blur-2xl" />

      {/* Header Section with Enhanced Design */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className="relative"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.2
                }}
                className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 ring-2 ring-blue-400/20"
              >
                <ShieldCheck className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600/90 via-indigo-600 to-blue-600/90 bg-clip-text text-transparent">
                  Método de pago
                </h2>
                <p className="text-md text-muted-foreground/70 mt-1">
                  Transacciones seguras y protegidas
                </p>
              </div>
            </div>


          </div>
        </div>

        {/* Enhanced decorative gradient line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="relative h-1 w-full max-w-md rounded-full overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </motion.div>
      </motion.div>

      <Tabs
        value={selectedPaymentMethod}
        onValueChange={(value) =>
          setSelectedPaymentMethod(value as PaymentMethod)
        }
      >
        <TabsList className="grid w-full p-4 grid-cols-2 lg:grid-cols-3 gap-6 h-auto bg-transparent">
          {paymentMethods.map((method, index) => {
            const IconComponent = method.icon;
            const isSelected = selectedPaymentMethod === method.id;
            const isDisabled = !method.available || disabled;

            return (
              <TabsTrigger
                key={method.id}
                value={method.id}
                disabled={isDisabled}
                asChild
                className="rounded-2xl"
              >
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1 + 0.2,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  whileHover={
                    !isDisabled
                      ? {
                        y: -3,
                        scale: 1.02,
                        transition: { duration: 0.3, ease: "easeOut" },
                      }
                      : {}
                  }
                  whileTap={
                    !isDisabled
                      ? { scale: 0.97, transition: { duration: 0.15 } }
                      : {}
                  }
                  className={`
                    relative flex flex-col items-center justify-center py-3 h-auto 
                    transition-all duration-300 ease-out overflow-hidden
                    ${isSelected
                      ? "bg-gradient-to-br from-blue-500/25 via-blue-500/35 to-indigo-600/35 shadow-xl shadow-indigo-500/30 ring-2 ring-indigo-500/50"
                      : "bg-gradient-to-br from-card/80 to-card/40 hover:from-blue-500/5 hover:to-purple-500/5 hover:shadow-xl hover:shadow-purple-500/15 hover:ring-2 hover:ring-purple-400/30"
                    }
                    ${isDisabled
                      ? "opacity-40 cursor-not-allowed"
                      : "cursor-pointer"
                    }
                  `}
                >
                  {/* Animated gradient background */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        layoutId="selectedBackground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-indigo-500/8 to-indigo-600/8"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 35,
                        }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Shimmer effect on hover */}
                  {!isDisabled && (
                    <motion.div
                      className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(147, 51, 234, 0.1), transparent)',
                      }}
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    />
                  )}

                  {/* Icon with gradient background */}
                  <motion.div
                    animate={
                      isSelected
                        ? {
                          scale: [1, 1.10, 1],
                        }
                        : { scale: 1, rotate: 0 }
                    }
                    transition={{
                      duration: 0.6,
                      ease: "easeInOut"
                    }}
                    className="relative mb-2 z-10 px-10"
                  >
                    <div className={`
                      p-3.5 rounded-2xl transition-all duration-300 relative
                      ${isSelected
                        ? "bg-gradient-to-br from-blue-500 via-blue-500 to-indigo-600 shadow-xl shadow-indigo-500/40"
                        : "bg-muted/80"
                      }
                    `}>
                      {/* Icon glow effect */}
                      {isSelected && (
                        <motion.div
                          className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 blur-md opacity-50"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.7, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                      <IconComponent
                        className={`w-6 h-6 transition-all duration-300 relative z-10 ${isSelected
                          ? "text-white drop-shadow-lg"
                          : "text-muted-foreground"
                          }`}
                      />
                    </div>
                  </motion.div>

                  {/* Method name */}
                  <motion.span
                    animate={
                      isSelected
                        ? { scale: [1, 1.05, 1] }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.3 }}
                    className={`text-sm font-semibold text-center leading-tight transition-all duration-300 relative z-10 ${isSelected
                      ? "bg-gradient-to-r from-white via-white to-slate-100 bg-clip-text text-transparent"
                      : "text-foreground"
                      }`}
                  >
                    {method.name}
                  </motion.span>

                  {/* Coming soon badge */}
                  <AnimatePresence>
                    {method.comingSoon && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className="relative z-10 mt-2.5"
                      >
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-2.5 py-0.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 ring-1 ring-purple-500/20 text-purple-600 dark:text-purple-400 font-medium shadow-sm"
                        >
                          Próximamente
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Active glow effect */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        layoutId="activeGlow"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-blue-500/30 via-indigo-500/30 to-indigo-600/30 pointer-events-none blur-xl"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 35,
                        }}
                      />
                    )}
                  </AnimatePresence>
                </motion.button>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedPaymentMethod}
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {paymentMethods.map((method) => (
              <TabsContent key={method.id} value={method.id} className="mt-0">
                {/* Method Header Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mb-6 p-6 rounded-3xl bg-gradient-to-br from-blue-500/8 via-purple-500/8 to-transparent backdrop-blur-sm shadow-lg shadow-purple-500/5 ring-1 ring-purple-500/10"
                >
                  <div className="flex items-center gap-3 mb-2">

                    <h3 className="font-bold text-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                      {method.name}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground/80 ml-1">
                    {method.description}
                  </p>
                </motion.div>

                {/* Payment Form */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  {renderPaymentForm()}
                </motion.div>
              </TabsContent>
            ))}
          </motion.div>
        </AnimatePresence>
      </Tabs>

      {/* Contracts Acceptance Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <WompiContractsAcceptance
          onAcceptanceChange={handleContractsAcceptance}
          disabled={disabled}
        />
      </motion.div>
    </motion.div>
  );
};
