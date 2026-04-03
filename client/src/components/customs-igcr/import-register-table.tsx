"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Inbox } from "lucide-react";
import { cn, formatINR } from "@/lib/utils";
import type { ImportRegisterEntry } from "@/types/customs-igcr";
import {
  igcrBorder,
  igcrTableHeaderRow,
  igcrTableHeadText,
  igcrTableRowBorder,
  igcrFooterBg,
} from "@/lib/customs-igcr-styles";

export interface ImportRegisterTableProps {
  entries: ImportRegisterEntry[];
  isEmpty: boolean;
  filteredEmpty: boolean;
  totalDutyPayable: number;
}

export function ImportRegisterTable({
  entries,
  isEmpty,
  filteredEmpty,
  totalDutyPayable,
}: ImportRegisterTableProps) {
  return (
    <>
      <div className={cn("rounded-md border overflow-hidden", igcrBorder)}>
        <Table>
          <TableHeader>
            <TableRow className={igcrTableHeaderRow}>
              <TableHead className={igcrTableHeadText}>Month</TableHead>
              <TableHead className={igcrTableHeadText}>NAME</TableHead>
              <TableHead className={igcrTableHeadText}>SUPPLIER TYPE</TableHead>
              <TableHead className={igcrTableHeadText}>PO#</TableHead>
              <TableHead className={igcrTableHeadText}>INVOICE</TableHead>
              <TableHead className={igcrTableHeadText}>REC DT</TableHead>
              <TableHead className={igcrTableHeadText}>PART_ID</TableHead>
              <TableHead className={igcrTableHeadText}>DESCRIPTION</TableHead>
              <TableHead className={igcrTableHeadText}>UOM</TableHead>
              <TableHead className={igcrTableHeadText}>BOE NUMBER</TableHead>
              <TableHead className={igcrTableHeadText}>REC DT</TableHead>
              <TableHead className={cn(igcrTableHeadText, "text-right")}>
                Duty Payable
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isEmpty ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={12} className="h-64 text-center align-middle">
                  <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                    <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-4">
                      <Inbox className="h-10 w-10 text-amber-600 dark:text-amber-400" />
                    </div>
                    <p className="font-medium text-foreground">
                      No import entries yet
                    </p>
                    <p className="text-sm max-w-sm">
                      Click <strong>Fetch from CAT</strong> to load data from the
                      Customs Automation Tool, or <strong>Upload PRT</strong> to
                      add entries from a file.
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
                  No entries match your filters. Try changing the month filter or
                  search.
                </TableCell>
              </TableRow>
            ) : (
              entries.map((row, idx) => (
                <TableRow
                  key={`${row.poNumber}-${idx}`}
                  className={igcrTableRowBorder}
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
        <div
          className={cn(
            "flex justify-end rounded-md border px-4 py-3",
            igcrBorder,
            igcrFooterBg
          )}
        >
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
    </>
  );
}
