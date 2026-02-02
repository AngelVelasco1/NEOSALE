import { Metadata } from "next";

import { RecoveryPanelContent } from "./_components/RecoveryPanelContent";



const parsedForgotExpiration = Number(
  process.env.NEXT_PUBLIC_RESET_TOKEN_EXPIRATION_MINUTES ||
    process.env.RESET_TOKEN_EXPIRATION_MINUTES ||
    "15"
);
const RESET_TOKEN_EXPIRATION_MINUTES =
  Number.isFinite(parsedForgotExpiration) && parsedForgotExpiration > 0
    ? parsedForgotExpiration
    : 15;


export const metadata: Metadata = {
  title: "Recuperar contraseña",
  description: "Restaura el acceso a tu cuenta NeoSale desde un entorno seguro",
};

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-x-0 top-[-40%] h-[480px] bg-linear-to-br from-sky-500/40 via-indigo-700/30 to-fuchsia-600/30 blur-3xl" />
      <div className="absolute inset-x-0 bottom-[-35%] h-[420px] bg-gradient-to-tr from-slate-900 via-blue-900/40 to-transparent blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(59,130,246,.35), transparent 45%), radial-gradient(circle at 80% 0%, rgba(236,72,153,.35), transparent 50%)",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="flex-1 px-4 py-12 lg:px-10">
          <div className="mx-auto flex max-w-5xl flex-col gap-12 justify-center">
            <header className="space-y-4 text-center lg:text-left">
              <span className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slate-200">
                Seguridad
              </span>
              <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
                Recupera tu acceso
              </h1>
            </header>

            <div className="flex flex-col gap-10 lg:flex-row lg:items-center max-w-5xl justify-center mx-auto">
              <section className="relative">
                <RecoveryPanelContent
                  expirationMinutes={RESET_TOKEN_EXPIRATION_MINUTES}
                />
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
