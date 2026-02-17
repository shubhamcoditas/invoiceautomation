import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface CostElement {
  id: string;
  budgetLineId: string;
  costElementId: string;
  name: string;
  description?: string;
  costType: 'Direct' | 'Indirect' | 'Common';
  serviceId?: string;
  isBudgeted?: boolean;
  financialYear?: string;
  amount?: number;
  status: string;
  metadata?: any;
  createdAt?: string;
}

interface BudgetLine {
  id: string;
  budgetLineId: string;
  name: string;
  costGroupId: string;
}

interface Service {
  id: string;
  serviceId: string;
  name: string;
  serviceGroupId: string;
}

export function CostElement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCostElement, setEditingCostElement] = useState<CostElement | null>(null);
  const [formData, setFormData] = useState({
    budgetLineId: "",
    name: "",
    description: "",
    costType: "Direct" as 'Direct' | 'Indirect' | 'Common',
    serviceId: "",
    isBudgeted: false,
    financialYear: "",
    amount: 0,
    status: "active",
    metadata: {} as any,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch budget lines for dropdown
  const { data: budgetLines = [] } = useQuery<BudgetLine[]>({
    queryKey: ["budget-lines"],
    queryFn: async () => {
      const response = await fetch("/api/budget-lines");
      if (!response.ok) {
        let errorMessage = "Failed to fetch budget lines";
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

  // Fetch services for dropdown (only for Direct costs)
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

  // Fetch cost elements
  const { data: costElements = [], isLoading } = useQuery<CostElement[]>({
    queryKey: ["cost-elements"],
    queryFn: async () => {
      const response = await fetch("/api/cost-elements");
      if (!response.ok) {
        let errorMessage = "Failed to fetch cost elements";
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

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: Partial<CostElement>) => {
      const response = await fetch("/api/cost-elements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        let errorMessage = "Failed to create cost element";
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cost-elements"] });
      toast({
        title: "Success",
        description: "Cost Element created successfully",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CostElement> }) => {
      const response = await fetch(`/api/cost-elements/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        let errorMessage = "Failed to update cost element";
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cost-elements"] });
      toast({
        title: "Success",
        description: "Cost Element updated successfully",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/cost-elements/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        let errorMessage = "Failed to delete cost element";
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cost-elements"] });
      toast({
        title: "Success",
        description: "Cost Element deleted successfully",
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

  const resetForm = () => {
    setFormData({
      budgetLineId: "",
      name: "",
      description: "",
      costType: "Direct",
      serviceId: "",
      isBudgeted: false,
      financialYear: "",
      amount: 0,
      status: "active",
      metadata: {},
    });
    setEditingCostElement(null);
  };

  const handleOpenDialog = (costElement?: CostElement) => {
    if (costElement) {
      setEditingCostElement(costElement);
      setFormData({
        budgetLineId: costElement.budgetLineId,
        name: costElement.name,
        description: costElement.description || "",
        costType: costElement.costType,
        serviceId: costElement.serviceId || "",
        isBudgeted: costElement.isBudgeted || false,
        financialYear: costElement.financialYear || "",
        amount: costElement.amount || 0,
        status: costElement.status,
        metadata: costElement.metadata || {},
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate Direct cost has service
    if (formData.costType === 'Direct' && !formData.serviceId) {
      toast({
        title: "Validation Error",
        description: "Service is required for Direct cost elements",
        variant: "destructive",
      });
      return;
    }

    if (editingCostElement) {
      // Validate Direct cost has service when editing
      if (formData.costType === 'Direct' && !formData.serviceId) {
        toast({
          title: "Validation Error",
          description: "Service is required for Direct cost elements",
          variant: "destructive",
        });
        return;
      }

      updateMutation.mutate({
        id: editingCostElement.id,
        data: {
          name: formData.name,
          description: formData.description,
          serviceId: formData.costType === 'Direct' ? formData.serviceId : undefined,
          isBudgeted: formData.isBudgeted,
          financialYear: formData.isBudgeted ? formData.financialYear : undefined,
          amount: formData.amount,
          status: formData.status,
          metadata: formData.metadata,
        },
      });
    } else {
      // Validate Budgeted fields
      if (formData.isBudgeted && !formData.financialYear) {
        toast({
          title: "Validation Error",
          description: "Financial Year is required for Budgeted cost elements",
          variant: "destructive",
        });
        return;
      }

      createMutation.mutate({
        budgetLineId: formData.budgetLineId,
        name: formData.name,
        description: formData.description,
        costType: formData.costType,
        serviceId: formData.costType === 'Direct' ? formData.serviceId : undefined,
        isBudgeted: formData.isBudgeted,
        financialYear: formData.isBudgeted ? formData.financialYear : undefined,
        amount: formData.amount,
        status: formData.status,
        metadata: formData.metadata,
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this cost element?")) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      inactive: "secondary",
      archived: "outline",
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getCostTypeBadge = (costType: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      Direct: "default",
      Indirect: "secondary",
      Common: "outline",
    };
    return (
      <Badge variant={variants[costType] || "default"}>
        {costType}
      </Badge>
    );
  };

  const getBudgetLineName = (budgetLineId: string) => {
    const budgetLine = budgetLines.find(bl => bl.id === budgetLineId);
    return budgetLine ? budgetLine.name : budgetLineId;
  };

  const getServiceName = (serviceId?: string) => {
    if (!serviceId) return "-";
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : serviceId;
  };

  // Remove duplicates based on cost element name (case-insensitive)
  const uniqueCostElements = useMemo(() => {
    const seenNames = new Map<string, CostElement>();
    
    costElements.forEach((ce) => {
      const normalizedName = ce.name.trim().toLowerCase();
      const existing = seenNames.get(normalizedName);
      
      if (!existing) {
        seenNames.set(normalizedName, ce);
      } else {
        const existingDate = existing.createdAt ? new Date(existing.createdAt).getTime() : 0;
        const currentDate = ce.createdAt ? new Date(ce.createdAt).getTime() : 0;
        
        if (currentDate > existingDate) {
          seenNames.set(normalizedName, ce);
        }
      }
    });
    
    return Array.from(seenNames.values());
  }, [costElements]);

  // Group cost elements by budget line
  const groupedByBudgetLine = useMemo(() => {
    if (uniqueCostElements.length === 0) return [];
    
    const groups = new Map<string, CostElement[]>();
    
    uniqueCostElements.forEach((ce) => {
      const budgetLineId = ce.budgetLineId;
      if (!budgetLineId) return; // Skip if no budget line
      if (!groups.has(budgetLineId)) {
        groups.set(budgetLineId, []);
      }
      groups.get(budgetLineId)!.push(ce);
    });
    
    // Sort groups by budget line name, and sort elements within each group by name
    return Array.from(groups.entries())
      .map(([budgetLineId, elements]) => {
        const budgetLine = budgetLines.find(bl => bl.id === budgetLineId);
        return {
          budgetLineId,
          budgetLineName: budgetLine ? budgetLine.name : budgetLineId,
          elements: elements.sort((a, b) => a.name.localeCompare(b.name))
        };
      })
      .sort((a, b) => a.budgetLineName.localeCompare(b.budgetLineName));
  }, [uniqueCostElements, budgetLines]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Cost Element</CardTitle>
            <Button onClick={() => handleOpenDialog()} disabled={budgetLines.length === 0}>
              <Plus className="mr-2 h-4 w-4" />
              Add Cost Element
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {budgetLines.length === 0 && (
            <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Please create a Budget Line first before creating Cost Elements.
              </p>
            </div>
          )}
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : uniqueCostElements.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No cost elements found. Click "Add Cost Element" to create one.
            </div>
          ) : groupedByBudgetLine.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No cost elements found. Click "Add Cost Element" to create one.
            </div>
          ) : (
            <Tabs defaultValue={groupedByBudgetLine[0]?.budgetLineId || ""} className="w-full">
              <div className="overflow-x-auto">
                <TabsList className="inline-flex h-auto p-1 gap-1 min-w-full">
                  {groupedByBudgetLine.map((group) => (
                    <TabsTrigger 
                      key={group.budgetLineId} 
                      value={group.budgetLineId}
                      className="flex items-center gap-2 text-xs whitespace-nowrap"
                    >
                      <span className="truncate max-w-[120px]">{group.budgetLineName}</span>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {group.elements.length}
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              {groupedByBudgetLine.map((group) => (
                <TabsContent key={group.budgetLineId} value={group.budgetLineId} className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cost Element ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Cost (Amount)</TableHead>
                        <TableHead>Cost Type</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.elements.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            No cost elements in this budget line
                          </TableCell>
                        </TableRow>
                      ) : (
                        group.elements.map((costElement) => (
                          <TableRow key={costElement.id}>
                            <TableCell>
                              <Badge variant="outline" className="text-xs text-muted-foreground font-normal">
                                {costElement.costElementId}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">{costElement.name}</TableCell>
                            <TableCell className="text-right font-medium">
                              {costElement.amount !== undefined && costElement.amount !== null
                                ? formatCurrency(costElement.amount)
                                : '-'}
                            </TableCell>
                            <TableCell>{getCostTypeBadge(costElement.costType)}</TableCell>
                            <TableCell>{getServiceName(costElement.serviceId)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenDialog(costElement)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(costElement.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCostElement ? "Edit Cost Element" : "Create New Cost Element"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="budgetLineId">Budget Line *</Label>
                <Select
                  value={formData.budgetLineId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, budgetLineId: value })
                  }
                  required
                  disabled={!!editingCostElement}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Budget Line" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetLines.map((bl) => (
                      <SelectItem key={bl.id} value={bl.id}>
                        {bl.name} ({bl.budgetLineId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!editingCostElement && (
                  <p className="text-xs text-gray-500">
                    Select the Budget Line this cost element belongs to
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="e.g., Employee Salary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter a description for this cost element"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="costType">Cost Type *</Label>
                <Select
                  value={formData.costType}
                  onValueChange={(value: 'Direct' | 'Indirect' | 'Common') => {
                    setFormData({ 
                      ...formData, 
                      costType: value,
                      serviceId: value !== 'Direct' ? "" : formData.serviceId // Clear service if not Direct
                    });
                  }}
                  required
                  disabled={!!editingCostElement}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Direct">Direct</SelectItem>
                    <SelectItem value="Indirect">Indirect</SelectItem>
                    <SelectItem value="Common">Common</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  {formData.costType === 'Direct' 
                    ? 'Direct costs must be mapped to a service at creation'
                    : formData.costType === 'Indirect'
                    ? 'Indirect costs can be allocated to multiple services via Cost Rules'
                    : 'Common costs can be allocated to multiple services via Cost Rules'}
                </p>
              </div>

              {formData.costType === 'Direct' && (
                <div className="space-y-2">
                  <Label htmlFor="serviceId">Service *</Label>
                  <Select
                    value={formData.serviceId || undefined}
                    onValueChange={(value) =>
                      setFormData({ ...formData, serviceId: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name} ({s.serviceId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Select the service this direct cost element is mapped to
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="isBudgeted">Type *</Label>
                <Select
                  value={formData.isBudgeted ? "Budgeted" : "Actual"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, isBudgeted: value === "Budgeted" })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Budgeted">Budgeted</SelectItem>
                    <SelectItem value="Actual">Actual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.isBudgeted && (
                <div className="space-y-2">
                  <Label htmlFor="financialYear">Financial Year *</Label>
                  <Select
                    value={formData.financialYear}
                    onValueChange={(value) =>
                      setFormData({ ...formData, financialYear: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Financial Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() - 5 + i;
                        const fy = `${year}-${year + 1}`;
                        return (
                          <SelectItem key={fy} value={fy}>
                            {fy}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
                  }
                  required
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingCostElement ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

