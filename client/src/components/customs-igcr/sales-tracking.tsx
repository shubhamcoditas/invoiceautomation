"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ship, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { GoodsMovementTab, TAB_CONFIG } from "./goods-movement";
import { useIgcrWorking } from "./igcr-working-context";

export function SalesTracking() {
  const { setErtWaiver, setDsrtWaiver } = useIgcrWorking();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sales tracking
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          ERT and DSRT registers — upload and track export and DTA sales
        </p>
      </div>

      <Tabs defaultValue="ert" className="w-full">
        <TabsList className={cn("bg-amber-100/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800", "inline-flex h-11 gap-1 p-1")}>
          <TabsTrigger value="ert" className={cn("data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-sm", "border-amber-200 dark:border-amber-800")}>
            <Ship className="h-4 w-4 mr-2" />
            ERT
          </TabsTrigger>
          <TabsTrigger value="dsrt" className={cn("data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-sm", "border-amber-200 dark:border-amber-800")}>
            <Store className="h-4 w-4 mr-2" />
            DSRT
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ert" className="mt-4">
          <GoodsMovementTab variant="exports" config={TAB_CONFIG.exports} onDutyWaiverTotalChange={setErtWaiver} />
        </TabsContent>
        <TabsContent value="dsrt" className="mt-4">
          <GoodsMovementTab variant="dta" config={TAB_CONFIG.dta} onDutyWaiverTotalChange={setDsrtWaiver} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
