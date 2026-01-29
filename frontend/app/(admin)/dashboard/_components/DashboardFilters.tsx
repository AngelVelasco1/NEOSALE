"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { Calendar, ChevronDown, Clock, RotateCcw, Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { DEFAULT_METRIC_GOALS, GOAL_PARAM_MAP, MetricGoalKey } from "./goalPresets";

export type DateRangePreset = "today" | "yesterday" | "last7days" | "last30days" | "thisMonth" | "lastMonth" | "last3months" | "last6months" | "thisYear" | "custom";

type PresetOption = {
    value: DateRangePreset;
    label: string;
    description: string;
};

const presetAccentMap: Record<DateRangePreset, string> = {
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
};

const presetBorderMap: Record<DateRangePreset, string> = {
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
};

const presetBeamMap: Record<DateRangePreset, string> = {
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
};

const presetOptions: PresetOption[] = [
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

const goalInputMeta: Record<MetricGoalKey, { prefix?: string; suffix?: string; helper: string }> = {
    revenue: { prefix: "$", helper: "Ingresos esperados" },
    orders: { suffix: "pedidos", helper: "Volumen objetivo" },
    products: { suffix: "unds", helper: "Unidades del catálogo" },
    customers: { suffix: " clientes", helper: "Clientes nuevos" },
};

const metricGoalKeys = Object.keys(GOAL_PARAM_MAP) as MetricGoalKey[];

const getDefaultGoalState = (): Record<MetricGoalKey, string> => {
    return metricGoalKeys.reduce((acc, key) => {
        acc[key] = DEFAULT_METRIC_GOALS[key].value.toString();
        return acc;
    }, {} as Record<MetricGoalKey, string>);
};

type StoredGoals = Partial<Record<MetricGoalKey, number>>;

const GOAL_STORAGE_KEY = "neosale.dashboard.goals.v1";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

const integerFormatter = new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 0,
});

const formatGoalValue = (key: MetricGoalKey, value: number) =>
    key === "revenue" ? currencyFormatter.format(value) : integerFormatter.format(value);

const goalVisuals: Record<MetricGoalKey, { gradient: string; beam: string; accent: string }> = {
    revenue: {
        gradient: "from-blue-500/20 via-sky-500/10 to-transparent",
        beam: "bg-sky-500/25",
        accent: "text-sky-200",
    },
    orders: {
        gradient: "from-blue-500/20 via-sky-500/10 to-transparent",
        beam: "bg-sky-500/25",
        accent: "text-blue-200",
    },
    products: {
        gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
        beam: "bg-emerald-500/25",
        accent: "text-emerald-200",
    },
    customers: {
        gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
        beam: "bg-amber-500/25",
        accent: "text-amber-200",
    },
};

const quickGoalPresets = [
    { label: "+5%", factor: 1.05 },
    { label: "+15%", factor: 1.15 },
    { label: "x2", factor: 2 },
];

const heroVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const stackedVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] as const } },
};

const goalCardVariants: Variants = {
    hidden: { opacity: 0, y: 25, scale: 0.95 },
    visible: (index: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { delay: index * 0.06, duration: 0.5, ease: [0.34, 0.8, 0.22, 1] as const },
    }),
};

export default function DashboardFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [preset, setPreset] = useState<DateRangePreset>(
        (searchParams.get("preset") as DateRangePreset) || "thisMonth"
    );
    const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
        const from = searchParams.get("from");
        const to = searchParams.get("to");
        if (from && to) {
            return {
                from: new Date(from),
                to: new Date(to),
            };
        }
        return getPresetDateRange("thisMonth");
    });

    type GoalInputState = Record<MetricGoalKey, string>;

    const buildGoalState = useCallback((stored?: StoredGoals): GoalInputState => {
        return metricGoalKeys.reduce((acc, key) => {
            const paramName = GOAL_PARAM_MAP[key];
            const raw = searchParams.get(paramName);
            const parsed = raw ? Number(raw) : NaN;
            const storedValue = stored?.[key];

            if (Number.isFinite(parsed) && parsed > 0) {
                acc[key] = parsed.toString();
            } else if (typeof storedValue === "number" && storedValue > 0) {
                acc[key] = storedValue.toString();
            } else {
                acc[key] = DEFAULT_METRIC_GOALS[key].value.toString();
            }

            return acc;
        }, {} as GoalInputState);
    }, [searchParams]);

    const [goalInputs, setGoalInputs] = useState<GoalInputState>(() => buildGoalState());
    const [storedGoals, setStoredGoals] = useState<StoredGoals>({});

    const persistGoalMap = useCallback((next: StoredGoals) => {
        if (typeof window === "undefined") return;
        if (Object.keys(next).length) {
            window.localStorage.setItem(GOAL_STORAGE_KEY, JSON.stringify(next));
        } else {
            window.localStorage.removeItem(GOAL_STORAGE_KEY);
        }
    }, []);

    const syncStoredGoal = useCallback((key: MetricGoalKey, numericValue?: number) => {
        setStoredGoals((previous) => {
            const next = { ...previous } as StoredGoals;
            if (typeof numericValue === "number" && Number.isFinite(numericValue) && numericValue > 0) {
                next[key] = numericValue;
            } else {
                delete next[key];
            }
            persistGoalMap(next);
            return next;
        });
    }, [persistGoalMap]);

    const clearStoredGoals = useCallback(() => {
        setStoredGoals({});
        persistGoalMap({});
    }, [persistGoalMap]);

    // Get date range based on preset
    function getPresetDateRange(presetValue: DateRangePreset): DateRange | undefined {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        switch (presetValue) {
            case "today":
                return { from: today, to: today };

            case "yesterday": {
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                return { from: yesterday, to: yesterday };
            }

            case "last7days": {
                const last7days = new Date(today);
                last7days.setDate(last7days.getDate() - 6);
                return { from: last7days, to: today };
            }

            case "last30days": {
                const last30days = new Date(today);
                last30days.setDate(last30days.getDate() - 29);
                return { from: last30days, to: today };
            }

            case "thisMonth": {
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                return { from: startOfMonth, to: today };
            }

            case "lastMonth": {
                const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
                return { from: startOfLastMonth, to: endOfLastMonth };
            }

            case "last3months": {
                const last3months = new Date(now.getFullYear(), now.getMonth() - 2, 1);
                return { from: last3months, to: today };
            }

            case "last6months": {
                const last6months = new Date(now.getFullYear(), now.getMonth() - 5, 1);
                return { from: last6months, to: today };
            }

            case "thisYear": {
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                return { from: startOfYear, to: today };
            }

            default:
                return undefined;
        }
    }

    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            const raw = window.localStorage.getItem(GOAL_STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw) as Record<string, number> | null;
            if (!parsed) return;
            const sanitized = Object.entries(parsed).reduce((acc, [rawKey, rawValue]) => {
                if (!metricGoalKeys.includes(rawKey as MetricGoalKey)) {
                    return acc;
                }
                const numericValue = typeof rawValue === "number" ? rawValue : Number(rawValue);
                if (Number.isFinite(numericValue) && numericValue > 0) {
                    acc[rawKey as MetricGoalKey] = numericValue;
                }
                return acc;
            }, {} as StoredGoals);
            if (Object.keys(sanitized).length) {
                setStoredGoals(sanitized);
            }
        } catch (error) {
            // Ignore storage hydration errors silently
        }
    }, []);

    useEffect(() => {
        setGoalInputs(buildGoalState(storedGoals));
    }, [buildGoalState, storedGoals]);

    useEffect(() => {
        if (!Object.keys(storedGoals).length) return;
        const params = new URLSearchParams(searchParams.toString());
        let mutated = false;
        metricGoalKeys.forEach((key) => {
            const paramName = GOAL_PARAM_MAP[key];
            if (!params.get(paramName)) {
                const storedValue = storedGoals[key];
                if (typeof storedValue === "number" && storedValue > 0) {
                    params.set(paramName, storedValue.toString());
                    mutated = true;
                }
            }
        });
        if (mutated) {
            router.replace(`/dashboard?${params.toString()}`, { scroll: false });
        }
    }, [storedGoals, router, searchParams]);

    const persistGoalValue = useCallback((key: MetricGoalKey, rawValue: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const paramName = GOAL_PARAM_MAP[key];
        const numericValue = Number(rawValue);
        const isValid = Number.isFinite(numericValue) && numericValue > 0;

        if (isValid) {
            params.set(paramName, numericValue.toString());
        } else {
            params.delete(paramName);
        }

        const previousQuery = searchParams.toString();
        const nextQuery = params.toString();
        if (nextQuery !== previousQuery) {
            router.replace(`/dashboard?${nextQuery}`, { scroll: false });
        }

        syncStoredGoal(key, isValid ? numericValue : undefined);
    }, [router, searchParams, syncStoredGoal]);

    const handleGoalInputChange = (key: MetricGoalKey, value: string) => {
        if (value === "" || /^[0-9]*$/.test(value)) {
            setGoalInputs((prev) => ({ ...prev, [key]: value }));
        }
    };

    const handleGoalCommit = (key: MetricGoalKey, value?: string) => {
        const candidate = (value ?? goalInputs[key]).trim();
        persistGoalValue(key, candidate);
    };

    const handleQuickGoal = (key: MetricGoalKey, factor: number) => {
        const currentValue = Number(goalInputs[key]);
        const sourceValue = Number.isFinite(currentValue) && currentValue > 0
            ? currentValue
            : DEFAULT_METRIC_GOALS[key].value;
        const nextValue = Math.max(1, Math.round(sourceValue * factor));
        const nextValueString = nextValue.toString();
        setGoalInputs((prev) => ({ ...prev, [key]: nextValueString }));
        persistGoalValue(key, nextValueString);
    };

    const handleGoalReset = () => {
        const params = new URLSearchParams(searchParams.toString());
        let mutated = false;
        metricGoalKeys.forEach((key) => {
            const paramName = GOAL_PARAM_MAP[key];
            if (params.has(paramName)) {
                params.delete(paramName);
                mutated = true;
            }
        });
        if (mutated) {
            router.replace(`/dashboard?${params.toString()}`, { scroll: false });
        }

        clearStoredGoals();
        setGoalInputs(getDefaultGoalState());
    };

    // Apply filters to URL - Fixed to avoid circular dependencies
    const applyFilters = useCallback((currentPreset: DateRangePreset, currentRange: DateRange | undefined) => {
        const params = new URLSearchParams(searchParams.toString());

        if (currentPreset !== "custom") {
            params.set("preset", currentPreset);
            const range = getPresetDateRange(currentPreset);
            if (range?.from) params.set("from", range.from.toISOString());
            if (range?.to) params.set("to", range.to.toISOString());
        } else if (currentRange?.from && currentRange?.to) {
            params.set("preset", "custom");
            params.set("from", currentRange.from.toISOString());
            params.set("to", currentRange.to.toISOString());
        } else {
            // If custom but incomplete, don't update
            return;
        }

        router.push(`/dashboard?${params.toString()}`, { scroll: false });
    }, [router, searchParams]);

    // Handle preset change
    const handlePresetChange = (value: DateRangePreset) => {
        setPreset(value);
        if (value !== "custom") {
            const range = getPresetDateRange(value);
            setDateRange(range);
            // Apply immediately for presets
            applyFilters(value, range);
        }
    };

    // Handle custom date range change
    const handleDateRangeChange = (range: DateRange | undefined) => {
        setDateRange(range);
        if (range?.from && range?.to) {
            setPreset("custom");
            // Apply immediately when both dates are selected
            applyFilters("custom", range);
        }
    };

    // Reset filters
    const handleReset = () => {
        const defaultPreset: DateRangePreset = "thisMonth";
        const defaultRange = getPresetDateRange(defaultPreset);
        setPreset(defaultPreset);
        setDateRange(defaultRange);
        applyFilters(defaultPreset, defaultRange);
    };

    // Sync with URL params on mount
    useEffect(() => {
        const urlPreset = searchParams.get("preset") as DateRangePreset;
        const urlFrom = searchParams.get("from");
        const urlTo = searchParams.get("to");

        if (urlPreset && urlFrom && urlTo) {
            setPreset(urlPreset);
            setDateRange({
                from: new Date(urlFrom),
                to: new Date(urlTo)
            });
        } else if (!urlPreset && !urlFrom && !urlTo) {
            // No params in URL, apply default
            const defaultPreset: DateRangePreset = "thisMonth";
            const defaultRange = getPresetDateRange(defaultPreset);
            applyFilters(defaultPreset, defaultRange);
        }
    }, []); // Only run on mount

    const selectedPresetMeta = presetOptions.find((option) => option.value === preset);
    const presetLabel = selectedPresetMeta?.label ?? "Personalizado";
    const totalDaysSelected =
        dateRange?.from && dateRange?.to
            ? Math.max(1, Math.round((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1)
            : undefined;
    const activeAccent = presetAccentMap[preset] ?? "from-blue-500/60 via-cyan-500/30 to-sky-500/20";
    const accentBorder = presetBorderMap[preset] ?? "from-slate-800 via-blue-600 to-slate-900";
    const accentBeam = presetBeamMap[preset] ?? "bg-blue-500/35";

    return (
        <Card className="relative z-10 mb-6 overflow-hidden rounded-4xl border border-slate-500/20 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-slate-950/95  shadow-[0_10px_60px_rgba(59,130,246,0.18)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_60%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(56,189,248,0.06)_1px,transparent_1px)] bg-size-[160px_160px] opacity-30" />
            <div className="pointer-events-none absolute -top-32 left-6 h-64 w-64 rounded-full bg-cyan-500/20 blur-[140px]" />
            <div className="pointer-events-none absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-blue-500/18 blur-[160px]" />

            <div className="relative z-10 space-y-4 p-5 md:p-8">
                <motion.div
                    variants={heroVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between"
                >
                    <div className="max-w-2xl space-y-1">
                        <p className="text-2xl font-semibold text-white">Configura tu panel de métricas</p>
                        <p className="text-sm text-slate-300">
                            Ajusta el rango temporal y define metas potentes.
                        </p>
                        
                    </div>

                   <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-white/70">
                            <span className="rounded-full border border-cyan-400/30 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-3 py-1 text-cyan-100 shadow-[0_0_15px_rgba(34,211,238,0.35)] animate-pulse">
                                Panel activo
                            </span>
                          
                        </div>
                </motion.div>

                <motion.div
                    variants={stackedVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.4 }}
                    className="flex flex-col gap-10 lg:flex-row lg:items-center"
                >
                    <div className="flex-1 rounded-[28px] border-none shadow-none ">
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="flex-1 min-w-60">
                                <PresetDropdown value={preset} onChange={handlePresetChange} />
                            </div>
                            {preset === "custom" && (
                                <div className="flex-1 min-w-[280px] rounded-2xl border border-dashed border-white/15 bg-slate-950/40 px-2 py-1 shadow-inner shadow-black/30">
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
                        className="group relative h-12 min-w-[170px] overflow-hidden rounded-2xl border border-blue-400/25 bg-gradient-to-r from-slate-900/60 to-slate-800/60 px-6 text-sm font-semibold text-white backdrop-blur-xl shadow-md shadow-blue-500/10 transition-all duration-500 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:shadow-xl hover:shadow-blue-500/15"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-cyan-500/10 opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
                        <span className="absolute inset-0 translate-y-full bg-gradient-to-r from-cyan-500/25 via-blue-500/20 to-cyan-500/25 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100" />
                        <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                            <RotateCcw className="h-4 w-4 text-cyan-300 transition-transform duration-500 group-hover:-rotate-180" />
                            Restablecer
                        </span>
                    </Button>
                </motion.div>

                {dateRange?.from && (
                    <motion.div
                        variants={stackedVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.4 }}
                        className="grid gap-4 lg:grid-cols-[2fr,1fr]"
                    >
                        <div className="relative overflow-hidden rounded-3xl border border-slate-700/80 bg-gradient-to-br from-slate-900/90 via-slate-800/85 to-slate-900/90 p-5 shadow-md shadow-slate-900/30">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_65%)] opacity-60" />
                            <div className="relative space-y-4">
                                <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.35em] text-blue-200">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>Período</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-sm">
                                    <span className="rounded-2xl bg-slate-950/80 border border-blue-500/15 px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-900/20">
                                        {dateRange.from.toLocaleDateString("es-ES", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </span>
                                    {dateRange.to && dateRange.to.getTime() !== dateRange.from.getTime() && (
                                        <>
                                            <div className="flex items-center gap-1 text-cyan-400">
                                                <div className="h-0.5 w-4 rounded bg-blue-600" />
                                                <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                                                <div className="h-0.5 w-4 rounded bg-blue-600" />
                                            </div>
                                            <span className="rounded-2xl bg-slate-950/80 border border-blue-500/15 px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-900/20">
                                                {dateRange.to.toLocaleDateString("es-ES", {
                                                    day: "2-digit",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </>
                                    )}
                                </div>
                               
                            </div>
                        </div>

                        <div className={cn("relative rounded-[28px] bg-gradient-to-r p-px", accentBorder)}>
                            <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-950/95 p-5 text-white">
                                <div className={`absolute inset-0 bg-gradient-to-br ${activeAccent} opacity-60`} />
                                <div className={`absolute -top-16 right-6 h-32 w-32 rounded-full blur-3xl ${accentBeam} opacity-60`} />
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/30 via-transparent" />
                                <div className="relative z-10 flex h-full flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-blue-200">
                                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                                            Preset activo
                                        </div>
                                        <Clock className="h-4 w-4 text-slate-300" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-2xl font-semibold leading-tight tracking-tight text-white">{presetLabel}</p>
                                        {totalDaysSelected && (
                                            <p className="text-sm text-slate-300">{totalDaysSelected} días seleccionados</p>
                                        )}
                                        {selectedPresetMeta?.description && (
                                            <p className="text-xs text-slate-400">{selectedPresetMeta.description}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    variants={stackedVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.4 }}
                    className="rounded-[30px] border border-blue-500/20 bg-gradient-to-br from-slate-900/90 via-slate-800/85 to-slate-900/90 p-5 shadow-md shadow-blue-500/10"
                >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1">
                            <p className="text-lg font-semibold text-white">Metas personalizadas</p>
                            <p className="text-xs text-slate-300">
                                Guardamos tus objetivos para un mejor seguimiento del rendimiento.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleGoalReset}
                                className="h-10 rounded-2xl border border-blue-400/25 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 px-4 text-xs font-semibold uppercase tracking-[0.3em] text-blue-200 transition hover:from-blue-500/25 hover:to-cyan-500/25 hover:shadow-md hover:shadow-blue-500/20"
                            >
                                <Sparkles className="mr-2 h-4 w-4" />
                                Restablecer metas
                            </Button>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {metricGoalKeys.map((key, index) => {
                            const meta = goalInputMeta[key];
                            const base = DEFAULT_METRIC_GOALS[key];
                            const visuals = goalVisuals[key];
                            const inputValue = goalInputs[key] ?? "";
                            const numericValue = Number(inputValue);
                            const isValidValue = Number.isFinite(numericValue) && numericValue > 0;
                            const effectiveValue = isValidValue ? numericValue : base.value;
                            const isCustom = isValidValue && numericValue !== base.value;
                            const friendlyEffective = formatGoalValue(key, effectiveValue);
                            const friendlyBase = formatGoalValue(key, base.value);

                            return (
                                <motion.div
                                    key={key}
                                    variants={goalCardVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.3 }}
                                    custom={index}
                                    whileHover={{ y: -6, scale: 1.01 }}
                                    className="relative overflow-hidden rounded-3xl shadow-md bg-gradient-to-br from-slate-900/90 via-slate-800/85 to-slate-900/90 p-5 text-white"
                                >
                                    <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br", visuals.gradient, "opacity-70")} />
                                    <div className={cn("pointer-events-none absolute -top-12 right-6 h-28 w-28 rounded-full blur-3xl", visuals.beam, "opacity-50")} />
                                    <div className="absolute inset-0 bg-slate-950/20" />
                                    <div className="relative z-10 flex h-full flex-col gap-4">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                                                    {base.label}
                                                </span>
                                                <Badge
                                                    variant={isCustom ? "success" : "secondary"}
                                                    className="text-[10px] uppercase tracking-[0.2em] text-white"
                                                >
                                                    {isCustom ? "Personalizada" : "Sugerida"}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-slate-300">
                                                Objetivo:
                                                <span className="ml-1 font-semibold text-white">{friendlyEffective}</span>
                                            </p>
                                            <p className="text-[11px] text-slate-400">{meta.helper}</p>
                                        </div>

                                        <div className="relative">
                                            {meta.prefix && (
                                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                                                    {meta.prefix}
                                                </span>
                                            )}
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                value={inputValue}
                                                onChange={(event) => handleGoalInputChange(key, event.target.value)}
                                                onBlur={(event) => handleGoalCommit(key, event.target.value)}
                                                onKeyDown={(event) => {
                                                    if (event.key === "Enter") {
                                                        (event.target as HTMLInputElement).blur();
                                                    }
                                                }}
                                                className={cn(
                                                    "h-14 w-full rounded-2xl border border-blue-500/25 bg-slate-950/60 px-4 text-base font-semibold tracking-wide text-white placeholder:text-slate-500 focus:border-cyan-400/70 focus:outline-none focus:ring-2 focus:ring-cyan-500/25",
                                                    meta.prefix ? "pl-11" : ""
                                                )}
                                                placeholder={base.value.toString()}
                                            />
                                            {meta.suffix && (
                                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                                                    {meta.suffix}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
                                            <span className="rounded-full border border-blue-500/25 bg-blue-500/15 px-2 py-1 font-semibold text-blue-200">
                                                Base: {friendlyBase}
                                            </span>
                                        
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                                            {quickGoalPresets.map((preset) => (
                                                <motion.button
                                                    key={preset.label}
                                                    type="button"
                                                    whileHover={{ y: -2 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={() => handleQuickGoal(key, preset.factor)}
                                                    className="rounded-2xl border border-blue-500/25 bg-gradient-to-br from-blue-500/15 via-cyan-500/12 to-blue-500/15 px-2 py-2 text-white transition hover:from-blue-500/25 hover:via-cyan-500/20 hover:to-blue-500/25 hover:border-cyan-400/35 hover:shadow-md hover:shadow-blue-500/20"
                                                >
                                                    {preset.label}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </Card>
    );
}

type PresetDropdownProps = {
    value: DateRangePreset;
    onChange: (value: DateRangePreset) => void;
};

function PresetDropdown({ value, onChange }: PresetDropdownProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [menuPosition, setMenuPosition] = useState<{ top: number; left: number; width: number } | null>(null);
    const selected = presetOptions.find((option) => option.value === value) ?? presetOptions[0];

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
        const handleClick = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                containerRef.current &&
                !containerRef.current.contains(target) &&
                (!menuRef.current || !menuRef.current.contains(target))
            ) {
                setOpen(false);
            }
        };

        const handleKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
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

    const handleSelect = (nextValue: DateRangePreset) => {
        onChange(nextValue);
        setOpen(false);
    };

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((previous) => !previous)}
                    className="flex w-full items-center justify-between gap-3 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-slate-900/70 to-slate-800/70 p-4 text-left text-white shadow-md shadow-blue-500/10 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:shadow-xl hover:shadow-blue-500/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-md shadow-blue-500/25">
                        <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                            <p className="text-sm font-semibold text-white">{selected.label}</p>
                            <p className="text-xs text-slate-400">{selected.description}</p>
                    </div>
                </div>
                <ChevronDown className={cn("h-4 w-4 text-slate-500 transition-transform duration-200", open ? "rotate-180" : "rotate-0")} />
            </button>

            {open && menuPosition && typeof document !== "undefined"
                ? createPortal(
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
                        <div className="rounded-2xl border border-blue-500/20 bg-slate-950/98 p-2 shadow-[0_20px_60px_rgba(59,130,246,0.25)] backdrop-blur-xl">
                            <div className="max-h-72 space-y-1 overflow-y-auto pr-1">
                                {presetOptions.map((option) => {
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
                                                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/20"
                                                    : "text-slate-300 hover:bg-blue-500/15 hover:text-white"
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
                )
                : null}
        </div>
    );
}
