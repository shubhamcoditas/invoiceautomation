import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";
import { Download, TrendingUp, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceLevelCost {
  serviceId: string;
  serviceName: string;
  serviceCode: string;
  uom: string;
  year: number;
  directCosts: number;
  depreciation: number;
  indirectCosts: number;
  commonCosts: number;
  totalCost: number;
  costPerUnit: number;
}

export function ServiceLevelCost() {
  const { toast } = useToast();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Fetch service level costs (no year filter)
  const { data: serviceCosts = [], isLoading, error } = useQuery<ServiceLevelCost[]>({
    queryKey: ["service-level-costs"],
    queryFn: async () => {
      const response = await fetch(`/api/service-level-costs`);
      if (!response.ok) {
        let errorMessage = "Failed to fetch service level costs";
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      // Ensure we always return an array
      return Array.isArray(data) ? data : [];
    },
    retry: 1,
  });

  const handleExport = () => {
    // Create CSV content
    const headers = [
      "Service Code",
      "Service Name",
      "UOM",
      "Direct Costs",
      "Depreciation",
      "Indirect Costs",
      "Common Costs",
      "Total Cost",
      "Cost Per Unit"
    ];
    
    const rows = serviceCosts.map(cost => [
      cost.serviceCode,
      cost.serviceName,
      cost.uom || "-",
      cost.directCosts.toFixed(2),
      cost.depreciation.toFixed(2),
      cost.indirectCosts.toFixed(2),
      cost.commonCosts.toFixed(2),
      cost.totalCost.toFixed(2),
      cost.costPerUnit.toFixed(2)
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `service-level-costs.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Success",
      description: "Service level costs exported successfully",
    });
  };

  const totalDirectCosts = serviceCosts.reduce((sum, cost) => sum + cost.directCosts, 0);
  const totalDepreciation = serviceCosts.reduce((sum, cost) => sum + cost.depreciation, 0);
  const totalIndirectCosts = serviceCosts.reduce((sum, cost) => sum + cost.indirectCosts, 0);
  const totalCommonCosts = serviceCosts.reduce((sum, cost) => sum + cost.commonCosts, 0);
  const grandTotal = serviceCosts.reduce((sum, cost) => sum + cost.totalCost, 0);

  const toggleRow = (serviceId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(serviceId)) {
      newExpanded.delete(serviceId);
    } else {
      newExpanded.add(serviceId);
    }
    setExpandedRows(newExpanded);
  };

  const getPercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return (value / total) * 100;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <CardTitle>Service Level Cost</CardTitle>
            </div>
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 font-semibold mb-2">Error loading service costs</div>
              <div className="text-sm text-gray-500">{error instanceof Error ? error.message : 'Unknown error occurred'}</div>
            </div>
          ) : serviceCosts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">No services found.</p>
              <p className="text-sm">Please create services in Service Management first.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                Showing costs for all {serviceCosts.length} service{serviceCosts.length !== 1 ? 's' : ''} from Service Management
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8"></TableHead>
                    <TableHead>Service Code</TableHead>
                    <TableHead>Service Name</TableHead>
                    <TableHead>UOM</TableHead>
                    <TableHead className="text-right">Direct Costs</TableHead>
                    <TableHead className="text-right">Depreciation</TableHead>
                    <TableHead className="text-right">Indirect Costs</TableHead>
                    <TableHead className="text-right">Common Costs</TableHead>
                    <TableHead className="text-right font-semibold">Total Cost</TableHead>
                    <TableHead className="text-right font-semibold">Cost Per Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceCosts.map((cost) => {
                    const isExpanded = expandedRows.has(cost.serviceId);
                    const directPct = getPercentage(cost.directCosts, cost.totalCost);
                    const depPct = getPercentage(cost.depreciation, cost.totalCost);
                    const indirectPct = getPercentage(cost.indirectCosts, cost.totalCost);
                    const commonPct = getPercentage(cost.commonCosts, cost.totalCost);
                    
                    return (
                      <>
                        <TableRow 
                          key={cost.serviceId}
                          className={cost.totalCost === 0 ? "opacity-60" : "cursor-pointer hover:bg-muted/50"}
                          onClick={() => toggleRow(cost.serviceId)}
                        >
                          <TableCell className="w-8">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs text-muted-foreground font-normal">
                              {cost.serviceCode}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{cost.serviceName}</TableCell>
                          <TableCell>{cost.uom || "-"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-col items-end">
                              <span>{formatCurrency(cost.directCosts)}</span>
                              {cost.totalCost > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  {directPct.toFixed(1)}%
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-col items-end">
                              <span>{formatCurrency(cost.depreciation)}</span>
                              {cost.totalCost > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  {depPct.toFixed(1)}%
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-col items-end">
                              <span>{formatCurrency(cost.indirectCosts)}</span>
                              {cost.totalCost > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  {indirectPct.toFixed(1)}%
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-col items-end">
                              <span>{formatCurrency(cost.commonCosts)}</span>
                              {cost.totalCost > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  {commonPct.toFixed(1)}%
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-base">
                            {formatCurrency(cost.totalCost)}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-base text-blue-600">
                            {formatCurrency(cost.costPerUnit)}
                          </TableCell>
                        </TableRow>
                        {isExpanded && (
                          <TableRow key={`${cost.serviceId}-details`} className="bg-muted/30">
                            <TableCell colSpan={10} className="p-4">
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="space-y-1">
                                    <div className="text-sm font-medium text-muted-foreground">Direct Costs</div>
                                    <div className="text-lg font-semibold">{formatCurrency(cost.directCosts)}</div>
                                    {cost.totalCost > 0 && (
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                          className="bg-blue-600 h-2 rounded-full" 
                                          style={{ width: `${directPct}%` }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <div className="space-y-1">
                                    <div className="text-sm font-medium text-muted-foreground">Depreciation</div>
                                    <div className="text-lg font-semibold">{formatCurrency(cost.depreciation)}</div>
                                    {cost.totalCost > 0 && (
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                          className="bg-green-600 h-2 rounded-full" 
                                          style={{ width: `${depPct}%` }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <div className="space-y-1">
                                    <div className="text-sm font-medium text-muted-foreground">Indirect Costs</div>
                                    <div className="text-lg font-semibold">{formatCurrency(cost.indirectCosts)}</div>
                                    {cost.totalCost > 0 && (
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                          className="bg-yellow-600 h-2 rounded-full" 
                                          style={{ width: `${indirectPct}%` }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <div className="space-y-1">
                                    <div className="text-sm font-medium text-muted-foreground">Common Costs</div>
                                    <div className="text-lg font-semibold">{formatCurrency(cost.commonCosts)}</div>
                                    {cost.totalCost > 0 && (
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                          className="bg-purple-600 h-2 rounded-full" 
                                          style={{ width: `${commonPct}%` }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="pt-2 border-t">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="text-sm font-medium text-muted-foreground">Total Cost</div>
                                      <div className="text-2xl font-bold">{formatCurrency(cost.totalCost)}</div>
                                    </div>
                                    {cost.uom && parseFloat(cost.uom) > 0 && (
                                      <div className="text-right">
                                        <div className="text-sm font-medium text-muted-foreground">Cost Per Unit</div>
                                        <div className="text-2xl font-bold text-blue-600">{formatCurrency(cost.costPerUnit)}</div>
                                        <div className="text-xs text-muted-foreground mt-1">UOM: {cost.uom}</div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    );
                  })}
                  <TableRow className="bg-muted/50 font-semibold">
                    <TableCell colSpan={4} className="font-semibold">
                      Grand Total
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span>{formatCurrency(totalDirectCosts)}</span>
                        {grandTotal > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {getPercentage(totalDirectCosts, grandTotal).toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span>{formatCurrency(totalDepreciation)}</span>
                        {grandTotal > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {getPercentage(totalDepreciation, grandTotal).toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span>{formatCurrency(totalIndirectCosts)}</span>
                        {grandTotal > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {getPercentage(totalIndirectCosts, grandTotal).toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span>{formatCurrency(totalCommonCosts)}</span>
                        {grandTotal > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {getPercentage(totalCommonCosts, grandTotal).toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-lg font-bold">{formatCurrency(grandTotal)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

