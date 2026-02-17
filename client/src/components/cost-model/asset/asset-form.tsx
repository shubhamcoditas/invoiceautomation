import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Edit, Trash2, X, CheckCircle2, AlertCircle, Circle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
  serviceMappingType?: 'Direct' | 'Indirect';
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

interface AssetServiceAllocation {
  id: string;
  assetId: string;
  serviceId: string;
  percentage: number;
  status: string;
}

interface AssetFormProps {
  assetId?: string;
}

export function AssetForm({ assetId }: AssetFormProps) {
  const { dispatch } = useAppState();
  const [formData, setFormData] = useState({
    assetTypeId: "",
    name: "",
    description: "",
    costOfAcquisition: 0,
    dateOfAcquisition: "",
    assetLife: 0,
    notes: "",
    serviceId: "",
    serviceMappingType: "" as '' | 'Direct' | 'Indirect',
    status: "active",
    metadata: {} as any,
  });
  const [depreciationSchedule, setDepreciationSchedule] = useState<DepreciationYear[]>([]);
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState<AssetServiceAllocation | null>(null);
  const [newServiceForm, setNewServiceForm] = useState({
    serviceId: "",
    percentage: 0,
  });
  const [pendingAllocations, setPendingAllocations] = useState<AssetServiceAllocation[]>([]);
  const [pendingDeletes, setPendingDeletes] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch asset types for dropdown
  const { data: assetTypes = [] } = useQuery<AssetType[]>({
    queryKey: ["asset-types"],
    queryFn: async () => {
      const response = await fetch("/api/asset-type");
      if (!response.ok) throw new Error("Failed to fetch asset types");
      return response.json();
    },
  });

  // Fetch services for dropdown
  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await fetch("/api/services");
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    },
  });

  // Fetch asset if editing
  const { data: asset, isLoading: isLoadingAsset } = useQuery<Asset>({
    queryKey: ["asset", assetId],
    queryFn: async () => {
      const response = await fetch(`/api/assets/${assetId}`);
      if (!response.ok) throw new Error("Failed to fetch asset");
      return response.json();
    },
    enabled: !!assetId,
  });

  // Fetch existing allocations if editing and mapping type is Indirect
  const { data: existingAllocations = [] } = useQuery<AssetServiceAllocation[]>({
    queryKey: ["asset-service-allocations", assetId],
    queryFn: async () => {
      const response = await fetch(`/api/assets/${assetId}/service-allocations`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!assetId && formData.serviceMappingType === 'Indirect',
    onSuccess: (data) => {
      setPendingAllocations([]);
      setPendingDeletes(new Set());
    },
  });

  // Initialize form when asset is loaded
  useEffect(() => {
    if (asset) {
      setFormData({
        assetTypeId: asset.assetTypeId,
        name: asset.name,
        description: asset.description || "",
        costOfAcquisition: asset.costOfAcquisition,
        dateOfAcquisition: asset.dateOfAcquisition,
        assetLife: asset.assetLife,
        notes: asset.notes || "",
        serviceId: asset.serviceId || "",
        serviceMappingType: asset.serviceMappingType || "",
        status: asset.status,
        metadata: asset.metadata || {},
      });
      if (asset.depreciationSchedule && asset.depreciationSchedule.length > 0) {
        setDepreciationSchedule(asset.depreciationSchedule);
      }
    }
  }, [asset]);

  // Initialize depreciation schedule when asset life or acquisition date changes
  useEffect(() => {
    if (asset && depreciationSchedule.length > 0) {
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
    } else if (!asset) {
      setDepreciationSchedule([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.assetLife, formData.dateOfAcquisition, formData.costOfAcquisition]);

  // Update closing value when depreciation changes
  const updateDepreciation = (index: number, depreciation: number) => {
    const updated = [...depreciationSchedule];
    updated[index].depreciation = Math.round(depreciation * 100) / 100;
    updated[index].closingValue = Math.round((updated[index].openingValue - updated[index].depreciation) * 100) / 100;
    
    for (let i = index + 1; i < updated.length; i++) {
      updated[i].openingValue = updated[i - 1].closingValue;
      updated[i].closingValue = Math.round((updated[i].openingValue - updated[i].depreciation) * 100) / 100;
    }
    
    setDepreciationSchedule(updated);
  };

  // Compute displayed allocations
  const displayedAllocations = useMemo(() => {
    const existing = existingAllocations.filter(a => !pendingDeletes.has(a.id));
    const pendingUpdates = new Map<string, AssetServiceAllocation>();
    const newAllocations: AssetServiceAllocation[] = [];
    
    pendingAllocations.forEach(allocation => {
      if (allocation.id && allocation.id.startsWith('pending-')) {
        newAllocations.push(allocation);
      } else {
        pendingUpdates.set(allocation.id, allocation);
      }
    });

    const result = existing.map(a => pendingUpdates.get(a.id) || a);
    return [...result, ...newAllocations];
  }, [existingAllocations, pendingAllocations, pendingDeletes]);

  const totalPercentage = displayedAllocations.reduce((sum, a) => sum + a.percentage, 0);
  const isTotalValid = Math.abs(totalPercentage - 100) < 0.01;

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: Partial<Asset>) => {
      const response = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create asset");
      }
      const createdAsset = await response.json();
      
      // If Indirect mapping, create allocations
      if (data.serviceMappingType === 'Indirect' && pendingAllocations.length > 0) {
        for (const allocation of pendingAllocations) {
          await fetch(`/api/assets/${createdAsset.id}/service-allocations`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              serviceId: allocation.serviceId,
              percentage: allocation.percentage,
            }),
          });
        }
      }
      
      return createdAsset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast({
        title: "Success",
        description: "Asset created successfully",
      });
      handleBack();
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
        const error = await response.json();
        throw new Error(error.error || "Failed to update asset");
      }
      const updatedAsset = await response.json();
      
      // Handle allocations
      if (data.serviceMappingType === 'Indirect') {
        // Delete removed allocations
        for (const deleteId of pendingDeletes) {
          await fetch(`/api/assets/service-allocations/${deleteId}`, {
            method: "DELETE",
          });
        }
        
        // Create new and update existing allocations
        for (const allocation of pendingAllocations) {
          if (allocation.id && allocation.id.startsWith('pending-')) {
            // New allocation
            await fetch(`/api/assets/${id}/service-allocations`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                serviceId: allocation.serviceId,
                percentage: allocation.percentage,
              }),
            });
          } else {
            // Update existing allocation
            await fetch(`/api/assets/service-allocations/${allocation.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                percentage: allocation.percentage,
              }),
            });
          }
        }
      } else if (data.serviceMappingType === 'Direct') {
        // Delete all indirect allocations if switching to Direct
        const currentAllocations = await fetch(`/api/assets/${id}/service-allocations`).then(r => r.json());
        for (const allocation of currentAllocations) {
          await fetch(`/api/assets/service-allocations/${allocation.id}`, {
            method: "DELETE",
          });
        }
      }
      
      return updatedAsset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["asset-service-allocations", assetId] });
      toast({
        title: "Success",
        description: "Asset updated successfully",
      });
      handleBack();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleBack = () => {
    window.history.pushState({}, '', window.location.pathname);
    dispatch({ type: 'SET_CURRENT_TAB', payload: 'asset' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate mapping type
    if (!formData.serviceMappingType) {
      toast({
        title: "Validation Error",
        description: "Please select a Service Mapping Type",
        variant: "destructive",
      });
      return;
    }

    // Validate Direct mapping
    if (formData.serviceMappingType === 'Direct' && !formData.serviceId) {
      toast({
        title: "Validation Error",
        description: "Please select a service for Direct mapping",
        variant: "destructive",
      });
      return;
    }

    // Validate Indirect mapping
    if (formData.serviceMappingType === 'Indirect') {
      if (displayedAllocations.length === 0) {
        toast({
          title: "Validation Error",
          description: "Please add at least one service allocation for Indirect mapping",
          variant: "destructive",
        });
        return;
      }
      if (!isTotalValid) {
        toast({
          title: "Validation Error",
          description: "Total percentage must equal exactly 100%",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Validate depreciation schedule
    if (depreciationSchedule.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please set up depreciation schedule before saving",
        variant: "destructive",
      });
      return;
    }

    const hasEmptyDepreciation = depreciationSchedule.some(d => d.depreciation === 0 || isNaN(d.depreciation));
    if (hasEmptyDepreciation) {
      toast({
        title: "Validation Error",
        description: "Please enter depreciation value for all years",
        variant: "destructive",
      });
      return;
    }
    
    const assetData = {
      assetTypeId: formData.assetTypeId,
      name: formData.name,
      description: formData.description,
      costOfAcquisition: formData.costOfAcquisition,
      dateOfAcquisition: formData.dateOfAcquisition,
      assetLife: formData.assetLife,
      depreciationSchedule: depreciationSchedule,
      notes: formData.notes,
      serviceId: formData.serviceMappingType === 'Direct' ? formData.serviceId : undefined,
      serviceMappingType: formData.serviceMappingType,
      status: formData.status,
      metadata: formData.metadata,
    };

    if (assetId) {
      updateMutation.mutate({ id: assetId, data: assetData });
    } else {
      createMutation.mutate(assetData);
    }
  };

  const handleAddService = () => {
    setNewServiceForm({ serviceId: "", percentage: 0 });
    setIsAddServiceDialogOpen(true);
  };

  const handleSaveService = () => {
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

    const existingAllocation = displayedAllocations.find(a => a.serviceId === newServiceForm.serviceId);
    if (existingAllocation) {
      toast({
        title: "Validation Error",
        description: "This service is already allocated",
        variant: "destructive",
      });
      return;
    }

    const newAllocation: AssetServiceAllocation = {
      id: `pending-${Date.now()}`,
      assetId: assetId || '',
      serviceId: newServiceForm.serviceId,
      percentage: newServiceForm.percentage,
      status: "active",
    };
    setPendingAllocations([...pendingAllocations, newAllocation]);
    setIsAddServiceDialogOpen(false);
    setNewServiceForm({ serviceId: "", percentage: 0 });
  };

  const handleUpdatePercentage = (allocationId: string, newPercentage: number) => {
    if (newPercentage < 0 || newPercentage > 100) {
      toast({
        title: "Validation Error",
        description: "Percentage must be between 0 and 100",
        variant: "destructive",
      });
      return;
    }

    const otherTotal = displayedAllocations
      .filter(a => a.id !== allocationId)
      .reduce((sum, a) => sum + a.percentage, 0);
    
    const newTotal = otherTotal + newPercentage;
    if (newTotal > 100) {
      toast({
        title: "Validation Error",
        description: `Total percentage would exceed 100%. Current other allocations: ${otherTotal.toFixed(2)}%`,
        variant: "destructive",
      });
      return;
    }

    const existingAllocation = existingAllocations.find(a => a.id === allocationId);
    const pendingAllocation = pendingAllocations.find(a => a.id === allocationId);
    
    if (pendingAllocation) {
      setPendingAllocations(pendingAllocations.map(a => a.id === allocationId ? { ...a, percentage: newPercentage } : a));
    } else if (existingAllocation) {
      setPendingAllocations([...pendingAllocations, { ...existingAllocation, percentage: newPercentage }]);
    }
    setEditingAllocation(null);
  };

  const handleDeleteAllocation = (id: string) => {
    if (confirm("Are you sure you want to remove this service allocation?")) {
      if (id.startsWith('pending-')) {
        setPendingAllocations(pendingAllocations.filter(a => a.id !== id));
      } else {
        setPendingDeletes(new Set([...pendingDeletes, id]));
        setPendingAllocations(pendingAllocations.filter(a => a.id !== id));
      }
    }
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : serviceId;
  };

  const getAvailableServices = () => {
    const allocatedServiceIds = new Set(displayedAllocations.map(a => a.serviceId));
    return services.filter(s => !allocatedServiceIds.has(s.id));
  };

  if (isLoadingAsset) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">
          {assetId ? "Edit Asset" : "Create New Asset"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assetTypeId">Asset Type *</Label>
              <Select
                value={formData.assetTypeId}
                onValueChange={(value) =>
                  setFormData({ ...formData, assetTypeId: value })
                }
                required
                disabled={!!assetId}
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Mapping</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="serviceMappingType">Service Mapping Type *</Label>
              <Select
                value={formData.serviceMappingType}
                onValueChange={(value: 'Direct' | 'Indirect') => {
                  setFormData({ 
                    ...formData, 
                    serviceMappingType: value,
                    serviceId: value === 'Direct' ? formData.serviceId : '',
                  });
                  if (value === 'Direct') {
                    setPendingAllocations([]);
                    setPendingDeletes(new Set());
                  }
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Mapping Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Direct">Direct - Single Service</SelectItem>
                  <SelectItem value="Indirect">Indirect - Multiple Services with Allocation</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Direct: Map asset to a single service. Indirect: Allocate asset across multiple services with percentages.
              </p>
            </div>

            {formData.serviceMappingType === 'Direct' && (
              <div className="space-y-2">
                <Label htmlFor="serviceId">Service *</Label>
                <Select
                  value={formData.serviceId || undefined}
                  onValueChange={(value) =>
                    setFormData({ ...formData, serviceId: value || "" })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} ({service.serviceId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.serviceMappingType === 'Indirect' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Service Allocations</h3>
                  <Button
                    type="button"
                    onClick={handleAddService}
                    disabled={getAvailableServices().length === 0}
                    size="sm"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Service
                  </Button>
                </div>

                {displayedAllocations.length === 0 ? (
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
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {displayedAllocations.map((allocation) => (
                          <TableRow key={allocation.id}>
                            <TableCell className="font-medium">
                              {getServiceName(allocation.serviceId)}
                              {allocation.id.startsWith('pending-') && (
                                <Badge variant="outline" className="ml-2 text-xs">New</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {editingAllocation?.id === allocation.id ? (
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  max="100"
                                  value={editingAllocation.percentage}
                                  onChange={(e) => {
                                    setEditingAllocation({
                                      ...editingAllocation,
                                      percentage: parseFloat(e.target.value) || 0,
                                    });
                                  }}
                                  className="w-24 ml-auto"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && editingAllocation) {
                                      handleUpdatePercentage(editingAllocation.id, editingAllocation.percentage);
                                    }
                                    if (e.key === 'Escape') {
                                      setEditingAllocation(null);
                                    }
                                  }}
                                  autoFocus
                                />
                              ) : (
                                <span
                                  className="cursor-pointer hover:underline"
                                  onClick={() => setEditingAllocation(allocation)}
                                >
                                  {allocation.percentage.toFixed(2)}%
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                {editingAllocation?.id === allocation.id ? (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingAllocation(null)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setEditingAllocation(allocation)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteAllocation(allocation.id)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <span className="font-semibold">Total Percentage:</span>
                  <div className="flex items-center gap-2">
                    <span className={isTotalValid ? "text-green-600 dark:text-green-400 font-bold" : "text-red-600 dark:text-red-400 font-bold"}>
                      {totalPercentage.toFixed(2)}%
                    </span>
                    {isTotalValid ? (
                      <Badge variant="default" className="bg-green-600">Valid</Badge>
                    ) : (
                      <Badge variant="destructive">Must equal 100%</Badge>
                    )}
                  </div>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Depreciation Schedule *</CardTitle>
              {depreciationSchedule.length > 0 && (
                <div className="text-sm text-gray-500">
                  Total Depreciation: {formatCurrency(
                    depreciationSchedule.reduce((sum, d) => sum + d.depreciation, 0)
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.costOfAcquisition > 0 && formData.assetLife > 0 && formData.dateOfAcquisition ? (
              <>
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
              </>
            ) : (
              <div className="text-center py-8 text-gray-500 border rounded-lg bg-gray-50 dark:bg-gray-900">
                Please fill in Cost of Acquisition, Date of Acquisition, and Asset Life to set up depreciation schedule.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={handleBack}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {assetId ? "Update" : "Create"}
          </Button>
        </div>
      </form>

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
              type="button"
              variant="outline"
              onClick={() => {
                setIsAddServiceDialogOpen(false);
                setNewServiceForm({ serviceId: "", percentage: 0 });
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveService}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

