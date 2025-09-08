import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ErrorsHandler } from '@/app/errors/errorsHandler';
import { PaymentPreferenceResponse, createPreferenceApi, getPaymentStatusApi } from '../services/mercadopago.service';

interface ShippingAddress {
  id: number;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  default: boolean;
}

interface CheckoutItem {
  id: number;
  title: string;
  description?: string;
  picture_url?: string;
  category_id?: string;
  quantity: number;
  unit_price: number;
}

interface CheckoutProps {
  cartItems: CheckoutItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress | null;
  user: {
    id: number;
    name: string;
    email: string;
  };
  onSuccess?: (orderId: number) => void;
  onError?: (error: Error) => void;
}

export const useMercadoPagoCheckout = ({
  cartItems,
  totalAmount,
  shippingAddress,
  user,
  onSuccess,
  onError
}: CheckoutProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Detectar parámetros de URL para manejar retorno del pago
  useEffect(() => {
    const status = searchParams.get('status');
    const preferenceId = searchParams.get('preference_id');
    const paymentId = searchParams.get('payment_id');
    const merchantOrderId = searchParams.get('merchant_order_id');
    const externalReference = searchParams.get('external_reference');

    if (status && preferenceId) {
      handlePaymentStatus(status, preferenceId, paymentId, merchantOrderId, externalReference);
    }
  }, [searchParams]);

  // Iniciar el proceso de checkout con MercadoPago
  const createCheckoutPreference = async () => {
    if (!user || !cartItems.length) {
      ErrorsHandler.showError(
        "Error en el checkout",
        "Información incompleta para procesar el pago"
      );
      return;
    }

    setIsLoading(true);

    try {
      const preferenceData = {
        items: cartItems.map(item => ({
          id: item.id.toString(),
          title: item.title,
          description: item.description || 'Producto en NeoSale',
          picture_url: item.picture_url,
          category_id: item.category_id || 'others',
          quantity: item.quantity,
          currency_id: 'COP',
          unit_price: item.unit_price
        })),
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        shipping_address: shippingAddress,
        back_urls: {
          success: `${window.location.origin}/orders/success`,
          failure: `${window.location.origin}/orders/failure`,
          pending: `${window.location.origin}/orders/pending`
        }
      };

      const response = await createPreferenceApi(preferenceData);
      setPreferenceId(response.id);
      setCheckoutUrl(response.init_point);
      setOrderId(response.order_id);

      // Redireccionar al usuario a la página de MercadoPago
      window.location.href = response.init_point;
      
    } catch (error) {
      console.error('Error creating checkout preference:', error);
      ErrorsHandler.showError(
        "Error de pago",
        error instanceof Error ? error.message : 'Error al iniciar el proceso de pago'
      );
      if (onError) onError(error instanceof Error ? error : new Error('Error creating checkout'));
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar el resultado del pago cuando regresa desde MercadoPago
  const handlePaymentStatus = async (
    status: string, 
    preferenceId: string, 
    paymentId: string | null, 
    merchantOrderId: string | null,
    externalReference: string | null
  ) => {
    try {
      let message = '';
      let variant: 'default' | 'destructive' | null = 'default';
      
      switch (status) {
        case 'approved':
          message = '¡Pago aprobado! Tu orden ha sido procesada correctamente.';
          if (onSuccess && externalReference) {
            onSuccess(parseInt(externalReference));
          }
          break;
        case 'pending':
          message = 'Tu pago está pendiente de confirmación.';
          break;
        case 'in_process':
          message = 'Tu pago está siendo procesado.';
          break;
        case 'rejected':
          message = 'El pago fue rechazado. Por favor, intenta con otro método de pago.';
          variant = 'destructive';
          break;
        default:
          message = 'El estado del pago no pudo ser determinado.';
          variant = 'destructive';
      }

      if (variant === 'destructive') {
        ErrorsHandler.showError("Estado del pago", message);
      } else {
        ErrorsHandler.showSuccess("Estado del pago", message);
      }

      // Si hay un ID de pago, podemos obtener más detalles
      if (paymentId && status !== 'approved') {
        const paymentStatus = await getPaymentStatusApi(paymentId);
        console.log('Payment status details:', paymentStatus);
      }

      // Redireccionar según el resultado
      if (status === 'approved') {
        router.push(`/orders/success?order_id=${externalReference}`);
      } else if (status === 'rejected') {
        router.push('/orders/failure');
      }

    } catch (error) {
      console.error('Error handling payment status:', error);
      ErrorsHandler.showError(
        "Error",
        "No pudimos verificar el estado del pago. Contacta a soporte."
      );
    }
  };

  return {
    isLoading,
    preferenceId,
    checkoutUrl,
    orderId,
    createCheckoutPreference
  };
};
