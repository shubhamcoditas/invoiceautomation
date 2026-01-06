import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-normal transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#FBEAEC] text-[#D71921] border-0",
        secondary:
          "bg-[#F2F2F2] text-[#888888] border-0",
        destructive:
          "bg-destructive/10 text-destructive border-0",
        success:
          "bg-success/10 text-success border-0",
        warning:
          "bg-warning/10 text-warning border-0",
        outline: "text-[#1A1A1A] border border-[#CCCCCC]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
