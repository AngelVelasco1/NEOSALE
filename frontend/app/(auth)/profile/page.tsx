"use client"
import type { Session } from "next-auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SignOut } from "@/app/(auth)/components/SingOut"
import { User, Camera, Mail, Phone, MapPin } from "lucide-react"
import { useUser } from "../context/UserContext"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

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
  const { userProfile, isLoading } = useUser();

  

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
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Perfil de {session.user?.name || "Usuario"}</h2>
              <p className="text-gray-600">{session.user?.email}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100 pb-8 pt-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center text-lg gap-2">
                  
                  Información 
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700"><User className="h-4 w-4 text-blue-600 inline me-2" />Nombre:</span>
                    <p className="text-gray-600 inline ms-2">{session.user?.name || "No especificado"}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700"> <Mail className="h-4 w-4 text-purple-600 inline me-2" />Email:</span>
                    <p className="text-gray-600 inline ms-2">{session.user?.email || "No especificado"}</p>
                  </div>
                    <div className="flex items-center">
                    <span className="font-medium text-gray-700"> <Phone className="h-4 w-4 text-emerald-600 inline me-2" />Teléfono:</span>
                    <p className="text-gray-600 inline ms-2">{userProfile?.phonenumber || "No especificado"}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700"> <MapPin className="h-4 w-4 text-red-600 inline me-2"/>Dirección:</span>
                    <p className="text-gray-600 inline ms-2">{"No especificado"}</p>
                  </div>
                  {session.user?.image && (
                    <div className="md:col-span-2">
                      <span className="font-medium text-gray-700">URL de imagen:</span>
                      <p className="text-gray-600 break-all">{session.user.image}</p>
                    </div>
                  )}
                </div>
                </div>
            {/* Form */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2 text-gray-700 font-medium">
                    <User className="h-4 w-4 text-blue-600" />
                    Nombre completo
                  </Label>
                  <Input
                    id="name"
                    defaultValue={session.user?.name || ""}
                    placeholder="Ingresa tu nombre completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-gray-700 font-medium">
                    <Mail className="h-5 w-5 text-purple-600 inline me-2" />
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={session.user?.email || ""}
                    placeholder="tu@email.com"
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-gray-700 font-medium">
                    <Phone className="h-4 w-4 text-fuchsia-600" />
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    defaultValue={userProfile?.phonenumber || ""}
                    placeholder="+57 300 123 4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2 text-gray-700 font-medium">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    Dirección
                  </Label>
                  <Input
                    id="address"
                    placeholder="Calle 123 #45-67, Ciudad"
                  />
                </div>
              </div>
              
              {/* Sign Out */}
             
            </div>
  
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