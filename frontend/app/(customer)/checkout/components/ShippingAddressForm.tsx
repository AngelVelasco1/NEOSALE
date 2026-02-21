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
      <Card className="relative overflow-hidden shadow-slate-800 border border-slate-700/50 shadow-2xl bg-slate-800/40 backdrop-blur-xl">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-indigo-900/20 via-slate-800/40 to-slate-800/40" />

        {/* Decorative animated border */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-indigo-500 to-transparent">
          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            className="h-full w-1/3 bg-linear-to-r from-transparent via-cyan-400 to-transparent blur-sm"
          />
        </div>

        {/* Header */}
        <CardHeader className="relative pb-5 pt-6 px-6 border-b border-slate-700/50">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-4 mb-2">
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 18,
                  delay: 0.15
                }}
                className="relative p-3 rounded-xl bg-linear-to-br from-indigo-600 via-purple-600 to-indigo-700 shadow-lg shadow-indigo-500/40"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-2xl bg-linear-to-br from-violet-500 to-violet-600 blur-xl"
                />
                <MapPin className="w-6 h-6 text-white relative z-10" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-extrabold bg-linear-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent flex items-center gap-2">
                  Dirección de envío
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Selecciona o agrega una nueva dirección
                </p>
              </div>
            </div>
          </motion.div>
        </CardHeader>

        <CardContent className="relative p-6 pt-6">
          {addresses.length > 0 ? (
            <div className="space-y-5">
              {/* Header section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-between pb-4 border-b border-slate-700/50"
              >
                <div>
                  <h3 className="text-lg font-bold text-slate-100">
                    Direcciones guardadas
                  </h3>
                  <p className="text-sm text-slate-400 mt-0.5">
                    {addresses.length} dirección{addresses.length > 1 ? 'es' : ''} disponible{addresses.length > 1 ? 's' : ''}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openCreateModal}
                  className="h-9 px-4 rounded-xl bg-linear-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 hover:from-indigo-600/30 hover:to-purple-600/30 hover:border-indigo-500/50 transition-all shadow-lg hover:shadow-indigo-500/20"
                >
                  <Plus className="w-4 h-4 mr-1.5 text-indigo-300" />
                  <span className="text-indigo-300 font-semibold text-sm">Nueva</span>
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
                          group relative p-5 rounded-2xl cursor-pointer transition-all duration-300
                          ${isSelected
                            ? 'bg-linear-to-br from-indigo-600/30 via-purple-600/30 to-indigo-700/30 border-2 border-indigo-500/50 shadow-xl shadow-indigo-500/20'
                            : 'bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10'
                          }
                        `}
                      >
                        {/* Glow effect on hover */}
                        {isSelected && (
                          <motion.div
                            animate={{
                              scale: [1, 1.02, 1],
                              opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="absolute inset-0 rounded-2xl bg-linear-to-br from-indigo-500/20 to-purple-500/20 blur-xl"
                          />
                        )}

                        {/* Selection indicator */}
                        <motion.div
                          initial={false}
                          animate={{
                            scale: isSelected ? 1 : 0.95,
                            opacity: isSelected ? 1 : 0.6
                          }}
                          className={`
                            absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg
                            ${isSelected
                              ? 'bg-linear-to-br from-indigo-500 to-purple-600'
                              : 'bg-slate-700/50 border-2 border-slate-600 group-hover:border-indigo-500/50'
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
                                <Check className="w-4 h-4 text-white" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>

                        <div className="relative flex items-start gap-4 pr-10">
                          {/* Icon */}
                          <motion.div
                            animate={isSelected ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className={`
                              p-3 rounded-xl shadow-lg transition-all duration-300
                              ${isSelected
                                ? 'bg-linear-to-br from-indigo-600 to-purple-700'
                                : 'bg-linear-to-br from-slate-700 to-slate-800 group-hover:from-indigo-600/30 group-hover:to-purple-600/30'
                              }
                            `}
                          >
                            <Home className={`w-5 h-5 transition-colors ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-indigo-300'}`} />
                          </motion.div>

                          {/* Address details */}
                          <div className="flex-1 space-y-2 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className={`
                                text-base font-bold truncate transition-colors
                                ${isSelected
                                  ? 'text-slate-100'
                                  : 'text-slate-200'
                                }
                              `}>
                                {address.address}
                              </h4>

                              {address.is_default && (
                                <Badge className="bg-linear-to-r from-cyan-600 to-blue-600 text-white border-0 text-[10px] px-2.5 py-0.5 h-5 font-bold shadow-lg shadow-cyan-500/30">
                                  Por defecto
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <div className="p-1 rounded-md bg-linear-to-br from-indigo-500/20 to-purple-500/20">
                                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              </div>
                              <span className="font-semibold text-slate-300 truncate">
                                {address.city}, {address.department}
                              </span>
                            </div>

                            <p className="text-xs text-slate-400 ml-8">
                              {address.country}
                            </p>
                          </div>
                        </div>

                        {/* Edit button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 h-8 w-8 p-0 rounded-lg bg-linear-to-br from-indigo-600/30 to-purple-600/30 hover:from-indigo-600/50 hover:to-purple-600/50 border border-indigo-500/30"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(address);
                          }}
                        >
                          <Edit3 className="w-3.5 h-3.5 text-indigo-300" />
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
              className="text-center py-12 space-y-6"
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
                className="relative w-24 h-24 mx-auto"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.6, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-2xl bg-linear-to-br from-indigo-500/30 to-purple-500/30 blur-2xl"
                />
                <div className="relative w-full h-full rounded-2xl bg-linear-to-br from-indigo-600 via-purple-600 to-indigo-700 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
                  <MapPin className="w-12 h-12 text-white" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <h3 className="text-2xl font-extrabold text-slate-100">
                  No hay direcciones guardadas
                </h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Agrega una dirección de envío para completar tu compra de forma segura
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  onClick={openCreateModal}
                  className="h-12 px-8 text-sm font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-600 text-white border-0 rounded-xl shadow-2xl shadow-indigo-500/40 transition-all duration-300"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Agregar dirección
                </Button>
              </motion.div>

              {/* Benefits grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-10 grid grid-cols-2 gap-3 max-w-md mx-auto"
              >
                {[
                  { icon: Truck, text: 'Envío seguro', color: 'from-indigo-600 to-purple-700' },
                  { icon: Shield, text: 'Compra protegida', color: 'from-purple-600 to-pink-700' },
                  { icon: Package, text: 'Entrega rápida', color: 'from-cyan-600 to-blue-700' },
                  { icon: Sparkles, text: 'Seguimiento', color: 'from-indigo-700 to-indigo-800' },
                ].map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 shadow-lg"
                  >
                    <div className={`p-2 rounded-lg bg-linear-to-br ${benefit.color} shadow-lg`}>
                      <benefit.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-bold text-slate-300">
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
        <SheetContent className="w-full sm:max-w-md overflow-y-auto bg-linear-to-br from-slate-900 to-slate-800 border-l border-slate-700/50 p-4">
          <SheetHeader className="space-y-4 pb-6 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-linear-to-br from-indigo-600 via-purple-600 to-indigo-700 shadow-lg shadow-indigo-500/40">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <SheetTitle className="text-2xl font-extrabold bg-linear-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                {editingAddress ? 'Editar dirección' : 'Nueva dirección'}
              </SheetTitle>
            </div>
            <SheetDescription className="text-sm text-slate-400 leading-relaxed">
              {editingAddress
                ? 'Modifica los datos de tu dirección de envío'
                : 'Completa la información para agregar una nueva dirección'
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
                    <FormLabel className="text-sm font-bold text-slate-200">
                      Dirección completa
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Calle 123 #45-67, Apto 304"
                        className="h-11 text-sm rounded-xl bg-slate-800/50 border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-200 placeholder:text-slate-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* City field */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-slate-200">
                      Ciudad
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Bogotá"
                        className="h-11 text-sm rounded-xl bg-slate-800/50 border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-200 placeholder:text-slate-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Department field */}
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-slate-200">
                      Departamento
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Cundinamarca"
                        className="h-11 text-sm rounded-xl bg-slate-800/50 border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-200 placeholder:text-slate-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Country field */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-slate-200">
                      País
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Colombia"
                        className="h-11 text-sm rounded-xl bg-slate-800/50 border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-200 placeholder:text-slate-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Default checkbox */}
              <FormField
                control={form.control}
                name="is_default"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3 space-y-0 rounded-xl p-4 bg-linear-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                      />
                    </FormControl>
                    <div className="space-y-0.5 leading-none">
                      <FormLabel className="text-sm font-bold cursor-pointer text-slate-200">
                        Dirección predeterminada
                      </FormLabel>
                      <p className="text-xs text-slate-400">
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
                  className="flex-1 h-11 rounded-xl bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 hover:border-slate-600 text-slate-300"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-11 bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-600 text-white border-0 rounded-xl shadow-2xl shadow-indigo-500/40 transition-all font-bold"
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
