/**
 * Mock data for Customs IGCR (Import Register, ERT, DTA Sales, Job Work, tab config).
 */

import type { GoodsMovementEntry, ImportRegisterEntry, JobWorkEntry, TabConfig, TabVariant } from "@/types/customs-igcr";

// ----- Import Register mock data -----
/** 5 dummy entries shown on page launch */
export const INITIAL_ENTRIES: ImportRegisterEntry[] = [
  { month: "Jan 2025", name: "Alpha Trading LLC", supplierType: "Overseas", poNumber: "PO-2025-001", invoice: "INV-7842", recDt: "2025-01-08", partId: "PT-1001", description: "Industrial machinery parts - Category A", uom: "12 units", boeNumber: "BOE-2025-001234", recDt2: "2025-01-10", dutyPayable: 124500 },
  { month: "Jan 2025", name: "Beta Imports Inc", supplierType: "Domestic", poNumber: "PO-2025-002", invoice: "INV-7843", recDt: "2025-01-12", partId: "PT-1002", description: "Electronic components - PCB assembly", uom: "8 units", boeNumber: "BOE-2025-001235", recDt2: "2025-01-14", dutyPayable: 28750 },
  { month: "Feb 2025", name: "Gamma Supplies FZE", supplierType: "Overseas", poNumber: "PO-2025-003", invoice: "INV-7844", recDt: "2025-02-03", partId: "PT-1003", description: "Raw materials - Steel grade 304", uom: "250 kg", boeNumber: "BOE-2025-001236", recDt2: "2025-02-05", dutyPayable: 562000 },
  { month: "Feb 2025", name: "Delta Trading Co", supplierType: "Overseas", poNumber: "PO-2025-004", invoice: "INV-7845", recDt: "2025-02-11", partId: "PT-1004", description: "Packaging materials - Cartons", uom: "500 units", boeNumber: "BOE-2025-001237", recDt2: "2025-02-13", dutyPayable: 18900 },
  { month: "Feb 2025", name: "Epsilon Logistics", supplierType: "Domestic", poNumber: "PO-2025-005", invoice: "INV-7846", recDt: "2025-02-18", partId: "PT-1005", description: "Spare parts - Conveyor system", uom: "3 units", boeNumber: "BOE-2025-001238", recDt2: "2025-02-20", dutyPayable: 43120 },
];
/** 5 dummy entries added when user clicks "Fetch from CAT" */
export const CAT_FETCH_ENTRIES: ImportRegisterEntry[] = [
  { month: "Mar 2025", name: "Zeta Manufacturing", supplierType: "Overseas", poNumber: "PO-2025-006", invoice: "INV-7847", recDt: "2025-03-02", partId: "PT-1006", description: "Tooling and fixtures", uom: "1 unit", boeNumber: "BOE-2025-001239", recDt2: "2025-03-04", dutyPayable: 156800 },
  { month: "Mar 2025", name: "Omega Imports FZE", supplierType: "Overseas", poNumber: "PO-2025-007", invoice: "INV-7848", recDt: "2025-03-09", partId: "PT-1007", description: "Industrial machinery parts - Category B", uom: "6 units", boeNumber: "BOE-2025-001240", recDt2: "2025-03-11", dutyPayable: 89340 },
  { month: "Mar 2025", name: "Sigma Trading Co", supplierType: "Domestic", poNumber: "PO-2025-008", invoice: "INV-7849", recDt: "2025-03-16", partId: "PT-1008", description: "Safety equipment - PPE", uom: "24 units", boeNumber: "BOE-2025-001241", recDt2: "2025-03-18", dutyPayable: 22400 },
  { month: "Apr 2025", name: "Theta Supplies LLC", supplierType: "Overseas", poNumber: "PO-2025-009", invoice: "INV-7850", recDt: "2025-04-01", partId: "PT-1009", description: "Raw materials - Aluminium grade 6061", uom: "120 kg", boeNumber: "BOE-2025-001242", recDt2: "2025-04-03", dutyPayable: 318750 },
  { month: "Apr 2025", name: "Phi Logistics Inc", supplierType: "Domestic", poNumber: "PO-2025-010", invoice: "INV-7851", recDt: "2025-04-08", partId: "PT-1010", description: "Consumables - Lubricants and sealants", uom: "3 litres", boeNumber: "BOE-2025-001243", recDt2: "2025-04-10", dutyPayable: 14200 },
];
/** 5 dummy entries added when user uploads a PRT file */
export const PRT_UPLOAD_ENTRIES: ImportRegisterEntry[] = [
  { month: "Apr 2025", name: "Kappa Industries", supplierType: "Overseas", poNumber: "PO-2025-011", invoice: "INV-7852", recDt: "2025-04-12", partId: "PT-1011", description: "Tooling and fixtures - PRT import", uom: "2 units", boeNumber: "BOE-2025-001244", recDt2: "2025-04-14", dutyPayable: 67500 },
  { month: "Apr 2025", name: "Lambda Exports FZE", supplierType: "Overseas", poNumber: "PO-2025-012", invoice: "INV-7853", recDt: "2025-04-18", partId: "PT-1012", description: "Electrical panels and components", uom: "15 units", boeNumber: "BOE-2025-001245", recDt2: "2025-04-20", dutyPayable: 198400 },
  { month: "May 2025", name: "Mu Trading Co", supplierType: "Domestic", poNumber: "PO-2025-013", invoice: "INV-7854", recDt: "2025-05-02", partId: "PT-1013", description: "Office equipment and furniture", uom: "4 units", boeNumber: "BOE-2025-001246", recDt2: "2025-05-04", dutyPayable: 41200 },
  { month: "May 2025", name: "Nu Supplies LLC", supplierType: "Overseas", poNumber: "PO-2025-014", invoice: "INV-7855", recDt: "2025-05-09", partId: "PT-1014", description: "Chemicals - Industrial grade", uom: "50 litres", boeNumber: "BOE-2025-001247", recDt2: "2025-05-11", dutyPayable: 283600 },
  { month: "May 2025", name: "Xi Logistics Inc", supplierType: "Domestic", poNumber: "PO-2025-015", invoice: "INV-7856", recDt: "2025-05-15", partId: "PT-1015", description: "Spare parts - Hydraulic systems", uom: "1 kg", boeNumber: "BOE-2025-001248", recDt2: "2025-05-17", dutyPayable: 89100 },
];

// ----- Exports (ERT) mock data -----
export const EXPORTS_INITIAL: GoodsMovementEntry[] = [
  { month: "Jan 2025", name: "Global Exports Ltd", type: "Merchant", poNumber: "PO-E-001", invoice: "INV-E-101", date1: "2025-01-08", partId: "PT-1001", description: "Finished goods - Assembly A", refNumber: "SB-2025-001234", date2: "2025-01-10", value: 425000, dutyWaiver: 42500 },
  { month: "Jan 2025", name: "Overseas Trading FZE", type: "Deemed", poNumber: "PO-E-002", invoice: "INV-E-102", date1: "2025-01-12", partId: "PT-1002", description: "Electronic modules", refNumber: "SB-2025-001235", date2: "2025-01-14", value: 198000, dutyWaiver: 0 },
  { month: "Feb 2025", name: "Euro Parts Inc", type: "Merchant", poNumber: "PO-E-003", invoice: "INV-E-103", date1: "2025-02-03", partId: "PT-1003", description: "Machinery components", refNumber: "SB-2025-001236", date2: "2025-02-05", value: 562000, dutyWaiver: 56200 },
  { month: "Feb 2025", name: "Asia Pacific Corp", type: "Merchant", poNumber: "PO-E-004", invoice: "INV-E-104", date1: "2025-02-11", partId: "PT-1004", description: "Raw material - Steel", refNumber: "SB-2025-001237", date2: "2025-02-13", value: 289000, dutyWaiver: 28900 },
  { month: "Feb 2025", name: "Gulf Trading LLC", type: "Deemed", poNumber: "PO-E-005", invoice: "INV-E-105", date1: "2025-02-18", partId: "PT-1005", description: "Spare parts kit", refNumber: "SB-2025-001238", date2: "2025-02-20", value: 87500, dutyWaiver: 8750 },
];
export const EXPORTS_UPLOAD_ADD: GoodsMovementEntry[] = [
  { month: "Mar 2025", name: "Nordic Imports AB", type: "Merchant", poNumber: "PO-E-006", invoice: "INV-E-106", date1: "2025-03-02", partId: "PT-1006", description: "Tooling export", refNumber: "SB-2025-001239", date2: "2025-03-04", value: 156000, dutyWaiver: 15600 },
  { month: "Mar 2025", name: "Atlantic Shipping", type: "Merchant", poNumber: "PO-E-007", invoice: "INV-E-107", date1: "2025-03-09", partId: "PT-1007", description: "Packaged goods", refNumber: "SB-2025-001240", date2: "2025-03-11", value: 320000, dutyWaiver: 32000 },
];

// ----- DTA Sales mock data -----
export const DTA_INITIAL: GoodsMovementEntry[] = [
  { month: "Jan 2025", name: "DTA Buyer One Pvt Ltd", type: "DTA", poNumber: "PO-D-001", invoice: "INV-D-101", date1: "2025-01-06", partId: "PT-2001", description: "Components - DTA sale", refNumber: "DTA-2025-001", date2: "2025-01-08", value: 185000, dutyWaiver: 18500 },
  { month: "Jan 2025", name: "Domestic Manufacturing Co", type: "DTA", poNumber: "PO-D-002", invoice: "INV-D-102", date1: "2025-01-14", partId: "PT-2002", description: "Semi-finished goods", refNumber: "DTA-2025-002", date2: "2025-01-16", value: 420000, dutyWaiver: 42000 },
  { month: "Feb 2025", name: "Industrial Supplies India", type: "DTA", poNumber: "PO-D-003", invoice: "INV-D-103", date1: "2025-02-05", partId: "PT-2003", description: "Raw material clearance", refNumber: "DTA-2025-003", date2: "2025-02-07", value: 275000, dutyWaiver: 27500 },
  { month: "Feb 2025", name: "Tech Components Ltd", type: "DTA", poNumber: "PO-D-004", invoice: "INV-D-104", date1: "2025-02-12", partId: "PT-2004", description: "Electronic parts", refNumber: "DTA-2025-004", date2: "2025-02-14", value: 168000, dutyWaiver: 0 },
  { month: "Feb 2025", name: "Auto Parts DTA", type: "DTA", poNumber: "PO-D-005", invoice: "INV-D-105", date1: "2025-02-20", partId: "PT-2005", description: "Automotive components", refNumber: "DTA-2025-005", date2: "2025-02-22", value: 390000, dutyWaiver: 39000 },
];
export const DTA_UPLOAD_ADD: GoodsMovementEntry[] = [
  { month: "Mar 2025", name: "Pharma Excipients DTA", type: "DTA", poNumber: "PO-D-006", invoice: "INV-D-106", date1: "2025-03-01", partId: "PT-2006", description: "Pharma raw material", refNumber: "DTA-2025-006", date2: "2025-03-03", value: 510000, dutyWaiver: 51000 },
  { month: "Mar 2025", name: "Textile Machinery Ltd", type: "DTA", poNumber: "PO-D-007", invoice: "INV-D-107", date1: "2025-03-10", partId: "PT-2007", description: "Machinery parts DTA", refNumber: "DTA-2025-007", date2: "2025-03-12", value: 245000, dutyWaiver: 24500 },
];

// ----- Job Work (SMT) mock data -----
export const JOBWORK_INITIAL: JobWorkEntry[] = [
  { vendorName: "Precision Job Works", childPartCategory: "EXPORT", childPartName: "Shaft Assembly", childPartId: "CP-1001", childPartCth: "8483", childUom: "NOS", totalChildPartQty: 500, receivedQtyInInventory: 320, receivedQtyDestroyedLostScrapped: 5, receivedQtySentToJobWorker: 100, qtyReceivedBackFromJobWorker: 75, receivedQtyTransferToInterUnit: 0, qtyReceivedBackFromInterUnit: 0 },
  { vendorName: "Surface Coating Pvt Ltd", childPartCategory: "DTA", childPartName: "Housing Cover", childPartId: "CP-1002", childPartCth: "7326", childUom: "NOS", totalChildPartQty: 800, receivedQtyInInventory: 450, receivedQtyDestroyedLostScrapped: 10, receivedQtySentToJobWorker: 200, qtyReceivedBackFromJobWorker: 180, receivedQtyTransferToInterUnit: 50, qtyReceivedBackFromInterUnit: 45 },
  { vendorName: "Heat Treatment Works", childPartCategory: "SCRAP", childPartName: "Rejected Brackets", childPartId: "CP-1003", childPartCth: "7326", childUom: "KG", totalChildPartQty: 200, receivedQtyInInventory: 80, receivedQtyDestroyedLostScrapped: 90, receivedQtySentToJobWorker: 0, qtyReceivedBackFromJobWorker: 0, receivedQtyTransferToInterUnit: 0, qtyReceivedBackFromInterUnit: 0 },
  { vendorName: "Assembly Subcontractors", childPartCategory: "EXPORT", childPartName: "Gear Module", childPartId: "CP-1004", childPartCth: "8483", childUom: "NOS", totalChildPartQty: 350, receivedQtyInInventory: 200, receivedQtyDestroyedLostScrapped: 0, receivedQtySentToJobWorker: 120, qtyReceivedBackFromJobWorker: 80, receivedQtyTransferToInterUnit: 30, qtyReceivedBackFromInterUnit: 20 },
  { vendorName: "Precision Job Works", childPartCategory: "DTA", childPartName: "Bearing Housing", childPartId: "CP-1005", childPartCth: "8483", childUom: "NOS", totalChildPartQty: 600, receivedQtyInInventory: 380, receivedQtyDestroyedLostScrapped: 2, receivedQtySentToJobWorker: 150, qtyReceivedBackFromJobWorker: 140, receivedQtyTransferToInterUnit: 0, qtyReceivedBackFromInterUnit: 0 },
];
export const JOBWORK_UPLOAD_ADD: JobWorkEntry[] = [
  { vendorName: "Surface Coating Pvt Ltd", childPartCategory: "EXPORT", childPartName: "Coated Panel", childPartId: "CP-1006", childPartCth: "7210", childUom: "NOS", totalChildPartQty: 400, receivedQtyInInventory: 220, receivedQtyDestroyedLostScrapped: 0, receivedQtySentToJobWorker: 100, qtyReceivedBackFromJobWorker: 90, receivedQtyTransferToInterUnit: 0, qtyReceivedBackFromInterUnit: 0 },
  { vendorName: "Testing Lab Services", childPartCategory: "DTA", childPartName: "Tested Module", childPartId: "CP-1007", childPartCth: "9030", childUom: "NOS", totalChildPartQty: 150, receivedQtyInInventory: 60, receivedQtyDestroyedLostScrapped: 0, receivedQtySentToJobWorker: 50, qtyReceivedBackFromJobWorker: 40, receivedQtyTransferToInterUnit: 0, qtyReceivedBackFromInterUnit: 0 },
];

// ----- Tab config for ERT / DTA (Sales tracking) -----
export const TAB_CONFIG: Record<TabVariant, TabConfig> = {
  exports: {
    title: "ERT",
    cardTitle: "ERT entries",
    cardDescription: "Upload ERT details to populate the register",
    uploadLabel: "Upload ERT",
    emptyTitle: "No ERT entries yet",
    emptyHint: "Click Upload ERT to add entries from a file.",
    colName: "Buyer/Customer",
    colDate1: "Ship Date",
    colRef: "Shipping Bill No",
    colDate2: "Export Date",
    colValue: "Export Value (INR)",
    hasTotal: true,
    initial: EXPORTS_INITIAL,
    uploadAdd: EXPORTS_UPLOAD_ADD,
  },
  dta: {
    title: "DTA Sales",
    cardTitle: "DTA sale entries",
    cardDescription: "Upload DTA sales details to populate the register",
    uploadLabel: "Upload DTA file",
    emptyTitle: "No DTA sale entries yet",
    emptyHint: "Click Upload DTA file to add entries from a file.",
    colName: "Buyer",
    colDate1: "Sale Date",
    colRef: "Document Ref",
    colDate2: "DTA Date",
    colValue: "Sale Value (INR)",
    hasTotal: true,
    initial: DTA_INITIAL,
    uploadAdd: DTA_UPLOAD_ADD,
  },
};
