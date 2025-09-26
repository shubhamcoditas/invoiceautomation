import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border-2 border-gray-300 dark:border-gray-600 bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground hover:border-gray-400 dark:hover:border-gray-500 focus-visible:outline-none focus-visible:border-[#00338D] focus-visible:ring-2 focus-visible:ring-[#00338D]/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
