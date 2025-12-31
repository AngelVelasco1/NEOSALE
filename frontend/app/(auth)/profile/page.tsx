"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Mail, Phone, MapPin, Edit2Icon, Lock, CreditCard, EyeOff, Eye, Settings } from "lucide-react"
import { useUser } from "../context/UserContext"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { updateUserSchema, updateUserPasswordSchema } from "@/lib/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useState, useEffect } from "react"
import { updateUser, updatePassword, getUserAddresses } from "../services/api"
import { ProfileSkeleton } from "../components/ProfileSkeleton"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import bcrypt from "bcryptjs"
import { getUserFavoritesApi, type Favorite } from "../../(customer)/favorites/services/favoritesApi";
import { getUserOrdersApi, type Order } from "../../(customer)/orders/services/ordersApi";

import { ProfileImageUpload } from "../components/ProfileImageUpload"
import { AddressManagement } from "../components/AddressManagement"

type UpdateUserValues = z.infer<typeof updateUserSchema>
type UpdatePasswordValues = z.infer<typeof updateUserPasswordSchema>

interface Address {
  id: number
  address: string
  country: string
  city: string
  department: string
  is_default: boolean
  created_at?: Date
}

type Section = 'info' | 'edit' | 'password' | 'addresses'

export default function Profile() {
      const { data: session, status } = useSession();
        const { userProfile, isLoading, reFetchUserProfile } = useUser()

  const [currentSection, setCurrentSection] = useState<Section>('info');

  // Verificar email verificad  o para editar perfil
  useEffect(() => {
    if (session?.user && !userProfile?.email_verified && currentSection !== 'info') {
      toast.error('Debes verificar tu email antes de editar tu perfil', {
        description: 'Revisa tu bandeja de entrada y verifica tu email.',
        duration: 5000,
      });
      setCurrentSection('info');
    }
  }, [session, currentSection]);

  const [activeSection, setActiveSection] = useState<Section>('info')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingFavorites, setLoadingFavorites] = useState(false)

  // Fetch favorites
  const fetchFavorites = async () => {
    if (!session?.user?.id) return
    try {
      setLoadingFavorites(true)
      const favoritesData = await getUserFavoritesApi(Number(session.user.id))
      setFavorites(favoritesData)
    } catch (error) {
      console.error("Error al obtener favoritos:", error)
    } finally {
      setLoadingFavorites(false)
    }
  }

  const fetchOrders = async () => {
    if (!session?.user?.id) return
    try {
      const ordersData = await getUserOrdersApi()
      setOrders(ordersData)
    } catch (error) {
      console.error("Error al obtener órdenes:", error)
    }
  }

  // Fetch addresses
  const fetchAddresses = async () => {
    if (!session?.user?.id) return
    try {
      const response = await getUserAddresses(Number(session.user.id))
      if (response.success && response.data) {
        setAddresses(response.data)
      }
    } catch (error) {
      console.error("Error al obtener direcciones:", error)
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      fetchAddresses()
      fetchFavorites()
      fetchOrders()
    }
  }, [session?.user?.id])

  const form = useForm<UpdateUserValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      phone_number: userProfile?.phone_number || "",
      address: "",
      identification: userProfile?.identification || "",
    },
    values: {
      id: Number(session?.user?.id),
      name: userProfile?.name || "",
      email: userProfile?.email || "",
      phone_number: userProfile?.phone_number || "",
      address: "",
      identification: userProfile?.identification || "",
    },
  })

  const form2 = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updateUserPasswordSchema),
    defaultValues: {
      id: Number(session?.user?.id),
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    values: {
      id: Number(session?.user?.id),
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onSubmitEditInfo = async (values: UpdateUserValues) => {
    try {
      const updateData: any = {
        id: Number(session?.user?.id),
      }
      if (values.name && values.name.trim() !== "") {
        updateData.name = values.name.trim()
      }
      if (values.email && values.email.trim() !== "") {
        updateData.email = values.email.trim()
      }
      if (values.phone_number) {
        updateData.phone_number = values.phone_number.trim()
      }
      if (values.identification !== undefined) {
        updateData.identification = values.identification?.trim() || null
      }
      await updateUser(updateData)
      reFetchUserProfile()
      setActiveSection('info')
    } catch (err) {
      console.error("Error al actualizar el usuario:", err)
    }
  }

  const onSubmitEditPassword = async (values: UpdatePasswordValues) => {
    try {
      const isValid = await bcrypt.compare(values.currentPassword, userProfile?.password || "")

      if (!isValid) {
        console.error("Contraseña actual incorrecta")
        throw new Error("Contraseña actual incorrecta")
      }
      await updatePassword({ id: values.id, newPassword: values.newPassword })
      form2.reset()
      setActiveSection('info')
    } catch (err) {
      console.error("Error al actualizar la contraseña:", err)
    }
  }

  const handleImageUpdate = async () => {
    await reFetchUserProfile()
  }

  const handleAddressChange = async () => {
    await fetchAddresses()
    await reFetchUserProfile()
  }

  const profileData = [
    {
      icon: User,
      label: "Nombre",
      value: userProfile?.name || "No especificado",
      color: "text-blue-400",
      bgColor: "bg-slate-800/50",
      borderColor: "border-slate-700/50",
    },
    {
      icon: Mail,
      label: "Correo Electrónico",
      value: userProfile?.email || "No especificado",
      color: "text-indigo-400",
      bgColor: "bg-slate-800/50",
      borderColor: "border-slate-700/50",
    },
    {
      icon: Phone,
      label: "Teléfono",
      value: userProfile?.phone_number || "No especificado",
      color: "text-cyan-400",
      bgColor: "bg-slate-800/50",
      borderColor: "border-slate-700/50",
    },
    {
      icon: MapPin,
      label: "Direcciones",
      value: `${addresses.length} registrada${addresses.length !== 1 ? 's' : ''}`,
      color: "text-purple-400",
      bgColor: "bg-slate-800/50",
      borderColor: "border-slate-700/50",
    },
    {
      icon: CreditCard,
      label: "Identificación",
      value: userProfile?.identification || "No especificado",
      color: "text-emerald-400",
      bgColor: "bg-slate-800/50",
      borderColor: "border-slate-700/50",
    },
  ]

  // Muestra el esqueleto de carga mientras se obtiene la sesión o los datos del usuario
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 py-8">
        <ProfileSkeleton />
      </div>
    )
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-6 px-4 md:px-6 lg:px-8 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Floating light orbs background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 left-20 w-96 h-96 bg-purple-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-slate-600/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-3rem)]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Sidebar izquierda */}
          <motion.div
            className="lg:col-span-3"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="sticky top-6 border border-slate-700/50 shadow-2xl bg-gradient-to-br from-slate-900/98 via-slate-900/95 to-slate-800/98 backdrop-blur-2xl overflow-hidden">
              <CardContent className="p-6 space-y-6">
                {/* Avatar y nombre */}
                <div className="flex flex-col items-center text-center space-y-4 pb-6 border-b border-slate-700/50">
                  <ProfileImageUpload
                    userId={Number(session?.user?.id)}
                    currentImage={userProfile?.image || session?.user?.image || ""}
                    userName={userProfile?.name || session?.user?.name || "Usuario"}
                    onImageUpdate={handleImageUpdate}
                  />
                  <div className="mt-16">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {userProfile?.name || "Usuario"}
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">{userProfile?.email || ""}</p>
                  </div>
                </div>

                {/* Navegación */}
                <nav className="space-y-2">
                  <motion.button
                    onClick={() => setActiveSection('info')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeSection === 'info'
                        ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/20"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }`}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <User className="w-5 h-5" />
                    <span className="font-semibold">Mi Perfil</span>
                  </motion.button>

                  <motion.button
                    onClick={() => setActiveSection('edit')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeSection === 'edit'
                        ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/20"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }`}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Edit2Icon className="w-5 h-5" />
                    <span className="font-semibold">Editar Perfil</span>
                  </motion.button>

                  <motion.button
                    onClick={() => setActiveSection('password')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeSection === 'password'
                        ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/20"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }`}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Lock className="w-5 h-5" />
                    <span className="font-semibold">Seguridad</span>
                  </motion.button>

                  <motion.button
                    onClick={() => setActiveSection('addresses')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeSection === 'addresses'
                        ? "bg-gradient-to-r from-blue-600/20 to-slate-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/20"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }`}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MapPin className="w-5 h-5" />
                    <span className="font-semibold">Direcciones</span>
                  </motion.button>
                </nav>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contenido principal */}
          <motion.div
            className="lg:col-span-9"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border border-slate-700/50 shadow-2xl bg-gradient-to-br from-slate-900/98 via-slate-900/95 to-slate-800/98 backdrop-blur-2xl overflow-hidden min-h-[calc(100vh-3rem)]">
              {/* Gradient accent lines */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
              
              <CardContent className="p-8 relative z-10">

              {/* Information section */}
              <AnimatePresence mode="wait">
                {activeSection === 'info' && (
                  <motion.div
                    key="info"
                    className="space-y-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/50">
                      <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-slate-400 bg-clip-text text-transparent">
                          Información del Perfil
                        </h2>
                        <p className="text-slate-400 mt-1">Gestiona tu información personal</p>
                      </div>
                      <motion.div
                        className="p-3 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl border border-blue-500/30"
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        <Settings className="w-6 h-6 text-blue-400" />
                      </motion.div>
                    </div>

                    {/* Info Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profileData.map((item, index) => (
                        <motion.div
                          key={index}
                          className="relative group"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          whileHover={{ y: -2, scale: 1.01 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-slate-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative p-5 rounded-xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300">
                            <div className="flex items-start gap-4">
                              <div className={`p-3 rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 ${item.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                <item.icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 group-hover:text-slate-400 transition-colors">
                                  {item.label}
                                </p>
                                <p className="text-base text-slate-200 font-semibold truncate group-hover:text-white transition-colors">
                                  {item.value}
                                </p>
                              </div>
                            </div>
                            {/* Corner accent */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent rounded-bl-3xl" />
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Stats Section */}
                    <motion.div
                      className="mt-8 p-6 rounded-xl bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-slate-900/20 border border-blue-500/20"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-400" />
                        Resumen de Cuenta
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 rounded-lg bg-slate-800/50">
                          <div className="text-2xl font-bold text-blue-400">{addresses.length}</div>
                          <div className="text-xs text-slate-400 mt-1">Direcciones</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-slate-800/50">
                          <div className="text-2xl font-bold text-purple-400">{orders.length}</div>
                          <div className="text-xs text-slate-400 mt-1">Pedidos</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-slate-800/50">
                          <div className="text-2xl font-bold text-slate-400">{favorites.length}</div>
                          <div className="text-xs text-slate-400 mt-1">Favoritos</div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Edit Info */}
              <AnimatePresence mode="wait">
                {activeSection === 'edit' && (
                  <motion.div
                    key="editForm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Header */}
                    <div className="mb-8 pb-4 border-b border-slate-700/50">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-slate-400 bg-clip-text text-transparent">
                        Editar Información
                      </h2>
                      <p className="text-slate-400 mt-1">Actualiza tu información personal</p>
                    </div>

                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmitEditInfo)}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Campo Nombre */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
                                    <User className="h-4 w-4 text-blue-400" />
                                    Nombre completo
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Ingresa tu nombre completo"
                                      {...field}
                                      className="h-12 border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 bg-slate-800/50 text-slate-200 placeholder:text-slate-500 rounded-lg transition-all duration-300 hover:border-slate-600"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-400" />
                                </FormItem>
                              )}
                            />
                          </motion.div>

                          {/* Campo Email */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          >
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
                                    <Mail className="h-4 w-4 text-purple-400" />
                                    Correo electrónico
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="tu@email.com"
                                      {...field}
                                      className="h-12 border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:shadow-lg focus:shadow-blue-500/20 bg-slate-800/50 text-slate-200 placeholder:text-slate-500 rounded-lg transition-all duration-300"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-400" />
                                </FormItem>
                              )}
                            />
                          </motion.div>

                          {/* Campo Teléfono */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                          >
                            <FormField
                              control={form.control}
                              name="phone_number"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
                                    <Phone className="h-4 w-4 text-cyan-400" />
                                    Teléfono
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="+57 300 123 4567"
                                      {...field}
                                      className="h-12 border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:shadow-lg focus:shadow-blue-500/20 bg-slate-800/50 text-slate-200 placeholder:text-slate-500 rounded-lg transition-all duration-300"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-400" />
                                </FormItem>
                              )}
                            />
                          </motion.div>

                          {/* Campo Identificación */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                            className="md:col-span-2"
                          >
                            <FormField
                              control={form.control}
                              name="identification"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
                                    <CreditCard className="h-4 w-4 text-emerald-400" />
                                    Identificación
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Número de identificación"
                                      {...field}
                                      className="h-12 border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:shadow-lg focus:shadow-blue-500/20 bg-slate-800/50 text-slate-200 placeholder:text-slate-500 rounded-lg transition-all duration-300"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-400" />
                                </FormItem>
                              )}
                            />
                          </motion.div>
                        </div>

                        <motion.div
                          className="flex justify-end gap-4 pt-6 border-t border-slate-700/50 mt-8"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.6 }}
                        >
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setActiveSection('info')}
                              className="border-2 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600 hover:text-white transition-all duration-300 h-12 bg-slate-800/50 rounded-lg px-8 font-semibold"
                            >
                              Cancelar
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              type="submit"
                              className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-500 hover:via-purple-500 hover:to-blue-600 text-white h-12 rounded-lg px-8 shadow-xl hover:shadow-blue-500/50 transition-all duration-300 font-bold overflow-hidden group"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                              <span className="relative z-10">Guardar Cambios</span>
                            </Button>
                          </motion.div>
                        </motion.div>
                      </form>
                    </Form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Edit Password */}
              <AnimatePresence mode="wait">
                {activeSection === 'password' && (
                  <motion.div
                    key="passwordForm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Header */}
                    <div className="mb-8 pb-4 border-b border-slate-700/50">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-slate-400 bg-clip-text text-transparent">
                        Seguridad y Contraseña
                      </h2>
                      <p className="text-slate-400 mt-1">Actualiza tu contraseña para mantener tu cuenta segura</p>
                    </div>

                    <Form {...form2}>
                      <form
                        onSubmit={form2.handleSubmit(onSubmitEditPassword)}
                        className="space-y-6"
                      >
                        <div className="space-y-6 max-w-2xl">
                          {/* Campo Contraseña Actual */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <FormField
                              control={form2.control}
                              name="currentPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2 text-slate-300 font-semibold">
                                    <Lock className="h-4 w-4 text-red-400" />
                                    Contraseña actual
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative group">
                                      <Input
                                        type={showCurrentPassword ? "text" : "password"}
                                        placeholder="Ingresa tu contraseña actual"
                                        {...field}
                                        className="h-12 border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-slate-800/50 text-slate-200 placeholder:text-slate-500 rounded-xl pr-12 transition-all duration-300"
                                      />
                                      <motion.button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-400 transition-colors duration-200"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                      >
                                        {showCurrentPassword ? (
                                          <EyeOff className="h-4 w-4" />
                                        ) : (
                                          <Eye className="h-4 w-4" />
                                        )}
                                      </motion.button>
                                    </div>
                                  </FormControl>
                                  <FormMessage className="text-red-400" />
                                </FormItem>
                              )}
                            />
                          </motion.div>

                          {/* Campo Nueva Contraseña */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          >
                            <FormField
                              control={form2.control}
                              name="newPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2 text-slate-300 font-semibold">
                                    <Lock className="h-4 w-4 text-blue-400" />
                                    Nueva contraseña
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative group">
                                      <Input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="Ingresa tu nueva contraseña"
                                        {...field}
                                        className="h-12 border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-slate-800/50 text-slate-200 placeholder:text-slate-500 rounded-xl pr-12 transition-all duration-300"
                                      />
                                      <motion.button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-400 transition-colors duration-200"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                      >
                                        {showNewPassword ? (
                                          <EyeOff className="h-4 w-4" />
                                        ) : (
                                          <Eye className="h-4 w-4" />
                                        )}
                                      </motion.button>
                                    </div>
                                  </FormControl>
                                  <FormMessage className="text-red-400" />
                                </FormItem>
                              )}
                            />
                          </motion.div>

                          {/* Campo Confirmar Contraseña */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                          >
                            <FormField
                              control={form2.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2 text-slate-300 font-semibold">
                                    <Lock className="h-4 w-4 text-green-400" />
                                    Confirmar contraseña
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative group">
                                      <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirma tu nueva contraseña"
                                        {...field}
                                        className="h-12 border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-slate-800/50 text-slate-200 placeholder:text-slate-500 rounded-xl pr-12 transition-all duration-300"
                                      />
                                      <motion.button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-400 transition-colors duration-200"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                      >
                                        {showConfirmPassword ? (
                                          <EyeOff className="h-4 w-4" />
                                        ) : (
                                          <Eye className="h-4 w-4" />
                                        )}
                                      </motion.button>
                                    </div>
                                  </FormControl>
                                  <FormMessage className="text-red-400" />
                                </FormItem>
                              )}
                            />
                          </motion.div>

                          {/* Mensaje de éxito o error */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                            className="col-span-1"
                          >
                            <div className="text-center">
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-sm text-green-400 font-semibold"
                              >
                                Contraseña actualizada con éxito
                              </motion.p>
                            </div>
                          </motion.div>

                          <motion.div
                            className="flex justify-end gap-4 pt-6 border-t border-slate-700/50 mt-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.6 }}
                          >
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setActiveSection('info')}
                                className="border-2 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-all duration-200 h-12 bg-slate-800/50 rounded-lg px-8"
                              >
                                Cancelar
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                type="submit"
                                className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 hover:from-purple-500 hover:via-blue-500 hover:to-purple-600 text-white h-12 rounded-lg px-8 shadow-lg hover:shadow-purple-500/30 transition-all duration-200 font-bold"
                              >
                                Actualizar Contraseña
                              </Button>
                            </motion.div>
                          </motion.div>
                        </div>
                      </form>
                    </Form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Address Management Section */}
              <AnimatePresence mode="wait">
                {activeSection === 'addresses' && (
                  <motion.div
                    key="addressManagement"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Header */}
                    <div className="mb-8 pb-4 border-b border-slate-700/50">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-slate-400 to-purple-400 bg-clip-text text-transparent">
                        Gestión de Direcciones
                      </h2>
                      <p className="text-slate-400 mt-1">Administra tus direcciones de envío (máximo 3)</p>
                    </div>

                    <AddressManagement
                      userId={Number(session?.user?.id)}
                      addresses={addresses}
                      onAddressChange={handleAddressChange}
                    />
                    
                    <motion.div
                      className="flex justify-end gap-4 pt-6 mt-8 border-t border-slate-700/50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="button"
                          onClick={() => setActiveSection('info')}
                          className="border-2 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-all duration-200 h-12 bg-slate-800/50 rounded-lg px-8"
                          variant="outline"
                        >
                          Volver al perfil
                        </Button>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      </div>
    </motion.div>
  )
}