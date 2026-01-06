import { useState, useMemo } from "react";
import { useAppState } from "@/hooks/use-app-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Service {
  id: string;
  serviceGroupId: string;
  serviceId: string;
  name: string;
  description?: string;
  uom: string;
  status: string;
  metadata?: any;
  createdAt?: string;
}

interface ServiceGroup {
  id: string;
  groupId: string;
  name: string;
  verticalId: string;
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

export function Service() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isServiceGroupDialogOpen, setIsServiceGroupDialogOpen] = useState(false);
  const [editingServiceGroup, setEditingServiceGroup] = useState<ServiceGroup | null>(null);
  const [formData, setFormData] = useState({
    serviceGroupId: "",
    name: "",
    description: "",
    uom: "",
    status: "active",
    metadata: {} as any,
  });
  const [serviceGroupFormData, setServiceGroupFormData] = useState({
    verticalId: "",
    name: "",
    description: "",
    status: "active",
    metadata: {} as any,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { dispatch } = useAppState();

  // Fetch verticals for service group dropdown
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

  // Fetch service groups for dropdown
  const { data: serviceGroups = [] } = useQuery<ServiceGroup[]>({
    queryKey: ["service-groups"],
    queryFn: async () => {
      const response = await fetch("/api/service-groups");
      if (!response.ok) {
        let errorMessage = "Failed to fetch service groups";
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

  // Fetch services
  const { data: services = [], isLoading } = useQuery<Service[]>({
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

  // Fetch service level costs (for displaying total cost and cost per unit only)
  const { data: serviceCosts = [] } = useQuery<ServiceCost[]>({
    queryKey: ["service-level-costs"],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/service-level-costs`);
        if (!response.ok) {
          return [];
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        return [];
      }
    },
    retry: 1,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: Partial<Service>) => {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        let errorMessage = "Failed to create service";
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
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast({
        title: "Success",
        description: "Service created successfully",
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
    mutationFn: async ({ id, data }: { id: string; data: Partial<Service> }) => {
      const response = await fetch(`/api/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        let errorMessage = "Failed to update service";
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
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast({
        title: "Success",
        description: "Service updated successfully",
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
      const response = await fetch(`/api/services/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        let errorMessage = "Failed to delete service";
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
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast({
        title: "Success",
        description: "Service deleted successfully",
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

  // Service Group mutations
  const createServiceGroupMutation = useMutation({
    mutationFn: async (data: Partial<ServiceGroup>) => {
      const response = await fetch("/api/service-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        let errorMessage = "Failed to create service group";
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
      queryClient.invalidateQueries({ queryKey: ["service-groups"] });
      toast({
        title: "Success",
        description: "Service Group created successfully",
      });
      setIsServiceGroupDialogOpen(false);
      resetServiceGroupForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateServiceGroupMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ServiceGroup> }) => {
      const response = await fetch(`/api/service-groups/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        let errorMessage = "Failed to update service group";
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
      queryClient.invalidateQueries({ queryKey: ["service-groups"] });
      toast({
        title: "Success",
        description: "Service Group updated successfully",
      });
      setIsServiceGroupDialogOpen(false);
      resetServiceGroupForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteServiceGroupMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/service-groups/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        let errorMessage = "Failed to delete service group";
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
      queryClient.invalidateQueries({ queryKey: ["service-groups"] });
      toast({
        title: "Success",
        description: "Service Group deleted successfully",
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
      serviceGroupId: "",
      name: "",
      description: "",
      uom: "",
      status: "active",
      metadata: {},
    });
    setEditingService(null);
  };

  const resetServiceGroupForm = () => {
    setServiceGroupFormData({
      verticalId: "",
      name: "",
      description: "",
      status: "active",
      metadata: {},
    });
    setEditingServiceGroup(null);
  };

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        serviceGroupId: service.serviceGroupId,
        name: service.name,
        description: service.description || "",
        uom: service.uom,
        status: service.status,
        metadata: service.metadata || {},
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      updateMutation.mutate({
        id: editingService.id,
        data: {
          name: formData.name,
          description: formData.description,
          uom: formData.uom,
          status: formData.status,
          metadata: formData.metadata,
        },
      });
    } else {
      createMutation.mutate({
        serviceGroupId: formData.serviceGroupId,
        name: formData.name,
        description: formData.description,
        uom: formData.uom,
        status: formData.status,
        metadata: formData.metadata,
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenServiceGroupDialog = (serviceGroup?: ServiceGroup) => {
    if (serviceGroup) {
      setEditingServiceGroup(serviceGroup);
      setServiceGroupFormData({
        verticalId: serviceGroup.verticalId,
        name: serviceGroup.name,
        description: serviceGroup.description || "",
        status: serviceGroup.status,
        metadata: serviceGroup.metadata || {},
      });
    } else {
      resetServiceGroupForm();
    }
    setIsServiceGroupDialogOpen(true);
  };

  const handleServiceGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingServiceGroup) {
      updateServiceGroupMutation.mutate({
        id: editingServiceGroup.id,
        data: {
          name: serviceGroupFormData.name,
          description: serviceGroupFormData.description,
          status: serviceGroupFormData.status,
          metadata: serviceGroupFormData.metadata,
        },
      });
    } else {
      createServiceGroupMutation.mutate({
        verticalId: serviceGroupFormData.verticalId,
        name: serviceGroupFormData.name,
        description: serviceGroupFormData.description,
        status: serviceGroupFormData.status,
        metadata: serviceGroupFormData.metadata,
      });
    }
  };

  const handleDeleteServiceGroup = (id: string) => {
    if (confirm("Are you sure you want to delete this service group?")) {
      deleteServiceGroupMutation.mutate(id);
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

  const getServiceCost = (serviceId: string): ServiceCost | undefined => {
    return serviceCosts.find(cost => cost.serviceId === serviceId);
  };

  // Remove duplicates based on service name (case-insensitive)
  const uniqueServices = useMemo(() => {
    const seenNames = new Map<string, Service>();
    
    services.forEach((s) => {
      const normalizedName = s.name.trim().toLowerCase();
      const existing = seenNames.get(normalizedName);
      
      if (!existing) {
        seenNames.set(normalizedName, s);
      } else {
        const existingDate = existing.createdAt ? new Date(existing.createdAt).getTime() : 0;
        const currentDate = s.createdAt ? new Date(s.createdAt).getTime() : 0;
        
        if (currentDate > existingDate) {
          seenNames.set(normalizedName, s);
        }
      }
    });
    
    return Array.from(seenNames.values());
  }, [services]);

  // Group services by Service Group
  const groupedByServiceGroup = useMemo(() => {
    if (uniqueServices.length === 0) return [];
    
    const groups = new Map<string, Service[]>();
    
    uniqueServices.forEach((service) => {
      const serviceGroupId = service.serviceGroupId;
      if (!serviceGroupId) return; // Skip if no service group
      if (!groups.has(serviceGroupId)) {
        groups.set(serviceGroupId, []);
      }
      groups.get(serviceGroupId)!.push(service);
    });
    
    return Array.from(groups.entries())
      .map(([serviceGroupId, services]) => {
        const serviceGroup = serviceGroups.find(sg => sg.id === serviceGroupId);
        return {
          serviceGroupId,
          serviceGroupName: serviceGroup ? serviceGroup.name : serviceGroupId,
          services: services.sort((a, b) => a.name.localeCompare(b.name))
        };
      })
      .sort((a, b) => a.serviceGroupName.localeCompare(b.serviceGroupName));
  }, [uniqueServices, serviceGroups]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Service Management</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleOpenServiceGroupDialog()} 
                disabled={verticals.length === 0}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Service Group
              </Button>
              <Button onClick={() => handleOpenDialog()} disabled={serviceGroups.length === 0}>
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {verticals.length === 0 && (
            <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Please create a Vertical first before creating Service Groups.
              </p>
            </div>
          )}
          {verticals.length > 0 && serviceGroups.length === 0 && (
            <div className="mb-4 p-4 bg-[#FBEAEC] dark:bg-[#FBEAEC] border border-[#E6E6E6] dark:border-[#E6E6E6] rounded-lg">
              <p className="text-sm text-[#1A1A1A] dark:text-[#1A1A1A]">
                No Service Groups found. Click "Add Service Group" to create one.
              </p>
            </div>
          )}
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : groupedByServiceGroup.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No services found. Click "Add Service" to create one.
            </div>
          ) : (
            <Accordion type="multiple" className="w-full" defaultValue={groupedByServiceGroup.map(g => g.serviceGroupId)}>
              {groupedByServiceGroup.map((group) => {
                return (
                  <AccordionItem key={group.serviceGroupId} value={group.serviceGroupId} className="border-b">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">{group.serviceGroupName}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {group.services.length} {group.services.length === 1 ? 'service' : 'services'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              window.history.pushState({}, '', `?serviceGroupId=${group.serviceGroupId}`);
                              dispatch({ type: 'SET_CURRENT_TAB', payload: 'service-group-detail' });
                            }}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const sg = serviceGroups.find(sg => sg.id === group.serviceGroupId);
                              if (sg) handleOpenServiceGroupDialog(sg);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteServiceGroup(group.serviceGroupId)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4">
                        {group.services.map((service) => {
                          const cost = getServiceCost(service.id);
                          
                          return (
                            <Card key={service.id} className="hover:shadow-md transition-shadow">
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0">
                                    <CardTitle className="text-base font-semibold mb-1 line-clamp-2">
                                      {service.name}
                                    </CardTitle>
                                    <Badge variant="outline" className="text-xs text-muted-foreground font-normal">
                                      {service.serviceId}
                                    </Badge>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                {service.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {service.description}
                                  </p>
                                )}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">UOM:</span>
                                    <span className="font-medium">{service.uom}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Status:</span>
                                    {getStatusBadge(service.status)}
                                  </div>
                                  {cost !== undefined && (
                                    <>
                                      <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Total Cost:</span>
                                        <span className="font-semibold">{formatCurrency(cost.totalCost)}</span>
                                      </div>
                                      {cost.costPerUnit > 0 && (
                                        <div className="flex items-center justify-between text-sm">
                                          <span className="text-muted-foreground">Cost/Unit:</span>
                                          <span className="font-semibold text-[#D71921]">{formatCurrency(cost.costPerUnit)}</span>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                                <div className="flex gap-2 pt-2 border-t">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => handleOpenDialog(service)}
                                  >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => {
                                      window.history.pushState({}, '', `?serviceId=${service.id}`);
                                      dispatch({ type: 'SET_CURRENT_TAB', payload: 'service-detail' });
                                    }}
                                  >
                                    Details
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-destructive hover:text-destructive"
                                    onClick={() => handleDelete(service.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit Service" : "Create New Service"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="serviceGroupId">Service Group *</Label>
                <Select
                  value={formData.serviceGroupId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, serviceGroupId: value })
                  }
                  required
                  disabled={!!editingService}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Service Group" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceGroups.map((sg) => (
                      <SelectItem key={sg.id} value={sg.id}>
                        {sg.name} ({sg.groupId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!editingService && (
                  <p className="text-xs text-gray-500">
                    Select the Service Group this service belongs to
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
                  placeholder="e.g., IT Support Service"
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
                  placeholder="Enter a description for this service"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="uom">Unit of Measurement (UOM) *</Label>
                <Input
                  id="uom"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.uom}
                  onChange={(e) =>
                    setFormData({ ...formData, uom: e.target.value })
                  }
                  required
                  placeholder="e.g., 1.5, 10, 100"
                />
                <p className="text-xs text-gray-500">
                  Enter the numeric value for unit of measurement
                </p>
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
                {editingService ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Service Group Dialog */}
      <Dialog open={isServiceGroupDialogOpen} onOpenChange={setIsServiceGroupDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingServiceGroup ? "Edit Service Group" : "Create New Service Group"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleServiceGroupSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="verticalId">Vertical *</Label>
                <Select
                  value={serviceGroupFormData.verticalId}
                  onValueChange={(value) =>
                    setServiceGroupFormData({ ...serviceGroupFormData, verticalId: value })
                  }
                  required
                  disabled={!!editingServiceGroup}
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
                {!editingServiceGroup && (
                  <p className="text-xs text-gray-500">
                    Select the Vertical this service group belongs to
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceGroupName">Name *</Label>
                <Input
                  id="serviceGroupName"
                  value={serviceGroupFormData.name}
                  onChange={(e) =>
                    setServiceGroupFormData({ ...serviceGroupFormData, name: e.target.value })
                  }
                  required
                  placeholder="e.g., IT Services"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceGroupDescription">Description</Label>
                <Textarea
                  id="serviceGroupDescription"
                  value={serviceGroupFormData.description}
                  onChange={(e) =>
                    setServiceGroupFormData({ ...serviceGroupFormData, description: e.target.value })
                  }
                  placeholder="Enter a description for this service group"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceGroupStatus">Status *</Label>
                <Select
                  value={serviceGroupFormData.status}
                  onValueChange={(value) =>
                    setServiceGroupFormData({ ...serviceGroupFormData, status: value })
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
                  setIsServiceGroupDialogOpen(false);
                  resetServiceGroupForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createServiceGroupMutation.isPending || updateServiceGroupMutation.isPending}
              >
                {editingServiceGroup ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

