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

interface CostGroup {
  id: string;
  verticalId: string;
  costGroupId: string;
  name: string;
  description?: string;
  status: string;
  metadata?: any;
  createdAt?: string;
}

interface Vertical {
  id: string;
  verticalId: string;
  name: string;
}

export function CostGroup() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCostGroup, setEditingCostGroup] = useState<CostGroup | null>(null);
  const [formData, setFormData] = useState({
    verticalId: "",
    name: "",
    description: "",
    status: "active",
    metadata: {} as any,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch verticals for dropdown
  const { data: verticals = [] } = useQuery<Vertical[]>({
    queryKey: ["verticals"],
    queryFn: async () => {
      const response = await fetch("/api/verticals");
      if (!response.ok) {
        let errorMessage = "Failed to fetch verticals";
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

  // Fetch cost groups
  const { data: costGroups = [], isLoading } = useQuery<CostGroup[]>({
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

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: Partial<CostGroup>) => {
      const response = await fetch("/api/cost-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        let errorMessage = "Failed to create cost group";
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
      queryClient.invalidateQueries({ queryKey: ["cost-groups"] });
      toast({
        title: "Success",
        description: "Cost Group created successfully",
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
    mutationFn: async ({ id, data }: { id: string; data: Partial<CostGroup> }) => {
      const response = await fetch(`/api/cost-groups/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        let errorMessage = "Failed to update cost group";
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
      queryClient.invalidateQueries({ queryKey: ["cost-groups"] });
      toast({
        title: "Success",
        description: "Cost Group updated successfully",
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
      const response = await fetch(`/api/cost-groups/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        let errorMessage = "Failed to delete cost group";
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
      queryClient.invalidateQueries({ queryKey: ["cost-groups"] });
      toast({
        title: "Success",
        description: "Cost Group deleted successfully",
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
      verticalId: "",
      name: "",
      description: "",
      status: "active",
      metadata: {},
    });
    setEditingCostGroup(null);
  };

  const handleOpenDialog = (costGroup?: CostGroup) => {
    if (costGroup) {
      setEditingCostGroup(costGroup);
      setFormData({
        verticalId: costGroup.verticalId,
        name: costGroup.name,
        description: costGroup.description || "",
        status: costGroup.status,
        metadata: costGroup.metadata || {},
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCostGroup) {
      updateMutation.mutate({
        id: editingCostGroup.id,
        data: {
          name: formData.name,
          description: formData.description,
          status: formData.status,
          metadata: formData.metadata,
        },
      });
    } else {
      createMutation.mutate({
        verticalId: formData.verticalId,
        name: formData.name,
        description: formData.description,
        status: formData.status,
        metadata: formData.metadata,
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this cost group?")) {
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

  const getVerticalName = (verticalId: string) => {
    const vertical = verticals.find(v => v.id === verticalId);
    return vertical ? vertical.name : verticalId;
  };

  // Remove duplicates based on cost group name (case-insensitive)
  const uniqueCostGroups = useMemo(() => {
    const seenNames = new Map<string, CostGroup>();
    
    costGroups.forEach((cg) => {
      const normalizedName = cg.name.trim().toLowerCase();
      const existing = seenNames.get(normalizedName);
      
      if (!existing) {
        seenNames.set(normalizedName, cg);
      } else {
        const existingDate = existing.createdAt ? new Date(existing.createdAt).getTime() : 0;
        const currentDate = cg.createdAt ? new Date(cg.createdAt).getTime() : 0;
        
        if (currentDate > existingDate) {
          seenNames.set(normalizedName, cg);
        }
      }
    });
    
    return Array.from(seenNames.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [costGroups]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Cost Group</CardTitle>
            <Button onClick={() => handleOpenDialog()} disabled={verticals.length === 0}>
              <Plus className="mr-2 h-4 w-4" />
              Add Cost Group
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {verticals.length === 0 && (
            <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Please create a Vertical first before creating Cost Groups.
              </p>
            </div>
          )}
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : uniqueCostGroups.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No cost groups found. Click "Add Cost Group" to create one.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vertical</TableHead>
                  <TableHead>Cost Group ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uniqueCostGroups.map((costGroup) => (
                  <TableRow key={costGroup.id}>
                    <TableCell>{getVerticalName(costGroup.verticalId)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs text-muted-foreground font-normal">
                        {costGroup.costGroupId}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{costGroup.name}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {costGroup.description || "-"}
                    </TableCell>
                    <TableCell>
                      {costGroup.createdAt
                        ? new Date(costGroup.createdAt).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(costGroup)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(costGroup.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCostGroup ? "Edit Cost Group" : "Create New Cost Group"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="verticalId">Vertical *</Label>
                <Select
                  value={formData.verticalId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, verticalId: value })
                  }
                  required
                  disabled={!!editingCostGroup}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Vertical" />
                  </SelectTrigger>
                  <SelectContent>
                    {verticals.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.name} ({v.verticalId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!editingCostGroup && (
                  <p className="text-xs text-gray-500">
                    Select the Vertical this cost group belongs to
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
                  placeholder="e.g., IT Costs"
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
                  placeholder="Enter a description for this cost group"
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
                {editingCostGroup ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

