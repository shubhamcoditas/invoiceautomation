import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 ease-interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:translate-y-px active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "group bg-primary text-primary-foreground shadow-md hover:-translate-y-0.5 hover:bg-primary hover:shadow-[0_12px_40px_-8px_var(--accent-glow)] [&_svg:last-child]:transition-transform [&_svg:last-child]:duration-200 hover:[&_svg:last-child]:translate-x-0.5",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:-translate-y-0.5",
        outline:
          "border border-white/12 bg-white/[0.04] backdrop-blur-md text-foreground hover:bg-white/[0.07] hover:border-[var(--border-accent-weak)] hover:-translate-y-0.5 hover:shadow-[0_0_28px_-6px_var(--accent-glow-weak)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90 border border-white/8",
        ghost: "hover:bg-white/[0.06] hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline hover:text-[var(--accent-cyan-soft)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-xl px-8",
        icon: "h-10 w-10",
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
  loading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, loadingText, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const isDisabled = disabled || loading
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          loading && "cursor-wait"
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <Loader2 
            className={cn(
              "animate-spin",
              size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-5 w-5" : "h-4 w-4"
            )} 
          />
        )}
        {loading ? (loadingText || children) : children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
