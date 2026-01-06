import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-[6px] border border-[#CCCCCC] bg-background px-4 py-2.5 text-[14px] ring-offset-background placeholder:text-[#888888] hover:border-[#CCCCCC] focus-visible:outline-none focus-visible:border-[#D71921] focus-visible:shadow-[0_0_0_2px_#FBEAEC] disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-150",
          className
        )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
