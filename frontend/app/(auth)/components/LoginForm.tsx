"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { loginSchema } from "@/lib/zod";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  RiGoogleFill,
  RiGithubFill,
  RiTwitterXFill,
  RiFacebookFill,
} from "react-icons/ri";
import { ErrorsHandler } from "@/app/errors/errorsHandler";
import { useMounted } from "../hooks/useMounted";

type loginFormValues = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const mounted = useMounted();

  const form = useForm<loginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (session?.user.role === "admin") {
      router.push("/dashboard");
    } else if (session?.user) {
      router.push("/");
    }
  }, [session, router]);

  const onSubmit = async (values: loginFormValues) => {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        let errorMessage;
        let errorCode;

        switch (result.error) {
          case "CredentialsSignin":
            errorMessage = "Email o contraseña incorrectos";
            errorCode = "INVALID_CREDENTIALS";
            break;
          case "AccessDenied":
            errorMessage = "Acceso denegado";
            errorCode = "ACCESS_DENIED";
            break;
          default:
            errorMessage = "Error de autenticación. Inténtalo de nuevo.";
            errorCode = "AUTH_ERROR";
        }

        ErrorsHandler.showError(errorMessage, errorCode);
        return;
      }

      if (result?.ok) {
        ErrorsHandler.showSuccess(
          "Sesión iniciada correctamente",
          "Bienvenido de vuelta"
        );
      }
    } catch (error: any) {
      ErrorsHandler.showError("Error del servidor", "SERVER_ERROR");
      console.error(`Error interno del servidor: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  if (!mounted) {
    return null;
  }
  return (
    <div className="min-h-screen">
      <div className="min-h-screen flex flex-col items-center py-8 px-4">
        <div className="max-w-md w-full">
          <div className="px-8 py-6 rounded-2xl bg-white shadow-xl border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-slate-900 text-3xl font-bold mb-2 font-montserrat">
                Iniciar sesión
              </h2>
              <p className="text-slate-600">
                Ingresa tus credenciales para continuar
              </p>
            </div>

            <Form {...form}>
              <form
                className="space-y-5"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-800 text-sm font-medium">
                        Email
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="email"
                            placeholder="ejemplo@correo.com"
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-800 text-sm font-medium">
                        Contraseña
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Escribe tu contraseña"
                            className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          />
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Iniciando sesión...
                      </div>
                    ) : (
                      "Iniciar sesión"
                    )}
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    className="flex-1"
                    aria-label="Iniciar sesión con Google"
                    size="icon"
                    onClick={() => signIn("google")}
                  >
                    <RiGoogleFill
                      className="text-[#DB4437]"
                      size={16}
                      aria-hidden="true"
                    />
                  </Button>
                  <Button
                    type="button"
                    className="flex-1"
                    aria-label="Iniciar sesión con Facebook"
                    size="icon"
                  >
                    <RiFacebookFill
                      className="text-[#1877f2]"
                      size={16}
                      aria-hidden="true"
                    />
                  </Button>
                  <Button
                    type="button"
                    className="flex-1"
                    aria-label="Iniciar sesión con X"
                    size="icon"
                  >
                    <RiTwitterXFill
                      className="text-[#14171a]"
                      size={16}
                      aria-hidden="true"
                    />
                  </Button>
                  <Button
                    type="button"
                    className="flex-1"
                    aria-label="Iniciar sesión con GitHub"
                    size="icon"
                  >
                    <RiGithubFill
                      className="text-black"
                      size={16}
                      aria-hidden="true"
                    />
                  </Button>
                </div>

                <div className="text-center pt-4">
                  <p className="text-slate-600 text-sm">
                    ¿No tienes una cuenta?{" "}
                    <Link
                      href="/register"
                      className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                    >
                      Regístrate aquí
                    </Link>
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
