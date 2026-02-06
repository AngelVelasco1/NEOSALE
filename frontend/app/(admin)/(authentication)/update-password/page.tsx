import { Metadata } from "next";
import { redirect } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2,
  Fingerprint,
  ShieldCheck,
  Sparkles,
  TimerReset,
  LockKeyhole,
} from "lucide-react";

import PasswordUpdateForm from "./_components/PasswordUpdateForm";
import { decodeResetToken, isResetTokenExpired } from "@/lib/resetToken";

const parsedUpdateExpiration = Number(
  process.env.NEXT_PUBLIC_RESET_TOKEN_EXPIRATION_MINUTES ||
    process.env.RESET_TOKEN_EXPIRATION_MINUTES ||
    "15"
);
const RESET_TOKEN_EXPIRATION_MINUTES =
  Number.isFinite(parsedUpdateExpiration) && parsedUpdateExpiration > 0 ? parsedUpdateExpiration : 15;

type Highlight = {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
};

const confidenceHighlights: Highlight[] = [
  {
    title: "Autenticación reforzada",
    description: "Validamos el token firmado, tu correo y la vigencia antes de aceptar cambios.",
    icon: ShieldCheck,
    accent: "from-sky-500/30 via-cyan-500/10 to-transparent",
  },
  {
    title: "Trazabilidad completa",
    description: "Registramos cada intento de actualización para detectar anormalidades.",
    icon: Fingerprint,
    accent: "from-indigo-500/30 via-violet-500/10 to-transparent",
  },
  {
    title: "Experiencia guiada",
    description: "Mensajes claros, tiempos visibles y soporte inmediato si algo sale mal.",
    icon: Sparkles,
    accent: "from-emerald-500/30 via-teal-500/10 to-transparent",
  },
];

const updateSteps = [
  {
    title: "1. Verifica el token",
    description: "Abrimos esta página desde el mismo enlace que recibiste por correo.",
  },
  {
    title: "2. Crea una clave robusta",
    description: "Usa al menos 10 caracteres con números, mayúsculas y símbolos.",
  },
  {
    title: "3. Confirma y vuelve a comprar",
    description: "Redirigimos al inicio de sesión para que ingreses con tu nueva contraseña.",
  },
];

const reassuranceStats = [
  {
    value: `${RESET_TOKEN_EXPIRATION_MINUTES} min`,
    label: "Vigencia del enlace",
    helper: "Puedes solicitar otro al instante",
  },
  { value: "256 bits", label: "Cifrado", helper: "Token firmado con HMAC" },
  { value: "24/7", label: "Monitoreo", helper: "Alertas automáticas de actividad" },
];

export const metadata: Metadata = {
  title: "Actualizar contraseña",
  description: "Define una nueva clave segura para tu cuenta NeoSale",
};

type PageProps = {
  searchParams?: Promise<{
    token?: string;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const token = resolvedParams?.token;
  const payload = token ? decodeResetToken(token) : null;

  if (!token || !payload) {
    redirect("/forgot-password?status=token-invalid");
  }

  if (isResetTokenExpired(payload)) {
    redirect("/forgot-password?status=token-expired");
  }

  const verifiedToken = token as string;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-x-0 top-[-35%] h-[420px] bg-linear-to-br from-sky-500/40 via-indigo-700/30 to-fuchsia-600/30 blur-3xl" />
      <div className="absolute inset-x-0 bottom-[-30%] h-[360px] bg-gradient-to-tr from-slate-900 via-blue-900/40 to-transparent blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(14,165,233,.35), transparent 45%), radial-gradient(circle at 80% 0%, rgba(236,72,153,.35), transparent 50%)",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="flex-1 px-4 py-12 lg:px-10">
          <div className="mx-auto flex max-w-6xl flex-col gap-10">
            <header className="space-y-4 text-center lg:text-left">
              <span className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slate-200">
                Centro seguro NeoSale
              </span>
              <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
                Actualiza tu contraseña en un entorno controlado
              </h1>
              <p className="mx-auto max-w-3xl text-base text-slate-300 lg:mx-0">
                Validamos el enlace cifrado, protegemos tus datos y te guiamos paso a paso para que recuperes tu acceso sin fricción.
              </p>
            </header>

            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-linear-to-br from-slate-900/85 via-slate-900/45 to-sky-900/55 p-9 shadow-2xl shadow-slate-950/60">
                <div className="space-y-10">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {reassuranceStats.map((metric) => (
                      <div key={metric.label} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-5">
                        <p className="text-3xl font-semibold text-white">{metric.value}</p>
                        <p className="text-sm text-slate-200">{metric.label}</p>
                        <p className="text-xs text-slate-400">{metric.helper}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {confidenceHighlights.map(({ title, description, icon: Icon, accent }) => (
                      <div key={title} className="flex items-start gap-4 rounded-3xl border border-white/10 bg-white/5 px-4 py-5">
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

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">
                      Pasos recomendados
                    </p>
                    <div className="mt-5 space-y-4">
                      {updateSteps.map((step) => (
                        <div key={step.title} className="rounded-2xl border border-white/5 bg-slate-900/40 px-4 py-4">
                          <p className="text-sm font-semibold text-white">{step.title}</p>
                          <p className="text-sm text-slate-300">{step.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pointer-events-none absolute -right-20 top-8 h-52 w-52 rounded-full bg-sky-500/40 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-14 left-6 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />
              </section>

              <section className="relative">
                <div className="absolute inset-0 rounded-[40px] bg-linear-to-br from-sky-500/25 via-emerald-400/20 to-transparent blur-2xl" />
                <div className="relative rounded-[36px] border border-white/10 bg-white p-8 text-slate-900 shadow-2xl shadow-blue-950/30">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                    <span className="text-sky-600">Token verificado</span>
                    <span className="text-slate-400">HMAC 256</span>
                    <span className="text-slate-300">Trace ID</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-500">
                    Confirma tu nueva contraseña y nosotros nos encargamos de invalidar el enlace previo, actualizar tu perfil y redirigirte al inicio de sesión.
                  </p>

                  <div className="mt-9">
                    <PasswordUpdateForm token={verifiedToken} />
                  </div>

                  <div className="mt-8 grid gap-4 md:grid-cols-2">
                    <div className="flex items-start gap-3 rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">
                      <LockKeyhole className="mt-1 h-5 w-5 text-sky-500" />
                      <p>Usa un administrador de contraseñas o frases seguras para evitar repeticiones.</p>
                    </div>
                    <div className="flex items-start gap-3 rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">
                      <TimerReset className="mt-1 h-5 w-5 text-indigo-500" />
                      <p>Si el enlace expiró, vuelve a solicitarlo desde la página de recuperación.</p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-start gap-3 rounded-2xl border border-slate-200/80 p-4 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-slate-400" />
                    <span>Al concluir, inicia sesión nuevamente y verifica tus últimos pedidos para asegurarte de que todo esté correcto.</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
