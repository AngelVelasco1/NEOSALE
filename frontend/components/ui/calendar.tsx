"use client"

import * as React from "react"
import {
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    captionLayout = "label",
    buttonVariant = "ghost",
    formatters,
    components,
    ...props
}: React.ComponentProps<typeof DayPicker> & {
    buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
    const defaultClassNames = getDefaultClassNames()

    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn(
                "group/calendar p-6 [--cell-size:3rem] bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900/95 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-inner flex items-center justify-center",
                String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
                String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
                className
            )}
            captionLayout={captionLayout}
            formatters={{
                formatMonthDropdown: (date) =>
                    date.toLocaleString("default", { month: "short" }),
                ...formatters,
            }}
            classNames={{
                root: cn("w-fit", defaultClassNames.root),
                months: cn(
                    "relative flex flex-col gap-6 md:flex-row",
                    defaultClassNames.months
                ),
                month: cn("flex w-full flex-col gap-5 min-w-[260px] min-h-[300px]", defaultClassNames.month),
                nav: cn(
                    "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1 h-12",
                    defaultClassNames.nav
                ),
                button_previous: cn(
                    buttonVariants({ variant: buttonVariant }),
                    "h-10 w-10 select-none p-0 aria-disabled:opacity-50 bg-transparent  text-slate-700 dark:text-slate-200 rounded-xl transition-all duration-200 hover:scale-110 cursor-pointer",
                    defaultClassNames.button_previous
                ),
                button_next: cn(
                    buttonVariants({ variant: buttonVariant }),
                    "h-10 w-10 select-none p-0 aria-disabled:opacity-50 bg-transparent  text-slate-700 dark:text-slate-200 rounded-xl transition-all duration-200 hover:scale-110 cursor-pointer",
                    defaultClassNames.button_next
                ),
                month_caption: cn(
                    "flex h-12 w-full items-center justify-center px-12 bg-linear-to-r from-slate-800/90 via-slate-800/95 to-slate-800/90 dark:from-slate-800 dark:via-slate-750 dark:to-slate-800 rounded-xl border-2 border-slate-700/80 dark:border-slate-600/80 mb-3 shadow-lg",
                    defaultClassNames.month_caption
                ),
                dropdowns: cn(
                    "flex h-[--cell-size] w-full items-center justify-center gap-1.5 text-sm font-medium",
                    defaultClassNames.dropdowns
                ),
                dropdown_root: cn(
                    "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
                    defaultClassNames.dropdown_root
                ),
                dropdown: cn(
                    "bg-popover absolute inset-0 opacity-0",
                    defaultClassNames.dropdown
                ),
                caption_label: cn(
                    "select-none font-bold text-base bg-linear-to-r from-blue-400 via-cyan-300 to-blue-400 dark:from-blue-300 dark:via-cyan-200 dark:to-blue-300 bg-clip-text text-transparent",
                    captionLayout === "label"
                        ? ""
                        : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
                    defaultClassNames.caption_label
                ),
                table: "w-full border-collapse mt-2 h-[200px]",
                weekdays: cn("flex mb-2", defaultClassNames.weekdays),
                weekday: cn(
                    "text-slate-600 dark:text-slate-300 flex-1 select-none rounded-md text-xs font-bold uppercase tracking-wider",
                    defaultClassNames.weekday
                ),
                week: cn("mt-1.5 flex w-full gap-1.5", defaultClassNames.week),
                week_number_header: cn(
                    "w-[--cell-size] select-none",
                    defaultClassNames.week_number_header
                ),
                week_number: cn(
                    "text-muted-foreground select-none text-[0.8rem]",
                    defaultClassNames.week_number
                ),
                day: cn(
                    "group/day relative aspect-square h-full w-full select-none p-0 text-center",
                    defaultClassNames.day
                ),
                range_start: cn(
                    "bg-slate-700/40 dark:bg-slate-700/50 rounded-l-xl",
                    defaultClassNames.range_start
                ),
                range_middle: cn(
                    "bg-slate-700/20 dark:bg-slate-700/30 rounded-none",
                    defaultClassNames.range_middle
                ),
                range_end: cn(
                    "bg-slate-700/40 dark:bg-slate-700/50 rounded-r-xl",
                    defaultClassNames.range_end
                ),
                today: cn(
                    "bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-500 rounded-xl font-bold data-[selected=true]:rounded-xl",
                    defaultClassNames.today
                ),
                outside: cn(
                    "text-slate-400 dark:text-slate-600 opacity-40 aria-selected:text-slate-400 aria-selected:opacity-30",
                    defaultClassNames.outside
                ),
                disabled: cn(
                    "text-slate-300 dark:text-slate-700 opacity-30",
                    defaultClassNames.disabled
                ),
                hidden: cn("invisible", defaultClassNames.hidden),
                ...classNames,
            }}
            components={{
                Root: ({ className, rootRef, ...props }) => {
                    return (
                        <div
                            data-slot="calendar"
                            ref={rootRef}
                            className={cn(className)}
                            {...props}
                        />
                    )
                },
                Chevron: ({ className, orientation, ...props }) => {
                    if (orientation === "left") {
                        return (
                            <ChevronLeftIcon className={cn("size-4", className)} {...props} />
                        )
                    }

                    if (orientation === "right") {
                        return (
                            <ChevronRightIcon
                                className={cn("size-4", className)}
                                {...props}
                            />
                        )
                    }

                    return (
                        <ChevronDownIcon className={cn("size-4", className)} {...props} />
                    )
                },
                DayButton: CalendarDayButton,
                WeekNumber: ({ children, ...props }) => {
                    return (
                        <td {...props}>
                            <div className="flex size-[--cell-size] items-center justify-center text-center">
                                {children}
                            </div>
                        </td>
                    )
                },
                ...components,
            }}
            {...props}
        />
    )
}

function CalendarDayButton({
    className,
    day,
    modifiers,
    ...props
}: React.ComponentProps<typeof DayButton>) {
    const defaultClassNames = getDefaultClassNames()

    const ref = React.useRef<HTMLButtonElement>(null)
    React.useEffect(() => {
        if (modifiers.focused) ref.current?.focus()
    }, [modifiers.focused])

    return (
        <Button
            ref={ref}
            variant="ghost"
            size="icon"
            data-day={day.date.toLocaleDateString()}
            data-selected-single={
                modifiers.selected &&
                !modifiers.range_start &&
                !modifiers.range_end &&
                !modifiers.range_middle
            }
            data-range-start={modifiers.range_start}
            data-range-end={modifiers.range_end}
            data-range-middle={modifiers.range_middle}
            className={cn(
                "flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-semibold leading-none rounded-xl transition-all duration-200 text-slate-700 dark:text-slate-200",
                "hover:bg-slate-700/30 hover:border-2 hover:border-slate-600/50 dark:hover:bg-slate-700/40 dark:hover:border-slate-500/60 hover:scale-105 hover:text-slate-900 dark:hover:text-white",
                "data-[selected-single=true]:bg-linear-to-br data-[selected-single=true]:from-blue-600 data-[selected-single=true]:via-blue-700 data-[selected-single=true]:to-cyan-600",
                "dark:data-[selected-single=true]:from-blue-500 dark:data-[selected-single=true]:via-blue-600 dark:data-[selected-single=true]:to-cyan-500",
                "data-[selected-single=true]:text-white data-[selected-single=true]:shadow-2xl data-[selected-single=true]:shadow-blue-900/60 dark:data-[selected-single=true]:shadow-blue-500/40 data-[selected-single=true]:scale-110",
                "data-[selected-single=true]:border-2 data-[selected-single=true]:border-slate-200/30 dark:data-[selected-single=true]:border-slate-100/20",
                "data-[range-start=true]:bg-linear-to-br data-[range-start=true]:from-blue-600 data-[range-start=true]:via-blue-700 data-[range-start=true]:to-cyan-600",
                "dark:data-[range-start=true]:from-blue-500 dark:data-[range-start=true]:via-blue-600 dark:data-[range-start=true]:to-cyan-500",
                "data-[range-start=true]:text-white data-[range-start=true]:shadow-2xl data-[range-start=true]:shadow-blue-900/60 dark:data-[range-start=true]:shadow-blue-500/40 data-[range-start=true]:scale-110",
                "data-[range-start=true]:border-2 data-[range-start=true]:border-slate-200/30 dark:data-[range-start=true]:border-slate-100/20 data-[range-start=true]:rounded-xl",
                "data-[range-end=true]:bg-linear-to-br data-[range-end=true]:from-blue-600 data-[range-end=true]:via-blue-700 data-[range-end=true]:to-cyan-600",
                "dark:data-[range-end=true]:from-blue-500 dark:data-[range-end=true]:via-blue-600 dark:data-[range-end=true]:to-cyan-500",
                "data-[range-end=true]:text-white data-[range-end=true]:shadow-2xl data-[range-end=true]:shadow-blue-900/60 dark:data-[range-end=true]:shadow-blue-500/40 data-[range-end=true]:scale-110",
                "data-[range-end=true]:border-2 data-[range-end=true]:border-slate-200/30 dark:data-[range-end=true]:border-slate-100/20 data-[range-end=true]:rounded-xl",
                "data-[range-middle=true]:bg-slate-700/30 dark:data-[range-middle=true]:bg-slate-700/40 data-[range-middle=true]:text-slate-900 dark:data-[range-middle=true]:text-slate-100",
                "data-[range-middle=true]:font-bold data-[range-middle=true]:rounded-lg",
                "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10",
                "group-data-[focused=true]/day:ring-4 group-data-[focused=true]/day:ring-blue-400/50 dark:group-data-[focused=true]/day:ring-cyan-400/40",
                "[&>span]:text-sm",
                defaultClassNames.day,
                className
            )}
            {...props}
        />
    )
}

export { Calendar, CalendarDayButton }
