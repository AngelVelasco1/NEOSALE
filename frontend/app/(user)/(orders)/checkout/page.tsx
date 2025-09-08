"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/config/api';
import CheckoutPage from '../components/CheckoutPage';
import { ErrorsHandler } from '@/app/errors/errorsHandler';
import { Address, getUserAddressesApi } from '../services/address.service';

interface CartItem {
  id: number;
  title: string;
  description?: string;
  picture_url?: string;
  category_id?: string;
  quantity: number;
  unit_price: number;
}

export default function OrdersPage() {
  const router = useRouter();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos reales desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Obtener datos del carrito de compras desde la API
        const { data: cartData } = await api.get('/api/cart');
        
        // Obtener datos del usuario actual desde la API
        const { data: userData } = await api.get('/api/users/me');
        
        // Obtener direcciones del usuario desde la API
        const addresses = await getUserAddressesApi();
        
        // Actualizar el estado con los datos reales
        setCartItems(cartData.items || []);
        setUser(userData);
        setUserAddresses(addresses);
      } catch (err) {
        console.error('Error loading checkout data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Hubo un error al cargar los datos necesarios para el checkout';
        setError(errorMessage);
        ErrorsHandler.showError(
          "Error",
          "No pudimos cargar la información necesaria para el checkout"
        );
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleCheckoutComplete = (orderId: number) => {
    ErrorsHandler.showSuccess(
      "Orden completada", 
      `Tu orden #${orderId} ha sido procesada exitosamente`
    );
    router.push(`/orders/success?order_id=${orderId}`);
  };
  
  // Mostrar pantalla de carga mientras se obtienen los datos
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Cargando información de checkout...</p>
        </div>
      </div>
    );
  }
  
  // Mostrar mensaje de error si ocurrió un problema
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>No pudimos cargar la información necesaria para el checkout</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/cart')}>
              Volver al carrito
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Verificar que haya productos en el carrito
  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Carrito vacío</CardTitle>
            <CardDescription>No hay productos en tu carrito de compras</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Agrega productos a tu carrito para continuar con el proceso de compra</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/')}>
              Ir a la tienda
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Renderizar la página de checkout con todos los componentes
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 px-4">Finalizar compra</h1>
        
        <CheckoutPage 
          cartItems={cartItems} 
          user={user}
          addresses={userAddresses}
          onCheckoutComplete={handleCheckoutComplete}
        />
      </div>
    </div>
  );
}
