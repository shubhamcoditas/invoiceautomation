import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Activity, 
  LogIn, 
  Download, 
  Cloud, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Filter,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EAActivityLog {
  id: string;
  entityId: string;
  activityType: string;
  category: string;
  userId?: string;
  userName: string;
  userRole?: string;
  description: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  status: string;
  recordsCount?: number;
  timestamp: string;
}

type CategoryFilter = 'all' | 'authentication' | 'download' | 'sync';

const categoryConfig: Record<string, { label: string; color: string; bgColor: string; icon: typeof LogIn }> = {
  authentication: { 
    label: 'Login', 
    color: 'text-[#D71921] dark:text-[#D71921]', 
    bgColor: 'bg-[#FBEAEC] dark:bg-[#FBEAEC] border-[#E6E6E6] dark:border-[#E6E6E6]',
    icon: LogIn 
  },
  download: { 
    label: 'Download', 
    color: 'text-purple-700 dark:text-purple-300', 
    bgColor: 'bg-purple-100 dark:bg-purple-900/50 border-purple-200 dark:border-purple-800',
    icon: Download 
  },
  sync: { 
    label: 'Cloud Sync', 
    color: 'text-emerald-700 dark:text-emerald-300', 
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/50 border-emerald-200 dark:border-emerald-800',
    icon: Cloud 
  },
};

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return time.toLocaleDateString();
}

function formatRecordCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}

function ActivityCard({ activity }: { activity: EAActivityLog }) {
  const config = categoryConfig[activity.category] || categoryConfig.authentication;
  const CategoryIcon = config.icon;
  const isSuccess = activity.status === 'success';

  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      {/* Category Icon */}
      <div className={`
        w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
        ${config.bgColor}
      `}>
        <CategoryIcon className={`h-5 w-5 ${config.color}`} />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium text-gray-900 dark:text-white">
            {activity.userName}
          </p>
          <Badge 
            variant="outline" 
            className={`
              text-xs px-2 py-0.5 h-5
              ${config.color} border-current/30
            `}
          >
            {config.label}
          </Badge>
          {isSuccess ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {activity.description}
          {activity.recordsCount && (
            <span className="font-semibold text-gray-900 dark:text-white ml-1">
              ({formatRecordCount(activity.recordsCount)} records)
            </span>
          )}
        </p>
      </div>

      {/* Timestamp */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
        <Clock className="h-3.5 w-3.5" />
        <span>{formatTimeAgo(activity.timestamp)}</span>
      </div>
    </div>
  );
}

function CategorySummaryCard({ 
  category, 
  count, 
  latestActivity 
}: { 
  category: string; 
  count: number; 
  latestActivity?: EAActivityLog;
}) {
  const config = categoryConfig[category];
  if (!config) return null;
  
  const CategoryIcon = config.icon;

  return (
    <div className={`
      rounded-xl border p-4 
      ${config.bgColor}
    `}>
      <div className="flex items-center justify-between mb-3">
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center
          bg-white/60 dark:bg-black/20 border border-current/10
        `}>
          <CategoryIcon className={`h-6 w-6 ${config.color}`} />
        </div>
        <span className="text-3xl font-bold text-gray-900 dark:text-white">
          {count}
        </span>
      </div>
      <h3 className={`font-semibold ${config.color}`}>{config.label} Activities</h3>
      {latestActivity && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
          Last: {formatTimeAgo(latestActivity.timestamp)}
        </p>
      )}
    </div>
  );
}

export function AuditLogs() {
  const [logs, setLogs] = useState<EAActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const { toast } = useToast();

  const fetchLogs = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) setRefreshing(true);
      else setLoading(true);
      
      const response = await fetch('/api/ea-activity-logs');
      if (!response.ok) {
        throw new Error('Failed to fetch activity logs');
      }
      const data = await response.json();
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch activity logs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => fetchLogs(true), 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter(log => 
    categoryFilter === 'all' || log.category === categoryFilter
  );

  const categoryCounts = {
    authentication: logs.filter(l => l.category === 'authentication').length,
    download: logs.filter(l => l.category === 'download').length,
    sync: logs.filter(l => l.category === 'sync').length,
  };

  const getLatestByCategory = (category: string) => 
    logs.filter(l => l.category === category)[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="ea-audit-card">
        <CardHeader className="ea-audit-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Activity Feed</CardTitle>
                <p className="text-white/80 text-sm mt-0.5">
                  Real-time activity monitoring
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fetchLogs(true)}
              disabled={refreshing}
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CategorySummaryCard 
          category="authentication" 
          count={categoryCounts.authentication}
          latestActivity={getLatestByCategory('authentication')}
        />
        <CategorySummaryCard 
          category="download" 
          count={categoryCounts.download}
          latestActivity={getLatestByCategory('download')}
        />
        <CategorySummaryCard 
          category="sync" 
          count={categoryCounts.sync}
          latestActivity={getLatestByCategory('sync')}
        />
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredLogs.length} of {logs.length} activities
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ea-audit-button">
              <Filter className="h-4 w-4 mr-2" />
              {categoryFilter === 'all' ? 'All Categories' : categoryConfig[categoryFilter]?.label}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              checked={categoryFilter === 'all'}
              onCheckedChange={() => setCategoryFilter('all')}
            >
              All Categories
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={categoryFilter === 'authentication'}
              onCheckedChange={() => setCategoryFilter('authentication')}
            >
              <LogIn className="h-4 w-4 mr-2 text-[#D71921]" />
              Login Activities
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={categoryFilter === 'download'}
              onCheckedChange={() => setCategoryFilter('download')}
            >
              <Download className="h-4 w-4 mr-2 text-purple-600" />
              Download Activities
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={categoryFilter === 'sync'}
              onCheckedChange={() => setCategoryFilter('sync')}
            >
              <Cloud className="h-4 w-4 mr-2 text-emerald-600" />
              Cloud Sync Activities
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Activity Feed */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="w-16 h-16 rounded-full ea-audit-spinner"></div>
          </div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading activity feed...</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
          <Activity className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">No activities found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {categoryFilter !== 'all' 
              ? `No ${categoryConfig[categoryFilter]?.label.toLowerCase()} activities recorded yet.`
              : 'Activity logs will appear here as users interact with the system.'
            }
          </p>
        </div>
      ) : (
        <Card className="ea-audit-card">
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLogs.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Indicator */}
      {!loading && filteredLogs.length > 0 && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 py-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full ea-audit-indicator-ping"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 ea-audit-indicator"></span>
          </span>
          <span>Live feed • Auto-refreshes every 30 seconds</span>
        </div>
      )}
    </div>
  );
}
