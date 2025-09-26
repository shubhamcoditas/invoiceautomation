import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAppState } from "@/hooks/use-app-state";
import { useSidebar } from "@/hooks/use-sidebar";
import { 
  QrCode, 
  FileText, 
  Database, 
  Mail, 
  Code, 
  FileBarChart,
  User,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Bell,
  Settings
} from "lucide-react";
import { useState } from "react";

const navigationGroups = [
  {
    title: "Document Processing",
    items: [
      { id: 'qr-scanner', label: 'QR Scanner', icon: QrCode },
      { id: 'pdf-upload', label: 'PDF Upload', icon: FileText },
      { id: 'email-review', label: 'Email Review Queue', icon: Mail },
    ]
  },
  {
    title: "Data Management",
    items: [
      { id: 'egam-repository', label: 'EGAM Repository', icon: Database },
    ]
  },
  {
    title: "GSTN API Playground",
    items: [
      { id: 'validation-apis', label: 'Validation APIs', icon: Code },
      { id: 'notice-apis', label: 'Notice APIs', icon: Bell },
    ]
  },
  {
    title: "System",
    items: [
      { id: 'logs', label: 'System Logs', icon: FileBarChart },
      { id: 'user-management', label: 'User Management', icon: User },
      { id: 'settings', label: 'Settings and Config', icon: Settings },
    ]
  }
];

export function Sidebar() {
  const { state, dispatch } = useAppState();
  const { isCollapsed, toggleCollapse } = useSidebar();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(["Document Processing", "Data Management", "GSTN API Playground", "System"])
  );

  const handleTabChange = (tabId: string) => {
    dispatch({ type: 'SET_CURRENT_TAB', payload: tabId });
    setIsMobileOpen(false);
  };

  const toggleGroup = (groupTitle: string) => {
    if (isCollapsed) return; // Don't toggle groups when collapsed
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupTitle)) {
        newSet.delete(groupTitle);
      } else {
        newSet.add(groupTitle);
      }
      return newSet;
    });
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
      <div 
        className={cn(
          "fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-40 transition-all duration-300 ease-out",
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "w-16" : "w-72"
        )} 
        data-testid="sidebar"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-2 py-4 border-b border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00338D] to-[#4A90E2] rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">KPMG</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Invoice Automation</p>
              </div>
            </div>
          )}
          
          {isCollapsed && (
            <div className="w-8 h-8 bg-gradient-to-br from-[#00338D] to-[#4A90E2] rounded-lg flex items-center justify-center mx-auto">
              <FileText className="h-5 w-5 text-white" />
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="px-2 py-4 space-y-3">
          {isCollapsed ? (
            // Collapsed view with icons only
            <div className="space-y-1">
              {navigationGroups.map((group) => 
                group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = state.currentTab === item.id;
                  
                  return (
                    <Tooltip key={item.id} delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isActive ? "default" : "ghost"}
                          className={cn(
                            "w-full justify-center h-10 px-3 mb-1",
                            isActive && "bg-[#00338D] text-white hover:bg-[#001F5C]"
                          )}
                          onClick={() => handleTabChange(item.id)}
                          data-testid={`nav-${item.id}`}
                        >
                          <Icon className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="ml-2">
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })
              )}
            </div>
          ) : (
            // Expanded view with groups
            navigationGroups.map((group) => {
              const isExpanded = expandedGroups.has(group.title);
              const hasActiveItem = group.items.some(item => state.currentTab === item.id);
              
              return (
                <div key={group.title} className="space-y-1">
                  {/* Group Header */}
                  <button
                    onClick={() => toggleGroup(group.title)}
                    className={cn(
                      "w-full flex items-center justify-between px-2 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <span className="flex items-center">
                      <ChevronDown className={cn(
                        "h-4 w-4 mr-2 transition-transform duration-200",
                        isExpanded ? "rotate-0" : "-rotate-90"
                      )} />
                      {group.title}
                    </span>
                  </button>
                  
                  {/* Group Items */}
                  {isExpanded && (
                    <div className="ml-2 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-2">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = state.currentTab === item.id;
                        
                        return (
                          <Button
                            key={item.id}
                            variant={isActive ? "default" : "ghost"}
                            className={cn(
                              "w-full justify-start h-10 px-2 transition-colors duration-200",
                              isActive && "bg-[#00338D] text-white hover:bg-[#001F5C]"
                            )}
                            onClick={() => handleTabChange(item.id)}
                            data-testid={`nav-${item.id}`}
                          >
                            <Icon className="mr-3 h-5 w-5" />
                            {item.label}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </nav>

        {/* User Info - Only show when expanded */}
        {!isCollapsed && (
          <div className="absolute bottom-4 left-2 right-2">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00338D] to-[#4A90E2] rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">John Smith</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Admin User</p>
              </div>
            </div>
          </div>
        )}
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