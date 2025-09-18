import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppStateProvider } from "@/hooks/use-app-state";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import Dashboard from "@/pages/dashboard";
import { QRScanner } from "@/components/qr-scanner/qr-scanner";
import { PDFUpload } from "@/components/pdf-upload/pdf-upload";
import { EGAMRepository } from "@/components/egam-repository/egam-repository";
import { Reconciliation } from "@/components/reconciliation/reconciliation";
import { ValidationAPIs } from "@/components/validation-apis/validation-apis";
import { SystemLogs } from "@/components/system-logs/system-logs";
import { useAppState } from "@/hooks/use-app-state";
import NotFound from "@/pages/not-found";

function MainContent() {
  const { state } = useAppState();

  const renderCurrentTab = () => {
    switch (state.currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'qr-scanner':
        return <QRScanner />;
      case 'pdf-upload':
        return <PDFUpload />;
      case 'egam-repository':
        return <EGAMRepository />;
      case 'reconciliation':
        return <Reconciliation />;
      case 'validation-apis':
        return <ValidationAPIs />;
      case 'logs':
        return <SystemLogs />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      {/* Main Content Area with proper margin for sidebar */}
      <div className="lg:ml-80">
        <Header />
        <main className="p-6">
          {renderCurrentTab()}
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
          <Toaster />
          <Router />
        </AppStateProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
