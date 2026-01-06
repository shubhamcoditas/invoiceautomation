import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Service {
  id: string;
  serviceId: string;
  name: string;
  description?: string;
  uom: string;
  status: string;
  serviceGroupId: string;
}

interface ServiceGroup {
  id: string;
  name: string;
  groupId: string;
}

interface ServiceCost {
  serviceId: string;
  serviceName: string;
  totalCost: number;
  costPerUnit: number;
  directCosts: number;
  depreciation: number;
  indirectCosts: number;
  commonCosts: number;
  year: number;
}

interface CostElement {
  id: string;
  name: string;
  costType: 'Direct' | 'Indirect' | 'Common';
  amount: number;
  serviceId?: string;
  description?: string;
  status?: string;
}

interface Asset {
  id: string;
  name: string;
  assetCode: string;
  serviceId?: string;
  serviceMappingType?: 'Direct' | 'Indirect';
  depreciationSchedule?: Array<{
    year: number;
    depreciation: number;
    openingValue: number;
    closingValue: number;
  }>;
  costOfAcquisition: number;
  status?: string;
}

interface AssetServiceAllocation {
  id: string;
  assetId: string;
  serviceId: string;
  percentage: number;
}

interface ServiceDetailProps {
  serviceId: string;
}

export function ServiceDetail({ serviceId }: ServiceDetailProps) {
  const { dispatch } = useAppState();

  // Fetch service
  const { data: service, isLoading: isLoadingService } = useQuery<Service>({
    queryKey: ["service", serviceId],
    queryFn: async () => {
      const response = await fetch(`/api/services/${serviceId}`);
      if (!response.ok) throw new Error("Failed to fetch service");
      return response.json();
    },
  });

  // Fetch service group
  const { data: serviceGroup } = useQuery<ServiceGroup>({
    queryKey: ["service-group", service?.serviceGroupId],
    queryFn: async () => {
      if (!service?.serviceGroupId) return null;
      const response = await fetch(`/api/service-groups/${service.serviceGroupId}`);
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!service?.serviceGroupId,
  });

  // Fetch service cost
  const { data: serviceCosts = [] } = useQuery<ServiceCost[]>({
    queryKey: ["service-level-costs"],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/service-level-costs`);
        if (!response.ok) return [];
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        return [];
      }
    },
  });

  const serviceCost = useMemo(() => {
    return serviceCosts.find(cost => cost.serviceId === serviceId);
  }, [serviceCosts, serviceId]);

  const currentYear = new Date().getFullYear();

  // Fetch all cost elements
  const { data: allCostElements = [] } = useQuery<CostElement[]>({
    queryKey: ["cost-elements"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/cost-elements");
        if (!response.ok) return [];
        return response.json();
      } catch (error) {
        return [];
      }
    },
  });

  // Fetch all assets
  const { data: allAssets = [] } = useQuery<Asset[]>({
    queryKey: ["assets"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/assets");
        if (!response.ok) return [];
        return response.json();
      } catch (error) {
        return [];
      }
    },
  });

  // Fetch asset service allocations for indirect assets
  const { data: assetAllocations = [] } = useQuery<AssetServiceAllocation[]>({
    queryKey: ["asset-service-allocations", serviceId],
    queryFn: async () => {
      try {
        const indirectAssetIds = allAssets
          .filter(a => a.serviceMappingType === 'Indirect')
          .map(a => a.id);
        
        if (indirectAssetIds.length === 0) return [];

        const allocations: AssetServiceAllocation[] = [];
        await Promise.all(
          indirectAssetIds.map(async (assetId) => {
            try {
              const response = await fetch(`/api/assets/${assetId}/service-allocations`);
              if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                  allocations.push(...data);
                }
              }
            } catch (e) {
              // Ignore errors for individual fetches
            }
          })
        );
        return allocations.filter(aa => aa.serviceId === serviceId);
      } catch (error) {
        return [];
      }
    },
    enabled: allAssets.length > 0 && !!serviceId,
  });

  // Get cost elements for this service
  const costElements = useMemo(() => {
    return allCostElements.filter(ce => 
      ce.serviceId === serviceId && 
      (!ce.status || ce.status === 'active')
    );
  }, [allCostElements, serviceId]);

  // Get depreciation for a specific year from asset schedule
  const getAssetDepreciationForYear = (asset: Asset, year: number): number => {
    if (!asset.depreciationSchedule) return 0;
    const yearData = asset.depreciationSchedule.find(y => y.year === year);
    return yearData?.depreciation || 0;
  };

  // Get assets for this service (direct and indirect allocations)
  const assets = useMemo(() => {
    const result: Array<{ asset: Asset; depreciation: number; allocationPercentage?: number }> = [];
    
    // Direct assets
    allAssets
      .filter(a => a.serviceId === serviceId && a.serviceMappingType === 'Direct' && (!a.status || a.status === 'active'))
      .forEach(asset => {
        const depreciation = getAssetDepreciationForYear(asset, currentYear);
        if (depreciation > 0) {
          result.push({ asset, depreciation });
        }
      });

    // Indirect assets with allocations
    allAssets
      .filter(a => a.serviceMappingType === 'Indirect' && (!a.status || a.status === 'active'))
      .forEach(asset => {
        const allocations = assetAllocations.filter(aa => aa.assetId === asset.id && aa.serviceId === serviceId);
        allocations.forEach(allocation => {
          const depreciation = getAssetDepreciationForYear(asset, currentYear);
          const allocatedDepreciation = (depreciation * allocation.percentage) / 100;
          if (allocatedDepreciation > 0) {
            result.push({ 
              asset, 
              depreciation: allocatedDepreciation, 
              allocationPercentage: allocation.percentage 
            });
          }
        });
      });

    return result;
  }, [allAssets, assetAllocations, serviceId, currentYear]);

  const handleBack = () => {
    dispatch({ type: 'SET_CURRENT_TAB', payload: 'service' });
    window.history.pushState({}, '', '');
  };

  const handleViewServiceGroup = () => {
    if (service?.serviceGroupId) {
      window.history.pushState({}, '', `?serviceGroupId=${service.serviceGroupId}`);
      dispatch({ type: 'SET_CURRENT_TAB', payload: 'service-group-detail' });
    }
  };

  if (isLoadingService) {
    return <div className="p-8">Loading...</div>;
  }

  if (!service) {
    return <div className="p-8">Service not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{service.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">Service ID: {service.serviceId}</Badge>
            {serviceGroup && (
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0"
                onClick={handleViewServiceGroup}
              >
                Service Group: {serviceGroup.name}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Service Information */}
      <Card>
        <CardHeader>
          <CardTitle>Service Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Description</div>
              <div className="text-sm">{service.description || "No description"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Unit of Measurement (UOM)</div>
              <div className="text-sm font-semibold">{service.uom}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Status</div>
              <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Summary */}
      {serviceCost && (
        <Card>
          <CardHeader>
            <CardTitle>Cost Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Total Cost</div>
                    <div className="text-2xl font-bold">{formatCurrency(serviceCost.totalCost)}</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Cost Per Unit</div>
                    <div className="text-2xl font-bold text-[#D71921]">{formatCurrency(serviceCost.costPerUnit)}</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Direct Costs</div>
                    <div className="text-2xl font-bold text-[#D71921]">{formatCurrency(serviceCost.directCosts)}</div>
                    {serviceCost.totalCost > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {((serviceCost.directCosts / serviceCost.totalCost) * 100).toFixed(1)}% of total
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Depreciation</div>
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(serviceCost.depreciation)}</div>
                    {serviceCost.totalCost > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {((serviceCost.depreciation / serviceCost.totalCost) * 100).toFixed(1)}% of total
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Indirect Costs</div>
                    <div className="text-2xl font-bold text-yellow-600">{formatCurrency(serviceCost.indirectCosts)}</div>
                    {serviceCost.totalCost > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {((serviceCost.indirectCosts / serviceCost.totalCost) * 100).toFixed(1)}% of total
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Common Costs</div>
                    <div className="text-2xl font-bold text-purple-600">{formatCurrency(serviceCost.commonCosts)}</div>
                    {serviceCost.totalCost > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {((serviceCost.commonCosts / serviceCost.totalCost) * 100).toFixed(1)}% of total
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cost Line Items */}
      {serviceCost && (
        <Card>
          <CardHeader>
            <CardTitle>Cost Line Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="cost-elements" className="w-full">
              <TabsList>
                <TabsTrigger value="cost-elements">
                  Cost Elements ({costElements.length})
                </TabsTrigger>
                <TabsTrigger value="assets">
                  Assets ({assets.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="cost-elements" className="mt-4">
                {costElements.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No cost elements found for this service.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cost Element</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">% of Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {costElements.map((ce) => {
                        const percentage = serviceCost.totalCost > 0 
                          ? (ce.amount / serviceCost.totalCost) * 100 
                          : 0;
                        return (
                          <TableRow key={ce.id}>
                            <TableCell className="font-medium">{ce.name}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  ce.costType === 'Direct' ? 'default' :
                                  ce.costType === 'Indirect' ? 'secondary' : 'outline'
                                }
                              >
                                {ce.costType}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {ce.description || "-"}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatCurrency(ce.amount)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-[#D71921] h-2 rounded-full"
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                  />
                                </div>
                                <span className="text-sm min-w-[50px]">
                                  {percentage.toFixed(1)}%
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {costElements.length > 0 && (
                        <TableRow className="font-semibold bg-muted/50">
                          <TableCell colSpan={3}>Total Direct Cost Elements</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(costElements.reduce((sum, ce) => sum + ce.amount, 0))}
                          </TableCell>
                          <TableCell className="text-right">
                            {serviceCost.totalCost > 0 
                              ? ((costElements.reduce((sum, ce) => sum + ce.amount, 0) / serviceCost.totalCost) * 100).toFixed(1)
                              : 0}%
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>

              <TabsContent value="assets" className="mt-4">
                {assets.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No assets found for this service.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Cost of Acquisition</TableHead>
                        <TableHead className="text-right">Depreciation ({currentYear})</TableHead>
                        {assets.some(a => a.allocationPercentage) && (
                          <TableHead className="text-right">Allocation %</TableHead>
                        )}
                        <TableHead className="text-right">% of Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assets.map(({ asset, depreciation, allocationPercentage }) => {
                        const percentage = serviceCost.totalCost > 0 
                          ? (depreciation / serviceCost.totalCost) * 100 
                          : 0;
                        return (
                          <TableRow key={asset.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{asset.name}</div>
                                <Badge variant="outline" className="text-xs mt-1">
                                  {asset.assetCode}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={asset.serviceMappingType === 'Direct' ? 'default' : 'secondary'}>
                                {asset.serviceMappingType || 'Direct'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(asset.costOfAcquisition)}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-green-600">
                              {formatCurrency(depreciation)}
                            </TableCell>
                            {assets.some(a => a.allocationPercentage) && (
                              <TableCell className="text-right">
                                {allocationPercentage ? `${allocationPercentage}%` : "-"}
                              </TableCell>
                            )}
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-600 h-2 rounded-full"
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                  />
                                </div>
                                <span className="text-sm min-w-[50px]">
                                  {percentage.toFixed(1)}%
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {assets.length > 0 && (
                        <TableRow className="font-semibold bg-muted/50">
                          <TableCell colSpan={assets.some(a => a.allocationPercentage) ? 4 : 3}>
                            Total Depreciation
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(assets.reduce((sum, a) => sum + a.depreciation, 0))}
                          </TableCell>
                          {assets.some(a => a.allocationPercentage) && <TableCell />}
                          <TableCell className="text-right">
                            {serviceCost.totalCost > 0 
                              ? ((assets.reduce((sum, a) => sum + a.depreciation, 0) / serviceCost.totalCost) * 100).toFixed(1)
                              : 0}%
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {!serviceCost && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              No cost data available for this service.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

