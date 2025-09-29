import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function DisclaimerBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <span className="font-semibold">Prototype Notice:</span> This is a demonstration prototype built for illustration purposes only. 
            UI/UX design and functionality may undergo changes during actual development.
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="text-amber-600 hover:text-amber-800 hover:bg-amber-100 p-1 h-auto"
          aria-label="Dismiss disclaimer"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
