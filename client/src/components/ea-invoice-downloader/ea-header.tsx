import { useAppState } from "@/hooks/use-app-state";
import { useState, useEffect } from "react";
import {
  Shield,
  Users,
  User,
  ChevronDown,
  Check,
  Plane,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const roles = [
  { value: 'Admin', label: 'Admin', icon: Shield },
  { value: 'Agent', label: 'Agent', icon: Users },
  { value: 'User', label: 'User', icon: User }
];

export function EAHeader() {
  const { state, dispatch } = useAppState();
  const defaultRole = 'Admin';
  const currentRole = state.currentUser?.role || defaultRole;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleRoleSwitch = (newRole: string) => {
    dispatch({ type: 'SWITCH_USER_ROLE', payload: newRole });
  };

  const getRoleIcon = (role: string) => {
    const roleConfig = roles.find(r => r.value === role);
    if (roleConfig) {
      const Icon = roleConfig.icon;
      return <Icon className="mr-2 h-4 w-4" />;
    }
    return <User className="mr-2 h-4 w-4" />;
  };

  return (
    <header
      className={cn(
        "ea-header app-header-shell sticky top-0 z-30 px-6 transition-all duration-300",
        scrolled ? "py-2.5" : "py-4"
      )}
      data-scrolled={scrolled}
      data-testid="ea-header"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Emirates Airlines Logo and Text */}
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/95 text-[#0a0e1a] shadow-md ring-1 ring-white/25 transition-transform duration-200 ease-spring hover:scale-105">
              <Plane className="h-7 w-7 text-[color:var(--brand-blue)]" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Emirates Airlines</h2>
            </div>
          </div>
        </div>

        {/* Role Switcher - Top Right */}
        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center space-x-2 ea-header-button"
              >
                {getRoleIcon(currentRole)}
                <span>{currentRole}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {roles.map((role) => {
                const RoleIcon = role.icon;
                return (
                  <DropdownMenuItem 
                    key={role.value}
                    onClick={() => handleRoleSwitch(role.value)}
                    className="cursor-pointer"
                  >
                    <RoleIcon className="mr-2 h-4 w-4" />
                    <span>{role.label}</span>
                    {currentRole === role.value && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

