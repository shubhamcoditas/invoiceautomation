/**
 * Single source of truth for Customs IGCR application tab IDs and navigation.
 * Used by: CustomsIGCRSidebar, CustomsIGCR (router), and App (to detect IGCR area).
 */

import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  UserPlus,
  Package,
  Truck,
  ListTree,
  TrendingUp,
  Calculator,
  ShieldCheck,
} from "lucide-react";

export const CUSTOMS_IGCR_TAB_PREFIX = "customs-igcr-" as const;

export type CustomsIGCRTabId =
  | "customs-igcr-dashboards"
  | "customs-igcr-onboarding"
  | "customs-igcr-import-register"
  | "customs-igcr-goods-movement"
  | "customs-igcr-bom-setup"
  | "customs-igcr-sales-tracking"
  | "customs-igcr-igcr-working";

export interface CustomsIGCRNavItem {
  id: CustomsIGCRTabId;
  label: string;
  icon: LucideIcon;
}

export const CUSTOMS_IGCR_NAV_ITEMS: CustomsIGCRNavItem[] = [
  { id: "customs-igcr-dashboards", label: "Dashboards", icon: LayoutDashboard },
  { id: "customs-igcr-onboarding", label: "Entity Onboarding", icon: UserPlus },
  { id: "customs-igcr-import-register", label: "Import Register", icon: Package },
  { id: "customs-igcr-goods-movement", label: "Goods Movement", icon: Truck },
  { id: "customs-igcr-bom-setup", label: "BOM Setup", icon: ListTree },
  { id: "customs-igcr-sales-tracking", label: "Sales tracking", icon: TrendingUp },
  { id: "customs-igcr-igcr-working", label: "IGCR Working", icon: Calculator },
];

/** All Customs IGCR tab IDs (for IGCR detection in App) */
export const CUSTOMS_IGCR_TAB_IDS = CUSTOMS_IGCR_NAV_ITEMS.map((item) => item.id);

export function isCustomsIGCRTab(tabId: string | undefined): tabId is CustomsIGCRTabId {
  if (!tabId) return false;
  return CUSTOMS_IGCR_TAB_IDS.includes(tabId as CustomsIGCRTabId);
}

/** Label for a tab ID (for fallback / “coming soon” content) */
export function getCustomsIGCRTabLabel(tabId: string): string {
  const item = CUSTOMS_IGCR_NAV_ITEMS.find((n) => n.id === tabId);
  return item?.label ?? "Customs IGCR";
}

/** Icon for header/branding (shared) */
export const CustomsIGCRBrandIcon = ShieldCheck;
