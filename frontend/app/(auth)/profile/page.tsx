
import type { Session } from "next-auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SignOut } from "@/app/(auth)/components/SingOut"
import { User, Camera, Save, Edit3, Mail, Phone, MapPin, FileText } from "lucide-react"
import { auth } from "@/auth"
import {UserPhone} from "../components/UserPhone"

interface ProfilePageProps {
  session: Session
}

export const Profile = async () => {
const session = await auth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-fuchsia-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
            Mi Perfil
          </h1>
          <p className="text-gray-600">Administra tu información personal</p>
        </div>

        {/* Profile Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl shadow-purple-500/10 overflow-hidden">
          {/* Header with gradient */}
          <div className="relative h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-fuchsia-600">
            <div className="absolute inset-0 bg-black/10" />
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
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Perfil de {session.user?.name || "Usuario"}</h2>
              <p className="text-gray-600">{session.user?.email}</p>
              {session.user?.image && <p className="text-sm text-gray-500 mt-1">Imagen: {session.user.image}</p>}
              <div className="flex justify-center mt-4">
              
                  <Edit3 className="h-4 w-4 mr-2" />
        
              </div>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2 text-gray-700 font-medium">
                    <User className="h-4 w-4 text-blue-600" />
                    Nombre completo
                  </Label>
                  <Input
                    id="name"
                    
                    placeholder="Ingresa tu nombre completo"
                  />
                  
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-gray-700 font-medium">
                    <Mail className="h-4 w-4 text-purple-600" />
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    
                    
                    placeholder="tu@email.com"
                  />
                  
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-gray-700 font-medium">
                    <Phone className="h-4 w-4 text-fuchsia-600" />
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                   
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

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="flex items-center gap-2 text-gray-700 font-medium">
                  <FileText className="h-4 w-4 text-purple-600" />
                  Biografía
                </Label>
                <Textarea
                  id="bio"                 
                  placeholder="Cuéntanos un poco sobre ti..."
                />
              </div>

              {/* Session Info Display */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  Información 
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Nombre:</span>
                    <p className="text-gray-600 inline ms-2">{session.user?.name || "No especificado"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <p className="text-gray-600 inline ms-2">{session.user?.email || "No especificado"}</p>
                  </div>
                    <UserPhone />
                  {session.user?.image && (
                    <div className="md:col-span-2">
                      <span className="font-medium text-gray-700">URL de imagen:</span>
                      <p className="text-gray-600 break-all">{session.user.image}</p>
                    </div>
                  )}
                </div>
              </div>             

              {/* Sign Out */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex justify-center">
                  <SignOut />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">12</div>
              <div className="text-blue-100">Pedidos realizados</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">2024</div>
              <div className="text-fuchsia-100">Miembro desde</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile;