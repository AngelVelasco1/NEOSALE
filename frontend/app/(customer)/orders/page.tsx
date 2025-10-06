"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, CreditCard, MapPin, Eye } from "lucide-react";
import { ErrorsHandler } from "@/app/errors/errorsHandler";
import { getUserOrdersApi, type Order } from "./services/ordersApi";

export default function OrdersPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar órdenes del usuario
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);

        if (status === "loading") {
          return; // Esperar a que se resuelva la sesión
        }

        if (status === "unauthenticated" || !session) {
          ErrorsHandler.showError(
            "Inicia sesión",
            "Debes iniciar sesión para ver tus órdenes"
          );
          router.push("/login");
          return;
        }

        const userOrders = await getUserOrdersApi();
        setOrders(userOrders);
      } catch (err) {
        console.error("Error loading orders:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Error al cargar las órdenes";
        setError(errorMessage);
        ErrorsHandler.showError("Error", "No pudimos cargar tus órdenes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [session, status, router]);

  const getStatusBadge = (status: Order["status"]) => {
    const statusConfig = {
      pending: { label: "Pendiente", variant: "secondary" as const },
      confirmed: { label: "Confirmado", variant: "default" as const },
      shipped: { label: "Enviado", variant: "outline" as const },
      delivered: { label: "Entregado", variant: "default" as const },
      cancelled: { label: "Cancelado", variant: "destructive" as const },
    };

    const config = status ? statusConfig[status] : statusConfig.pending;
    return (
      <Badge variant={config.variant} className="capitalize">
        {config.label}
      </Badge>
    );
  };

  // Función para formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Fecha no disponible";

    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
              <Button onClick={() => router.push("/")}>Ir a la tienda</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="w-full hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Orden #{order.id || order.order_id || "N/A"}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(order.created_at)}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(order.status)}
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        $
                        {(
                          order.total ||
                          order.total_amount ||
                          0
                        ).toLocaleString("es-CO")}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Productos */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Productos:
                    </h4>
                    <div className="space-y-2">
                      {order.order_items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: item.color_code }}
                            />
                            <div>
                              <p className="font-medium text-sm">
                                {item.products?.name || "Producto"}
                              </p>
                              <p className="text-xs text-gray-600">
                                {item.products?.brands?.name
                                  ? `${item.products.brands.name} | `
                                  : ""}
                                Talla: {item.size} | Cantidad: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="font-medium text-sm">
                            $
                            {(
                              item.subtotal ||
                              (item.price || item.unit_price || 0) *
                                item.quantity
                            ).toLocaleString("es-CO")}
                          </p>
                        </div>
                      )) || []}
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>ID de Orden: #{order.id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CreditCard className="w-4 h-4" />
                      <span>
                        Pago:{" "}
                        {order.payment?.payment_method || "No especificado"}
                      </span>
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

                    {order.status === "delivered" && (
                      <Button variant="outline" size="sm">
                        Comprar de nuevo
                      </Button>
                    )}

                    {(order.status === "pending" ||
                      order.status === "confirmed") && (
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
