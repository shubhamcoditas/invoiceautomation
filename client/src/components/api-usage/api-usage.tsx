import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Activity,
  Zap,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from "lucide-react";

// Mock data for API usage statistics
const mockApiUsageData = {
  overview: {
    totalCalls: 1247,
    successRate: 94.2,
    avgResponseTime: 245,
    activeUsers: 23,
    todayCalls: 89,
    weekCalls: 567,
    monthCalls: 1247
  },
  apiEndpoints: [
    {
      name: 'Search Taxpayer',
      endpoint: '/api/validation/search-taxpayer',
      calls: 456,
      successRate: 96.1,
      avgResponseTime: 189,
      lastUsed: '2 minutes ago',
      status: 'active',
      trend: 'up'
    },
    {
      name: 'Validate GSTIN',
      endpoint: '/api/validation/validate-gstin',
      calls: 342,
      successRate: 98.5,
      avgResponseTime: 156,
      lastUsed: '5 minutes ago',
      status: 'active',
      trend: 'up'
    },
    {
      name: 'Check Registration',
      endpoint: '/api/validation/check-registration',
      calls: 289,
      successRate: 92.3,
      avgResponseTime: 312,
      lastUsed: '1 hour ago',
      status: 'active',
      trend: 'down'
    },
    {
      name: 'Validate PAN',
      endpoint: '/api/validation/validate-pan',
      calls: 160,
      successRate: 89.4,
      avgResponseTime: 278,
      lastUsed: '3 hours ago',
      status: 'warning',
      trend: 'down'
    }
  ],
  hourlyStats: [
    { hour: '00:00', calls: 12, success: 11, errors: 1 },
    { hour: '01:00', calls: 8, success: 8, errors: 0 },
    { hour: '02:00', calls: 5, success: 5, errors: 0 },
    { hour: '03:00', calls: 3, success: 3, errors: 0 },
    { hour: '04:00', calls: 7, success: 6, errors: 1 },
    { hour: '05:00', calls: 15, success: 14, errors: 1 },
    { hour: '06:00', calls: 23, success: 22, errors: 1 },
    { hour: '07:00', calls: 45, success: 43, errors: 2 },
    { hour: '08:00', calls: 78, success: 75, errors: 3 },
    { hour: '09:00', calls: 95, success: 91, errors: 4 },
    { hour: '10:00', calls: 112, success: 108, errors: 4 },
    { hour: '11:00', calls: 98, success: 94, errors: 4 },
    { hour: '12:00', calls: 87, success: 83, errors: 4 },
    { hour: '13:00', calls: 76, success: 73, errors: 3 },
    { hour: '14:00', calls: 89, success: 85, errors: 4 },
    { hour: '15:00', calls: 102, success: 97, errors: 5 },
    { hour: '16:00', calls: 115, success: 109, errors: 6 },
    { hour: '17:00', calls: 98, success: 93, errors: 5 },
    { hour: '18:00', calls: 67, success: 64, errors: 3 },
    { hour: '19:00', calls: 45, success: 43, errors: 2 },
    { hour: '20:00', calls: 32, success: 30, errors: 2 },
    { hour: '21:00', calls: 28, success: 27, errors: 1 },
    { hour: '22:00', calls: 19, success: 18, errors: 1 },
    { hour: '23:00', calls: 14, success: 13, errors: 1 }
  ],
  recentErrors: [
    {
      id: '1',
      endpoint: 'Search Taxpayer',
      error: 'Invalid GSTIN format',
      timestamp: '2 minutes ago',
      count: 3
    },
    {
      id: '2',
      endpoint: 'Validate PAN',
      error: 'Rate limit exceeded',
      timestamp: '15 minutes ago',
      count: 1
    },
    {
      id: '3',
      endpoint: 'Check Registration',
      error: 'Service temporarily unavailable',
      timestamp: '1 hour ago',
      count: 2
    }
  ]
};

export function APIUsage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? 
      <ArrowUpRight className="h-4 w-4 text-green-500" /> : 
      <ArrowDownRight className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="w-full space-y-8" data-testid="api-usage">
      {/* Header */}
      <Card className="modern-card animate-fade-in">
        <CardHeader className="modern-card-header">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="modern-card-title">
                API Usage Statistics
              </CardTitle>
              <p className="modern-card-subtitle">
                Monitor validation API performance and usage metrics
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Tabs value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1">
                  <TabsTrigger value="24h">24H</TabsTrigger>
                  <TabsTrigger value="7d">7D</TabsTrigger>
                  <TabsTrigger value="30d">30D</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="modern-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total API Calls</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {mockApiUsageData.overview.totalCalls.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600 dark:text-green-400">+12.5%</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="modern-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {mockApiUsageData.overview.successRate}%
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600 dark:text-green-400">+2.1%</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="modern-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {mockApiUsageData.overview.avgResponseTime}ms
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600 dark:text-green-400">-15ms</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="modern-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {mockApiUsageData.overview.activeUsers}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600 dark:text-green-400">+3</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* API Endpoints Performance */}
          <Card className="modern-card mb-8">
            <CardHeader className="modern-card-header">
              <CardTitle className="modern-card-title">API Endpoints Performance</CardTitle>
              <p className="modern-card-subtitle">Real-time performance metrics for each validation API endpoint</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockApiUsageData.apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{endpoint.name}</h3>
                        <Badge className={getStatusColor(endpoint.status)}>
                          {endpoint.status}
                        </Badge>
                        <div className="flex items-center">
                          {getTrendIcon(endpoint.trend)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{endpoint.endpoint}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Last used: {endpoint.lastUsed}</p>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{endpoint.calls}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Calls</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{endpoint.successRate}%</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Success</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{endpoint.avgResponseTime}ms</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Avg Time</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Errors */}
          <Card className="modern-card">
            <CardHeader className="modern-card-header">
              <CardTitle className="modern-card-title">Recent Errors</CardTitle>
              <p className="modern-card-subtitle">Latest API errors and issues that need attention</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockApiUsageData.recentErrors.map((error) => (
                  <div key={error.id} className="flex items-center justify-between p-3 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/10">
                    <div className="flex items-center space-x-3">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{error.endpoint}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{error.error}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="destructive" className="text-xs">
                        {error.count} error{error.count > 1 ? 's' : ''}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{error.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
