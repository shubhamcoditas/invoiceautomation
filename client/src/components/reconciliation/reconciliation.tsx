import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/hooks/use-app-state";
import { Scale, FolderSync, Send, CheckCircle, XCircle, AlertTriangle, Percent } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { exportReconciliationToExcel } from "@/lib/excel-export";

interface ReconciliationSummary {
  matched: number;
  mismatched: number;
  missing: number;
  total: number;
}

export function Reconciliation() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [reconciliationData, setReconciliationData] = useState<any[]>([]);
  const [summary, setSummary] = useState<ReconciliationSummary>({ matched: 0, mismatched: 0, missing: 0, total: 0 });
  const { state } = useAppState();
  const { toast } = useToast();

  // Run reconciliation mutation
  const reconciliationMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/reconciliation/run');
      return response.json();
    },
    onSuccess: (data) => {
      setReconciliationData(data.results);
      setSummary(data.summary);
      toast({
        title: "Reconciliation Completed",
        description: `Found ${data.summary.mismatched} mismatches and ${data.summary.missing} missing entries.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Reconciliation failed",
        variant: "destructive",
      });
    }
  });

  // Push to KIGS mutation
  const pushToKIGSMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/kigs/push');
      return response.json();
    },
    onSuccess: (data) => {
      if (data.status === 'success') {
        toast({
          title: "Success",
          description: `Data successfully pushed to KIGS! EWB Number: ${data.ewbNumber}`,
        });
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to push data to KIGS",
        variant: "destructive",
      });
    }
  });

  const handleRunReconciliation = () => {
    reconciliationMutation.mutate();
  };

  const handlePushToKIGS = () => {
    pushToKIGSMutation.mutate();
  };

  // Filter reconciliation data
  const filteredData = reconciliationData.filter(item => {
    if (filterStatus === "all") return true;
    return item.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'matched':
        return <Badge className="bg-green-100 text-green-800">Matched</Badge>;
      case 'mismatched':
        return <Badge variant="destructive">Mismatched</Badge>;
      case 'missing':
        return <Badge className="bg-amber-100 text-amber-800">Missing</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRowClassName = (status: string) => {
    switch (status) {
      case 'matched':
        return 'bg-green-50 hover:bg-green-100';
      case 'mismatched':
        return 'bg-red-50 hover:bg-red-100';
      case 'missing':
        return 'bg-amber-50 hover:bg-amber-100';
      default:
        return '';
    }
  };

  const matchRate = summary.total > 0 ? Math.round((summary.matched / summary.total) * 100) : 0;

  return (
    <div className="max-w-6xl space-y-6" data-testid="reconciliation">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Scale className="h-5 w-5" />
                <span>Data Reconciliation</span>
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Compare extracted data with EGAM repository
              </p>
            </div>
            <div className="flex space-x-3">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48" data-testid="select-filter-reconciliation">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Records</SelectItem>
                  <SelectItem value="matched">Matched Only</SelectItem>
                  <SelectItem value="mismatched">Mismatched Only</SelectItem>
                  <SelectItem value="missing">Missing Only</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleRunReconciliation}
                disabled={reconciliationMutation.isPending}
                data-testid="button-run-reconciliation"
              >
                <FolderSync className="mr-2 h-4 w-4" />
                Run Reconciliation
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Summary Cards */}
        {summary.total > 0 && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <div>
                    <p className="text-sm text-green-600">Matched</p>
                    <p className="text-xl font-bold text-green-700">{summary.matched}</p>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  <div>
                    <p className="text-sm text-red-600">Mismatched</p>
                    <p className="text-xl font-bold text-red-700">{summary.mismatched}</p>
                  </div>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                  <div>
                    <p className="text-sm text-amber-600">Missing</p>
                    <p className="text-xl font-bold text-amber-700">{summary.missing}</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Percent className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-blue-600">Match Rate</p>
                    <p className="text-xl font-bold text-blue-700">{matchRate}%</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Reconciliation Results */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Reconciliation Results</CardTitle>
            <Button 
              onClick={handlePushToKIGS}
              disabled={pushToKIGSMutation.isPending || reconciliationData.length === 0}
              className="bg-green-600 hover:bg-green-700"
              data-testid="button-push-kigs"
            >
              <Send className="mr-2 h-4 w-4" />
              Push to KIGS
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {reconciliationData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No reconciliation data available. Click "Run Reconciliation" to start the process.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>IRN</TableHead>
                    <TableHead>Invoice No</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>EGAM Amount</TableHead>
                    <TableHead>Extracted Amount</TableHead>
                    <TableHead>Difference</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item, index) => (
                    <TableRow 
                      key={index} 
                      className={getRowClassName(item.status)}
                      data-testid={`reconciliation-row-${index}`}
                    >
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="font-mono text-sm">{item.irn}</TableCell>
                      <TableCell>{item.invoiceNo}</TableCell>
                      <TableCell>{item.source}</TableCell>
                      <TableCell>{item.egamAmount || '-'}</TableCell>
                      <TableCell>{item.extractedAmount}</TableCell>
                      <TableCell className={item.status === 'mismatched' ? 'text-red-600' : ''}>
                        {item.difference || '-'}
                      </TableCell>
                      <TableCell>
                        {item.status === 'matched' && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Approve
                          </Button>
                        )}
                        {item.status === 'mismatched' && (
                          <Button size="sm" variant="outline" className="border-amber-600 text-amber-600">
                            Review
                          </Button>
                        )}
                        {item.status === 'missing' && (
                          <span className="text-xs text-red-600">No Data Found</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
