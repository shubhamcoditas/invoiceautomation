/**
 * Shared types for Customs IGCR application area.
 */

/** Import register row (duty payable, BOE, etc.) */
export type ImportRegisterEntry = {
  month: string;
  name: string;
  supplierType: string;
  poNumber: string;
  invoice: string;
  recDt: string;
  partId: string;
  description: string;
  /** Unit of measurement - e.g. kgs, feet, litres, units */
  uom?: string;
  boeNumber: string;
  recDt2: string;
  dutyPayable: number;
};

/** Shared row shape for ERT and DTA Sales (same structure as Import Register) */
export type GoodsMovementEntry = {
  month: string;
  name: string;
  type: string;
  poNumber: string;
  invoice: string;
  date1: string;
  partId: string;
  description: string;
  refNumber: string;
  date2: string;
  value?: number;
  dutyWaiver?: number;
};

/** Job work tab: SMT / child-part columns */
export type JobWorkEntry = {
  vendorName: string;
  childPartCategory: string; // EXPORT / DTA / SCRAP
  childPartName: string;
  childPartId: string;
  childPartCth: string;
  childUom: string;
  totalChildPartQty: number;
  receivedQtyInInventory: number;
  receivedQtyDestroyedLostScrapped: number;
  receivedQtySentToJobWorker: number;
  qtyReceivedBackFromJobWorker: number;
  receivedQtyTransferToInterUnit: number;
  qtyReceivedBackFromInterUnit: number;
};

export type TabVariant = "exports" | "dta";

export type TabConfig = {
  title: string;
  cardTitle: string;
  cardDescription: string;
  uploadLabel: string;
  emptyTitle: string;
  emptyHint: string;
  colName: string;
  colDate1: string;
  colRef: string;
  colDate2: string;
  colValue: string;
  hasTotal: boolean;
  initial: GoodsMovementEntry[];
  uploadAdd: GoodsMovementEntry[];
};
