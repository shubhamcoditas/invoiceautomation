import { Button } from "@/components/ui/button";
import { NotificationsPanel } from "@/components/ui/notifications";
import { FolderSync } from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";
import { useToast } from "@/hooks/use-toast";

const tabTitles = {
  'dashboard': { title: 'Dashboard', subtitle: 'Overview of invoice processing activities' },
  'qr-scanner': { title: 'QR Scanner', subtitle: 'Extract invoice data from QR codes' },
  'pdf-upload': { title: 'PDF Upload', subtitle: 'Process invoice PDFs with OCR' },
  'egam-repository': { title: 'EGAM Repository', subtitle: 'Manage EGAM purchase invoice data' },
  'reconciliation': { title: 'Data Reconciliation', subtitle: 'Compare extracted data with EGAM repository' },
  'validation-apis': { title: 'Validation APIs', subtitle: 'Test validation API endpoints' },
  'logs': { title: 'System Logs', subtitle: 'View system activity and API call history' }
};

export function Header() {
  const { state } = useAppState();
  const { toast } = useToast();
  
  const currentTabInfo = tabTitles[state.currentTab as keyof typeof tabTitles] || 
    { title: 'Dashboard', subtitle: 'Overview of invoice processing activities' };

  const handleSyncData = () => {
    toast({
      title: "FolderSync Started",
      description: "Data synchronization has been initiated.",
    });
  };

  return (
    <header className="bg-card border-b border-border p-4" data-testid="header">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground" data-testid="page-title">
            {currentTabInfo.title}
          </h2>
          <p className="text-muted-foreground" data-testid="page-subtitle">
            {currentTabInfo.subtitle}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <NotificationsPanel />
          
          <Button onClick={handleSyncData} data-testid="button-sync">
            <FolderSync className="mr-2 h-4 w-4" />
            FolderSync Data
          </Button>
        </div>
      </div>
    </header>
  );
}
