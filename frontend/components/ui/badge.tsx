import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-lg border px-2 py-1 text-[0.7rem] font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-blue-700 bg-blue-900 text-blue-200 [a&]:hover:bg-blue-800",
        success:
          "border-green-700 bg-green-900 text-green-200 [a&]:hover:bg-green-800",
        secondary:
          "border-slate-600 bg-slate-700 text-slate-200 [a&]:hover:bg-slate-600",
        destructive:
          "border-red-700 bg-red-900 text-red-200 [a&]:hover:bg-red-800 focus-visible:ring-red-700",
        warning:
          "border-amber-700 bg-amber-900 text-amber-200 [a&]:hover:bg-amber-800",
        info:
          "border-cyan-700 bg-cyan-900 text-cyan-200 [a&]:hover:bg-cyan-800",
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
