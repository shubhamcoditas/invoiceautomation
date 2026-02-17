import React from "react";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

export function Footer() {
  const { isCollapsed } = useSidebar();
  
  return (
    <footer className={cn(
      "fixed bottom-0 right-0 z-40 bg-[#00338D] text-white py-3 px-4 shadow-lg transition-all duration-300",
      isCollapsed ? "lg:left-16" : "lg:left-72"
    )}>
      <div className="max-w-full mx-auto text-center">
        <p className="text-sm font-medium">
          This is a prototype only. The UI and functionality will need to undergo a feasibility check with KTDH design systems before final implementation.
        </p>
      </div>
    </footer>
  );
}
