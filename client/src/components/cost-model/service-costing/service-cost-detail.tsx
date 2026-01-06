import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";
import { Calculator, X, TrendingUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

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

interface Service {
  id: string;
  serviceId: string;
  name: string;
  description?: string;
  uom: string;
  serviceGroupId: string;
}

interface ServiceCostDetailProps {
  serviceId: string;
  onClose: () => void;
}

export function ServiceCostDetail({ serviceId, onClose }: ServiceCostDetailProps) {
  const [markupPercent, setMarkupPercent] = useState<string>("0");
  const currentYear = new Date().getFullYear();

  // Fetch service cost details
  const { data: serviceCost, isLoading: isLoadingCost } = useQuery<ServiceCost>({
    queryKey: ["service-level-costs", serviceId, currentYear],
    queryFn: async () => {
      const response = await fetch(`/api/service-level-costs?serviceId=${serviceId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch service cost");
      }
      return response.json();
    },
  });

  // Fetch service details
  const { data: service, isLoading: isLoadingService } = useQuery<Service>({
    queryKey: ["service", serviceId],
    queryFn: async () => {
      const response = await fetch(`/api/services/${serviceId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch service");
      }
      return response.json();
    },
  });

  // Fetch service budget amount
  const { data: budgetAmount = 0 } = useQuery<number>({
    queryKey: ["service-budget", serviceId, currentYear],
    queryFn: async () => {
      const response = await fetch(`/api/services/${serviceId}/budget?year=${currentYear}`);
      if (!response.ok) {
        return 0;
      }
      const data = await response.json();
      return data.amount || 0;
    },
  });

  const isLoading = isLoadingCost || isLoadingService;

  // Calculate price based on markup
  const calculatedPrice = useMemo(() => {
    if (!serviceCost || !serviceCost.totalCost) return 0;
    const markup = parseFloat(markupPercent) || 0;
    return serviceCost.totalCost * (1 + markup / 100);
  }, [serviceCost, markupPercent]);

  const calculatedPricePerUnit = useMemo(() => {
    if (!serviceCost || !serviceCost.costPerUnit) return 0;
    const markup = parseFloat(markupPercent) || 0;
    return serviceCost.costPerUnit * (1 + markup / 100);
  }, [serviceCost, markupPercent]);

  const getPercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return (value / total) * 100;
  };

  if (isLoading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="text-center py-8">Loading...</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!serviceCost || !service) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="text-center py-8 text-gray-500">
            Service not found
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const directPct = getPercentage(serviceCost.directCosts, serviceCost.totalCost);
  const depPct = getPercentage(serviceCost.depreciation, serviceCost.totalCost);
  const indirectPct = getPercentage(serviceCost.indirectCosts, serviceCost.totalCost);
  const commonPct = getPercentage(serviceCost.commonCosts, serviceCost.totalCost);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              <DialogTitle>Service Cost Detail - {service.name}</DialogTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Service Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Service Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Service Code</Label>
                  <div className="mt-1">
                    <Badge variant="outline">{service.serviceId}</Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Service Name</Label>
                  <div className="mt-1 font-medium">{service.name}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">UOM</Label>
                  <div className="mt-1 font-medium">{service.uom || "-"}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Financial Year</Label>
                  <div className="mt-1 font-medium">{currentYear}</div>
                </div>
              </div>
              {service.description && (
                <div className="mt-4">
                  <Label className="text-sm text-muted-foreground">Description</Label>
                  <div className="mt-1 text-sm">{service.description}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">Direct Costs</div>
                      <div className="text-2xl font-bold">{formatCurrency(serviceCost.directCosts)}</div>
                      {serviceCost.totalCost > 0 && (
                        <>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-blue-600 h-3 rounded-full transition-all" 
                              style={{ width: `${directPct}%` }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {directPct.toFixed(1)}% of total
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">Depreciation</div>
                      <div className="text-2xl font-bold">{formatCurrency(serviceCost.depreciation)}</div>
                      {serviceCost.totalCost > 0 && (
                        <>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-green-600 h-3 rounded-full transition-all" 
                              style={{ width: `${depPct}%` }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {depPct.toFixed(1)}% of total
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">Indirect Costs</div>
                      <div className="text-2xl font-bold">{formatCurrency(serviceCost.indirectCosts)}</div>
                      {serviceCost.totalCost > 0 && (
                        <>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-yellow-600 h-3 rounded-full transition-all" 
                              style={{ width: `${indirectPct}%` }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {indirectPct.toFixed(1)}% of total
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">Common Costs</div>
                      <div className="text-2xl font-bold">{formatCurrency(serviceCost.commonCosts)}</div>
                      {serviceCost.totalCost > 0 && (
                        <>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-purple-600 h-3 rounded-full transition-all" 
                              style={{ width: `${commonPct}%` }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {commonPct.toFixed(1)}% of total
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Service Budget and Cost Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Budget & Cost Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-sm text-muted-foreground">Service Budget Amount</Label>
                  <div className="mt-2 text-2xl font-bold">{formatCurrency(budgetAmount)}</div>
                  <div className="text-xs text-muted-foreground mt-1">Budgeted cost elements for {currentYear}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Total Service Cost</Label>
                  <div className="mt-2 text-2xl font-bold">{formatCurrency(serviceCost.totalCost)}</div>
                  <div className="text-xs text-muted-foreground mt-1">All cost components combined</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Cost Per Unit</Label>
                  <div className="mt-2 text-2xl font-bold text-blue-600">{formatCurrency(serviceCost.costPerUnit)}</div>
                  <div className="text-xs text-muted-foreground mt-1">UOM: {service.uom || "-"}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Price Calculator */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Price Calculator</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="markup">Markup Percentage (%)</Label>
                    <Input
                      id="markup"
                      type="number"
                      step="0.01"
                      min="0"
                      value={markupPercent}
                      onChange={(e) => setMarkupPercent(e.target.value)}
                      placeholder="Enter markup percentage"
                      className="text-lg"
                    />
                    <div className="text-xs text-muted-foreground">
                      Enter the markup percentage to calculate the service price
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Calculation Formula</Label>
                    <div className="p-3 bg-muted rounded-md text-sm font-mono">
                      Price = Cost × (1 + Markup%)
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Total Service Price</Label>
                        <div className="text-3xl font-bold text-green-600">
                          {formatCurrency(calculatedPrice)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          Cost: {formatCurrency(serviceCost.totalCost)} + Markup: {formatCurrency(calculatedPrice - serviceCost.totalCost)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Price Per Unit</Label>
                        <div className="text-3xl font-bold text-green-600">
                          {formatCurrency(calculatedPricePerUnit)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          Cost/Unit: {formatCurrency(serviceCost.costPerUnit)} + Markup: {formatCurrency(calculatedPricePerUnit - serviceCost.costPerUnit)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {parseFloat(markupPercent) > 0 && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                      <TrendingUp className="h-5 w-5" />
                      <div>
                        <div className="font-semibold">Price Summary</div>
                        <div className="text-sm mt-1">
                          With {markupPercent}% markup, the service price is {formatCurrency(calculatedPrice)} 
                          {service.uom && parseFloat(service.uom) > 0 && (
                            <> ({formatCurrency(calculatedPricePerUnit)} per {service.uom})</>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}




