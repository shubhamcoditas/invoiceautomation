import { useAppState } from "@/hooks/use-app-state";
import { DownloadInvoice } from "./download-invoice";
import { AgentManagement } from "./agent-management";
import { AgentTickets } from "./agent-tickets";

export function InvoiceManagement() {
  const { state } = useAppState();
  const userRole = state.currentUser?.role || 'Admin';
  const currentTab = state.currentTab;
  
  // Normalize role to lowercase for comparison
  const normalizedRole = userRole.toLowerCase();
  
  // For User role, show Download Invoice page
  if (normalizedRole === 'user' || normalizedRole === 'business_user') {
    return <DownloadInvoice />;
  }

  // Route based on current tab for Admin/Application Admin
  if (normalizedRole === 'admin' || normalizedRole === 'application_admin') {
    // Explicitly check for agent-tickets tab
    if (currentTab === 'agent-tickets') {
      return (
        <div className="space-y-6">
          <AgentTickets />
        </div>
      );
    }
    // Default to Agent Management (for 'invoice-management' tab or any other tab within this module)
    return (
      <div className="space-y-6">
        <AgentManagement />
      </div>
    );
  }

  // For Agent role, show dashboard (to be implemented)
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Dashboard for {userRole} role - Coming soon
      </p>
    </div>
  );
}

