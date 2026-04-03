"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUploadButton } from "@/components/ui/file-upload-button";
import { Download, Loader2, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { igcrInputBorder } from "@/lib/customs-igcr-styles";

export interface ImportRegisterToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedMonths: string[];
  availableMonths: string[];
  onToggleMonth: (month: string) => void;
  clearMonthFilter: () => void;
  isEmpty: boolean;
  isFetchingFromCat: boolean;
  isSyncingPrt: boolean;
  onFetchFromCat: () => void;
  onPrtFileSelect: () => void;
}

export function ImportRegisterToolbar({
  searchQuery,
  onSearchChange,
  selectedMonths,
  availableMonths,
  onToggleMonth,
  clearMonthFilter,
  isEmpty,
  isFetchingFromCat,
  isSyncingPrt,
  onFetchFromCat,
  onPrtFileSelect,
}: ImportRegisterToolbarProps) {
  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={onFetchFromCat}
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
          onFileSelect={onPrtFileSelect}
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
              onChange={(e) => onSearchChange(e.target.value)}
              className={cn("pl-9", igcrInputBorder)}
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
                      onCheckedChange={() => onToggleMonth(month)}
                    />
                    <span>{month}</span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </>
  );
}
