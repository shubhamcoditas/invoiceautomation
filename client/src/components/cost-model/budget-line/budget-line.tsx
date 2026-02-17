import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";

interface BudgetLine {
  id: string;
  costGroupId: string;
  budgetLineId: string;
  name: string;
  description?: string;
  status: string;
  metadata?: any;
  createdAt?: string;
}

interface BudgetLineBudget {
  id: string;
  budgetLineId: string;
  financialYear: string;
  budgetAmount: number;
  status: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CostGroup {
  id: string;
  costGroupId: string;
  name: string;
  verticalId: string;
}

export function BudgetLine() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [selectedBudgetLine, setSelectedBudgetLine] = useState<BudgetLine | null>(null);
  const [editingBudgetLine, setEditingBudgetLine] = useState<BudgetLine | null>(null);
  const [editingBudget, setEditingBudget] = useState<BudgetLineBudget | null>(null);
  const [formData, setFormData] = useState({
    costGroupId: "",
    name: "",
    description: "",
    status: "active",
    metadata: {} as any,
  });
  const [budgetFormData, setBudgetFormData] = useState({
    financialYear: "",
    budgetAmount: 0,
    notes: "",
  });
  const [selectedFinancialYear, setSelectedFinancialYear] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Generate financial year options (current year and next 2 years)
  const financialYearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // 0-11
    // Financial year typically starts in April (month 3)
    // If current month is April or later, current financial year is currentYear-currentYear+1
    // Otherwise, it's previousYear-currentYear
    const startYear = currentMonth >= 3 ? currentYear : currentYear - 1;
    const years: string[] = [];
    for (let i = 0; i < 3; i++) {
      const year = startYear + i;
      years.push(`${year}-${(year + 1).toString().slice(-2)}`);
    }
    return years;
  }, []);

  // Fetch cost groups for dropdown
  const { data: costGroups = [] } = useQuery<CostGroup[]>({
    queryKey: ["cost-groups"],
    queryFn: async () => {
      const response = await fetch("/api/cost-groups");
      if (!response.ok) {
        let errorMessage = "Failed to fetch cost groups";
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

  // Fetch budget lines
  const { data: budgetLines = [], isLoading } = useQuery<BudgetLine[]>({
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

  // Fetch budgets for all budget lines (for current financial year by default)
  const financialYear = selectedFinancialYear || financialYearOptions[0];
  const { data: budgetsMap = {} } = useQuery<Record<string, BudgetLineBudget>>({
    queryKey: ["budget-line-budgets", financialYear, budgetLines.map(bl => bl.id).join(',')],
    queryFn: async () => {
      const budgets: Record<string, BudgetLineBudget> = {};
      
      // Fetch budgets for each budget line
      await Promise.all(
        budgetLines.map(async (bl) => {
          try {
            const response = await fetch(`/api/budget-lines/${bl.id}/budgets?financialYear=${financialYear}`);
            if (response.ok) {
              const budgetData = await response.json();
              if (budgetData && budgetData.length > 0) {
                budgets[bl.id] = budgetData[0];
              }
            }
          } catch (e) {
            // Ignore errors for individual budget fetches
          }
        })
      );
      
      return budgets;
    },
    enabled: budgetLines.length > 0,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: Partial<BudgetLine>) => {
      const response = await fetch("/api/budget-lines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        let errorMessage = "Failed to create budget line";
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
      queryClient.invalidateQueries({ queryKey: ["budget-lines"] });
      toast({
        title: "Success",
        description: "Budget Line created successfully",
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
    mutationFn: async ({ id, data }: { id: string; data: Partial<BudgetLine> }) => {
      const response = await fetch(`/api/budget-lines/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        let errorMessage = "Failed to update budget line";
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
      queryClient.invalidateQueries({ queryKey: ["budget-lines"] });
      toast({
        title: "Success",
        description: "Budget Line updated successfully",
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
      const response = await fetch(`/api/budget-lines/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        let errorMessage = "Failed to delete budget line";
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
      queryClient.invalidateQueries({ queryKey: ["budget-lines"] });
      toast({
        title: "Success",
        description: "Budget Line deleted successfully",
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
      costGroupId: "",
      name: "",
      description: "",
      status: "active",
      metadata: {},
    });
    setEditingBudgetLine(null);
  };

  const handleOpenDialog = (budgetLine?: BudgetLine) => {
    if (budgetLine) {
      setEditingBudgetLine(budgetLine);
      setFormData({
        costGroupId: budgetLine.costGroupId,
        name: budgetLine.name,
        description: budgetLine.description || "",
        status: budgetLine.status,
        metadata: budgetLine.metadata || {},
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBudgetLine) {
      updateMutation.mutate({
        id: editingBudgetLine.id,
        data: {
          name: formData.name,
          description: formData.description,
          status: formData.status,
          metadata: formData.metadata,
        },
      });
    } else {
      createMutation.mutate({
        costGroupId: formData.costGroupId,
        name: formData.name,
        description: formData.description,
        status: formData.status,
        metadata: formData.metadata,
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this budget line?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenBudgetDialog = (budgetLine: BudgetLine) => {
    setSelectedBudgetLine(budgetLine);
    setEditingBudget(null);
    setBudgetFormData({
      financialYear: selectedFinancialYear || financialYearOptions[0],
      budgetAmount: 0,
      notes: "",
    });
    setIsBudgetDialogOpen(true);
  };

  const handleEditBudget = async (budgetLine: BudgetLine) => {
    setSelectedBudgetLine(budgetLine);
    const financialYear = selectedFinancialYear || financialYearOptions[0];
    const existingBudget = getBudgetForBudgetLine(budgetLine.id);
    
    if (existingBudget) {
      setEditingBudget(existingBudget);
      setBudgetFormData({
        financialYear: existingBudget.financialYear,
        budgetAmount: existingBudget.budgetAmount,
        notes: existingBudget.notes || "",
      });
    } else {
      setEditingBudget(null);
      setBudgetFormData({
        financialYear: financialYear,
        budgetAmount: 0,
        notes: "",
      });
    }
    setIsBudgetDialogOpen(true);
  };

  // Create/Update budget mutation
  const budgetMutation = useMutation({
    mutationFn: async (data: { budgetLineId: string; financialYear: string; budgetAmount: number; notes?: string }) => {
      if (editingBudget) {
        const response = await fetch(`/api/budget-line-budgets/${editingBudget.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            budgetAmount: data.budgetAmount,
            notes: data.notes,
          }),
        });
        if (!response.ok) {
          let errorMessage = "Failed to update budget";
          try {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const error = await response.json();
              errorMessage = error.error || errorMessage;
            } else {
              const text = await response.text();
              errorMessage = `Server error: ${response.status} ${response.statusText}`;
              console.error("Non-JSON response:", text.substring(0, 200));
            }
          } catch (e) {
            errorMessage = `Server error: ${response.status} ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }
        return response.json();
      } else {
        const url = `/api/budget-lines/${data.budgetLineId}/budgets`;
        const payload = {
          financialYear: data.financialYear,
          budgetAmount: data.budgetAmount,
          notes: data.notes,
        };
        console.log('[DEBUG] Creating budget:', { url, payload });
        
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        console.log('[DEBUG] Response status:', response.status);
        console.log('[DEBUG] Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
          let errorMessage = "Failed to create budget";
          try {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const error = await response.json();
              errorMessage = error.error || errorMessage;
            } else {
              const text = await response.text();
              errorMessage = `Server error: ${response.status} ${response.statusText}. The server may need to be restarted.`;
              console.error("Non-JSON response (first 500 chars):", text.substring(0, 500));
            }
          } catch (e) {
            errorMessage = `Server error: ${response.status} ${response.statusText}. The server may need to be restarted.`;
            console.error("Error parsing response:", e);
          }
          throw new Error(errorMessage);
        }
        
        const result = await response.json();
        console.log('[DEBUG] Budget created successfully');
        return result;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-line-budgets"] });
      toast({
        title: "Success",
        description: editingBudget ? "Budget updated successfully" : "Budget created successfully",
      });
      setIsBudgetDialogOpen(false);
      setSelectedBudgetLine(null);
      setEditingBudget(null);
      setBudgetFormData({
        financialYear: selectedFinancialYear || financialYearOptions[0],
        budgetAmount: 0,
        notes: "",
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

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBudgetLine) return;

    if (!budgetFormData.financialYear) {
      toast({
        title: "Validation Error",
        description: "Please select a financial year",
        variant: "destructive",
      });
      return;
    }

    if (budgetFormData.budgetAmount <= 0) {
      toast({
        title: "Validation Error",
        description: "Budget amount must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    budgetMutation.mutate({
      budgetLineId: selectedBudgetLine.id,
      financialYear: budgetFormData.financialYear,
      budgetAmount: budgetFormData.budgetAmount,
      notes: budgetFormData.notes,
    });
  };

  const getBudgetForBudgetLine = (budgetLineId: string): BudgetLineBudget | null => {
    return budgetsMap[budgetLineId] || null;
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

  const getCostGroupName = (costGroupId: string) => {
    const costGroup = costGroups.find(cg => cg.id === costGroupId);
    return costGroup ? costGroup.name : costGroupId;
  };

  // Remove duplicates based on budget line name (case-insensitive)
  const uniqueBudgetLines = useMemo(() => {
    const seenNames = new Map<string, BudgetLine>();
    
    budgetLines.forEach((bl) => {
      const normalizedName = bl.name.trim().toLowerCase();
      const existing = seenNames.get(normalizedName);
      
      if (!existing) {
        seenNames.set(normalizedName, bl);
      } else {
        const existingDate = existing.createdAt ? new Date(existing.createdAt).getTime() : 0;
        const currentDate = bl.createdAt ? new Date(bl.createdAt).getTime() : 0;
        
        if (currentDate > existingDate) {
          seenNames.set(normalizedName, bl);
        }
      }
    });
    
    return Array.from(seenNames.values());
  }, [budgetLines]);

  // Group budget lines by Cost Group
  const groupedByCostGroup = useMemo(() => {
    const groups = new Map<string, BudgetLine[]>();
    
    uniqueBudgetLines.forEach((budgetLine) => {
      const costGroupId = budgetLine.costGroupId;
      if (!groups.has(costGroupId)) {
        groups.set(costGroupId, []);
      }
      groups.get(costGroupId)!.push(budgetLine);
    });
    
    return Array.from(groups.entries())
      .map(([costGroupId, budgetLines]) => {
        const costGroup = costGroups.find(cg => cg.id === costGroupId);
        return {
          costGroupId,
          costGroupName: costGroup ? costGroup.name : costGroupId,
          budgetLines: budgetLines.sort((a, b) => a.name.localeCompare(b.name))
        };
      })
      .sort((a, b) => a.costGroupName.localeCompare(b.costGroupName));
  }, [uniqueBudgetLines, costGroups]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Budget Line</CardTitle>
            <div className="flex items-center gap-2">
              <Select
                value={selectedFinancialYear || financialYearOptions[0]}
                onValueChange={(value) => {
                  setSelectedFinancialYear(value);
                  queryClient.invalidateQueries({ queryKey: ["budget-line-budgets"] });
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Financial Year" />
                </SelectTrigger>
                <SelectContent>
                  {financialYearOptions.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={() => handleOpenDialog()} disabled={costGroups.length === 0}>
                <Plus className="mr-2 h-4 w-4" />
                Add Budget Line
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {costGroups.length === 0 && (
            <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Please create a Cost Group first before creating Budget Lines.
              </p>
            </div>
          )}
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : uniqueBudgetLines.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No budget lines found. Click "Add Budget Line" to create one.
            </div>
          ) : (
            <Tabs defaultValue={groupedByCostGroup[0]?.costGroupId || ""} className="w-full">
              <div className="overflow-x-auto">
                <TabsList className="inline-flex h-auto p-1 gap-1 min-w-full">
                  {groupedByCostGroup.map((group) => (
                    <TabsTrigger 
                      key={group.costGroupId} 
                      value={group.costGroupId}
                      className="flex items-center gap-2 text-xs whitespace-nowrap"
                    >
                      <span className="truncate max-w-[120px]">{group.costGroupName}</span>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {group.budgetLines.length}
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              {groupedByCostGroup.map((group) => (
                <TabsContent key={group.costGroupId} value={group.costGroupId} className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Budget Line ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Budget ({selectedFinancialYear || financialYearOptions[0]})</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.budgetLines.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            No budget lines in this cost group
                          </TableCell>
                        </TableRow>
                      ) : (
                        group.budgetLines.map((budgetLine) => {
                          const budget = getBudgetForBudgetLine(budgetLine.id);
                          return (
                            <TableRow key={budgetLine.id}>
                              <TableCell>
                                <Badge variant="outline" className="text-xs text-muted-foreground font-normal">
                                  {budgetLine.budgetLineId}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">{budgetLine.name}</TableCell>
                              <TableCell className="max-w-xs truncate">
                                {budgetLine.description || "-"}
                              </TableCell>
                              <TableCell className="text-right">
                                {budget ? (
                                  <span className="font-semibold text-green-600 dark:text-green-400">
                                    {formatCurrency(budget.budgetAmount)}
                                  </span>
                                ) : (
                                  <span className="text-gray-400 text-sm">Not Set</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {budgetLine.createdAt
                                  ? new Date(budgetLine.createdAt).toLocaleDateString()
                                  : "-"}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditBudget(budgetLine)}
                                    title="Set/Edit Budget"
                                  >
                                    <DollarSign className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleOpenDialog(budgetLine)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(budgetLine.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingBudgetLine ? "Edit Budget Line" : "Create New Budget Line"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="costGroupId">Cost Group *</Label>
                <Select
                  value={formData.costGroupId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, costGroupId: value })
                  }
                  required
                  disabled={!!editingBudgetLine}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Cost Group" />
                  </SelectTrigger>
                  <SelectContent>
                    {costGroups.map((cg) => (
                      <SelectItem key={cg.id} value={cg.id}>
                        {cg.name} ({cg.costGroupId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!editingBudgetLine && (
                  <p className="text-xs text-gray-500">
                    Select the Cost Group this budget line belongs to
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
                  placeholder="e.g., Employee Salaries"
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
                  placeholder="Enter a description for this budget line"
                  rows={3}
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
                {editingBudgetLine ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Budget Dialog */}
      <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingBudget ? "Edit Budget" : "Set Budget"} - {selectedBudgetLine?.name}
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
                    {financialYearOptions.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {editingBudget && (
                  <p className="text-xs text-gray-500">
                    Financial year cannot be changed after budget is created
                  </p>
                )}
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
                <p className="text-xs text-gray-500">
                  Enter the total budget amount for this financial year
                </p>
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
                  setSelectedBudgetLine(null);
                  setEditingBudget(null);
                  setBudgetFormData({
                    financialYear: selectedFinancialYear || financialYearOptions[0],
                    budgetAmount: 0,
                    notes: "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={budgetMutation.isPending}
              >
                {editingBudget ? "Update" : "Set"} Budget
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

