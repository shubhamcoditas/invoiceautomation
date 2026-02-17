"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUploadButton } from "@/components/ui/file-upload-button";
import { Inbox, ChevronDown, Search, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

/** Shared row shape for Exports and DTA (same structure as Import Register) */
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
  childPartCategory: string;   // EXPORT / DTA / SCRAP
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

function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
}

function searchMatches(query: string, entry: GoodsMovementEntry): boolean {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  const haystack = [
    entry.month,
    entry.name,
    entry.type,
    entry.poNumber,
    entry.invoice,
    entry.partId,
    entry.description,
    entry.refNumber,
    entry.date1,
    entry.date2,
  ].join(" ");
  return haystack.toLowerCase().includes(q);
}

function searchMatchesJobWork(query: string, entry: JobWorkEntry): boolean {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  const haystack = [
    entry.vendorName,
    entry.childPartCategory,
    entry.childPartName,
    entry.childPartId,
    entry.childPartCth,
    entry.childUom,
  ].join(" ");
  return haystack.toLowerCase().includes(q);
}

// ----- Exports (ERT) mock data -----
const EXPORTS_INITIAL: GoodsMovementEntry[] = [
  { month: "Jan 2025", name: "Global Exports Ltd", type: "Merchant", poNumber: "PO-E-001", invoice: "INV-E-101", date1: "2025-01-08", partId: "PT-1001", description: "Finished goods - Assembly A", refNumber: "SB-2025-001234", date2: "2025-01-10", value: 425000, dutyWaiver: 42500 },
  { month: "Jan 2025", name: "Overseas Trading FZE", type: "Deemed", poNumber: "PO-E-002", invoice: "INV-E-102", date1: "2025-01-12", partId: "PT-1002", description: "Electronic modules", refNumber: "SB-2025-001235", date2: "2025-01-14", value: 198000, dutyWaiver: 0 },
  { month: "Feb 2025", name: "Euro Parts Inc", type: "Merchant", poNumber: "PO-E-003", invoice: "INV-E-103", date1: "2025-02-03", partId: "PT-1003", description: "Machinery components", refNumber: "SB-2025-001236", date2: "2025-02-05", value: 562000, dutyWaiver: 56200 },
  { month: "Feb 2025", name: "Asia Pacific Corp", type: "Merchant", poNumber: "PO-E-004", invoice: "INV-E-104", date1: "2025-02-11", partId: "PT-1004", description: "Raw material - Steel", refNumber: "SB-2025-001237", date2: "2025-02-13", value: 289000, dutyWaiver: 28900 },
  { month: "Feb 2025", name: "Gulf Trading LLC", type: "Deemed", poNumber: "PO-E-005", invoice: "INV-E-105", date1: "2025-02-18", partId: "PT-1005", description: "Spare parts kit", refNumber: "SB-2025-001238", date2: "2025-02-20", value: 87500, dutyWaiver: 8750 },
];
const EXPORTS_UPLOAD_ADD: GoodsMovementEntry[] = [
  { month: "Mar 2025", name: "Nordic Imports AB", type: "Merchant", poNumber: "PO-E-006", invoice: "INV-E-106", date1: "2025-03-02", partId: "PT-1006", description: "Tooling export", refNumber: "SB-2025-001239", date2: "2025-03-04", value: 156000, dutyWaiver: 15600 },
  { month: "Mar 2025", name: "Atlantic Shipping", type: "Merchant", poNumber: "PO-E-007", invoice: "INV-E-107", date1: "2025-03-09", partId: "PT-1007", description: "Packaged goods", refNumber: "SB-2025-001240", date2: "2025-03-11", value: 320000, dutyWaiver: 32000 },
];

// ----- DTA Sales mock data -----
const DTA_INITIAL: GoodsMovementEntry[] = [
  { month: "Jan 2025", name: "DTA Buyer One Pvt Ltd", type: "DTA", poNumber: "PO-D-001", invoice: "INV-D-101", date1: "2025-01-06", partId: "PT-2001", description: "Components - DTA sale", refNumber: "DTA-2025-001", date2: "2025-01-08", value: 185000, dutyWaiver: 18500 },
  { month: "Jan 2025", name: "Domestic Manufacturing Co", type: "DTA", poNumber: "PO-D-002", invoice: "INV-D-102", date1: "2025-01-14", partId: "PT-2002", description: "Semi-finished goods", refNumber: "DTA-2025-002", date2: "2025-01-16", value: 420000, dutyWaiver: 42000 },
  { month: "Feb 2025", name: "Industrial Supplies India", type: "DTA", poNumber: "PO-D-003", invoice: "INV-D-103", date1: "2025-02-05", partId: "PT-2003", description: "Raw material clearance", refNumber: "DTA-2025-003", date2: "2025-02-07", value: 275000, dutyWaiver: 27500 },
  { month: "Feb 2025", name: "Tech Components Ltd", type: "DTA", poNumber: "PO-D-004", invoice: "INV-D-104", date1: "2025-02-12", partId: "PT-2004", description: "Electronic parts", refNumber: "DTA-2025-004", date2: "2025-02-14", value: 168000, dutyWaiver: 0 },
  { month: "Feb 2025", name: "Auto Parts DTA", type: "DTA", poNumber: "PO-D-005", invoice: "INV-D-105", date1: "2025-02-20", partId: "PT-2005", description: "Automotive components", refNumber: "DTA-2025-005", date2: "2025-02-22", value: 390000, dutyWaiver: 39000 },
];
const DTA_UPLOAD_ADD: GoodsMovementEntry[] = [
  { month: "Mar 2025", name: "Pharma Excipients DTA", type: "DTA", poNumber: "PO-D-006", invoice: "INV-D-106", date1: "2025-03-01", partId: "PT-2006", description: "Pharma raw material", refNumber: "DTA-2025-006", date2: "2025-03-03", value: 510000, dutyWaiver: 51000 },
  { month: "Mar 2025", name: "Textile Machinery Ltd", type: "DTA", poNumber: "PO-D-007", invoice: "INV-D-107", date1: "2025-03-10", partId: "PT-2007", description: "Machinery parts DTA", refNumber: "DTA-2025-007", date2: "2025-03-12", value: 245000, dutyWaiver: 24500 },
];

// ----- Job Work (SMT) mock data -----
const JOBWORK_INITIAL: JobWorkEntry[] = [
  { vendorName: "Precision Job Works", childPartCategory: "EXPORT", childPartName: "Shaft Assembly", childPartId: "CP-1001", childPartCth: "8483", childUom: "NOS", totalChildPartQty: 500, receivedQtyInInventory: 320, receivedQtyDestroyedLostScrapped: 5, receivedQtySentToJobWorker: 100, qtyReceivedBackFromJobWorker: 75, receivedQtyTransferToInterUnit: 0, qtyReceivedBackFromInterUnit: 0 },
  { vendorName: "Surface Coating Pvt Ltd", childPartCategory: "DTA", childPartName: "Housing Cover", childPartId: "CP-1002", childPartCth: "7326", childUom: "NOS", totalChildPartQty: 800, receivedQtyInInventory: 450, receivedQtyDestroyedLostScrapped: 10, receivedQtySentToJobWorker: 200, qtyReceivedBackFromJobWorker: 180, receivedQtyTransferToInterUnit: 50, qtyReceivedBackFromInterUnit: 45 },
  { vendorName: "Heat Treatment Works", childPartCategory: "SCRAP", childPartName: "Rejected Brackets", childPartId: "CP-1003", childPartCth: "7326", childUom: "KG", totalChildPartQty: 200, receivedQtyInInventory: 80, receivedQtyDestroyedLostScrapped: 90, receivedQtySentToJobWorker: 0, qtyReceivedBackFromJobWorker: 0, receivedQtyTransferToInterUnit: 0, qtyReceivedBackFromInterUnit: 0 },
  { vendorName: "Assembly Subcontractors", childPartCategory: "EXPORT", childPartName: "Gear Module", childPartId: "CP-1004", childPartCth: "8483", childUom: "NOS", totalChildPartQty: 350, receivedQtyInInventory: 200, receivedQtyDestroyedLostScrapped: 0, receivedQtySentToJobWorker: 120, qtyReceivedBackFromJobWorker: 80, receivedQtyTransferToInterUnit: 30, qtyReceivedBackFromInterUnit: 20 },
  { vendorName: "Precision Job Works", childPartCategory: "DTA", childPartName: "Bearing Housing", childPartId: "CP-1005", childPartCth: "8483", childUom: "NOS", totalChildPartQty: 600, receivedQtyInInventory: 380, receivedQtyDestroyedLostScrapped: 2, receivedQtySentToJobWorker: 150, qtyReceivedBackFromJobWorker: 140, receivedQtyTransferToInterUnit: 0, qtyReceivedBackFromInterUnit: 0 },
];
const JOBWORK_UPLOAD_ADD: JobWorkEntry[] = [
  { vendorName: "Surface Coating Pvt Ltd", childPartCategory: "EXPORT", childPartName: "Coated Panel", childPartId: "CP-1006", childPartCth: "7210", childUom: "NOS", totalChildPartQty: 400, receivedQtyInInventory: 220, receivedQtyDestroyedLostScrapped: 0, receivedQtySentToJobWorker: 100, qtyReceivedBackFromJobWorker: 90, receivedQtyTransferToInterUnit: 0, qtyReceivedBackFromInterUnit: 0 },
  { vendorName: "Testing Lab Services", childPartCategory: "DTA", childPartName: "Tested Module", childPartId: "CP-1007", childPartCth: "9030", childUom: "NOS", totalChildPartQty: 150, receivedQtyInInventory: 60, receivedQtyDestroyedLostScrapped: 0, receivedQtySentToJobWorker: 50, qtyReceivedBackFromJobWorker: 40, receivedQtyTransferToInterUnit: 0, qtyReceivedBackFromInterUnit: 0 },
];

const UPLOAD_DURATION_MS = 2000;

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

export function GoodsMovementTab({
  variant,
  config,
  onDutyWaiverTotalChange,
}: {
  variant: TabVariant;
  config: TabConfig;
  onDutyWaiverTotalChange?: (total: number) => void;
}) {
  const [entries, setEntries] = useState<GoodsMovementEntry[]>(config.initial);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setEntries((prev) => [...prev, ...config.uploadAdd]);
      setIsUploading(false);
    }, UPLOAD_DURATION_MS);
  };

  const availableMonths = useMemo(() => {
    const set = new Set(entries.map((e) => e.month));
    return Array.from(set).sort();
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const monthOk = selectedMonths.length === 0 || selectedMonths.includes(entry.month);
      const searchOk = searchMatches(searchQuery, entry);
      return monthOk && searchOk;
    });
  }, [entries, selectedMonths, searchQuery]);

  const totalDutyWaiver = useMemo(
    () => (config.hasTotal ? filteredEntries.reduce((sum, e) => sum + (e.dutyWaiver ?? 0), 0) : 0),
    [config.hasTotal, filteredEntries]
  );

  useEffect(() => {
    onDutyWaiverTotalChange?.(totalDutyWaiver);
  }, [totalDutyWaiver, onDutyWaiverTotalChange]);

  const toggleMonth = (month: string) => {
    setSelectedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  };
  const clearMonthFilter = () => setSelectedMonths([]);

  const isEmpty = entries.length === 0;
  const filteredEmpty = filteredEntries.length === 0;
  const colSpan = 12;

  return (
    <Card className="border-amber-200 dark:border-amber-800">
      <CardHeader>
        <CardTitle>{config.cardTitle}</CardTitle>
        <CardDescription>{config.cardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <FileUploadButton
            label={config.uploadLabel}
            loadingLabel="Uploading…"
            loading={isUploading}
            onFileSelect={handleUpload}
            variant="default"
            className="bg-amber-600 hover:bg-amber-700 text-white border-amber-700"
          />
        </div>

        {!isEmpty && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search entries…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-amber-200 dark:border-amber-800"
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "min-w-[140px] justify-between border-amber-200 dark:border-amber-800",
                    selectedMonths.length > 0 && "bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-100"
                  )}
                >
                  <span>
                    Month
                    {selectedMonths.length > 0 ? ` (${selectedMonths.length})` : ""}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2 border-amber-200 dark:border-amber-800" align="start">
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-amber-200/50 dark:border-amber-800/50 mb-2">
                  <span className="text-sm font-medium">Filter by month</span>
                  {selectedMonths.length > 0 && (
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-amber-700 dark:text-amber-300" onClick={clearMonthFilter}>
                      Clear
                    </Button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {availableMonths.map((month) => (
                    <label
                      key={month}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-amber-50 dark:hover:bg-amber-900/20 cursor-pointer text-sm"
                    >
                      <Checkbox
                        checked={selectedMonths.includes(month)}
                        onCheckedChange={() => toggleMonth(month)}
                      />
                      <span>{month}</span>
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}

        <div className="rounded-md border border-amber-200 dark:border-amber-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                <TableHead className="font-semibold text-amber-900 dark:text-amber-100">Month</TableHead>
                <TableHead className="font-semibold text-amber-900 dark:text-amber-100">{config.colName}</TableHead>
                <TableHead className="font-semibold text-amber-900 dark:text-amber-100">Type</TableHead>
                <TableHead className="font-semibold text-amber-900 dark:text-amber-100">PO#</TableHead>
                <TableHead className="font-semibold text-amber-900 dark:text-amber-100">Invoice</TableHead>
                <TableHead className="font-semibold text-amber-900 dark:text-amber-100">{config.colDate1}</TableHead>
                <TableHead className="font-semibold text-amber-900 dark:text-amber-100">Part ID</TableHead>
                <TableHead className="font-semibold text-amber-900 dark:text-amber-100">Description</TableHead>
                <TableHead className="font-semibold text-amber-900 dark:text-amber-100">{config.colRef}</TableHead>
                <TableHead className="font-semibold text-amber-900 dark:text-amber-100">{config.colDate2}</TableHead>
                <TableHead className="font-semibold text-amber-900 dark:text-amber-100 text-right">{config.colValue}</TableHead>
                <TableHead className="font-semibold text-amber-900 dark:text-amber-100 text-right">Duty Waiver</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isEmpty ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={colSpan} className="h-64 text-center align-middle">
                    <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                      <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-4">
                        <Inbox className="h-10 w-10 text-amber-600 dark:text-amber-400" />
                      </div>
                      <p className="font-medium text-foreground">{config.emptyTitle}</p>
                      <p className="text-sm max-w-sm">{config.emptyHint}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredEmpty ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={colSpan} className="h-48 text-center align-middle text-muted-foreground">
                    No entries match your filters. Try changing the month filter or search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEntries.map((row, idx) => (
                  <TableRow key={`${row.poNumber}-${idx}`} className="border-amber-200/50 dark:border-amber-800/50">
                    <TableCell>{row.month}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.poNumber}</TableCell>
                    <TableCell>{row.invoice}</TableCell>
                    <TableCell>{row.date1}</TableCell>
                    <TableCell>{row.partId}</TableCell>
                    <TableCell className="max-w-[220px]">{row.description}</TableCell>
                    <TableCell>{row.refNumber}</TableCell>
                    <TableCell>{row.date2}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {row.value != null ? formatINR(row.value) : row.status ?? "—"}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {row.dutyWaiver != null ? formatINR(row.dutyWaiver) : "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {config.hasTotal && !isEmpty && !filteredEmpty && (
          <div className="flex justify-end rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                Total Duty Waiver (INR)
              </span>
              <span className="text-lg font-bold tabular-nums text-amber-800 dark:text-amber-200">
                {formatINR(totalDutyWaiver)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** Job work tab: SMT columns, Upload SMT CTA */
function GoodsMovementJobWorkTab() {
  const [entries, setEntries] = useState<JobWorkEntry[]>(JOBWORK_INITIAL);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setEntries((prev) => [...prev, ...JOBWORK_UPLOAD_ADD]);
      setIsUploading(false);
    }, UPLOAD_DURATION_MS);
  };

  const filteredEntries = useMemo(
    () => entries.filter((entry) => searchMatchesJobWork(searchQuery, entry)),
    [entries, searchQuery]
  );

  const isEmpty = entries.length === 0;
  const filteredEmpty = filteredEntries.length === 0;
  const colSpan = 13;

  return (
    <Card className="border-amber-200 dark:border-amber-800">
      <CardHeader>
        <CardTitle>Job work entries</CardTitle>
        <CardDescription>
          Upload SMT to populate child part and job-work movement details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <FileUploadButton
            label="Upload SMT"
            loadingLabel="Uploading…"
            loading={isUploading}
            onFileSelect={handleUpload}
            variant="default"
            className="bg-amber-600 hover:bg-amber-700 text-white border-amber-700"
          />
        </div>

        {!isEmpty && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search entries…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-amber-200 dark:border-amber-800"
              />
            </div>
          </div>
        )}

        <div className="rounded-md border border-amber-200 dark:border-amber-800 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                <TableHead className="font-semibold text-amber-900 dark:text-amber-100 whitespace-nowrap">VENDOR NAME</TableHead>
                <TableHead className="font-semibold text-amber-900 dark:text-amber-100 whitespace-nowrap">CHILD PART CATEGORY (EXPORT / DTA / SCRAP)</TableHead>
                <TableHead className="font-semibold text-amber-900 dark:text-amber-100 whitespace-nowrap">CHILD PART NAME</TableHead>
                <TableHead className="font-semibold text-amber-900 dark:text-amber-100 whitespace-nowrap">CHILD PART ID</TableHead>
                <TableHead className="font-semibold text-amber-900 dark:text-amber-100 whitespace-nowrap">CHILD PART CTH</TableHead>
                <TableHead className="font-semibold text-amber-900 dark:text-amber-100 whitespace-nowrap">CHILD UOM</TableHead>
                <TableHead className="font-semibold text-amber-900 dark:text-amber-100 text-right whitespace-nowrap">TOTAL CHILD PART QTY</TableHead>
                <TableHead className="font-semibold text-amber-900 dark:text-amber-100 text-right whitespace-nowrap">RECEIVED QTY IN INVENTORY</TableHead>
                <TableHead className="font-semibold text-amber-900 dark:text-amber-100 text-right whitespace-nowrap">RECEIVED QTY DESTROYED / LOST / SCRAPPED</TableHead>
                <TableHead className="font-semibold text-amber-900 dark:text-amber-100 text-right whitespace-nowrap">RECEIVED QTY SENT TO JOB-WORKER</TableHead>
                <TableHead className="font-semibold text-amber-900 dark:text-amber-100 text-right whitespace-nowrap">QTY RECEIVED BACK FROM JOB-WORKER</TableHead>
                <TableHead className="font-semibold text-amber-900 dark:text-amber-100 text-right whitespace-nowrap">RECEIVED QTY TRANSFER TO INTER-UNIT</TableHead>
                <TableHead className="font-semibold text-amber-900 dark:text-amber-100 text-right whitespace-nowrap">QTY RECEIVED BACK FROM INTER-UNIT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isEmpty ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={colSpan} className="h-64 text-center align-middle">
                    <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                      <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-4">
                        <Inbox className="h-10 w-10 text-amber-600 dark:text-amber-400" />
                      </div>
                      <p className="font-medium text-foreground">No job work entries yet</p>
                      <p className="text-sm max-w-sm">Click Upload SMT to add entries from a file.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredEmpty ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={colSpan} className="h-48 text-center align-middle text-muted-foreground">
                    No entries match your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEntries.map((row, idx) => (
                  <TableRow key={`${row.childPartId}-${idx}`} className="border-amber-200/50 dark:border-amber-800/50">
                    <TableCell className="whitespace-nowrap">{row.vendorName}</TableCell>
                    <TableCell className="whitespace-nowrap">{row.childPartCategory}</TableCell>
                    <TableCell className="max-w-[180px]">{row.childPartName}</TableCell>
                    <TableCell className="font-mono text-xs">{row.childPartId}</TableCell>
                    <TableCell>{row.childPartCth}</TableCell>
                    <TableCell>{row.childUom}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.totalChildPartQty}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.receivedQtyInInventory}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.receivedQtyDestroyedLostScrapped}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.receivedQtySentToJobWorker}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.qtyReceivedBackFromJobWorker}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.receivedQtyTransferToInterUnit}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.qtyReceivedBackFromInterUnit}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export function GoodsMovement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Goods Movement
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Upload and manage goods sent for job work (SMT)
        </p>
      </div>

      <GoodsMovementJobWorkTab />
    </div>
  );
}
