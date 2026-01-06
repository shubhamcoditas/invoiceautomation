import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[6px] text-[14px] font-semibold ring-offset-background transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#D71921] text-white hover:bg-[#B3131B] shadow-none",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-none",
        outline:
          "border border-[#D71921] bg-white text-[#D71921] hover:bg-white hover:text-[#D71921]",
        secondary:
          "bg-white border border-[#D71921] text-[#D71921] hover:bg-white hover:text-[#D71921]",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-[#D71921] underline-offset-4 hover:underline shadow-none",
      },
      size: {
        default: "h-[40px] px-4 py-2",
        sm: "h-[40px] rounded-[6px] px-3",
        lg: "h-[44px] rounded-[6px] px-8",
        icon: "h-[40px] w-[40px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
