import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-2 py-1 text-[0.7rem] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "text-foreground",
        destructive:
          "border-red-300 bg-red-100 text-red-800 dark:border-red-700 dark:bg-red-900 dark:text-red-200 [a&]:hover:bg-red-200 dark:[a&]:hover:bg-red-800 focus-visible:ring-red-300 dark:focus-visible:ring-red-700",
        success:
          "border-green-300 bg-green-100 text-green-800 dark:border-green-700 dark:bg-green-900 dark:text-green-200 [a&]:hover:bg-green-200 dark:[a&]:hover:bg-green-800",
        warning:
          "border-transparent bg-yellow-200 text-yellow-600 dark:bg-yellow-600 dark:text-yellow-200 print:!bg-yellow-200 print:!text-yellow-600 group-[.light-only]:bg-yellow-200 group-[.light-only]:text-yellow-600",
        processing:
          "border-transparent bg-blue-200 text-blue-600 dark:bg-blue-600 dark:text-blue-200 print:!bg-blue-200 print:!text-blue-600 group-[.light-only]:bg-blue-200 group-[.light-only]:text-blue-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type BadgeVariantProps = Exclude<
  VariantProps<typeof badgeVariants>["variant"],
  null | undefined
>;

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
