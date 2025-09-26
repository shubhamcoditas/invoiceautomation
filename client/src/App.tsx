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
import { QRScanner } from "@/components/qr-scanner/qr-scanner";
import { PDFUpload } from "@/components/pdf-upload/pdf-upload";
import { EGAMRepository } from "@/components/egam-repository/egam-repository";
import { EmailReviewQueue } from "@/components/email-review-queue/email-review-queue";
import { ValidationAPIs } from "@/components/validation-apis/validation-apis";
import { NoticeAPIs } from "@/components/notice-apis/notice-apis";
import { SystemLogs } from "@/components/system-logs/system-logs";
import { UserManagement } from "@/components/user-management/user-management";
import { SettingsAndConfig } from "@/components/settings/settings";
import { useAppState } from "@/hooks/use-app-state";
import { useSidebar } from "@/hooks/use-sidebar";
import NotFound from "@/pages/not-found";

function MainContent() {
  const { state, dispatch } = useAppState();
  const { isCollapsed } = useSidebar();

  const renderCurrentTab = () => {
    switch (state.currentTab) {
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
      case 'logs':
        return <SystemLogs />;
      case 'user-management':
        return <UserManagement />;
      case 'settings':
        return <SettingsAndConfig />;
      default:
        return <QRScanner />;
    }
  };

  // Handle transition completion
  React.useEffect(() => {
    if (state.isTransitioning) {
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_TRANSITIONING', payload: false });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [state.isTransitioning, dispatch]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 transition-all duration-500">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2300338D%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40 transition-opacity duration-500"></div>
      </div>
      
      <Sidebar />
      
      {/* Main Content Area with proper margin for sidebar */}
      <div className={cn(
        "relative z-10 transition-all duration-300",
        isCollapsed ? "lg:ml-16" : "lg:ml-72"
      )}>
        <Header />
        <main className="p-6 w-full">
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
            <Toaster />
            <Router />
          </SidebarProvider>
        </AppStateProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
