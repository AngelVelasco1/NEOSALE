"use client";

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ErrorsHandler } from "@/app/errors/errorsHandler";

// Validación de esquema para el formulario de dirección
const addressFormSchema = z.object({
  address: z.string().min(5, 'Dirección inválida'),
  city: z.string().min(3, 'Ciudad inválida'),
  state: z.string().min(3, 'Departamento inválido'),
  postal_code: z.string().min(3, 'Código postal inválido'),
  country: z.string().default('Colombia'),
  address_type: z.enum(['shipping', 'billing', 'both']),
  is_default: z.boolean().default(false),
  additional_info: z.string().optional(),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

// Estados colombianos
const colombianStates = [
  "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bogotá D.C.", "Bolívar", 
  "Boyacá", "Caldas", "Caquetá", "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba", 
  "Cundinamarca", "Guainía", "Guaviare", "Huila", "La Guajira", "Magdalena", "Meta", 
  "Nariño", "Norte de Santander", "Putumayo", "Quindío", "Risaralda", "San Andrés y Providencia", 
  "Santander", "Sucre", "Tolima", "Valle del Cauca", "Vaupés", "Vichada"
];

interface AddressFormProps {
  onSubmit: (data: AddressFormValues) => Promise<void> | void;
  defaultValues?: Partial<AddressFormValues>;
  isLoading?: boolean;
  isEdit?: boolean;
}

export function AddressForm({ 
  onSubmit, 
  defaultValues = {
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Colombia',
    address_type: 'shipping',
    is_default: false,
    additional_info: '',
  }, 
  isLoading = false,
  isEdit = false 
}: AddressFormProps) {
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues,
  });

  // Para manejar cambios externos en defaultValues
  useEffect(() => {
    if (defaultValues) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        if (value !== undefined) {
          form.setValue(key as keyof AddressFormValues, value);
        }
      });
    }
  }, [defaultValues, form]);

  function handleSubmit(data: AddressFormValues) {
    try {
      onSubmit(data);
    } catch (error) {
      console.error('Error submitting address:', error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error al guardar la dirección",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>{isEdit ? 'Editar Dirección' : 'Nueva Dirección'}</CardTitle>
        <CardDescription>
          {isEdit 
            ? 'Actualiza los datos de tu dirección'
            : 'Ingresa los datos para tu dirección de envío o facturación'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Calle 1 # 2-34" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciudad</FormLabel>
                    <FormControl>
                      <Input placeholder="Bogotá" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona departamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colombianStates.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código Postal</FormLabel>
                    <FormControl>
                      <Input placeholder="110111" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País</FormLabel>
                    <FormControl>
                      <Input placeholder="Colombia" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-4" />

            <FormField
              control={form.control}
              name="additional_info"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Información adicional</FormLabel>
                  <FormControl>
                    <Input placeholder="Apartamento, edificio, piso, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de dirección</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="shipping" id="shipping" />
                        <label htmlFor="shipping">Dirección de envío</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="billing" id="billing" />
                        <label htmlFor="billing">Dirección de facturación</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="both" id="both" />
                        <label htmlFor="both">Ambas</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_default"
                checked={form.watch('is_default')}
                onChange={(e) => form.setValue('is_default', e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="is_default">Establecer como dirección predeterminada</label>
            </div>

            <CardFooter className="px-0 pt-4">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Guardando..." : (isEdit ? "Actualizar dirección" : "Guardar dirección")}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
