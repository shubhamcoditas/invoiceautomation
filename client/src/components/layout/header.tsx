import { useAppState } from "@/hooks/use-app-state";
import { useEntity } from "@/hooks/use-entity";
import { EntitySwitcher } from "./entity-switcher";
import { 
  Building2,
  QrCode, 
  FileText, 
  Database, 
  Mail, 
  Code, 
  FileBarChart,
  User,
  Settings,
  BarChart3,
  ChevronDown,
  LogOut,
  Shield,
  Users,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

import { Receipt } from "lucide-react";

const tabTitles = {
  'dashboard': { title: 'Dashboard', subtitle: 'Overview of invoice processing activities', icon: BarChart3 },
  'invoice-tracker': { title: 'Invoice Tracker', subtitle: 'Consolidated view of all invoices across QR, PDF, and email sources', icon: FileText },
  'qr-scanner': { title: 'QR Scanner', subtitle: 'Extract invoice data from QR codes', icon: QrCode },
  'pdf-upload': { title: 'PDF Upload', subtitle: 'Process invoice PDFs with OCR', icon: FileText },
  'email-review': { title: 'Email Review Queue', subtitle: 'Review and process incoming invoice emails', icon: Mail },
  'egam-repository': { title: 'EGAM Repository', subtitle: 'Manage EGAM purchase invoice data', icon: Database },
  'reconciliation': { title: 'Data Reconciliation', subtitle: 'Compare extracted data with EGAM repository', icon: BarChart3 },
  'validation-apis': { title: 'Validation APIs', subtitle: 'Test validation API endpoints', icon: Code },
  'notice-apis': { title: 'Notice APIs', subtitle: 'Test GSTN notice API endpoints', icon: Settings },
  'api-usage': { title: 'API Usage', subtitle: 'Monitor API usage statistics and performance metrics', icon: BarChart3 },
  'integrations': { title: 'Integrations', subtitle: 'Manage your system integrations and third-party connections', icon: Building2 },
  'logs': { title: 'System Logs', subtitle: 'View system activity and API call history', icon: FileBarChart },
  'user-management': { title: 'User Management', subtitle: 'Manage system users and permissions', icon: User },
  'settings': { title: 'Settings and Config', subtitle: 'Configure system settings and manage your profile preferences', icon: Settings },
  'user-profile': { title: 'User Settings', subtitle: 'Manage your personal information, account details, and profile preferences', icon: User },
  'invoice-management': { title: 'Invoice Management', subtitle: 'Comprehensive invoice management, tracking, and administration', icon: Receipt }
};

export function Header() {
  const { state, dispatch } = useAppState();
  const { config, isKpmgBrandingVisible, kpmgPosition } = useEntity();
  
  // Check if we're in Invoice Management module
  const isInvoiceManagement = state.currentTab?.startsWith('invoice-management') || state.currentTab === 'invoice-management';
  
  const currentTabInfo = tabTitles[state.currentTab as keyof typeof tabTitles] || 
    { title: 'Dashboard', subtitle: 'Overview of invoice processing activities', icon: BarChart3 };

  const handleUserProfileClick = () => {
    dispatch({ type: 'SET_CURRENT_TAB', payload: 'user-profile' });
  };

  const handleRoleSwitch = (newRole: string) => {
    dispatch({ type: 'SWITCH_USER_ROLE', payload: newRole });
  };

  const getRoleIcon = (role: string) => {
    if (isInvoiceManagement) {
      // Invoice Management roles
      switch (role) {
        case 'Admin':
          return <Shield className="mr-2 h-4 w-4" />;
        case 'Agent':
          return <Users className="mr-2 h-4 w-4" />;
        case 'User':
          return <User className="mr-2 h-4 w-4" />;
        default:
          return <User className="mr-2 h-4 w-4" />;
      }
    } else {
      // EGAM roles
      switch (role) {
        case 'Application Admin':
          return <Shield className="mr-2 h-4 w-4" />;
        case 'Admin':
          return <Users className="mr-2 h-4 w-4" />;
        case 'Business User':
          return <User className="mr-2 h-4 w-4" />;
        default:
          return <User className="mr-2 h-4 w-4" />;
      }
    }
  };

  // Get available roles based on module
  const getAvailableRoles = () => {
    if (isInvoiceManagement) {
      return [
        { value: 'Admin', label: 'Admin', icon: Shield },
        { value: 'Agent', label: 'Agent', icon: Users },
        { value: 'User', label: 'User', icon: User }
      ];
    } else {
      return [
        { value: 'Application Admin', label: 'Application Admin', icon: Shield },
        { value: 'Admin', label: 'Admin', icon: Users },
        { value: 'Business User', label: 'Business User', icon: User }
      ];
    }
  };

  const availableRoles = getAvailableRoles();
  const defaultRole = isInvoiceManagement ? 'Admin' : 'Application Admin';

  return (
    <header className="bg-card border-b border-border px-6 py-4 transition-all duration-200" data-testid="header">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Current Tab Icon */}
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-md flex items-center justify-center bg-primary"
            >
              {(() => {
                const IconComponent = currentTabInfo.icon;
                return <IconComponent className="h-5 w-5 text-primary-foreground" />;
              })()}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground" data-testid="page-title">
                {currentTabInfo.title}
              </h2>
              <p className="text-muted-foreground text-sm mt-0.5" data-testid="page-subtitle">
                {currentTabInfo.subtitle}
              </p>
            </div>
          </div>
          
          {/* KPMG Branding - Side position */}
          {isKpmgBrandingVisible && kpmgPosition === 'side' && (
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-muted rounded-md border border-border">
              <div 
                className="w-3.5 h-3.5 rounded flex items-center justify-center bg-primary"
              >
                <Building2 className="h-2 w-2 text-primary-foreground" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                Powered by KPMG
              </span>
            </div>
          )}
        </div>

        {/* Entity Switcher and User Avatar - Top Right */}
        <div className="flex items-center space-x-3">
          {/* Entity Switcher - Only for Application Admin in EGAM module */}
          {!isInvoiceManagement && (
            <EntitySwitcher 
              userRole={state.currentUser?.role || 'Business User'} 
              isCollapsed={false} 
            />
          )}
          
          {/* User Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-muted transition-colors duration-150"
                data-testid="user-avatar-button"
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-primary"
                >
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-foreground">John Smith</p>
                  <p className="text-xs text-muted-foreground">{state.currentUser?.role || defaultRole}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">John Smith</p>
                  <p className="text-xs text-gray-500">john.smith@company.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Role Switching */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  {getRoleIcon(state.currentUser?.role || defaultRole)}
                  <span>Switch Role</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {availableRoles.map((role) => {
                    const RoleIcon = role.icon;
                    return (
                      <DropdownMenuItem 
                        key={role.value}
                        onClick={() => handleRoleSwitch(role.value)}
                        className="cursor-pointer"
                      >
                        <RoleIcon className="mr-2 h-4 w-4" />
                        <span>{role.label}</span>
                        {state.currentUser?.role === role.value && (
                          <Check className="ml-auto h-4 w-4" />
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleUserProfileClick} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
