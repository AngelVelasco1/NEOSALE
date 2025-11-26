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
  ArrowRight,
  Sparkles,
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
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
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

        <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4 relative z-10">
          <motion.div
            className="max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="p-8 rounded-3xl bg-slate-800/60 backdrop-blur-xl shadow-2xl border border-blue-500/20"
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
                    bounce: 0.4,
                  }}
                >
                  <CheckCircle className="mx-auto h-16 w-16 text-emerald-400 mb-4" />
                </motion.div>
                <motion.h2
                  className="text-3xl font-bold bg-linear-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  ¡Cuenta creada exitosamente!
                </motion.h2>
                <motion.p
                  className="text-slate-400 mb-4"
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

      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 relative z-10">
        <motion.div
          className="max-w-lg w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="px-10 py-10 rounded-3xl bg-slate-800/60 backdrop-blur-xl shadow-2xl border border-blue-500/20 hover:border-blue-500/30 transition-all duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Header */}
            <motion.div
              className="text-center mb-8"
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <h2 className="text-3xl font-bold bg-linear-to-r from-blue-300 via-indigo-300 to-blue-300 bg-clip-text text-transparent font-montserrat">
                  Crear Cuenta
                </h2>
              </div>
            </motion.div>

            <Form {...form}>
              <form
                className="space-y-5"
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
                        <FormLabel className="text-blue-200 text-sm font-semibold">
                          Nombre completo{" "}
                          <span className="text-red-400 text-sm">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              type="text"
                              placeholder="Pepito Perez de los Palotes"
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
                        <FormLabel className="text-blue-200 text-sm font-semibold">
                          Email <span className="text-red-400 text-sm">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              type="email"
                              placeholder="ejemplo@correo.com"
                              className="pl-11 h-12 border-blue-500/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-slate-700/50 backdrop-blur-sm rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/10 text-blue-100 placeholder:text-slate-500"
                              {...field}
                            />
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors duration-200" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
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
                        <FormLabel className="text-blue-200 text-sm font-semibold">
                          Número de teléfono
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              type="tel"
                              placeholder="3168457124"
                              className="pl-11 h-12 border-blue-500/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-slate-700/50 backdrop-blur-sm rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/10 text-blue-100 placeholder:text-slate-500"
                              {...field}
                            />
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors duration-200" />
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
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-200 text-sm font-semibold">
                          Contraseña{" "}
                          <span className="text-red-400 text-sm">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Mínimo 8 caracteres"
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
                        <FormLabel className="text-blue-200 text-sm font-semibold">
                          Confirmar contraseña
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Repite tu contraseña"
                              className="pl-11 pr-11 h-12 border-blue-500/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-slate-700/50 backdrop-blur-sm rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/10 text-blue-100 placeholder:text-slate-500"
                              {...field}
                            />
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors duration-200" />
                            <motion.button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-400 transition-colors duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {showConfirmPassword ? (
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
                      className="w-full h-12 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 group"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Creando cuenta...
                        </div>
                      ) : (
                        <span className="flex items-center gap-2 group-hover:gap-3 transition-all duration-200">
                          Crear cuenta
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Login Link */}
                <motion.div
                  className="text-center pt-6 "
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  <p className="text-slate-400 text-sm">
                    ¿Ya tienes cuenta?{" "}
                    <Link
                      href="/login"
                      className="text-blue-400 hover:text-indigo-400 font-semibold hover:underline transition-all duration-200 inline-flex items-center gap-1 group"
                    >
                      Inicia sesión
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
            transition={{ duration: 0.5, delay: 1.1 }}
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
