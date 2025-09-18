import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'QR Code Processed',
    message: 'IRN: 1a2b3c4d5e6f successfully extracted',
    time: '2 minutes ago',
    type: 'success'
  },
  {
    id: '2',
    title: 'EGAM Sync Completed',
    message: 'Repository updated with 45 new records',
    time: '1 hour ago',
    type: 'info'
  },
  {
    id: '3',
    title: 'Reconciliation Alert',
    message: '3 mismatched entries found',
    time: '3 hours ago',
    type: 'warning'
  }
];

export function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications] = useState<Notification[]>(mockNotifications);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
        data-testid="button-notifications"
      >
        <Bell className="h-5 w-5" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs" />
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-12 w-80 shadow-lg z-50 max-h-96 overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                data-testid="button-close-notifications"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-3 border-b border-border hover:bg-accent cursor-pointer"
                    data-testid={`notification-${notification.id}`}
                  >
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
