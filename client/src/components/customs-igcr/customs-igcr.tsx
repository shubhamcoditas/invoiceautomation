import { useAppState } from "@/hooks/use-app-state";
import { Card, CardContent } from "@/components/ui/card";
import { IGCROnboarding } from "./igcr-onboarding";
import { ImportRegisterPage } from "./import-register-page";
import { GoodsMovement } from "./goods-movement";
import { BOMSetup } from "@/components/bom/bom-setup";
import { SalesTracking } from "./sales-tracking";
import { IgcrWorking } from "./igcr-working";
import { IgcrWorkingProvider } from "./igcr-working-context";
import { DashboardsPage } from "./dashboards-page";

export function CustomsIGCR() {
  const { state } = useAppState();
  const currentTab = state.currentTab;

  let content: React.ReactNode;

  if (currentTab === "customs-igcr-dashboards") {
    content = <DashboardsPage />;
  } else if (currentTab === "customs-igcr-onboarding") {
    content = <IGCROnboarding />;
  } else if (currentTab === "customs-igcr-import-register") {
    content = <ImportRegisterPage />;
  } else if (currentTab === "customs-igcr-goods-movement") {
    content = <GoodsMovement />;
  } else if (currentTab === "customs-igcr-bom-setup") {
    content = <BOMSetup />;
  } else if (currentTab === "customs-igcr-sales-tracking") {
    content = <SalesTracking />;
  } else if (currentTab === "customs-igcr-igcr-working") {
    content = <IgcrWorking />;
  } else {
    const tabLabels: Record<string, string> = {
      "customs-igcr-dashboards": "Dashboards",
      "customs-igcr-onboarding": "Entity Onboarding",
      "customs-igcr-import-register": "Import Register",
      "customs-igcr-goods-movement": "Goods Movement",
      "customs-igcr-bom-setup": "BOM Setup",
      "customs-igcr-sales-tracking": "Sales tracking",
      "customs-igcr-igcr-working": "IGCR Working",
    };
    const label = tabLabels[currentTab] || "Customs IGCR";
    content = (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{label}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Content for {label} — coming soon.</p>
        </div>
        <Card className="border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              This section is under development. Use the sidebar to return to the dashboard or switch sections.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <IgcrWorkingProvider>{content}</IgcrWorkingProvider>;
}
