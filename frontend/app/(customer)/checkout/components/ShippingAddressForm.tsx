"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Address } from '../services/addressesApi';
import React from 'react';

interface ShippingAddressProps {
  addresses: Address[];
  selectedAddress: Address | null;
  onAddressSelect: (address: Address) => void;
  onAddNewAddress: () => void;
}

export const ShippingAddressForm = ({
  addresses,
  selectedAddress,
  onAddressSelect,
  onAddNewAddress
}: ShippingAddressProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de envío</CardTitle>
        <CardDescription>
          Selecciona la dirección donde quieres recibir tu pedido
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {addresses.length > 0 ? (
          <div className="space-y-3">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedAddress?.id === address.id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onAddressSelect(address)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    {/* Usando address como dirección principal */}
                    <p className="font-medium">{address.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {address.city}, {address.department}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.country}
                    </p>
                  </div>
                  {address.is_default && (
                    <Badge variant="secondary">Por defecto</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              No tienes direcciones guardadas
            </p>
            <Button variant="outline" onClick={onAddNewAddress}>
              Agregar dirección
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}