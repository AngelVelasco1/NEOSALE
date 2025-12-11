"use client";

import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/app/(admin)/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/(admin)/components/ui/popover";

type Props = {
  className?: string;
  date: string | undefined;
  setDate: (date: string) => void;
  container?: HTMLDivElement;
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function DatePicker({ className, date, setDate, container }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full h-12 justify-start text-left font-normal text-sm bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-orange-300 dark:hover:border-orange-700 hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-slate-400 shrink-0" />
          <span className="truncate">{date ? formatDate(date) : "Seleccionar"}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        portalContainer={container}
        className="w-auto p-0 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-xl"
        align="start"
        sideOffset={8}
      >
        <Calendar
          mode="single"
          selected={date ? new Date(date) : new Date()}
          onSelect={(date) => {
            if (date) {
              setDate(new Date(date).toISOString());
              setOpen(false);
            }
          }}
          disabled={{
            before: new Date("2023-01-01"),
            after: new Date(),
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}