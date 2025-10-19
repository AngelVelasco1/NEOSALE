"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { MapPin, Plus, Home, Check, Edit3, Truck, Shield, Package, Sparkles, X, Save } from 'lucide-react';
import {
  Address,
  CreateAddressData,
  UpdateAddressData,
  createAddressApi,
  updateAddress
} from '../../(addresses)/services/addressesApi';
import { ErrorsHandler } from '@/app/errors/errorsHandler';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

const addressSchema = z.object({
  address: z.string().min(1, 'La dirección es requerida').min(5, 'La dirección debe tener al menos 5 caracteres'),
  city: z.string().min(1, 'La ciudad es requerida').min(2, 'La ciudad debe tener al menos 2 caracteres'),
  department: z.string().min(1, 'El departamento es requerido').min(2, 'El departamento debe tener al menos 2 caracteres'),
  country: z.string().min(1, 'El país es requerido').min(2, 'El país debe tener al menos 2 caracteres'),
  is_default: z.boolean(),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface ShippingAddressProps {
  addresses: Address[];
  selectedAddress: Address | null;
  onAddressSelect: (address: Address) => void;
  onCreateAddress: (addressData: CreateAddressData) => void;
  onUpdateAddress?: (addressId: number, addressData: UpdateAddressData) => void;
  userId: number;
  onAddressesChange?: () => void;
}

export const ShippingAddressForm = ({
  addresses,
  selectedAddress,
  onAddressSelect,
  onCreateAddress,
  onUpdateAddress,
  userId,
  onAddressesChange
}: ShippingAddressProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: '',
      city: '',
      department: '',
      country: 'Colombia',
      is_default: false,
    },
    mode: 'onChange',
  });

  const openCreateModal = () => {
    setEditingAddress(null);
    form.reset({
      address: '',
      city: '',
      department: '',
      country: 'Colombia',
      is_default: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    form.reset({
      address: address.address,
      city: address.city,
      department: address.department,
      country: address.country,
      is_default: address.is_default,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: AddressFormData) => {
    if (!userId) {
      ErrorsHandler.showError('Error', 'Usuario no identificado');
      return;
    }

    setIsLoading(true);
    try {
      if (addresses.length > 5) {
        ErrorsHandler.showError('Ojo', 'No puedes agregar más de 5 direcciones');
        return;
      }

      const addressDataWithUserId = {
        ...data,
        user_id: userId
      };

      if (editingAddress && editingAddress.id) {
        const result = await updateAddress(editingAddress.id, addressDataWithUserId, userId);

        if (!result.success) {
          throw new Error('Error al actualizar la dirección');
        }

        onUpdateAddress?.(editingAddress.id, addressDataWithUserId);
        ErrorsHandler.showSuccess('Éxito', 'Dirección actualizada correctamente');
      } else {
        const result = await createAddressApi(addressDataWithUserId, userId);

        if (!result.success) {
          throw new Error('Error al crear la dirección');
        }

        if (result.data) {
          onCreateAddress(result.data as CreateAddressData);
        }
        ErrorsHandler.showSuccess('Éxito', 'Dirección creada correctamente');
      }

      onAddressesChange?.();
      setIsModalOpen(false);
      form.reset();
    } catch (error) {
      console.error('❌ Error al guardar dirección:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar la dirección';
      ErrorsHandler.showError('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative"
    >
      <Card className="overflow-hidden border-0 shadow-xl shadow-green-500/10 ring-1 ring-green-400/10 bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-sm">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent" />

        {/* Decorative corner accents */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-tr from-emerald-500/10 to-green-500/10 rounded-full blur-2xl" />

        {/* Header mejorado */}
        <CardHeader className="pb-6 pt-8 px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                      delay: 0.2
                    }}
                    className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30 ring-2 ring-green-400/20"
                  >
                    <MapPin className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-500/95 via-emerald-500 to-green-500/95 bg-clip-text text-transparent">
                      Información de envío
                    </h2>
                    <p className="text-sm text-muted-foreground/70 mt-1">
                      Entrega segura y confiable
                    </p>
                  </div>
                </div>


              </div>
            </div>

            {/* Enhanced decorative gradient line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="relative h-1 w-full max-w-md rounded-full overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500" />
              <motion.div
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </motion.div>
          </motion.div>
        </CardHeader>

        <CardContent className="p-8 pt-4">
          {addresses.length > 0 ? (
            <div className="space-y-6">
              {/* Header de direcciones */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Tus direcciones guardadas
                  </h3>
                  <p className="text-sm text-muted-foreground/70">
                    {addresses.length} dirección{addresses.length > 1 ? 'es' : ''} disponible{addresses.length > 1 ? 's' : ''}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openCreateModal}
                  className="h-10 px-4 rounded-xl ring-1 ring-green-500/20 hover:ring-green-500/40 bg-gradient-to-r from-green-500/5 to-emerald-500/5 hover:from-green-500/10 hover:to-emerald-500/10 transition-all duration-300 border-0"
                >
                  <Plus className="w-4 h-4 mr-2 text-green-600" />
                  <span className="text-green-600 font-medium">Nueva dirección</span>
                </Button>
              </motion.div>

              {/* Lista de direcciones */}
              <div className="space-y-4">
                <AnimatePresence>
                  {addresses.map((address, index) => {
                    const isSelected = selectedAddress?.id === address.id;

                    return (
                      <motion.div
                        key={address.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        onClick={() => onAddressSelect(address)}
                        className={`
                          group relative p-5 rounded-3xl cursor-pointer transition-all duration-300
                          ${isSelected
                            ? 'bg-gradient-to-br from-green-500/15 via-emerald-500/15 to-green-600/15 shadow-xl shadow-green-500/20 ring-2 ring-green-500/50'
                            : 'bg-gradient-to-br from-card/80 to-card/40 hover:from-green-500/5 hover:to-emerald-500/5 hover:shadow-lg hover:shadow-green-500/10 ring-1 ring-green-500/10 hover:ring-green-500/30'
                          }
                        `}
                      >
                        {/* Active glow effect */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              layoutId="addressGlow"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 0, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              className="absolute -inset-1 rounded-xl bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-green-600/20 pointer-events-none blur-lg"
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 35,
                              }}
                            />
                          )}
                        </AnimatePresence>

                        {/* Check indicator */}
                        <motion.div
                          initial={false}
                          animate={{
                            scale: isSelected ? 1 : 0.9,
                            opacity: isSelected ? 1 : 0.5
                          }}
                          className={`
                            absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 z-10
                            ${isSelected
                              ? 'bg-gradient-to-br from-green-500 to-emerald-600 ring-2 ring-green-400/50 shadow-lg shadow-green-500/30'
                              : 'ring-2 ring-green-500/20 group-hover:ring-green-500/40'
                            }
                          `}
                        >
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 180 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              >
                                <Check className="w-4 h-4 text-white" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>

                        <div className="flex items-start gap-4 pr-10 relative z-10">
                          {/* Icon */}
                          <motion.div
                            animate={isSelected ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className={`
                              p-3 rounded-xl shadow-lg transition-all duration-300
                              ${isSelected
                                ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/40'
                                : 'bg-muted/80 group-hover:bg-gradient-to-br group-hover:from-green-400 group-hover:to-emerald-500'
                              }
                            `}
                          >
                            <Home className={`w-5 h-5 transition-colors ${isSelected ? 'text-white' : 'text-muted-foreground group-hover:text-white'}`} />
                          </motion.div>

                          {/* Address info */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className={`
                                text-base font-bold transition-all duration-300
                                ${isSelected
                                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'
                                  : 'text-foreground'
                                }
                              `}>
                                {address.address}
                              </h4>

                              {address.is_default && (
                                <Badge
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-sm text-[10px] px-2 py-0.5"
                                >
                                  Por defecto
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-3.5 h-3.5 text-green-600" />
                              <span className="font-medium text-muted-foreground">
                                {address.city}, {address.department}
                              </span>
                            </div>

                            <p className="text-xs text-muted-foreground/70 ml-5">
                              {address.country}
                            </p>
                          </div>
                        </div>

                        {/* Edit button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 h-8 w-8 p-0 rounded-lg hover:bg-green-500/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(address);
                          }}
                        >
                          <Edit3 className="w-3.5 h-3.5 text-green-600" />
                        </Button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            /* Empty state */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12 space-y-6"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.2
                }}
                className="relative w-24 h-24 mx-auto"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.2, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 blur-xl"
                />
                <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-green-500 via-emerald-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/40">
                  <MapPin className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 bg-clip-text text-transparent">
                  No tienes direcciones guardadas
                </h3>
                <p className="text-muted-foreground/80 max-w-md mx-auto">
                  Agrega una dirección de envío para completar tu compra de forma segura y rápida
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  onClick={openCreateModal}
                  className="h-12 px-8 text-base font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 rounded-2xl shadow-xl shadow-green-500/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/40"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Agregar primera dirección
                </Button>
              </motion.div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md mx-auto"
              >
                {[
                  { icon: Truck, text: 'Envío rápido y seguro', color: 'from-green-500 to-emerald-500' },
                  { icon: Shield, text: 'Compra 100% protegida', color: 'from-blue-500 to-indigo-500' },
                  { icon: Package, text: 'Entrega 2-5 días hábiles', color: 'from-purple-500 to-pink-500' },
                  { icon: Sparkles, text: 'Seguimiento en tiempo real', color: 'from-orange-500 to-amber-500' },
                ].map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 ring-1 ring-border/30"
                  >
                    <div className={`p-1.5 rounded-lg bg-gradient-to-br ${benefit.color} shadow-sm`}>
                      <benefit.icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {benefit.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </CardContent>

        {/* Modal */}
        <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {editingAddress ? 'Editar dirección' : 'Nueva dirección'}
                </SheetTitle>
              </div>
              <SheetDescription className="text-sm">
                {editingAddress
                  ? 'Modifica los datos de tu dirección de envío'
                  : 'Agrega una nueva dirección para tus envíos'
                }
              </SheetDescription>
            </SheetHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 mt-6">
                {/* Address field */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Dirección completa</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Calle 123 #45-67, Apto 304"
                          className="h-11 text-sm rounded-xl ring-1 ring-green-500/10 focus:ring-green-500/30 border-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* City field */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Ciudad</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Bogotá"
                          className="h-11 text-sm rounded-xl ring-1 ring-green-500/10 focus:ring-green-500/30 border-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Department field */}
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Departamento</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Cundinamarca"
                          className="h-11 text-sm rounded-xl ring-1 ring-green-500/10 focus:ring-green-500/30 border-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Country field */}
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">País</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Colombia"
                          className="h-11 text-sm rounded-xl ring-1 ring-green-500/10 focus:ring-green-500/30 border-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Default checkbox */}
                <FormField
                  control={form.control}
                  name="is_default"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0 rounded-xl p-4 ring-1 ring-green-500/10 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-600 border-green-500/30"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium cursor-pointer">
                          Establecer como dirección predeterminada
                        </FormLabel>
                        <p className="text-xs text-muted-foreground">
                          Se seleccionará automáticamente en futuras compras
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 h-11 rounded-xl ring-1 ring-border/50 hover:ring-red-500/30 hover:bg-red-500/5 border-0"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-11 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {editingAddress ? 'Actualizar' : 'Guardar'}
                  </Button>
                </div>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      </Card>
    </motion.div>
  );
};