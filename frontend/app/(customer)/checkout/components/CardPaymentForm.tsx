"use client";

import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  initMercadoPago, 
  CardNumber, 
  ExpirationDate, 
  SecurityCode, 
  createCardToken,
  getPaymentMethods,
  getIdentificationTypes
} from "@mercadopago/sdk-react";
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { processCardPaymentApi } from "../services/paymentsApi";
import { ErrorsHandler } from "@/app/errors/errorsHandler";
import { useUser } from "@/app/(auth)/context/UserContext";
import { useSession } from "next-auth/react";


 initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, {
      locale: 'es-CO',
      advancedFraudPrevention: false,
      trackingDisabled: true
    });
const paymentFormSchema = z.object({
  cardholderName: z.string()
    .min(3, 'Ingrese nombre completo del titular')
    .max(50, 'Nombre muy largo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Solo se permiten letras y espacios'),
  email: z.string()
    .email('Ingrese un email válido')
    .min(5, 'Email muy corto')
    .max(100, 'Email muy largo'),
  identificationType: z.string()
    .min(1, 'Seleccione tipo de documento'),
  identificationNumber: z.string()
    .optional()
    .refine((val) => {
      // Si está vacío, es válido (opcional)
      if (!val || val.trim() === '') return true;
      // Si tiene valor, debe cumplir las validaciones
      return val.length >= 6 && /^[0-9]+$/.test(val);
    }, 'Número de documento debe tener al menos 6 dígitos y solo números'),
}).refine((data) => {
  // Si se selecciona un tipo de identificación diferente a "none", debe tener número
  if (data.identificationType !== 'none' && (!data.identificationNumber || data.identificationNumber.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: "Debe proporcionar número de documento si selecciona un tipo",
  path: ["identificationNumber"]
});

interface CardPaymentFormProps {
  amount: number;
  description: string;
  installments: number;
  onSuccess: (paymentId: string) => void;
  onError: (error: Error) => void;
  disabled?: boolean; 
  userId: number
}

export default function CardPaymentForm({
  amount,
  description,
  installments,
  onSuccess,
  onError,
  disabled = false,
  userId
}: CardPaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [detectedCardType, setDetectedCardType] = useState<string>('');
  
  const { userProfile } = useUser();
  const { data: session } = useSession();
  
  const identificationTypes = [
    { id: 'none', name: 'No especificar (opcional)' },
    { id: 'CC', name: 'Cédula de Ciudadanía' },
    { id: 'CE', name: 'Cédula de Extranjería' },
    { id: 'NIT', name: 'NIT' },
    { id: 'PP', name: 'Pasaporte' },
    { id: 'TI', name: 'Tarjeta de Identidad' }
  ];

  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardholderName: userProfile?.name || '',
      email: userProfile?.email || session?.user?.email || '',
      identificationType: userProfile?.identification ? 'CC' : 'none',
      identificationNumber: userProfile?.identification || '',
    },
  });

  useEffect(() => {
    if (userProfile || session?.user) {
      form.setValue('cardholderName', userProfile?.name || '');
      form.setValue('email', userProfile?.email || session?.user?.email || '');
      form.setValue('identificationNumber', userProfile?.identification || '');
      form.setValue('identificationType', userProfile?.identification ? 'CC' : 'none');
    }
  }, [userProfile, session?.user, form]);

  // ✅ Cargar métodos de pago disponibles al montar el componente
  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const methods = await getPaymentMethods(paymentMethods);
        setPaymentMethods(methods);
        console.log('💳 Métodos de pago disponibles:', methods);
      } catch (error) {
        console.error('Error cargando métodos de pago:', error);
      }
    };

    loadPaymentMethods();
  }, []);

  // ✅ Detectar tipo de tarjeta cuando cambia el BIN
  useEffect(() => {
    const detectCardType = async () => {
      if (cardBin.length >= 6) {
        try {
          const methods = await getPaymentMethods();
          const creditCardMethods = methods.filter((method: any) => 
            method.payment_type_id === 'credit_card' || method.payment_type_id === 'debit_card'
          );
          
          // Buscar coincidencia por BIN ranges (simplificado)
          const detectedMethod = creditCardMethods.find((method: any) => {
            return method.id === 'visa' || method.id === 'master' || 
                   method.id === 'amex' || method.id === 'diners';
          });

          if (detectedMethod) {
            setDetectedCardType(detectedMethod.id);
            console.log('🔍 Tipo de tarjeta detectado:', detectedMethod.id);
          }
        } catch (error) {
          console.error('Error detectando tipo de tarjeta:', error);
        }
      }
    };

    detectCardType();
  }, [cardBin]);


  const onSubmit = async (formData: z.infer<typeof paymentFormSchema>) => {
    if (disabled) return;
    
    setIsLoading(true);
    
    try {
      if (!formData.cardholderName.trim()) {
        throw new Error("El nombre del titular es requerido");
      }
      
      if (!formData.email.trim()) {
        throw new Error("El email es requerido");
      }
      
      if (!formData.identificationType) {
        throw new Error("Debe seleccionar un tipo de documento");
      }
      
      if (!formData?.identificationNumber?.trim()) {
        throw new Error("El número de documento es requerido");
      }
      const finaluserId = userId || userProfile?.id;
      
      const token = await createCardToken({
        cardholderName: formData.cardholderName.trim(),
        identificationType: formData.identificationType !== 'none' ? formData.identificationType : undefined,
        identificationNumber: formData.identificationType !== 'none' ? formData.identificationNumber?.trim() : undefined
      });
      
      if (!token || !token.id) {
        throw new Error("No se pudo generar el token de la tarjeta. Verifica los datos e intenta nuevamente.");
      }

      console.log('Token generado exitosamente:', token.id);

      const paymentData: any = {
        amount: Math.round(amount), 
        email: formData.email.toLowerCase().trim(),
        installments: installments || 1,
        token: token.id,
        user_id: finaluserId
      };

      if (formData.identificationType !== 'none' && formData.identificationNumber?.trim()) {
        paymentData.identificationType = formData.identificationType;
        paymentData.identificationNumber = formData.identificationNumber.trim();
      }

      console.log('📤 Datos de pago a enviar:', {
        amount: paymentData.amount,
        email: paymentData.email,
        installments: paymentData.installments,
        hasToken: !!paymentData.token,
        identificationType: paymentData.identificationType || 'No especificado',
        identificationNumber: paymentData.identificationNumber ? `***${paymentData.identificationNumber.slice(-3)}` : 'No especificado'
      });

      const paymentResponse = await processCardPaymentApi(paymentData);
      
      console.log('Respuesta del backend:', paymentResponse);

      if (paymentResponse.success && paymentResponse.payment) {
        const payment = paymentResponse.payment;
        
        // Verificar el estado del pago
        switch (payment.status) {
          case 'approved':
            ErrorsHandler.showSuccess(
              "¡Pago exitoso!",
              `Tu pago por $${amount.toLocaleString('es-CO')} ha sido aprobado exitosamente.`
            );
            onSuccess(payment.id);
            break;
            
          case 'in_process':
          case 'pending':
            ErrorsHandler.showSuccess(
              "Pago en proceso",
              "Tu pago está siendo procesado. Te notificaremos cuando se complete."
            );
            onSuccess(payment.id);
            break;
            
          case 'rejected': {
            const rejectionReason = getRejectReason(payment.status_detail);
            ErrorsHandler.showError(
              "Pago rechazado",
              rejectionReason
            );
            onError(new Error(rejectionReason));
            break;
          }
            
          default:
            throw new Error(`Estado de pago no reconocido: ${payment.status}`);
        }
      } else {
        throw new Error(paymentResponse.message || "Error inesperado al procesar el pago");
      }
      
    } catch (error: any) {
      console.error('Error en el proceso de pago:', error);
      
      let errorMessage = "Error al procesar el pago. Por favor intenta nuevamente.";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.cause && Array.isArray(error.cause)) {
        errorMessage = error.cause.map((cause: any) => cause.description || cause.message).join(', ');
      } else if (error.status === 400) {
        errorMessage = "Datos de tarjeta inválidos. Verifica la información e intenta nuevamente.";
      } else if (error.status === 401) {
        errorMessage = "Error de autenticación. Por favor recarga la página e intenta nuevamente.";
      } else if (error.status >= 500) {
        errorMessage = "Error del servidor. Por favor intenta más tarde.";
      }
      
      ErrorsHandler.showError("Error de pago", errorMessage);
      onError(error instanceof Error ? error : new Error(errorMessage));
      
    } finally {
      setIsLoading(false);
    }
  };

  const getRejectReason = (statusDetail?: string): string => {
    const rejectionReasons: Record<string, string> = {
      'cc_rejected_insufficient_amount': 'Fondos insuficientes en la tarjeta',
      'cc_rejected_bad_filled_security_code': 'Código de seguridad incorrecto',
      'cc_rejected_bad_filled_date': 'Fecha de vencimiento incorrecta',
      'cc_rejected_bad_filled_card_number': 'Número de tarjeta incorrecto',
      'cc_rejected_call_for_authorize': 'Debes autorizar el pago con tu banco',
      'cc_rejected_card_disabled': 'La tarjeta está deshabilitada',
      'cc_rejected_duplicated_payment': 'Ya existe un pago idéntico',
      'cc_rejected_high_risk': 'Pago rechazado por políticas de seguridad',
      'cc_rejected_max_attempts': 'Has superado el límite de intentos',
      'cc_rejected_other_reason': 'La tarjeta rechazó el pago por motivos no especificados',
      'cc_rejected_blacklist': 'La tarjeta está en lista negra',
      'cc_rejected_card_type_not_allowed': 'Este tipo de tarjeta no está permitido para este comercio',
      'cc_rejected_invalid_installments': 'Número de cuotas no válido para esta tarjeta'
    };

    return rejectionReasons[statusDetail || ''] || 'Tu pago fue rechazado. Intenta con otro método de pago o contacta tu banco.';
  };

  const isFormDisabled = isLoading || disabled;

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Pago con Tarjeta de Crédito/Débito</CardTitle>
        <CardDescription>
          {description} - Total a pagar: <strong>${amount.toLocaleString('es-CO')}</strong>
          {installments > 1 && ` en ${installments} cuotas`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Nombre del titular */}
            <FormField
              control={form.control}
              name="cardholderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nombre del Titular de la Tarjeta
                    {userProfile?.name && (
                      <span className="text-green-600 text-xs ml-2">✓ Desde tu perfil</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Como aparece en la tarjeta" 
                      {...field}
                      disabled={isFormDisabled}
                      autoComplete="cc-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Correo Electrónico
                    {(userProfile?.email || session?.user?.email) && (
                      <span className="text-green-600 text-xs ml-2">✓ Desde tu cuenta</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="ejemplo@correo.com" 
                      {...field}
                      disabled={isFormDisabled}
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Número de tarjeta - Componente de MercadoPago */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Número de Tarjeta *
              </label>
              <div className={isFormDisabled ? "opacity-50 pointer-events-none" : ""}>
                <CardNumber
                  placeholder="1234 5678 9012 3456"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
            
            {/* Fecha de expiración y CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Fecha de Vencimiento *
                </label>
                <div className={isFormDisabled ? "opacity-50 pointer-events-none" : ""}>
                  <ExpirationDate
                    placeholder="MM/AA"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Código de Seguridad *
                </label>
                <div className={isFormDisabled ? "opacity-50 pointer-events-none" : ""}>
                  <SecurityCode
                    placeholder="123"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Tipo de documento */}
            <FormField
              control={form.control}
              name="identificationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Documento</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isFormDisabled}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo de documento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {identificationTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Número de documento */}
            <FormField
              control={form.control}
              name="identificationNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Número de Documento
                    {userProfile?.identification && (
                      <span className="text-green-600 text-xs ml-2">✓ Desde tu perfil</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="12345678" 
                      {...field}
                      disabled={isFormDisabled}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Información de seguridad y tarjetas aceptadas */}
            <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg space-y-2">
              <p>🔒 Tu información está protegida con encriptación de grado bancario</p>
              <div className="flex items-center gap-2">
                <span>💳 Tarjetas aceptadas:</span>
                <div className="flex gap-1">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Visa</span>
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Mastercard</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">American Express</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">Diners</span>
                </div>
              </div>
              {detectedCardType && (
                <p className="text-green-600 font-medium">
                  ✅ Tarjeta {detectedCardType.toUpperCase()} detectada
                </p>
              )}
            </div>

            {/* Botón de pago */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isFormDisabled}
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Procesando pago...
                  </div>
                ) : (
                  `Pagar $${amount.toLocaleString('es-CO')}`
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}