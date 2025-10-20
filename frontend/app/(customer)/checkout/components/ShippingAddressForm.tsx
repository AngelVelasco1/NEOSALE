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
      <Card className="overflow-hidden border-1 border-green-300/50 shadow-lg shadow-green-200/60 bg-card">
        {/* Decorative top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-600/60 to-transparent" />

        {/* Header */}
        <CardHeader className="pb-2 pt-7 px-7  bg-gradient-to-b from-emerald-50/30 to-transparent dark:from-emerald-950/20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 18,
                  delay: 0.15
                }}
                className="p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md"
              >
                <MapPin className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Dirección de envío
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  Selecciona o agrega una nueva dirección
                </p>
              </div>
            </div>
          </motion.div>
        </CardHeader>

        <CardContent className="p-7 pt-6">
          {addresses.length > 0 ? (
            <div className="space-y-5">
              {/* Header section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-between pb-3 border-b  border-green-500"
              >
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Direcciones guardadas
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    {addresses.length} dirección{addresses.length > 1 ? 'es' : ''} disponible{addresses.length > 1 ? 's' : ''}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openCreateModal}
                  className="h-9 px-3 rounded-lg border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
                >
                  <Plus className="w-4 h-4 mr-1.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium text-sm">Nueva</span>
                </Button>
              </motion.div>

              {/* Address list */}
              <div className="space-y-3">
                <AnimatePresence>
                  {addresses.map((address, index) => {
                    const isSelected = selectedAddress?.id === address.id;

                    return (
                      <motion.div
                        key={address.id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ delay: index * 0.08, duration: 0.3 }}
                        onClick={() => onAddressSelect(address)}
                        className={`
                          group relative p-4 py-5 rounded-xl cursor-pointer transition-all duration-200
                          ${isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-500/50 shadow-md'
                            : 'bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-sm'
                          }
                        `}
                      >
                        {/* Selection indicator */}
                        <motion.div
                          initial={false}
                          animate={{
                            scale: isSelected ? 1 : 0.95,
                            opacity: isSelected ? 1 : 0.6
                          }}
                          className={`
                            absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200
                            ${isSelected
                              ? 'bg-emerald-600 shadow-sm'
                              : 'border-2 border-slate-300 dark:border-slate-600 group-hover:border-emerald-400 dark:group-hover:border-emerald-600'
                            }
                          `}
                        >
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 90 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              >
                                <Check className="w-3.5 h-3.5 text-white" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>

                        <div className="flex items-start gap-3 pr-8">
                          {/* Icon */}
                          <motion.div
                            animate={isSelected ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className={`
                              p-2.5 rounded-lg shadow-sm transition-all duration-200
                              ${isSelected
                                ? 'bg-emerald-600'
                                : 'bg-slate-200 dark:bg-slate-700 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40'
                              }
                            `}
                          >
                            <Home className={`w-4 h-4 transition-colors ${isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'}`} />
                          </motion.div>

                          {/* Address details */}
                          <div className="flex-1 space-y-1.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className={`
                                text-md font-semibold truncate transition-colors
                                ${isSelected
                                  ? 'text-emerald-900 dark:text-emerald-100'
                                  : 'text-slate-900 dark:text-slate-100'
                                }
                              `}>
                                {address.address}
                              </h4>

                              {address.is_default && (
                                <Badge
                                  className="bg-slate-700 dark:bg-slate-600 text-white border-0 text-[10px] px-2 py-0 h-5"
                                >
                                  Por defecto
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 text-sm">
                              <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-500 flex-shrink-0" />
                              <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                                {address.city}, {address.department}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 dark:text-slate-400 ml-4">
                              {address.country}
                            </p>
                          </div>
                        </div>

                        {/* Edit button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 h-7 w-7 p-0 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(address);
                          }}
                        >
                          <Edit3 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
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
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-10 space-y-5"
            >
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 18,
                  delay: 0.1
                }}
                className="relative w-20 h-20 mx-auto"
              >
                <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-lg">
                  <MapPin className="w-10 h-10 text-white" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  No hay direcciones guardadas
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                  Agrega una dirección de envío para completar tu compra
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  onClick={openCreateModal}
                  className="h-11 px-6 text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white border-0 rounded-lg shadow-md transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar dirección
                </Button>
              </motion.div>

              {/* Benefits grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 grid grid-cols-2 gap-2.5 max-w-md mx-auto"
              >
                {[
                  { icon: Truck, text: 'Envío seguro', color: 'from-emerald-600 to-teal-700' },
                  { icon: Shield, text: 'Compra protegida', color: 'from-slate-600 to-slate-700' },
                  { icon: Package, text: 'Entrega rápida', color: 'from-teal-600 to-cyan-700' },
                  { icon: Sparkles, text: 'Seguimiento', color: 'from-emerald-700 to-green-800' },
                ].map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                  >
                    <div className={`p-1.5 rounded-md bg-gradient-to-br ${benefit.color}`}>
                      <benefit.icon className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {benefit.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="space-y-3 pb-4 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 shadow-md">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <SheetTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {editingAddress ? 'Editar dirección' : 'Nueva dirección'}
              </SheetTitle>
            </div>
            <SheetDescription className="text-sm text-slate-600 dark:text-slate-400">
              {editingAddress
                ? 'Modifica los datos de tu dirección de envío'
                : 'Completa la información para agregar una nueva dirección'
              }
            </SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-6">
              {/* Address field */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Dirección completa
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Calle 123 #45-67, Apto 304"
                        className="h-10 text-sm rounded-lg border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-600 focus:ring-emerald-500/20"
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
                    <FormLabel className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Ciudad
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Bogotá"
                        className="h-10 text-sm rounded-lg border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-600 focus:ring-emerald-500/20"
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
                    <FormLabel className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Departamento
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Cundinamarca"
                        className="h-10 text-sm rounded-lg border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-600 focus:ring-emerald-500/20"
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
                    <FormLabel className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      País
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Colombia"
                        className="h-10 text-sm rounded-lg border-slate-300 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-600 focus:ring-emerald-500/20"
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
                  <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                      />
                    </FormControl>
                    <div className="space-y-0.5 leading-none">
                      <FormLabel className="text-sm font-medium cursor-pointer text-slate-900 dark:text-slate-100">
                        Dirección predeterminada
                      </FormLabel>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Se usará automáticamente en futuras compras
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {/* Action buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-10 rounded-lg border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-10 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white border-0 rounded-lg shadow-md transition-all"
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
    </motion.div>
  );
};