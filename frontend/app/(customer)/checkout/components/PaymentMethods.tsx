"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Wallet, Building, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import WompiContractsAcceptance from "./WompiContractsAcceptance";
import WompiCardForm from "./CardForm";
import WompiPSEForm from "./PseForm";
import NequiForm from "./NequiForm";

import type { Address } from "../../(addresses)/services/addressesApi";

interface PaymentMethodsProps {
  amount: number;
  description: string;
  userId?: number;
  onPaymentSuccess: (paymentId: string, paymentMethod: string) => void;
  onPaymentError: (error: Error) => void;
  disabled?: boolean;
  selectedAddress?: Address | null;
}

type PaymentMethod = "credit_card" | "pse" | "nequi";

export const PaymentMethods = ({
  amount,
  description,
  onPaymentSuccess,
  onPaymentError,
  disabled,
  userId,
  selectedAddress,
}: PaymentMethodsProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("credit_card");
  const [contractsAccepted, setContractsAccepted] = useState(false);
  const [acceptanceTokens, setAcceptanceTokens] = useState<{
    termsAndConditions: string;
    personalDataAuth: string;
  }>({ termsAndConditions: "", personalDataAuth: "" });

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
      icon: Wallet,
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
    setAcceptanceTokens({
      termsAndConditions: tokens.termsAndConditions || "",
      personalDataAuth: tokens.personalDataAuth || "",
    });
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
            selectedAddress={selectedAddress}
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
            selectedAddress={selectedAddress}
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
            selectedAddress={selectedAddress}
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
                  className="absolute inset-0 rounded-2xl bg-linear-to-br from-violet-600 to-indigo-700 blur-xl"
                />
                <div className="relative w-full h-full rounded-2xl bg-linear-to-br from-violet-600 via-indigo-600 to-violet-700 flex items-center justify-center shadow-2xl shadow-violet-500/40">
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
                className="text-2xl font-bold mb-3 text-white"
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
                className="text-slate-400 mb-6"
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
                  className="px-4 py-1.5 bg-violet-600/20 backdrop-blur-sm border border-violet-500/30 text-violet-300 font-medium shadow-sm"
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
      className="relative space-y-8 p-8 rounded-3xl bg-slate-800/40 backdrop-blur-xl shadow-2xl border border-slate-700/50"
    >
      {/* Top animated border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-linear-to-r from-transparent via-violet-500/50 to-transparent rounded-t-3xl">
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="h-full w-1/3 bg-linear-to-r from-transparent via-violet-400 to-transparent blur-sm"
        />
      </div>

      {/* Header Section */}
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
                className="p-3 rounded-2xl bg-linear-to-br from-violet-600 via-violet-700 to-indigo-700 shadow-lg shadow-violet-500/30"
              >
                <ShieldCheck className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-3xl font-bold text-white">
                  Método de pago
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Transacciones seguras y protegidas
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative gradient line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="relative h-[2px] w-full max-w-md rounded-full overflow-hidden bg-slate-700/50"
        >
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-linear-to-r from-transparent via-violet-500 to-transparent"
          />
        </motion.div>
      </motion.div>

      <Tabs
        value={selectedPaymentMethod}
        onValueChange={(value) =>
          setSelectedPaymentMethod(value as PaymentMethod)
        }
      >
        <TabsList className="grid w-full p-1 grid-cols-2 lg:grid-cols-3 gap-3 h-auto  rounded-2xl border-none">
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
                className="rounded-xl"
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
                        y: -2,
                        scale: 1.01,
                        transition: { duration: 0.3, ease: "easeOut" },
                      }
                      : {}
                  }
                  whileTap={
                    !isDisabled
                      ? { scale: 0.98, transition: { duration: 0.15 } }
                      : {}
                  }
                  className={`
                    relative flex flex-col items-center justify-center p-4 py-3 h-auto 
                    transition-all duration-300 ease-out overflow-hidden
                    ${isSelected
                      ? "bg-linear-to-br from-violet-600/30 via-violet-700/30 to-indigo-700/30 shadow-lg shadow-violet-500/20 border border-violet-500/50"
                      : "bg-slate-700/30 hover:bg-slate-700/50 hover:shadow-lg hover:border-slate-600/70 border border-slate-600/50"
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
                        className="absolute inset-0 bg-linear-to-br from-violet-600/10 via-indigo-600/10 to-violet-700/10"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 35,
                        }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Icon with gradient background */}
                  <motion.div
                    animate={
                      isSelected
                        ? { scale: [1, 1.08, 1] }
                        : { scale: 1 }
                    }
                    transition={{
                      duration: 0.6,
                      ease: "easeInOut"
                    }}
                    className="relative mb-2 z-10"
                  >
                    <div className={`
                      p-3 rounded-xl transition-all duration-300 relative
                      ${isSelected
                        ? "bg-linear-to-br from-violet-600 via-indigo-700 to-purple-700 "
                        : "bg-slate-700/50"
                      }
                    `}>
                      {isSelected && (
                        <motion.div
                          className="absolute inset-0 rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 blur-md opacity-50"

                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                      <IconComponent
                        className={`w-6 h-6 transition-all duration-300 relative z-10 ${isSelected
                          ? "text-slate-200 drop-shadow-lg"
                          : "text-slate-400"
                          }`}
                      />
                    </div>
                  </motion.div>

                  {/* Method name */}
                  <motion.span
                    animate={
                      isSelected
                        ? { scale: [1, 1.03, 1] }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.3 }}
                    className={`text-sm font-semibold text-center leading-tight transition-all duration-300 relative z-10 ${isSelected
                      ? "text-white"
                      : "text-slate-300"
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
                        className="relative z-10 mt-2"
                      >
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-2.5 py-0.5 bg-violet-600/20 backdrop-blur-sm border border-violet-500/30 text-violet-300 font-medium shadow-sm"
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
                        className="absolute -inset-0.5 rounded-xl bg-linear-to-br from-violet-600/30 via-indigo-600/30 to-violet-700/30 pointer-events-none blur-lg"
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
                <div className="mb-2 mt-10 text-center space-y-2">
                  <h1 className="text-3xl font-bold text-white">Información de Pago</h1>
                  <p className="text-slate-400">Completa los datos de forma segura</p>
                </div>

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
