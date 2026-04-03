"use client";

import { LayoutDashboard, Truck, Calculator } from "lucide-react";
import { IgcrTabs } from "./igcr-tabs";
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

      <IgcrTabs
        defaultValue="imports"
        tabs={[
          { value: "imports", label: "Imports Dashboard", icon: LayoutDashboard, content: <ImportsDashboard /> },
          { value: "goods-movement", label: "Goods Movement", icon: Truck, content: <GoodsMovementDashboard /> },
          { value: "igcr", label: "IGCR Dashboard", icon: Calculator, content: <IgcrDashboard /> },
        ]}
      />
    </div>
  );
}
