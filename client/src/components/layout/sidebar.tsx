import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAppState } from "@/hooks/use-app-state";
import { useSidebar } from "@/hooks/use-sidebar";
import { useEntity } from "@/hooks/use-entity";
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
  Settings,
  Building2,
  BarChart3
} from "lucide-react";
import { useState, useEffect } from "react";

const getNavigationGroups = (userRole: string) => {
  const baseGroups = [
    {
      title: "Invoice Tracker",
      items: [
        { id: 'invoice-tracker', label: 'Invoice Tracker', icon: FileText },
      ]
    },
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
    }
  ];

  // API Playground - available for all roles
  const apiPlaygroundItems = [
    { id: 'validation-apis', label: 'Validation APIs', icon: Code },
    { id: 'notice-apis', label: 'Notice APIs', icon: Bell },
  ];

  // Only Application Admin and Admin can see API Usage
  if (userRole === 'Application Admin' || userRole === 'Admin') {
    apiPlaygroundItems.push({ id: 'api-usage', label: 'API Usage', icon: BarChart3 });
  }

  baseGroups.push({
    title: "API Playground",
    items: apiPlaygroundItems
  });

  // System group - only for Application Admin and Admin
  if (userRole !== 'Business User') {
    const systemItems = [
      { id: 'logs', label: 'System Logs', icon: FileBarChart },
      { id: 'user-management', label: 'User Management', icon: User },
      { id: 'email-settings', label: 'Email Settings', icon: Mail },
    ];

    // Only Application Admin can see Integrations and Settings
    if (userRole === 'Application Admin') {
      systemItems.unshift(
        { id: 'integrations', label: 'Integrations', icon: Building2 },
        { id: 'settings', label: 'Settings and Config', icon: Settings }
      );
    }

    baseGroups.push({
      title: "System",
      items: systemItems
    });
  }

  return baseGroups;
};

export function Sidebar() {
  const { state, dispatch } = useAppState();
  const { isCollapsed, toggleCollapse } = useSidebar();
  const { config, applyEntityTheme, isKpmgBrandingVisible, kpmgPosition } = useEntity();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(["Invoice Tracker", "Document Processing", "Data Management", "API Playground"])
  );

  // Get navigation groups based on user role
  const navigationGroups = getNavigationGroups(state.currentUser?.role || 'Application Admin');

  // Apply entity theme on component mount
  useEffect(() => {
    applyEntityTheme();
  }, [applyEntityTheme]);

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
            <div className="flex flex-col space-y-2 w-full">
              {/* Entity Branding */}
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})` 
                  }}
                >
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {config.displayName}
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Invoice Automation Portal
                  </p>
                </div>
              </div>
              
              {/* KPMG Branding - Position based on config */}
              {isKpmgBrandingVisible && kpmgPosition === 'top' && (
                <div className="flex items-center space-x-2 px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="w-4 h-4 bg-gradient-to-br from-[#00338D] to-[#4A90E2] rounded flex items-center justify-center">
                    <FileText className="h-2.5 w-2.5 text-white" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    Powered by KPMG
                  </span>
                </div>
              )}
            </div>
          )}
          
          {isCollapsed && (
            <div className="flex flex-col items-center space-y-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto"
                style={{ 
                  background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})` 
                }}
              >
                <Building2 className="h-5 w-5 text-white" />
              </div>
              {isKpmgBrandingVisible && (
                <div className="w-4 h-4 bg-gradient-to-br from-[#00338D] to-[#4A90E2] rounded flex items-center justify-center">
                  <FileText className="h-2.5 w-2.5 text-white" />
                </div>
              )}
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
                            "w-full justify-center h-10 px-3 mb-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
                            isActive && "text-white hover:opacity-90 focus:ring-white",
                            !isActive && "hover:bg-opacity-10 hover:text-gray-900 dark:hover:text-white focus:ring-gray-500"
                          )}
                          style={isActive ? {
                            backgroundColor: config.primaryColor,
                            color: '#ffffff'
                          } : {
                            color: '#374151' // Dark gray for better contrast
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.backgroundColor = config.primaryColor + '20';
                              e.currentTarget.style.color = '#111827'; // Much darker text on hover for better visibility
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.backgroundColor = '';
                              e.currentTarget.style.color = '#374151';
                            }
                          }}
                          onClick={() => handleTabChange(item.id)}
                          data-testid={`nav-${item.id}`}
                          aria-label={`Navigate to ${item.label}`}
                          aria-current={isActive ? "page" : undefined}
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
                      "w-full flex items-center justify-between px-2 py-2 text-sm font-semibold transition-all duration-200 rounded-md"
                    )}
                    style={{
                      color: '#4b5563' // Better contrast gray
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = config.primaryColor + '15';
                      e.currentTarget.style.color = '#111827'; // Much darker text on hover for better visibility
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '';
                      e.currentTarget.style.color = '#4b5563';
                    }}
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
                              "w-full justify-start h-10 px-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
                              isActive && "text-white hover:opacity-90 focus:ring-white",
                              !isActive && "hover:bg-opacity-10 hover:text-gray-900 dark:hover:text-white focus:ring-gray-500"
                            )}
                            style={isActive ? {
                              backgroundColor: config.primaryColor,
                              color: '#ffffff'
                            } : {
                              color: '#374151' // Dark gray for better contrast
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.backgroundColor = config.primaryColor + '20';
                                e.currentTarget.style.color = '#111827'; // Much darker text on hover for better visibility
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.backgroundColor = '';
                                e.currentTarget.style.color = '#374151';
                              }
                            }}
                            onClick={() => handleTabChange(item.id)}
                            data-testid={`nav-${item.id}`}
                            aria-label={`Navigate to ${item.label}`}
                            aria-current={isActive ? "page" : undefined}
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

        {/* KPMG Branding and Watermark - Only show when expanded */}
        {!isCollapsed && (
          <div className="absolute bottom-4 left-2 right-2 space-y-2">
            {/* KPMG Branding - Bottom position */}
            {isKpmgBrandingVisible && kpmgPosition === 'bottom' && (
              <div className="flex items-center justify-center space-x-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="w-4 h-4 bg-gradient-to-br from-[#00338D] to-[#4A90E2] rounded flex items-center justify-center">
                  <FileText className="h-2.5 w-2.5 text-white" />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  Powered by KPMG
                </span>
              </div>
            )}
            
            {/* Coditas Watermark - Below KPMG branding */}
            <div className="flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="text-xs font-medium">
                Designed & Developed by <span className="font-bold">Coditas</span>
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