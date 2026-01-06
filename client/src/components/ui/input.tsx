import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[42px] w-full rounded-[6px] border border-[#CCCCCC] bg-background px-4 py-2.5 text-[14px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[#888888] hover:border-[#CCCCCC] focus-visible:outline-none focus-visible:border-[#D71921] focus-visible:shadow-[0_0_0_2px_#FBEAEC] disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-150",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
