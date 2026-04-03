"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ImportRegisterEntry } from "@/types/customs-igcr";
import { CAT_FETCH_ENTRIES, INITIAL_ENTRIES, PRT_UPLOAD_ENTRIES } from "@/data/customs-igcr-mock-data";
import { useIgcrWorking } from "./igcr-working-context";
import { ImportRegisterTable } from "./import-register-table";
import { ImportRegisterToolbar } from "./import-register-toolbar";
import { igcrCardBorder } from "@/lib/customs-igcr-styles";

const CAT_FETCH_DURATION_MS = 2200;
const PRT_SYNC_DURATION_MS = 2500;

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

      <Card className={igcrCardBorder}>
        <CardHeader>
          <CardTitle>Import entries</CardTitle>
          <CardDescription>
            Fetch data from CAT or upload a PRT file to populate the register
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImportRegisterToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedMonths={selectedMonths}
            availableMonths={availableMonths}
            onToggleMonth={toggleMonth}
            clearMonthFilter={clearMonthFilter}
            isEmpty={isEmpty}
            isFetchingFromCat={isFetchingFromCat}
            isSyncingPrt={isSyncingPrt}
            onFetchFromCat={handleFetchFromCat}
            onPrtFileSelect={handlePrtFileSelect}
          />
          <ImportRegisterTable
            entries={filteredEntries}
            isEmpty={isEmpty}
            filteredEmpty={filteredEmpty}
            totalDutyPayable={totalDutyPayable}
          />
        </CardContent>
      </Card>
    </div>
  );
}
