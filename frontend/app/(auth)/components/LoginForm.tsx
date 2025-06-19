"use client"

import React from 'react';
import Link from "next/link"
import { useState } from 'react';
import { loginSchema } from '@/lib/zod';
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, User } from "lucide-react"
import { signIn } from "next-auth/react"

type loginFormValues = z.infer<typeof loginSchema>

export const LoginForm: React.FC = ()  => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<loginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

    const onSubmit = async (formData: FormData) => {
      setIsLoading(true);
       const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };
      await signIn("credentials", data);
      setIsLoading(false);

    }


    return(
        <div className="bg-gray-50">
        <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <div className="max-w-md w-full">
        

          <div className="p-8 rounded-2xl bg-white shadow">
            <h2 className="text-slate-900 text-center text-3xl font-semibold">Iniciar sesión</h2>
            <Form {...form}>
              <form className="space-y-6" action={onSubmit}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor='credentials-email' className="text-slate-800 text-sm font-medium">Email</FormLabel>
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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor='credentials-password' className="text-slate-800 text-sm font-medium">Contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password" }
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

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="text-sm">
                    <Link href="/forgot-password" className="text-blue-600 hover:underline font-semibold">
                      ¿Olvidaste contraseña?
                    </Link>
                  </div>
                </div>

                <div className="pt-6">
                  <Button type='submit' className="w-full" value="Sign In" disabled={isLoading}>
                    {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                  </Button>
                </div>

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