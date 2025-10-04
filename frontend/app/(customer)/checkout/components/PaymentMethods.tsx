"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Wallet, Building2, DollarSign } from "lucide-react";
import WompiContractsAcceptance from "./WompiContractsAcceptance";
import WompiCardForm from "./WompiCardForm";

interface PaymentMethodsProps {
  amount: number;
  description: string;
  userId?: number;
  onPaymentSuccess: (paymentId: string, paymentMethod: string) => void;
  onPaymentError: (error: Error) => void;
  disabled?: boolean;
}

type PaymentMethod = "credit_card" | "paypal" | "pse" | "efecty";

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
      id: "paypal" as PaymentMethod,
      name: "PayPal",
      description: "Paga de forma segura con PayPal",
      icon: Wallet,
      available: false,
      comingSoon: true,
    },
    {
      id: "pse" as PaymentMethod,
      name: "PSE",
      description: "Pagos Seguros en Línea",
      icon: Building2,
      available: false,
      comingSoon: true,
    },
    {
      id: "efecty" as PaymentMethod,
      name: "Efecty",
      description: "Pago en efectivo en puntos Efecty",
      icon: DollarSign,
      available: false,
      comingSoon: true,
    },
  ];

  const handlePaymentSuccess = (paymentId: string) => {
    onPaymentSuccess(paymentId, selectedPaymentMethod);
  };

  // 🎯 Manejar aceptación de contratos Wompi
  const handleContractsAcceptance = (
    allAccepted: boolean,
    tokens: { [key: string]: string }
  ) => {
    setContractsAccepted(allAccepted);
    setAcceptanceTokens(tokens);
    console.log(
      "📋 Contratos aceptados:",
      allAccepted,
      "Tokens:",
      Object.keys(tokens)
    );
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

      default:
        return (
          <Card className="w-full max-w-lg mx-auto">
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                <div className="w-16 h-16 mx-auto mb-4 opacity-50 flex items-center justify-center">
                  {paymentMethods.find((m) => m.id === selectedPaymentMethod)
                    ?.icon &&
                    React.createElement(
                      paymentMethods.find(
                        (m) => m.id === selectedPaymentMethod
                      )!.icon,
                      { className: "w-16 h-16" }
                    )}
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {
                    paymentMethods.find((m) => m.id === selectedPaymentMethod)
                      ?.name
                  }
                </h3>
                <p>Este método de pago estará disponible próximamente.</p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 🎯 PASO 3: Aceptación de contratos Wompi */}
      <WompiContractsAcceptance
        onAcceptanceChange={handleContractsAcceptance}
        disabled={disabled}
      />

      <Card>
        <CardHeader>
          <CardTitle>Método de pago</CardTitle>
          <CardDescription>
            Selecciona cómo quieres pagar tu pedido
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={selectedPaymentMethod}
            onValueChange={(value) =>
              setSelectedPaymentMethod(value as PaymentMethod)
            }
          >
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2 h-auto p-1">
              {paymentMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <TabsTrigger
                    key={method.id}
                    value={method.id}
                    disabled={!method.available || disabled}
                    className="flex flex-col items-center p-3 h-auto data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <IconComponent className="w-6 h-6 mb-1" />
                    <span className="text-xs text-center leading-tight">
                      {method.name}
                    </span>
                    {method.comingSoon && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        Próximamente
                      </Badge>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="mt-6">
              {paymentMethods.map((method) => (
                <TabsContent key={method.id} value={method.id} className="mt-0">
                  <div className="mb-4">
                    <h3 className="font-medium">{method.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {method.description}
                    </p>
                  </div>
                  {renderPaymentForm()}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
