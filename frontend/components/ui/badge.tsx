import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-lg border px-2 py-1 text-[0.7rem] font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-200 [a&]:hover:bg-blue-200 dark:[a&]:hover:bg-blue-800",
        success:
          "border-green-300 bg-green-100 text-green-800 dark:border-green-700 dark:bg-green-900 dark:text-green-200 [a&]:hover:bg-green-200 dark:[a&]:hover:bg-green-800",
        secondary:
          "border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 [a&]:hover:bg-slate-200 dark:[a&]:hover:bg-slate-600",
        destructive:
          "border-red-300 bg-red-100 text-red-800 dark:border-red-700 dark:bg-red-900 dark:text-red-200 [a&]:hover:bg-red-200 dark:[a&]:hover:bg-red-800 focus-visible:ring-red-300 dark:focus-visible:ring-red-700",
        warning:
          "border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-700 dark:bg-amber-900 dark:text-amber-200 [a&]:hover:bg-amber-200 dark:[a&]:hover:bg-amber-800",
        info:
          "border-cyan-300 bg-cyan-100 text-cyan-800 dark:border-cyan-700 dark:bg-cyan-900 dark:text-cyan-200 [a&]:hover:bg-cyan-200 dark:[a&]:hover:bg-cyan-800",
        outline:
          "border-border bg-transparent text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
