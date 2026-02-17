import { useState, useEffect, useMemo } from "react";
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
import { useAppState } from "@/hooks/use-app-state";

interface Asset {
  id: string;
  assetTypeId: string;
  assetCode: string;
  name: string;
  description?: string;
  costOfAcquisition: number;
  dateOfAcquisition: string;
  assetLife: number;
  depreciationSchedule?: DepreciationYear[];
  notes?: string;
  serviceId?: string;
  status: string;
  metadata?: any;
  createdAt?: string;
}

interface DepreciationYear {
  year: number;
  openingValue: number;
  depreciation: number;
  closingValue: number;
}

interface AssetType {
  id: string;
  typeId: string;
  name: string;
  assetClassId: string;
}

interface Service {
  id: string;
  serviceId: string;
  name: string;
  serviceGroupId: string;
}

export function Asset() {
  const { dispatch } = useAppState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [formData, setFormData] = useState({
    assetTypeId: "",
    name: "",
    description: "",
    costOfAcquisition: 0,
    dateOfAcquisition: "",
    assetLife: 0,
    notes: "",
    serviceId: "",
    status: "active",
    metadata: {} as any,
  });
  const [depreciationSchedule, setDepreciationSchedule] = useState<DepreciationYear[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch asset types for dropdown
  const { data: assetTypes = [] } = useQuery<AssetType[]>({
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

  // Fetch services for dropdown
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

  // Fetch assets
  const { data: assets = [], isLoading } = useQuery<Asset[]>({
    queryKey: ["assets"],
    queryFn: async () => {
      const response = await fetch("/api/assets");
      if (!response.ok) {
        let errorMessage = "Failed to fetch assets";
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

  // Initialize depreciation schedule when asset life or acquisition date changes
  useEffect(() => {
    // Skip if we're editing and already have a schedule loaded
    if (editingAsset && depreciationSchedule.length > 0) {
      return;
    }

    if (formData.assetLife > 0 && formData.dateOfAcquisition && formData.costOfAcquisition > 0) {
      const startYear = new Date(formData.dateOfAcquisition).getFullYear();
      const newSchedule: DepreciationYear[] = [];
      let openingValue = formData.costOfAcquisition;

      for (let i = 0; i < formData.assetLife; i++) {
        const year = startYear + i;
        newSchedule.push({
          year,
          openingValue: Math.round(openingValue * 100) / 100,
          depreciation: 0,
          closingValue: Math.round(openingValue * 100) / 100,
        });
        openingValue = Math.round(openingValue * 100) / 100;
      }

      setDepreciationSchedule(newSchedule);
    } else if (!editingAsset) {
      setDepreciationSchedule([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.assetLife, formData.dateOfAcquisition, formData.costOfAcquisition]);

  // Update closing value when depreciation changes
  const updateDepreciation = (index: number, depreciation: number) => {
    const updated = [...depreciationSchedule];
    updated[index].depreciation = Math.round(depreciation * 100) / 100;
    updated[index].closingValue = Math.round((updated[index].openingValue - updated[index].depreciation) * 100) / 100;
    
    // Update opening value for subsequent years
    for (let i = index + 1; i < updated.length; i++) {
      updated[i].openingValue = updated[i - 1].closingValue;
      updated[i].closingValue = Math.round((updated[i].openingValue - updated[i].depreciation) * 100) / 100;
    }
    
    setDepreciationSchedule(updated);
  };

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: Partial<Asset>) => {
      const response = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        let errorMessage = "Failed to create asset";
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
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast({
        title: "Success",
        description: "Asset created successfully",
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
    mutationFn: async ({ id, data }: { id: string; data: Partial<Asset> }) => {
      const response = await fetch(`/api/assets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        let errorMessage = "Failed to update asset";
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
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast({
        title: "Success",
        description: "Asset updated successfully",
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
      const response = await fetch(`/api/assets/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        let errorMessage = "Failed to delete asset";
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
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast({
        title: "Success",
        description: "Asset deleted successfully",
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
      assetTypeId: "",
      name: "",
      description: "",
      costOfAcquisition: 0,
      dateOfAcquisition: "",
      assetLife: 0,
      notes: "",
      serviceId: "",
      status: "active",
      metadata: {},
    });
    setDepreciationSchedule([]);
    setEditingAsset(null);
  };

  const handleOpenDialog = (asset?: Asset) => {
    if (asset) {
      window.history.pushState({}, '', `?assetId=${asset.id}`);
      dispatch({ type: 'SET_CURRENT_TAB', payload: 'asset-form' });
    } else {
      window.history.pushState({}, '', '');
      dispatch({ type: 'SET_CURRENT_TAB', payload: 'asset-form' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate depreciation schedule
    if (depreciationSchedule.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please set up depreciation schedule before saving",
        variant: "destructive",
      });
      return;
    }

    // Check if all depreciation values are filled
    const hasEmptyDepreciation = depreciationSchedule.some(d => d.depreciation === 0 || isNaN(d.depreciation));
    if (hasEmptyDepreciation) {
      toast({
        title: "Validation Error",
        description: "Please enter depreciation value for all years",
        variant: "destructive",
      });
      return;
    }
    
    if (editingAsset) {
      updateMutation.mutate({
        id: editingAsset.id,
        data: {
          name: formData.name,
          description: formData.description,
          costOfAcquisition: formData.costOfAcquisition,
          dateOfAcquisition: formData.dateOfAcquisition,
          assetLife: formData.assetLife,
          depreciationSchedule: depreciationSchedule,
          notes: formData.notes,
          serviceId: formData.serviceId || undefined,
          status: formData.status,
          metadata: formData.metadata,
        },
      });
    } else {
      createMutation.mutate({
        assetTypeId: formData.assetTypeId,
        name: formData.name,
        description: formData.description,
        costOfAcquisition: formData.costOfAcquisition,
        dateOfAcquisition: formData.dateOfAcquisition,
        assetLife: formData.assetLife,
        depreciationSchedule: depreciationSchedule,
        notes: formData.notes,
        serviceId: formData.serviceId || undefined,
        status: formData.status,
        metadata: formData.metadata,
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this asset?")) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      inactive: "secondary",
      archived: "outline",
      disposed: "destructive",
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getAssetTypeName = (assetTypeId: string) => {
    const assetType = assetTypes.find(at => at.id === assetTypeId);
    return assetType ? assetType.name : assetTypeId;
  };

  const getServiceName = (serviceId?: string) => {
    if (!serviceId) return "-";
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : serviceId;
  };

  // Remove duplicates based on asset name (case-insensitive)
  const uniqueAssets = useMemo(() => {
    const seenNames = new Map<string, Asset>();
    
    assets.forEach((a) => {
      const normalizedName = a.name.trim().toLowerCase();
      const existing = seenNames.get(normalizedName);
      
      if (!existing) {
        seenNames.set(normalizedName, a);
      } else {
        const existingDate = existing.createdAt ? new Date(existing.createdAt).getTime() : 0;
        const currentDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        
        if (currentDate > existingDate) {
          seenNames.set(normalizedName, a);
        }
      }
    });
    
    return Array.from(seenNames.values());
  }, [assets]);

  // Group assets by Asset Type
  const groupedByAssetType = useMemo(() => {
    const groups = new Map<string, Asset[]>();
    
    uniqueAssets.forEach((asset) => {
      const assetTypeId = asset.assetTypeId;
      if (!groups.has(assetTypeId)) {
        groups.set(assetTypeId, []);
      }
      groups.get(assetTypeId)!.push(asset);
    });
    
    return Array.from(groups.entries())
      .map(([assetTypeId, assets]) => {
        const assetType = assetTypes.find(at => at.id === assetTypeId);
        return {
          assetTypeId,
          assetTypeName: assetType ? assetType.name : assetTypeId,
          assets: assets.sort((a, b) => a.name.localeCompare(b.name))
        };
      })
      .sort((a, b) => a.assetTypeName.localeCompare(b.assetTypeName));
  }, [uniqueAssets, assetTypes]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Assets</CardTitle>
            <Button onClick={() => handleOpenDialog()} disabled={assetTypes.length === 0}>
              <Plus className="mr-2 h-4 w-4" />
              Add Asset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {assetTypes.length === 0 && (
            <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Please create an Asset Type first before creating Assets.
              </p>
            </div>
          )}
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : uniqueAssets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No assets found. Click "Add Asset" to create one.
            </div>
          ) : (
            <Tabs defaultValue={groupedByAssetType[0]?.assetTypeId || ""} className="w-full">
              <div className="overflow-x-auto">
                <TabsList className="inline-flex h-auto p-1 gap-1 min-w-full">
                  {groupedByAssetType.map((group) => (
                    <TabsTrigger 
                      key={group.assetTypeId} 
                      value={group.assetTypeId}
                      className="flex items-center gap-2 text-xs whitespace-nowrap"
                    >
                      <span className="truncate max-w-[120px]">{group.assetTypeName}</span>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {group.assets.length}
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              {groupedByAssetType.map((group) => (
                <TabsContent key={group.assetTypeId} value={group.assetTypeId} className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Cost of Acquisition</TableHead>
                        <TableHead>Date of Acquisition</TableHead>
                        <TableHead>Asset Life (Years)</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.assets.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                            No assets in this asset type
                          </TableCell>
                        </TableRow>
                      ) : (
                        group.assets.map((asset) => (
                          <TableRow key={asset.id}>
                            <TableCell>
                              <Badge variant="outline" className="text-xs text-muted-foreground font-normal">
                                {asset.assetCode}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">{asset.name}</TableCell>
                            <TableCell>{getServiceName(asset.serviceId)}</TableCell>
                            <TableCell>{formatCurrency(asset.costOfAcquisition)}</TableCell>
                            <TableCell>
                              {new Date(asset.dateOfAcquisition).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{asset.assetLife}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenDialog(asset)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(asset.id)}
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
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAsset ? "Edit Asset" : "Create New Asset"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="assetTypeId">Asset Type *</Label>
                  <Select
                    value={formData.assetTypeId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, assetTypeId: value })
                    }
                    required
                    disabled={!!editingAsset}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Asset Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {assetTypes.map((at) => (
                        <SelectItem key={at.id} value={at.id}>
                          {at.name} ({at.typeId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!editingAsset && (
                    <p className="text-xs text-gray-500">
                      Select the Asset Type this asset belongs to
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
                    placeholder="e.g., Dell Laptop - Model XYZ"
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
                    placeholder="Enter a description for this asset"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="costOfAcquisition">Cost of Acquisition (₹) *</Label>
                    <Input
                      id="costOfAcquisition"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.costOfAcquisition}
                      onChange={(e) =>
                        setFormData({ ...formData, costOfAcquisition: parseFloat(e.target.value) || 0 })
                      }
                      required
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfAcquisition">Date of Acquisition *</Label>
                    <Input
                      id="dateOfAcquisition"
                      type="date"
                      value={formData.dateOfAcquisition}
                      onChange={(e) =>
                        setFormData({ ...formData, dateOfAcquisition: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assetLife">Asset Life (Years) *</Label>
                  <Input
                    id="assetLife"
                    type="number"
                    min="1"
                    value={formData.assetLife}
                    onChange={(e) =>
                      setFormData({ ...formData, assetLife: parseInt(e.target.value) || 0 })
                    }
                    required
                    placeholder="e.g., 5"
                  />
                  <p className="text-xs text-gray-500">
                    Expected useful life of the asset in years
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceId">Service</Label>
                  <Select
                    value={formData.serviceId || undefined}
                    onValueChange={(value) =>
                      setFormData({ ...formData, serviceId: value || "" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Service (Optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} ({service.serviceId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.serviceId && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => setFormData({ ...formData, serviceId: "" })}
                    >
                      Clear Selection
                    </Button>
                  )}
                  <p className="text-xs text-gray-500">
                    Map this asset to a service (optional)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Additional notes about the asset"
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
                      <SelectItem value="disposed">Disposed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
            </div>

            {/* Depreciation Schedule Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-lg font-semibold">Depreciation Schedule *</h3>
                {depreciationSchedule.length > 0 && (
                  <div className="text-sm text-gray-500">
                    Total Depreciation: {formatCurrency(
                      depreciationSchedule.reduce((sum, d) => sum + d.depreciation, 0)
                    )}
                  </div>
                )}
              </div>
              
              {formData.costOfAcquisition > 0 && formData.assetLife > 0 && formData.dateOfAcquisition ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Enter depreciation value for each year. Closing value will be calculated automatically.
                  </p>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Year</TableHead>
                          <TableHead className="text-right">Opening Value (₹)</TableHead>
                          <TableHead className="text-right">Depreciation (₹) *</TableHead>
                          <TableHead className="text-right">Closing Value (₹)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {depreciationSchedule.map((year, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{year.year}</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(year.openingValue)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max={year.openingValue}
                                value={year.depreciation || ""}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value) || 0;
                                  updateDepreciation(index, value);
                                }}
                                className="w-32 ml-auto"
                                placeholder="0.00"
                                required
                              />
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatCurrency(year.closingValue)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <p className="text-xs text-gray-500">
                    * Depreciation is mandatory for all years. Closing value = Opening Value - Depreciation
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 border rounded-lg bg-gray-50 dark:bg-gray-900">
                  Please fill in Cost of Acquisition, Date of Acquisition, and Asset Life to set up depreciation schedule.
                </div>
              )}
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
                {editingAsset ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

