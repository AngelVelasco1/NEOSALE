"use client";

import * as React from "react";
import { CalendarIcon, ArrowRight } from "lucide-react";
import { DateRange } from "react-day-picker";
import { es } from "date-fns/locale";
import { differenceInDays, format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps {
    date?: DateRange;
    onDateChange?: (date: DateRange | undefined) => void;
    className?: string;
}

export function DatePickerWithRange({
    date,
    onDateChange,
    className,
}: DatePickerWithRangeProps) {
    const [open, setOpen] = React.useState(false);
    const maxRangeDays = 183; // 6 meses

    const handleFromChange = (newFrom: Date | undefined) => {
        if (newFrom && date?.to) {
            const daysDiff = differenceInDays(date.to, newFrom);

            if (daysDiff > maxRangeDays) {
                const maxDate = new Date(newFrom);
                maxDate.setDate(maxDate.getDate() + maxRangeDays);
                onDateChange?.({ from: newFrom, to: maxDate });
            } else if (daysDiff >= 0) {
                onDateChange?.({ from: newFrom, to: date.to });
            } else {
                onDateChange?.({ from: newFrom, to: undefined });
            }
        } else {
            onDateChange?.({ from: newFrom, to: date?.to });
        }
    };

    const handleToChange = (newTo: Date | undefined) => {
        if (date?.from && newTo) {
            const daysDiff = differenceInDays(newTo, date.from);

            if (daysDiff > maxRangeDays) {
                const maxDate = new Date(date.from);
                maxDate.setDate(maxDate.getDate() + maxRangeDays);
                onDateChange?.({ from: date.from, to: maxDate });
            } else if (daysDiff >= 0) {
                onDateChange?.({ from: date.from, to: newTo });
            }
        } else {
            onDateChange?.({ from: date?.from, to: newTo });
        }
    };

    const getDaysDiff = () => {
        if (date?.from && date?.to) {
            return differenceInDays(date.to, date.from) + 1;
        }
        return 0;
    };

    const daysDiff = getDaysDiff();
    const isValidRange = date?.from && date?.to;

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-full h-full justify-start text-left font-medium bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-950/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300",
                            !date?.from && "text-slate-400 dark:text-slate-500"
                        )}
                    >
                        <CalendarIcon className="mr-3 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                        {date?.from ? (
                            date.to ? (
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {format(date.from, "d MMM yyyy", { locale: es })}
                                    </span>
                                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {format(date.to, "d MMM yyyy", { locale: es })}
                                    </span>
                                </div>
                            ) : (
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {format(date.from, "d MMM yyyy", { locale: es })}
                                </span>
                            )
                        ) : (
                            <span>Selecciona un rango de fechas</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto p-0 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
                    align="start"
                    sideOffset={10}
                >
                    {/* Header */}
                    <div className="px-6 py-4 bg-linear-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border-b-2 border-slate-200 dark:border-slate-700">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                            Selecciona el Rango
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            {/* From Date */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                    Fecha Inicio
                                </label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal bg-white dark:bg-slate-800 border-2 hover:border-blue-400 dark:hover:border-blue-500",
                                                !date?.from && "text-slate-400 dark:text-slate-500"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            {date?.from ? (
                                                <span className="font-semibold text-blue-700 dark:text-blue-300">
                                                    {format(date.from, "d MMM yyyy", { locale: es })}
                                                </span>
                                            ) : (
                                                <span>Seleccionar</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date?.from}
                                            onSelect={handleFromChange}
                                            locale={es}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* To Date */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                    Fecha Fin
                                </label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal bg-white dark:bg-slate-800 border-2 hover:border-purple-400 dark:hover:border-purple-500",
                                                !date?.to && "text-slate-400 dark:text-slate-500"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
                                            {date?.to ? (
                                                <span className="font-semibold text-purple-700 dark:text-purple-300">
                                                    {format(date.to, "d MMM yyyy", { locale: es })}
                                                </span>
                                            ) : (
                                                <span>Seleccionar</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date?.to}
                                            onSelect={handleToChange}
                                            locale={es}
                                            disabled={(dateToCheck) => date?.from ? dateToCheck < date.from : false}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Duration Display */}
                        {isValidRange && (
                            <div className="mt-4 p-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                        Duración del período:
                                    </span>
                                    <span className="text-lg font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        {daysDiff} {daysDiff === 1 ? 'día' : 'días'}
                                    </span>
                                </div>
                                {daysDiff > maxRangeDays && (
                                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-2">
                                        ⚠️ El rango se limitará a {maxRangeDays} días
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
