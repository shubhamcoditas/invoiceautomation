import { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function CustomsIGCRHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "app-header-shell sticky top-0 z-30 px-6 transition-all duration-300",
        scrolled ? "py-2.5" : "py-4"
      )}
      data-scrolled={scrolled}
      data-testid="customs-igcr-header"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/95 text-[#0a0e1a] shadow-md ring-1 ring-white/25 transition-transform duration-200 ease-spring hover:scale-105">
            <ShieldCheck className="h-7 w-7 text-[color:var(--heat-coral)]" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Customs IGCR Tool</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">
              IGCR declarations, compliance checks, and reporting
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
