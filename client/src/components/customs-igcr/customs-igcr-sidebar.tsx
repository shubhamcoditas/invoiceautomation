import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAppState } from "@/hooks/use-app-state";
import { useSidebar } from "@/hooks/use-sidebar";
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ShieldCheck,
  UserPlus,
  Package,
  Truck,
  ListTree,
  TrendingUp,
  Calculator,
  LayoutDashboard,
} from "lucide-react";
import { useState } from "react";

const navigationItems = [
  { id: "customs-igcr-dashboards", label: "Dashboards", icon: LayoutDashboard },
  { id: "customs-igcr-onboarding", label: "Entity Onboarding", icon: UserPlus },
  { id: "customs-igcr-import-register", label: "Import Register", icon: Package },
  { id: "customs-igcr-goods-movement", label: "Goods Movement", icon: Truck },
  { id: "customs-igcr-bom-setup", label: "BOM Setup", icon: ListTree },
  { id: "customs-igcr-sales-tracking", label: "Sales tracking", icon: TrendingUp },
  { id: "customs-igcr-igcr-working", label: "IGCR Working", icon: Calculator },
];

export function CustomsIGCRSidebar() {
  const { state, dispatch } = useAppState();
  const { isCollapsed, toggleCollapse } = useSidebar();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleTabChange = (tabId: string) => {
    dispatch({ type: "SET_CURRENT_TAB", payload: tabId });
    setIsMobileOpen(false);
  };

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      <div
        className={cn(
          "fixed left-0 top-0 h-full z-40 transition-all duration-300 ease-out",
          "bg-white dark:bg-gray-900 border-r border-amber-200 dark:border-amber-800",
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "w-16" : "w-72"
        )}
      >
        <div className="flex items-center justify-between px-2 py-4 border-b border-amber-200 dark:border-amber-800">
          {!isCollapsed && (
            <div className="flex flex-col space-y-2 w-full">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-600 text-white">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                    Customs IGCR
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Tool
                  </p>
                </div>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="flex flex-col items-center space-y-2 w-full">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto bg-amber-600 text-white">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-amber-100 dark:hover:bg-amber-900/30"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <div className="px-2 py-2 border-b border-amber-200 dark:border-amber-800">
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start gap-2 border-amber-200 dark:border-amber-800 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20",
              isCollapsed && "justify-center px-2"
            )}
            onClick={() => {
              dispatch({ type: "SET_CURRENT_TAB", payload: "landing" });
              setIsMobileOpen(false);
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            {!isCollapsed && <span>Back to Modules</span>}
          </Button>
        </div>

        <nav className="px-2 py-4 space-y-1">
          {isCollapsed ? (
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
                          isActive && "bg-amber-600 hover:bg-amber-700 text-white",
                          !isActive && "text-gray-600 dark:text-gray-400 hover:bg-amber-100 dark:hover:bg-amber-900/30"
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
                      isActive && "bg-amber-600 hover:bg-amber-700 text-white",
                      !isActive && "text-gray-600 dark:text-gray-400 hover:bg-amber-100 dark:hover:bg-amber-900/30"
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

      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
