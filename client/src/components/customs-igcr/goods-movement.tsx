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
import { cn, formatINR } from "@/lib/utils";
import type { GoodsMovementEntry, JobWorkEntry, TabConfig, TabVariant } from "@/types/customs-igcr";
import { JOBWORK_INITIAL, JOBWORK_UPLOAD_ADD } from "@/data/customs-igcr-mock-data";

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

const UPLOAD_DURATION_MS = 2000;

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
