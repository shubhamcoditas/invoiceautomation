import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/hooks/use-app-state";
import { 
  LayoutDashboard, 
  QrCode, 
  FileText, 
  Database, 
  Scale, 
  Code, 
  FileBarChart,
  User,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'qr-scanner', label: 'QR Scanner', icon: QrCode },
  { id: 'pdf-upload', label: 'PDF Upload', icon: FileText },
  { id: 'egam-repository', label: 'EGAM Repository', icon: Database },
  { id: 'reconciliation', label: 'Reconciliation', icon: Scale },
  { id: 'validation-apis', label: 'Validation APIs', icon: Code },
  { id: 'logs', label: 'System Logs', icon: FileBarChart },
];

export function Sidebar() {
  const { state, dispatch } = useAppState();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleTabChange = (tabId: string) => {
    dispatch({ type: 'SET_CURRENT_TAB', payload: tabId });
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          data-testid="button-mobile-menu"
        >
          {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-80 bg-card border-r border-border shadow-lg z-40 transition-transform duration-300",
        "lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )} data-testid="sidebar">
        
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">EGAM Platform</h1>
              <p className="text-sm text-muted-foreground">Invoice Processing</p>
            </div>
          </div>
        </div>
        
        {/* User Info */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">John Smith</p>
              <p className="text-xs text-muted-foreground">Admin User</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = state.currentTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-primary text-primary-foreground"
                )}
                onClick={() => handleTabChange(item.id)}
                data-testid={`nav-${item.id}`}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
