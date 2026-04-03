import React, { Suspense } from "react";
import { Switch, Route } from "wouter";
import { cn } from "@/lib/utils";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppStateProvider } from "@/hooks/use-app-state";
import { SidebarProvider } from "@/hooks/use-sidebar";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useAppState } from "@/hooks/use-app-state";
import { useSidebar } from "@/hooks/use-sidebar";
import { Landing } from "@/components/landing/landing";
import { EASidebar } from "@/components/ea-invoice-downloader/ea-sidebar";
import { EAHeader } from "@/components/ea-invoice-downloader/ea-header";
import { CustomsIGCRSidebar } from "@/components/customs-igcr/customs-igcr-sidebar";
import { CustomsIGCRHeader } from "@/components/customs-igcr/customs-igcr-header";
import { isCustomsIGCRTab } from "@/lib/customs-igcr-tabs-config";
import { LAZY_ROUTE_MAP, RouteFallback } from "@/lazy-routes";
import NotFound from "@/pages/not-found";
import { AppCanvas } from "@/components/layout/app-canvas";

function MainContent() {
  const { state, dispatch } = useAppState();
  const { isCollapsed } = useSidebar();

  // CRITICAL: All hooks must be called before any conditional returns
  // Handle transition completion
  React.useEffect(() => {
    if (state.isTransitioning) {
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_TRANSITIONING', payload: false });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [state.isTransitioning, dispatch]);

  // Show landing page if currentTab is 'landing'
  if (state.currentTab === 'landing') {
    return <Landing />;
  }

  const tab = state.currentTab;
  const isInvoiceManagement =
    tab === "invoice-management" || tab === "agent-tickets";
  const isEAInvoiceDownloader =
    tab === "ea-invoice-downloader" || tab === "ea-agent-tickets" || tab === "ea-audit-logs";
  const isCustomsIGCR = isCustomsIGCRTab(tab);
  const userRole = state.currentUser?.role || 'Admin';
  const normalizedRole = userRole.toLowerCase();
  const isUserRole = normalizedRole === 'user' || normalizedRole === 'business_user';
  const isAgentRole = normalizedRole === 'agent';
  const shouldHideSidebarForUser = isInvoiceManagement && isUserRole;
  const shouldHideEASidebar = isEAInvoiceDownloader && (isUserRole || isAgentRole);
  const shouldShowSidebar = state.currentTab !== 'landing' && !shouldHideSidebarForUser && !isEAInvoiceDownloader && !isCustomsIGCR;
  const shouldShowHeader = state.currentTab !== 'landing';

  const renderCurrentTab = () => {
    const RouteComponent = LAZY_ROUTE_MAP[tab ?? ""] ?? LAZY_ROUTE_MAP["qr-scanner"];
    if (!RouteComponent) return null;
    return (
      <Suspense fallback={<RouteFallback />}>
        <RouteComponent />
      </Suspense>
    );
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden text-foreground">
      
      {shouldShowSidebar && <Sidebar />}
      
      {/* EA application sidebar — hidden for User and Agent roles */}
      {isEAInvoiceDownloader && !shouldHideEASidebar && <EASidebar />}
      
      {/* Customs IGCR Sidebar */}
      {isCustomsIGCR && <CustomsIGCRSidebar />}
      
      {/* Main Content Area with proper margin for sidebar */}
      <div className={cn(
        "relative z-10 transition-all duration-300",
        shouldShowSidebar ? (isCollapsed ? "lg:ml-16" : "lg:ml-72") : 
        (isEAInvoiceDownloader && !shouldHideEASidebar) ? (isCollapsed ? "lg:ml-16" : "lg:ml-72") :
        isCustomsIGCR ? (isCollapsed ? "lg:ml-16" : "lg:ml-72") : "ml-0"
      )}>
        {shouldShowHeader && !isEAInvoiceDownloader && !isCustomsIGCR && <Header />}
        {isEAInvoiceDownloader && <EAHeader />}
        {isCustomsIGCR && <CustomsIGCRHeader />}
        <main className="p-4 w-full pb-6">
          <div className={cn(
            "page-transition w-full",
            state.isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100",
            "transition-all duration-300 ease-out"
          )}>
            {renderCurrentTab()}
          </div>
        </main>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={MainContent} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppStateProvider>
          <SidebarProvider>
            <div className="relative min-h-screen">
              <AppCanvas />
              <Toaster />
              <Router />
            </div>
          </SidebarProvider>
        </AppStateProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
