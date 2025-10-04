"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { CreditCard, Shield, Clock, MapPin } from "lucide-react";
import { ErrorsHandler } from "@/app/errors/errorsHandler";
import {
  getWompiPublicConfigApi,
  processWompiPaymentFlow,
  generatePaymentReference,
  WompiPublicConfig,
  WompiTransactionResponse,
} from "../services/paymentsApi";

interface WompiCardFormProps {
  amount: number;
  description: string;
  onSuccess: (transactionId: string) => void;
  onError: (error: Error) => void;
  disabled?: boolean;
  userId: number;
  acceptanceTokens: {
    termsAndConditions: string;
    personalDataAuth: string;
  };
}

const cardFormSchema = z.object({
  customerEmail: z.string().email("Ingrese un email válido"),
  customerName: z
    .string()
    .min(3, "Ingrese nombre completo")
    .max(50, "Nombre muy largo")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Solo se permiten letras y espacios"),
  customerPhone: z
    .string()
    .min(10, "Teléfono debe tener al menos 10 dígitos")
    .max(15, "Teléfono muy largo")
    .regex(/^[0-9+\s-()]+$/, "Formato de teléfono inválido"),
  customerDocument: z
    .string()
    .min(6, "Documento debe tener al menos 6 caracteres")
    .max(20, "Documento muy largo"),
  customerDocumentType: z.string().min(1, "Seleccione un tipo de documento"),
  // Campos de dirección de envío
  shippingLine1: z.string().min(5, "Ingrese la dirección principal"),
  shippingLine2: z.string().optional(),
  shippingCity: z.string().min(2, "Ingrese la ciudad"),
  shippingState: z.string().min(2, "Ingrese el departamento"),
  shippingCountry: z.string().min(2, "Seleccione el país"),
  shippingPostalCode: z.string().min(5, "Ingrese el código postal"),
  // 💳 NUEVOS CAMPOS DE TARJETA
  cardNumber: z
    .string()
    .min(13, "Número de tarjeta inválido")
    .max(19, "Número de tarjeta muy largo")
    .regex(/^[0-9\s]+$/, "Solo se permiten números"),
  cardCvc: z
    .string()
    .min(3, "CVC inválido")
    .max(4, "CVC muy largo")
    .regex(/^[0-9]+$/, "Solo se permiten números"),
  cardExpMonth: z
    .string()
    .length(2, "Mes inválido")
    .regex(/^(0[1-9]|1[0-2])$/, "Mes debe ser entre 01 y 12"),
  cardExpYear: z
    .string()
    .length(2, "Año inválido")
    .regex(/^[0-9]{2}$/, "Año debe ser 2 dígitos"),
  cardHolder: z
    .string()
    .min(3, "Nombre del titular requerido")
    .max(50, "Nombre muy largo")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Solo se permiten letras y espacios"),
  installments: z.number().min(1, "Mínimo 1 cuota").max(36, "Máximo 36 cuotas"),
});

type CardFormData = z.infer<typeof cardFormSchema>;

export const WompiCardForm: React.FC<WompiCardFormProps> = ({
  amount,
  description,
  onSuccess,
  onError,
  disabled = false,
  userId,
  acceptanceTokens,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [wompiConfig, setWompiConfig] = useState<WompiPublicConfig | null>(
    null
  );
  const [configLoading, setConfigLoading] = useState(true);

  const form = useForm<CardFormData>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      customerEmail: "",
      customerName: "",
      customerPhone: "",
      customerDocument: "",
      customerDocumentType: "CC",
      shippingLine1: "",
      shippingLine2: "",
      shippingCity: "",
      shippingState: "",
      shippingCountry: "CO",
      shippingPostalCode: "",
      // 💳 Valores por defecto de tarjeta
      cardNumber: "",
      cardCvc: "",
      cardExpMonth: "",
      cardExpYear: "",
      cardHolder: "",
      installments: 1,
    },
  });

  // 🎯 Cargar configuración de Wompi
  useEffect(() => {
    const loadWompiConfig = async () => {
      try {
        setConfigLoading(true);
        console.log("📡 Cargando configuración de Wompi...");

        const result = await getWompiPublicConfigApi();

        if (result.success && result.data) {
          setWompiConfig(result.data);
          console.log("✅ Configuración de Wompi cargada:", {
            publicKey: result.data.publicKey.substring(0, 20) + "...",
            environment: result.data.environment,
          });
        } else {
          throw new Error(result.error || "Error obteniendo configuración");
        }
      } catch (error) {
        console.error("❌ Error cargando configuración de Wompi:", error);
        ErrorsHandler.showError(
          "Error de configuración",
          "No se pudo cargar la configuración de pagos"
        );
      } finally {
        setConfigLoading(false);
      }
    };

    loadWompiConfig();
  }, []);

  // 🎯 Manejar envío del formulario
  const onSubmit = async (data: CardFormData) => {
    if (!wompiConfig) {
      ErrorsHandler.showError("Error", "Configuración de pagos no disponible");
      return;
    }

    // Verificar que se tengan tokens de aceptación
    if (
      !acceptanceTokens.termsAndConditions ||
      !acceptanceTokens.personalDataAuth
    ) {
      ErrorsHandler.showError(
        "Términos requeridos",
        "Debes aceptar los términos y condiciones para continuar"
      );
      return;
    }

    setIsProcessing(true);

    try {
      console.log("💳 Iniciando flujo completo de pago con Wompi...", {
        amount,
        customerEmail: data.customerEmail,
        hasTokens: Object.keys(acceptanceTokens).length > 0,
        reference: generatePaymentReference(userId),
      });

      // Preparar datos del cliente
      const customerData = {
        email: data.customerEmail,
        name: data.customerName,
        phone: data.customerPhone,
        documentType: data.customerDocumentType,
        documentNumber: data.customerDocument,
        shippingAddress: {
          line1: data.shippingLine1,
          line2: data.shippingLine2 || "",
          city: data.shippingCity,
          state: data.shippingState,
          country: data.shippingCountry,
          postalCode: data.shippingPostalCode,
          name: data.customerName, // Usar el nombre del cliente como receptor
        },
      };

      // Preparar datos de la orden
      const orderData = {
        amount: amount,
        currency: "COP",
        userId: userId,
        description: description,
      };

      // 💳 Preparar datos de tarjeta para tokenización
      const cardData = {
        number: data.cardNumber.replace(/\s/g, ""), // Remover espacios
        cvc: data.cardCvc,
        exp_month: data.cardExpMonth,
        exp_year: data.cardExpYear,
        card_holder: data.cardHolder,
        installments: data.installments,
      };

      // Ejecutar el flujo completo de pago CON TARJETA
      const result: WompiTransactionResponse = await processWompiPaymentFlow(
        customerData,
        orderData,
        {
          acceptanceToken: acceptanceTokens.termsAndConditions,
          acceptPersonalAuth: acceptanceTokens.personalDataAuth,
        },
        cardData // 💳 Pasamos los datos de tarjeta
      );

      if (result.success && result.data) {
        console.log("✅ Transacción creada exitosamente:", {
          transactionId: result.data.transactionId,
          status: result.data.status,
          reference: result.data.reference,
        });

        // Si tenemos checkout URL, redirigir al widget de Wompi
        if (result.data.checkoutUrl) {
          console.log("🔗 Redirigiendo al checkout de Wompi...");
          window.location.href = result.data.checkoutUrl;
        } else {
          // Si no hay URL de checkout, consideramos el pago como exitoso
          onSuccess(result.data.transactionId);
        }
      } else {
        throw new Error(result.error || "Error creando transacción");
      }
    } catch (error) {
      console.error("❌ Error procesando pago:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error desconocido procesando el pago";

      ErrorsHandler.showError("Error de pago", errorMessage);
      onError(new Error(errorMessage));
    } finally {
      setIsProcessing(false);
    }
  };

  const documentTypes = [
    { value: "CC", label: "Cédula de Ciudadanía" },
    { value: "CE", label: "Cédula de Extranjería" },
    { value: "NIT", label: "NIT" },
    { value: "PP", label: "Pasaporte" },
  ];

  const colombianStates = [
    "Amazonas",
    "Antioquia",
    "Arauca",
    "Atlántico",
    "Bolívar",
    "Boyacá",
    "Caldas",
    "Caquetá",
    "Casanare",
    "Cauca",
    "Cesar",
    "Chocó",
    "Córdoba",
    "Cundinamarca",
    "Guainía",
    "Guaviare",
    "Huila",
    "La Guajira",
    "Magdalena",
    "Meta",
    "Nariño",
    "Norte de Santander",
    "Putumayo",
    "Quindío",
    "Risaralda",
    "San Andrés y Providencia",
    "Santander",
    "Sucre",
    "Tolima",
    "Valle del Cauca",
    "Vaupés",
    "Vichada",
    "Bogotá D.C.",
  ];

  if (configLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span>Cargando configuración de pagos...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Pago con Tarjeta de Crédito/Débito
        </CardTitle>
        <CardDescription>
          Completa la información para procesar tu pago de forma segura con
          Wompi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Información personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Información personal</h3>

              {/* Email */}
              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="tu@email.com"
                        disabled={disabled || isProcessing}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nombre completo */}
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Juan Pérez"
                        disabled={disabled || isProcessing}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Teléfono */}
              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono *</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+57 300 123 4567"
                        disabled={disabled || isProcessing}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tipo de documento y número */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerDocumentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de documento *</FormLabel>
                      <FormControl>
                        <select
                          className="w-full p-2 border rounded-md"
                          disabled={disabled || isProcessing}
                          {...field}
                        >
                          {documentTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerDocument"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de documento *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="12345678"
                          disabled={disabled || isProcessing}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Dirección de envío */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Dirección de envío
              </h3>

              <FormField
                control={form.control}
                name="shippingLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección principal *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Calle 123 # 45-67"
                        disabled={disabled || isProcessing}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shippingLine2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Apartamento 101, Torre 2"
                        disabled={disabled || isProcessing}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="shippingCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Bogotá"
                          disabled={disabled || isProcessing}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shippingState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departamento *</FormLabel>
                      <FormControl>
                        <select
                          className="w-full p-2 border rounded-md"
                          disabled={disabled || isProcessing}
                          {...field}
                        >
                          <option value="">Seleccionar departamento</option>
                          {colombianStates.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="shippingPostalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código postal *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="110111"
                        disabled={disabled || isProcessing}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 💳 NUEVA SECCIÓN: Información de tarjeta */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Información de tarjeta
              </h3>

              {/* Número de tarjeta */}
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de tarjeta *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="4242 4242 4242 4242"
                        disabled={disabled || isProcessing}
                        {...field}
                        onChange={(e) => {
                          // Formatear número de tarjeta con espacios
                          const value = e.target.value.replace(/\s/g, "");
                          const formattedValue = value
                            .replace(/(.{4})/g, "$1 ")
                            .trim();
                          field.onChange(formattedValue);
                        }}
                        maxLength={19}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Titular de la tarjeta */}
              <FormField
                control={form.control}
                name="cardHolder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titular de la tarjeta *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="JUAN PÉREZ"
                        disabled={disabled || isProcessing}
                        {...field}
                        onChange={(e) => {
                          // Convertir a mayúsculas
                          field.onChange(e.target.value.toUpperCase());
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fecha de expiración y CVC */}
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="cardExpMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mes *</FormLabel>
                      <FormControl>
                        <select
                          className="w-full p-2 border rounded-md"
                          disabled={disabled || isProcessing}
                          {...field}
                        >
                          <option value="">MM</option>
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = (i + 1).toString().padStart(2, "0");
                            return (
                              <option key={month} value={month}>
                                {month}
                              </option>
                            );
                          })}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cardExpYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Año *</FormLabel>
                      <FormControl>
                        <select
                          className="w-full p-2 border rounded-md"
                          disabled={disabled || isProcessing}
                          {...field}
                        >
                          <option value="">AA</option>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = (new Date().getFullYear() + i)
                              .toString()
                              .slice(-2);
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            );
                          })}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cardCvc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVC *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123"
                          type="password"
                          maxLength={4}
                          disabled={disabled || isProcessing}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Número de cuotas */}
              <FormField
                control={form.control}
                name="installments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de cuotas *</FormLabel>
                    <FormControl>
                      <select
                        className="w-full p-2 border rounded-md"
                        disabled={disabled || isProcessing}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      >
                        {Array.from({ length: 36 }, (_, i) => {
                          const installments = i + 1;
                          return (
                            <option key={installments} value={installments}>
                              {installments} cuota{installments > 1 ? "s" : ""}
                            </option>
                          );
                        })}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Información de seguridad */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <Shield className="w-4 h-4" />
                  <span>
                    Tu información de tarjeta es procesada de forma segura y
                    nunca es almacenada en nuestros servidores.
                  </span>
                </div>
              </div>
            </div>

            {/* Información del pago */}
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Total a pagar:
                </span>
                <span className="text-lg font-semibold">
                  $
                  {amount.toLocaleString("es-CO", { minimumFractionDigits: 0 })}{" "}
                  COP
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Pago seguro procesado por Wompi</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Serás redirigido al formulario de pago seguro</span>
              </div>
            </div>

            {/* Botón de pago */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={
                disabled ||
                isProcessing ||
                !wompiConfig ||
                !acceptanceTokens.termsAndConditions ||
                !acceptanceTokens.personalDataAuth
              }
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Procesando pago...
                </>
              ) : (
                `Continuar con el pago - $${amount.toLocaleString("es-CO", {
                  minimumFractionDigits: 0,
                })} COP`
              )}
            </Button>

            {/* Estado de contratos */}
            {(!acceptanceTokens.termsAndConditions ||
              !acceptanceTokens.personalDataAuth) && (
              <div className="text-center text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                ⚠️ Debes aceptar los términos y condiciones antes de continuar
              </div>
            )}

            {/* Información adicional */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• El pago se procesará en pesos colombianos (COP)</p>
              <p>
                • Serás redirigido al formulario seguro de Wompi para completar
                el pago
              </p>
              <p>• Todos los datos están protegidos con cifrado SSL</p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default WompiCardForm;
