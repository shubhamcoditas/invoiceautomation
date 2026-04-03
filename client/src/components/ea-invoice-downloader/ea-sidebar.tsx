import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAppState } from "@/hooks/use-app-state";
import { useSidebar } from "@/hooks/use-sidebar";
import { 
  Users,
  Ticket,
  FileText,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Plane,
  Download
} from "lucide-react";
import { useState, useEffect } from "react";

// Admin navigation items
const adminNavigationItems = [
  { id: 'ea-invoice-downloader', label: 'Agent Management', icon: Users },
  { id: 'ea-agent-tickets', label: 'Tickets Management', icon: Ticket },
  { id: 'ea-audit-logs', label: 'Audit Logs', icon: FileText },
];

// User navigation items — invoice download application
const userNavigationItems = [
  { id: 'ea-invoice-downloader', label: 'Invoice Downloader', icon: Download },
];

export function EASidebar() {
  const { state, dispatch } = useAppState();
  const { isCollapsed, toggleCollapse } = useSidebar();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Get user role and determine navigation items
  const userRole = state.currentUser?.role || 'Admin';
  const normalizedRole = userRole.toLowerCase();
  const isUserRole = normalizedRole === 'user' || normalizedRole === 'business_user';
  const navigationItems = isUserRole ? userNavigationItems : adminNavigationItems;

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
        >
          {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed left-0 top-0 flex h-full min-h-0 flex-col overflow-hidden ea-sidebar z-40 transition-all duration-300 ease-out",
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "w-16" : "w-72"
        )} 
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-2 py-4 ea-border-primary border-b">
          {!isCollapsed && (
            <div className="flex flex-col space-y-2 w-full">
              {/* Emirates Airlines Branding */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center ea-sidebar-logo">
                  <Plane className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-lg font-bold ea-text-primary">
                    Emirates Airlines
                  </h1>
                </div>
              </div>
            </div>
          )}
          
          {isCollapsed && (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto ea-sidebar-logo">
                <Plane className="h-6 w-6 text-white" />
              </div>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="h-8 w-8 ea-sidebar-button"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Back to applications (landing) */}
        <div className="shrink-0 px-2 py-2 ea-border-primary border-b">
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start gap-2 ea-sidebar-button",
              isCollapsed && "justify-center px-2"
            )}
            onClick={() => {
              dispatch({ type: 'SET_CURRENT_TAB', payload: 'landing' });
              setIsMobileOpen(false);
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            {!isCollapsed && <span>Back to applications</span>}
          </Button>
        </div>

        {/* Navigation */}
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain [scrollbar-gutter:stable]">
        <nav className="px-2 py-4 space-y-3">
          {isCollapsed ? (
            // Collapsed view with icons only
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = state.currentTab === item.id;
                
                return (
                  <Tooltip key={item.id} delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-center h-10 px-3 mb-1 transition-all duration-200",
                          isActive && "ea-sidebar-nav-active",
                          !isActive && "ea-sidebar-nav-inactive"
                        )}
                        onClick={() => handleTabChange(item.id)}
                      >
                        <Icon className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="ml-2">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ) : (
            // Expanded view
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = state.currentTab === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start h-10 px-2 transition-all duration-200",
                      isActive && "ea-sidebar-nav-active",
                      !isActive && "ea-sidebar-nav-inactive"
                    )}
                    onClick={() => handleTabChange(item.id)}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          )}
        </nav>
        </div>
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

