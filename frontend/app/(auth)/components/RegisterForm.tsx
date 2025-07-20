"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { registerSchema } from "@/lib/zod.ts";
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { Eye, EyeOff, User, Mail, Phone, Lock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { signIn, useSession } from "next-auth/react";
import { registerUser } from "../services/api";


type RegisterFormValues = z.infer<typeof registerSchema>

export const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const router = useRouter()
  const {data: session} = useSession();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      emailVerified: undefined,
      password: "",
      phoneNumber: "",
      confirmPassword: ""
    },
  })  
  useEffect(() => {
      if (session?.user.role === "admin") {
        router.push("/dashboard");
      } else if(session?.user) {
          router.push("/");
      }
    }, [session]);

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      await registerUser({
        name: values.name,
        email: values.email,
        emailVerified: values.emailVerified,
        password: values.password,
        phoneNumber: values.phoneNumber || undefined,
      })

     setSuccess(true)
     await signIn("credentials", {
             email: values.email,
             password: values.password,        
             redirect: false,
           });
    
      
    } catch (error: any) {
      setError(error.message || "Error del servidor")
      console.error(`Registration error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
          <div className="max-w-md w-full">
            <div className="p-8 rounded-2xl bg-white shadow-xl border border-gray-100">
              <div className="text-center">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <h2 className="text-slate-900 text-2xl font-semibold mb-2">¡Cuenta creada exitosamente!</h2>
                <p className="text-slate-600 mb-4">Te redirigiremos a la aplicacion en unos segundos...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="min-h-screen flex flex-col items-center py-8 px-4">
        <div className="max-w-md w-full">
          <div className="px-8 py-6 rounded-2xl bg-white shadow-xl border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-slate-900 text-3xl font-bold mb-2">Crear cuenta</h2>
              <p className="text-slate-600">Completa tus datos para registrarte</p>
            </div>

            <Form {...form}>
              <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-800 text-sm font-medium">Nombre completo <span className="text-red-700/90 text-lg">*</span></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="Pepito Perez de los Palotes"
                            className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          />
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-800 text-sm font-medium">Email <span className="text-red-700/90 text-lg">*</span></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="email"
                            placeholder="ejemplo@correo.com"
                            className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          />
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-800 text-sm font-medium">Número de teléfono</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="tel"
                            placeholder="3168457124"
                            className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          />
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-800 text-sm font-medium">Contraseña <span className="text-red-700/90 text-lg">*</span></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mínimo 8 caracteres"
                            className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          />
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-800 text-sm font-medium">Confirmar contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Repite tu contraseña"
                            className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          />
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                    {error}
                  </div>
                )}

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creando cuenta...
                      </div>
                    ) : (
                      "Crear cuenta"
                    )}
                  </Button>
                </div>

                <div className="text-center pt-4">
                  <p className="text-slate-600 text-sm">
                    ¿Ya tienes una cuenta?{" "}
                    <Link
                      href="/login"
                      className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                    >
                      Inicia sesión aquí
                    </Link>
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
