"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMercadoPagoCheckout } from '../hooks/useMercadoPagoCheckout';
import CardPaymentForm from './CardPaymentForm';
import { AddressForm } from './AddressForm';

import { useRouter } from 'next/navigation';
import { createAddressApi, Address } from '../services/address.service';
import { ErrorsHandler } from '@/app/errors/errorsHandler';

interface CheckoutItem {
  id: number;
  title: string;
  description?: string;
  picture_url?: string;
  category_id?: string;
  quantity: number;
  unit_price: number;
}

// No necesitamos la interfaz Address aquí ya que la importamos de address.service.ts

interface CheckoutProps {
  cartItems: CheckoutItem[];
  user: any;
  addresses?: Address[];
  onCheckoutComplete?: (orderId: number) => void;
}

export default function CheckoutPage({ cartItems, user, addresses = [], onCheckoutComplete }: CheckoutProps) {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<string>('payment-options');
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('mercadopago');
  const [isAddingAddress, setIsAddingAddress] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Calcular totales
  const subtotal = cartItems.reduce((total, item) => total + (item.quantity * item.unit_price), 0);
  const shipping = selectedAddress ? 15000 : 0; // Costo de envío fijo si hay dirección seleccionada
  const taxes = subtotal * 0.19; // IVA 19%
  const total = subtotal + shipping + taxes;
  
  // Configurar MercadoPago checkout
  const { 
    isLoading: isMPLoading, 
    createCheckoutPreference 
  } = useMercadoPagoCheckout({
    cartItems,
    totalAmount: total,
    shippingAddress: selectedAddress
      ? {
          id: selectedAddress.id,
          address: selectedAddress.address,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postal_code: selectedAddress.postal_code,
          country: selectedAddress.country,
          default: selectedAddress.is_default,
        }
      : null,
    user,
    onSuccess: (orderId) => {
      if (onCheckoutComplete) {
        onCheckoutComplete(orderId);
      }
    },
    onError: (error) => {
      ErrorsHandler.showError(
        "Error de pago",
        error.message
      );
    }
  });
  
  // Seleccionar dirección predeterminada al cargar
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddress = addresses.find(address => address.is_default);
      setSelectedAddress(defaultAddress || addresses[0]);
    }
  }, [addresses]);
  
  const handleAddressSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Guardar la dirección a través del API
      const addressData = {
        user_id: user.id,
        ...data
      };
      
      const newAddress = await createAddressApi(addressData);
      setSelectedAddress(newAddress);
      setIsAddingAddress(false);
      ErrorsHandler.showSuccess(
        "Dirección guardada",
        "Tu dirección ha sido guardada correctamente"
      );
    } catch (error) {
      console.error('Error saving address:', error);
        ErrorsHandler.showError(
        "Error al guardar la dirección",
        error.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCheckout = async () => {
    if (!selectedAddress) {
        ErrorsHandler.showError(
          "Dirección requerida",
          "Por favor selecciona una dirección de envío"
        );
      setActiveTab('address');
      return;
    }
    
    if (selectedPaymentMethod === 'mercadopago') {
      await createCheckoutPreference();
    } else {
        ErrorsHandler.showError(
            "Método de pago no disponible",
            "Este método de pago aún no está implementado"
        );
    }
  };
  
  const handleCardPaymentSuccess = (paymentId: string) => {
    ErrorsHandler.showSuccess(
      "Pago exitoso",
      "Tu pago ha sido procesado correctamente"
    );
    router.push(`/orders/success?payment_id=${paymentId}`);
  };
  
  return (
    <div className="max-w-7xl mx-auto p-4 grid md:grid-cols-12 gap-6">
      <div className="md:col-span-8 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="address">Dirección</TabsTrigger>
            <TabsTrigger value="payment-options">Método de Pago</TabsTrigger>
          </TabsList>
          
          <TabsContent value="address" className="space-y-4">
            {isAddingAddress ? (
              <div className="space-y-4">
                <AddressForm
                  onSubmit={handleAddressSubmit}
                  isLoading={isSubmitting}
                />
                <Button
                  variant="outline"
                  onClick={() => setIsAddingAddress(false)}
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses && addresses.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {addresses.map((address) => (
                      <Card 
                        key={address.id}
                        className={`cursor-pointer ${selectedAddress?.id === address.id ? 'border-2 border-primary' : ''}`}
                        onClick={() => setSelectedAddress(address)}
                      >
                        <CardHeader className="p-4">
                          <CardTitle className="text-sm font-medium">
                            {address.address}
                            {address.is_default && (
                              <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                Predeterminada
                              </span>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-sm">{address.city}, {address.state}</p>
                          <p className="text-sm">{address.country}, {address.postal_code}</p>
                          {address.additional_info && (
                            <p className="text-sm text-gray-500 mt-1">{address.additional_info}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            {address.address_type === 'shipping' 
                              ? 'Dirección de envío' 
                              : address.address_type === 'billing' 
                                ? 'Dirección de facturación' 
                                : 'Dirección de envío y facturación'}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>No hay direcciones guardadas</CardTitle>
                      <CardDescription>Agrega una dirección para continuar</CardDescription>
                    </CardHeader>
                  </Card>
                )}
                
                <Button onClick={() => setIsAddingAddress(true)}>
                  Agregar nueva dirección
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="payment-options" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pago</CardTitle>
                <CardDescription>Selecciona tu método de pago preferido</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div 
                    className={`flex items-center p-3 border rounded-md cursor-pointer ${selectedPaymentMethod === 'mercadopago' ? 'border-primary bg-primary/5' : ''}`}
                    onClick={() => setSelectedPaymentMethod('mercadopago')}
                  >
                    <input
                      type="radio"
                      id="mercadopago"
                      checked={selectedPaymentMethod === 'mercadopago'}
                      onChange={() => setSelectedPaymentMethod('mercadopago')}
                      className="mr-2"
                    />
                    <label htmlFor="mercadopago" className="flex items-center">
                      <span className="ml-2">MercadoPago (Tarjetas, PSE, efectivo)</span>
                    </label>
                  </div>
                  
                  <div 
                    className={`flex items-center p-3 border rounded-md cursor-pointer ${selectedPaymentMethod === 'card' ? 'border-primary bg-primary/5' : ''}`}
                    onClick={() => setSelectedPaymentMethod('card')}
                  >
                    <input
                      type="radio"
                      id="card"
                      checked={selectedPaymentMethod === 'card'}
                      onChange={() => setSelectedPaymentMethod('card')}
                      className="mr-2"
                    />
                    <label htmlFor="card" className="flex items-center">
                      <span className="ml-2">Pago directo con tarjeta</span>
                    </label>
                  </div>
                </div>
                
                {selectedPaymentMethod === 'card' && (
                  <div className="mt-6">
                    <CardPaymentForm 
                      amount={total}
                      description={`Compra en NeoSale - ${cartItems.length} productos`}
                      onSuccess={handleCardPaymentSuccess}
                      onError={(error) => {
                        ErrorsHandler.showError(
                          "Error de pago",
                          error.message
                        );
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="md:col-span-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Compra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Productos ({cartItems.length})</h3>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between py-1 text-sm">
                    <span>
                      {item.title} x{item.quantity}
                    </span>
                    <span>${(item.unit_price * item.quantity).toLocaleString('es-CO')}</span>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>{shipping > 0 ? `$${shipping.toLocaleString('es-CO')}` : 'Por calcular'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos (19%)</span>
                  <span>${taxes.toLocaleString('es-CO')}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toLocaleString('es-CO')}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button 
              className="w-full" 
              onClick={handleCheckout}
              disabled={isMPLoading || selectedPaymentMethod === 'card'}
            >
              {isMPLoading ? 'Procesando...' : 'Finalizar compra'}
            </Button>
            <Link href="/cart" className="w-full">
              <Button variant="outline" className="w-full">
                Volver al carrito
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
