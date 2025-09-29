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
  'user-profile': { title: 'User Settings', subtitle: 'Manage your personal information, account details, and profile preferences', icon: User }
};

export function Header() {
  const { state, dispatch } = useAppState();
  const { config, isKpmgBrandingVisible, kpmgPosition } = useEntity();
  
  const currentTabInfo = tabTitles[state.currentTab as keyof typeof tabTitles] || 
    { title: 'Dashboard', subtitle: 'Overview of invoice processing activities', icon: BarChart3 };

  const handleUserProfileClick = () => {
    dispatch({ type: 'SET_CURRENT_TAB', payload: 'user-profile' });
  };

  const handleRoleSwitch = (newRole: string) => {
    dispatch({ type: 'SWITCH_USER_ROLE', payload: newRole });
  };

  const getRoleIcon = (role: string) => {
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
  };

  return (
    <header className="glass border-b border-border/50 p-4 shadow-lg transition-all duration-300" data-testid="header">
      <div className="flex justify-between items-center">
        <div className="animate-slide-in-left flex items-center space-x-4">
          {/* Current Tab Icon */}
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ 
                background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})` 
              }}
            >
              {(() => {
                const IconComponent = currentTabInfo.icon;
                return <IconComponent className="h-6 w-6 text-white" />;
              })()}
            </div>
            <div>
              <h2 className="text-3xl font-bold transition-all duration-300 hover:scale-105 will-change-transform" data-testid="page-title">
                {currentTabInfo.title}
              </h2>
              <p className="text-muted-foreground text-lg mt-1 transition-all duration-300" data-testid="page-subtitle">
                {currentTabInfo.subtitle}
              </p>
            </div>
          </div>
          
          {/* KPMG Branding - Side position */}
          {isKpmgBrandingVisible && kpmgPosition === 'side' && (
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-4 h-4 bg-gradient-to-br from-[#00338D] to-[#4A90E2] rounded flex items-center justify-center">
                <Building2 className="h-2.5 w-2.5 text-white" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Powered by KPMG
              </span>
            </div>
          )}
        </div>

        {/* Entity Switcher and User Avatar - Top Right */}
        <div className="animate-slide-in-right flex items-center space-x-3">
          {/* Entity Switcher - Only for Application Admin */}
          <EntitySwitcher 
            userRole={state.currentUser?.role || 'Business User'} 
            isCollapsed={false} 
          />
          
          {/* User Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                data-testid="user-avatar-button"
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})` 
                  }}
                >
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">John Smith</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{state.currentUser?.role || 'Application Admin'}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
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
                  {getRoleIcon(state.currentUser?.role || 'Application Admin')}
                  <span>Switch Role</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem 
                    onClick={() => handleRoleSwitch('Application Admin')}
                    className="cursor-pointer"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Application Admin</span>
                    {state.currentUser?.role === 'Application Admin' && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleRoleSwitch('Admin')}
                    className="cursor-pointer"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    <span>Admin</span>
                    {state.currentUser?.role === 'Admin' && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleRoleSwitch('Business User')}
                    className="cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Business User</span>
                    {state.currentUser?.role === 'Business User' && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
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
