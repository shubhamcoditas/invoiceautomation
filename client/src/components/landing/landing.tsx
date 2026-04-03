import { useAppState } from "@/hooks/use-app-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, TrendingUp, ArrowRight, Building2, Download, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const heroWords = ["Operate", "at", "the", "speed", "of"];

export function Landing() {
  const { dispatch } = useAppState();

  const applications = [
    {
      id: "cost-control",
      title: "Cost Model",
      description: "Cost model management, budget tracking, and financial analysis",
      icon: TrendingUp,
      heat: "low" as const,
      features: [
        "Cost Model Dashboard",
        "Budget Management",
        "Service Costing",
        "Asset Management",
        "Financial Reporting",
      ],
      action: () => {
        dispatch({ type: "SET_CURRENT_TAB", payload: "cost-model-dashboard" });
      },
    },
    {
      id: "egam",
      title: "EGAM & Invoice Automation",
      description: "Invoice processing, QR scanning, PDF upload, and EGAM repository management",
      icon: Database,
      heat: "low" as const,
      features: [
        "Invoice Tracker",
        "QR Code Scanner",
        "PDF Processing",
        "EGAM Repository",
        "Email Review Queue",
      ],
      action: () => {
        dispatch({ type: "SET_CURRENT_TAB", payload: "invoice-tracker" });
      },
    },
    {
      id: "ea-invoice-downloader",
      title: "EA Invoice Downloader",
      description: "Emirates Airlines invoice download and agent management system",
      icon: Download,
      heat: "mid" as const,
      features: [
        "Agent Management",
        "Tickets Management",
        "Audit Logs",
        "Invoice Downloads",
        "Role-based Access",
      ],
      action: () => {
        dispatch({ type: "SET_CURRENT_TAB", payload: "ea-invoice-downloader" });
      },
    },
    {
      id: "customs-igcr",
      title: "Customs IGCR Tool",
      description: "Customs IGCR declarations, compliance checks, and reporting",
      icon: ShieldCheck,
      heat: "high" as const,
      features: [
        "IGCR Dashboard",
        "Declarations",
        "Compliance Checks",
        "Reports",
        "Document Management",
      ],
      action: () => {
        dispatch({ type: "SET_CURRENT_TAB", payload: "customs-igcr-dashboard" });
      },
    },
  ];

  const heatCardClass = (heat: "low" | "mid" | "high") => {
    if (heat === "high") {
      return "hover:border-[color:var(--heat-coral)]/40 hover:shadow-[0_12px_48px_-8px_var(--heat-glow)]";
    }
    if (heat === "mid") {
      return "hover:border-[var(--border-accent-strong)]";
    }
    return "";
  };

  return (
    <div className="relative z-10 min-h-screen">
      <header className="sticky top-0 z-20 app-header-shell px-[clamp(1rem,4vw,2rem)] py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 text-[#0a0e1a] shadow-md ring-1 ring-white/25 transition-transform duration-200 ease-spring hover:scale-105">
              <Building2 className="h-4 w-4 text-[color:var(--brand-blue)]" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground">KPMG One Tax Platform</span>
          </div>
          <span className="eyebrow-label hidden sm:inline">Application gateway</span>
        </div>
      </header>

      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl flex-col justify-center px-[clamp(1rem,4vw,2rem)] py-[clamp(2rem,6vw,4rem)]">
        <section className="mb-[clamp(2.5rem,6vw,4rem)] text-center">
          <p className="eyebrow-label mb-4">KPMG One Tax Platform</p>
          <h1 className="mb-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
            <span className="flex flex-wrap justify-center gap-x-[0.28em] gap-y-1">
              {heroWords.map((word, i) => (
                <span
                  key={word}
                  className="hero-word"
                  style={{ animationDelay: `${0.06 + i * 0.07}s` }}
                >
                  {word}
                </span>
              ))}
            </span>
            <span className="mt-2 block">
              <span className="relative inline-block">
                <span className="text-[color:var(--accent-cyan)]">live intelligence</span>
                <span
                  className="hero-accent-line absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-transparent via-[var(--accent-cyan)] to-[var(--brand-blue)]"
                  aria-hidden
                />
              </span>
            </span>
          </h1>
          <p
            className="mx-auto max-w-2xl text-base leading-relaxed text-[color:var(--text-muted)] sm:text-lg"
            style={{
              animation: "premium-fade-up 0.75s var(--ease-exit) both",
              animationDelay: "0.55s",
            }}
          >
            Select an application to open tools and dashboards. One visual language across automation, finance, and
            compliance surfaces.
          </p>
        </section>

        <hr className="section-divider-shimmer mx-auto mb-[clamp(2rem,5vw,3rem)] max-w-3xl rounded-full" />

        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-4">
          {applications.map((application, index) => {
            const Icon = application.icon;
            return (
              <Card
                key={application.id}
                className={cn(
                  "flex h-full cursor-pointer flex-col border-white/10 transition-shadow duration-300",
                  heatCardClass(application.heat)
                )}
                style={{
                  animation: "premium-fade-up 0.72s var(--ease-exit) both",
                  animationDelay: `${0.2 + index * 0.08}s`,
                }}
                onClick={application.action}
              >
                <CardHeader className="relative z-10 shrink-0">
                  <div className="mb-4 flex items-start justify-between">
                    <div
                      className={cn(
                        "rounded-xl border border-white/12 bg-white/[0.08] p-3 backdrop-blur-sm",
                        application.heat === "high" && "text-[color:var(--heat-coral)]",
                        application.heat === "mid" && "text-[color:var(--accent-cyan)]",
                        application.heat === "low" && "text-[color:var(--accent-cyan-soft)]"
                      )}
                    >
                      <Icon className="h-8 w-8" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover/card:translate-x-1" />
                  </div>
                  <CardTitle className="text-xl font-extrabold tracking-tight">{application.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed text-muted-foreground">
                    {application.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10 flex min-h-0 flex-1 flex-col">
                  <ul className="mb-6 min-h-0 flex-1 space-y-2">
                    {application.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span
                          className={cn(
                            "h-1.5 w-1.5 shrink-0 rounded-full",
                            application.heat === "high" && "bg-[color:var(--heat-coral)]",
                            application.heat === "mid" && "bg-[color:var(--accent-cyan)]",
                            application.heat === "low" && "bg-[color:var(--brand-blue-mid)]"
                          )}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant="default"
                    className="group mt-auto w-full shrink-0 rounded-xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      application.action();
                    }}
                  >
                    Enter application
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p
          className="mt-12 text-center text-sm text-muted-foreground"
          style={{
            animation: "premium-fade-up 0.65s var(--ease-exit) both",
            animationDelay: "0.6s",
          }}
        >
          Tip: use the sidebar “Back to applications” anytime to return here.
        </p>
      </div>

      <div
        className="pointer-events-none fixed bottom-8 left-1/2 z-20 hidden -translate-x-1/2 sm:block"
        aria-hidden
      >
        <div className="scroll-hint-mouse mx-auto opacity-70" />
      </div>
    </div>
  );
}
