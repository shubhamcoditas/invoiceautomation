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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface AssetType {
  id: string;
  assetClassId: string;
  typeId: string;
  name: string;
  description?: string;
  status: string;
  metadata?: any;
  createdAt?: string;
}

interface AssetClass {
  id: string;
  classId: string;
  name: string;
}

export function AssetType() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAssetType, setEditingAssetType] = useState<AssetType | null>(null);
  const [formData, setFormData] = useState({
    assetClassId: "",
    name: "",
    description: "",
    status: "active",
    metadata: {} as any,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch asset classes for dropdown
  const { data: assetClasses = [] } = useQuery<AssetClass[]>({
    queryKey: ["asset-classes"],
    queryFn: async () => {
      const response = await fetch("/api/asset-class");
      if (!response.ok) {
        let errorMessage = "Failed to fetch asset classes";
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

  // Fetch asset types
  const { data: assetTypes = [], isLoading } = useQuery<AssetType[]>({
    queryKey: ["asset-types"],
    queryFn: async () => {
      const response = await fetch("/api/asset-type");
      if (!response.ok) {
        let errorMessage = "Failed to fetch asset types";
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
    mutationFn: async (data: Partial<AssetType>) => {
      const response = await fetch("/api/asset-type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        let errorMessage = "Failed to create asset type";
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
      queryClient.invalidateQueries({ queryKey: ["asset-types"] });
      toast({
        title: "Success",
        description: "Asset Type created successfully",
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
    mutationFn: async ({ id, data }: { id: string; data: Partial<AssetType> }) => {
      const response = await fetch(`/api/asset-type/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        let errorMessage = "Failed to update asset type";
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
      queryClient.invalidateQueries({ queryKey: ["asset-types"] });
      toast({
        title: "Success",
        description: "Asset Type updated successfully",
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
      const response = await fetch(`/api/asset-type/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        let errorMessage = "Failed to delete asset type";
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
      queryClient.invalidateQueries({ queryKey: ["asset-types"] });
      toast({
        title: "Success",
        description: "Asset Type deleted successfully",
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
      assetClassId: "",
      name: "",
      description: "",
      status: "active",
      metadata: {},
    });
    setEditingAssetType(null);
  };

  const handleOpenDialog = (assetType?: AssetType) => {
    if (assetType) {
      setEditingAssetType(assetType);
      setFormData({
        assetClassId: assetType.assetClassId,
        name: assetType.name,
        description: assetType.description || "",
        status: assetType.status,
        metadata: assetType.metadata || {},
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAssetType) {
      updateMutation.mutate({
        id: editingAssetType.id,
        data: {
          name: formData.name,
          description: formData.description,
          status: formData.status,
          metadata: formData.metadata,
        },
      });
    } else {
      createMutation.mutate({
        assetClassId: formData.assetClassId,
        name: formData.name,
        description: formData.description,
        status: formData.status,
        metadata: formData.metadata,
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this asset type?")) {
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

  const getAssetClassName = (assetClassId: string) => {
    const assetClass = assetClasses.find(ac => ac.id === assetClassId);
    return assetClass ? assetClass.name : assetClassId;
  };

  // Remove duplicates based on asset type name (case-insensitive)
  const uniqueAssetTypes = useMemo(() => {
    const seenNames = new Map<string, AssetType>();
    
    assetTypes.forEach((at) => {
      const normalizedName = at.name.trim().toLowerCase();
      const existing = seenNames.get(normalizedName);
      
      if (!existing) {
        seenNames.set(normalizedName, at);
      } else {
        const existingDate = existing.createdAt ? new Date(existing.createdAt).getTime() : 0;
        const currentDate = at.createdAt ? new Date(at.createdAt).getTime() : 0;
        
        if (currentDate > existingDate) {
          seenNames.set(normalizedName, at);
        }
      }
    });
    
    return Array.from(seenNames.values());
  }, [assetTypes]);

  // Group asset types by Asset Class
  const groupedAssetTypes = useMemo(() => {
    const grouped = new Map<string, AssetType[]>();
    
    uniqueAssetTypes.forEach((assetType) => {
      const assetClassId = assetType.assetClassId;
      if (!grouped.has(assetClassId)) {
        grouped.set(assetClassId, []);
      }
      grouped.get(assetClassId)!.push(assetType);
    });

    // Convert to array and sort by Asset Class name
    return Array.from(grouped.entries())
      .map(([assetClassId, types]) => ({
        assetClassId,
        assetClassName: getAssetClassName(assetClassId),
        types: types.sort((a, b) => a.name.localeCompare(b.name))
      }))
      .sort((a, b) => a.assetClassName.localeCompare(b.assetClassName));
  }, [uniqueAssetTypes, assetClasses]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Asset Type</CardTitle>
            <Button onClick={() => handleOpenDialog()} disabled={assetClasses.length === 0}>
              <Plus className="mr-2 h-4 w-4" />
              Add Asset Type
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {assetClasses.length === 0 && (
            <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Please create an Asset Class first before creating Asset Types.
              </p>
            </div>
          )}
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : assetTypes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No asset types found. Click "Add Asset Type" to create one.
            </div>
          ) : (
            <Tabs defaultValue={groupedAssetTypes[0]?.assetClassId || ""} className="w-full">
              <div className="overflow-x-auto">
                <TabsList className="inline-flex h-auto p-1 gap-1 min-w-full">
                  {groupedAssetTypes.map((group) => (
                    <TabsTrigger 
                      key={group.assetClassId} 
                      value={group.assetClassId}
                      className="flex items-center gap-2 text-xs whitespace-nowrap"
                    >
                      <span className="truncate max-w-[120px]">{group.assetClassName}</span>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {group.types.length}
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              {groupedAssetTypes.map((group) => (
                <TabsContent key={group.assetClassId} value={group.assetClassId} className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.types.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                            No asset types in this group
                          </TableCell>
                        </TableRow>
                      ) : (
                        group.types.map((assetType) => (
                          <TableRow key={assetType.id}>
                            <TableCell>
                              <Badge variant="outline" className="text-xs text-muted-foreground font-normal">
                                {assetType.typeId}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">{assetType.name}</TableCell>
                            <TableCell className="max-w-xs truncate">
                              {assetType.description || "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenDialog(assetType)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(assetType.id)}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingAssetType ? "Edit Asset Type" : "Create New Asset Type"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="assetClassId">Asset Class *</Label>
                <Select
                  value={formData.assetClassId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, assetClassId: value })
                  }
                  required
                  disabled={!!editingAssetType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Asset Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {assetClasses.map((ac) => (
                      <SelectItem key={ac.id} value={ac.id}>
                        {ac.name} ({ac.classId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!editingAssetType && (
                  <p className="text-xs text-gray-500">
                    Select the Asset Class this type belongs to
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
                  placeholder="e.g., Office Desk"
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
                  placeholder="Enter a description for this asset type"
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
                {editingAssetType ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

