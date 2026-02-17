import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Clock, 
  XCircle, 
  AlertTriangle,
  Activity,
  Zap,
  Users,
  Calendar,
  RefreshCw
} from "lucide-react";

// Generate dynamic data based on time range
const generateApiUsageData = (timeRange: string) => {
  const baseData = {
    '24h': {
      totalCalls: 89,
      avgResponseTime: 245,
      activeUsers: 8,
      apiEndpoints: [
        {
          name: 'Search Taxpayer',
          endpoint: '/api/validation/search-taxpayer',
          calls: 32,
          lastUsed: '2 minutes ago'
        },
        {
          name: 'Validate GSTIN',
          endpoint: '/api/validation/validate-gstin',
          calls: 24,
          lastUsed: '5 minutes ago'
        },
        {
          name: 'Check Registration',
          endpoint: '/api/validation/check-registration',
          calls: 18,
          lastUsed: '1 hour ago'
        },
        {
          name: 'Validate PAN',
          endpoint: '/api/validation/validate-pan',
          calls: 15,
          lastUsed: '3 hours ago'
        }
      ],
      recentErrors: [
        {
          id: '1',
          endpoint: 'Search Taxpayer',
          error: 'Invalid GSTIN format',
          timestamp: '2 minutes ago',
          count: 1
        },
        {
          id: '2',
          endpoint: 'Validate PAN',
          error: 'Rate limit exceeded',
          timestamp: '15 minutes ago',
          count: 1
        }
      ]
    },
    '7d': {
      totalCalls: 567,
      avgResponseTime: 267,
      activeUsers: 18,
      apiEndpoints: [
        {
          name: 'Search Taxpayer',
          endpoint: '/api/validation/search-taxpayer',
          calls: 201,
          lastUsed: '2 minutes ago'
        },
        {
          name: 'Validate GSTIN',
          endpoint: '/api/validation/validate-gstin',
          calls: 156,
          lastUsed: '5 minutes ago'
        },
        {
          name: 'Check Registration',
          endpoint: '/api/validation/check-registration',
          calls: 134,
          lastUsed: '1 hour ago'
        },
        {
          name: 'Validate PAN',
          endpoint: '/api/validation/validate-pan',
          calls: 76,
          lastUsed: '3 hours ago'
        }
      ],
      recentErrors: [
        {
          id: '1',
          endpoint: 'Search Taxpayer',
          error: 'Invalid GSTIN format',
          timestamp: '2 minutes ago',
          count: 2
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
          count: 1
        }
      ]
    },
    '30d': {
      totalCalls: 1247,
      avgResponseTime: 245,
      activeUsers: 23,
      apiEndpoints: [
        {
          name: 'Search Taxpayer',
          endpoint: '/api/validation/search-taxpayer',
          calls: 456,
          lastUsed: '2 minutes ago'
        },
        {
          name: 'Validate GSTIN',
          endpoint: '/api/validation/validate-gstin',
          calls: 342,
          lastUsed: '5 minutes ago'
        },
        {
          name: 'Check Registration',
          endpoint: '/api/validation/check-registration',
          calls: 289,
          lastUsed: '1 hour ago'
        },
        {
          name: 'Validate PAN',
          endpoint: '/api/validation/validate-pan',
          calls: 160,
          lastUsed: '3 hours ago'
        }
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
    }
  };

  return baseData[timeRange as keyof typeof baseData] || baseData['24h'];
};

export function APIUsage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentData, setCurrentData] = useState(generateApiUsageData('24h'));

  // Update data when time range changes
  useEffect(() => {
    setCurrentData(generateApiUsageData(selectedTimeRange));
  }, [selectedTimeRange]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API refresh
    setTimeout(() => {
      setCurrentData(generateApiUsageData(selectedTimeRange));
      setIsRefreshing(false);
    }, 1000);
  };


  return (
    <div className="w-full space-y-8 mb-8" data-testid="api-usage">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="modern-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total API Calls</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {currentData.totalCalls.toLocaleString()}
                    </p>
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
                    <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {currentData.avgResponseTime}ms
                    </p>
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
                      {currentData.activeUsers}
                    </p>
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
                {currentData.apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{endpoint.name}</h3>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{endpoint.endpoint}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Last used: {endpoint.lastUsed}</p>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{endpoint.calls}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Calls</p>
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
                {currentData.recentErrors.map((error) => (
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
