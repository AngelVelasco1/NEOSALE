"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaymentCardInfo, processCardPaymentApi, getPaymentMethodsApi } from '../services/mercadopago.service';
import { ErrorsHandler } from '@/app/errors/errorsHandler';

// Validación de esquema para el formulario de pago
const paymentFormSchema = z.object({
  cardNumber: z.string().min(15, 'Número de tarjeta inválido').max(19),
  cardholderName: z.string().min(3, 'Ingrese nombre completo'),
  expirationMonth: z.string().min(1, 'Ingrese mes de expiración'),
  expirationYear: z.string().min(2, 'Ingrese año de expiración'),
  securityCode: z.string().min(3, 'CVV inválido').max(4),
  identificationNumber: z.string().min(8, 'Número de documento inválido'),
  identificationType: z.string().min(1, 'Seleccione tipo de documento'),
  email: z.string().email('Email inválido'),
});

interface CardPaymentFormProps {
  amount: number;
  description: string;
  installments?: number;
  orderId?: number;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: Error) => void;
}

export default function CardPaymentForm({
  amount,
  description,
  installments = 1,
  orderId,
  onSuccess,
  onError
}: CardPaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethodId, setPaymentMethodId] = useState<string>('');
  const [issuerId, setIssuerId] = useState<string>('');
  const [cardToken, setCardToken] = useState<string>('');
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [identificationTypes, setIdentificationTypes] = useState<any[]>([
    { id: 'CC', name: 'Cédula de Ciudadanía' },
    { id: 'CE', name: 'Cédula de Extranjería' },
    { id: 'NIT', name: 'NIT' },
    { id: 'PP', name: 'Pasaporte' }
  ]);

  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardNumber: '',
      cardholderName: '',
      expirationMonth: '',
      expirationYear: '',
      securityCode: '',
      identificationNumber: '',
      identificationType: 'CC',
      email: '',
    },
  });

  // Cargar MercadoPago SDK y métodos de pago disponibles
  useEffect(() => {
    const loadMercadoPagoSDK = async () => {
      try {
        // Cargar SDK de MercadoPago
        if (!(window as any).MercadoPago) {
          const script = document.createElement('script');
          script.src = "https://sdk.mercadopago.com/js/v2";
          script.async = true;
          document.body.appendChild(script);
          
          script.onload = () => {
            // Inicializar MercadoPago con la clave pública
            const mp = new (window as any).MercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY);
            (window as any).mp = mp;
            
            // Obtener métodos de pago
            loadPaymentMethods();
          };
        } else {
          loadPaymentMethods();
        }
      } catch (error) {
        console.error('Error loading MercadoPago SDK:', error);
      }
    };

    loadMercadoPagoSDK();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const methods = await getPaymentMethodsApi();
      // Filtrar solo tarjetas de crédito y débito
      const cardMethods = methods.filter(method => 
        method.payment_type_id === 'credit_card' || 
        method.payment_type_id === 'debit_card'
      );
      setPaymentMethods(cardMethods);
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  // Generar token de tarjeta con MercadoPago SDK
  const createCardToken = async (formData: z.infer<typeof paymentFormSchema>) => {
    if (!(window as any).mp) {
      throw new Error('El SDK de MercadoPago no está disponible');
    }

    const mp = (window as any).mp;
    
    const cardNumber = formData.cardNumber.replace(/\s/g, '');
    const expMonth = formData.expirationMonth;
    const expYear = `20${formData.expirationYear}`;

    try {
      const tokenData = await mp.createCardToken({
        cardNumber,
        cardholderName: formData.cardholderName,
        expirationMonth: expMonth,
        expirationYear: expYear,
        securityCode: formData.securityCode,
        identificationType: formData.identificationType,
        identificationNumber: formData.identificationNumber
      });

      if (!tokenData || !tokenData.id) {
        throw new Error('No se pudo generar el token de la tarjeta');
      }

      // Obtener el método de pago basado en los primeros dígitos de la tarjeta
      const bin = cardNumber.substring(0, 6);
      const paymentMethodResult = await mp.getPaymentMethod({ bin });
      
      if (paymentMethodResult && paymentMethodResult.results && paymentMethodResult.results.length > 0) {
        setPaymentMethodId(paymentMethodResult.results[0].id);
        setIssuerId(paymentMethodResult.results[0].issuer?.id || '');
      } else {
        throw new Error('No se pudo identificar el método de pago');
      }

      return tokenData.id;
    } catch (error) {
      console.error('Error creating card token:', error);
      throw error;
    }
  };

  // Procesar el pago con la información de la tarjeta
  const processPayment = async (formData: z.infer<typeof paymentFormSchema>, token: string) => {
    try {
      const paymentData: PaymentCardInfo = {
        token: token,
        transaction_amount: amount,
        installments: installments,
        payment_method_id: paymentMethodId,
        issuer_id: issuerId,
        description: description,
        payer: {
          email: formData.email,
          identification: {
            type: formData.identificationType,
            number: formData.identificationNumber
          }
        },
      };

      if (orderId) {
        paymentData.order_id = orderId;
      }

      const response = await processCardPaymentApi(paymentData);
      return response;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  };

  const onSubmit = async (formData: z.infer<typeof paymentFormSchema>) => {
    setIsLoading(true);
    try {
      // Paso 1: Crear token de tarjeta
      const token = await createCardToken(formData);
      setCardToken(token);
      
      // Paso 2: Procesar el pago
      const paymentResult = await processPayment(formData, token);
      
      // Paso 3: Manejar resultado del pago
      if (paymentResult.status === 'approved') {
        ErrorsHandler.showSuccess(
          "¡Pago exitoso!",
          `Tu pago por $${amount.toLocaleString('es-CO')} ha sido aprobado.`
        );
        if (onSuccess) {
          onSuccess(paymentResult.id);
        }
      } else if (paymentResult.status === 'in_process') {
        ErrorsHandler.showSuccess(
          "Pago en proceso",
          "Tu pago está siendo procesado. Te notificaremos cuando se complete."
        );
      } else if (paymentResult.status === 'rejected') {
        ErrorsHandler.showError(
          "Pago rechazado",
          description: paymentResult.status_detail || "Tu pago ha sido rechazado. Intenta con otro método de pago.",
          variant: "destructive",
        });
        if (onError) {
          onError(new Error(paymentResult.status_detail || "Pago rechazado"));
        }
      }
    } catch (error) {
      console.error('Payment submission error:', error);
      ErrorsHandler.showError(
        "Error de pago",
        error instanceof Error ? error.message : "Ocurrió un error al procesar el pago"
      );
      if (onError) {
        onError(error instanceof Error ? error : new Error("Error processing payment"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper para formatear número de tarjeta con espacios
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Pago con Tarjeta</CardTitle>
        <CardDescription>
          Ingresa los datos de tu tarjeta para realizar el pago de ${amount.toLocaleString('es-CO')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Tarjeta</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      {...field}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value);
                        field.onChange(formatted);
                      }}
                      maxLength={19}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cardholderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Titular</FormLabel>
                  <FormControl>
                    <Input placeholder="Como aparece en la tarjeta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="expirationMonth"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Mes (MM)</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = (i + 1).toString().padStart(2, '0');
                            return (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expirationYear"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Año (YY)</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="YY" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => {
                            const currentYear = new Date().getFullYear();
                            const year = (currentYear + i).toString().slice(-2);
                            return (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="securityCode"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123"
                        maxLength={4}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="identificationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Documento</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo de documento" />
                    </SelectTrigger>
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

            <FormField
              control={form.control}
              name="identificationNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Documento</FormLabel>
                  <FormControl>
                    <Input placeholder="12345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input placeholder="ejemplo@correo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="px-0 pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Procesando..." : `Pagar $${amount.toLocaleString('es-CO')}`}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
