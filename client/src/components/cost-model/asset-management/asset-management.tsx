import { useState, useMemo } from "react";
import { useAppState } from "@/hooks/use-app-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, ChevronDown, ChevronRight, Package, Boxes, Archive } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AssetClass {
  id: string;
  classId: string;
  name: string;
  description?: string;
  status: string;
  metadata?: any;
  createdAt?: string;
}

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

interface Asset {
  id: string;
  assetTypeId: string;
  assetCode: string;
  name: string;
  description?: string;
  costOfAcquisition: number;
  dateOfAcquisition: string;
  assetLife: number;
  notes?: string;
  serviceId?: string;
  status: string;
  metadata?: any;
  createdAt?: string;
}

export function AssetManagement() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [isAssetClassDialogOpen, setIsAssetClassDialogOpen] = useState(false);
  const [isAssetTypeDialogOpen, setIsAssetTypeDialogOpen] = useState(false);
  const [editingAssetClass, setEditingAssetClass] = useState<AssetClass | null>(null);
  const [editingAssetType, setEditingAssetType] = useState<AssetType | null>(null);
  const [assetClassFormData, setAssetClassFormData] = useState({
    name: "",
    description: "",
    status: "active",
    metadata: {} as any,
  });
  const [assetTypeFormData, setAssetTypeFormData] = useState({
    assetClassId: "",
    name: "",
    description: "",
    status: "active",
    metadata: {} as any,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { dispatch } = useAppState();

  // Fetch asset classes
  const { data: assetClasses = [], isLoading: isLoadingAssetClasses } = useQuery<AssetClass[]>({
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
  const { data: assetTypes = [], isLoading: isLoadingAssetTypes } = useQuery<AssetType[]>({
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

  // Fetch assets
  const { data: assets = [], isLoading: isLoadingAssets } = useQuery<Asset[]>({
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

  // Asset Class mutations
  const createAssetClassMutation = useMutation({
    mutationFn: async (data: Partial<AssetClass>) => {
      const response = await fetch("/api/asset-class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        let errorMessage = "Failed to create asset class";
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
      queryClient.invalidateQueries({ queryKey: ["asset-classes"] });
      toast({
        title: "Success",
        description: "Asset Class created successfully",
      });
      setIsAssetClassDialogOpen(false);
      resetAssetClassForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateAssetClassMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<AssetClass> }) => {
      const response = await fetch(`/api/asset-class/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        let errorMessage = "Failed to update asset class";
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
      queryClient.invalidateQueries({ queryKey: ["asset-classes"] });
      toast({
        title: "Success",
        description: "Asset Class updated successfully",
      });
      setIsAssetClassDialogOpen(false);
      resetAssetClassForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteAssetClassMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/asset-class/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        let errorMessage = "Failed to delete asset class";
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
      queryClient.invalidateQueries({ queryKey: ["asset-classes"] });
      toast({
        title: "Success",
        description: "Asset Class deleted successfully",
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

  // Asset Type mutations
  const createAssetTypeMutation = useMutation({
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
      setIsAssetTypeDialogOpen(false);
      resetAssetTypeForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateAssetTypeMutation = useMutation({
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
      setIsAssetTypeDialogOpen(false);
      resetAssetTypeForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteAssetTypeMutation = useMutation({
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

  // Delete asset mutation
  const deleteAssetMutation = useMutation({
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

  const resetAssetClassForm = () => {
    setAssetClassFormData({
      name: "",
      description: "",
      status: "active",
      metadata: {},
    });
    setEditingAssetClass(null);
  };

  const resetAssetTypeForm = () => {
    setAssetTypeFormData({
      assetClassId: "",
      name: "",
      description: "",
      status: "active",
      metadata: {},
    });
    setEditingAssetType(null);
  };

  const handleOpenAssetClassDialog = (assetClass?: AssetClass) => {
    if (assetClass) {
      setEditingAssetClass(assetClass);
      setAssetClassFormData({
        name: assetClass.name,
        description: assetClass.description || "",
        status: assetClass.status,
        metadata: assetClass.metadata || {},
      });
    } else {
      resetAssetClassForm();
    }
    setIsAssetClassDialogOpen(true);
  };

  const handleOpenAssetTypeDialog = (assetType?: AssetType, assetClassId?: string) => {
    if (assetType) {
      setEditingAssetType(assetType);
      setAssetTypeFormData({
        assetClassId: assetType.assetClassId,
        name: assetType.name,
        description: assetType.description || "",
        status: assetType.status,
        metadata: assetType.metadata || {},
      });
    } else {
      resetAssetTypeForm();
      if (assetClassId) {
        setAssetTypeFormData(prev => ({ ...prev, assetClassId }));
      }
    }
    setIsAssetTypeDialogOpen(true);
  };

  const handleAssetClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAssetClass) {
      updateAssetClassMutation.mutate({
        id: editingAssetClass.id,
        data: {
          name: assetClassFormData.name,
          description: assetClassFormData.description,
          status: assetClassFormData.status,
          metadata: assetClassFormData.metadata,
        },
      });
    } else {
      createAssetClassMutation.mutate({
        name: assetClassFormData.name,
        description: assetClassFormData.description,
        status: assetClassFormData.status,
        metadata: assetClassFormData.metadata,
      });
    }
  };

  const handleAssetTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAssetType) {
      updateAssetTypeMutation.mutate({
        id: editingAssetType.id,
        data: {
          name: assetTypeFormData.name,
          description: assetTypeFormData.description,
          status: assetTypeFormData.status,
          metadata: assetTypeFormData.metadata,
        },
      });
    } else {
      createAssetTypeMutation.mutate({
        assetClassId: assetTypeFormData.assetClassId,
        name: assetTypeFormData.name,
        description: assetTypeFormData.description,
        status: assetTypeFormData.status,
        metadata: assetTypeFormData.metadata,
      });
    }
  };

  const handleDeleteAssetClass = (id: string) => {
    if (confirm("Are you sure you want to delete this asset class?")) {
      deleteAssetClassMutation.mutate(id);
    }
  };

  const handleDeleteAssetType = (id: string) => {
    if (confirm("Are you sure you want to delete this asset type?")) {
      deleteAssetTypeMutation.mutate(id);
    }
  };

  const handleDeleteAsset = (id: string) => {
    if (confirm("Are you sure you want to delete this asset?")) {
      deleteAssetMutation.mutate(id);
    }
  };

  const handleOpenAssetForm = (asset?: Asset) => {
    if (asset) {
      window.history.pushState({}, '', `?assetId=${asset.id}`);
      dispatch({ type: 'SET_CURRENT_TAB', payload: 'asset-form' });
    } else {
      window.history.pushState({}, '', '');
      dispatch({ type: 'SET_CURRENT_TAB', payload: 'asset-form' });
    }
  };

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const expandAll = () => {
    const allNodeIds = new Set<string>();
    uniqueAssetClasses.forEach(assetClass => {
      allNodeIds.add(`assetclass-${assetClass.id}`);
      uniqueAssetTypes
        .filter(at => at.assetClassId === assetClass.id)
        .forEach(assetType => {
          const hasAssets = uniqueAssets.some(a => a.assetTypeId === assetType.id);
          if (hasAssets) {
            allNodeIds.add(`assettype-${assetType.id}`);
          }
        });
    });
    setExpandedNodes(allNodeIds);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
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

  // Remove duplicates and group by hierarchy
  const uniqueAssetClasses = useMemo(() => {
    const seenNames = new Map<string, AssetClass>();
    assetClasses.forEach((ac) => {
      const normalizedName = ac.name.trim().toLowerCase();
      const existing = seenNames.get(normalizedName);
      if (!existing) {
        seenNames.set(normalizedName, ac);
      } else {
        const existingDate = existing.createdAt ? new Date(existing.createdAt).getTime() : 0;
        const currentDate = ac.createdAt ? new Date(ac.createdAt).getTime() : 0;
        if (currentDate > existingDate) {
          seenNames.set(normalizedName, ac);
        }
      }
    });
    return Array.from(seenNames.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [assetClasses]);

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

  // Group by hierarchy: Asset Class -> Asset Type -> Assets
  const groupedData = useMemo(() => {
    return uniqueAssetClasses.map((assetClass) => {
      const typesForClass = uniqueAssetTypes.filter(at => at.assetClassId === assetClass.id);
      const typesWithAssets = typesForClass.map((assetType) => {
        const assetsForType = uniqueAssets.filter(a => a.assetTypeId === assetType.id);
        return {
          assetType,
          assets: assetsForType.sort((a, b) => a.name.localeCompare(b.name))
        };
      });
      return {
        assetClass,
        assetTypes: typesWithAssets.sort((a, b) => a.assetType.name.localeCompare(b.assetType.name))
      };
    });
  }, [uniqueAssetClasses, uniqueAssetTypes, uniqueAssets]);

  const isLoading = isLoadingAssetClasses || isLoadingAssetTypes || isLoadingAssets;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Asset Management</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={expandAll}>
                Expand All
              </Button>
              <Button variant="outline" size="sm" onClick={collapseAll}>
                Collapse All
              </Button>
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={() => handleOpenAssetClassDialog()}
                  className="cursor-pointer"
                >
                  <Package className="mr-2 h-4 w-4" />
                  <span>Add Asset Class</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleOpenAssetTypeDialog()}
                  disabled={assetClasses.length === 0}
                  className="cursor-pointer"
                >
                  <Boxes className="mr-2 h-4 w-4" />
                  <span>Add Asset Type</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleOpenAssetForm()}
                  disabled={assetTypes.length === 0}
                  className="cursor-pointer"
                >
                  <Archive className="mr-2 h-4 w-4" />
                  <span>Add Asset</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {assetClasses.length === 0 && (
            <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Please create an Asset Class first before creating Asset Types and Assets.
              </p>
            </div>
          )}
          {assetClasses.length > 0 && assetTypes.length === 0 && (
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                No Asset Types found. Click "Add Asset Type" to create one.
              </p>
            </div>
          )}
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : groupedData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No asset classes found. Click "Add Asset Class" to create one.
            </div>
          ) : (
            <div className="space-y-1">
              {groupedData.map((group) => {
                const totalTypes = group.assetTypes.length;
                const totalAssets = group.assetTypes.reduce((sum, t) => sum + t.assets.length, 0);
                const assetClassId = `assetclass-${group.assetClass.id}`;
                const isAssetClassExpanded = expandedNodes.has(assetClassId);

                return (
                  <div key={group.assetClass.id} className="select-none">
                    {/* Asset Class Level (Level 0) */}
                    <div
                      className={cn(
                        "flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                        "font-semibold"
                      )}
                    >
                      {totalTypes > 0 ? (
                        <button
                          onClick={() => toggleNode(assetClassId)}
                          className="flex-shrink-0 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        >
                          {isAssetClassExpanded ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      ) : (
                        <div className="w-4 h-4 flex-shrink-0" />
                      )}
                      
                      <div className="flex-shrink-0 text-blue-600 dark:text-blue-400">
                        <Package className="h-4 w-4" />
                      </div>
                      
                      <span className="flex-1 truncate">{group.assetClass.name}</span>
                      
                      <Badge variant="secondary" className="ml-auto flex-shrink-0 text-xs">
                        {totalTypes} {totalTypes === 1 ? 'type' : 'types'}, {totalAssets} {totalAssets === 1 ? 'asset' : 'assets'}
                      </Badge>
                      
                      <div className="flex items-center gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleOpenAssetTypeDialog(undefined, group.assetClass.id)}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleOpenAssetClassDialog(group.assetClass)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleDeleteAssetClass(group.assetClass.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </div>

                    {/* Asset Types Level (Level 1) */}
                    {isAssetClassExpanded && (
                      <div className="ml-6 border-l-2 border-gray-200 dark:border-gray-700">
                        {group.assetTypes.length === 0 ? (
                          <div className="text-center py-4 text-muted-foreground text-sm">
                            No asset types. Click + to add one.
                          </div>
                        ) : (
                          group.assetTypes.map(({ assetType, assets }) => {
                            const assetTypeId = `assettype-${assetType.id}`;
                            const isAssetTypeExpanded = expandedNodes.has(assetTypeId);

                            return (
                              <div key={assetType.id} className="select-none">
                                <div
                                  className={cn(
                                    "flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                                    "font-medium"
                                  )}
                                  style={{ marginLeft: '24px' }}
                                >
                                  {assets.length > 0 ? (
                                    <button
                                      onClick={() => toggleNode(assetTypeId)}
                                      className="flex-shrink-0 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                                    >
                                      {isAssetTypeExpanded ? (
                                        <ChevronDown className="h-4 w-4 text-gray-500" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4 text-gray-500" />
                                      )}
                                    </button>
                                  ) : (
                                    <div className="w-4 h-4 flex-shrink-0" />
                                  )}
                                  
                                  <div className="flex-shrink-0 text-green-600 dark:text-green-400">
                                    <Boxes className="h-4 w-4" />
                                  </div>
                                  
                                  <span className="flex-1 truncate">{assetType.name}</span>
                                  
                                  <Badge variant="outline" className="ml-auto flex-shrink-0 text-xs">
                                    {assets.length} {assets.length === 1 ? 'asset' : 'assets'}
                                  </Badge>
                                  
                                  <div className="flex items-center gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0"
                                      onClick={() => {
                                        window.history.pushState({}, '', `?assetTypeId=${assetType.id}`);
                                        dispatch({ type: 'SET_CURRENT_TAB', payload: 'asset-form' });
                                      }}
                                    >
                                      <Plus className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0"
                                      onClick={() => handleOpenAssetTypeDialog(assetType)}
                                    >
                                      <Edit className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0"
                                      onClick={() => handleDeleteAssetType(assetType.id)}
                                    >
                                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Assets Level (Level 2) */}
                                {isAssetTypeExpanded && (
                                  <div className="ml-6 border-l-2 border-gray-200 dark:border-gray-700">
                                    {assets.length === 0 ? (
                                      <div className="text-center py-4 text-muted-foreground text-sm" style={{ marginLeft: '24px' }}>
                                        No assets. Click + to add one.
                                      </div>
                                    ) : (
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4" style={{ marginLeft: '24px' }}>
                                        {assets.map((asset) => (
                                          <Card key={asset.id} className="hover:shadow-md transition-shadow">
                                            <CardHeader className="pb-3">
                                              <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                  <div className="flex-shrink-0 text-gray-600 dark:text-gray-400">
                                                    <Archive className="h-4 w-4" />
                                                  </div>
                                                  <div className="flex-1 min-w-0">
                                                    <CardTitle className="text-base font-semibold mb-1 line-clamp-2">
                                                      {asset.name}
                                                    </CardTitle>
                                                    <Badge variant="outline" className="text-xs text-muted-foreground font-normal">
                                                      {asset.assetCode}
                                                    </Badge>
                                                  </div>
                                                </div>
                                              </div>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                              {asset.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                  {asset.description}
                                                </p>
                                              )}
                                              <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                  <span className="text-muted-foreground">Cost:</span>
                                                  <span className="font-semibold">{formatCurrency(asset.costOfAcquisition)}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                  <span className="text-muted-foreground">Acquired:</span>
                                                  <span className="font-medium">
                                                    {new Date(asset.dateOfAcquisition).toLocaleDateString()}
                                                  </span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                  <span className="text-muted-foreground">Life:</span>
                                                  <span className="font-medium">{asset.assetLife} years</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                  <span className="text-muted-foreground">Status:</span>
                                                  {getStatusBadge(asset.status)}
                                                </div>
                                              </div>
                                              <div className="flex gap-2 pt-2 border-t">
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  className="flex-1"
                                                  onClick={() => handleOpenAssetForm(asset)}
                                                >
                                                  <Edit className="h-4 w-4 mr-1" />
                                                  Edit
                                                </Button>
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  className="flex-1 text-destructive hover:text-destructive"
                                                  onClick={() => handleDeleteAsset(asset.id)}
                                                >
                                                  <Trash2 className="h-4 w-4 mr-1" />
                                                  Delete
                                                </Button>
                                              </div>
                                            </CardContent>
                                          </Card>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Asset Class Dialog */}
      <Dialog open={isAssetClassDialogOpen} onOpenChange={setIsAssetClassDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingAssetClass ? "Edit Asset Class" : "Create New Asset Class"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAssetClassSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="assetClassName">Name *</Label>
                <Input
                  id="assetClassName"
                  value={assetClassFormData.name}
                  onChange={(e) =>
                    setAssetClassFormData({ ...assetClassFormData, name: e.target.value })
                  }
                  required
                  placeholder="e.g., Furniture and Fixtures"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assetClassDescription">Description</Label>
                <Textarea
                  id="assetClassDescription"
                  value={assetClassFormData.description}
                  onChange={(e) =>
                    setAssetClassFormData({ ...assetClassFormData, description: e.target.value })
                  }
                  placeholder="Enter a description for this asset class"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assetClassStatus">Status *</Label>
                <Select
                  value={assetClassFormData.status}
                  onValueChange={(value) =>
                    setAssetClassFormData({ ...assetClassFormData, status: value })
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
                  setIsAssetClassDialogOpen(false);
                  resetAssetClassForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createAssetClassMutation.isPending || updateAssetClassMutation.isPending}
              >
                {editingAssetClass ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Asset Type Dialog */}
      <Dialog open={isAssetTypeDialogOpen} onOpenChange={setIsAssetTypeDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingAssetType ? "Edit Asset Type" : "Create New Asset Type"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAssetTypeSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="assetTypeAssetClassId">Asset Class *</Label>
                <Select
                  value={assetTypeFormData.assetClassId}
                  onValueChange={(value) =>
                    setAssetTypeFormData({ ...assetTypeFormData, assetClassId: value })
                  }
                  required
                  disabled={!!editingAssetType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Asset Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueAssetClasses.map((ac) => (
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
                <Label htmlFor="assetTypeName">Name *</Label>
                <Input
                  id="assetTypeName"
                  value={assetTypeFormData.name}
                  onChange={(e) =>
                    setAssetTypeFormData({ ...assetTypeFormData, name: e.target.value })
                  }
                  required
                  placeholder="e.g., Office Desk"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assetTypeDescription">Description</Label>
                <Textarea
                  id="assetTypeDescription"
                  value={assetTypeFormData.description}
                  onChange={(e) =>
                    setAssetTypeFormData({ ...assetTypeFormData, description: e.target.value })
                  }
                  placeholder="Enter a description for this asset type"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assetTypeStatus">Status *</Label>
                <Select
                  value={assetTypeFormData.status}
                  onValueChange={(value) =>
                    setAssetTypeFormData({ ...assetTypeFormData, status: value })
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
                  setIsAssetTypeDialogOpen(false);
                  resetAssetTypeForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createAssetTypeMutation.isPending || updateAssetTypeMutation.isPending}
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

