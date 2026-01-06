import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, X, CheckCircle2, AlertCircle, Circle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CostElement {
  id: string;
  costElementId: string;
  name: string;
  costType: 'Direct' | 'Indirect' | 'Common';
  budgetLineId: string;
  amount?: number;
  isBudgeted?: boolean;
  financialYear?: string;
}

interface CostRule {
  id: string;
  costElementId: string;
  serviceId: string;
  percentage: number;
  status: string;
}

interface Service {
  id: string;
  serviceId: string;
  name: string;
}

export function CostRules() {
  const [selectedCostElement, setSelectedCostElement] = useState<CostElement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<CostRule | null>(null);
  const [newServiceForm, setNewServiceForm] = useState({
    serviceId: "",
    percentage: 0,
  });
  // Local state for pending changes (not yet saved)
  const [pendingRules, setPendingRules] = useState<CostRule[]>([]);
  const [pendingDeletes, setPendingDeletes] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch Indirect and Common cost elements
  const { data: indirectCostElements = [] } = useQuery<CostElement[]>({
    queryKey: ["cost-elements", "Indirect"],
    queryFn: async () => {
      const response = await fetch("/api/cost-elements?costType=Indirect");
      if (!response.ok) {
        let errorMessage = "Failed to fetch indirect cost elements";
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      return response.json();
    },
  });

  const { data: commonCostElements = [] } = useQuery<CostElement[]>({
    queryKey: ["cost-elements", "Common"],
    queryFn: async () => {
      const response = await fetch("/api/cost-elements?costType=Common");
      if (!response.ok) {
        let errorMessage = "Failed to fetch common cost elements";
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      return response.json();
    },
  });

  // Fetch all services
  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await fetch("/api/services");
      if (!response.ok) {
        let errorMessage = "Failed to fetch services";
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      return response.json();
    },
  });

  // Fetch cost rules for selected cost element
  const { data: costRules = [], isLoading: rulesLoading } = useQuery<CostRule[]>({
    queryKey: ["cost-rules", selectedCostElement?.id],
    queryFn: async () => {
      if (!selectedCostElement) return [];
      const response = await fetch(`/api/cost-rules/cost-element/${selectedCostElement.id}`);
      if (!response.ok) {
        let errorMessage = "Failed to fetch cost rules";
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      return response.json();
    },
    enabled: !!selectedCostElement,
    onSuccess: (data) => {
      // Reset pending changes when data is fetched
      setPendingRules([]);
      setPendingDeletes(new Set());
    },
  });

  // Compute displayed rules (existing - deleted + pending new/updated)
  const displayedRules = (() => {
    // Filter out deleted rules
    const existing = costRules.filter(r => !pendingDeletes.has(r.id));
    
    // Separate pending updates from new rules
    const pendingUpdates = new Map<string, CostRule>();
    const newRules: CostRule[] = [];
    
    pendingRules.forEach(rule => {
      if (rule.id && rule.id.startsWith('pending-')) {
        // New rule
        newRules.push(rule);
      } else {
        // Updated rule (has existing ID)
        pendingUpdates.set(rule.id, rule);
      }
    });

    // Merge: replace existing with updated, then add new ones
    const result = existing.map(rule => pendingUpdates.get(rule.id) || rule);
    return [...result, ...newRules];
  })();

  // Calculate total percentage from displayed rules
  const totalPercentage = displayedRules.reduce((sum, rule) => sum + rule.percentage, 0);

  // Save all changes mutation
  const saveAllMutation = useMutation({
    mutationFn: async () => {
      if (!selectedCostElement) return;

      // Delete removed rules
      for (const id of pendingDeletes) {
        const response = await fetch(`/api/cost-rules/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`Failed to delete rule ${id}`);
        }
      }

      // Create new rules and update existing ones
      for (const rule of pendingRules) {
        if (rule.id && rule.id.startsWith('pending-')) {
          // New rule - create
          const response = await fetch("/api/cost-rules", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              costElementId: selectedCostElement.id,
              serviceId: rule.serviceId,
              percentage: rule.percentage,
            }),
          });
          if (!response.ok) {
            throw new Error(`Failed to create rule for service ${rule.serviceId}`);
          }
        } else {
          // Existing rule - update
          const response = await fetch(`/api/cost-rules/${rule.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ percentage: rule.percentage }),
          });
          if (!response.ok) {
            throw new Error(`Failed to update rule ${rule.id}`);
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cost-rules", selectedCostElement?.id] });
      queryClient.invalidateQueries({ queryKey: ["cost-rules-total", selectedCostElement?.id] });
      setPendingRules([]);
      setPendingDeletes(new Set());
      toast({
        title: "Success",
        description: "Cost rules saved successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Fetch full cost element details when selected
  const { data: selectedCostElementDetails } = useQuery<CostElement>({
    queryKey: ["cost-element", selectedCostElement?.id],
    queryFn: async () => {
      if (!selectedCostElement) return null;
      const response = await fetch(`/api/cost-elements/${selectedCostElement.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch cost element details");
      }
      return response.json();
    },
    enabled: !!selectedCostElement && isDialogOpen,
  });

  // Use full details if available, otherwise fall back to selected cost element
  const costElementWithDetails = selectedCostElementDetails || selectedCostElement;

  const handleOpenCostElement = (costElement: CostElement) => {
    setSelectedCostElement(costElement);
    setIsDialogOpen(true);
    setPendingRules([]);
    setPendingDeletes(new Set());
  };

  const handleAddService = () => {
    setNewServiceForm({ serviceId: "", percentage: 0 });
    setIsAddServiceDialogOpen(true);
  };

  const handleSaveService = () => {
    if (!selectedCostElement) return;

    if (!newServiceForm.serviceId) {
      toast({
        title: "Validation Error",
        description: "Please select a service",
        variant: "destructive",
      });
      return;
    }

    if (newServiceForm.percentage <= 0 || newServiceForm.percentage > 100) {
      toast({
        title: "Validation Error",
        description: "Percentage must be between 0 and 100",
        variant: "destructive",
      });
      return;
    }

    const newTotal = totalPercentage + newServiceForm.percentage;
    if (newTotal > 100) {
      toast({
        title: "Validation Error",
        description: `Adding ${newServiceForm.percentage}% would exceed 100%. Current total: ${totalPercentage.toFixed(2)}%`,
        variant: "destructive",
      });
      return;
    }

    // Check if service is already allocated
    const existingRule = displayedRules.find(r => r.serviceId === newServiceForm.serviceId);
    if (existingRule) {
      toast({
        title: "Validation Error",
        description: "This service is already allocated",
        variant: "destructive",
      });
      return;
    }

    // Add to pending rules (new rule)
    const newRule: CostRule = {
      id: `pending-${Date.now()}`,
      costElementId: selectedCostElement.id,
      serviceId: newServiceForm.serviceId,
      percentage: newServiceForm.percentage,
      status: "active",
    };
    setPendingRules([...pendingRules, newRule]);
    setIsAddServiceDialogOpen(false);
    setNewServiceForm({ serviceId: "", percentage: 0 });
  };

  const handleUpdatePercentage = (ruleId: string, newPercentage: number) => {
    if (newPercentage < 0 || newPercentage > 100) {
      toast({
        title: "Validation Error",
        description: "Percentage must be between 0 and 100",
        variant: "destructive",
      });
      return;
    }

    // Find the rule (either existing or pending)
    const existingRule = costRules.find(r => r.id === ruleId);
    const pendingRule = pendingRules.find(r => r.id === ruleId);
    const rule = existingRule || pendingRule;
    
    if (!rule) return;

    // Calculate new total
    const otherRulesTotal = displayedRules
      .filter(r => r.id !== ruleId)
      .reduce((sum, r) => sum + r.percentage, 0);
    
    const newTotal = otherRulesTotal + newPercentage;
    if (newTotal > 100) {
      toast({
        title: "Validation Error",
        description: `Total percentage would exceed 100%. Current other allocations: ${otherRulesTotal.toFixed(2)}%`,
        variant: "destructive",
      });
      return;
    }

    // Update in pending rules
    if (pendingRule) {
      setPendingRules(pendingRules.map(r => r.id === ruleId ? { ...r, percentage: newPercentage } : r));
    } else if (existingRule) {
      // Add to pending updates
      setPendingRules([...pendingRules, { ...existingRule, percentage: newPercentage }]);
    }
    setEditingRule(null);
  };

  const handleDeleteRule = (id: string) => {
    if (confirm("Are you sure you want to remove this service allocation?")) {
      // If it's a pending new rule, just remove it
      if (id.startsWith('pending-')) {
        setPendingRules(pendingRules.filter(r => r.id !== id));
      } else {
        // If it's an existing rule, mark for deletion
        setPendingDeletes(new Set([...pendingDeletes, id]));
        // Also remove any pending updates for this rule
        setPendingRules(pendingRules.filter(r => r.id !== id));
      }
    }
  };

  const handleSaveAll = () => {
    if (!isTotalValid) {
      toast({
        title: "Validation Error",
        description: "Total percentage must equal exactly 100% to save",
        variant: "destructive",
      });
      return;
    }

    if (pendingRules.length === 0 && pendingDeletes.size === 0) {
      toast({
        title: "No Changes",
        description: "No changes to save",
      });
      return;
    }

    saveAllMutation.mutate();
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : serviceId;
  };

  const getAvailableServices = () => {
    const allocatedServiceIds = new Set(displayedRules.map(r => r.serviceId));
    return services.filter(s => !allocatedServiceIds.has(s.id));
  };

  const isTotalValid = Math.abs(totalPercentage - 100) < 0.01; // Allow small floating point differences

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Calculate allocated amount for a service based on percentage
  const calculateAllocatedAmount = (percentage: number) => {
    if (!costElementWithDetails?.amount) return 0;
    return (costElementWithDetails.amount * percentage) / 100;
  };

  // Calculate total allocated amount
  const totalAllocatedAmount = displayedRules.reduce((sum, rule) => {
    return sum + calculateAllocatedAmount(rule.percentage);
  }, 0);

  // Component to display allocation status for a cost element
  const AllocationStatus = ({ costElementId }: { costElementId: string }) => {
    const { data: totalData } = useQuery<{ total: number }>({
      queryKey: ["cost-rules-total", costElementId],
      queryFn: async () => {
        const response = await fetch(`/api/cost-rules/cost-element/${costElementId}/total`);
        if (!response.ok) {
          return { total: 0 };
        }
        return response.json();
      },
      refetchOnWindowFocus: false,
    });

    const total = totalData?.total || 0;
    const isComplete = Math.abs(total - 100) < 0.01;
    const hasAllocations = total > 0;

    if (isComplete) {
      return (
        <Badge variant="default" className="bg-green-600 hover:bg-green-700">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Allocated
        </Badge>
      );
    } else if (hasAllocations) {
      return (
        <Badge variant="outline" className="border-yellow-500 text-yellow-700 dark:text-yellow-400">
          <AlertCircle className="mr-1 h-3 w-3" />
          Incomplete ({total.toFixed(0)}%)
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="border-gray-300 text-gray-600 dark:text-gray-400">
          <Circle className="mr-1 h-3 w-3" />
          Not Set
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cost Rules</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Manage allocation of Indirect and Common costs to services
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="indirect" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="indirect">
                Indirect Costs ({indirectCostElements.length})
              </TabsTrigger>
              <TabsTrigger value="common">
                Common Costs ({commonCostElements.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="indirect" className="space-y-4 mt-4">
              {indirectCostElements.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No Indirect cost elements found. Create Indirect cost elements first.
                </div>
              ) : (
                <div className="grid gap-3">
                  {indirectCostElements.map((costElement) => (
                    <Card
                      key={costElement.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleOpenCostElement(costElement)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{costElement.name}</h3>
                              <Badge variant="outline" className="text-xs text-muted-foreground font-normal">
                                {costElement.costElementId}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <AllocationStatus costElementId={costElement.id} />
                            </div>
                          </div>
                          <Badge variant="secondary" className="ml-4">Indirect</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="common" className="space-y-4 mt-4">
              {commonCostElements.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No Common cost elements found. Create Common cost elements first.
                </div>
              ) : (
                <div className="grid gap-3">
                  {commonCostElements.map((costElement) => (
                    <Card
                      key={costElement.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleOpenCostElement(costElement)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{costElement.name}</h3>
                              <Badge variant="outline" className="text-xs text-muted-foreground font-normal">
                                {costElement.costElementId}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <AllocationStatus costElementId={costElement.id} />
                            </div>
                          </div>
                          <Badge variant="outline" className="ml-4">Common</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Cost Element Allocation Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            // Reset pending changes when dialog closes
            setSelectedCostElement(null);
            setEditingRule(null);
            setPendingRules([]);
            setPendingDeletes(new Set());
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {costElementWithDetails && `Allocate ${costElementWithDetails.name} to Services`}
            </DialogTitle>
          </DialogHeader>
          
          {costElementWithDetails && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{costElementWithDetails.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs text-muted-foreground font-normal">
                        {costElementWithDetails.costElementId}
                      </Badge>
                      {costElementWithDetails.isBudgeted && costElementWithDetails.financialYear && (
                        <Badge variant="outline" className="text-xs">
                          {costElementWithDetails.financialYear}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge variant={costElementWithDetails.costType === 'Indirect' ? 'secondary' : 'outline'}>
                    {costElementWithDetails.costType}
                  </Badge>
                </div>
                {costElementWithDetails.amount !== undefined && costElementWithDetails.amount !== null && (
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {costElementWithDetails.isBudgeted ? 'Budgeted Amount' : 'Actual Amount'}:
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {formatCurrency(costElementWithDetails.amount)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Service Allocations</h3>
                <Button
                  onClick={handleAddService}
                  disabled={getAvailableServices().length === 0}
                  size="sm"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Service
                </Button>
              </div>

              {rulesLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : displayedRules.length === 0 ? (
                <div className="text-center py-8 text-gray-500 border rounded-lg">
                  No service allocations yet. Click "Add Service" to start allocating.
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead className="text-right">Percentage (%)</TableHead>
                        <TableHead className="text-right">Allocated Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedRules.map((rule) => {
                        const allocatedAmount = calculateAllocatedAmount(rule.percentage);
                        return (
                          <TableRow key={rule.id}>
                            <TableCell className="font-medium">
                              {getServiceName(rule.serviceId)}
                              {rule.id.startsWith('pending-') && (
                                <Badge variant="outline" className="ml-2 text-xs">New</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {editingRule?.id === rule.id ? (
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  max="100"
                                  value={editingRule.percentage}
                                  onChange={(e) => {
                                    setEditingRule({
                                      ...editingRule,
                                      percentage: parseFloat(e.target.value) || 0,
                                    });
                                  }}
                                  className="w-24 ml-auto"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && editingRule) {
                                      handleUpdatePercentage(editingRule.id, editingRule.percentage);
                                    }
                                    if (e.key === 'Escape') {
                                      setEditingRule(null);
                                    }
                                  }}
                                  autoFocus
                                />
                              ) : (
                                <span
                                  className="cursor-pointer hover:underline"
                                  onClick={() => setEditingRule(rule)}
                                >
                                  {rule.percentage.toFixed(2)}%
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {costElementWithDetails?.amount !== undefined && costElementWithDetails?.amount !== null
                                ? formatCurrency(allocatedAmount)
                                : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                {editingRule?.id === rule.id ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingRule(null)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setEditingRule(rule)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteRule(rule.id)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <span className="font-semibold">Total Percentage:</span>
                  <div className="flex items-center gap-2">
                    <span className={isTotalValid ? "text-green-600 dark:text-green-400 font-bold" : "text-red-600 dark:text-red-400 font-bold"}>
                      {totalPercentage.toFixed(2)}%
                    </span>
                    {isTotalValid ? (
                      <Badge variant="default" className="bg-green-600">Valid</Badge>
                    ) : (
                      <Badge variant="destructive">
                        Must equal 100%
                      </Badge>
                    )}
                  </div>
                </div>
                {costElementWithDetails?.amount !== undefined && costElementWithDetails?.amount !== null && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <span className="font-semibold">Total Allocated Amount:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {formatCurrency(totalAllocatedAmount)}
                      </span>
                      {isTotalValid && (
                        <span className="text-xs text-gray-500">
                          of {formatCurrency(costElementWithDetails.amount)}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {!isTotalValid && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Total percentage must equal 100% to save. Current total: {totalPercentage.toFixed(2)}%
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setSelectedCostElement(null);
                setEditingRule(null);
                setPendingRules([]);
                setPendingDeletes(new Set());
              }}
            >
              Close
            </Button>
            <Button
              onClick={handleSaveAll}
              disabled={!isTotalValid || saveAllMutation.isPending || (pendingRules.length === 0 && pendingDeletes.size === 0)}
            >
              {saveAllMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Service Dialog */}
      <Dialog open={isAddServiceDialogOpen} onOpenChange={setIsAddServiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Service Allocation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="serviceId">Service *</Label>
              <Select
                value={newServiceForm.serviceId}
                onValueChange={(value) =>
                  setNewServiceForm({ ...newServiceForm, serviceId: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Service" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableServices().map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.serviceId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="percentage">Percentage (%) *</Label>
              <Input
                id="percentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={newServiceForm.percentage || ""}
                onChange={(e) =>
                  setNewServiceForm({ ...newServiceForm, percentage: parseFloat(e.target.value) || 0 })
                }
                required
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500">
                Remaining: {(100 - totalPercentage).toFixed(2)}%
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddServiceDialogOpen(false);
                setNewServiceForm({ serviceId: "", percentage: 0 });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveService}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

