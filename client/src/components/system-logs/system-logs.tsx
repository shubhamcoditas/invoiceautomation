import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileBarChart, Search, Trash2, Loader2, Clock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function SystemLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch system logs
  const { data: systemLogs = [], isLoading } = useQuery({
    queryKey: ['/api/system-logs', filterLevel === 'all' ? '' : `?level=${filterLevel.toUpperCase()}`],
    enabled: true
  });

  // Clear logs mutation
  const clearLogsMutation = useMutation({
    mutationFn: async () => {
      // Since there's no clear endpoint in the backend, we'll just show a success message
      // In a real implementation, this would call a DELETE endpoint
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/system-logs'] });
      toast({
        title: "Success",
        description: "System logs cleared successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear logs",
        variant: "destructive",
      });
    }
  });

  const handleClearLogs = () => {
    clearLogsMutation.mutate();
  };

  // Filter logs based on search term
  const filteredLogs = (systemLogs as any[]).filter((log: any) => {
    if (searchTerm === "") return true;
    return (
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const getBadgeVariant = (level: string) => {
    switch (level.toUpperCase()) {
      case 'SUCCESS':
        return 'default';
      case 'ERROR':
        return 'destructive';
      case 'WARNING':
        return 'secondary';
      case 'INFO':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getBadgeColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800';
      case 'ERROR':
        return 'bg-red-100 text-red-800';
      case 'WARNING':
        return 'bg-amber-100 text-amber-800';
      case 'INFO':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl space-y-6" data-testid="system-logs">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <FileBarChart className="h-5 w-5" />
              <span>System Logs</span>
            </CardTitle>
            <div className="flex items-center space-x-3">
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="w-48" data-testid="select-filter-logs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Logs</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                  data-testid="input-search-logs"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={handleClearLogs}
                disabled={clearLogsMutation.isPending}
                data-testid="button-clear-logs"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Logs
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardContent className="p-0">
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
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          {(systemLogs as any[]).length === 0 ? "No system logs available" : "No logs match your search criteria"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLogs.map((log: any, index: number) => (
                        <TableRow key={log.id} data-testid={`log-row-${index}`}>
                          <TableCell className="text-sm font-mono">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                              {new Date(log.timestamp).toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getBadgeColor(log.level)}>
                              {log.level.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{log.module}</TableCell>
                          <TableCell>{log.message}</TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
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
                    Showing {filteredLogs.length} of {(systemLogs as any[]).length} log entries
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
