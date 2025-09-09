"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Calendar, CreditCard, MapPin, Eye } from 'lucide-react';
import { ErrorsHandler } from '@/app/errors/errorsHandler';
import { useUserSafe } from '../../(auth)/hooks/useUserSafe';

// Interfaces para las órdenes
interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  color_code: string;
  size: string;
}

interface Order {
  id: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  created_at: string;
  items: OrderItem[];
  shipping_address: string;
  payment_method: string;
}

// Simulación de API - reemplazar con tu API real
const getUserOrdersApi = async (): Promise<Order[]> => {
  // Aquí iría tu llamada real a la API
  return [
    {
      id: 1001,
      status: 'delivered',
      total: 150000,
      created_at: '2024-01-15T10:30:00Z',
      items: [
        {
          id: 1,
          product_name: 'Camiseta Nike Dri-FIT',
          quantity: 2,
          unit_price: 45000,
          color_code: '#000000',
          size: 'M'
        },
        {
          id: 2,
          product_name: 'Pantalón Adidas',
          quantity: 1,
          unit_price: 60000,
          color_code: '#0066CC',
          size: 'L'
        }
      ],
      shipping_address: 'Calle 123 #45-67, Bogotá',
      payment_method: 'Tarjeta de Crédito'
    },
    {
      id: 1002,
      status: 'shipped',
      total: 89000,
      created_at: '2024-01-20T14:15:00Z',
      items: [
        {
          id: 3,
          product_name: 'Zapatillas Puma',
          quantity: 1,
          unit_price: 89000,
          color_code: '#FFFFFF',
          size: '42'
        }
      ],
      shipping_address: 'Carrera 50 #30-20, Medellín',
      payment_method: 'PSE'
    }
  ];
};

export default function OrdersPage() {
  const router = useRouter();
  const { userProfile } = useUserSafe();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar órdenes del usuario
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        
        if (!userProfile) {
          ErrorsHandler.showError(
            "Inicia sesión",
            "Debes iniciar sesión para ver tus órdenes"
          );
          router.push('/auth/login');
          return;
        }

        const userOrders = await getUserOrdersApi();
        setOrders(userOrders);
        
      } catch (err) {
        console.error('Error loading orders:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar las órdenes';
        setError(errorMessage);
        ErrorsHandler.showError("Error", "No pudimos cargar tus órdenes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [userProfile, router]);

  // Función para obtener el color del badge según el estado
  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      pending: { label: 'Pendiente', variant: 'secondary' as const },
      processing: { label: 'Procesando', variant: 'default' as const },
      shipped: { label: 'Enviado', variant: 'outline' as const },
      delivered: { label: 'Entregado', variant: 'default' as const },
      cancelled: { label: 'Cancelado', variant: 'destructive' as const }
    };

    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className="capitalize">
        {config.label}
      </Badge>
    );
  };

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Estados de carga y error
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Cargando tus órdenes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>No pudimos cargar tus órdenes</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Órdenes</h1>
          <p className="text-gray-600 mt-2">
            Historial completo de tus compras y estado de envíos
          </p>
        </div>

        {/* Lista de órdenes */}
        {orders.length === 0 ? (
          <Card className="w-full">
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No tienes órdenes aún
              </h3>
              <p className="text-gray-600 mb-6">
                Cuando hagas tu primera compra, aparecerá aquí
              </p>
              <Button onClick={() => router.push('/')}>
                Ir a la tienda
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="w-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Orden #{order.id}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(order.created_at)}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(order.status)}
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        ${order.total.toLocaleString('es-CO')}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  
                  {/* Productos */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Productos:</h4>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: item.color_code }}
                            />
                            <div>
                              <p className="font-medium text-sm">{item.product_name}</p>
                              <p className="text-xs text-gray-600">
                                Talla: {item.size} | Cantidad: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="font-medium text-sm">
                            ${(item.unit_price * item.quantity).toLocaleString('es-CO')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>Envío a: {order.shipping_address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CreditCard className="w-4 h-4" />
                      <span>Pago: {order.payment_method}</span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/orders/${order.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver detalles
                    </Button>
                    
                    {order.status === 'delivered' && (
                      <Button variant="outline" size="sm">
                        Comprar de nuevo
                      </Button>
                    )}
                    
                    {(order.status === 'pending' || order.status === 'processing') && (
                      <Button variant="outline" size="sm">
                        Cancelar orden
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}