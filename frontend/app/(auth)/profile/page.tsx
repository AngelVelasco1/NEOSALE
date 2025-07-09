"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SignOut } from "@/app/(auth)/components/SingOut"
import { User, Camera, Mail, Phone, MapPin, Edit2Icon, Shield, Lock, CreditCard } from "lucide-react"
import { useUser } from "../context/UserContext"
import { useSession } from "next-auth/react"
import { Select, SelectValue, SelectItem, SelectContent, SelectTrigger } from "@/components/ui/select"
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { updateUserSchema } from "@/lib/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { updateUser } from "../services/api"



type UpdateUserValues = z.infer<typeof updateUserSchema>

// Un componente de esqueleto para una mejor experiencia de carga
const ProfileSkeleton = () => (
  <div className="container mx-auto px-4 max-w-4xl animate-pulse">
    <div className="text-center mb-8">
      <div className="h-10 bg-gray-300 rounded-md w-1/3 mx-auto mb-2"></div>
      <div className="h-4 bg-gray-200 rounded-md w-1/2 mx-auto"></div>
    </div>
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl shadow-purple-500/10 overflow-hidden">
      <div className="relative h-32 bg-gray-300">
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="w-32 h-32 rounded-full bg-gray-400 border-4 border-white"></div>
        </div>
      </div>
      <CardContent className="pt-20 pb-8">
        <div className="text-center mb-8">
          <div className="h-8 bg-gray-300 rounded-md w-1/2 mx-auto mb-1"></div>
          <div className="h-4 bg-gray-200 rounded-md w-1/3 mx-auto"></div>
        </div>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded-md"></div>
          <div className="h-10 bg-gray-200 rounded-md"></div>
          <div className="h-10 bg-gray-200 rounded-md"></div>
        </div>
      </CardContent>
    </Card>
  </div>
);


export const Profile = () => {
  const { data: session, status } = useSession();
  const { userProfile, isLoading, setSelectedAddress, selectedAddress } = useUser();
  const [showEditUser, setShowEditUser] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  const form = useForm<UpdateUserValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      phoneNumber: userProfile?.phonenumber || "",
      address: selectedAddress || "",
      identification: userProfile?.identification || "",
      password: "",
      role: userProfile?.role || "user",
    },
    values: {
      id: Number(session?.user?.id),
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      phoneNumber: userProfile?.phonenumber || "",
      address: selectedAddress || "",
      identification: userProfile?.identification || "",
      password: "",
      role: userProfile?.role || "user",
    }
  });

  const onSubmitForm = async(values: UpdateUserValues) => {
    try {
      console.log("Valores del formulario:", values); // Para debugging
      
      // Preparar los datos, omitiendo valores vacíos o undefined
      const updateData: any = {
        id: Number(session?.user?.id),
      };

      // Solo agregar campos que tienen valores
      if (values.name && values.name.trim() !== "") {
        updateData.name = values.name.trim();
      }
      
      if (values.email && values.email.trim() !== "") {
        updateData.email = values.email.trim();
      }
      
      if (values.phoneNumber && values.phoneNumber.trim() !== "") {
        updateData.phoneNumber = values.phoneNumber.trim();
      }
      
      if (values.identification && values.identification.trim() !== "") {
        updateData.identification = values.identification.trim();
      }
      
      if (values.password && values.password.trim() !== "") {
        updateData.password = values.password;
      }
      
      if (values.role) {
        updateData.role = values.role;
      }

      // Siempre incluir emailVerified si está disponible
      updateData.emailVerified = session?.user?.emailVerified || false;
      
      
      await updateUser(updateData);
      
      setShowEditUser(false);
      setShowInfo(true);
      
      
    } catch(err) {
      console.error("Error al actualizar el usuario:", err);
    }
  }

  const handleShowEditForm = () => {
    setShowEditUser(!showEditUser);
    setShowInfo(!showInfo);
  }
  // Muestra el esqueleto de carga mientras se obtiene la sesión o los datos del usuario
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-fuchsia-50 py-8">
        <ProfileSkeleton />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-fuchsia-50 py-8">
      <div className="container mx-auto px-10 max-w-4xl">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl shadow-purple-500/10 overflow-hidden">
          <div className="relative h-32 ">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 " />
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-white shadow-2xl">
                  <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-3xl font-bold">
                    {session.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
                >
                  <Camera className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <CardContent className="pt-20 pb-8">
            {/* User Info Header */}
            <div className="text-center mb-8 ">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Perfil de {session?.user?.name || "Usuario"}</h2>
            </div>
            <div className={`bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100 pb-8 pt-6 ${showInfo ? "block" : "hidden"}`}>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center text-lg gap-2">

                Información
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <span className="font-medium text-gray-700"><User className="h-4 w-4 text-blue-600 inline me-2" />Nombre:</span>
                  <p className="text-gray-600 inline ms-2">{session?.user?.name || "No especificado"}</p>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-700"> <Mail className="h-4 w-4 text-purple-600 inline me-2" />Email:</span>
                  <p className="text-gray-600 inline ms-2">{session?.user?.email || "No especificado"}</p>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-700"> <Phone className="h-4 w-4 text-emerald-600 inline me-2" />Teléfono:</span>
                  <p className="text-gray-600 inline ms-2">{userProfile?.phonenumber || "No especificado"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700"> <MapPin className="h-4 w-4 text-red-600 inline me-2" />Dirección:</span>
                  <p>{selectedAddress}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700"> <CreditCard className="h-4 w-4 text-green-600 inline me-2" />Identificación:</span>
                  <p className="text-gray-600 inline ms-2">{userProfile?.identification || "No especificado"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700"> <Shield className="h-4 w-4 text-orange-600 inline me-2" />Rol:</span>
                  <p className="text-gray-600 inline ms-2">{userProfile?.role || "user"}</p>
                </div>

                {session?.user?.image && (
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">URL de imagen:</span>
                    <p className="text-gray-600 break-all">{session?.user.image}</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <button onClick={handleShowEditForm} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:outline-none cursor-pointer">
                  <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-white rounded-md group-hover:bg-transparent text-gray-900  group-hover:text-white">
                    <Edit2Icon className="inline h-4 w-4 me-2" />
                    Editar Perfil
                  </span>
                </button>
              </div>

            </div>
            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitForm)} className={`space-y-6 ${showEditUser ? "block" : "hidden"}`}>
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
                          <Input  placeholder="Ingresa tu nombre completo" {...field} />
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
                          <Mail className="h-5 w-5 text-purple-600" />
                          Correo electrónico
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="tu@email.com" {...field} />
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
                          <Input placeholder="+57 300 123 4567" {...field}  />
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
                            setSelectedAddress(value);
                            field.onChange(value);
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
                              <SelectItem
                                key={index}
                                value={address.address}
                              >
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
                          <Input placeholder="Número de identificación" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Campo Contraseña */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                          <Lock className="h-4 w-4 text-red-600" />
                          Nueva Contraseña (opcional)
                        </FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Dejar vacío para no cambiar" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Campo Rol */}
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                          <Shield className="h-4 w-4 text-orange-600" />
                          Rol
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full border-gray-300 bg-white shadow-sm hover:shadow-md focus:shadow-md focus:ring-2 focus:ring-blue-500">
                              <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="user">Usuario</SelectItem>
                            <SelectItem value="admin">Administrador</SelectItem>
                          </SelectContent>
                        </Select>
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
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  >
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            </Form>

            <div className="pt-6  border-gray-200 mt-6">
              <div className="flex justify-center">
                <SignOut />
              </div>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default Profile;