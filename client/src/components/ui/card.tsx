import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "group/card relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] text-card-foreground shadow-[var(--panel-shadow)] backdrop-blur-md transition-all duration-200 ease-interactive will-change-transform",
      "before:pointer-events-none before:absolute before:left-0 before:top-1/2 before:z-10 before:h-8 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-primary/90 before:opacity-90 before:transition-all before:duration-300 before:content-['']",
      "hover:-translate-y-1 hover:border-[var(--border-accent-weak)] hover:shadow-[var(--shadow-glow-hover)] hover:before:h-[65%]",
      "after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:opacity-0 after:bg-gradient-to-br after:from-primary/20 after:via-transparent after:to-transparent after:transition-opacity after:duration-300 after:content-[''] hover:after:opacity-100",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
