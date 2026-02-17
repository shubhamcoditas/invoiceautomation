import React from "react";
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
import { Footer } from "@/components/layout/footer";
import { InvoiceTracker } from "@/components/invoice-tracker/invoice-tracker";
import { QRScanner } from "@/components/qr-scanner/qr-scanner";
import { PDFUpload } from "@/components/pdf-upload/pdf-upload";
import { EGAMRepository } from "@/components/egam-repository/egam-repository";
import { EmailReviewQueue } from "@/components/email-review-queue/email-review-queue";
import { ValidationAPIs } from "@/components/validation-apis/validation-apis";
import { NoticeAPIs } from "@/components/notice-apis/notice-apis";
import { APIUsage } from "@/components/api-usage/api-usage";
import { SystemLogs } from "@/components/system-logs/system-logs";
import { UserManagement } from "@/components/user-management/user-management";
import { SettingsAndConfig } from "@/components/settings/settings";
import { EmailSettings } from "@/components/email-settings/email-settings";
import { UserProfile } from "@/components/user-profile/user-profile";
import { Integrations } from "@/components/integrations/integrations";
import { useAppState } from "@/hooks/use-app-state";
import { useSidebar } from "@/hooks/use-sidebar";
import { CoditasWatermark } from "@/components/ui/coditas-watermark";
import { Landing } from "@/components/landing/landing";
import { CostModelDashboard } from "@/components/cost-model/dashboard/cost-model-dashboard";
import { InvoiceManagement } from "@/components/invoice-management/invoice-management";
import { EAInvoiceDownloader } from "@/components/ea-invoice-downloader/ea-invoice-downloader";
import { EASidebar } from "@/components/ea-invoice-downloader/ea-sidebar";
import { EAHeader } from "@/components/ea-invoice-downloader/ea-header";
import { CustomsIGCR } from "@/components/customs-igcr/customs-igcr";
import { CustomsIGCRSidebar } from "@/components/customs-igcr/customs-igcr-sidebar";
import { CustomsIGCRHeader } from "@/components/customs-igcr/customs-igcr-header";
import { VerticalsMaster } from "@/components/cost-model/verticals-master/verticals-master";
import { AssetManagement } from "@/components/cost-model/asset-management/asset-management";
import { AssetClass } from "@/components/cost-model/asset-class/asset-class";
import { AssetType } from "@/components/cost-model/asset-type/asset-type";
import { Asset } from "@/components/cost-model/asset/asset";
import { ServiceGroup } from "@/components/cost-model/service-group/service-group";
import { Service } from "@/components/cost-model/service/service";
import { CostGroup } from "@/components/cost-model/cost-group/cost-group";
import { BudgetLine } from "@/components/cost-model/budget-line/budget-line";
import { CostElement } from "@/components/cost-model/cost-element/cost-element";
import { CostRules } from "@/components/cost-model/cost-rules/cost-rules";
import { ServiceCosting } from "@/components/cost-model/service-costing/service-costing";
import { ServiceLevelCost } from "@/components/cost-model/service-level-cost/service-level-cost";
import NotFound from "@/pages/not-found";

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

  // Check if we're in Invoice Management module
  const isInvoiceManagement = state.currentTab?.startsWith('invoice-management') || 
                              state.currentTab === 'invoice-management' || 
                              state.currentTab === 'agent-tickets';
  // Check if we're in EA Invoice Downloader module
  const isEAInvoiceDownloader = state.currentTab?.startsWith('ea-') || 
                                 state.currentTab === 'ea-invoice-downloader' ||
                                 state.currentTab === 'ea-agent-tickets' ||
                                 state.currentTab === 'ea-audit-logs';
  // Check if we're in Cost Model module
  const isCostModel = state.currentTab?.startsWith('cost-model') || 
                      state.currentTab === 'verticals-master' ||
                      state.currentTab === 'asset-management' ||
                      state.currentTab === 'asset-class' ||
                      state.currentTab === 'asset-type' ||
                      state.currentTab === 'assets' ||
                      state.currentTab === 'service-groups' ||
                      state.currentTab === 'services' ||
                      state.currentTab === 'cost-groups' ||
                      state.currentTab === 'budget-lines' ||
                      state.currentTab === 'cost-elements' ||
                      state.currentTab === 'cost-rules' ||
                      state.currentTab === 'service-costing' ||
                      state.currentTab === 'service-level-cost';
  // Check if we're in Customs IGCR module
  const isCustomsIGCR = state.currentTab?.startsWith('customs-igcr');
  const userRole = state.currentUser?.role || 'Admin';
  const normalizedRole = userRole.toLowerCase();
  const isUserRole = normalizedRole === 'user' || normalizedRole === 'business_user';
  const isAgentRole = normalizedRole === 'agent';
  
  // Hide sidebar for User role in Invoice Management (but keep header visible)
  const shouldHideSidebarForUser = isInvoiceManagement && isUserRole;
  
  // Hide EA sidebar for User role and Agent role
  const shouldHideEASidebar = isEAInvoiceDownloader && (isUserRole || isAgentRole);
  
  // Check if we should show sidebar (hide for landing, User role in Invoice Management, EA and Customs IGCR modules)
  const shouldShowSidebar = state.currentTab !== 'landing' && !shouldHideSidebarForUser && !isEAInvoiceDownloader && !isCustomsIGCR;
  
  // Header should always show (except for landing page); use module-specific header for EA and Customs IGCR
  const shouldShowHeader = state.currentTab !== 'landing';

  const renderCurrentTab = () => {
    switch (state.currentTab) {
      case 'invoice-tracker':
        return <InvoiceTracker />;
      case 'qr-scanner':
        return <QRScanner />;
      case 'pdf-upload':
        return <PDFUpload />;
      case 'egam-repository':
        return <EGAMRepository />;
      case 'email-review':
        return <EmailReviewQueue />;
      case 'validation-apis':
        return <ValidationAPIs />;
      case 'notice-apis':
        return <NoticeAPIs />;
      case 'api-usage':
        return <APIUsage />;
      case 'integrations':
        return <Integrations />;
      case 'logs':
        return <SystemLogs />;
      case 'user-management':
        return <UserManagement />;
      case 'settings':
        return <SettingsAndConfig />;
      case 'email-settings':
        return <EmailSettings />;
      case 'user-profile':
        return <UserProfile />;
      case 'cost-model-dashboard':
        return <CostModelDashboard />;
      case 'verticals-master':
        return <VerticalsMaster />;
      case 'asset-management':
        return <AssetManagement />;
      case 'asset-class':
        return <AssetClass />;
      case 'asset-type':
        return <AssetType />;
      case 'assets':
        return <Asset />;
      case 'service-groups':
        return <ServiceGroup />;
      case 'services':
        return <Service />;
      case 'cost-groups':
        return <CostGroup />;
      case 'budget-lines':
        return <BudgetLine />;
      case 'cost-elements':
        return <CostElement />;
      case 'cost-rules':
        return <CostRules />;
      case 'service-costing':
        return <ServiceCosting />;
      case 'service-level-cost':
        return <ServiceLevelCost />;
      case 'invoice-management':
      case 'agent-tickets':
        return <InvoiceManagement />;
      case 'ea-invoice-downloader':
      case 'ea-agent-tickets':
      case 'ea-audit-logs':
        return <EAInvoiceDownloader />;
      case 'customs-igcr-dashboards':
      case 'customs-igcr-onboarding':
      case 'customs-igcr-import-register':
      case 'customs-igcr-goods-movement':
      case 'customs-igcr-bom-setup':
      case 'customs-igcr-sales-tracking':
      case 'customs-igcr-igcr-working':
        return <CustomsIGCR />;
      default:
        return <QRScanner />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      
      {shouldShowSidebar && <Sidebar />}
      
      {/* EA Invoice Downloader Sidebar - Hide for User and Agent roles */}
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
        <main className="p-4 w-full">
          <div className={cn(
            "page-transition w-full",
            state.isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100",
            "transition-all duration-300 ease-out"
          )}>
            {renderCurrentTab()}
          </div>
        </main>
      </div>
      
      <Footer />
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
            <Toaster />
            <Router />
          </SidebarProvider>
        </AppStateProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
