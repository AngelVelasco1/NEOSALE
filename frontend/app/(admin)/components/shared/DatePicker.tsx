"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
type Props = {
  className?: string;
  date: string | undefined;
  setDate: (date: string) => void;
  container?: HTMLDivElement;
};

function formatDate(dateString: string): string {
  const parsed = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}

export function DatePicker({ className, date, setDate, container }: Props) {
  const [open, setOpen] = useState(false);
  const selected = date ? new Date(date) : undefined;

  const handleSelect = (next?: Date) => {
    if (!next) return;
    setDate(next.toISOString());
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-11 w-full justify-start text-left font-medium rounded-xl border border-slate-200/70 bg-white/85 dark:border-slate-700/80 dark:bg-slate-900/70 backdrop-blur-sm transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50/60 dark:hover:border-emerald-400/70 dark:hover:bg-emerald-900/40 shadow-none hover:shadow-sm",
            !date && "text-slate-400 dark:text-slate-500",
            className
          )}
        >
          <CalendarIcon className="mr-3 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
          <span className="flex min-w-0 items-center gap-2 text-sm">
            <span className="truncate font-semibold text-slate-900 dark:text-white">
              {date ? formatDate(date) : "Seleccionar fecha"}
            </span>
          </span>
          <ChevronDownIcon className="ml-auto h-4 w-4 text-slate-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        portalContainer={container}
        className="w-auto p-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/98 shadow-lg dark:border-slate-700/80 dark:bg-slate-900"
        align="start"
        sideOffset={10}
      >
        <div className="px-5 py-3 border-b border-slate-200/80 bg-linear-to-r from-emerald-50 via-sky-50 to-amber-50 dark:border-slate-700/70 dark:from-emerald-950/30 dark:via-sky-950/25 dark:to-amber-950/25">
          <h3 className="mb-1 text-sm font-semibold text-slate-900 dark:text-white">Selecciona la fecha</h3>
        </div>
        <div className="p-3">
          <Calendar
            mode="single"
            showOutsideDays
            selected={selected}
            onSelect={handleSelect}
            disabled={{
              before: new Date("2023-01-01"),
              after: new Date(),
            }}
            initialFocus
            className="rounded-2xl border border-slate-200/70 bg-white p-3 shadow-none dark:border-slate-800 dark:bg-slate-900"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
