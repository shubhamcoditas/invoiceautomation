import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileBarChart, Search, Loader2, Clock, CheckCircle, AlertTriangle, User, Download, Hash, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { formatDateTime, statusBadgeConfig } from "@/lib/utils";
import { exportToExcel } from "@/lib/excel-export";

export function SystemLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [requestIdFilter, setRequestIdFilter] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterModule, setFilterModule] = useState("all");
  const { toast } = useToast();

  // Fetch system logs from API
  const { data: systemLogs = [], isLoading } = useQuery({
    queryKey: ['system-logs', filterLevel, requestIdFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterLevel !== 'all') {
        params.append('level', filterLevel);
      }
      if (requestIdFilter) {
        params.append('requestId', requestIdFilter);
      }
      const url = `/api/system-logs${params.toString() ? `?${params.toString()}` : ''}`;
      return apiRequest<Array<{
        id: string;
        timestamp: string;
        level: string;
        module: string;
        message: string;
        details?: string | null;
        requestId?: string | null;
      }>>(url);
    },
  });

  // Filter logs based on search term and module (level and requestId are handled by API)
  const filteredLogs = useMemo(() => {
    return systemLogs.filter((log: any) => {
      const matchesSearch = searchTerm === "" || (
        log.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.module?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.requestId && log.requestId.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      const matchesModule = filterModule === "all" || log.module === filterModule;
      
      return matchesSearch && matchesModule;
    });
  }, [systemLogs, searchTerm, filterModule]);

  // Get unique modules for filter dropdown
  const uniqueModules = useMemo(() => {
    return Array.from(new Set(systemLogs.map((log: any) => log.module).filter(Boolean))).sort();
  }, [systemLogs]);

  // Export logs to Excel
  const handleExportLogs = () => {
    const exportData = filteredLogs.map((log: any) => ({
      'Timestamp': formatDateTime(log.timestamp),
      'Level': log.level?.charAt(0).toUpperCase() + log.level?.slice(1) || '-',
      'Module': log.module || '-',
      'Request ID': log.requestId || '-',
      'Message': log.message || '-',
      'Details': log.details || '-'
    }));

    const fileName = `system_logs_${new Date().toISOString().split('T')[0]}`;
    const success = exportToExcel(exportData, fileName);
    
    if (success) {
      toast({
        title: "Export Successful",
        description: `System logs exported successfully! ${filteredLogs.length} records exported.`,
      });
    } else {
      toast({
        title: "Export Failed",
        description: "Failed to export system logs",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (level: string) => {
    const config = statusBadgeConfig[level.toLowerCase() as keyof typeof statusBadgeConfig] || statusBadgeConfig.error;
    const IconComponent = level.toLowerCase() === 'success' ? CheckCircle : AlertTriangle;
    
    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };


  return (
    <div className="w-full" data-testid="system-logs">
      {/* Combined Container */}
      <Card className="modern-card animate-fade-in">
        <CardHeader className="modern-card-header">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="modern-card-title">
                System Logs
              </CardTitle>
              <p className="modern-card-subtitle">
                Monitor and manage system activity logs
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="w-32 h-10 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" data-testid="select-filter-level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-300 shadow-2xl rounded-lg z-[100] p-2">
                  <SelectItem value="all" className="p-3 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer font-medium rounded-md transition-colors duration-150 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">All Levels</SelectItem>
                  <SelectItem value="success" className="p-3 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer font-medium rounded-md transition-colors duration-150 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">Success</SelectItem>
                  <SelectItem value="error" className="p-3 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer font-medium rounded-md transition-colors duration-150 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">Error</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterModule} onValueChange={setFilterModule}>
                <SelectTrigger className="w-40 h-10 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" data-testid="select-filter-module">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-300 shadow-2xl rounded-lg z-[100] p-2">
                  <SelectItem value="all" className="p-3 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer font-medium rounded-md transition-colors duration-150 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">All Modules</SelectItem>
                  {uniqueModules.map((module) => (
                    <SelectItem key={module} value={module} className="p-3 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer font-medium rounded-md transition-colors duration-150 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">{module}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter by Request ID..."
                  value={requestIdFilter}
                  onChange={(e) => setRequestIdFilter(e.target.value)}
                  className="w-48 h-10 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-mono text-sm"
                  data-testid="input-filter-request-id"
                />
                {requestIdFilter && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRequestIdFilter("")}
                    className="h-10 w-10 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 h-10 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  data-testid="input-search-logs"
                />
              </div>
              <Button 
                onClick={handleExportLogs}
                className="bg-gradient-to-r from-[#00338D] to-[#4A90E2] hover:from-[#001F5C] hover:to-[#00338D] text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={filteredLogs.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Logs
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Logs Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading system logs...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border/50">
                      <TableHead className="font-semibold text-foreground">Timestamp</TableHead>
                      <TableHead className="font-semibold text-foreground">Level</TableHead>
                      <TableHead className="font-semibold text-foreground">Module</TableHead>
                      <TableHead className="font-semibold text-foreground">Request ID</TableHead>
                      <TableHead className="font-semibold text-foreground">Message</TableHead>
                      <TableHead className="font-semibold text-foreground">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          {systemLogs.length === 0 ? "No system logs available" : "No logs match your search criteria"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLogs.map((log: any, index: number) => (
                        <TableRow key={log.id} data-testid={`log-row-${index}`} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-blue-900/10 dark:hover:to-indigo-900/10 transition-all duration-200">
                          <TableCell className="text-sm py-4">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-foreground font-mono">{formatDateTime(log.timestamp)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            {getStatusBadge(log.level)}
                          </TableCell>
                          <TableCell className="font-medium text-foreground py-4">{log.module || '-'}</TableCell>
                          <TableCell className="py-4">
                            {log.requestId ? (
                              <div className="flex items-center">
                                <Hash className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span 
                                  className="text-foreground font-mono text-xs cursor-pointer hover:text-blue-600 hover:underline"
                                  onClick={() => {
                                    setRequestIdFilter(log.requestId || '');
                                    toast({
                                      title: "Request ID Filter Applied",
                                      description: `Filtering logs for Request ID: ${log.requestId}`,
                                    });
                                  }}
                                  title="Click to filter by this Request ID"
                                >
                                  {log.requestId.substring(0, 8)}...
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-xs">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-foreground py-4">{log.message || '-'}</TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-xs truncate py-4">
                            {log.details || '-'}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              {filteredLogs.length > 0 && (
                <div className="flex justify-between items-center p-6 border-t border-border">
                  <p className="text-muted-foreground text-sm">
                    Showing {filteredLogs.length} of {systemLogs.length} log entries
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="default" size="sm">
                      1
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
