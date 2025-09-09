"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorsHandler } from '@/app/errors/errorsHandler';
import { useCart } from '../(cart)/hooks/useCart';
import { useUserSafe } from '../../(auth)/hooks/useUserSafe';

import {ShippingAddressForm} from './components/ShippingAddressForm';
import {PaymentMethods} from './components/PaymentMethods';
import {OrderSummary} from '../orders/components/OrderSummary';

import { Address, getUserAddressesApi } from './services/addressesApi';
import { createOrderApi } from '../orders/services/ordersApi';

export default function CheckoutPage() {
  const router = useRouter();
  const { userProfile, isLoading: userLoading } = useUserSafe();
  const { cartProducts, isLoading: cartLoading, getSubTotal } = useCart();
  
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  useEffect(() => {
    if (!userLoading && !userProfile) {

      router.replace('/login'); // Usar replace para que no pueda volver con el botón atrás
      return;
    }
  }, [userProfile, userLoading, router]);

  // ✅ VALIDACIÓN TEMPRANA DEL CARRITO
  useEffect(() => {
    // Si ya se terminó de cargar el carrito y está vacío
    if (!cartLoading && (!cartProducts || cartProducts.length === 0)) {
      ErrorsHandler.showError(
        "Carrito vacío",
        "No hay productos en tu carrito para procesar"
      );
      router.replace('/cart');
      return;
    }
  }, [cartProducts, cartLoading, router]);

  // Calcular totales solo si hay productos
  const subtotal = cartProducts && cartProducts.length > 0 ? getSubTotal() : 0;
  const shipping = subtotal >= 100000 ? 0 : 10000;
  const taxes = subtotal * 0.19;
  const total = subtotal + shipping + taxes;

  // ✅ CARGAR DATOS SOLO CUANDO EL USUARIO ESTÉ AUTENTICADO
  useEffect(() => {
    const fetchData = async () => {
      // Solo proceder si el usuario está autenticado y hay productos en el carrito
      if (!userProfile || !cartProducts || cartProducts.length === 0) {
        return;
      }

      try {
        setIsLoading(true);
        
        const addresses = await getUserAddressesApi();
        setUserAddresses(addresses);
        setSelectedAddress(addresses.find(addr => addr.is_default) || addresses[0] || null);
        
      } catch (err) {
        console.error('Error loading checkout data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Hubo un error al cargar los datos necesarios para el checkout';
        setError(errorMessage);
        ErrorsHandler.showError("Error", "No pudimos cargar la información necesaria para el checkout");
      } finally {
        setIsLoading(false);
      }
    };
    
    // Solo ejecutar cuando ambos (usuario y carrito) hayan terminado de cargar
    if (!userLoading && !cartLoading) {
      fetchData();
    }
  }, [userProfile, cartProducts, userLoading, cartLoading]);

  const handlePaymentSuccess = async (paymentId: string, paymentMethod: string) => {
    setIsProcessingOrder(true);
    
    try {
      if (!selectedAddress) {
        throw new Error('Debes seleccionar una dirección de envío');
      }

      const orderData = {
        payment_id: paymentId,
        address_id: selectedAddress.id,
        items: cartProducts.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          color_code: item.color_code,
          size: item.size
        })),
        subtotal,
        taxes,
        shipping,
        total,
        payment_method: paymentMethod
      };

      const order = await createOrderApi(orderData);
      
      ErrorsHandler.showSuccess(
        "¡Orden completada!",
        `Tu orden #${order.id} ha sido procesada exitosamente`
      );
      
      router.push(`/checkout/success?order_id=${order.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      ErrorsHandler.showError("Error", "Hubo un problema al crear tu orden.");
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const handlePaymentError = (error: Error) => {
    console.error('Payment error:', error);
    ErrorsHandler.showError("Error de pago", "Hubo un problema procesando tu pago.");
  };

  // ✅ LOADING STATES MEJORADOS
  // Mostrar loading mientras se valida la autenticación o el carrito
  if (userLoading || cartLoading || isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">
            Cargando...
          </p>
        </div>
      </div>
    );
  }

  // ✅ NO MOSTRAR NADA SI NO HAY USUARIO (ya se redirigió)
  if (!userProfile) {
    return null;
  }

  // ✅ NO MOSTRAR NADA SI NO HAY PRODUCTOS (ya se redirigió)
  if (!cartProducts || cartProducts.length === 0) {
    return null;
  }

  // ✅ MOSTRAR ERROR SOLO SI HAY UN ERROR REAL DE CARGA DE DATOS
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>No pudimos cargar la información necesaria para el checkout</CardDescription>
          </CardHeader>
          <CardContent><p>{error}</p></CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/cart')}>Volver al carrito</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 px-4">
          <h1 className="text-2xl font-bold">Finalizar compra</h1>
          <p className="text-muted-foreground">
            Hola {userProfile.name}, completa tu orden
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
          
          {/* Información de envío y pago */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Dirección de envío */}
            <ShippingAddressForm
              addresses={userAddresses}
              selectedAddress={selectedAddress}
              onAddressSelect={setSelectedAddress}
              onAddNewAddress={() => router.push('/profile/addresses')}
            />

            {/* Métodos de pago */}
            <PaymentMethods
              amount={total}
              description={`Orden de ${cartProducts.length} producto(s)`}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              disabled={!selectedAddress || isProcessingOrder}
            />
          </div>

          {/* Resumen de la orden */}
          <div className="lg:col-span-1">
            <OrderSummary
              cartItems={cartProducts}
              subtotal={subtotal}
              shipping={shipping}
              taxes={taxes}
              total={total}
              isProcessing={isProcessingOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}