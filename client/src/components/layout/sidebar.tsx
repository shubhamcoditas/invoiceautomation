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
  BarChart3,
  Home,
  ArrowLeft,
  TrendingUp,
  Layers,
  Package,
  Boxes,
  Calculator,
  DollarSign,
  BarChart,
  PieChart,
  Archive,
  Grid3x3
} from "lucide-react";
import { useState, useEffect } from "react";

import { Receipt, Ticket } from "lucide-react";

const getNavigationGroups = (userRole: string, isInvoiceManagement: boolean = false, isCostModel: boolean = false) => {
  // Invoice Management navigation - no grouping, just items
  if (isInvoiceManagement) {
    const baseGroups = [
      {
        title: "", // Empty title means no grouping
        items: [
          { id: 'invoice-management', label: 'User Management', icon: Receipt },
          { id: 'agent-tickets', label: 'Tickets Management', icon: Ticket },
        ]
      }
    ];

    // Add more groups based on role if needed
    // For now, all roles see the same navigation
    return baseGroups;
  }

  // Cost Model navigation
  if (isCostModel) {
    const baseGroups = [
      {
        title: "Dashboard",
        items: [
          { id: 'cost-model-dashboard', label: 'Cost Model Dashboard', icon: TrendingUp },
        ]
      },
      {
        title: "Master Data",
        items: [
          { id: 'verticals-master', label: 'Verticals', icon: Building2 },
          { id: 'asset-management', label: 'Asset Management', icon: Package },
          { id: 'asset-class', label: 'Asset Classes', icon: Boxes },
          { id: 'asset-type', label: 'Asset Types', icon: Archive },
          { id: 'assets', label: 'Assets', icon: Package },
          { id: 'service-groups', label: 'Service Groups', icon: Layers },
          { id: 'services', label: 'Services', icon: Grid3x3 },
          { id: 'cost-groups', label: 'Cost Groups', icon: Calculator },
          { id: 'budget-lines', label: 'Budget Lines', icon: FileText },
          { id: 'cost-elements', label: 'Cost Elements', icon: DollarSign },
        ]
      },
      {
        title: "Cost Allocation",
        items: [
          { id: 'cost-rules', label: 'Cost Rules', icon: PieChart },
        ]
      },
      {
        title: "Reports & Analysis",
        items: [
          { id: 'service-costing', label: 'Service Costing', icon: BarChart },
          { id: 'service-level-cost', label: 'Service Level Cost', icon: TrendingUp },
        ]
      }
    ];

    return baseGroups;
  }

  // EGAM navigation
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

  baseGroups.push({
    title: "API Playground",
    items: apiPlaygroundItems
  });

  // System group - only for Application Admin and Admin
  if (userRole !== 'Business User') {
    const systemItems = [
      { id: 'user-management', label: 'User Management', icon: User },
      { id: 'email-settings', label: 'Email Settings', icon: Mail },
    ];

    // Only Application Admin and Admin can see API Usage
    if (userRole === 'Application Admin' || userRole === 'Admin') {
      systemItems.push({ id: 'api-usage', label: 'API Usage', icon: BarChart3 });
    }

    // Add System Logs at the end
    systemItems.push({ id: 'logs', label: 'System Logs', icon: FileBarChart });

    // Only Application Admin can see Integrations and Settings at the top
    if (userRole === 'Application Admin') {
      systemItems.unshift(
        { id: 'settings', label: 'Settings and Config', icon: Settings },
        { id: 'integrations', label: 'Integrations', icon: Building2 }
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
  // Check if we're in Invoice Management module
  const isInvoiceManagement = state.currentTab?.startsWith('invoice-management') || 
                              state.currentTab === 'invoice-management' || 
                              state.currentTab === 'agent-tickets';
  // Check if we're in Cost Model module
  const isCostModel = state.currentTab?.startsWith('cost-model') || 
                      state.currentTab === 'cost-model-dashboard' ||
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
  const userRole = state.currentUser?.role || 'Admin';
  
  // Hide sidebar navigation for User role in Invoice Management
  const shouldHideNavigation = isInvoiceManagement && userRole === 'User';
  
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(
      isInvoiceManagement 
        ? [] // No groups for invoice management
        : isCostModel
        ? ["Dashboard", "Master Data", "Cost Allocation", "Reports & Analysis"]
        : ["Invoice Tracker", "Document Processing", "Data Management", "API Playground"]
    )
  );
  
  // Get navigation groups based on user role and module
  const navigationGroups = getNavigationGroups(
    state.currentUser?.role || (isInvoiceManagement ? 'Admin' : 'Application Admin'),
    isInvoiceManagement,
    isCostModel
  );

  // Update expanded groups when module changes
  useEffect(() => {
    if (isInvoiceManagement) {
      setExpandedGroups(new Set([])); // No groups for invoice management
    } else if (isCostModel) {
      setExpandedGroups(new Set(["Dashboard", "Master Data", "Cost Allocation", "Reports & Analysis"]));
    } else {
      setExpandedGroups(new Set(["Invoice Tracker", "Document Processing", "Data Management", "API Playground"]));
    }
  }, [isInvoiceManagement, isCostModel]);

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

      {/* Sidebar - Hidden for User role in Invoice Management */}
      {!shouldHideNavigation && (
        <div 
          className={cn(
            "fixed left-0 top-0 h-full border-r z-40 transition-all duration-200 ease-out bg-sidebar",
            "lg:translate-x-0",
            isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
            isCollapsed ? "w-16" : "w-72"
          )}
          data-testid="sidebar"
        >
        
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-sidebar-border">
          {!isCollapsed && (
            <div className="flex flex-col space-y-2 w-full">
              {/* Entity Branding */}
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-md flex items-center justify-center bg-sidebar-primary"
                >
                  <Building2 className="h-4 w-4 text-sidebar-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h1 className="text-base font-semibold text-sidebar-foreground">
                    {config.displayName}
                  </h1>
                  <p className="text-xs text-sidebar-muted">
                    {isInvoiceManagement ? 'Invoice Management Portal' : isCostModel ? 'Cost Model Portal' : 'Invoice Automation Portal'}
                  </p>
                </div>
              </div>
              
              {/* KPMG Branding - Position based on config */}
              {isKpmgBrandingVisible && kpmgPosition === 'top' && (
                <div className="flex items-center space-x-2 px-2 py-1.5 bg-sidebar-accent rounded-md border border-sidebar-border">
                  <div className="w-3.5 h-3.5 bg-sidebar-primary rounded flex items-center justify-center">
                    <FileText className="h-2 w-2 text-sidebar-primary-foreground" />
                  </div>
                  <span className="text-xs text-sidebar-foreground font-medium">
                    Powered by KPMG
                  </span>
                </div>
              )}
            </div>
          )}
          
          {isCollapsed && (
            <div className="flex flex-col items-center space-y-2">
              <div 
                className="w-8 h-8 rounded-md flex items-center justify-center mx-auto bg-sidebar-primary"
              >
                <Building2 className="h-4 w-4 text-sidebar-primary-foreground" />
              </div>
              {isKpmgBrandingVisible && (
                <div className="w-3.5 h-3.5 bg-sidebar-accent rounded flex items-center justify-center">
                  <FileText className="h-2 w-2 text-sidebar-foreground" />
                </div>
              )}
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>


        {/* Back to Modules Button */}
        <div className="px-2 py-2 border-b border-sidebar-border">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent border border-sidebar-border",
              isCollapsed && "justify-center px-2"
            )}
            onClick={() => {
              dispatch({ type: 'SET_CURRENT_TAB', payload: 'landing' });
              setIsMobileOpen(false);
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            {!isCollapsed && <span>Back to Modules</span>}
          </Button>
        </div>

        {/* Navigation - Hidden for User role in Invoice Management */}
        {!shouldHideNavigation && (
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
                            "w-full justify-center h-10 px-3 mb-1 transition-all duration-150",
                            isActive && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90",
                            !isActive && "text-sidebar-foreground hover:bg-sidebar-accent"
                          )}
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
              // If group title is empty, show items without grouping
              if (!group.title || group.title === "") {
                return (
                  <div key="ungrouped" className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = state.currentTab === item.id;
                      
                      return (
                        <Button
                          key={item.id}
                          variant={isActive ? "default" : "ghost"}
                          className={cn(
                            "w-full justify-start h-10 px-3 transition-all duration-150",
                            isActive && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90",
                            !isActive && "text-sidebar-foreground hover:bg-sidebar-accent"
                          )}
                          onClick={() => handleTabChange(item.id)}
                          data-testid={`nav-${item.id}`}
                          aria-label={`Navigate to ${item.label}`}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <Icon className="h-5 w-5 mr-3" />
                          {item.label}
                        </Button>
                      );
                    })}
                  </div>
                );
              }
              
              const isExpanded = expandedGroups.has(group.title);
              const hasActiveItem = group.items.some(item => state.currentTab === item.id);
              
              return (
                <div key={group.title} className="space-y-1">
                  {/* Group Header */}
                  <button
                    onClick={() => toggleGroup(group.title)}
                    className={cn(
                      "w-full flex items-center justify-between px-2 py-2 text-sm font-medium transition-all duration-150 rounded-md text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    <span className="flex items-center">
                      <ChevronDown className={cn(
                        "h-4 w-4 mr-2 transition-transform duration-150",
                        isExpanded ? "rotate-0" : "-rotate-90"
                      )} />
                      {group.title}
                    </span>
                  </button>
                  
                  {/* Group Items */}
                  {isExpanded && (
                    <div className="ml-2 space-y-1 border-l-2 border-sidebar-border pl-2">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = state.currentTab === item.id;
                        
                        return (
                          <Button
                            key={item.id}
                            variant={isActive ? "default" : "ghost"}
                            className={cn(
                              "w-full justify-start h-10 px-3 transition-all duration-150",
                              isActive && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90",
                              !isActive && "text-sidebar-foreground hover:bg-sidebar-accent"
                            )}
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
        )}

        {/* Footer - Sticky at bottom */}
        {!isCollapsed && (
          <div className="absolute bottom-4 left-2 right-2 space-y-2">
            {/* KPMG Branding - Bottom position */}
            {isKpmgBrandingVisible && kpmgPosition === 'bottom' && (
              <div className="flex items-center justify-center space-x-2 px-3 py-2 bg-sidebar-accent rounded-md border border-sidebar-border">
                <div className="w-3.5 h-3.5 bg-sidebar-primary rounded flex items-center justify-center">
                  <FileText className="h-2 w-2 text-sidebar-primary-foreground" />
                </div>
                <span className="text-xs text-sidebar-foreground font-medium">
                  Powered by KPMG
                </span>
              </div>
            )}
            
            {/* Coditas Watermark - Below KPMG branding */}
            <div 
              className="flex items-center justify-center space-x-2 px-3 py-2 text-sidebar-foreground rounded-md bg-sidebar-primary"
            >
              <div className="w-2 h-2 bg-sidebar-primary-foreground rounded-full"></div>
              <div className="text-xs font-medium">
                Designed & Developed by <span className="font-semibold">Coditas</span>
              </div>
            </div>
          </div>
        )}
        </div>
      )}

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