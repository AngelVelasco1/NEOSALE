"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, ChevronDown, Clock, RotateCcw, Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { DEFAULT_METRIC_GOALS, GOAL_PARAM_MAP, MetricGoalKey } from "./goalPresets";

export type DateRangePreset = 
    | "today" 
    | "yesterday" 
    | "last7days" 
    | "last30days" 
    | "thisMonth" 
    | "lastMonth" 
    | "last3months" 
    | "last6months" 
    | "thisYear" 
    | "custom";

type PresetOption = {
    value: DateRangePreset;
    label: string;
    description: string;
};

type GoalInputState = Record<MetricGoalKey, string>;
type StoredGoals = Partial<Record<MetricGoalKey, number>>;

const GOAL_STORAGE_KEY = "neosale.dashboard.goals.v1";
const DEFAULT_PRESET: DateRangePreset = "thisMonth";

const PRESET_STYLES = {
    accent: {
        today: "from-slate-950/90 via-sky-500/25 to-slate-900/80",
        yesterday: "from-slate-950/90 via-blue-500/22 to-slate-900/80",
        last7days: "from-slate-950/90 via-blue-500/22 to-slate-900/80",
        last30days: "from-slate-950/90 via-sky-500/22 to-slate-900/80",
        thisMonth: "from-slate-950/90 via-cyan-500/22 to-slate-900/80",
        lastMonth: "from-slate-950/90 via-rose-500/22 to-slate-900/80",
        last3months: "from-slate-950/90 via-amber-500/24 to-slate-900/80",
        last6months: "from-slate-950/90 via-emerald-500/22 to-slate-900/80",
        thisYear: "from-slate-950/90 via-blue-500/22 to-slate-900/80",
        custom: "from-slate-950/90 via-cyan-500/24 to-slate-900/80",
    },
    border: {
        today: "from-slate-800 via-sky-600 to-slate-900",
        yesterday: "from-slate-800 via-blue-600 to-slate-900",
        last7days: "from-slate-800 via-blue-600 to-slate-900",
        last30days: "from-slate-800 via-sky-600 to-slate-900",
        thisMonth: "from-slate-800 via-cyan-600 to-slate-900",
        lastMonth: "from-slate-800 via-rose-600 to-slate-900",
        last3months: "from-slate-800 via-amber-600 to-slate-900",
        last6months: "from-slate-800 via-emerald-600 to-slate-900",
        thisYear: "from-slate-800 via-blue-600 to-slate-900",
        custom: "from-slate-800 via-cyan-600 to-slate-900",
    },
    beam: {
        today: "bg-sky-400/25",
        yesterday: "bg-blue-500/20",
        last7days: "bg-blue-500/20",
        last30days: "bg-sky-500/20",
        thisMonth: "bg-cyan-500/20",
        lastMonth: "bg-rose-500/20",
        last3months: "bg-amber-500/22",
        last6months: "bg-emerald-500/20",
        thisYear: "bg-blue-500/20",
        custom: "bg-cyan-500/22",
    },
} as const;

const PRESET_OPTIONS: PresetOption[] = [
    { value: "today", label: "Hoy", description: "Datos en tiempo real" },
    { value: "yesterday", label: "Ayer", description: "Cierre del día anterior" },
    { value: "last7days", label: "Últimos 7 días", description: "Comparativa semanal" },
    { value: "last30days", label: "Últimos 30 días", description: "Tendencia mensual" },
    { value: "thisMonth", label: "Este mes", description: "Desde el 1 de este mes" },
    { value: "lastMonth", label: "Mes anterior", description: "Resumen mensual previo" },
    { value: "last3months", label: "Últimos 3 meses", description: "Trimestre móvil" },
    { value: "last6months", label: "Últimos 6 meses", description: "Semestre móvil" },
    { value: "thisYear", label: "Este año", description: "Acumulado anual" },
    { value: "custom", label: "Personalizado", description: "Define tu propio rango" },
];

const GOAL_INPUT_META: Record<MetricGoalKey, { prefix?: string; suffix?: string; helper: string }> = {
    revenue: { prefix: "$", helper: "Ingresos esperados" },
    orders: { suffix: "pedidos", helper: "Volumen objetivo" },
    products: { suffix: "unds", helper: "Unidades del catálogo" },
    customers: { suffix: " clientes", helper: "Clientes nuevos" },
};

const GOAL_VISUALS: Record<MetricGoalKey, { gradient: string; beam: string; accent: string }> = {
    revenue: {
        gradient: "from-violet-500/18 via-fuchsia-500/10 to-transparent",
        beam: "bg-violet-500/20",
        accent: "text-violet-200",
    },
    orders: {
        gradient: "from-blue-500/18 via-cyan-500/10 to-transparent",
        beam: "bg-cyan-500/20",
        accent: "text-cyan-200",
    },
    products: {
        gradient: "from-emerald-500/18 via-teal-500/10 to-transparent",
        beam: "bg-emerald-500/20",
        accent: "text-emerald-200",
    },
    customers: {
        gradient: "from-rose-500/18 via-pink-500/10 to-transparent",
        beam: "bg-rose-500/20",
        accent: "text-rose-200",
    },
};

const QUICK_GOAL_PRESETS = [
    { label: "+5%", factor: 1.05 },
    { label: "+15%", factor: 1.15 },
    { label: "x2", factor: 2 },
] as const;

const DatePickerWithRange = dynamic(
    () => import("@/components/ui/date-range-picker").then((mod) => mod.DatePickerWithRange),
    {
        ssr: false,
        loading: () => (
            <div className="h-12 w-full rounded-xl border border-white/10 bg-slate-950/40" />
        ),
    }
);

// Formateadores (singleton)
const FORMATTERS = {
    currency: new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }),
    integer: new Intl.NumberFormat("es-CO", {
        maximumFractionDigits: 0,
    }),
} as const;

/** Calcula el rango de fechas basado en el preset */
function getPresetDateRange(presetValue: DateRangePreset): DateRange | undefined {
    if (presetValue === "custom") return undefined;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const ranges: Record<Exclude<DateRangePreset, "custom">, DateRange> = {
        today: { from: today, to: today },
        yesterday: (() => {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return { from: yesterday, to: yesterday };
        })(),
        last7days: (() => {
            const start = new Date(today);
            start.setDate(start.getDate() - 6);
            return { from: start, to: today };
        })(),
        last30days: (() => {
            const start = new Date(today);
            start.setDate(start.getDate() - 29);
            return { from: start, to: today };
        })(),
        thisMonth: {
            from: new Date(now.getFullYear(), now.getMonth(), 1),
            to: today,
        },
        lastMonth: {
            from: new Date(now.getFullYear(), now.getMonth() - 1, 1),
            to: new Date(now.getFullYear(), now.getMonth(), 0),
        },
        last3months: {
            from: new Date(now.getFullYear(), now.getMonth() - 2, 1),
            to: today,
        },
        last6months: {
            from: new Date(now.getFullYear(), now.getMonth() - 5, 1),
            to: today,
        },
        thisYear: {
            from: new Date(now.getFullYear(), 0, 1),
            to: today,
        },
    };

    return ranges[presetValue];
}

/** Formatea valores de metas según el tipo */
const formatGoalValue = (key: MetricGoalKey, value: number) =>
    key === "revenue" ? FORMATTERS.currency.format(value) : FORMATTERS.integer.format(value);

/** Valida si un número es válido para metas */
const isValidGoalNumber = (value: number): boolean =>
    Number.isFinite(value) && value > 0;

/** Calcula días entre dos fechas */
const calculateDaysDifference = (from: Date, to: Date): number =>
    Math.max(1, Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1);

/** Hook para manejar localStorage de forma segura */
function useLocalStorage<T>(key: string) {
    const getItem = useCallback((): T | null => {
        if (typeof window === "undefined") return null;
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch {
            return null;
        }
    }, [key]);

    const setItem = useCallback((value: T) => {
        if (typeof window === "undefined") return;
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // Silently fail
        }
    }, [key]);

    const removeItem = useCallback(() => {
        if (typeof window === "undefined") return;
        try {
            window.localStorage.removeItem(key);
        } catch {
            // Fallo silencioso
        }
    }, [key]);

    return { getItem, setItem, removeItem };
}

/** Hook para manejar URL params */
function useURLParams() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const updateParams = useCallback((updates: Record<string, string | null>, replace = true) => {
        const params = new URLSearchParams(searchParams.toString());
        let hasChanges = false;

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null) {
                if (params.has(key)) {
                    params.delete(key);
                    hasChanges = true;
                }
            } else if (params.get(key) !== value) {
                params.set(key, value);
                hasChanges = true;
            }
        });

        if (hasChanges) {
            const url = `/dashboard?${params.toString()}`;
            startTransition(() => {
                replace ? router.replace(url, { scroll: false }) : router.push(url, { scroll: false });
            });
        }
    }, [router, searchParams]);

    return { searchParams, updateParams, isPending };
}

export default function DashboardFilters() {
    const { searchParams, updateParams } = useURLParams();
    const { getItem, setItem, removeItem } = useLocalStorage<StoredGoals>(GOAL_STORAGE_KEY);

    // Estado de UI
    const [preset, setPreset] = useState<DateRangePreset>(
        () => (searchParams.get("preset") as DateRangePreset) || DEFAULT_PRESET
    );
    const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
        const from = searchParams.get("from");
        const to = searchParams.get("to");
        return from && to 
            ? { from: new Date(from), to: new Date(to) }
            : getPresetDateRange(DEFAULT_PRESET);
    });

    // Estado de metas
    const [goalInputs, setGoalInputs] = useState<GoalInputState>(() => {
        const stored = getItem();
        const metricKeys = Object.keys(GOAL_PARAM_MAP) as MetricGoalKey[];
        
        return metricKeys.reduce((acc, key) => {
            const urlValue = searchParams.get(GOAL_PARAM_MAP[key]);
            const parsedUrl = urlValue ? Number(urlValue) : NaN;
            const storedValue = stored?.[key];

            if (isValidGoalNumber(parsedUrl)) {
                acc[key] = parsedUrl.toString();
            } else if (typeof storedValue === "number" && isValidGoalNumber(storedValue)) {
                acc[key] = storedValue.toString();
            } else {
                acc[key] = DEFAULT_METRIC_GOALS[key].value.toString();
            }
            return acc;
        }, {} as GoalInputState);
    });

    // Sincronizar localStorage con state
    const syncGoalToStorage = useCallback((key: MetricGoalKey, value?: number) => {
        const current = getItem() || {};
        const updated = { ...current };

        if (value !== undefined && isValidGoalNumber(value)) {
            updated[key] = value;
        } else {
            delete updated[key];
        }

        if (Object.keys(updated).length > 0) {
            setItem(updated);
        } else {
            removeItem();
        }
    }, [getItem, setItem, removeItem]);

    // Sincronizar metas desde localStorage al montar
    useEffect(() => {
        const stored = getItem();
        if (!stored || Object.keys(stored).length === 0) return;

        const metricKeys = Object.keys(GOAL_PARAM_MAP) as MetricGoalKey[];
        const updates: Record<string, string> = {};
        let hasUpdates = false;

        metricKeys.forEach((key) => {
            const paramName = GOAL_PARAM_MAP[key];
            if (!searchParams.get(paramName)) {
                const storedValue = stored[key];
                if (typeof storedValue === "number" && isValidGoalNumber(storedValue)) {
                    updates[paramName] = storedValue.toString();
                    hasUpdates = true;
                }
            }
        });

        if (hasUpdates) {
            updateParams(updates);
        }
    }, []); // Solo al montar

    // Handlers de metas
    const handleGoalInputChange = useCallback((key: MetricGoalKey, value: string) => {
        if (value === "" || /^[0-9]+$/.test(value)) {
            setGoalInputs(prev => ({ ...prev, [key]: value }));
        }
    }, []);

    const handleGoalCommit = useCallback((key: MetricGoalKey, value?: string) => {
        const candidate = (value ?? goalInputs[key]).trim();
        const numericValue = Number(candidate);
        const isValid = isValidGoalNumber(numericValue);

        updateParams({
            [GOAL_PARAM_MAP[key]]: isValid ? numericValue.toString() : null,
        });

        syncGoalToStorage(key, isValid ? numericValue : undefined);
    }, [goalInputs, updateParams, syncGoalToStorage]);

    const handleQuickGoal = useCallback((key: MetricGoalKey, factor: number) => {
        const currentValue = Number(goalInputs[key]);
        const sourceValue = isValidGoalNumber(currentValue)
            ? currentValue
            : DEFAULT_METRIC_GOALS[key].value;
        const nextValue = Math.max(1, Math.round(sourceValue * factor));
        const nextValueString = nextValue.toString();

        setGoalInputs(prev => ({ ...prev, [key]: nextValueString }));
        updateParams({ [GOAL_PARAM_MAP[key]]: nextValueString });
        syncGoalToStorage(key, nextValue);
    }, [goalInputs, updateParams, syncGoalToStorage]);

    const handleGoalReset = useCallback(() => {
        const metricKeys = Object.keys(GOAL_PARAM_MAP) as MetricGoalKey[];
        const updates = metricKeys.reduce((acc, key) => {
            acc[GOAL_PARAM_MAP[key]] = null;
            return acc;
        }, {} as Record<string, null>);

        updateParams(updates);
        removeItem();
        setGoalInputs(
            metricKeys.reduce((acc, key) => {
                acc[key] = DEFAULT_METRIC_GOALS[key].value.toString();
                return acc;
            }, {} as GoalInputState)
        );
    }, [updateParams, removeItem]);

    // Handlers de fechas
    const handlePresetChange = useCallback((value: DateRangePreset) => {
        setPreset(value);
        if (value !== "custom") {
            const range = getPresetDateRange(value);
            setDateRange(range);
            if (range?.from && range?.to) {
                updateParams({
                    preset: value,
                    from: range.from.toISOString(),
                    to: range.to.toISOString(),
                }, false);
            }
        }
    }, [updateParams]);

    const handleDateRangeChange = useCallback((range: DateRange | undefined) => {
        setDateRange(range);
        if (range?.from && range?.to) {
            setPreset("custom");
            updateParams({
                preset: "custom",
                from: range.from.toISOString(),
                to: range.to.toISOString(),
            }, false);
        }
    }, [updateParams]);

    const handleReset = useCallback(() => {
        const range = getPresetDateRange(DEFAULT_PRESET);
        setPreset(DEFAULT_PRESET);
        setDateRange(range);
        if (range?.from && range?.to) {
            updateParams({
                preset: DEFAULT_PRESET,
                from: range.from.toISOString(),
                to: range.to.toISOString(),
            }, false);
        }
    }, [updateParams]);

    // Valores derivados memoizados
    const presetMeta = useMemo(
        () => PRESET_OPTIONS.find(opt => opt.value === preset),
        [preset]
    );

    const totalDays = useMemo(
        () => dateRange?.from && dateRange?.to 
            ? calculateDaysDifference(dateRange.from, dateRange.to)
            : undefined,
        [dateRange]
    );

    const presetStyles = useMemo(() => ({
        accent: PRESET_STYLES.accent[preset] ?? PRESET_STYLES.accent.thisMonth,
        border: PRESET_STYLES.border[preset] ?? PRESET_STYLES.border.thisMonth,
        beam: PRESET_STYLES.beam[preset] ?? PRESET_STYLES.beam.thisMonth,
    }), [preset]);

    return (
        <Card className="relative z-10 mb-6 overflow-hidden rounded-4xl border border-violet-500/25 bg-linear-to-br from-slate-950 via-indigo-950/40 to-slate-950 shadow-[0_10px_36px_rgba(139,92,246,0.25)]">
            {/* Background effects */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.25),transparent_60%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(139,92,246,0.08)_1px,transparent_1px)] bg-size-[160px_160px] opacity-40" />
            <div className="pointer-events-none absolute -top-32 left-6 h-64 w-64 rounded-full bg-violet-400/20 blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-fuchsia-500/18 blur-[120px]" />

            <div className="relative z-10 space-y-3 p-5 py-2 md:p-8 md:py-4">
                {/* Header */}
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="max-w-2xl space-y-2">
                        <div className="relative inline-block">
                            <h2 className="text-3xl font-black tracking-tight bg-linear-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(167,139,250,0.5)]">
                                Configura tu panel de métricas
                            </h2>
                            <div className="absolute -inset-1 -z-10 bg-linear-to-r from-violet-600/20 via-fuchsia-600/20 to-purple-600/20 blur-2xl" />
                        </div>
                        <p className="text-sm font-medium text-slate-300/90 leading-relaxed">
                            <span className="inline-flex items-center gap-1.5">
                                Ajusta el rango temporal y define metas potentes
                            </span>
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-white/80">
                        <span className="animate-pulse rounded-full border border-violet-400/40 bg-linear-to-r from-violet-500/25 via-fuchsia-500/25 to-purple-500/25 px-3 py-1 text-violet-50 shadow-[0_0_12px_rgba(167,139,250,0.4)]">
                            Panel activo
                        </span>
                    </div>
                </div>

                {/* Date range controls */}
                <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
                    <div className="flex-1">
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="min-w-60 flex-1">
                                <PresetDropdown value={preset} onChange={handlePresetChange} />
                            </div>
                            {preset === "custom" && (
                                <div className="min-w-[280px] flex-1 rounded-2xl border border-dashed border-white/15 bg-slate-950/40 px-2 py-1 shadow-inner shadow-black/30">
                                    <DatePickerWithRange
                                        date={dateRange}
                                        onDateChange={handleDateRangeChange}
                                        className="h-12"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <Button
                        onClick={handleReset}
                        variant="outline"
                        className="group relative h-12 min-w-[170px] overflow-hidden rounded-2xl border border-violet-400/35 bg-linear-to-r from-slate-900 via-indigo-950/50 to-slate-900 px-6 text-sm font-semibold text-white shadow-md shadow-violet-500/15 backdrop-blur-xl transition-all duration-500 hover:-translate-y-0.5 hover:border-fuchsia-400/50 hover:shadow-lg hover:shadow-violet-500/25"
                    >
                        <span className="absolute inset-0 bg-linear-to-r from-violet-500/15 via-fuchsia-500/10 to-purple-500/15 opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
                        <span className="absolute inset-0 translate-y-full bg-linear-to-r from-fuchsia-500/25 via-violet-500/20 to-purple-500/25 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100" />
                        <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                            <RotateCcw className="h-4 w-4 text-violet-200 transition-transform duration-500 group-hover:-rotate-180" />
                            Restablecer
                        </span>
                    </Button>
                </div>

                {/* Date range display */}
                {dateRange?.from && (
                    <DateRangeDisplay
                        dateRange={dateRange}
                        presetMeta={presetMeta}
                        presetStyles={presetStyles}
                        totalDays={totalDays}
                    />
                )}

                {/* Goals section */}
                <GoalsSection
                    goalInputs={goalInputs}
                    onInputChange={handleGoalInputChange}
                    onCommit={handleGoalCommit}
                    onQuickGoal={handleQuickGoal}
                    onReset={handleGoalReset}
                />
            </div>
        </Card>
    );
}

// ============================================================================
// SUB-COMPONENTES
// ============================================================================

type DateRangeDisplayProps = {
    dateRange: DateRange;
    presetMeta?: PresetOption;
    presetStyles: { accent: string; border: string; beam: string };
    totalDays?: number;
};

function DateRangeDisplay({ dateRange, presetMeta, presetStyles, totalDays }: DateRangeDisplayProps) {
    const formatDate = (date: Date) =>
        date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });

    return (
        <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
            {/* Period card */}
            <div className="relative overflow-hidden rounded-3xl border border-indigo-500/25 bg-linear-to-br from-slate-900 via-indigo-950/30 to-slate-900 p-5 shadow-md shadow-indigo-900/30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.2),transparent_65%)] opacity-70" />
                <div className="relative space-y-4">
                    <div className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-indigo-400/40 bg-linear-to-r from-indigo-500/25 via-violet-500/25 to-purple-500/25 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.35em] text-indigo-100 shadow-lg shadow-indigo-500/20">
                        <div className="absolute inset-0 bg-linear-to-r from-indigo-500/10 via-violet-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <Calendar className="h-3.5 w-3.5 relative z-10" />
                        <span className="relative z-10">Período</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="rounded-2xl border border-indigo-500/15 bg-slate-950/80 px-3 py-2 text-sm font-semibold text-white shadow-sm">
                            {formatDate(dateRange.from!)}
                        </span>
                        {dateRange.to && dateRange.to.getTime() !== dateRange.from!.getTime() && (
                            <>
                                <div className="flex items-center gap-1 text-violet-500">
                                    <div className="h-0.5 w-4 rounded bg-violet-600" />
                                    <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                                    <div className="h-0.5 w-4 rounded bg-violet-600" />
                                </div>
                                <span className="rounded-2xl border border-indigo-500/15 bg-slate-950/80 px-3 py-2 text-sm font-semibold text-white shadow-sm">
                                    {formatDate(dateRange.to)}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Active preset card */}
            <div className={cn("relative rounded-[28px] bg-linear-to-r p-[1.5px]", presetStyles.border)}>
                <div className="relative overflow-hidden rounded-[26px] bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 p-5 text-white">
                    <div className={cn("absolute inset-0 bg-linear-to-br opacity-75", presetStyles.accent)} />
                    <div className={cn("absolute -top-16 right-6 h-32 w-32 rounded-full opacity-70 blur-3xl", presetStyles.beam)} />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/30 via-transparent" />
                    <div className="relative z-10 flex h-full flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/35 bg-linear-to-r from-violet-500/20 via-purple-500/20 to-fuchsia-500/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-violet-100">
                                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                                Preset activo
                            </div>
                            <Clock className="h-4 w-4 text-slate-300" />
                        </div>
                        <div className="space-y-2.5">
                            <h4 className="text-2xl font-black leading-tight tracking-tight bg-linear-to-br from-white via-slate-100 to-slate-200 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]">
                                {presetMeta?.label ?? "Personalizado"}
                            </h4>
                            {totalDays && (
                                <p className="text-sm font-semibold text-slate-300/90 flex items-center gap-1.5">
                                    <span className="h-1 w-1 rounded-full bg-violet-400" />
                                    {totalDays} días seleccionados
                                </p>
                            )}
                            {presetMeta?.description && (
                                <p className="text-xs font-medium text-slate-400/80">{presetMeta.description}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

type GoalsSectionProps = {
    goalInputs: GoalInputState;
    onInputChange: (key: MetricGoalKey, value: string) => void;
    onCommit: (key: MetricGoalKey, value?: string) => void;
    onQuickGoal: (key: MetricGoalKey, factor: number) => void;
    onReset: () => void;
};

function GoalsSection({ goalInputs, onInputChange, onCommit, onQuickGoal, onReset }: GoalsSectionProps) {
    const metricKeys = useMemo(() => Object.keys(GOAL_PARAM_MAP) as MetricGoalKey[], []);

    return (
        <div className="p-3">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                    <div className="relative inline-block">
                        <h3 className="text-xl font-extrabold tracking-tight bg-linear-to-r from-violet-200 via-fuchsia-200 to-purple-200 bg-clip-text text-transparent">
                            Metas personalizadas
                        </h3>
                        <div className="absolute -bottom-1 left-0 h-0.5 w-16 bg-linear-to-r from-violet-500 via-fuchsia-500 to-transparent rounded-full" />
                    </div>
                    <p className="text-xs font-medium text-slate-400/90 leading-relaxed">
                        <span className="inline-flex items-center gap-1.5">
                            Guardamos tus objetivos para un mejor seguimiento del rendimiento
                        </span>
                    </p>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onReset}
                    className="h-10 rounded-2xl border border-violet-400/35 bg-linear-to-r from-violet-500/20 via-fuchsia-500/20 to-purple-500/20 px-4 text-xs font-semibold uppercase tracking-[0.3em] text-violet-100 transition hover:from-violet-500/30 hover:via-fuchsia-500/30 hover:to-purple-500/30 hover:shadow-md hover:shadow-violet-500/25"
                >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Restablecer metas
                </Button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {metricKeys.map((key) => (
                    <GoalCard
                        key={key}
                        metricKey={key}
                        inputValue={goalInputs[key] ?? ""}
                        onInputChange={onInputChange}
                        onCommit={onCommit}
                        onQuickGoal={onQuickGoal}
                    />
                ))}
            </div>
        </div>
    );
}

type GoalCardProps = {
    metricKey: MetricGoalKey;
    inputValue: string;
    onInputChange: (key: MetricGoalKey, value: string) => void;
    onCommit: (key: MetricGoalKey, value?: string) => void;
    onQuickGoal: (key: MetricGoalKey, factor: number) => void;
};

const GoalCard = memo(function GoalCard({
    metricKey,
    inputValue,
    onInputChange,
    onCommit,
    onQuickGoal,
}: GoalCardProps) {
    const meta = GOAL_INPUT_META[metricKey];
    const base = DEFAULT_METRIC_GOALS[metricKey];
    const visuals = GOAL_VISUALS[metricKey];
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const numericValue = Number(inputValue);
    const isValidValue = isValidGoalNumber(numericValue);
    const effectiveValue = isValidValue ? numericValue : base.value;
    const isCustom = isMounted && isValidValue && numericValue !== base.value;

    const friendlyEffective = formatGoalValue(metricKey, effectiveValue);
    const friendlyBase = formatGoalValue(metricKey, base.value);

    return (
        <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 p-5 text-white shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-all duration-500 hover:border-white/20 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
            <div className={cn("pointer-events-none absolute inset-0 bg-linear-to-br opacity-60 transition-opacity duration-500 group-hover:opacity-90", visuals.gradient)} />
            <div className={cn("pointer-events-none absolute -top-12 right-6 h-28 w-28 rounded-full opacity-40 blur-[80px] transition-all duration-500 group-hover:scale-110 group-hover:opacity-70", visuals.beam)} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
            <div className={cn("absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100", visuals.gradient.replace("/18", "/8").replace("/10", "/5"))} />
            
            <div className="relative z-10 flex h-full flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-300 transition-colors duration-300 group-hover:text-white">
                            {base.label}
                        </span>
                        <Badge
                            variant={isCustom ? "success" : "secondary"}
                            className={cn(
                                "rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-300",
                                isCustom
                                    ? "border-emerald-400/40 bg-linear-to-r from-emerald-500/20 to-teal-500/20 text-emerald-100 shadow-sm shadow-emerald-500/20"
                                    : "border-slate-400/30 bg-linear-to-r from-slate-500/20 to-slate-600/20 text-slate-200"
                            )}
                        >
                            {isCustom ? "Personalizada" : "Sugerida"}
                        </Badge>
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Objetivo</p>
                        <p className="text-xl font-bold text-white transition-transform duration-300 group-hover:scale-105">
                            {friendlyEffective}
                        </p>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-400 transition-colors duration-300 group-hover:text-slate-300">
                        {meta.helper}
                    </p>
                </div>

                <div className="group/input relative">
                    {meta.prefix && (
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 transition-colors duration-300 group-hover/input:text-slate-300">
                            {meta.prefix}
                        </span>
                    )}
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={inputValue}
                        onChange={(e) => onInputChange(metricKey, e.target.value)}
                        onBlur={(e) => onCommit(metricKey, e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                        className={cn(
                            "h-14 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-base font-bold tracking-wide text-white backdrop-blur-sm placeholder:text-slate-500 transition-all duration-300 hover:border-white/20 hover:bg-slate-950/80 focus:border-white/30 focus:bg-slate-950/90 focus:outline-none focus:ring-2 focus:ring-white/10",
                            meta.prefix && "pl-11"
                        )}
                        placeholder={base.value.toString()}
                    />
                    {meta.suffix && (
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 transition-colors duration-300 group-hover/input:text-slate-300">
                            {meta.suffix}
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-300 backdrop-blur-sm transition-all duration-300 group-hover:border-white/25 group-hover:bg-white/10">
                        <span className="text-slate-400">Base:</span>
                        <span className="text-white">{friendlyBase}</span>
                    </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                    {QUICK_GOAL_PRESETS.map((preset) => (
                        <button
                            key={preset.label}
                            type="button"
                            onClick={() => onQuickGoal(metricKey, preset.factor)}
                            className="relative overflow-hidden rounded-xl border border-white/15 bg-linear-to-br from-white/10 to-white/5 px-3 py-2.5 text-xs font-bold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:from-white/20 hover:to-white/10 hover:shadow-lg hover:shadow-black/30 active:scale-95"
                        >
                            <span className="relative z-10">{preset.label}</span>
                            <div className="absolute inset-0 bg-linear-to-br from-white/0 to-white/5 opacity-0 transition-opacity duration-300 hover:opacity-100" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
});

type PresetDropdownProps = {
    value: DateRangePreset;
    onChange: (value: DateRangePreset) => void;
};

function PresetDropdown({ value, onChange }: PresetDropdownProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [menuPosition, setMenuPosition] = useState<{ top: number; left: number; width: number } | null>(null);
    
    const selected = useMemo(
        () => PRESET_OPTIONS.find((opt) => opt.value === value) ?? PRESET_OPTIONS[0],
        [value]
    );

    const updatePosition = useCallback(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMenuPosition({
            top: rect.bottom + 12 + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
        });
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                containerRef.current &&
                !containerRef.current.contains(target) &&
                (!menuRef.current || !menuRef.current.contains(target))
            ) {
                setOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    useEffect(() => {
        if (!open) return;
        updatePosition();
        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, true);
        return () => {
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [open, updatePosition]);

    const handleSelect = useCallback((nextValue: DateRangePreset) => {
        onChange(nextValue);
        setOpen(false);
    }, [onChange]);

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((prev) => !prev)}
                className="flex w-full items-center justify-between gap-3 rounded-2xl border border-violet-500/25 bg-linear-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-4 text-left text-white shadow-md shadow-violet-500/15 transition-all duration-300 hover:-translate-y-0.5 hover:border-fuchsia-400/40 hover:shadow-lg hover:shadow-violet-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40"
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 via-violet-500 to-blue-500 text-white shadow-md shadow-violet-500/30">
                        <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white">{selected.label}</p>
                        <p className="text-xs text-slate-400">{selected.description}</p>
                    </div>
                </div>
                <ChevronDown
                    className={cn(
                        "h-4 w-4 text-slate-500 transition-transform duration-200",
                        open && "rotate-180"
                    )}
                />
            </button>

            {open && menuPosition && typeof document !== "undefined" &&
                createPortal(
                    <div
                        ref={menuRef}
                        style={{
                            position: "absolute",
                            top: menuPosition.top,
                            left: menuPosition.left,
                            width: menuPosition.width,
                        }}
                        className="z-200"
                    >
                        <div className="rounded-2xl border border-violet-500/25 bg-slate-950/98 p-2 shadow-[0_12px_48px_rgba(139,92,246,0.3)] backdrop-blur-xl">
                            <div className="max-h-72 space-y-1 overflow-y-auto pr-1">
                                {PRESET_OPTIONS.map((option) => {
                                    const isActive = option.value === value;
                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            role="option"
                                            aria-selected={isActive}
                                            onClick={() => handleSelect(option.value)}
                                            className={cn(
                                                "w-full rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-200",
                                                isActive
                                                    ? "bg-linear-to-r from-violet-600 via-fuchsia-600 to-purple-600 text-white shadow-md shadow-violet-500/25"
                                                    : "text-slate-300 hover:bg-violet-500/15 hover:text-white"
                                            )}
                                        >
                                            <p className="font-semibold">{option.label}</p>
                                            <p className="text-xs opacity-80">{option.description}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
}

// Importar memo para GoalCard
import { memo } from "react";
