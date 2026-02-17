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
import { Download, Inbox, Loader2, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIgcrWorking } from "./igcr-working-context";

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

/** 5 dummy entries shown on page launch */
const INITIAL_ENTRIES: ImportRegisterEntry[] = [
  {
    month: "Jan 2025",
    name: "Alpha Trading LLC",
    supplierType: "Overseas",
    poNumber: "PO-2025-001",
    invoice: "INV-7842",
    recDt: "2025-01-08",
    partId: "PT-1001",
    description: "Industrial machinery parts - Category A",
    uom: "12 units",
    boeNumber: "BOE-2025-001234",
    recDt2: "2025-01-10",
    dutyPayable: 124500,
  },
  {
    month: "Jan 2025",
    name: "Beta Imports Inc",
    supplierType: "Domestic",
    poNumber: "PO-2025-002",
    invoice: "INV-7843",
    recDt: "2025-01-12",
    partId: "PT-1002",
    description: "Electronic components - PCB assembly",
    uom: "8 units",
    boeNumber: "BOE-2025-001235",
    recDt2: "2025-01-14",
    dutyPayable: 28750,
  },
  {
    month: "Feb 2025",
    name: "Gamma Supplies FZE",
    supplierType: "Overseas",
    poNumber: "PO-2025-003",
    invoice: "INV-7844",
    recDt: "2025-02-03",
    partId: "PT-1003",
    description: "Raw materials - Steel grade 304",
    uom: "250 kg",
    boeNumber: "BOE-2025-001236",
    recDt2: "2025-02-05",
    dutyPayable: 562000,
  },
  {
    month: "Feb 2025",
    name: "Delta Trading Co",
    supplierType: "Overseas",
    poNumber: "PO-2025-004",
    invoice: "INV-7845",
    recDt: "2025-02-11",
    partId: "PT-1004",
    description: "Packaging materials - Cartons",
    uom: "500 units",
    boeNumber: "BOE-2025-001237",
    recDt2: "2025-02-13",
    dutyPayable: 18900,
  },
  {
    month: "Feb 2025",
    name: "Epsilon Logistics",
    supplierType: "Domestic",
    poNumber: "PO-2025-005",
    invoice: "INV-7846",
    recDt: "2025-02-18",
    partId: "PT-1005",
    description: "Spare parts - Conveyor system",
    uom: "3 units",
    boeNumber: "BOE-2025-001238",
    recDt2: "2025-02-20",
    dutyPayable: 43120,
  },
];

/** 5 dummy entries added when user clicks "Fetch from CAT" */
const CAT_FETCH_ENTRIES: ImportRegisterEntry[] = [
  {
    month: "Mar 2025",
    name: "Zeta Manufacturing",
    supplierType: "Overseas",
    poNumber: "PO-2025-006",
    invoice: "INV-7847",
    recDt: "2025-03-02",
    partId: "PT-1006",
    description: "Tooling and fixtures",
    uom: "1 unit",
    boeNumber: "BOE-2025-001239",
    recDt2: "2025-03-04",
    dutyPayable: 156800,
  },
  {
    month: "Mar 2025",
    name: "Omega Imports FZE",
    supplierType: "Overseas",
    poNumber: "PO-2025-007",
    invoice: "INV-7848",
    recDt: "2025-03-09",
    partId: "PT-1007",
    description: "Industrial machinery parts - Category B",
    uom: "6 units",
    boeNumber: "BOE-2025-001240",
    recDt2: "2025-03-11",
    dutyPayable: 89340,
  },
  {
    month: "Mar 2025",
    name: "Sigma Trading Co",
    supplierType: "Domestic",
    poNumber: "PO-2025-008",
    invoice: "INV-7849",
    recDt: "2025-03-16",
    partId: "PT-1008",
    description: "Safety equipment - PPE",
    uom: "24 units",
    boeNumber: "BOE-2025-001241",
    recDt2: "2025-03-18",
    dutyPayable: 22400,
  },
  {
    month: "Apr 2025",
    name: "Theta Supplies LLC",
    supplierType: "Overseas",
    poNumber: "PO-2025-009",
    invoice: "INV-7850",
    recDt: "2025-04-01",
    partId: "PT-1009",
    description: "Raw materials - Aluminium grade 6061",
    uom: "120 kg",
    boeNumber: "BOE-2025-001242",
    recDt2: "2025-04-03",
    dutyPayable: 318750,
  },
  {
    month: "Apr 2025",
    name: "Phi Logistics Inc",
    supplierType: "Domestic",
    poNumber: "PO-2025-010",
    invoice: "INV-7851",
    recDt: "2025-04-08",
    partId: "PT-1010",
    description: "Consumables - Lubricants and sealants",
    uom: "3 litres",
    boeNumber: "BOE-2025-001243",
    recDt2: "2025-04-10",
    dutyPayable: 14200,
  },
];

const CAT_FETCH_DURATION_MS = 2200;

/** 5 dummy entries added when user uploads a PRT file */
const PRT_UPLOAD_ENTRIES: ImportRegisterEntry[] = [
  {
    month: "Apr 2025",
    name: "Kappa Industries",
    supplierType: "Overseas",
    poNumber: "PO-2025-011",
    invoice: "INV-7852",
    recDt: "2025-04-12",
    partId: "PT-1011",
    description: "Tooling and fixtures - PRT import",
    uom: "2 units",
    boeNumber: "BOE-2025-001244",
    recDt2: "2025-04-14",
    dutyPayable: 67500,
  },
  {
    month: "Apr 2025",
    name: "Lambda Exports FZE",
    supplierType: "Overseas",
    poNumber: "PO-2025-012",
    invoice: "INV-7853",
    recDt: "2025-04-18",
    partId: "PT-1012",
    description: "Electrical panels and components",
    uom: "15 units",
    boeNumber: "BOE-2025-001245",
    recDt2: "2025-04-20",
    dutyPayable: 198400,
  },
  {
    month: "May 2025",
    name: "Mu Trading Co",
    supplierType: "Domestic",
    poNumber: "PO-2025-013",
    invoice: "INV-7854",
    recDt: "2025-05-02",
    partId: "PT-1013",
    description: "Office equipment and furniture",
    uom: "4 units",
    boeNumber: "BOE-2025-001246",
    recDt2: "2025-05-04",
    dutyPayable: 41200,
  },
  {
    month: "May 2025",
    name: "Nu Supplies LLC",
    supplierType: "Overseas",
    poNumber: "PO-2025-014",
    invoice: "INV-7855",
    recDt: "2025-05-09",
    partId: "PT-1014",
    description: "Chemicals - Industrial grade",
    uom: "50 litres",
    boeNumber: "BOE-2025-001247",
    recDt2: "2025-05-11",
    dutyPayable: 283600,
  },
  {
    month: "May 2025",
    name: "Xi Logistics Inc",
    supplierType: "Domestic",
    poNumber: "PO-2025-015",
    invoice: "INV-7856",
    recDt: "2025-05-15",
    partId: "PT-1015",
    description: "Spare parts - Hydraulic systems",
    uom: "1 kg",
    boeNumber: "BOE-2025-001248",
    recDt2: "2025-05-17",
    dutyPayable: 89100,
  },
];

const PRT_SYNC_DURATION_MS = 2500;

function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
}

function searchMatches(query: string, entry: ImportRegisterEntry): boolean {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  const haystack = [
    entry.month,
    entry.name,
    entry.supplierType,
    entry.poNumber,
    entry.invoice,
    entry.partId,
    entry.description,
    entry.uom ?? "",
    entry.boeNumber,
    entry.recDt,
    entry.recDt2,
  ].join(" ");
  return haystack.toLowerCase().includes(q);
}

interface ImportRegisterProps {
  /** When true, hide the page title/description (e.g. when used inside tabs) */
  embedded?: boolean;
}

export function ImportRegister({ embedded }: ImportRegisterProps) {
  const [entries, setEntries] = useState<ImportRegisterEntry[]>(INITIAL_ENTRIES);
  const [isFetchingFromCat, setIsFetchingFromCat] = useState(false);
  const [isSyncingPrt, setIsSyncingPrt] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleFetchFromCat = () => {
    setIsFetchingFromCat(true);
    setTimeout(() => {
      setEntries((prev) => [...prev, ...CAT_FETCH_ENTRIES]);
      setIsFetchingFromCat(false);
    }, CAT_FETCH_DURATION_MS);
  };

  const handlePrtFileSelect = () => {
    setIsSyncingPrt(true);
    setTimeout(() => {
      setEntries((prev) => [...prev, ...PRT_UPLOAD_ENTRIES]);
      setIsSyncingPrt(false);
    }, PRT_SYNC_DURATION_MS);
  };

  const availableMonths = useMemo(() => {
    const set = new Set(entries.map((e) => e.month));
    return Array.from(set).sort();
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const monthOk =
        selectedMonths.length === 0 || selectedMonths.includes(entry.month);
      const searchOk = searchMatches(searchQuery, entry);
      return monthOk && searchOk;
    });
  }, [entries, selectedMonths, searchQuery]);

  const totalDutyPayable = useMemo(
    () => filteredEntries.reduce((sum, e) => sum + e.dutyPayable, 0),
    [filteredEntries]
  );

  const { setDutyPayable } = useIgcrWorking();
  useEffect(() => {
    setDutyPayable(totalDutyPayable);
  }, [totalDutyPayable, setDutyPayable]);

  const toggleMonth = (month: string) => {
    setSelectedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  };

  const clearMonthFilter = () => setSelectedMonths([]);

  const isEmpty = entries.length === 0;
  const filteredEmpty = filteredEntries.length === 0;

  return (
    <div className="space-y-6">
      {!embedded && (
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Import Register
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            All import entries and related data
          </p>
        </div>
      )}

      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle>Import entries</CardTitle>
          <CardDescription>
            Fetch data from CAT or upload a PRT file to populate the register
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleFetchFromCat}
              disabled={isFetchingFromCat || isSyncingPrt}
              className="bg-amber-600 hover:bg-amber-700 text-white border-amber-700"
            >
              {isFetchingFromCat ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Fetching from CAT…
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Fetch from CAT
                </>
              )}
            </Button>
            <FileUploadButton
              label="Upload PRT"
              loadingLabel="Syncing…"
              loading={isSyncingPrt}
              disabled={isFetchingFromCat}
              onFileSelect={handlePrtFileSelect}
              variant="outline"
              className="border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-950/30"
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
                      selectedMonths.length > 0 &&
                        "bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-100"
                    )}
                  >
                    <span>
                      Month
                      {selectedMonths.length > 0
                        ? ` (${selectedMonths.length})`
                        : ""}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-56 p-2 border-amber-200 dark:border-amber-800"
                  align="start"
                >
                  <div className="flex items-center justify-between px-2 py-1.5 border-b border-amber-200/50 dark:border-amber-800/50 mb-2">
                    <span className="text-sm font-medium">Filter by month</span>
                    {selectedMonths.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-amber-700 dark:text-amber-300"
                        onClick={clearMonthFilter}
                      >
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
                  <TableHead className="font-semibold text-amber-900 dark:text-amber-100">NAME</TableHead>
                  <TableHead className="font-semibold text-amber-900 dark:text-amber-100">SUPPLIER TYPE</TableHead>
                  <TableHead className="font-semibold text-amber-900 dark:text-amber-100">PO#</TableHead>
                  <TableHead className="font-semibold text-amber-900 dark:text-amber-100">INVOICE</TableHead>
                  <TableHead className="font-semibold text-amber-900 dark:text-amber-100">REC DT</TableHead>
                  <TableHead className="font-semibold text-amber-900 dark:text-amber-100">PART_ID</TableHead>
                  <TableHead className="font-semibold text-amber-900 dark:text-amber-100">DESCRIPTION</TableHead>
                  <TableHead className="font-semibold text-amber-900 dark:text-amber-100">UOM</TableHead>
                  <TableHead className="font-semibold text-amber-900 dark:text-amber-100">BOE NUMBER</TableHead>
                  <TableHead className="font-semibold text-amber-900 dark:text-amber-100">REC DT</TableHead>
                  <TableHead className="font-semibold text-amber-900 dark:text-amber-100 text-right">Duty Payable</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isEmpty ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={12}
                      className="h-64 text-center align-middle"
                    >
                      <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                        <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-4">
                          <Inbox className="h-10 w-10 text-amber-600 dark:text-amber-400" />
                        </div>
                        <p className="font-medium text-foreground">
                          No import entries yet
                        </p>
                        <p className="text-sm max-w-sm">
                          Click <strong>Fetch from CAT</strong> to load data from the Customs Automation Tool, or <strong>Upload PRT</strong> to add entries from a file.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredEmpty ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={12}
                      className="h-48 text-center align-middle text-muted-foreground"
                    >
                      No entries match your filters. Try changing the month filter or search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((row, idx) => (
                    <TableRow
                      key={`${row.poNumber}-${idx}`}
                      className="border-amber-200/50 dark:border-amber-800/50"
                    >
                      <TableCell>{row.month}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.supplierType}</TableCell>
                      <TableCell>{row.poNumber}</TableCell>
                      <TableCell>{row.invoice}</TableCell>
                      <TableCell>{row.recDt}</TableCell>
                      <TableCell>{row.partId}</TableCell>
                      <TableCell className="max-w-[220px]">{row.description}</TableCell>
                      <TableCell>{row.uom ?? "—"}</TableCell>
                      <TableCell>{row.boeNumber}</TableCell>
                      <TableCell>{row.recDt2}</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {formatINR(row.dutyPayable)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {!isEmpty && !filteredEmpty && (
            <div className="flex justify-end rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                  Total Duty Payable
                </span>
                <span className="text-lg font-bold tabular-nums text-amber-800 dark:text-amber-200">
                  {formatINR(totalDutyPayable)}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
