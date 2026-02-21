"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
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
import {
  Eye,
  EyeOff,
  User,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Star,
  ShoppingBag
} from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { RiGoogleFill, RiTwitterXFill, RiFacebookFill } from "react-icons/ri";
import { ErrorsHandler } from "@/app/errors/errorsHandler";
import { useMounted } from "../hooks/useMounted";
import { motion } from "framer-motion";
import { toast } from "sonner";

type loginFormValues = z.infer<typeof loginSchema>;

type TrustMetric = {
  value: string;
  label: string;
  helper: string;
};

type TrustMetricsResponse = {
  totalCustomers: number;
  totalProducts: number;
  positiveReviewRate: number;
};

const loginHighlights: {
  title: string;
  description: string;
  icon: React.ElementType;
  accent: string;
}[] = [
  {
    title: "Diseño intuitivo",
    description: "Interfaz limpia que facilita el acceso rápido a tus compras y productos",
    icon: ShieldCheck,
    accent: "from-emerald-400/30 to-blue-500/30",
  },
  {
    title: "Compras fluidas",
    description: "Autenticación en milisegundos y acceso instantáneo a tu historial.",
    icon: ShoppingBag,
    accent: "from-blue-400/30 to-indigo-500/30",
  }
];

const defaultTrustMetrics: TrustMetric[] = [
  { value: "--", label: "Compradores verificados", helper: "Cargando datos reales..." },
  { value: "--", label: "Pedidos entregados este mes", helper: "Sincronizando con el historial" },
  { value: "--", label: "Clientes que nos califican 5★", helper: "Validando reseñas recientes" },
];

export const LoginForm: React.FC = (): React.ReactNode => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [trustMetrics, setTrustMetrics] = useState<TrustMetric[]>(defaultTrustMetrics);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const mounted = useMounted();
  const searchParams = useSearchParams();
  const hasRedirected = useRef(false);

  // Check if we already redirected (persists across component mounts)
  const hasRedirectedSession: string | null = typeof window !== 'undefined' ? sessionStorage.getItem('login-redirected') : null;

  const form = useForm<loginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect authenticated users away from login page ONLY if we're on /login
  useEffect(() => {
    // CRITICAL: Only run this redirect if we're actually on the login page
    if (pathname !== "/login") {
      return;
    }

    // Check persistent redirect flag
    if (hasRedirectedSession === 'true') {
      return;
    }
    
    if (status === "loading") {
      return;
    }

    if (hasRedirected.current) {
      return;
    }
    
    if (session?.user) {
      hasRedirected.current = true;
      sessionStorage.setItem('login-redirected', 'true');
      
      // Redirect based on role
      if (session.user.role === "admin") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/";
      }
    }
  }, [session, status, pathname, hasRedirectedSession]);

  useEffect(() => {
    const error = searchParams.get("error");
    const verified = searchParams.get("verified");

    if (error) {
      const errorMessages: Record<string, string> = {
        token_invalido: "El enlace de verificación es inválido",
        token_expirado: "El enlace de verificación ha expirado. Solicita uno nuevo.",
        usuario_no_encontrado: "Usuario no encontrado",
        error_verificacion: "Error al verificar el correo",
        OAuthAccountNotLinked: "Ya existe una cuenta con este correo electrónico",
      };

      const errorMessage = error.includes("Ya existe una cuenta")
        ? error
        : errorMessages[error] || "Ocurrió un error inesperado";

      toast.error("Error de autenticación", {
        description: errorMessage,
      });
    }

    if (verified === "true" || verified === "success") {
      toast.success("¡Email verificado!", {
        description: "Tu correo ha sido verificado exitosamente. Ahora puedes iniciar sesión.",
        duration: 5000,
      });
      router.replace("/login");
    }
  }, [searchParams, router]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchTrustMetrics = async () => {
      try {
        const response = await fetch("/api/trust-metrics", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          cache: "no-cache",
        });

        if (!response.ok) {
          return;
        }

        const data: TrustMetricsResponse = await response.json();
        const numberFormatter = new Intl.NumberFormat("es-CO");
 
        setTrustMetrics([
          {
            value: numberFormatter.format(data.totalCustomers),
            label: "Compradores verificados",
            helper: "Personas que ya confiaron en NeoSale",
          },
          {
            value: numberFormatter.format(data.totalProducts),
            label: "Productos disponibles",
            helper: "Cantidad de productos en el catálogo",
          },
          {
            value: `${data.positiveReviewRate}%`,
            label: "Clientes que nos califican 5★",
            helper: `Tasa de reseñas positivas`,
          },
        ]);
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        
      }
    };

    fetchTrustMetrics();

    return () => controller.abort();
  }, []);

  const onSubmit = async (values: loginFormValues) => {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          try {
            const response = await fetch("/api/auth/check-verification", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: values.email }),
            });

            const data = await response.json();

            if (data.exists && !data.verified) {
              toast.warning("Email no verificado", {
                description: "Por favor verifica tu correo electrónico. Te hemos reenviado un enlace de verificación.",
                duration: 6000,
                action: {
                  label: "Reenviar email",
                  onClick: async () => {
                    try {
                      await fetch("/api/auth/send-verification", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: values.email }),
                      });
                      toast.success("Email enviado", {
                        description: "Revisa tu bandeja de entrada",
                      });
                    } catch (err) {
                      toast.error("Error al enviar email");
                    }
                  },
                },
              });
              return;
            }
          } catch (err) {
            
          }

          ErrorsHandler.showError("Email o contraseña incorrectos", "INVALID_CREDENTIALS");
          return;
        }

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
        
        // Mark that we're redirecting to prevent any useEffect from interfering
        hasRedirected.current = true;
        sessionStorage.setItem('login-redirected', 'true');
        
        // Wait for NextAuth to fully establish the session
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Fetch fresh session to get role information
        const sessionResponse = await fetch('/api/auth/session', {
          credentials: 'include',
          cache: 'no-store'
        });
        const sessionData = await sessionResponse.json();
        
        // Additional small delay to ensure cookies are fully written
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Hard redirect - proxy now validates full session, not just cookies
        if (sessionData?.user?.role === "admin") {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/";
        }
      }
    } catch (error: unknown) {
      ErrorsHandler.showError("Error del servidor", "SERVER_ERROR");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-x-0 top-[-25%] h-[480px] bg-linear-to-br from-blue-600/30 via-indigo-700/20 to-fuchsia-600/20 blur-3xl" />
      <div className="absolute inset-x-0 bottom-[-40%] h-[520px] bg-gradient-to-tr from-slate-900 via-blue-900/40 to-transparent blur-3xl" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(28)].map((_, index) => (
          <div
            key={`particle-${index}`}
            className="absolute rounded-full bg-blue-400/15 animate-pulse"
            style={{
              width: `${Math.random() * 6 + 4}px`,
              height: `${Math.random() * 6 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2.5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="flex-1 w-full px-4 pt-10 pb-12 lg:px-10">
          <div className="mx-auto flex max-w-6xl flex-col gap-8">
            <div className="flex flex-col gap-3 rounded-3xl  bg-transparent px-6 py-6 shadow-[0_25px_80px_rgba(15,23,42,0.6)] backdrop-blur-2xl">
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-300">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] tracking-[0.45em] text-blue-200">
                  <ShieldCheck className="h-4 w-4 text-blue-300" />
                  Portal seguro
                </span>
          
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight text-transparent md:text-5xl bg-linear-to-r from-blue-200 via-cyan-300 to-indigo-200 bg-clip-text drop-shadow-[0_0_30px_rgba(14,165,233,0.25)]">
                  Inicia sesión y vive una experiencia NeoSale
                </h1>
                <p className="text-base text-slate-300 md:max-w-3xl">
                  Autenticación inmediata, inicia con cuentas sociales de forma rapida y segura.
                </p>
              </div>

           
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <motion.section
                className="relative overflow-hidden rounded-[32px] border border-white/10 bg-linear-to-br from-slate-900/70 via-slate-900/30 to-blue-900/40 p-8 shadow-2xl shadow-slate-950/60"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative z-10 space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
                    <Star className="h-4 w-4 text-blue-300" />
                    Experiencia premium
                  </div>
                  <div>
                    <h2 className="text-3xl font-semibold leading-tight text-white">
                      Un acceso diseñado para fluir con tus compras
                    </h2>
                    <p className="mt-3 text-md text-slate-300">
                      Miles de productos y ofertas exclusivas te esperan. 
                      Inicia sesión para descubrir beneficios que harán que tus compras sean más rápidas, seguras y satisfactorias.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    {trustMetrics.map((metric) => (
                      <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5">
                        <p className="text-3xl font-semibold text-white">{metric.value}</p>
                        <p className="text-sm text-slate-300">{metric.label}</p>
                        <p className="text-xs text-slate-500">{metric.helper}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 space-y-4">
                    {loginHighlights.map(({ title, description, icon: Icon, accent }) => (
                      <div
                        key={title}
                        className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/5 px-4 py-4"
                      >
                        <div className={`rounded-2xl bg-linear-to-br ${accent} p-3 text-white`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-white">{title}</p>
                          <p className="text-sm text-slate-300">{description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

          
                </div>

                <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-10 left-4 h-48 w-48 rounded-full bg-indigo-600/20 blur-3xl" />
              </motion.section>

              <motion.section
                className="relative"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
          

                <motion.div
                  className="relative rounded-[30px] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/60 backdrop-blur-2xl"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Form {...form}>
                    <form className="mt-6 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                      <div className="space-y-5">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-slate-200">Correo electrónico</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type="email"
                                    placeholder="ejemplo@correo.com"
                                    className="h-12 rounded-2xl border border-white/10 bg-slate-900/80 pl-12 pr-4 text-slate-100 placeholder:text-slate-500 focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500/30"
                                    {...field}
                                  />
                                  <User className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                </div>
                              </FormControl>
                              <FormMessage className="text-rose-300 text-xs" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-slate-200">Contraseña</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="h-12 rounded-2xl border border-white/10 bg-slate-900/80 pl-12 pr-12 text-slate-100 placeholder:text-slate-500 focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500/30"
                                    {...field}
                                  />
                                  <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-blue-200"
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                  >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage className="text-rose-300 text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                        <Link
                          href="/forgot-password"
                          className="inline-flex items-center gap-1 font-semibold text-blue-300 hover:text-indigo-300"
                        >
                          ¿Olvidaste tu contraseña?
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                        <p className="text-slate-400">Soporte prioritario 24/7</p>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="group h-12 w-full rounded-2xl bg-linear-to-r from-blue-600 via-indigo-600 to-fuchsia-600 font-semibold text-white shadow-lg shadow-blue-900/40 transition-all hover:shadow-xl"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            Iniciando sesión...
                          </div>
                        ) : (
                          <span className="flex items-center gap-2 cursor-pointer">
                            Iniciar sesión
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        )}
                      </Button>

                      <div className="relative py-3 text-xs uppercase tracking-[0.3em] text-slate-500">
                        <div className="absolute inset-0 flex items-center" aria-hidden>
                          <span className="w-full border-t border-white/5" />
                        </div>
                        <span className="relative mx-auto block w-max bg-slate-900/80 px-3">O continua con</span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        {[
                          {
                            icon: RiGoogleFill,
                            color: "text-red-400",
                            hoverColor: "hover:border-red-400/40 hover:bg-red-400/10",
                            label: "Google",
                            onClick: () => signIn("google"),
                          },
                          {
                            icon: RiFacebookFill,
                            color: "text-blue-400",
                            hoverColor: "hover:border-blue-400/40 hover:bg-blue-400/10",
                            label: "Facebook",
                            onClick: () => signIn("facebook"),
                          },
                          {
                            icon: RiTwitterXFill,
                            color: "text-slate-200",
                            hoverColor: "hover:border-slate-200/40 hover:bg-slate-200/10",
                            label: "X",
                          },
                        ].map((provider) => (
                          <Button
                            key={provider.label}
                            type="button"
                            variant="outline"
                            className={`flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 text-sm font-semibold text-slate-200 transition ${provider.hoverColor}`}
                            onClick={provider.onClick}
                            aria-label={`Iniciar sesión con ${provider.label}`}
                          >
                            <provider.icon className={provider.color} size={20} />
                            <span>{provider.label}</span>
                          </Button>
                        ))}
                      </div>

                    

                      <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 px-4 py-4 text-sm text-slate-300">
                        <p>
                          ¿Aún no tienes cuenta? {""}
                          <Link href="/register" className="font-semibold text-blue-300 hover:text-indigo-200">
                            Regístrate gratis
                          </Link>
                        </p>
                      </div>
                    </form>
                  </Form>
                </motion.div>
              </motion.section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
