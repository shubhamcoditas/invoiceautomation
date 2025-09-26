import { NotificationsPanel } from "@/components/ui/notifications";
import { useAppState } from "@/hooks/use-app-state";

const tabTitles = {
  'dashboard': { title: 'Dashboard', subtitle: 'Overview of invoice processing activities' },
  'qr-scanner': { title: 'QR Scanner', subtitle: 'Extract invoice data from QR codes' },
  'pdf-upload': { title: 'PDF Upload', subtitle: 'Process invoice PDFs with OCR' },
  'email-review': { title: 'Email Review Queue', subtitle: 'Review and process incoming invoice emails' },
  'egam-repository': { title: 'EGAM Repository', subtitle: 'Manage EGAM purchase invoice data' },
  'reconciliation': { title: 'Data Reconciliation', subtitle: 'Compare extracted data with EGAM repository' },
  'validation-apis': { title: 'Validation APIs', subtitle: 'Test validation API endpoints' },
  'notice-apis': { title: 'Notice APIs', subtitle: 'Test GSTN notice API endpoints' },
  'logs': { title: 'System Logs', subtitle: 'View system activity and API call history' },
  'user-management': { title: 'User Management', subtitle: 'Manage system users and permissions' },
  'settings': { title: 'Settings and Config', subtitle: 'Configure system settings and manage your profile preferences' }
};

export function Header() {
  const { state } = useAppState();
  
  const currentTabInfo = tabTitles[state.currentTab as keyof typeof tabTitles] || 
    { title: 'Dashboard', subtitle: 'Overview of invoice processing activities' };

  return (
    <header className="glass border-b border-border/50 p-6 shadow-lg transition-all duration-300" data-testid="header">
      <div className="flex justify-between items-center">
        <div className="animate-slide-in-left">
          <h2 className="text-3xl font-bold gradient-text transition-all duration-300 hover:scale-105 will-change-transform" data-testid="page-title">
            {currentTabInfo.title}
          </h2>
          <p className="text-muted-foreground text-lg mt-1 transition-all duration-300" data-testid="page-subtitle">
            {currentTabInfo.subtitle}
          </p>
        </div>
        <div className="flex items-center space-x-4 animate-slide-up">
          <NotificationsPanel />
        </div>
      </div>
    </header>
  );
}
