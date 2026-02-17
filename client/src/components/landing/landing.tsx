import { useAppState } from "@/hooks/use-app-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Database, 
  TrendingUp, 
  FileText, 
  BarChart3,
  ArrowRight,
  Building2,
  Download,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Landing() {
  const { dispatch } = useAppState();

  const modules = [
    {
      id: 'cost-control',
      title: 'Cost Model',
      description: 'Cost model management, budget tracking, and financial analysis',
      icon: TrendingUp,
      color: 'green',
      features: [
        'Cost Model Dashboard',
        'Budget Management',
        'Service Costing',
        'Asset Management',
        'Financial Reporting'
      ],
      action: () => {
        dispatch({ type: 'SET_CURRENT_TAB', payload: 'cost-model-dashboard' });
      }
    },
    {
      id: 'egam',
      title: 'EGAM & Invoice Automation',
      description: 'Invoice processing, QR scanning, PDF upload, and EGAM repository management',
      icon: Database,
      color: 'blue',
      features: [
        'Invoice Tracker',
        'QR Code Scanner',
        'PDF Processing',
        'EGAM Repository',
        'Email Review Queue'
      ],
      action: () => {
        dispatch({ type: 'SET_CURRENT_TAB', payload: 'invoice-tracker' });
      }
    },
    {
      id: 'ea-invoice-downloader',
      title: 'EA Invoice Downloader',
      description: 'Emirates Airlines invoice download and agent management system',
      icon: Download,
      color: 'red',
      features: [
        'Agent Management',
        'Tickets Management',
        'Audit Logs',
        'Invoice Downloads',
        'Role-based Access'
      ],
      action: () => {
        dispatch({ type: 'SET_CURRENT_TAB', payload: 'ea-invoice-downloader' });
      }
    },
    {
      id: 'customs-igcr',
      title: 'Customs IGCR Tool',
      description: 'Customs IGCR declarations, compliance checks, and reporting',
      icon: ShieldCheck,
      color: 'amber',
      features: [
        'IGCR Dashboard',
        'Declarations',
        'Compliance Checks',
        'Reports',
        'Document Management'
      ],
      action: () => {
        dispatch({ type: 'SET_CURRENT_TAB', payload: 'customs-igcr-dashboard' });
      }
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          card: 'border-blue-200 hover:border-blue-300 dark:border-blue-800 dark:hover:border-blue-700',
          icon: 'text-blue-600 dark:text-blue-400',
          button: 'bg-blue-600 hover:bg-blue-700 text-white',
          gradient: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'
        };
      case 'green':
        return {
          card: 'border-green-200 hover:border-green-300 dark:border-green-800 dark:hover:border-green-700',
          icon: 'text-green-600 dark:text-green-400',
          button: 'bg-green-600 hover:bg-green-700 text-white',
          gradient: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20'
        };
      case 'purple':
        return {
          card: 'border-purple-200 hover:border-purple-300 dark:border-purple-800 dark:hover:border-purple-700',
          icon: 'text-purple-600 dark:text-purple-400',
          button: 'bg-purple-600 hover:bg-purple-700 text-white',
          gradient: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20'
        };
      case 'red':
        return {
          card: 'border-red-200 hover:border-red-300 dark:border-red-800 dark:hover:border-red-700',
          icon: 'text-red-600 dark:text-red-400',
          button: 'bg-[#D71921] hover:bg-[#B0151C] text-white',
          gradient: 'from-red-50 to-amber-50 dark:from-red-900/20 dark:to-amber-900/20'
        };
      case 'amber':
        return {
          card: 'border-amber-200 hover:border-amber-300 dark:border-amber-800 dark:hover:border-amber-700',
          icon: 'text-amber-600 dark:text-amber-400',
          button: 'bg-amber-600 hover:bg-amber-700 text-white',
          gradient: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20'
        };
      default:
        return {
          card: 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700',
          icon: 'text-gray-600 dark:text-gray-400',
          button: 'bg-gray-600 hover:bg-gray-700 text-white',
          gradient: 'from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20'
        };
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="h-10 w-10 text-green-600 dark:text-green-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Select a module to get started
          </p>
        </div>

        {/* Module Cards - equal height so CTAs align to bottom */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
          {modules.map((module) => {
            const colors = getColorClasses(module.color);
            const Icon = module.icon;
            
            return (
              <Card
                key={module.id}
                className={cn(
                  "relative overflow-hidden transition-all duration-300 cursor-pointer group flex flex-col h-full",
                  "hover:shadow-xl hover:scale-[1.02]",
                  colors.card
                )}
                onClick={module.action}
              >
                {/* Background Gradient */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-50 group-hover:opacity-70 transition-opacity",
                  colors.gradient
                )} />
                
                <CardHeader className="relative z-10 shrink-0">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                      "p-3 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
                      colors.icon
                    )}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{module.title}</CardTitle>
                  <CardDescription className="text-base">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative z-10 flex flex-col flex-1 min-h-0">
                  <ul className="space-y-2 mb-6 flex-1 min-h-0">
                    {module.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          module.color === 'blue' ? 'bg-blue-500' : 
                          module.color === 'green' ? 'bg-green-500' : 
                          module.color === 'purple' ? 'bg-purple-500' : 
                          module.color === 'red' ? 'bg-[#D71921]' : 
                          module.color === 'amber' ? 'bg-amber-500' : 'bg-gray-500'
                        )} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className={cn("w-full mt-auto shrink-0", colors.button)}
                    onClick={(e) => {
                      e.stopPropagation();
                      module.action();
                    }}
                  >
                    Enter Module
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Select a module above to access its features and tools</p>
        </div>
      </div>
    </div>
  );
}

