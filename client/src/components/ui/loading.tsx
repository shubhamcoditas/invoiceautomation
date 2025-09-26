import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
  fullHeight?: boolean;
}

export function Loading({ 
  className, 
  size = "md", 
  text = "Loading...", 
  fullHeight = false 
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center space-y-2",
      fullHeight && "min-h-[200px]",
      className
    )}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

interface TableLoadingProps {
  columns: number;
  rows?: number;
  className?: string;
}

export function TableLoading({ columns, rows = 3, className }: TableLoadingProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 bg-muted rounded animate-pulse flex-1"
              style={{
                animationDelay: `${(rowIndex * columns + colIndex) * 0.1}s`
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface CardLoadingProps {
  className?: string;
}

export function CardLoading({ className }: CardLoadingProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="h-6 bg-muted rounded animate-pulse w-1/3" />
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
        <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
      </div>
    </div>
  );
}
