"use client";
import type React from "react";
import { useState, useEffect, useMemo } from "react";
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
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
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
import { useSession } from "next-auth/react";
import { registerUser } from "../services/api";
import { ErrorsHandler } from "@/app/errors/errorsHandler";
import { motion } from "framer-motion";

type PasswordStrengthLevel = {
  label: string;
  description: string;
  accent: string;
  segmentClass: string;
};

type ParticleStyle = React.CSSProperties;

const generateParticleField = (count: number): ParticleStyle[] =>
  Array.from({ length: count }, () => ({
    width: `${Math.random() * 8 + 3}px`,
    height: `${Math.random() * 8 + 3}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 3}s`,
    animationDuration: `${Math.random() * 3 + 2}s`,
  }));

const passwordStrengthLevels: PasswordStrengthLevel[] = [
  {
    label: "Muy débil",
    description: "Agrega más caracteres para comenzar.",
    accent: "text-rose-400",
    segmentClass: "bg-rose-500/80",
  },
  {
    label: "Débil",
    description: "Incluye mayúsculas o números.",
    accent: "text-orange-400",
    segmentClass: "bg-orange-500/80",
  },
  {
    label: "Intermedia",
    description: "Añade símbolos para reforzarla.",
    accent: "text-amber-400",
    segmentClass: "bg-amber-400/80",
  },
  {
    label: "Segura",
    description: "Buen equilibrio de requisitos.",
    accent: "text-emerald-400",
    segmentClass: "bg-emerald-400/80",
  },
  {
    label: "Muy segura",
    description: "Tu contraseña es robusta.",
    accent: "text-emerald-300",
    segmentClass: "bg-emerald-300",
  },
];

const getPasswordStrengthLevel = (score: number): PasswordStrengthLevel =>
  passwordStrengthLevels[
    Math.min(score, passwordStrengthLevels.length - 1)
  ];

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const successParticles = useMemo(() => generateParticleField(15), []);
  const heroParticles = useMemo(() => generateParticleField(24), []);

  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      emailVerified: undefined,
      password: "",
      phone_number: "",
      confirmPassword: "",
    },
  });

  const [watchedName, watchedEmail, watchedPassword, watchedConfirmPassword, watchedPhone] =
    form.watch([
      "name",
      "email",
      "password",
      "confirmPassword",
      "phone_number",
    ]);

  const completion = (() => {
    const values = [
      watchedName,
      watchedEmail,
      watchedPassword,
      watchedConfirmPassword,
      watchedPhone,
    ];
    const filled = values.filter(
      (value) => typeof value === "string" && value.trim().length > 0
    ).length;
    return Math.round((filled / values.length) * 100);
  })();

  const completionDisplay = Math.min(100, Math.max(0, completion || 0));

  const passwordValue = watchedPassword ?? "";

  const passwordChecks = useMemo(
    () => [
      {
        label: "8+ caracteres",
        satisfied: passwordValue.length >= 8,
      },
      {
        label: "1 mayúscula",
        satisfied: /[A-Z]/.test(passwordValue),
      },
      {
        label: "1 minúscula",
        satisfied: /[a-z]/.test(passwordValue),
      },
      {
        label: "1 número",
        satisfied: /\d/.test(passwordValue),
      },
      {
        label: "1 símbolo",
        satisfied: /[^A-Za-z0-9]/.test(passwordValue),
      },
    ],
    [passwordValue]
  );

  const passwordScore = passwordChecks.filter((check) => check.satisfied).length;
  const passwordLevel = useMemo(
    () => getPasswordStrengthLevel(passwordScore),
    [passwordScore]
  );

  const errorCount = Object.keys(form.formState.errors).length;
  const showErrorSummary = form.formState.isSubmitted && errorCount > 0;

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
      const userData = {
        name: values.name,
        email: values.email,
        emailVerified: values.emailVerified,
        password: values.password,
        phone_number: values.phone_number || undefined,
      };

      // Registrar usuario
      await registerUser(userData);

      // Enviar email de verificación automáticamente
      try {
        await fetch('/api/auth/send-verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: values.email }),
        });
      } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        // No bloquear el registro si falla el envío del email
      }

      ErrorsHandler.showSuccess(
        "¡Registro exitoso!",
        "Te hemos enviado un correo de verificación. Por favor revisa tu bandeja de entrada."
      );

      // No intentar login automático - el usuario debe verificar primero
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
          {successParticles.map((style, index) => (
            <div
              key={index}
              className="absolute rounded-full bg-blue-500/10 animate-pulse"
              style={style}
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
                  ¡Revisa tu correo!
                </motion.h2>
                <motion.p
                  className="text-slate-300 mb-2 text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  Te hemos enviado un correo de verificación
                </motion.p>
                <motion.p
                  className="text-slate-400 mb-6 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  Haz clic en el enlace del correo para verificar tu cuenta y poder iniciar sesión
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30"
                  >
                    Ir al inicio de sesión
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {heroParticles.map((style, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-blue-500/10 animate-pulse"
            style={style}
          />
        ))}
      </div>

      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/25 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />

      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 relative z-10">
        <motion.div
          className="max-w-2xl w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="relative px-8 py-10 md:px-12 md:py-12 rounded-[32px] bg-slate-900/70 backdrop-blur-2xl border border-slate-700/60 shadow-2xl shadow-blue-900/40 overflow-hidden"
            initial={{ opacity: 0.85, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 right-6 w-56 h-56 bg-gradient-to-br from-sky-500/30 to-indigo-500/30 blur-3xl" />
              <div className="absolute -bottom-16 left-10 w-44 h-44 bg-gradient-to-br from-fuchsia-500/20 to-blue-500/20 blur-3xl" />
            </div>

            <div className="relative z-10">
              <motion.div
                className="text-center mb-10 space-y-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
              
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-200 via-indigo-200 to-sky-200 bg-clip-text text-transparent">
                  Crea tu cuenta
                </h2>
              
              </motion.div>

              <div className="space-y-6 mb-8">
                <div>
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-500">
                    <span>Progreso</span>
                    <span className="block w-28 text-right font-mono tabular-nums tracking-normal normal-case text-slate-400">
                      {completionDisplay}% completado
                    </span>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-slate-800/70 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500"
                      animate={{ width: `${Math.max(completionDisplay, 6)}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>

              {showErrorSummary && (
                <motion.div
                  className="mb-8 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Revisa {errorCount} campo{errorCount > 1 ? "s" : ""} pendiente{errorCount > 1 ? "s" : ""}
                  </p>
                  <p className="text-rose-200/80 text-xs mt-1">
                    Corrige la información destacada en rojo para continuar con el registro.
                  </p>
                </motion.div>
              )}

              <Form {...form}>
                <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                  <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-slate-800 text-blue-200">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Paso 1
                        </p>
                        <p className="text-lg font-semibold text-white">
                          Datos personales
                        </p>
                        <p className="text-sm text-slate-400">
                          Empleamos tus datos solo para confirmar compras y enviarte novedades.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-200 text-sm font-semibold">
                              Nombre completo
                              <span className="text-rose-400 ml-1">*</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Input
                                  type="text"
                                  autoComplete="name"
                                  placeholder="Pepito Pérez"
                                  className="pl-11 pr-4 h-12 border border-slate-700/60 bg-slate-900/40 rounded-xl text-slate-100 placeholder:text-slate-500 focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500/30 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-900/30"
                                  {...field}
                                />
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-200" />
                              </div>
                            </FormControl>
                            <FormMessage className="text-rose-300 text-xs mt-1" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-200 text-sm font-semibold">
                              Correo electrónico
                              <span className="text-rose-400 ml-1">*</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Input
                                  type="email"
                                  autoComplete="email"
                                  placeholder="ejemplo@correo.com"
                                  className="pl-11 pr-4 h-12 border border-slate-700/60 bg-slate-900/40 rounded-xl text-slate-100 placeholder:text-slate-500 focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500/30 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-900/30"
                                  {...field}
                                />
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-200" />
                              </div>
                            </FormControl>
                            <FormMessage className="text-rose-300 text-xs mt-1" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone_number"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-slate-200 text-sm font-semibold flex items-center gap-2">
                              Número de teléfono
                              <span className="text-slate-500 text-xs font-normal">
                                (opcional)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Input
                                  type="tel"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  maxLength={10}
                                  autoComplete="tel"
                                  placeholder="316 000 0000"
                                  className="pl-11 pr-4 h-12 border border-slate-700/60 bg-slate-900/40 rounded-xl text-slate-100 placeholder:text-slate-500 focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500/30 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-900/30"
                                  value={field.value ?? ""}
                                  onChange={(event) =>
                                    field.onChange(event.target.value.replace(/[^\d]/g, ""))
                                  }
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                />
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-200" />
                              </div>
                            </FormControl>
                            <FormMessage className="text-rose-300 text-xs mt-1" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>

                  <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-slate-800 text-blue-200">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Paso 2
                        </p>
                        <p className="text-lg font-semibold text-white">
                          Credenciales y seguridad
                        </p>
                        <p className="text-sm text-slate-400">
                          Evaluamos tu contraseña en tiempo real y te guiamos para hacerla más fuerte.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-200 text-sm font-semibold">
                              Contraseña
                              <span className="text-rose-400 ml-1">*</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Mínimo 8 caracteres"
                                  autoComplete="new-password"
                                  className="pl-11 pr-11 h-12 border border-slate-700/60 bg-slate-900/40 rounded-xl text-slate-100 placeholder:text-slate-500 focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500/30 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-900/30"
                                  {...field}
                                />
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-200" />
                                <motion.button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-400 transition-colors duration-200"
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
                            <FormMessage className="text-rose-300 text-xs mt-1" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-200 text-sm font-semibold">
                              Confirmar contraseña
                              <span className="text-rose-400 ml-1">*</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Input
                                  type={showConfirmPassword ? "text" : "password"}
                                  placeholder="Vuelve a escribirla"
                                  autoComplete="new-password"
                                  className="pl-11 pr-11 h-12 border border-slate-700/60 bg-slate-900/40 rounded-xl text-slate-100 placeholder:text-slate-500 focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500/30 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-900/30"
                                  {...field}
                                />
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-200" />
                                <motion.button
                                  type="button"
                                  onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                  }
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-400 transition-colors duration-200"
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
                            <FormMessage className="text-rose-300 text-xs mt-1" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {
                      passwordValue && (
                        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/30 p-5" aria-live="polite">
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-slate-300 font-semibold">Nivel de seguridad</p>
                          <p className={`text-xs ${passwordLevel.accent}`}>
                            {passwordLevel.description}
                          </p>
                        </div>
                        <span className={`text-sm font-semibold ${passwordLevel.accent}`}>
                          {passwordLevel.label}
                        </span>
                      </div>
                      <div className="mt-4 flex gap-2">
                        {passwordChecks.map((_, index) => (
                          <span
                            key={index}
                            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                              index < passwordScore
                                ? passwordLevel.segmentClass
                                : "bg-slate-800/80"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {passwordChecks.map((check) => (
                          <div
                            key={check.label}
                            className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition-all duration-200 ${
                              check.satisfied
                                ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-200"
                                : "border-slate-800 bg-slate-900/40 text-slate-400"
                            }`}
                          >
                            {check.satisfied ? (
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-amber-400" />
                            )}
                            <span>{check.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                      )
                    }
                  </section>

                  <div className="space-y-4 pt-4">
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 hover:from-blue-500 hover:via-indigo-500 hover:to-fuchsia-500 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl shadow-blue-900/40"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Creando cuenta...
                          </div>
                        ) : (
                          <span className="flex items-center gap-2">
                            Crear cuenta
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        )}
                      </Button>
                    </motion.div>

                    <p className="text-xs text-slate-500 text-center">
                      Al continuar aceptas nuestras políticas de privacidad y términos de servicio.
                    </p>

                    <p className="text-center text-sm text-slate-400">
                      ¿Ya tienes cuenta?
                      <Link
                        href="/login"
                        className="ml-2 text-blue-300 hover:text-indigo-300 font-semibold inline-flex items-center gap-1"
                      >
                        Inicia sesión
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </p>
                  </div>
                </form>
              </Form>
            </div>
          </motion.div>

          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Conexión segura y cifrada (TLS 1.3)</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}