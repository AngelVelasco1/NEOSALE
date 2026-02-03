"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({ className, classNames, showOutsideDays = true, styles, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col gap-4",
        month: "space-y-4",
        caption: "flex items-center justify-between px-1",
        caption_label: "text-sm font-semibold",
        nav: "flex items-center gap-2",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 p-0  shadow-sm hover:text-orange-600 text-slate-200"
        ),
        nav_button_previous: "",
        nav_button_next: "",
        table: "w-full",
        head_row: "grid grid-cols-7 gap-2 px-1",
        head_cell:
          "h-8 rounded-full text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 text-slate-500",
        row: "grid grid-cols-7 gap-2",
        cell: "relative",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-full rounded-xl p-0 text-sm font-semibold text-slate-200 hover:bg-orange-500/20 hover:text-orange-100 aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-orange-500 text-white shadow-lg shadow-orange-500/30 hover:bg-orange-500 hover:text-white",
        day_today:
          "border border-orange-300 bg-white shadow-sm border-orange-400 bg-slate-900 text-orange-200",
        day_outside:
          "day-outside text-muted-foreground opacity-60 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-40",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      styles={{
        head_row: {
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
        },
        row: {
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
        },
        ...styles,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" {...props} />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" {...props} />,
      }}
      {...props}
    />
  );
}
