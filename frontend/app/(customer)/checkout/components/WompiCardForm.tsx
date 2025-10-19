"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { CreditCard, Shield, Clock, MapPin, User } from "lucide-react"
import { ErrorsHandler } from "@/app/errors/errorsHandler"
import { useCart } from "../../(cart)/hooks/useCart"
import type { CartProductsInfo } from "../../types"
import {
  getWompiPublicConfigApi,
  processWompiPaymentFlow,
  generatePaymentReference,
  getWompiTransactionStatusApi,
  type WompiPublicConfig,
  type WompiTransactionResponse,
} from "../services/paymentsApi"

interface WompiCardFormProps {
  amount: number
  description: string
  onSuccess: (transactionId: string) => void
  onError: (error: Error) => void
  disabled?: boolean
  userId: number
  acceptanceTokens: {
    termsAndConditions: string
    personalDataAuth: string
  }
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
  customerDocument: z.string().min(6, "Documento debe tener al menos 6 caracteres").max(20, "Documento muy largo"),
  customerDocumentType: z.string().min(1, "Seleccione un tipo de documento"),
  shippingLine1: z.string().min(5, "Ingrese la dirección principal"),
  shippingLine2: z.string().optional(),
  shippingCity: z.string().min(2, "Ingrese la ciudad"),
  shippingState: z.string().min(2, "Ingrese el departamento"),
  shippingCountry: z.string().min(2, "Seleccione el país"),
  shippingPostalCode: z.string().min(5, "Ingrese el código postal"),
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
})

type CardFormData = z.infer<typeof cardFormSchema>

export const WompiCardForm: React.FC<WompiCardFormProps> = ({
  amount,
  description,
  onSuccess,
  onError,
  disabled = false,
  userId,
  acceptanceTokens,
}) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [wompiConfig, setWompiConfig] = useState<WompiPublicConfig | null>(null)
  const { cartProducts } = useCart()
  const [configLoading, setConfigLoading] = useState(true)

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
      cardNumber: "",
      cardCvc: "",
      cardExpMonth: "",
      cardExpYear: "",
      cardHolder: "",
      installments: 1,
    },
  })

  useEffect(() => {
    const loadWompiConfig = async () => {
      try {
        setConfigLoading(true)

        const result = await getWompiPublicConfigApi()

        if (result.success && result.data) {
          setWompiConfig(result.data)
        } else {
          throw new Error(result.error || "Error obteniendo configuración")
        }
      } catch (error) {
        console.error("Error cargando configuración de Wompi:", error)
        ErrorsHandler.showError("Error de configuración", "No se pudo cargar la configuración de pagos")
      } finally {
        setConfigLoading(false)
      }
    }

    loadWompiConfig()
  }, [])

  const onSubmit = async (data: CardFormData) => {
    if (!wompiConfig) {
      ErrorsHandler.showError("Error", "Configuración de pagos no disponible")
      return
    }

    if (!acceptanceTokens.termsAndConditions || !acceptanceTokens.personalDataAuth) {
      ErrorsHandler.showError("Términos requeridos", "Debes aceptar los términos y condiciones para continuar")
      return
    }

    setIsProcessing(true)

    try {
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
          name: data.customerName,
        },
      }

      const orderData = {
        amount: amount,
        currency: "COP",
        userId: userId,
        description: description,
      }

      const cardData = {
        number: data.cardNumber.replace(/\s/g, ""),
        cvc: data.cardCvc,
        exp_month: data.cardExpMonth,
        exp_year: data.cardExpYear,
        card_holder: data.cardHolder,
        installments: data.installments,
      }

      const cartData =
        cartProducts?.map((product: CartProductsInfo) => ({
          product_id: product.id,
          quantity: product.quantity,
          price: product.price,
          name: product.name || product.title,
          color_code: product.color_code || "",
          size: product.size || "",
        })) || []

      const result: WompiTransactionResponse = await processWompiPaymentFlow(
        customerData,
        orderData,
        {
          acceptanceToken: acceptanceTokens.termsAndConditions,
          acceptPersonalAuth: acceptanceTokens.personalDataAuth,
        },
        cardData,
        cartData,
      )

      if (result.success && result.data) {
        console.log("✅ Transacción creada exitosamente:", {
          transactionId: result.data.transactionId,
          status: result.data.status,
          reference: result.data.reference,
        })

        try {
          await new Promise((resolve) => setTimeout(resolve, 3000))

          const transactionStatus = await getWompiTransactionStatusApi(result.data.transactionId)

          if (transactionStatus.success && transactionStatus.data) {
            console.log("📊 Estado real de la transacción:", {
              transactionId: result.data.transactionId,
              realStatus: transactionStatus.data.status,
              amount: transactionStatus.data.amount_in_cents,
            })

            try {
              const updateResponse = await fetch(`/api/payments/update-status`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  transactionId: result.data.transactionId,
                  status: transactionStatus.data.status,
                  wompiResponse: transactionStatus.data,
                }),
              })

              if (updateResponse.ok) {
                console.log("✅ Estado de transacción actualizado en BD")
              }
            } catch (updateError) {
              console.warn("⚠️ Error actualizando estado en BD:", updateError)
            }

            if (transactionStatus.data.status === "DECLINED" || transactionStatus.data.status === "ERROR") {
              window.location.href = `/checkout/success?transaction_id=${result.data.transactionId}&status=${transactionStatus.data.status}&error=true`
            } else {
              window.location.href = `/checkout/success?transaction_id=${result.data.transactionId}&status=${transactionStatus.data.status}`
            }
          } else {
            console.warn("⚠️ No se pudo consultar el estado real, redirigiendo con estado inicial")
            window.location.href = `/checkout/success?transaction_id=${result.data.transactionId}`
          }
        } catch (statusError) {
          console.warn("⚠️ Error consultando estado real:", statusError)
          window.location.href = `/checkout/success?transaction_id=${result.data.transactionId}`
        }
      } else {
        throw new Error(result.error || "Error creando transacción")
      }
    } catch (error) {
      console.error("❌ Error procesando pago:", error)

      const errorMessage = error instanceof Error ? error.message : "Error desconocido procesando el pago"

      ErrorsHandler.showError("Error de pago", errorMessage)
      onError(new Error(errorMessage))
    } finally {
      setIsProcessing(false)
    }
  }

  const documentTypes = [
    { value: "CC", label: "Cédula de Ciudadanía" },
    { value: "CE", label: "Cédula de Extranjería" },
    { value: "NIT", label: "NIT" },
    { value: "PP", label: "Pasaporte" },
  ]

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
  ]

  if (configLoading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-lg font-medium text-gray-700">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-3 bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30 min-h-screen">
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Información de Pago</h1>
        <p className="text-gray-600">Completa los datos de forma segura</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Nombre completo</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Juan Pérez"
                          className="h-12 pl-4 pr-4 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="tu@email.com"
                        className="h-12 pl-4 pr-4 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Teléfono</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+57 300 123 4567"
                        className="h-12 pl-4 pr-4 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerDocumentType"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Tipo de documento</FormLabel>
                    <FormControl>
                      <select
                        className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all text-gray-900"
                        {...field}
                      >
                        {documentTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerDocument"
                render={({ field }) => (
                  <FormItem className="space-y-2 md:col-span-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Número de documento</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="12345678"
                        className="h-12 pl-4 pr-4 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Dirección de Envío</h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="shippingLine1"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Dirección principal</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Calle 123 # 45-67"
                        className="h-12 pl-4 pr-4 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shippingLine2"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Complemento (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Apartamento 101, Torre 2"
                        className="h-12 pl-4 pr-4 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="shippingCity"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700">Ciudad</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Bogotá"
                          className="h-12 pl-4 pr-4 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shippingState"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700">Departamento</FormLabel>
                      <FormControl>
                        <select
                          className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 focus:outline-none transition-all text-gray-900"
                          {...field}
                        >
                          <option value="">Seleccionar</option>
                          {colombianStates.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="shippingPostalCode"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Código postal</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="110111"
                        className="h-12 pl-4 pr-4 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Datos de Tarjeta</h2>
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Número de tarjeta</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="4242 4242 4242 4242"
                        className="h-14 pl-4 pr-4 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono text-lg tracking-wider"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\s/g, "")
                          const formattedValue = value.replace(/(.{4})/g, "$1 ").trim()
                          field.onChange(formattedValue)
                        }}
                        maxLength={19}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cardHolder"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Titular de la tarjeta</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="JUAN PÉREZ"
                        className="h-12 pl-4 pr-4 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all uppercase"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value.toUpperCase())
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="cardExpMonth"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700">Mes</FormLabel>
                      <FormControl>
                        <select
                          className="w-full h-12 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all text-gray-900"
                          {...field}
                        >
                          <option value="">MM</option>
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = (i + 1).toString().padStart(2, "0")
                            return (
                              <option key={month} value={month}>
                                {month}
                              </option>
                            )
                          })}
                        </select>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cardExpYear"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700">Año</FormLabel>
                      <FormControl>
                        <select
                          className="w-full h-12 px-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all text-gray-900"
                          {...field}
                        >
                          <option value="">AA</option>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = (new Date().getFullYear() + i).toString().slice(-2)
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            )
                          })}
                        </select>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cardCvc"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-700">CVC</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123"
                          type="password"
                          maxLength={4}
                          className="h-12 px-4 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono text-center text-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="installments"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">Número de cuotas</FormLabel>
                    <FormControl>
                      <select
                        className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all text-gray-900"

                        {...field}
                        onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                      >
                        {Array.from({ length: 36 }, (_, i) => {
                          const installments = i + 1
                          return (
                            <option key={installments} value={installments}>
                              {installments} cuota{installments > 1 ? "s" : ""}
                            </option>
                          )
                        })}
                      </select>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    Tu información es procesada de forma segura mediante encriptación SSL
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
            <div className="flex justify-between items-center pb-6 border-b border-gray-100">
              <span className="text-lg text-gray-600">Total a pagar</span>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">
                  ${amount.toLocaleString("es-CO", { minimumFractionDigits: 0 })}
                </p>
                <p className="text-sm text-gray-500">COP</p>
              </div>
            </div>

            {(!acceptanceTokens.termsAndConditions || !acceptanceTokens.personalDataAuth) && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-800 text-center">
                  Debes aceptar los términos y condiciones para continuar
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={
                disabled ||
                isProcessing ||
                !wompiConfig ||
                !acceptanceTokens.termsAndConditions ||
                !acceptanceTokens.personalDataAuth
              }
            >
              {isProcessing ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Procesando pago...</span>
                </div>
              ) : (
                <span>Pagar ${amount.toLocaleString("es-CO", { minimumFractionDigits: 0 })} COP</span>
              )}
            </Button>

            <div className="flex items-center justify-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Pago seguro</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-300"></div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Procesamiento instantáneo</span>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default WompiCardForm
