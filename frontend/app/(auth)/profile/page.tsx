"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Camera, Mail, Phone, MapPin, Edit2Icon, Lock, CreditCard, EyeOff, Eye, Settings } from "lucide-react"
import { useUser } from "../context/UserContext"
import { useSession } from "next-auth/react"
import { Select, SelectValue, SelectItem, SelectContent, SelectTrigger } from "@/components/ui/select"
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { updateUserSchema, updateUserPasswordSchema } from "@/lib/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useState } from "react"
import { updateUser, updatePassword } from "../services/api"
import { ProfileSkeleton } from "../components/ProfileSkeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { motion, AnimatePresence } from "framer-motion"
import bcrypt from "bcryptjs"

type UpdateUserValues = z.infer<typeof updateUserSchema>
type UpdatePasswordValues = z.infer<typeof updateUserPasswordSchema>

export default function Profile() {
  const { data: session, status } = useSession()
  const { userProfile, isLoading, setSelectedAddress, selectedAddress, reFetchUserProfile } = useUser()
  const [showEditUser, setShowEditUser] = useState(false)
  const [showInfo, setShowInfo] = useState(true)
  const [showEditPassword, setShowEditPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const form = useForm<UpdateUserValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      phone_number: userProfile?.phone_number || "",
      address: selectedAddress || "",
      identification: userProfile?.identification || "",
    },
    values: {
      id: Number(session?.user?.id),
      name: userProfile?.name || "",
      email: userProfile?.email || "",
      phone_number: userProfile?.phone_number || "",
      address: selectedAddress || "",
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
      setShowEditUser(!showEditUser)
      setShowInfo(!showInfo)
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
      setShowEditPassword(!showEditPassword)
      setShowInfo(!showInfo)
    } catch (err) {
      console.error("Error al actualizar la contraseña:", err)
    }
  }

  const handleShowEditForm = () => {
    if (showEditPassword) {
      setShowEditUser(showEditUser)
      setShowInfo(!showInfo)
      setShowEditPassword(!showEditPassword)
    }
    if (showEditUser || showInfo) {
      setShowEditUser(!showEditUser)
      setShowInfo(!showInfo)
    }
  }

  const handleShowEditPassword = () => {
    setShowEditPassword(!showEditPassword)
    setShowInfo(!showInfo)
    setShowEditUser(showEditUser)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const profileData = [
    {
      icon: User,
      label: "Nombre",
      value: userProfile?.name || "No especificado",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Mail,
      label: "Email",
      value: userProfile?.email || "No especificado",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      icon: Phone,
      label: "Teléfono",
      value: userProfile?.phone_number || "No especificado",
      color: "text-sky-600",
      bgColor: "bg-sky-50",
    },
    {
      icon: MapPin,
      label: "Dirección",
      value: selectedAddress || "No especificada",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: CreditCard,
      label: "Identificación",
      value: userProfile?.identification || "No especificado",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ]

  // Muestra el esqueleto de carga mientras se obtiene la sesión o los datos del usuario
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50/30 py-8">
        <ProfileSkeleton />
      </div>
    )
  }

  return (
    <motion.div
      className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50/30 py-8 px-4 md:px-8 lg:px-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header with linear background */}
        <motion.div
          className="relative"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="h-40 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-t-2xl relative overflow-hidden">
            {/* Decorative pattern */}
            <div className="absolute inset-0 bg-linear-to-r from-white/10 to-transparent"></div>
            <div className="absolute top-4 right-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="p-2 bg-white/20 rounded-full backdrop-blur-sm"
              >
                <Settings className="w-5 h-5 text-white" />
              </motion.div>
            </div>
          </div>

          {/* Avatar section */}
          <motion.div
            className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 z-20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.4,
              type: "spring",
              bounce: 0.4
            }}
          >
            <div
              className="relative group cursor-pointer"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Avatar className="w-32 h-32 border-4 border-white shadow-2xl bg-linear-to-br from-blue-500 to-purple-600">
                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                <AvatarFallback className="text-white text-4xl font-semibold bg-transparent">
                  {getInitials(userProfile?.name || "Usuario")}
                </AvatarFallback>
              </Avatar>

              {/* Camera icon overlay */}
              <motion.div
                className="absolute -bottom-1 -right-1 w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={isHovering ? { scale: 1.1 } : { scale: 1 }}
              >
                <Camera className="w-5 h-5 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Main content card */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm rounded-t-none rounded-b-2xl z-10 relative">
            <CardContent className="p-8 pt-20">
              {/* Profile title */}
              <motion.div
                className="text-center mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <h1 className="text-4xl font-bold bg-linear-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent mb-2">
                  Perfil de {userProfile?.name || "Usuario"}
                </h1>
              </motion.div>

              {/* Information section */}
              <AnimatePresence mode="wait">
                {showInfo && (
                  <motion.div
                    key="info"
                    className="space-y-8 mb-8"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {profileData.map((item, index) => (
                        <motion.div
                          key={index}
                          className={`flex items-center gap-4 p-6 rounded-2xl ${item.bgColor} border border-gray-100/50 hover:shadow-lg transition-all duration-300 group cursor-pointer`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          whileHover={{ y: -2 }}
                        >
                          <div className={`p-3 rounded-xl bg-white shadow-sm ${item.color} group-hover:scale-110 transition-transform duration-200`}>
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-500 mb-1">{item.label}</p>
                            <p className="text-gray-900 font-semibold truncate text-lg">{item.value}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <Separator className="my-8" />

                    {/* Action buttons */}
                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            onClick={handleShowEditPassword}
                            variant="outline"
                            className="w-full border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 h-14 bg-transparent rounded-xl font-semibold"
                          >
                            <Lock className="w-5 h-5 mr-2" />
                            Cambiar Contraseña
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            onClick={handleShowEditForm}
                            className="w-full bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-14 rounded-xl font-semibold"
                          >
                            <Edit2Icon className="w-5 h-5 mr-2" />
                            Editar Perfil
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Edit Info */}
              <AnimatePresence mode="wait">
                {showEditUser && (
                  <motion.div
                    key="editForm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmitEditInfo)}
                        className="space-y-8"
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
                                  <FormLabel className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
                                    <User className="h-4 w-4 text-blue-600" />
                                    Nombre completo
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Ingresa tu nombre completo"
                                      {...field}
                                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white rounded-xl transition-all duration-300"
                                    />
                                  </FormControl>
                                  <FormMessage />
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
                                  <FormLabel className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
                                    <Mail className="h-4 w-4 text-purple-600" />
                                    Correo electrónico
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="tu@email.com"
                                      {...field}
                                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white rounded-xl transition-all duration-300"
                                    />
                                  </FormControl>
                                  <FormMessage />
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
                                  <FormLabel className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
                                    <Phone className="h-4 w-4 text-sky-600" />
                                    Teléfono
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="+57 300 123 4567"
                                      {...field}
                                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white rounded-xl transition-all duration-300"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </motion.div>

                          {/* Campo Dirección */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                          >
                            <FormField
                              control={form.control}
                              name="address"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
                                    <MapPin className="h-4 w-4 text-purple-600" />
                                    Dirección
                                  </FormLabel>
                                  <Select
                                    onValueChange={(value) => {
                                      setSelectedAddress(value)
                                      field.onChange(value)
                                    }}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white rounded-xl transition-all duration-300">
                                        <SelectValue placeholder="Selecciona una dirección" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {userProfile?.addresses?.map((address, index) => (
                                        <SelectItem key={index} value={address.address}>
                                          {address.address}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </motion.div>

                          {/* Campo Identificación */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 }}
                            className="md:col-span-2"
                          >
                            <FormField
                              control={form.control}
                              name="identification"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
                                    <CreditCard className="h-4 w-4 text-emerald-600" />
                                    Identificación
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Número de identificación"
                                      {...field}
                                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white rounded-xl transition-all duration-300"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </motion.div>
                        </div>

                        <motion.div
                          className="flex justify-end gap-4 pt-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.6 }}
                        >
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleShowEditForm}
                              className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 h-12 bg-transparent rounded-xl px-6"
                            >
                              Cancelar
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              type="submit"
                              className="bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white h-12 rounded-xl px-6 shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                              Guardar Cambios
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
                {showEditPassword && (
                  <motion.div
                    key="passwordForm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Form {...form2}>
                      <form
                        onSubmit={form2.handleSubmit(onSubmitEditPassword)}
                        className="space-y-8"
                      >
                        <div className="space-y-6 max-w-md mx-auto">
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
                                  <FormLabel className="flex items-center gap-2 text-gray-700 font-semibold">
                                    <Lock className="h-4 w-4 text-red-600" />
                                    Contraseña actual
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative group">
                                      <Input
                                        type={showCurrentPassword ? "text" : "password"}
                                        placeholder="Ingresa tu contraseña actual"
                                        {...field}
                                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white rounded-xl pr-12 transition-all duration-300"
                                      />
                                      <motion.button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
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
                                  <FormMessage />
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
                                  <FormLabel className="flex items-center gap-2 text-gray-700 font-semibold">
                                    <Lock className="h-4 w-4 text-blue-600" />
                                    Nueva contraseña
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative group">
                                      <Input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="Ingresa tu nueva contraseña"
                                        {...field}
                                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white rounded-xl pr-12 transition-all duration-300"
                                      />
                                      <motion.button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
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
                                  <FormMessage />
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
                                  <FormLabel className="flex items-center gap-2 text-gray-700 font-semibold">
                                    <Lock className="h-4 w-4 text-green-600" />
                                    Confirmar contraseña
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative group">
                                      <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirma tu nueva contraseña"
                                        {...field}
                                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white rounded-xl pr-12 transition-all duration-300"
                                      />
                                      <motion.button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
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
                                  <FormMessage />
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
                                className="text-sm text-green-600 font-semibold"
                              >
                                Contraseña actualizada con éxito
                              </motion.p>
                            </div>
                          </motion.div>

                          <motion.div
                            className="flex justify-end gap-4 pt-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.6 }}
                          >
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handleShowEditPassword}
                                className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 h-12 bg-transparent rounded-xl px-6"
                              >
                                Cancelar
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                type="submit"
                                className="bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white h-12 rounded-xl px-6 shadow-lg hover:shadow-xl transition-all duration-200"
                              >
                                Guardar Cambios
                              </Button>
                            </motion.div>
                          </motion.div>
                        </div>
                      </form>
                    </Form>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}