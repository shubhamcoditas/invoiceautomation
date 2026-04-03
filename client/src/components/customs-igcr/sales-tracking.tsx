"use client";

import { Ship, Store } from "lucide-react";
import { TAB_CONFIG } from "@/data/customs-igcr-mock-data";
import { GoodsMovementTab } from "./goods-movement";
import { IgcrTabs } from "./igcr-tabs";
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

      <IgcrTabs
        defaultValue="ert"
        tabs={[
          {
            value: "ert",
            label: "ERT",
            icon: Ship,
            content: (
              <GoodsMovementTab variant="exports" config={TAB_CONFIG.exports} onDutyWaiverTotalChange={setErtWaiver} />
            ),
          },
          {
            value: "dsrt",
            label: "DSRT",
            icon: Store,
            content: (
              <GoodsMovementTab variant="dta" config={TAB_CONFIG.dta} onDutyWaiverTotalChange={setDsrtWaiver} />
            ),
          },
        ]}
      />
    </div>
  );
}
