"use client";

import { useState } from "react";
import { TrackingTimeline } from "@/app/(customer)/orders/components/TrackingTimeline";
import { CreateShippingGuide } from "../../components/CreateShippingGuide";
import { ShippingActions } from "../../components/ShippingActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/(admin)/components/ui/card";
import { Package } from "lucide-react";

interface ShippingManagementProps {
  orderId: number;
  orderStatus: string;
  hasGuide: boolean;
  guideNumber?: string;
  trackingUrl?: string;
}

export function ShippingManagement({
  orderId,
  orderStatus,
  hasGuide,
  guideNumber,
  trackingUrl,
}: ShippingManagementProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUpdate = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Actions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Gestión de Envío
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <CreateShippingGuide
              orderId={orderId}
              orderStatus={orderStatus}
              hasGuide={hasGuide}
              guideNumber={guideNumber}
              trackingUrl={trackingUrl}
              onSuccess={handleUpdate}
            />
            <ShippingActions
              orderId={orderId}
              hasGuide={hasGuide}
              orderStatus={orderStatus}
              onUpdate={handleUpdate}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tracking Timeline */}
      {hasGuide && (
        <div key={refreshKey}>
          <TrackingTimeline orderId={orderId} autoUpdate={false} />
        </div>
      )}
    </div>
  );
}
