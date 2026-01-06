import { useState, useMemo, useEffect, Fragment } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, Edit, Plus, ChevronDown, ChevronRight } from "lucide-react";
import { useAppState } from "@/hooks/use-app-state";

interface ServiceGroup {
  id: string;
  groupId: string;
  name: string;
  verticalId: string;
  description?: string;
  status: string;
}

interface Service {
  id: string;
  serviceId: string;
  name: string;
  serviceGroupId: string;
}

interface ServiceCost {
  serviceId: string;
  serviceName: string;
  totalCost: number;
  directCosts: number;
  depreciation: number;
  indirectCosts: number;
  commonCosts: number;
}

interface ServiceGroupBudget {
  id: string;
  serviceGroupId: string;
  financialYear: string;
  budgetAmount: number;
  notes?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
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

interface ServiceGroupDetailProps {
  serviceGroupId: string;
}

export function ServiceGroupDetail({ serviceGroupId }: ServiceGroupDetailProps) {
  const { dispatch } = useAppState();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<ServiceGroupBudget | null>(null);
  const [budgetFormData, setBudgetFormData] = useState({
    financialYear: "",
    budgetAmount: 0,
    notes: "",
  });
  const [selectedFinancialYear, setSelectedFinancialYear] = useState<string>("");
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());

  // Generate financial year options
  const financialYearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const startYear = currentMonth >= 3 ? currentYear : currentYear - 1;
    const years: string[] = [];
    for (let i = 0; i < 3; i++) {
      const year = startYear + i;
      years.push(`${year}-${(year + 1).toString().slice(-2)}`);
    }
    return years;
  }, []);

  // Set default financial year
  useEffect(() => {
    if (financialYearOptions.length > 0 && !selectedFinancialYear) {
      setSelectedFinancialYear(financialYearOptions[0]);
    }
  }, [financialYearOptions, selectedFinancialYear]);

  // Fetch service group
  const { data: serviceGroup, isLoading: isLoadingGroup } = useQuery<ServiceGroup>({
    queryKey: ["service-group", serviceGroupId],
    queryFn: async () => {
      const response = await fetch(`/api/service-groups/${serviceGroupId}`);
      if (!response.ok) throw new Error("Failed to fetch service group");
      return response.json();
    },
  });

  // Fetch services in this group
  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await fetch("/api/services");
      if (!response.ok) return [];
      return response.json();
    },
  });

  const groupServices = useMemo(() => {
    return services.filter(s => s.serviceGroupId === serviceGroupId);
  }, [services, serviceGroupId]);

  // Fetch service costs
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
    queryKey: ["asset-service-allocations"],
    queryFn: async () => {
      try {
        // Fetch allocations for all assets that might be indirect
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
        return allocations;
      } catch (error) {
        return [];
      }
    },
    enabled: allAssets.length > 0,
  });

  const currentYear = new Date().getFullYear();

  // Get cost elements for a service
  const getCostElementsForService = (serviceId: string): CostElement[] => {
    return allCostElements.filter(ce => 
      ce.serviceId === serviceId && 
      (!ce.status || ce.status === 'active')
    );
  };

  // Get assets for a service (direct and indirect allocations)
  const getAssetsForService = (serviceId: string): Array<{ asset: Asset; depreciation: number; allocationPercentage?: number }> => {
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
  };

  // Get depreciation for a specific year from asset schedule
  const getAssetDepreciationForYear = (asset: Asset, year: number): number => {
    if (!asset.depreciationSchedule) return 0;
    const yearData = asset.depreciationSchedule.find(y => y.year === year);
    return yearData?.depreciation || 0;
  };

  const toggleServiceExpansion = (serviceId: string) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(serviceId)) {
      newExpanded.delete(serviceId);
    } else {
      newExpanded.add(serviceId);
    }
    setExpandedServices(newExpanded);
  };

  // Calculate rollup costs for this service group
  const rollupCosts = useMemo(() => {
    const groupServiceIds = new Set(groupServices.map(s => s.id));
    const relevantCosts = serviceCosts.filter(cost => groupServiceIds.has(cost.serviceId));
    
    return {
      totalCost: relevantCosts.reduce((sum, cost) => sum + (cost.totalCost || 0), 0),
      directCosts: relevantCosts.reduce((sum, cost) => sum + (cost.directCosts || 0), 0),
      depreciation: relevantCosts.reduce((sum, cost) => sum + (cost.depreciation || 0), 0),
      indirectCosts: relevantCosts.reduce((sum, cost) => sum + (cost.indirectCosts || 0), 0),
      commonCosts: relevantCosts.reduce((sum, cost) => sum + (cost.commonCosts || 0), 0),
    };
  }, [groupServices, serviceCosts]);

  // Fetch budget for selected financial year
  const financialYear = selectedFinancialYear || financialYearOptions[0];
  const { data: budget } = useQuery<ServiceGroupBudget>({
    queryKey: ["service-group-budget", serviceGroupId, financialYear],
    queryFn: async () => {
      const response = await fetch(`/api/service-groups/${serviceGroupId}/budgets?financialYear=${financialYear}`);
      if (!response.ok) return null;
      const data = await response.json();
      return Array.isArray(data) && data.length > 0 ? data[0] : null;
    },
    enabled: !!serviceGroupId && !!financialYear,
  });

  // Budget mutations
  const createBudgetMutation = useMutation({
    mutationFn: async (data: { serviceGroupId: string; financialYear: string; budgetAmount: number; notes?: string }) => {
      const response = await fetch(`/api/service-groups/${data.serviceGroupId}/budgets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create budget");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-group-budget", serviceGroupId] });
      toast({ title: "Success", description: "Budget created successfully" });
      setIsBudgetDialogOpen(false);
      resetBudgetForm();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateBudgetMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { budgetAmount: number; notes?: string } }) => {
      const response = await fetch(`/api/service-groups/${serviceGroupId}/budgets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update budget");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-group-budget", serviceGroupId] });
      toast({ title: "Success", description: "Budget updated successfully" });
      setIsBudgetDialogOpen(false);
      resetBudgetForm();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const resetBudgetForm = () => {
    setBudgetFormData({
      financialYear: financialYear,
      budgetAmount: 0,
      notes: "",
    });
    setEditingBudget(null);
  };

  const handleOpenBudgetDialog = (existingBudget?: ServiceGroupBudget) => {
    if (existingBudget) {
      setEditingBudget(existingBudget);
      setBudgetFormData({
        financialYear: existingBudget.financialYear,
        budgetAmount: existingBudget.budgetAmount,
        notes: existingBudget.notes || "",
      });
    } else {
      resetBudgetForm();
    }
    setIsBudgetDialogOpen(true);
  };

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBudget) {
      updateBudgetMutation.mutate({
        id: editingBudget.id,
        data: {
          budgetAmount: budgetFormData.budgetAmount,
          notes: budgetFormData.notes,
        },
      });
    } else {
      createBudgetMutation.mutate({
        serviceGroupId: serviceGroupId,
        financialYear: budgetFormData.financialYear,
        budgetAmount: budgetFormData.budgetAmount,
        notes: budgetFormData.notes,
      });
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_CURRENT_TAB', payload: 'service' });
    window.history.pushState({}, '', '');
  };

  const budgetAmount = budget?.budgetAmount || 0;
  const actualCost = rollupCosts.totalCost;
  const variance = budgetAmount - actualCost;
  const variancePercentage = budgetAmount > 0 ? (variance / budgetAmount) * 100 : 0;

  if (isLoadingGroup) {
    return <div className="p-8">Loading...</div>;
  }

  if (!serviceGroup) {
    return <div className="p-8">Service Group not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{serviceGroup.name}</h1>
          <p className="text-sm text-muted-foreground">Service Group ID: {serviceGroup.groupId}</p>
        </div>
      </div>

      {/* Budget vs Actual Comparison */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Budget vs Actual Cost</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={selectedFinancialYear} onValueChange={setSelectedFinancialYear}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Financial Year" />
                </SelectTrigger>
                <SelectContent>
                  {financialYearOptions.map((fy) => (
                    <SelectItem key={fy} value={fy}>
                      {fy}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenBudgetDialog(budget || undefined)}
              >
                {budget ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                {budget ? "Edit Budget" : "Add Budget"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Budgeted Amount</div>
                  <div className="text-2xl font-bold">{formatCurrency(budgetAmount)}</div>
                  {budget && (
                    <div className="text-xs text-muted-foreground">
                      {budget.financialYear}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Actual Cost</div>
                  <div className="text-2xl font-bold">{formatCurrency(actualCost)}</div>
                  <div className="text-xs text-muted-foreground">
                    Rollup of all services
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Variance</div>
                  <div className={`text-2xl font-bold ${variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {variance >= 0 ? '+' : ''}{formatCurrency(variance)}
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    {variance >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span className={variance >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {Math.abs(variancePercentage).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Utilization</div>
                  <div className="text-2xl font-bold">
                    {budgetAmount > 0 ? ((actualCost / budgetAmount) * 100).toFixed(1) : 0}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        (actualCost / budgetAmount) * 100 > 100 ? 'bg-red-600' : 'bg-[#D71921]'
                      }`}
                      style={{
                        width: `${Math.min((actualCost / budgetAmount) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Cost Rollup */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Cost Rollup</CardTitle>
            <div className="text-sm text-muted-foreground">
              Total: {formatCurrency(rollupCosts.totalCost)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Service</TableHead>
                <TableHead className="text-right">Service Level Cost</TableHead>
                <TableHead className="text-right">% Contribution</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No services in this group
                  </TableCell>
                </TableRow>
              ) : (
                groupServices.map((service) => {
                  const cost = serviceCosts.find(c => c.serviceId === service.id);
                  const serviceCost = cost?.totalCost || 0;
                  const contributionPercentage = rollupCosts.totalCost > 0 
                    ? (serviceCost / rollupCosts.totalCost) * 100 
                    : 0;
                  const isExpanded = expandedServices.has(service.id);
                  const costElements = getCostElementsForService(service.id);
                  const assets = getAssetsForService(service.id);

                  return (
                    <Fragment key={service.id}>
                      <TableRow 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => toggleServiceExpansion(service.id)}
                      >
                        <TableCell>
                          {serviceCost > 0 ? (
                            isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )
                          ) : null}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{service.name}</div>
                            <Badge variant="outline" className="text-xs mt-1">
                              {service.serviceId}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {serviceCost > 0 ? formatCurrency(serviceCost) : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {serviceCost > 0 ? (
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-[#D71921] h-2 rounded-full"
                                  style={{ width: `${Math.min(contributionPercentage, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium min-w-[50px]">
                                {contributionPercentage.toFixed(1)}%
                              </span>
                            </div>
                          ) : "-"}
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              window.history.pushState({}, '', `?serviceId=${service.id}`);
                              dispatch({ type: 'SET_CURRENT_TAB', payload: 'service-detail' });
                            }}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                      {isExpanded && serviceCost > 0 && (
                        <TableRow key={`${service.id}-details`} className="bg-muted/30">
                          <TableCell colSpan={5} className="p-6">
                            <div className="space-y-6">
                              {/* Cost Elements */}
                              {costElements.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold mb-3">Cost Elements</h4>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Cost Element</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {costElements.map((ce) => (
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
                                          <TableCell className="text-right font-semibold">
                                            {formatCurrency(ce.amount)}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              )}

                              {/* Assets */}
                              {assets.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold mb-3">Assets (Depreciation for {currentYear})</h4>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Asset</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead className="text-right">Depreciation</TableHead>
                                        {assets.some(a => a.allocationPercentage) && (
                                          <TableHead className="text-right">Allocation %</TableHead>
                                        )}
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {assets.map(({ asset, depreciation, allocationPercentage }) => (
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
                                          <TableCell className="text-right font-semibold">
                                            {formatCurrency(depreciation)}
                                          </TableCell>
                                          {assets.some(a => a.allocationPercentage) && (
                                            <TableCell className="text-right">
                                              {allocationPercentage ? `${allocationPercentage}%` : "-"}
                                            </TableCell>
                                          )}
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              )}

                              {costElements.length === 0 && assets.length === 0 && (
                                <div className="text-center text-muted-foreground py-4">
                                  No cost elements or assets found for this service
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Services List */}
      <Card>
        <CardHeader>
          <CardTitle>Services ({groupServices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service ID</TableHead>
                <TableHead>Service Name</TableHead>
                <TableHead className="text-right">Total Cost</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No services in this group
                  </TableCell>
                </TableRow>
              ) : (
                groupServices.map((service) => {
                  const cost = serviceCosts.find(c => c.serviceId === service.id);
                  return (
                    <TableRow key={service.id}>
                      <TableCell>
                        <Badge variant="outline">{service.serviceId}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {cost ? formatCurrency(cost.totalCost) : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            window.history.pushState({}, '', `?serviceId=${service.id}`);
                            dispatch({ type: 'SET_CURRENT_TAB', payload: 'service-detail' });
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Budget Dialog */}
      <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingBudget ? "Edit Budget" : "Add Budget"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBudgetSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="financialYear">Financial Year *</Label>
                <Select
                  value={budgetFormData.financialYear}
                  onValueChange={(value) =>
                    setBudgetFormData({ ...budgetFormData, financialYear: value })
                  }
                  required
                  disabled={!!editingBudget}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Financial Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {financialYearOptions.map((fy) => (
                      <SelectItem key={fy} value={fy}>
                        {fy}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budgetAmount">Budget Amount (₹) *</Label>
                <Input
                  id="budgetAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={budgetFormData.budgetAmount}
                  onChange={(e) =>
                    setBudgetFormData({ ...budgetFormData, budgetAmount: parseFloat(e.target.value) || 0 })
                  }
                  required
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={budgetFormData.notes}
                  onChange={(e) =>
                    setBudgetFormData({ ...budgetFormData, notes: e.target.value })
                  }
                  placeholder="Additional notes about this budget"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsBudgetDialogOpen(false);
                  resetBudgetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createBudgetMutation.isPending || updateBudgetMutation.isPending}
              >
                {editingBudget ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

