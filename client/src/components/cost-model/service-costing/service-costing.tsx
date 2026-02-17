import { useState, useMemo, Fragment } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";
import { Download, Calculator, ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceCostDetail } from "./service-cost-detail";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ServiceCost {
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

interface Service {
  id: string;
  serviceGroupId: string;
  serviceId: string;
  name: string;
}

interface ServiceGroup {
  id: string;
  groupId: string;
  name: string;
  verticalId: string;
}

export function ServiceCosting() {
  const { toast } = useToast();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();

  // Fetch service costs
  const { data: serviceCosts = [], isLoading: isLoadingCosts, error } = useQuery<ServiceCost[]>({
    queryKey: ["service-level-costs", currentYear],
    queryFn: async () => {
      const response = await fetch(`/api/service-level-costs`);
      if (!response.ok) {
        let errorMessage = "Failed to fetch service costs";
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    retry: 1,
  });

  // Fetch services to get service group mapping
  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await fetch("/api/services");
      if (!response.ok) return [];
      return response.json();
    },
  });

  // Fetch service groups
  const { data: serviceGroups = [] } = useQuery<ServiceGroup[]>({
    queryKey: ["service-groups"],
    queryFn: async () => {
      const response = await fetch("/api/service-groups");
      if (!response.ok) return [];
      return response.json();
    },
  });

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

  // Get service group for a service
  const getServiceGroupForService = (serviceId: string): ServiceGroup | null => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return null;
    const serviceGroup = serviceGroups.find(sg => sg.id === service.serviceGroupId);
    return serviceGroup || null;
  };

  // Group service costs by service group
  const groupedServiceCosts = useMemo(() => {
    const groups = new Map<string, { group: ServiceGroup | null; costs: ServiceCost[] }>();
    
    // Add "Ungrouped" for services without a group
    groups.set("ungrouped", { group: null, costs: [] });

    serviceCosts.forEach(cost => {
      const serviceGroup = getServiceGroupForService(cost.serviceId);
      if (serviceGroup) {
        const groupId = serviceGroup.id;
        if (!groups.has(groupId)) {
          groups.set(groupId, { group: serviceGroup, costs: [] });
        }
        groups.get(groupId)!.costs.push(cost);
      } else {
        groups.get("ungrouped")!.costs.push(cost);
      }
    });

    // Convert to array and sort by group name
    const result = Array.from(groups.entries())
      .map(([id, data]) => ({ id, ...data }))
      .filter(item => item.costs.length > 0)
      .sort((a, b) => {
        if (!a.group) return 1;
        if (!b.group) return -1;
        return a.group.name.localeCompare(b.group.name);
      });

    return result;
  }, [serviceCosts, services, serviceGroups]);

  const isLoading = isLoadingCosts;

  const handleExport = () => {
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

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `service-costing-${currentYear}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Success",
      description: "Service costing data exported successfully",
    });
  };

  const totalDirectCosts = serviceCosts.reduce((sum, cost) => sum + cost.directCosts, 0);
  const totalDepreciation = serviceCosts.reduce((sum, cost) => sum + cost.depreciation, 0);
  const totalIndirectCosts = serviceCosts.reduce((sum, cost) => sum + cost.indirectCosts, 0);
  const totalCommonCosts = serviceCosts.reduce((sum, cost) => sum + cost.commonCosts, 0);
  const grandTotal = serviceCosts.reduce((sum, cost) => sum + cost.totalCost, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              <CardTitle>Service Costing</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                Year: {currentYear}
              </Badge>
              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-sm text-muted-foreground">Loading service costs...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 font-semibold mb-2">Error loading service costs</div>
              <div className="text-sm text-gray-500">{error instanceof Error ? error.message : 'Unknown error occurred'}</div>
            </div>
          ) : serviceCosts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calculator className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="mb-2 font-medium">No services found</p>
              <p className="text-sm">Please create services in Service Management first.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                Showing costs for {serviceCosts.length} service{serviceCosts.length !== 1 ? 's' : ''} for year {currentYear}
              </div>
              <Tabs defaultValue={groupedServiceCosts[0]?.id || ""} className="w-full">
                <div className="overflow-x-auto">
                  <TabsList className="inline-flex h-auto p-1 gap-1 min-w-full">
                    {groupedServiceCosts.map((groupData) => (
                      <TabsTrigger 
                        key={groupData.id} 
                        value={groupData.id}
                        className="flex items-center gap-2 text-xs whitespace-nowrap"
                      >
                        <span className="truncate max-w-[120px]">
                          {groupData.group ? groupData.group.name : "Ungrouped"}
                        </span>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {groupData.costs.length}
                        </Badge>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                {groupedServiceCosts.map((groupData) => (
                  <TabsContent key={groupData.id} value={groupData.id} className="mt-4">
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-8"></TableHead>
                            <TableHead>Service ID</TableHead>
                            <TableHead>Service Name</TableHead>
                            <TableHead>UOM</TableHead>
                            <TableHead className="text-right font-semibold">Total Cost</TableHead>
                            <TableHead className="text-right font-semibold">Unit Cost</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {groupData.costs.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                No services in this group
                              </TableCell>
                            </TableRow>
                          ) : (
                            groupData.costs.map((cost) => {
                              const isExpanded = expandedRows.has(cost.serviceId);
                              const directPct = getPercentage(cost.directCosts, cost.totalCost);
                              const depPct = getPercentage(cost.depreciation, cost.totalCost);
                              const indirectPct = getPercentage(cost.indirectCosts, cost.totalCost);
                              const commonPct = getPercentage(cost.commonCosts, cost.totalCost);
                              
                              return (
                                <Fragment key={cost.serviceId}>
                              <TableRow 
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
                                <TableCell className="text-right font-semibold text-base">
                                  {formatCurrency(cost.totalCost)}
                                </TableCell>
                                <TableCell className="text-right font-semibold text-base text-blue-600">
                                  {formatCurrency(cost.costPerUnit)}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedServiceId(cost.serviceId);
                                    }}
                                  >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View Details
                                  </Button>
                                </TableCell>
                              </TableRow>
                              {isExpanded && (
                                <TableRow className="bg-muted/30">
                                  <TableCell colSpan={7} className="p-6">
                                    <div className="space-y-6">
                                      <div className="flex items-center gap-2 mb-4">
                                        <Calculator className="h-5 w-5 text-muted-foreground" />
                                        <h3 className="text-lg font-semibold">Cost Breakdown for {cost.serviceName}</h3>
                                        <Badge variant="outline" className="ml-auto">
                                          Year: {currentYear}
                                        </Badge>
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <Card>
                                          <CardContent className="pt-6">
                                            <div className="space-y-2">
                                              <div className="text-sm font-medium text-muted-foreground">Direct Costs</div>
                                              <div className="text-2xl font-bold">{formatCurrency(cost.directCosts)}</div>
                                              {cost.totalCost > 0 && (
                                                <>
                                                  <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div 
                                                      className="bg-blue-600 h-3 rounded-full transition-all" 
                                                      style={{ width: `${directPct}%` }}
                                                    />
                                                  </div>
                                                  <div className="text-xs text-muted-foreground">
                                                    {directPct.toFixed(1)}% of total
                                                  </div>
                                                </>
                                              )}
                                            </div>
                                          </CardContent>
                                        </Card>
                                        <Card>
                                          <CardContent className="pt-6">
                                            <div className="space-y-2">
                                              <div className="text-sm font-medium text-muted-foreground">Depreciation</div>
                                              <div className="text-2xl font-bold">{formatCurrency(cost.depreciation)}</div>
                                              {cost.totalCost > 0 && (
                                                <>
                                                  <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div 
                                                      className="bg-green-600 h-3 rounded-full transition-all" 
                                                      style={{ width: `${depPct}%` }}
                                                    />
                                                  </div>
                                                  <div className="text-xs text-muted-foreground">
                                                    {depPct.toFixed(1)}% of total
                                                  </div>
                                                </>
                                              )}
                                            </div>
                                          </CardContent>
                                        </Card>
                                        <Card>
                                          <CardContent className="pt-6">
                                            <div className="space-y-2">
                                              <div className="text-sm font-medium text-muted-foreground">Indirect Costs</div>
                                              <div className="text-2xl font-bold">{formatCurrency(cost.indirectCosts)}</div>
                                              {cost.totalCost > 0 && (
                                                <>
                                                  <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div 
                                                      className="bg-yellow-600 h-3 rounded-full transition-all" 
                                                      style={{ width: `${indirectPct}%` }}
                                                    />
                                                  </div>
                                                  <div className="text-xs text-muted-foreground">
                                                    {indirectPct.toFixed(1)}% of total
                                                  </div>
                                                </>
                                              )}
                                            </div>
                                          </CardContent>
                                        </Card>
                                        <Card>
                                          <CardContent className="pt-6">
                                            <div className="space-y-2">
                                              <div className="text-sm font-medium text-muted-foreground">Common Costs</div>
                                              <div className="text-2xl font-bold">{formatCurrency(cost.commonCosts)}</div>
                                              {cost.totalCost > 0 && (
                                                <>
                                                  <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div 
                                                      className="bg-purple-600 h-3 rounded-full transition-all" 
                                                      style={{ width: `${commonPct}%` }}
                                                    />
                                                  </div>
                                                  <div className="text-xs text-muted-foreground">
                                                    {commonPct.toFixed(1)}% of total
                                                  </div>
                                                </>
                                              )}
                                            </div>
                                          </CardContent>
                                        </Card>
                                      </div>
                                  <div className="pt-4 border-t">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="text-sm font-medium text-muted-foreground mb-1">Total Service Cost</div>
                                        <div className="text-3xl font-bold">{formatCurrency(cost.totalCost)}</div>
                                      </div>
                                      {cost.uom && parseFloat(cost.uom) > 0 && (
                                        <div className="text-right">
                                          <div className="text-sm font-medium text-muted-foreground mb-1">Cost Per Unit</div>
                                          <div className="text-3xl font-bold text-blue-600">{formatCurrency(cost.costPerUnit)}</div>
                                          <div className="text-xs text-muted-foreground mt-1">UOM: {cost.uom}</div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                                </Fragment>
                              );
                            })
                          )}
                          <TableRow className="bg-muted/50 font-semibold">
                            <TableCell colSpan={4} className="font-semibold">
                              Group Total
                            </TableCell>
                            <TableCell className="text-right text-lg font-bold">
                              {formatCurrency(groupData.costs.reduce((sum, cost) => sum + cost.totalCost, 0))}
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                ))}
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Grand Total (All Groups)</span>
                    <span className="text-lg font-bold">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Cost Detail Dialog */}
      {selectedServiceId && (
        <ServiceCostDetail
          serviceId={selectedServiceId}
          onClose={() => setSelectedServiceId(null)}
        />
      )}
    </div>
  );
}

