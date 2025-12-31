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
import { Eye, EyeOff, User, Lock, ArrowRight } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  RiGoogleFill,
  RiTwitterXFill,
  RiFacebookFill,
} from "react-icons/ri";
import { ErrorsHandler } from "@/app/errors/errorsHandler";
import { useMounted } from "../hooks/useMounted";
import { motion } from "framer-motion";
import { toast } from "sonner";

type loginFormValues = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const mounted = useMounted();
  const searchParams = useSearchParams();

  const form = useForm<loginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (session?.user.role === "admin") {
      router.replace("/dashboard");
    } else if (session?.user) {
      router.replace("/");
    }
  }, [session, router]);

  // Manejar mensajes de verificación y errores en la URL
  useEffect(() => {
    const error = searchParams.get('error');
    const verified = searchParams.get('verified');

    if (error) {
      const errorMessages: Record<string, string> = {
        'token_invalido': 'El enlace de verificación es inválido',
        'token_expirado': 'El enlace de verificación ha expirado. Solicita uno nuevo.',
        'usuario_no_encontrado': 'Usuario no encontrado',
        'error_verificacion': 'Error al verificar el correo',
        'OAuthAccountNotLinked': 'Ya existe una cuenta con este correo electrónico'
      };

      // Si el error contiene el mensaje personalizado, usarlo directamente
      const errorMessage = error.includes('Ya existe una cuenta') 
        ? error 
        : errorMessages[error] || 'Ocurrió un error inesperado';

      toast.error('Error de autenticación', {
        description: errorMessage,
      });

      // Limpiar URL
    }

    if (verified === 'true' || verified === 'success') {
      toast.success('¡Email verificado!', {
        description: 'Tu correo ha sido verificado exitosamente. Ahora puedes iniciar sesión.',
        duration: 5000,
      });
      // Limpiar URL
      router.replace('/login');
    }
  }, [searchParams, router]);

  const onSubmit = async (values: loginFormValues) => {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        // Si falla el login, verificar si es por email no verificado
        if (result.error === "CredentialsSignin") {
          try {
            const response = await fetch('/api/auth/check-verification', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: values.email }),
            });

            const data = await response.json();

            // Si el usuario existe pero no está verificado
            if (data.exists && !data.verified) {
              toast.warning('Email no verificado', {
                description: 'Por favor verifica tu correo electrónico. Te hemos reenviado un enlace de verificación.',
                duration: 6000,
                action: {
                  label: 'Reenviar email',
                  onClick: async () => {
                    try {
                      await fetch('/api/auth/send-verification', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: values.email }),
                      });
                      toast.success('Email enviado', {
                        description: 'Revisa tu bandeja de entrada',
                      });
                    } catch (err) {
                      toast.error('Error al enviar email');
                    }
                  },
                },
              });
              return;
            }
          } catch (err) {
            console.error('Error checking verification:', err);
          }
          
          // Credenciales incorrectas
          ErrorsHandler.showError("Email o contraseña incorrectos", "INVALID_CREDENTIALS");
          return;
        }

        // Otros errores
        let errorMessage;
        let errorCode;

        switch (result.error) {
          case "AccessDenied":
            errorMessage = "Acceso denegado";
            errorCode = "ACCESS_DENIED";
            break;
          default:
            errorMessage = "Verifica tus credenciales e inténtalo de nuevo";
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

        // Prefetch del dashboard para carga más rápida
        router.prefetch("/dashboard");
        router.prefetch("/");
      }
    } catch (error: unknown) {
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
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-500/10 animate-pulse"
            style={{
              width: Math.random() * 8 + 3 + "px",
              height: Math.random() * 8 + 3 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animationDelay: Math.random() * 3 + "s",
              animationDuration: Math.random() * 3 + 2 + "s",
            }}
          />
        ))}
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>

      <div className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4">
        <motion.div
          className="max-w-md w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="px-8 py-10 rounded-3xl bg-slate-800/60 backdrop-blur-xl shadow-2xl border border-blue-500/20 hover:border-blue-500/30 transition-all duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center justify-center gap-2 mb-3"></div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-300 via-indigo-300 to-blue-300 bg-clip-text text-transparent mb-2">
                Iniciar Sesión
              </h2>
            </motion.div>

            <Form {...form}>
              <form
                className="space-y-5"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-200 text-sm font-semibold">
                          Email
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              type="email"
                              placeholder="ejemplo@correo.com"
                              className="pl-11 h-12 border-blue-500/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-slate-700/50 backdrop-blur-sm rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/10 text-blue-100 placeholder:text-slate-500"
                              {...field}
                            />
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors duration-200" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-200 text-sm font-semibold">
                          Contraseña
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Escribe tu contraseña"
                              className="pl-11 pr-11 h-12 border-blue-500/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-slate-700/50 backdrop-blur-sm rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/10 text-blue-100 placeholder:text-slate-500"
                              {...field}
                            />
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors duration-200" />
                            <motion.button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-400 transition-colors duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </motion.button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Forgot Password */}
                <motion.div
                  className="flex justify-end"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-400 hover:text-indigo-400 font-medium hover:underline transition-all duration-200 group flex items-center gap-1"
                  >
                    ¿Olvidaste tu contraseña?
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  className="pt-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 group"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Iniciando sesión...
                        </div>
                      ) : (
                        <span className="flex items-center gap-2 group-hover:gap-3 transition-all duration-200">
                          Iniciar sesión
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Divider */}
                <motion.div
                  className="relative py-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-blue-500/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-900/40 backdrop-blur-sm px-3 text-slate-400 font-medium">
                      O continuar con
                    </span>
                  </div>
                </motion.div>

                {/* Social Buttons */}
                <motion.div
                  className="grid grid-cols-3 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  {[
                    {
                      icon: RiGoogleFill,
                      color: "text-red-400",
                      hoverColor: "hover:bg-red-500/10 hover:border-red-500/30",
                      label: "Google",
                      onClick: () => signIn("google"),
                    },
                    {
                      icon: RiFacebookFill,
                      color: "text-blue-400",
                      hoverColor:
                        "hover:bg-blue-500/10 hover:border-blue-500/30",
                      label: "Facebook",
                    },
                    {
                      icon: RiTwitterXFill,
                      color: "text-slate-300",
                      hoverColor:
                        "hover:bg-slate-500/10 hover:border-slate-500/30",
                      label: "X",
                    }
                  ].map((social, index) => (
                    <motion.div
                      key={social.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className={`w-full h-12 border-blue-500/20 bg-slate-700/30 backdrop-blur-sm ${social.hoverColor} transition-all duration-200 rounded-xl`}
                          aria-label={`Iniciar sesión con ${social.label}`}
                          onClick={social.onClick}
                        >
                          <social.icon
                            className={social.color}
                            size={22}
                            aria-hidden="true"
                          />
                        </Button>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Register Link */}
                <motion.div
                  className="text-center pt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  <p className="text-slate-400 text-sm">
                    ¿No tienes cuenta?{" "}
                    <Link
                      href="/register"
                      className="text-blue-400 hover:text-indigo-400 font-semibold hover:underline transition-all duration-200 inline-flex items-center gap-1 group"
                    >
                      Regístrate
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </p>
                </motion.div>
              </form>
            </Form>
          </motion.div>

          {/* Security Badge */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
              <Lock className="w-3 h-3" />
              <span>Conexión segura y encriptada</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
