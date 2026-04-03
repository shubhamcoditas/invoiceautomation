"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useIgcrWorking,
  totalDutyWaiver,
  igcrWorkingDifference,
} from "./igcr-working-context";
import { exportToExcel } from "@/lib/excel-export";
import { formatINR } from "@/lib/utils";
import { Download } from "lucide-react";

export function IgcrWorking() {
  const { dutyPayable, ertWaiver, dsrtWaiver } = useIgcrWorking();
  const totalWaiver = totalDutyWaiver({ dutyPayable, ertWaiver, dsrtWaiver });
  const difference = igcrWorkingDifference({ dutyPayable, ertWaiver, dsrtWaiver });

  const handleExportWorkingSheet = () => {
    const data = [
      { Item: "Duty Payable (from Import Register)", "Amount (INR)": dutyPayable, Notes: "Total from import repository" },
      { Item: "Duty Waiver (ERT)", "Amount (INR)": ertWaiver, Notes: "From Sales tracking → ERT" },
      { Item: "Duty Waiver (DSRT)", "Amount (INR)": dsrtWaiver, Notes: "From Sales tracking → DSRT" },
      { Item: "Total Waivers (ERT + DSRT)", "Amount (INR)": totalWaiver, Notes: "" },
      { Item: "Difference (Duty Payable − Waivers)", "Amount (INR)": difference, Notes: "Headroom" },
    ];
    const date = new Date().toISOString().slice(0, 10);
    exportToExcel(data, `IGCR-Working-Sheet-${date}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            IGCR Working
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Duty payable vs duty waivers (ERT + DSRT) — difference shows headroom
          </p>
        </div>
        <Button
          onClick={handleExportWorkingSheet}
          className="bg-amber-600 hover:bg-amber-700 text-white border-amber-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Working Sheet
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-900 dark:text-amber-100">
              Duty Payable (from Import Register)
            </CardTitle>
            <CardDescription>Total from import repository</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums text-amber-800 dark:text-amber-200">
              {formatINR(dutyPayable)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-900 dark:text-amber-100">
              Duty Waiver (ERT)
            </CardTitle>
            <CardDescription>From Sales tracking → ERT</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums text-amber-800 dark:text-amber-200">
              {formatINR(ertWaiver)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-900 dark:text-amber-100">
              Duty Waiver (DSRT)
            </CardTitle>
            <CardDescription>From Sales tracking → DSRT</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums text-amber-800 dark:text-amber-200">
              {formatINR(dsrtWaiver)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
              Difference (Duty Payable − Waivers)
            </CardTitle>
            <CardDescription>Headroom: duty paid exceeds waivers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums text-emerald-800 dark:text-emerald-200">
              {formatINR(difference)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Total waivers: {formatINR(totalWaiver)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>
            Duty Payable (from Import Register) should be greater than the sum of Duty Waiver from ERT and DSRT.
            The difference is the headroom available.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Duty Payable</span>
            <span className="font-semibold tabular-nums">{formatINR(dutyPayable)}</span>
            <span className="text-muted-foreground">−</span>
            <span className="text-sm text-muted-foreground">(ERT + DSRT waivers)</span>
            <span className="font-semibold tabular-nums">{formatINR(totalWaiver)}</span>
            <span className="text-muted-foreground">=</span>
            <span className="font-bold tabular-nums text-emerald-700 dark:text-emerald-300">
              {formatINR(difference)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
