"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SignOut } from "@/app/(auth)/components/SingOut"
import { User, Camera, Mail, Phone, MapPin, Edit2Icon, Lock, CreditCard, EyeOff, Eye } from "lucide-react"
import { useUser } from "../context/UserContext"
import { useSession } from "next-auth/react"
import { Select, SelectValue, SelectItem, SelectContent, SelectTrigger } from "@/components/ui/select"
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { updateUserSchema, updateUserPasswordSchema } from "@/lib/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { updateUser, updatePassword } from "../services/api"
import { ProfileSkeleton } from "../components/ProfileSkeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import bcrypt from "bcryptjs"

type UpdateUserValues = z.infer<typeof updateUserSchema>
type UpdatePasswordValues = z.infer<typeof updateUserPasswordSchema>

export const Profile = () => {
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
      phoneNumber: userProfile?.phonenumber || "",
      address: selectedAddress || "",
      identification: userProfile?.identification || "",
    },
    values: {
      id: Number(session?.user?.id),
      name: userProfile?.name || "",
      email: userProfile?.email || "",
      phoneNumber: userProfile?.phonenumber || "",
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
      if (values.phoneNumber) {
        updateData.phoneNumber = values.phoneNumber.trim()
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
    },
    {
      icon: Mail,
      label: "Email",
      value: userProfile?.email || "No especificado",
      color: "text-purple-600",
    },
    {
      icon: Phone,
      label: "Teléfono",
      value: userProfile?.phonenumber || "No especificado",
      color: "text-fuchsia-600",
    },
    {
      icon: MapPin,
      label: "Dirección",
      value: selectedAddress || "No especificada",
      color: "text-blue-600",
    },
    {
      icon: CreditCard,
      label: "Identificación",
      value: userProfile?.identification || "No especificado",
      color: "text-green-600",
    },
  ]

  // Muestra el esqueleto de carga mientras se obtiene la sesión o los datos del usuario
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-fuchsia-50 py-8">
        <ProfileSkeleton />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-fuchsia-50 py-8">
      <div className="max-w-3xl mx-auto ">
        {/* Header with gradient background */}
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 rounded-t-2xl" />

                           
        
          {/* Avatar section */}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 z-20">
            <div
              className="relative group cursor-pointer"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                <AvatarFallback className="text-white text-4xl font-semibold bg-transparent">
                  {getInitials(userProfile?.name || "Usuario")}
                </AvatarFallback>
              </Avatar>

              {/* Camera icon overlay */}
              <div
                className={`absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${isHovering ? "scale-110" : ""}`}
              >
                <Camera className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main content card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-t-none z-10 relative">
          <CardContent className="p-8 pt-16 "> {/* Agregado pt-16 para dar espacio al avatar */}
            {/* Profile title */}
            <div className="text-center mb-8 ">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Perfil de {userProfile?.name || "Usuario"}</h1>
              <p className="text-gray-500 text-md">Información personal</p>
            </div>

            {/* Information section */}
            <div className={`space-y-6 mb-8    ${showInfo ? "block" : "hidden"}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6  rounded-2xl">
              {profileData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl  transition-colors duration-200"
                >
                  <div className={`p-2 rounded-lg bg-white shadow-sm ${item.color}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-500 mb-1">{item.label}</p>
                    <p className="text-gray-900 font-medium truncate">{item.value}</p>
                  </div>
                </div>
              ))}
              </div>

              <Separator className="my-8" />

              {/* Action buttons */}
              <div className="space-y-4 ">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <Button
                    onClick={handleShowEditPassword}
                    variant="outline"
                    className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 h-12 bg-transparent"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Cambiar Contraseña
                  </Button>
                  <Button
                    onClick={handleShowEditForm}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12"
                  >
                    <Edit2Icon className="w-4 h-4 mr-2" />
                    Editar Perfil
                  </Button>
                </div>
              </div>
            </div>

            {/* Form Edit Info */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitEditInfo)}
                className={`space-y-6 ${showEditUser ? "block" : "hidden"}`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Campo Nombre */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                          <User className="h-4 w-4 text-blue-600" />
                          Nombre completo
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingresa tu nombre completo"
                            {...field}
                            className="border-gray-300 bg-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Campo Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                          <Mail className="h-4 w-4 text-purple-600" />
                          Correo electrónico
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="tu@email.com" {...field} className="border-gray-300 bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Campo Teléfono */}
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                          <Phone className="h-4 w-4 text-fuchsia-600" />
                          Teléfono
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="+57 300 123 4567" {...field} className="border-gray-300 bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Campo Dirección */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                          <MapPin className="h-4 w-4 text-blue-600" />
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
                            <SelectTrigger className="w-full border-gray-300 bg-white shadow-sm hover:shadow-md focus:shadow-md focus:ring-2 focus:ring-blue-500">
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
                  {/* Campo Identificación */}
                  <FormField
                    control={form.control}
                    name="identification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                          <CreditCard className="h-4 w-4 text-green-600" />
                          Identificación
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Número de identificación"
                            {...field}
                            className="border-gray-300 bg-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleShowEditForm}
                    className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 h-10 bg-transparent"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white h-10">
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            </Form>

            {/* Form Edit Password */}
            <Form {...form2}>
              <form
                onSubmit={form2.handleSubmit(onSubmitEditPassword)}
                className={`space-y-6  ${showEditPassword ? "block" : "hidden"}`}
              >
                <div className="space-y-6 w-1/2 mx-auto mb-16">
                  {/* Campo Contraseña Actual */}
                  <FormField
                    control={form2.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                          <Lock className="h-4 w-4 text-red-600" />
                          Contraseña actual
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showCurrentPassword ? "text" : "password"}
                              placeholder="Ingresa tu contraseña actual"
                              {...field}
                              className="border-gray-300 bg-white pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Campo Nueva Contraseña */}
                  <FormField
                    control={form2.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                          <Lock className="h-4 w-4 text-blue-600" />
                          Nueva contraseña
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showNewPassword ? "text" : "password"}
                              placeholder="Ingresa tu nueva contraseña"
                              {...field}
                              className="border-gray-300 bg-white pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Campo Confirmar Contraseña */}
                  <FormField
                    control={form2.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                          <Lock className="h-4 w-4 text-green-600" />
                          Confirmar nueva contraseña
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirma tu nueva contraseña"
                              {...field}
                              className="border-gray-300 bg-white pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end gap-3 ">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleShowEditForm}
                    className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 h-10 bg-transparent  "
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white h-10">
                    Actualizar Contraseña
                  </Button>
                </div>
              </form>
            </Form>

            {/* Logout section */}
           
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Profile
