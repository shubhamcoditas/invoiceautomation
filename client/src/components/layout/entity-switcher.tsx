import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEntity } from "@/hooks/use-entity";
import { isApplicationAdmin } from "@/lib/entity-config";

// Check if user can switch entities (Application Admin only)
const canSwitchEntities = (userRole: string): boolean => {
  return userRole === 'Application Admin';
};
import { Building2, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface EntitySwitcherProps {
  userRole: string;
  isCollapsed?: boolean;
}

export function EntitySwitcher({ userRole, isCollapsed = false }: EntitySwitcherProps) {
  const { config, allEntities, switchEntity, currentEntityId } = useEntity();
  const [isOpen, setIsOpen] = useState(false);

  // Only show entity switcher for Application Admin users
  if (!canSwitchEntities(userRole)) {
    return null;
  }

  const handleEntityChange = (entityId: string) => {
    switchEntity(entityId);
    setIsOpen(false);
  };

  if (isCollapsed) {
    return (
      <div className="px-2 py-2">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-full h-10 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Building2 className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {allEntities.map((entity) => (
              <DropdownMenuItem
                key={entity.id}
                onClick={() => handleEntityChange(entity.id)}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ 
                      background: `linear-gradient(135deg, ${entity.primaryColor}, ${entity.secondaryColor})` 
                    }}
                  />
                  <span className="text-sm font-medium">{entity.displayName}</span>
                </div>
                {currentEntityId === entity.id && (
                  <Check className="h-4 w-4 text-green-600" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="px-2 py-2">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-10 px-3 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded"
                style={{ 
                  background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})` 
                }}
              />
              <span className="text-sm font-medium">{config.displayName}</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Switch Entity
          </div>
          {allEntities.map((entity) => (
            <DropdownMenuItem
              key={entity.id}
              onClick={() => handleEntityChange(entity.id)}
              className="flex items-center justify-between px-3 py-2"
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-5 h-5 rounded"
                  style={{ 
                    background: `linear-gradient(135deg, ${entity.primaryColor}, ${entity.secondaryColor})` 
                  }}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{entity.displayName}</span>
                  <span className="text-xs text-gray-500">Onboarded: {entity.onboardingDate}</span>
                </div>
              </div>
              {currentEntityId === entity.id && (
                <Check className="h-4 w-4 text-green-600" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
