import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileBarChart, Search, Loader2, Clock, CheckCircle, AlertTriangle, User, Download } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { formatDateTime, statusBadgeConfig } from "@/lib/utils";
import { exportToExcel } from "@/lib/excel-export";

export function SystemLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterModule, setFilterModule] = useState("all");
  const { toast } = useToast();

  // Generate dummy system logs data
  const generateDummyLogs = () => {
    const now = new Date();
    const baseTime = now.getTime();
    
    const logTypes = [
      // QR Scan logs
      { module: 'QR Scanner', level: 'success', message: 'QR code scanned successfully', details: 'Invoice: INV-2024-001, Amount: ₹15,000', user: 'admin@company.com' },
      { module: 'QR Scanner', level: 'error', message: 'QR code scan failed', details: 'Invalid QR format or corrupted data', user: 'vendor1@example.com' },
      { module: 'QR Scanner', level: 'success', message: 'Bulk QR processing completed', details: 'Processed 25 QR codes in 2.3 seconds', user: 'admin@company.com' },
      { module: 'QR Scanner', level: 'error', message: 'QR validation failed', details: 'Invalid QR string format detected', user: 'vendor2@example.com' },
      { module: 'QR Scanner', level: 'success', message: 'QR data extraction completed', details: 'Successfully extracted invoice details', user: 'admin@company.com' },
      
      // PDF Upload logs
      { module: 'PDF Upload', level: 'success', message: 'PDF uploaded and processed', details: 'Invoice PDF: invoice_2024_001.pdf, Type: Tax Invoice', user: 'vendor1@example.com' },
      { module: 'PDF Upload', level: 'error', message: 'PDF processing failed', details: 'Corrupted PDF file or unsupported format', user: 'vendor3@example.com' },
      { module: 'PDF Upload', level: 'success', message: 'PDF data validation passed', details: 'All required fields extracted successfully', user: 'admin@company.com' },
      { module: 'PDF Upload', level: 'error', message: 'PDF text extraction failed', details: 'OCR processing failed for scanned document', user: 'vendor2@example.com' },
      { module: 'PDF Upload', level: 'success', message: 'PDF invoice data extracted', details: 'Successfully extracted GST details from PDF', user: 'vendor1@example.com' },
      
      // EGAM Sync logs
      { module: 'EGAM Sync', level: 'success', message: 'EGAM data sync completed', details: 'Synced 150 records from KIGS API', user: 'system@company.com' },
      { module: 'EGAM Sync', level: 'error', message: 'EGAM sync failed', details: 'Connection timeout to KIGS API', user: 'system@company.com' },
      { module: 'EGAM Sync', level: 'success', message: 'Manual EGAM pull completed', details: 'User initiated pull: 89 records processed', user: 'admin@company.com' },
      { module: 'EGAM Sync', level: 'error', message: 'EGAM data validation failed', details: 'Invalid data format received from KIGS', user: 'system@company.com' },
      { module: 'EGAM Sync', level: 'success', message: 'EGAM repository updated', details: 'Added 25 new invoice records', user: 'system@company.com' },
      
      // Validation API logs
      { module: 'Validation API', level: 'success', message: 'Taxpayer validation completed', details: 'GSTIN: 27ABCDE1234F1Z5 validated successfully', user: 'vendor1@example.com' },
      { module: 'Validation API', level: 'error', message: 'Validation API failed', details: 'Invalid GSTIN format provided', user: 'vendor2@example.com' },
      { module: 'Validation API', level: 'success', message: 'Bulk validation completed', details: 'Validated 50 GSTINs in 3.2 seconds', user: 'admin@company.com' },
      { module: 'Validation API', level: 'error', message: 'API request failed', details: 'Network timeout during validation request', user: 'vendor3@example.com' },
      { module: 'Validation API', level: 'success', message: 'API response processed', details: 'Response time: 245ms, Status: 200', user: 'admin@company.com' },
      
      // Notice API logs
      { module: 'Notice API', level: 'success', message: 'Notice generation completed', details: 'Generated 12 notices for compliance period', user: 'system@company.com' },
      { module: 'Notice API', level: 'error', message: 'Notice generation failed', details: 'Database connection error during notice creation', user: 'system@company.com' },
      { module: 'Notice API', level: 'success', message: 'Notice response processed', details: 'Received 5 responses from taxpayers', user: 'admin@company.com' },
      { module: 'Notice API', level: 'error', message: 'Notice delivery failed', details: 'Email service temporarily unavailable', user: 'system@company.com' },
      { module: 'Notice API', level: 'success', message: 'Notice tracking updated', details: '3 notices delivered, 2 pending', user: 'system@company.com' }
    ];
    
    return logTypes.map((log, index) => ({
      id: `log-${index + 1}`,
      timestamp: new Date(baseTime - (index * 15 * 60 * 1000) - (Math.random() * 10 * 60 * 1000)).toISOString(),
      module: log.module,
      level: log.level,
      message: log.message,
      details: log.details,
      user: log.user
    }));
  };

  // Use dummy data instead of API call
  const systemLogs = generateDummyLogs();
  const isLoading = false;

  // Filter logs based on search term, level, and module
  const filteredLogs = systemLogs.filter((log: any) => {
    const matchesSearch = searchTerm === "" || (
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    const matchesLevel = filterLevel === "all" || log.level.toLowerCase() === filterLevel.toLowerCase();
    const matchesModule = filterModule === "all" || log.module === filterModule;
    
    return matchesSearch && matchesLevel && matchesModule;
  });

  // Get unique modules for filter dropdown
  const uniqueModules = Array.from(new Set(systemLogs.map((log: any) => log.module))).sort();

  // Export logs to Excel
  const handleExportLogs = () => {
    const exportData = filteredLogs.map((log: any) => ({
      'Timestamp': formatDateTime(log.timestamp),
      'Level': log.level.charAt(0).toUpperCase() + log.level.slice(1),
      'Module': log.module,
      'User': log.user,
      'Message': log.message,
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
                      <TableHead className="font-semibold text-foreground">User</TableHead>
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
                          <TableCell className="font-medium text-foreground py-4">{log.module}</TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-muted-foreground mr-2" />
                              <span className="text-foreground">{log.user}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-foreground py-4">{log.message}</TableCell>
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
