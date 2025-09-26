import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/hooks/use-app-state";
import { Database, RefreshCw, Search, Loader2, Clock, CheckCircle, XCircle, AlertCircle, AlertTriangle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { formatDateTime, statusBadgeConfig } from "@/lib/utils";

export function EGAMRepository() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [fetchProgress, setFetchProgress] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const { state, dispatch } = useAppState();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch EGAM audit logs
  const { data: auditLogs = [], isLoading: auditLogsLoading } = useQuery({
    queryKey: ['/api/egam-audit-logs'],
    enabled: true
  });

  // Fetch next scheduled pull
  const { data: nextPullData } = useQuery({
    queryKey: ['/api/egam-next-pull'],
    enabled: true
  });

  // Fetch EGAM data from KIGS mutation
  const fetchEGAMDataMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/egam-data/fetch', { pullType: 'manual' });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/egam-audit-logs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/egam-next-pull'] });
      setIsFetching(false);
      setFetchProgress(0);
      toast({
        title: "Success",
        description: `EGAM data fetched successfully! ${data.count} records updated.`,
      });
    },
    onError: () => {
      setIsFetching(false);
      setFetchProgress(0);
      toast({
        title: "Error",
        description: "Failed to fetch EGAM data",
        variant: "destructive",
      });
    }
  });

  const handleFetchEGAMData = () => {
    setIsFetching(true);
    setFetchProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setFetchProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          fetchEGAMDataMutation.mutate();
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);
  };

  // Filter audit logs based on search and status
  const filteredAuditLogs = (auditLogs as any[]).filter((log: any) => {
    const matchesSearch = searchTerm === "" || 
      log.pullType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.status.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" ||
      (filterStatus === "success" && log.status === "success") ||
      (filterStatus === "error" && log.status === "error") ||
      (filterStatus === "in_progress" && log.status === "in_progress");
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'in_progress':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'in_progress') {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          In Progress
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

  const formatDuration = (startedAt: string, completedAt: string | null) => {
    if (!completedAt) return 'In progress...';
    const start = new Date(startedAt);
    const end = new Date(completedAt);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    return `${diffMins}m ${diffSecs}s`;
  };

  return (
    <div className="w-full" data-testid="egam-repository">
      {/* Combined Container */}
      <Card className="modern-card animate-fade-in">
        <CardHeader className="modern-card-header">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="modern-card-title">
                EGAM Repository
              </CardTitle>
              <p className="modern-card-subtitle">
                Historical audit data of EGAM data pulls from KIGS
              </p>
            </div>
            <Button 
              onClick={handleFetchEGAMData} 
              disabled={isFetching}
              data-testid="button-fetch-egam"
              className="bg-gradient-to-r from-[#00338D] to-[#4A90E2] hover:from-[#001F5C] hover:to-[#00338D] text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFetching ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Manual Pull from KIGS
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Next Scheduled Pull */}
          {nextPullData?.nextScheduledAt && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Clock className="mr-3 h-4 w-4 text-blue-500" />
                <span className="text-blue-700">
                  Next pull scheduled: {formatDateTime(nextPullData.nextScheduledAt)}
                </span>
              </div>
            </div>
          )}
          
          {/* Fetch Progress */}
          {isFetching && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Loader2 className="mr-3 h-4 w-4 animate-spin text-blue-500" />
                <span className="text-blue-700">Fetching EGAM data from KIGS...</span>
              </div>
              <Progress value={fetchProgress} className="w-full" />
            </div>
          )}

          {/* Pull History Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-foreground">Pull History</h3>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search pull type, status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 h-10 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    data-testid="input-search-egam"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48 h-10 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" data-testid="select-filter-egam">
                    <SelectValue />
                  </SelectTrigger>
            <SelectContent className="bg-white border-2 border-gray-300 shadow-2xl rounded-lg z-[100] p-2">
              <SelectItem value="all" className="p-3 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer font-medium rounded-md transition-colors duration-150 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">All Pulls</SelectItem>
              <SelectItem value="success" className="p-3 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer font-medium rounded-md transition-colors duration-150 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">Successful</SelectItem>
              <SelectItem value="error" className="p-3 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer font-medium rounded-md transition-colors duration-150 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">Failed</SelectItem>
              <SelectItem value="in_progress" className="p-3 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer font-medium rounded-md transition-colors duration-150 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">In Progress</SelectItem>
            </SelectContent>
                </Select>
              </div>
            </div>

            {auditLogsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading audit logs...</span>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Records Count</TableHead>
                        <TableHead>Started At</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Error Message</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAuditLogs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No audit logs found. Click "Manual Pull from KIGS" to start.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAuditLogs.map((log: any, index: number) => (
                          <TableRow key={log.id} data-testid={`audit-log-row-${index}`}>
                            <TableCell>
                              <Badge variant={log.pullType === 'manual' ? 'outline' : 'secondary'}>
                                {log.pullType === 'manual' ? 'Manual' : 'Scheduled'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(log.status)}
                                {getStatusBadge(log.status)}
                              </div>
                            </TableCell>
                            <TableCell>
                              {log.recordsCount ? `${log.recordsCount} records` : '-'}
                            </TableCell>
                            <TableCell>
                              {formatDateTime(log.startedAt)}
                            </TableCell>
                            <TableCell>
                              {formatDuration(log.startedAt, log.completedAt)}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {log.errorMessage || '-'}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Pagination */}
                {filteredAuditLogs.length > 0 && (
                  <div className="flex justify-between items-center mt-6">
                    <p className="text-muted-foreground text-sm">
                      Showing {filteredAuditLogs.length} of {(auditLogs as any[]).length} entries
                    </p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" disabled>Previous</Button>
                      <Button variant="default" size="sm">1</Button>
                      <Button variant="outline" size="sm" disabled>Next</Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
