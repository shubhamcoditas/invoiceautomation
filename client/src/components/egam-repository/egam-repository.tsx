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
import { Database, Download, Search, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function EGAMRepository() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [fetchProgress, setFetchProgress] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const { state, dispatch } = useAppState();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch EGAM data
  const { data: egamData = [], isLoading } = useQuery({
    queryKey: ['/api/egam-data'],
    enabled: true
  });

  // Fetch EGAM data from KIGS mutation
  const fetchEGAMDataMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/egam-data/fetch');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/egam-data'] });
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

  // Filter data based on search and status
  const filteredData = (egamData as any[]).filter((item: any) => {
    const matchesSearch = searchTerm === "" || 
      item.irn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" ||
      (filterStatus === "recent" && new Date(item.fetchedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)) ||
      (filterStatus === "pending" && item.status === "pending");
    
    return matchesSearch && matchesStatus;
  });

  const lastFetchTime = (egamData as any[]).length > 0 ? 
    new Date(Math.max(...(egamData as any[]).map((item: any) => new Date(item.fetchedAt).getTime()))) : 
    null;

  return (
    <div className="max-w-6xl space-y-6" data-testid="egam-repository">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>EGAM Repository</span>
              </CardTitle>
              {lastFetchTime && (
                <p className="text-muted-foreground mt-1">
                  Last fetched: {lastFetchTime.toLocaleString()}
                </p>
              )}
            </div>
            <Button 
              onClick={handleFetchEGAMData} 
              disabled={isFetching}
              data-testid="button-fetch-egam"
            >
              {isFetching ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Fetch EGAM Data from KIGS
            </Button>
          </div>
        </CardHeader>
        
        {/* Fetch Progress */}
        {isFetching && (
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Loader2 className="mr-3 h-4 w-4 animate-spin text-blue-500" />
                <span className="text-blue-700">Fetching EGAM data from KIGS...</span>
              </div>
              <Progress value={fetchProgress} className="w-full" />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Repository Data */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Repository Data</CardTitle>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search IRN, Invoice No..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                  data-testid="input-search-egam"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48" data-testid="select-filter-egam">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Records</SelectItem>
                  <SelectItem value="recent">Recent (24h)</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading EGAM data...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>IRN</TableHead>
                      <TableHead>Invoice No</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Vendor GSTIN</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No EGAM data found. Click "Fetch EGAM Data from KIGS" to load data.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((item: any, index: number) => (
                        <TableRow key={item.id} data-testid={`egam-row-${index}`}>
                          <TableCell className="font-mono text-sm">{item.irn}</TableCell>
                          <TableCell>{item.invoiceNo}</TableCell>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>{item.vendorGstin}</TableCell>
                          <TableCell>{item.amount}</TableCell>
                          <TableCell>
                            <Badge variant={item.status === 'processed' ? 'default' : 'secondary'}>
                              {item.status === 'processed' ? 'Processed' : 'Pending'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              {filteredData.length > 0 && (
                <div className="flex justify-between items-center mt-6">
                  <p className="text-muted-foreground text-sm">
                    Showing {filteredData.length} of {(egamData as any[]).length} entries
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
        </CardContent>
      </Card>
    </div>
  );
}
