"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Truck, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImportsDashboard } from "./imports-dashboard";
import { GoodsMovementDashboard } from "./goods-movement-dashboard";
import { IgcrDashboard } from "./igcr-dashboard";

export function DashboardsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboards
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Overview and analytics across imports, goods movement, schemes, and compliance
        </p>
      </div>

      <Tabs defaultValue="imports" className="w-full">
        <TabsList
          className={cn(
            "bg-amber-100/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800",
            "inline-flex h-11 gap-1 p-1"
          )}
        >
          <TabsTrigger
            value="imports"
            className={cn(
              "data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-sm",
              "border-amber-200 dark:border-amber-800"
            )}
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Imports Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="goods-movement"
            className={cn(
              "data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-sm",
              "border-amber-200 dark:border-amber-800"
            )}
          >
            <Truck className="h-4 w-4 mr-2" />
            Goods Movement
          </TabsTrigger>
          <TabsTrigger
            value="igcr"
            className={cn(
              "data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-sm",
              "border-amber-200 dark:border-amber-800"
            )}
          >
            <Calculator className="h-4 w-4 mr-2" />
            IGCR Dashboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="imports" className="mt-4">
          <ImportsDashboard />
        </TabsContent>
        <TabsContent value="goods-movement" className="mt-4">
          <GoodsMovementDashboard />
        </TabsContent>
        <TabsContent value="igcr" className="mt-4">
          <IgcrDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
