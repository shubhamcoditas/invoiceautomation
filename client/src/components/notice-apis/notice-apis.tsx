import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Bell, FileText, AlertTriangle, CheckCircle, Clock, Download, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatDateTime, statusBadgeConfig } from "@/lib/utils";

const noticeApiEndpoints = [
  { 
    value: 'notice-generation', 
    label: 'Notice Generation', 
    icon: Bell,
    description: 'Generate and send notices to taxpayers for various compliance requirements. This API handles automated notice generation based on predefined rules and triggers.',
    fields: ['gstin', 'noticeType', 'period', 'reason', 'priority', 'status'] 
  },
  { 
    value: 'notice-tracking', 
    label: 'Notice Tracking', 
    icon: FileText,
    description: 'Track the status and delivery of notices sent to taxpayers. This API provides real-time updates on notice processing, delivery confirmation, and response tracking.',
    fields: ['noticeId', 'gstin', 'status', 'sentDate', 'responseDate', 'actionRequired'] 
  },
  { 
    value: 'notice-response', 
    label: 'Notice Response', 
    icon: AlertTriangle,
    description: 'Process and manage responses received from taxpayers for various notices. This API handles response validation, categorization, and workflow management.',
    fields: ['noticeId', 'responseType', 'responseData', 'submittedDate', 'status', 'reviewRequired'] 
  }
];

interface HistoricalRun {
  id: string;
  status: 'success' | 'error' | 'pending' | 'running';
  startTime: string;
  endTime?: string;
  duration?: number;
  recordsProcessed?: number;
  errorMessage?: string;
  triggeredBy: 'manual' | 'scheduled' | 'system';
  nextRun?: string;
}

export function NoticeAPIs() {
  const [selectedAPI, setSelectedAPI] = useState("notice-generation");
  const [isLoadingTab, setIsLoadingTab] = useState(false);
  const { toast } = useToast();

  // Generate realistic timestamps for different APIs
  const generateHistoricalRuns = (apiType: string): HistoricalRun[] => {
    const now = new Date();
    const baseTime = now.getTime();
    
    const runs: HistoricalRun[] = [];
    
    // Generate different runs based on API type
    if (apiType === 'notice-generation') {
      runs.push(
        {
          id: "1",
          status: "success",
          startTime: new Date(baseTime - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          endTime: new Date(baseTime - 2 * 60 * 60 * 1000 + 4 * 60 * 1000).toISOString(),
          duration: 240,
          recordsProcessed: 150,
          triggeredBy: "scheduled",
          nextRun: new Date(baseTime + 22 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "2",
          status: "success",
          startTime: new Date(baseTime - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          endTime: new Date(baseTime - 6 * 60 * 60 * 1000 + 3 * 60 * 1000).toISOString(),
          duration: 180,
          recordsProcessed: 89,
          triggeredBy: "manual",
          nextRun: new Date(baseTime + 18 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "3",
          status: "error",
          startTime: new Date(baseTime - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
          endTime: new Date(baseTime - 12 * 60 * 60 * 1000 + 2 * 60 * 1000).toISOString(),
          duration: 120,
          recordsProcessed: 0,
          errorMessage: "Database connection timeout",
          triggeredBy: "scheduled",
          nextRun: new Date(baseTime + 12 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "4",
          status: "running",
          startTime: new Date(baseTime - 15 * 60 * 1000).toISOString(), // 15 minutes ago
          triggeredBy: "system"
        }
      );
    } else if (apiType === 'notice-tracking') {
      runs.push(
        {
          id: "1",
          status: "success",
          startTime: new Date(baseTime - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
          endTime: new Date(baseTime - 1 * 60 * 60 * 1000 + 2 * 60 * 1000).toISOString(),
          duration: 120,
          recordsProcessed: 75,
          triggeredBy: "scheduled",
          nextRun: new Date(baseTime + 23 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "2",
          status: "success",
          startTime: new Date(baseTime - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          endTime: new Date(baseTime - 4 * 60 * 60 * 1000 + 1.5 * 60 * 1000).toISOString(),
          duration: 90,
          recordsProcessed: 42,
          triggeredBy: "manual",
          nextRun: new Date(baseTime + 20 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "3",
          status: "error",
          startTime: new Date(baseTime - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
          endTime: new Date(baseTime - 8 * 60 * 60 * 1000 + 1 * 60 * 1000).toISOString(),
          duration: 60,
          recordsProcessed: 0,
          errorMessage: "API rate limit exceeded",
          triggeredBy: "scheduled",
          nextRun: new Date(baseTime + 16 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "4",
          status: "pending",
          startTime: new Date(baseTime - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          triggeredBy: "system"
        }
      );
    } else if (apiType === 'notice-response') {
      runs.push(
        {
          id: "1",
          status: "success",
          startTime: new Date(baseTime - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
          endTime: new Date(baseTime - 3 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
          duration: 300,
          recordsProcessed: 200,
          triggeredBy: "scheduled",
          nextRun: new Date(baseTime + 21 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "2",
          status: "success",
          startTime: new Date(baseTime - 7 * 60 * 60 * 1000).toISOString(), // 7 hours ago
          endTime: new Date(baseTime - 7 * 60 * 60 * 1000 + 2.5 * 60 * 1000).toISOString(),
          duration: 150,
          recordsProcessed: 95,
          triggeredBy: "manual",
          nextRun: new Date(baseTime + 17 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "3",
          status: "error",
          startTime: new Date(baseTime - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
          endTime: new Date(baseTime - 10 * 60 * 60 * 1000 + 1.5 * 60 * 1000).toISOString(),
          duration: 90,
          recordsProcessed: 0,
          errorMessage: "Invalid response format",
          triggeredBy: "scheduled",
          nextRun: new Date(baseTime + 14 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "4",
          status: "running",
          startTime: new Date(baseTime - 5 * 60 * 1000).toISOString(), // 5 minutes ago
          triggeredBy: "system"
        }
      );
    }
    
    return runs;
  };

  // Simulate loading on tab switch
  useEffect(() => {
    setIsLoadingTab(true);
    const timer = setTimeout(() => {
      setIsLoadingTab(false);
    }, 800); // 800ms loading simulation

    return () => clearTimeout(timer);
  }, [selectedAPI]);

  // Fetch historical runs
  const { data: historicalRuns = [], isLoading: isLoadingRuns } = useQuery({
    queryKey: ['/api/notice-historical-runs', selectedAPI],
    enabled: true
  });

  // Get historical runs data for selected API
  const mockHistoricalRuns = generateHistoricalRuns(selectedAPI);


  const getStatusBadge = (status: string) => {
    if (status === 'pending') {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    }
    
    if (status === 'running') {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
          <RefreshCw className="h-3 w-3 animate-spin" />
          Running
        </Badge>
      );
    }
    
    const config = statusBadgeConfig[status.toLowerCase() as keyof typeof statusBadgeConfig] || statusBadgeConfig.error;
    const IconComponent = status.toLowerCase() === 'success' ? CheckCircle : AlertTriangle;
    
    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };


  const selectedEndpoint = noticeApiEndpoints.find(api => api.value === selectedAPI);

  return (
    <div className="w-full space-y-8" data-testid="notice-apis">
      {/* Notice APIs Playground - Main View */}
      <Card className="modern-card animate-fade-in">
        <CardHeader className="modern-card-header">
          <CardTitle className="modern-card-title">
            Notice APIs Playground
          </CardTitle>
          <p className="modern-card-subtitle">
            Manage and track notice generation, delivery, and responses for GST compliance
          </p>
        </CardHeader>
        <CardContent>
          {/* Main API Tabs */}
          <div className="space-y-6">
            <div>
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="flex overflow-x-auto bg-muted/30">
                  {noticeApiEndpoints.map((api, index) => {
                    const IconComponent = api.icon;
                    const isLast = index === noticeApiEndpoints.length - 1;
                    return (
                      <button
                        key={api.value}
                        onClick={() => setSelectedAPI(api.value)}
                        className={`flex-shrink-0 py-3 text-sm transition-all duration-200 border-r border-border last:border-r-0 flex items-center space-x-2 min-w-0 ${
                          selectedAPI === api.value
                            ? `bg-primary text-primary-foreground border-b-2 border-primary shadow-sm font-semibold pl-4 ${isLast ? 'pr-2' : 'pr-4'}`
                            : `bg-background text-muted-foreground hover:bg-muted hover:text-foreground font-medium pl-4 ${isLast ? 'pr-2' : 'pr-4'}`
                        }`}
                        data-testid={`api-tab-${api.value}`}
                      >
                        <IconComponent className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{api.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {selectedEndpoint && (
                <div className="mt-3 flex items-start space-x-2">
                  <Bell className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedEndpoint.description}
                  </p>
                </div>
              )}
            </div>

            {/* Historical Runs */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-foreground">Historical Runs</h3>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-muted-foreground">
                    Next Run: <span className="font-medium text-foreground">2024-01-16 09:00:00</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </div>
              
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Start Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Triggered By</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingTab ? (
                      // Skeleton loader for tab switch
                      Array.from({ length: 4 }).map((_, index) => (
                        <TableRow key={`skeleton-${index}`}>
                          <TableCell>
                            <Skeleton className="h-4 w-32" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-16" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-6 w-20" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-6 w-20" />
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Skeleton className="h-8 w-8" />
                              <Skeleton className="h-8 w-8" />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      mockHistoricalRuns.map((run) => (
                        <TableRow key={run.id}>
                          <TableCell>{formatDateTime(run.startTime)}</TableCell>
                          <TableCell>
                            {run.duration ? formatDuration(run.duration) : '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {run.triggeredBy.charAt(0).toUpperCase() + run.triggeredBy.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(run.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {run.status !== 'error' && (
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                              {run.status === 'error' && (
                                <Button variant="ghost" size="sm">
                                  <AlertTriangle className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
