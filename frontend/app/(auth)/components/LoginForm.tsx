import React from 'react';
import { useState } from 'react';
import { loginSchema } from '@/lib/zod';
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, User } from "lucide-react"

type loginFormValues = z.infer<typeof loginSchema>

export const LoginForm = ()  => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<loginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = () => {
    setIsLoading(true)
  }


    return(
        <div className="bg-gray-50">
        <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <div className="max-w-md w-full">
        

          <div className="p-8 rounded-2xl bg-white shadow">
            <h2 className="text-slate-900 text-center text-3xl font-semibold">Iniciar sesión</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Campo Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-800 text-sm font-medium">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type="email" placeholder="Escribe tu email" className="pr-10" {...field} />
                          <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
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
                      <FormLabel className="text-slate-800 text-sm font-medium">Contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Escribe tu contraseña"
                            className="pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Recordar usuario y Olvidaste contraseña */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="text-sm">
                    <Link href="/forgot-password" className="text-blue-600 hover:underline font-semibold">
                      ¿Olvidaste contraseña?
                    </Link>
                  </div>
                </div>

                {/* Botón de envío */}
                <div className="pt-6">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                  </Button>
                </div>

                {/* Link de registro */}
                <p className="text-slate-800 text-sm text-center">
                  ¿No tienes una cuenta?{" "}
                  <Link href="/register" className="text-blue-600 hover:underline ml-1 whitespace-nowrap font-semibold">
                    Regístrate aquí
                  </Link>
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
    )
}