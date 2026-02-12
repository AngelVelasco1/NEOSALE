"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { createAddressSchema } from "@/lib/zod"
import { MapPin, Plus, Trash2, Edit2, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { createAddress, updateAddress, deleteAddress, setDefaultAddress } from "../services/api"

type CreateAddressValues = z.infer<typeof createAddressSchema>

interface Address {
  id: number
  address: string
  country: string
  city: string
  department: string
  is_default: boolean
  created_at?: Date
}

interface AddressManagementProps {
  userId: number
  addresses: Address[]
  onAddressChange: () => void
}

export function AddressManagement({ userId, addresses, onAddressChange }: AddressManagementProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  const form = useForm<CreateAddressValues>({  resolver: zodResolver(createAddressSchema),
    defaultValues: {
      address: "",
      country: "",
      city: "",
      department: "",
      is_default: false,
    },
    mode: "onChange",
  })

  const handleOpenDialog = (address?: Address) => {
    if (address) {
      setEditingAddress(address)
      form.reset({
        address: address.address,
        country: address.country,
        city: address.city,
        department: address.department,
        is_default: address.is_default,
      })
    } else {
      setEditingAddress(null)
      form.reset({
        address: "",
        country: "",
        city: "",
        department: "",
        is_default: false,
      })
    }
    setIsDialogOpen(true)
  }

  const onSubmit = async (values: CreateAddressValues) => {
    try {
      if (editingAddress) {
        await updateAddress(userId, editingAddress.id, values)
      } else {
        await createAddress(userId, values)
      }
      setIsDialogOpen(false)
      form.reset()
      onAddressChange()
    } catch (error) {
      
    }
  }

  const handleDelete = async (addressId: number) => {
    try {
      setIsDeleting(addressId)
      await deleteAddress(userId, addressId)
      onAddressChange()
    } catch (error) {
      
    } finally {
      setIsDeleting(null)
    }
  }

  const handleSetDefault = async (addressId: number) => {
    try {
      await setDefaultAddress(userId, addressId)
      onAddressChange()
    } catch (error) {
      
    }
  }

  const canAddMore = addresses.length < 3

  return (
    <div className="space-y-6">
      {canAddMore && (
        <div className="flex justify-end">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={() => handleOpenDialog()}
              className="relative bg-linear-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-500 hover:via-purple-500 hover:to-blue-600 text-white shadow-xl hover:shadow-blue-500/50 transition-all duration-300 rounded-lg font-bold overflow-hidden group"
            >
              <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <Plus className="w-4 h-4 mr-2 relative z-10" />
              <span className="relative z-10">Agregar Dirección</span>
            </Button>
          </motion.div>
        </div>
      )}

      {addresses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-12 border-2 border-dashed border-slate-700/50 rounded-xl bg-linear-to-br from-slate-800/30 to-slate-900/30 text-center"
        >
          <div className="p-4 bg-slate-800/50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <MapPin className="w-10 h-10 text-slate-500" />
          </div>
          <p className="text-slate-400 text-lg mb-6 font-semibold">No tienes direcciones guardadas</p>
          <Button
            onClick={() => handleOpenDialog()}
            className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar tu primera dirección
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {addresses.map((address, index) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`relative group`}
              >
                <div className={`relative p-6 rounded-xl border ${
                  address.is_default
                    ? "border-blue-500/50 bg-linear-to-br from-blue-900/20 via-slate-800/40 to-purple-900/20"
                    : "border-slate-700/50 bg-slate-800/40"
                } hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 backdrop-blur-sm`}>
                  {address.is_default && (
                    <div className="absolute top-4 right-4">
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg text-xs font-bold text-white shadow-lg"
                      >
                        <Star className="w-3.5 h-3.5 fill-white" />
                        Predeterminada
                      </motion.div>
                    </div>
                  )}

                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-linear-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-200 mb-3 group-hover:text-white transition-colors">{address.address}</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                        <span className="font-medium text-slate-300">Ciudad:</span> {address.city}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                        <span className="font-medium text-slate-300">Departamento:</span> {address.department}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 col-span-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        <span className="font-medium text-slate-300">País:</span> {address.country}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-700/50">
                  {!address.is_default && (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                      <Button
                        onClick={() => handleSetDefault(address.id)}
                        variant="outline"
                        size="sm"
                        className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all duration-300 bg-slate-900/50"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Predeterminada
                      </Button>
                    </motion.div>
                  )}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => handleOpenDialog(address)}
                      variant="outline"
                      size="sm"
                      className="border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-600 transition-all duration-300 bg-slate-900/50"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => handleDelete(address.id)}
                      variant="outline"
                      size="sm"
                      disabled={isDeleting === address.id}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-300 disabled:opacity-50 bg-slate-900/50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )}

      {!canAddMore && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 text-sm text-center"
        >
          Has alcanzado el límite máximo de 3 direcciones
        </motion.div>
      )}

      {/* Dialog para agregar/editar dirección */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-700/50 text-slate-200 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {editingAddress ? "Editar Dirección" : "Agregar Nueva Dirección"}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {editingAddress
                ? "Actualiza los datos de tu dirección"
                : "Completa los datos para agregar una nueva dirección de entrega"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 font-semibold">Dirección completa</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Calle 123 #45-67, Apto 801"
                          {...field}
                          className="h-12 border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 bg-slate-800/50 text-slate-200 placeholder:text-slate-500 rounded-lg transition-all duration-300"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300 font-semibold">Ciudad</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: Bogotá"
                            {...field}
                            className="h-12 border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 bg-slate-800/50 text-slate-200 placeholder:text-slate-500 rounded-lg transition-all duration-300"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300 font-semibold">Departamento/Estado</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: Cundinamarca"
                            {...field}
                            className="h-12 border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 bg-slate-800/50 text-slate-200 placeholder:text-slate-500 rounded-lg transition-all duration-300"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 font-semibold">País</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Colombia"
                          {...field}
                          className="h-12 border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 bg-slate-800/50 text-slate-200 placeholder:text-slate-500 rounded-lg transition-all duration-300"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {!editingAddress && addresses.length === 0 && (
                  <FormField
                    control={form.control}
                    name="is_default"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-3 space-y-0 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                          />
                        </FormControl>
                        <FormLabel className="text-slate-300 font-normal cursor-pointer mb-0">
                          Establecer como dirección predeterminada
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <DialogFooter className="gap-2">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false)
                      form.reset()
                    }}
                    className="border-2 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-all duration-300 rounded-lg"
                  >
                    Cancelar
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="relative bg-linear-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-500 hover:via-purple-500 hover:to-cyan-500 text-white shadow-xl hover:shadow-blue-500/50 transition-all duration-300 rounded-lg font-bold overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <span className="relative z-10">
                      {editingAddress ? "Actualizar" : "Agregar"} Dirección
                    </span>
                  </Button>
                </motion.div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
