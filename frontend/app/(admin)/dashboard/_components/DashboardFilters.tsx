"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, RotateCcw } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

export type DateRangePreset = "today" | "yesterday" | "last7days" | "last30days" | "thisMonth" | "lastMonth" | "last3months" | "last6months" | "thisYear" | "custom";

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

    const presetOptions = [
        { value: "today", label: "Hoy" },
        { value: "yesterday", label: "Ayer" },
        { value: "last7days", label: "Últimos 7 días" },
        { value: "last30days", label: "Últimos 30 días" },
        { value: "thisMonth", label: "Este mes" },
        { value: "lastMonth", label: "Mes anterior" },
        { value: "last3months", label: "Últimos 3 meses" },
        { value: "last6months", label: "Últimos 6 meses" },
        { value: "thisYear", label: "Este año" },
        { value: "custom", label: "Personalizado" },
    ];

    return (
        <Card className="mb-6 p-5 border border-slate-200/60 dark:border-slate-800/60 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl shadow-xl shadow-slate-200/30 dark:shadow-black/40 rounded-2xl overflow-hidden relative">
            {/* Glassmorphism overlay with gradient */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 via-white/30 to-purple-50/50 dark:from-blue-950/20 dark:via-slate-900/50 dark:to-purple-950/20 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_50%)] pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row gap-x-4 items-start md:items-center justify-between">
                {/* Left side - Filters */}
                <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
                    {/* Preset Selector */}
                    <div className="relative group flex-1 min-w-[200px]">

                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400 pointer-events-none z-20 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400" />

                        <Select value={preset} onValueChange={handlePresetChange}>
                            <SelectTrigger className="relative h-12 pl-10 pr-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 focus:border-blue-500 dark:focus:border-blue-500 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-sm font-medium z-10">
                                <SelectValue placeholder="Seleccionar rango" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-1">
                                {presetOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                        className="rounded-lg px-3 py-2.5 my-0.5 cursor-pointer transition-all duration-200 text-sm font-medium
                                                   hover:bg-blue-50 dark:hover:bg-blue-950/50 
                                                   focus:bg-blue-100 dark:focus:bg-blue-900/50 
                                                   data-[state=checked]:bg-blue-500 data-[state=checked]:text-white
                                                   data-[state=checked]:font-semibold"
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Custom Date Range Picker */}
                    {preset === "custom" && (
                        <div className="flex-1 min-w-[280px] animate-in fade-in-50 slide-in-from-left-3 duration-300">
                            <DatePickerWithRange
                                date={dateRange}
                                onDateChange={handleDateRangeChange}
                                className="h-12"
                            />
                        </div>
                    )}
                </div>

                {/* Right side - Reset Button */}
                <Button
                    onClick={handleReset}
                    variant="outline"
                    className="group h-12 px-5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-950/50 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-md whitespace-nowrap"
                >
                    <RotateCcw className="h-4 w-4 mr-2 transition-transform duration-500 group-hover:-rotate-180" />
                    Restablecer
                </Button>
            </div>

            {/* Date Range Display */}
            {dateRange?.from && (
                <div className="relative z-10 pt-5 border-t-2 border-slate-500/60">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border border-blue-200/50 dark:border-blue-800/50 rounded-lg shadow-sm">
                            <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                            <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Período</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-sm">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {dateRange.from.toLocaleDateString("es-ES", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </span>
                            {dateRange.to && dateRange.to.getTime() !== dateRange.from.getTime() && (
                                <>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-0.5 bg-slate-300 dark:bg-slate-600 rounded" />
                                        <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full" />
                                        <div className="w-2 h-0.5 bg-slate-300 dark:bg-slate-600 rounded" />
                                    </div>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
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
            )}
        </Card>
    );
}
