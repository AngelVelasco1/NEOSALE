"use client";

import { Package, Truck, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface OrderTrackingCardProps {
  orderId: number;
  orderStatus: string;
  hasTracking: boolean;
  trackingUrl?: string;
  lastUpdate?: string;
}

const statusIcons: Record<string, any> = {
  pending: Clock,
  paid: Package,
  processing: Package,
  shipped: Truck,
  delivered: Package,
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  paid: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  processing: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  shipped: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  delivered: "bg-green-500/10 text-green-600 border-green-500/20",
};

export function OrderTrackingCard({
  orderId,
  orderStatus,
  hasTracking,
  trackingUrl,
  lastUpdate,
}: OrderTrackingCardProps) {
  const StatusIcon = statusIcons[orderStatus] || Package;
  const statusColor = statusColors[orderStatus] || statusColors.pending;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full ${statusColor} flex items-center justify-center`}
            >
              <StatusIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-lg">Orden #{orderId}</p>
              <Badge variant="outline" className={statusColor}>
                {orderStatus}
              </Badge>
            </div>
          </div>
        </div>

        {hasTracking ? (
          <div className="space-y-3">
            {lastUpdate && (
              <p className="text-sm text-gray-600">
                Última actualización:{" "}
                {new Date(lastUpdate).toLocaleString("es-CO")}
              </p>
            )}
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href={`/orders/${orderId}`}>Ver Detalles</Link>
              </Button>
              {trackingUrl && (
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1"
                  onClick={() => window.open(trackingUrl, "_blank")}
                >
                  Rastrear Envío
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              El envío aún no ha sido procesado
            </p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href={`/orders/${orderId}`}>Ver Orden</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
