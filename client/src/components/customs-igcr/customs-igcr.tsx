import { useAppState } from "@/hooks/use-app-state";
import { Card, CardContent } from "@/components/ui/card";
import { getCustomsIGCRTabLabel } from "@/lib/customs-igcr-tabs-config";
import { IGCROnboarding } from "./igcr-onboarding";
import { ImportRegisterPage } from "./import-register-page";
import { GoodsMovement } from "./goods-movement";
import { BOMSetup } from "@/components/bom/bom-setup";
import { SalesTracking } from "./sales-tracking";
import { IgcrWorking } from "./igcr-working";
import { IgcrWorkingProvider } from "./igcr-working-context";
import { DashboardsPage } from "./dashboards-page";

const TAB_CONTENT: Record<string, React.ReactNode> = {
  "customs-igcr-dashboards": <DashboardsPage />,
  "customs-igcr-onboarding": <IGCROnboarding />,
  "customs-igcr-import-register": <ImportRegisterPage />,
  "customs-igcr-goods-movement": <GoodsMovement />,
  "customs-igcr-bom-setup": <BOMSetup />,
  "customs-igcr-sales-tracking": <SalesTracking />,
  "customs-igcr-igcr-working": <IgcrWorking />,
};

export function CustomsIGCR() {
  const { state } = useAppState();
  const currentTab = state.currentTab;
  const content =
    currentTab && TAB_CONTENT[currentTab] !== undefined
      ? TAB_CONTENT[currentTab]
      : (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {getCustomsIGCRTabLabel(currentTab ?? "")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Content for {getCustomsIGCRTabLabel(currentTab ?? "")} — coming soon.
          </p>
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

  return <IgcrWorkingProvider>{content}</IgcrWorkingProvider>;
}
