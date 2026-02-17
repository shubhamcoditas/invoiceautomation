import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, Building2, Layers, Package, Boxes, Archive, FileText, Calculator, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Vertical {
  id: string;
  verticalId: string;
  name: string;
}

interface CostGroup {
  id: string;
  verticalId: string;
  costGroupId: string;
  name: string;
}

interface BudgetLine {
  id: string;
  costGroupId: string;
  budgetLineId: string;
  name: string;
}

interface ServiceGroup {
  id: string;
  verticalId: string;
  groupId: string;
  name: string;
}

interface Service {
  id: string;
  serviceGroupId: string;
  serviceId: string;
  name: string;
}

interface AssetClass {
  id: string;
  classId: string;
  name: string;
}

interface AssetType {
  id: string;
  assetClassId: string;
  typeId: string;
  name: string;
}

interface Asset {
  id: string;
  assetTypeId: string;
  assetCode: string;
  name: string;
}

interface TreeNode {
  id: string;
  name: string;
  type: string;
  count?: number;
  children?: TreeNode[];
  icon?: React.ReactNode;
}

export function CostModelDashboard() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Fetch all hierarchical data
  const { data: verticals = [] } = useQuery<Vertical[]>({
    queryKey: ["verticals"],
    queryFn: async () => {
      const response = await fetch("/api/verticals");
      if (!response.ok) throw new Error("Failed to fetch verticals");
      return response.json();
    },
  });

  const { data: costGroups = [] } = useQuery<CostGroup[]>({
    queryKey: ["cost-groups"],
    queryFn: async () => {
      const response = await fetch("/api/cost-groups");
      if (!response.ok) throw new Error("Failed to fetch cost groups");
      return response.json();
    },
  });

  const { data: budgetLines = [] } = useQuery<BudgetLine[]>({
    queryKey: ["budget-lines"],
    queryFn: async () => {
      const response = await fetch("/api/budget-lines");
      if (!response.ok) throw new Error("Failed to fetch budget lines");
      return response.json();
    },
  });

  const { data: serviceGroups = [] } = useQuery<ServiceGroup[]>({
    queryKey: ["service-groups"],
    queryFn: async () => {
      const response = await fetch("/api/service-groups");
      if (!response.ok) throw new Error("Failed to fetch service groups");
      return response.json();
    },
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await fetch("/api/services");
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    },
  });

  const { data: assetClasses = [] } = useQuery<AssetClass[]>({
    queryKey: ["asset-classes"],
    queryFn: async () => {
      const response = await fetch("/api/asset-class");
      if (!response.ok) throw new Error("Failed to fetch asset classes");
      return response.json();
    },
  });

  const { data: assetTypes = [] } = useQuery<AssetType[]>({
    queryKey: ["asset-types"],
    queryFn: async () => {
      const response = await fetch("/api/asset-type");
      if (!response.ok) throw new Error("Failed to fetch asset types");
      return response.json();
    },
  });

  const { data: assets = [] } = useQuery<Asset[]>({
    queryKey: ["assets"],
    queryFn: async () => {
      const response = await fetch("/api/assets");
      if (!response.ok) throw new Error("Failed to fetch assets");
      return response.json();
    },
  });

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
    verticals.forEach(v => {
      allNodeIds.add(`vertical-${v.id}`);
      costGroups.filter(cg => cg.verticalId === v.id).forEach(cg => {
        allNodeIds.add(`costgroup-${cg.id}`);
        budgetLines.filter(bl => bl.costGroupId === cg.id).forEach(bl => {
          allNodeIds.add(`budgetline-${bl.id}`);
        });
      });
      serviceGroups.filter(sg => sg.verticalId === v.id).forEach(sg => {
        allNodeIds.add(`servicegroup-${sg.id}`);
        services.filter(s => s.serviceGroupId === sg.id).forEach(s => {
          allNodeIds.add(`service-${s.id}`);
        });
      });
    });
    assetClasses.forEach(ac => {
      allNodeIds.add(`assetclass-${ac.id}`);
      assetTypes.filter(at => at.assetClassId === ac.id).forEach(at => {
        allNodeIds.add(`assettype-${at.id}`);
        assets.filter(a => a.assetTypeId === at.id).forEach(a => {
          allNodeIds.add(`asset-${a.id}`);
        });
      });
    });
    setExpandedNodes(allNodeIds);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  // Build hierarchical tree structure
  const buildTree = (): TreeNode[] => {
    const tree: TreeNode[] = [];

    // Cost Management Hierarchy: Vertical → Cost Group → Budget Line
    verticals.forEach(vertical => {
      const verticalCostGroups = costGroups.filter(cg => cg.verticalId === vertical.id);
      const costGroupNodes: TreeNode[] = [];

      verticalCostGroups.forEach(costGroup => {
        const budgetLineItems = budgetLines.filter(bl => bl.costGroupId === costGroup.id);
        costGroupNodes.push({
          id: `costgroup-${costGroup.id}`,
          name: costGroup.name,
          type: "Cost Group",
          count: budgetLineItems.length,
          children: budgetLineItems.map(bl => ({
            id: `budgetline-${bl.id}`,
            name: bl.name,
            type: "Budget Line",
            icon: <FileText className="h-4 w-4" />,
          })),
          icon: <Calculator className="h-4 w-4" />,
        });
      });

      // Service Management Hierarchy: Vertical → Service Group → Service
      const verticalServiceGroups = serviceGroups.filter(sg => sg.verticalId === vertical.id);
      const serviceGroupNodes: TreeNode[] = [];

      verticalServiceGroups.forEach(serviceGroup => {
        const serviceItems = services.filter(s => s.serviceGroupId === serviceGroup.id);
        serviceGroupNodes.push({
          id: `servicegroup-${serviceGroup.id}`,
          name: serviceGroup.name,
          type: "Service Group",
          count: serviceItems.length,
          children: serviceItems.map(s => ({
            id: `service-${s.id}`,
            name: s.name,
            type: "Service",
            icon: <FileText className="h-4 w-4" />,
          })),
          icon: <Layers className="h-4 w-4" />,
        });
      });

      if (costGroupNodes.length > 0 || serviceGroupNodes.length > 0) {
        tree.push({
          id: `vertical-${vertical.id}`,
          name: vertical.name,
          type: "Vertical",
          count: costGroupNodes.length + serviceGroupNodes.length,
          children: [
            ...(costGroupNodes.length > 0 ? [{
              id: `vertical-${vertical.id}-cost`,
              name: "Cost Management",
              type: "Section",
              count: costGroupNodes.length,
              children: costGroupNodes,
              icon: <Calculator className="h-4 w-4" />,
            }] : []),
            ...(serviceGroupNodes.length > 0 ? [{
              id: `vertical-${vertical.id}-service`,
              name: "Service Management",
              type: "Section",
              count: serviceGroupNodes.length,
              children: serviceGroupNodes,
              icon: <Layers className="h-4 w-4" />,
            }] : []),
          ],
          icon: <Building2 className="h-4 w-4" />,
        });
      }
    });

    // Asset Management Hierarchy: Asset Class → Asset Type → Asset
    if (assetClasses.length > 0) {
      const assetManagementNode: TreeNode = {
        id: "asset-management",
        name: "Asset Management",
        type: "Section",
        count: assetClasses.length,
        children: assetClasses.map(assetClass => {
          const assetTypeItems = assetTypes.filter(at => at.assetClassId === assetClass.id);
          const assetTypeNodes: TreeNode[] = assetTypeItems.map(assetType => {
            const assetItems = assets.filter(a => a.assetTypeId === assetType.id);
            return {
              id: `assettype-${assetType.id}`,
              name: assetType.name,
              type: "Asset Type",
              count: assetItems.length,
              children: assetItems.map(asset => ({
                id: `asset-${asset.id}`,
                name: asset.name,
                type: "Asset",
                icon: <Archive className="h-4 w-4" />,
              })),
              icon: <Boxes className="h-4 w-4" />,
            };
          });

          return {
            id: `assetclass-${assetClass.id}`,
            name: assetClass.name,
            type: "Asset Class",
            count: assetTypeNodes.length,
            children: assetTypeNodes,
            icon: <Package className="h-4 w-4" />,
          };
        }),
        icon: <Package className="h-4 w-4" />,
      };

      tree.push(assetManagementNode);
    }

    return tree;
  };

  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const indent = level * 24;

    return (
      <div key={node.id} className="select-none">
        <div
          className={cn(
            "flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer",
            level === 0 && "font-semibold",
            level === 1 && "font-medium",
          )}
          style={{ marginLeft: `${indent}px` }}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500 flex-shrink-0" />
            )
          ) : (
            <div className="w-4 h-4 flex-shrink-0" />
          )}
          
          {node.icon && (
            <div className={cn(
              "flex-shrink-0",
              level === 0 && "text-blue-600 dark:text-blue-400",
              level === 1 && "text-green-600 dark:text-green-400",
              level >= 2 && "text-gray-600 dark:text-gray-400"
            )}>
              {node.icon}
            </div>
          )}
          
          <span className="flex-1 truncate">{node.name}</span>
          
          {node.count !== undefined && node.count > 0 && (
            <Badge variant="secondary" className="ml-auto flex-shrink-0">
              {node.count}
            </Badge>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-4 border-l-2 border-gray-200 dark:border-gray-700">
            {node.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const tree = buildTree();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Cost Model Hierarchy
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Visual representation of all hierarchical relationships
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={expandAll}>
                Expand All
              </Button>
              <Button variant="outline" size="sm" onClick={collapseAll}>
                Collapse All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {tree.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hierarchical data available yet.</p>
              <p className="text-sm mt-2">Start by creating Verticals, Asset Classes, or other entities.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {tree.map(node => renderTreeNode(node))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Verticals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verticals.length}</div>
            <p className="text-xs text-gray-500 mt-1">Total verticals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cost Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{costGroups.length}</div>
            <p className="text-xs text-gray-500 mt-1">Total cost groups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Budget Lines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgetLines.length}</div>
            <p className="text-xs text-gray-500 mt-1">Total budget lines</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-gray-500 mt-1">Total services</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

