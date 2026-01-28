"use client";

export function Loading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 px-4 py-16 text-white">
      <div className="relative flex h-40 w-40 items-center justify-center">
        <div className="absolute inset-4 animate-[spin_6s_linear_infinite] rounded-full border border-white/10" />
        <div className="absolute inset-0 animate-[spin_1.8s_cubic-bezier(0.4,0,0.2,1)_infinite] rounded-full border-[6px] border-transparent border-t-cyan-400 border-b-indigo-500 shadow-[0_0_25px_rgba(14,165,233,0.45)]" />
        <div className="absolute inset-3 animate-[spin_2.4s_linear_reverse_infinite] rounded-full border-[3px] border-transparent border-l-white/40 border-r-white/10 opacity-70" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-slate-950/80 text-xs uppercase tracking-[0.5em] text-slate-300">
          NeoSale
        </div>
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm uppercase tracking-[0.45em] text-slate-400">Cargando</p>
        <p className="text-lg font-semibold">Sincronizando tu panel</p>
      </div>
    </div>
  );
}
