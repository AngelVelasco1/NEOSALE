"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { registerSchema } from "@/lib/zod.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signIn, useSession } from "next-auth/react";
import { registerUser } from "../services/api";
import { ErrorsHandler } from "@/app/errors/errorsHandler";
import { motion } from "framer-motion";

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      emailVerified: undefined,
      password: "",
      phoneNumber: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (session?.user.role === "admin") {
      router.push("/dashboard");
    } else if (session?.user) {
      router.push("/");
    }
  }, [session, router]);

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);

    try {
      await registerUser({
        name: values.name,
        email: values.email,
        emailVerified: values.emailVerified,
        password: values.password,
        phoneNumber: values.phoneNumber || undefined,
      });

      ErrorsHandler.showSuccess(
        "Usuario registrado exitosamente",
        "Iniciando sesión..."
      );

      const signInResult = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (signInResult?.error) {
        ErrorsHandler.showError("Error al iniciar sesión", signInResult.error);
      }
      setSuccess(true);
    } catch (error: unknown) {
      if (!error.isHandledError) {
        await ErrorsHandler.handle(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50/30">
        <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
          <motion.div 
            className="max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-2xl border border-gray-100/50"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.4,
                    type: "spring",
                    bounce: 0.4
                  }}
                >
                  <CheckCircle className="mx-auto h-16 w-16 text-emerald-500 mb-4" />
                </motion.div>
                <motion.h2 
                  className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  ¡Cuenta creada exitosamente!
                </motion.h2>
                <motion.p 
                  className="text-gray-600 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  Te redirigiremos a la aplicación en unos segundos...
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50/30">
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
        <motion.div 
          className="max-w-lg w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div 
            className="px-10 py-10 rounded-2xl bg-white/80 backdrop-blur-sm shadow-2xl border border-gray-100/50"
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
                <motion.div
              
                    className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl animate-bounce"
                >
                  <UserPlus className="w-6 h-6 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent font-montserrat">
                  Crear cuenta
                </h2>
              </div>
              <p className="text-gray-600 font-medium">
                Completa tus datos para registrarte
              </p>
            </motion.div>

            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                {/* Name Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800 text-sm font-semibold">
                          Nombre completo{" "}
                          <span className="text-red-500 text-sm">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              type="text"
                              placeholder="Pepito Perez de los Palotes"
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

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800 text-sm font-semibold">
                          Email{" "}
                          <span className="text-red-500 text-sm">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              type="email"
                              placeholder="ejemplo@correo.com"
                              className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/60 backdrop-blur-sm rounded-xl transition-all duration-300 group-hover:shadow-md"
                              {...field}
                            />
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Phone Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800 text-sm font-semibold">
                          Número de teléfono
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              type="tel"
                              placeholder="3168457124"
                              className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/60 backdrop-blur-sm rounded-xl transition-all duration-300 group-hover:shadow-md"
                              {...field}
                            />
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
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
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800 text-sm font-semibold">
                          Contraseña{" "}
                          <span className="text-red-500 text-sm">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Mínimo 8 caracteres"
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

                {/* Confirm Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800 text-sm font-semibold">
                          Confirmar contraseña
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Repite tu contraseña"
                              className="pl-11 pr-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/60 backdrop-blur-sm rounded-xl transition-all duration-300 group-hover:shadow-md"
                              {...field}
                            />
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                            <motion.button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {showConfirmPassword ? (
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

                {/* Submit Button */}
                <motion.div 
                  className="pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
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
                          Creando cuenta...
                        </div>
                      ) : (
                        <span className="group-hover:scale-105 transition-transform duration-200">
                          Crear cuenta
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Login Link */}
                <motion.div 
                  className="text-center pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  <p className="text-gray-600 text-sm">
                    ¿Ya tienes cuenta?{" "}
                    <Link
                      href="/login"
                      className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all duration-200 hover:scale-105 inline-block"
                    >
                      Inicia sesión
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