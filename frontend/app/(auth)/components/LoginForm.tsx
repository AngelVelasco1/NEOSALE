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
import { Eye, EyeOff, User, Lock, Sparkles } from "lucide-react";
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
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50/30">
      <div className="min-h-screen flex flex-col items-center justify-center">
        <motion.div 
          className="max-w-lg w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div 
            className="px-10 py-12 rounded-2xl bg-white/80 backdrop-blur-sm shadow-2xl border border-gray-100/50"
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
              <div className="flex items-center justify-center gap-2 mb-4">
            
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent font-montserrat">
                  Iniciar sesión
                </h2>
              </div>
             
            </motion.div>

            <Form {...form}>
              <form
                className="space-y-6"
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
                        <FormLabel className="text-gray-800 text-sm font-semibold">
                          Email
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              type="email"
                              placeholder="ejemplo@correo.com"
                              className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/60 backdrop-blur-sm rounded-xl transition-all duration-300 group-hover:shadow-md"
                              {...field}
                            />
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                          </div>
                        </FormControl>
                        <FormMessage />
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
                        <FormLabel className="text-gray-800 text-sm font-semibold">
                          Contraseña
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Escribe tu contraseña"
                              className="pl-11 pr-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/60 backdrop-blur-sm rounded-xl transition-all duration-300 group-hover:shadow-md"
                              {...field}
                            />
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                            <motion.button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {showPassword ? (
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

                {/* Forgot Password */}
                <motion.div 
                  className="flex justify-end"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all duration-200 hover:scale-105"
                  >
                    ¿Olvidaste tu contraseña?
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
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Iniciando sesión...
                        </div>
                      ) : (
                        <span className="group-hover:scale-105 font-semibold transition-transform duration-200">
                          Iniciar sesión
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Divider */}
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-gray-500 font-medium">
                      O continuar con
                    </span>
                  </div>
                </motion.div>

                {/* Social Buttons */}
                <motion.div 
                  className="grid grid-cols-4 gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  {[
                    { 
                      icon: RiGoogleFill, 
                      color: "text-[#DB4437]", 
                      label: "Google",
                      onClick: () => signIn("google")
                    },
                    { 
                      icon: RiFacebookFill, 
                      color: "text-[#1877f2]", 
                      label: "Facebook" 
                    },
                    { 
                      icon: RiTwitterXFill, 
                      color: "text-[#14171a]", 
                      label: "X" 
                    },
                    { 
                      icon: RiGithubFill, 
                      color: "text-black", 
                      label: "GitHub" 
                    },
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
                          className="w-full h-12 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 rounded-xl"
                          aria-label={`Iniciar sesión con ${social.label}`}
                          onClick={social.onClick}
                        >
                          <social.icon
                            className={social.color}
                            size={20}
                            aria-hidden="true"
                          />
                        </Button>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Register Link */}
                <motion.div 
                  className="text-center pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  <p className="text-gray-600 text-sm">
                    ¿No tienes una cuenta?{" "}
                    <Link
                      href="/register"
                      className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all duration-200 hover:scale-105 inline-block"
                    >
                      Regístrate aquí
                    </Link>
                  </p>
                </motion.div>
              </form>
            </Form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};