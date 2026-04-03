/**
 * Lazy-loaded route components for code splitting. Used by App with Suspense.
 */

import React from "react";
import { CUSTOMS_IGCR_TAB_IDS } from "@/lib/customs-igcr-tabs-config";

function lazyRoute<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return React.lazy(factory);
}

// Route-level lazy components (heavy route roots)
const InvoiceTracker = lazyRoute(() => import("@/components/invoice-tracker/invoice-tracker").then((m) => ({ default: m.InvoiceTracker })));
const QRScanner = lazyRoute(() => import("@/components/qr-scanner/qr-scanner").then((m) => ({ default: m.QRScanner })));
const PDFUpload = lazyRoute(() => import("@/components/pdf-upload/pdf-upload").then((m) => ({ default: m.PDFUpload })));
const EGAMRepository = lazyRoute(() => import("@/components/egam-repository/egam-repository").then((m) => ({ default: m.EGAMRepository })));
const EmailReviewQueue = lazyRoute(() => import("@/components/email-review-queue/email-review-queue").then((m) => ({ default: m.EmailReviewQueue })));
const ValidationAPIs = lazyRoute(() => import("@/components/validation-apis/validation-apis").then((m) => ({ default: m.ValidationAPIs })));
const NoticeAPIs = lazyRoute(() => import("@/components/notice-apis/notice-apis").then((m) => ({ default: m.NoticeAPIs })));
const APIUsage = lazyRoute(() => import("@/components/api-usage/api-usage").then((m) => ({ default: m.APIUsage })));
const SystemLogs = lazyRoute(() => import("@/components/system-logs/system-logs").then((m) => ({ default: m.SystemLogs })));
const UserManagement = lazyRoute(() => import("@/components/user-management/user-management").then((m) => ({ default: m.UserManagement })));
const SettingsAndConfig = lazyRoute(() => import("@/components/settings/settings").then((m) => ({ default: m.SettingsAndConfig })));
const EmailSettings = lazyRoute(() => import("@/components/email-settings/email-settings").then((m) => ({ default: m.EmailSettings })));
const UserProfile = lazyRoute(() => import("@/components/user-profile/user-profile").then((m) => ({ default: m.UserProfile })));
const Integrations = lazyRoute(() => import("@/components/integrations/integrations").then((m) => ({ default: m.Integrations })));
const CostModelDashboard = lazyRoute(() => import("@/components/cost-model/dashboard/cost-model-dashboard").then((m) => ({ default: m.CostModelDashboard })));
const InvoiceManagement = lazyRoute(() => import("@/components/invoice-management/invoice-management").then((m) => ({ default: m.InvoiceManagement })));
const EAInvoiceDownloader = lazyRoute(() => import("@/components/ea-invoice-downloader/ea-invoice-downloader").then((m) => ({ default: m.EAInvoiceDownloader })));
const CustomsIGCR = lazyRoute(() => import("@/components/customs-igcr/customs-igcr").then((m) => ({ default: m.CustomsIGCR })));
const VerticalsMaster = lazyRoute(() => import("@/components/cost-model/verticals-master/verticals-master").then((m) => ({ default: m.VerticalsMaster })));
const AssetManagement = lazyRoute(() => import("@/components/cost-model/asset-management/asset-management").then((m) => ({ default: m.AssetManagement })));
const AssetClass = lazyRoute(() => import("@/components/cost-model/asset-class/asset-class").then((m) => ({ default: m.AssetClass })));
const AssetType = lazyRoute(() => import("@/components/cost-model/asset-type/asset-type").then((m) => ({ default: m.AssetType })));
const Asset = lazyRoute(() => import("@/components/cost-model/asset/asset").then((m) => ({ default: m.Asset })));
const ServiceGroup = lazyRoute(() => import("@/components/cost-model/service-group/service-group").then((m) => ({ default: m.ServiceGroup })));
const Service = lazyRoute(() => import("@/components/cost-model/service/service").then((m) => ({ default: m.Service })));
const CostGroup = lazyRoute(() => import("@/components/cost-model/cost-group/cost-group").then((m) => ({ default: m.CostGroup })));
const BudgetLine = lazyRoute(() => import("@/components/cost-model/budget-line/budget-line").then((m) => ({ default: m.BudgetLine })));
const CostElement = lazyRoute(() => import("@/components/cost-model/cost-element/cost-element").then((m) => ({ default: m.CostElement })));
const CostRules = lazyRoute(() => import("@/components/cost-model/cost-rules/cost-rules").then((m) => ({ default: m.CostRules })));
const ServiceCosting = lazyRoute(() => import("@/components/cost-model/service-costing/service-costing").then((m) => ({ default: m.ServiceCosting })));
const ServiceLevelCost = lazyRoute(() => import("@/components/cost-model/service-level-cost/service-level-cost").then((m) => ({ default: m.ServiceLevelCost })));

export type LazyRouteComponent = React.LazyExoticComponent<React.ComponentType<any>>;

export const LAZY_ROUTE_MAP: Record<string, LazyRouteComponent> = {
  "invoice-tracker": InvoiceTracker,
  "qr-scanner": QRScanner,
  "pdf-upload": PDFUpload,
  "egam-repository": EGAMRepository,
  "email-review": EmailReviewQueue,
  "validation-apis": ValidationAPIs,
  "notice-apis": NoticeAPIs,
  "api-usage": APIUsage,
  integrations: Integrations,
  logs: SystemLogs,
  "user-management": UserManagement,
  settings: SettingsAndConfig,
  "email-settings": EmailSettings,
  "user-profile": UserProfile,
  "cost-model-dashboard": CostModelDashboard,
  "verticals-master": VerticalsMaster,
  "asset-management": AssetManagement,
  "asset-class": AssetClass,
  "asset-type": AssetType,
  assets: Asset,
  "service-groups": ServiceGroup,
  services: Service,
  "cost-groups": CostGroup,
  "budget-lines": BudgetLine,
  "cost-elements": CostElement,
  "cost-rules": CostRules,
  "service-costing": ServiceCosting,
  "service-level-cost": ServiceLevelCost,
  "invoice-management": InvoiceManagement,
  "agent-tickets": InvoiceManagement,
  "ea-invoice-downloader": EAInvoiceDownloader,
  "ea-agent-tickets": EAInvoiceDownloader,
  "ea-audit-logs": EAInvoiceDownloader,
};
CUSTOMS_IGCR_TAB_IDS.forEach((id) => {
  LAZY_ROUTE_MAP[id] = CustomsIGCR;
});

/** Fallback shown while a lazy route is loading */
export function RouteFallback() {
  return (
    <div className="flex items-center justify-center min-h-[320px] w-full">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm">Loading…</p>
      </div>
    </div>
  );
}
