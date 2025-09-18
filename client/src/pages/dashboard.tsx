import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/hooks/use-app-state";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  QrCode,
  Upload,
  Download,
  Scale
} from "lucide-react";

const statsData = [
  {
    title: "Total Invoices",
    value: "1,247",
    icon: FileText,
    color: "text-primary"
  },
  {
    title: "Processed Today",
    value: "89",
    icon: CheckCircle,
    color: "text-green-500"
  },
  {
    title: "Pending Review",
    value: "23",
    icon: Clock,
    color: "text-amber-500"
  },
  {
    title: "Errors",
    value: "5",
    icon: AlertTriangle,
    color: "text-destructive"
  }
];

const recentActivities = [
  {
    message: "Invoice INV-2024-001 processed",
    time: "2 minutes ago",
    color: "bg-green-500"
  },
  {
    message: "QR Code scanned - INV-2024-002",
    time: "5 minutes ago",
    color: "bg-blue-500"
  },
  {
    message: "EGAM data sync started",
    time: "10 minutes ago",
    color: "bg-amber-500"
  },
  {
    message: "Reconciliation mismatch detected",
    time: "15 minutes ago",
    color: "bg-red-500"
  }
];

const quickActions = [
  {
    title: "Scan QR Code",
    icon: QrCode,
    action: "qr-scanner"
  },
  {
    title: "Upload PDF",
    icon: Upload,
    action: "pdf-upload"
  },
  {
    title: "Fetch EGAM",
    icon: Download,
    action: "egam-repository"
  },
  {
    title: "Reconcile Data",
    icon: Scale,
    action: "reconciliation"
  }
];

export default function Dashboard() {
  const { dispatch } = useAppState();

  const handleQuickAction = (action: string) => {
    dispatch({ type: 'SET_CURRENT_TAB', payload: action });
  };

  return (
    <div className="p-6 space-y-8" data-testid="dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} data-testid={`stat-card-${index}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold" data-testid={`stat-value-${index}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}/10`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card data-testid="recent-activities">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3" data-testid={`activity-${index}`}>
                  <div className={`w-2 h-2 ${activity.color} rounded-full`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card data-testid="quick-actions">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-20 flex-col space-y-2 hover:border-primary"
                    onClick={() => handleQuickAction(action.action)}
                    data-testid={`quick-action-${action.action}`}
                  >
                    <Icon className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">{action.title}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
