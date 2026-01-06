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

export interface MasterDataField {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "number" | "date";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  hidden?: boolean; // For fields like metadata that exist but shouldn't be shown
}

export interface MasterDataConfig {
  entityName: string; // e.g., "Asset Class"
  entityNamePlural: string; // e.g., "Asset Classes"
  apiEndpoint: string; // e.g., "/api/asset-class"
  queryKey: string; // e.g., "asset-classes"
  idField: string; // e.g., "classId" or "verticalId"
  fields: MasterDataField[];
  tableColumns: {
    id: string;
    label: string;
    render?: (item: any) => React.ReactNode;
  }[];
  enableDuplicateDetection?: boolean; // Default: true
  duplicateField?: string; // Field to check for duplicates, default: "name"
  deleteConfirmMessage?: string;
  successMessages?: {
    create?: string;
    update?: string;
    delete?: string;
  };
}

interface MasterDataCRUDProps {
  config: MasterDataConfig;
}

export function MasterDataCRUD({ config }: MasterDataCRUDProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    config.fields.forEach((field) => {
      if (field.type === "select") {
        initial[field.name] = field.options?.[0]?.value || "";
      } else if (field.type === "number") {
        initial[field.name] = 0;
      } else {
        initial[field.name] = "";
      }
    });
    // Set default status if status field exists
    if (config.fields.find((f) => f.name === "status")) {
      initial.status = "active";
    }
    return initial;
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch data
  const { data: items = [], isLoading } = useQuery<any[]>({
    queryKey: [config.queryKey],
    queryFn: async () => {
      const response = await fetch(config.apiEndpoint);
      if (!response.ok) {
        let errorMessage = `Failed to fetch ${config.entityNamePlural.toLowerCase()}`;
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
    mutationFn: async (data: any) => {
      const response = await fetch(config.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        let errorMessage = `Failed to create ${config.entityName.toLowerCase()}`;
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
      queryClient.invalidateQueries({ queryKey: [config.queryKey] });
      toast({
        title: "Success",
        description: config.successMessages?.create || `${config.entityName} created successfully`,
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
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`${config.apiEndpoint}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        let errorMessage = `Failed to update ${config.entityName.toLowerCase()}`;
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
      queryClient.invalidateQueries({ queryKey: [config.queryKey] });
      toast({
        title: "Success",
        description: config.successMessages?.update || `${config.entityName} updated successfully`,
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
      const response = await fetch(`${config.apiEndpoint}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        let errorMessage = `Failed to delete ${config.entityName.toLowerCase()}`;
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
      queryClient.invalidateQueries({ queryKey: [config.queryKey] });
      toast({
        title: "Success",
        description: config.successMessages?.delete || `${config.entityName} deleted successfully`,
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
    const initial: Record<string, any> = {};
    config.fields.forEach((field) => {
      if (field.type === "select") {
        initial[field.name] = field.options?.[0]?.value || "";
      } else if (field.type === "number") {
        initial[field.name] = 0;
      } else {
        initial[field.name] = "";
      }
    });
    if (config.fields.find((f) => f.name === "status")) {
      initial.status = "active";
    }
    setFormData(initial);
    setEditingItem(null);
  };

  const handleOpenDialog = (item?: any) => {
    if (item) {
      setEditingItem(item);
      const data: Record<string, any> = {};
      config.fields.forEach((field) => {
        data[field.name] = item[field.name] ?? (field.type === "select" ? field.options?.[0]?.value || "" : field.type === "number" ? 0 : "");
      });
      setFormData(data);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build data object, excluding hidden fields
    const data: Record<string, any> = {};
    config.fields.forEach((field) => {
      if (!field.hidden) {
        data[field.name] = formData[field.name];
      }
    });

    if (editingItem) {
      updateMutation.mutate({
        id: editingItem.id,
        data,
      });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: string) => {
    const message = config.deleteConfirmMessage || `Are you sure you want to delete this ${config.entityName.toLowerCase()}?`;
    if (confirm(message)) {
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

  // Remove duplicates based on name (case-insensitive) if enabled
  const uniqueItems = useMemo(() => {
    if (config.enableDuplicateDetection !== false) {
      const duplicateField = config.duplicateField || "name";
      const seenNames = new Map<string, any>();
      
      items.forEach((item) => {
        const normalizedName = (item[duplicateField] || "").trim().toLowerCase();
        const existing = seenNames.get(normalizedName);
        
        if (!existing) {
          seenNames.set(normalizedName, item);
        } else {
          const existingDate = existing.createdAt ? new Date(existing.createdAt).getTime() : 0;
          const currentDate = item.createdAt ? new Date(item.createdAt).getTime() : 0;
          
          if (currentDate > existingDate) {
            seenNames.set(normalizedName, item);
          }
        }
      });
      
      return Array.from(seenNames.values()).sort((a, b) => {
        const field = config.duplicateField || "name";
        return (a[field] || "").localeCompare(b[field] || "");
      });
    }
    return items;
  }, [items, config.enableDuplicateDetection, config.duplicateField]);

  const renderField = (field: MasterDataField) => {
    if (field.hidden) return null;

    const commonProps = {
      id: field.name,
      value: formData[field.name] || "",
      onChange: (e: any) => {
        const value = field.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value;
        setFormData({ ...formData, [field.name]: value });
      },
      required: field.required,
      placeholder: field.placeholder,
    };

    switch (field.type) {
      case "textarea":
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label} {field.required && "*"}
            </Label>
            <Textarea
              {...commonProps}
              rows={field.rows || 3}
            />
          </div>
        );
      case "select":
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label} {field.required && "*"}
            </Label>
            <Select
              value={formData[field.name] || ""}
              onValueChange={(value) => setFormData({ ...formData, [field.name]: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case "number":
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label} {field.required && "*"}
            </Label>
            <Input
              {...commonProps}
              type="number"
            />
          </div>
        );
      case "date":
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label} {field.required && "*"}
            </Label>
            <Input
              {...commonProps}
              type="date"
            />
          </div>
        );
      default:
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label} {field.required && "*"}
            </Label>
            <Input {...commonProps} />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{config.entityNamePlural}</CardTitle>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add {config.entityName}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : uniqueItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No {config.entityNamePlural.toLowerCase()} found. Click "Add {config.entityName}" to create one.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {config.tableColumns.map((col) => (
                    <TableHead key={col.id}>{col.label}</TableHead>
                  ))}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uniqueItems.map((item) => (
                  <TableRow key={item.id}>
                    {config.tableColumns.map((col) => (
                      <TableCell key={col.id} className={col.id === "name" ? "font-medium" : ""}>
                        {col.render ? col.render(item) : item[col.id] || "-"}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
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
              {editingItem ? `Edit ${config.entityName}` : `Create New ${config.entityName}`}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {config.fields.filter((f) => !f.hidden).map((field) => renderField(field))}
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
                {editingItem ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

