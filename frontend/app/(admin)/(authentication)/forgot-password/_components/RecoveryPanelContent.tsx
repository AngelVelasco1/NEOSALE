"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, MailCheck, PhoneCall, TimerReset, ShieldCheck, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import PasswordResetForm from "./PasswordResetForm";

type Props = {
  expirationMinutes: number;
};

export function RecoveryPanelContent({ expirationMinutes }: Props) {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const isTokenExpired = status === "token-expired";

  const recoverySteps = [
    {
      title: "1. Solicita el enlace",
      description: "Usa tu correo verificado y te enviamos un acceso único.",
      icon: ShieldCheck,
    },
    {
      title: "2. Revisa tu bandeja",
      description: `Te enviamos un enlace cifrado. Tienes ${expirationMinutes} minutos para usarlo antes de que caduque por seguridad.`,
      icon: TimerReset,
    },
    {
      title: "3. Actualiza tu clave",
      description: "Abre el enlace, define una contraseña robusta y vuelve a tus compras al instante.",
      icon: Sparkles,
    },
  ];

  const supportChannels: { label: string; value: string; helper: string; icon: LucideIcon }[] = [
    {
      label: "Correo prioritario",
      value: "seguridad@neosale.com",
      helper: "Respondemos en menos de 30 minutos",
      icon: MailCheck,
    },
    {
      label: "Línea 24/7",
      value: "+52 55 9999 9900",
      helper: "Atención inmediata para incidentes",
      icon: PhoneCall,
    },
  ];

  if (isTokenExpired) {
    return (
      <div className="space-y-6">
        <div className="rounded-[28px] border border-rose-200/80 bg-rose-50 p-8 text-rose-900">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em]">
            <AlertTriangle className="h-4 w-4" />
            <span>Enlace caducado</span>
          </div>
          <h2 className="mt-4 text-3xl font-semibold">Solicita un nuevo enlace</h2>
          <p className="mt-2 text-md text-rose-800">
            Vuelve a solicitar el restablecimiento de tu contraseña. Por seguridad, los enlaces expiran después de {expirationMinutes} minutos.
          </p>
          <div className="mt-6 space-y-3 text-sm text-rose-800">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-400" />
              <span>Los enlaces expirados se invalidan automáticamente para evitar accesos no autorizados.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-400" />
              <span>Podemos generar uno nuevo inmediatamente.</span>
            </div>
          </div>
          <Link
            href="/forgot-password"
            scroll={false}
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-rose-500 via-amber-500 to-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-200"
          >
            Solicitar otro enlace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 grid grid-cols-[1.1fr_1fr] gap-8">
      <PasswordResetForm />

      <div className="grid gap-4 rounded-[28px] border border-white/10 bg-slate-900/40 p-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">Pasos para restablecer</p>
        <div className="space-y-4">
          {recoverySteps.map(({ title, description, icon: Icon }, index) => (
            <div
              key={title}
              className="relative flex items-start gap-4 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4"
            >
            
              <div>
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                  <Icon className="h-4 w-4" /> {title}
                </p>
                <p className="text-sm text-slate-300">{description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {supportChannels.map(({ label, value, helper, icon: Icon }) => (
            <div key={label} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <Icon className="h-5 w-5 text-sky-300" />
              <div>
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-base text-white/90">{value}</p>
                <p className="text-xs text-slate-400">{helper}</p>
              </div>
            </div>
          ))}
        </div>
        
      <div className="flex items-start gap-3 rounded-2xl border border-rose-300/40 bg-rose-500/10 p-4 text-sm text-rose-100">
        <AlertTriangle className="h-5 w-5" />
        <span>
          Nunca compartas enlaces de recuperación ni códigos. Si detectas un correo sospechoso, cambia tu contraseña desde tu cuenta e infórmanos para bloquear el intento.
        </span>
      </div>
      </div>

    </div>
  );
}
