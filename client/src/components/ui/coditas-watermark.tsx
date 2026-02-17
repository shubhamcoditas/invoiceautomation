import { cn } from "@/lib/utils";

interface CoditasWatermarkProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  variant?: 'banner' | 'badge' | 'corner';
  className?: string;
}

export function CoditasWatermark({ 
  position = 'bottom-right', 
  variant = 'banner',
  className 
}: CoditasWatermarkProps) {
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  if (variant === 'corner') {
    return (
      <div 
        className={cn(
          "fixed z-[60] pointer-events-none coditas-watermark",
          positionClasses[position],
          className
        )}
      >
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-lg">
          <div className="text-xs text-gray-600 font-medium">
            Designed & Developed by
          </div>
          <div className="text-sm font-bold text-gray-800">
            Coditas
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div 
        className={cn(
          "fixed z-[60] pointer-events-none coditas-watermark",
          positionClasses[position],
          className
        )}
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg">
          <div className="text-xs font-medium">
            Designed & Developed by <span className="font-bold">Coditas</span>
          </div>
        </div>
      </div>
    );
  }

  // Default banner variant
  return (
    <div 
      className={cn(
        "fixed z-[60] pointer-events-none coditas-watermark",
        positionClasses[position],
        className
      )}
    >
      <div className="bg-white/95 backdrop-blur-sm border border-gray-300 rounded-lg px-4 py-3 shadow-xl max-w-xs">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="text-sm font-semibold text-gray-800">
            Designed & Developed by
          </div>
        </div>
        <div className="text-lg font-bold text-gray-900 mt-1">
          Coditas
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Digital Innovation Partner
        </div>
      </div>
    </div>
  );
}
