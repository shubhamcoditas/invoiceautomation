"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileUploadButton } from "@/components/ui/file-upload-button";
import { cn } from "@/lib/utils";
import {
  IndianRupee,
  FileCheck,
  Calendar,
  Wrench,
  Store,
  ArrowRightLeft,
  AlertTriangle,
  Bell,
  AlertCircle,
  Upload,
  FileText,
  ExternalLink,
} from "lucide-react";

// —— 1. Total customs duty saved under IGCR (breakdown by level) ——
const DUTY_SAVED_BREAKDOWN = [
  { level: "SKU / Child part", sku: "FG-1001", dutySaved: 42500, desc: "Assembly Unit A" },
  { level: "Input / Component", sku: "PT-2001", dutySaved: 28900, desc: "Machinery component" },
  { level: "Raw material", sku: "SKU-2001", dutySaved: 56200, desc: "Steel grade 304" },
  { level: "SKU / Child part", sku: "FG-1002", dutySaved: 15600, desc: "Electronic module" },
  { level: "Raw material", sku: "SKU-2002", dutySaved: 18900, desc: "Packaging material" },
];
const TOTAL_DUTY_SAVED = 162100;

// —— 2. Bond utilization & remaining balance (Bond no, IIN, re-credit) ——
const BOND_UTILIZATION = [
  { bondNo: "BND-2024-001", iin: "IIN-101", utilized: "₹12.5 L", remaining: "₹7.5 L", reCredit: "₹1.2 L", status: "Active" },
  { bondNo: "BND-2024-002", iin: "IIN-102", utilized: "₹8.0 L", remaining: "₹2.0 L", reCredit: "₹0.5 L", status: "Near limit" },
  { bondNo: "BND-2024-003", iin: "IIN-103", utilized: "₹5.0 L", remaining: "₹15.0 L", reCredit: "—", status: "Active" },
];

// —— 3. Quarterly summary: received, consumed, remaining, BOE, duty recredited ——
const QUARTERLY_SUMMARY = [
  { quarter: "Q1 FY25", received: 1250, consumed: 820, remaining: 430, boeCount: 24, dutyRecredited: "₹2.1 L" },
  { quarter: "Q2 FY25", received: 980, consumed: 750, remaining: 660, boeCount: 18, dutyRecredited: "₹1.8 L" },
  { quarter: "Q3 FY25", received: 1100, consumed: 620, remaining: 1140, boeCount: 22, dutyRecredited: "₹1.5 L" },
];

// —— 4. Job work monitoring ——
const JOB_WORK_MONITOR = [
  { vendor: "Precision Job Works", partId: "CP-1001", qty: 100, expectedReturn: "2025-02-15", actualReturn: "2025-02-14", consumptionStatus: "Consumed" },
  { vendor: "Surface Coating Pvt Ltd", partId: "CP-1002", qty: 200, expectedReturn: "2025-02-20", actualReturn: "—", consumptionStatus: "Pending" },
  { vendor: "Assembly Subcontractors", partId: "CP-1004", qty: 120, expectedReturn: "2025-03-01", actualReturn: "2025-03-02", consumptionStatus: "Partial" },
];

// —— 5. DTA cleared goods: duty liabilities & payment status ——
const DTA_CLEARED = [
  { boe: "BOE-2025-001234", description: "Assembly Unit A", dutyLiability: "₹1,24,500", paymentStatus: "Paid" },
  { boe: "BOE-2025-001235", description: "Electronic modules", dutyLiability: "₹28,750", paymentStatus: "Paid" },
  { boe: "BOE-2025-001236", description: "Raw material clearance", dutyLiability: "₹56,200", paymentStatus: "Pending" },
  { boe: "BOE-2025-001237", description: "Components DTA", dutyLiability: "₹18,900", paymentStatus: "Overdue" },
];

// —— 6. Transfers to other users / alternate purposes + documentation ——
const TRANSFER_RECORDS = [
  { ref: "TRF-001", to: "Eligible User A", purpose: "Inter-unit transfer", value: "₹2.1 L", docRef: "DOC-TRF-001" },
  { ref: "TRF-002", to: "Alternate use - Scrap", purpose: "Obsolete stock", value: "₹0.4 L", docRef: "DOC-TRF-002" },
  { ref: "TRF-003", to: "Eligible User B", purpose: "MOOWR transfer", value: "₹1.2 L", docRef: "DOC-TRF-003" },
];

// —— 7. Alerts: pending compliance, overdue statements, reconciliations ——
const COMPLIANCE_ALERTS = [
  { id: "a1", type: "Pending action", title: "Monthly statement Jan 2025", due: "2025-02-10", severity: "warning" },
  { id: "a2", type: "Overdue", title: "Reconciliation Q3 FY24", due: "2024-12-15", severity: "error" },
  { id: "a3", type: "Pending action", title: "Job work intimation - CP-1002", due: "2025-02-25", severity: "warning" },
  { id: "a4", type: "Reconciliation", title: "Bond vs consumption mismatch", due: "2025-02-28", severity: "warning" },
];

// —— 8. Notifications: bond expiries, renewal deadlines ——
const BOND_NOTIFICATIONS = [
  { bondNo: "BND-2024-001", expiryDate: "2025-06-30", renewalDeadline: "2025-05-15", status: "Upcoming" },
  { bondNo: "BND-2024-002", expiryDate: "2025-03-31", renewalDeadline: "2025-03-01", status: "Due soon" },
  { bondNo: "IIN-101", expiryDate: "2025-09-30", renewalDeadline: "2025-08-15", status: "Active" },
];

// —— 9. Exception management: discrepancies, shortages, unmatched ——
const EXCEPTIONS = [
  { id: "e1", type: "Shortage", ref: "BOE-2025-001230", detail: "Qty received 95 vs 100 declared", status: "Open" },
  { id: "e2", type: "Discrepancy", ref: "INV-7842", detail: "Value mismatch in duty calculation", status: "Under review" },
  { id: "e3", type: "Unmatched consumption", ref: "CP-1003", detail: "No job work return recorded", status: "Open" },
  { id: "e4", type: "Shortage", ref: "SKU-2002", detail: "Inventory short by 15 units", status: "Resolved" },
];

// —— 10. Upload / view compliance docs (dummy list) ——
const COMPLIANCE_DOCS = [
  { name: "Job work intimation CP-1001.pdf", type: "Job work intimation", date: "2025-01-15" },
  { name: "Duty payment proof BOE-001234.pdf", type: "Duty payment proof", date: "2025-01-20" },
  { name: "Transfer justification TRF-001.pdf", type: "Transfer justification", date: "2025-02-01" },
  { name: "Compliance certificate Q1 FY25.pdf", type: "Compliance document", date: "2025-02-10" },
];

export function IgcrDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          IGCR Dashboard
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm">
          Duty saved, bond tracking, quarterly summary, job work, DTA clearance, transfers, alerts, exceptions and compliance documents
        </p>
      </div>

      {/* 1. Total customs duty saved under IGCR */}
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            Total Customs Duty Saved (IGCR)
          </CardTitle>
          <CardDescription>
            Breakdown by SKU/child part, input/component, and raw material level
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-amber-100 dark:bg-amber-900/30 px-4 py-3 inline-block">
            <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
              ₹{TOTAL_DUTY_SAVED.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-300">Total duty saved</p>
          </div>
          <div className="rounded-md border border-amber-200 dark:border-amber-800 overflow-x-auto max-h-[220px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-amber-50 dark:bg-amber-950/20">
                  <TableHead className="text-xs">Level</TableHead>
                  <TableHead className="text-xs">SKU/Part</TableHead>
                  <TableHead className="text-xs">Description</TableHead>
                  <TableHead className="text-xs text-right">Duty saved (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DUTY_SAVED_BREAKDOWN.map((row) => (
                  <TableRow key={row.sku} className="border-amber-200/50 dark:border-amber-800/50">
                    <TableCell className="text-xs">{row.level}</TableCell>
                    <TableCell className="font-mono text-xs">{row.sku}</TableCell>
                    <TableCell className="text-xs max-w-[160px] truncate">{row.desc}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums">{row.dutySaved.toLocaleString("en-IN")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 2. Bond utilization & remaining balance */}
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            Continuity Bond Utilization & Balance
          </CardTitle>
          <CardDescription>
            Real-time tracking linked to Bond number and IIN; includes re-credit of bond value
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-amber-200 dark:border-amber-800 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-amber-50 dark:bg-amber-950/20">
                  <TableHead className="text-xs">Bond No</TableHead>
                  <TableHead className="text-xs">IIN</TableHead>
                  <TableHead className="text-xs text-right">Utilized</TableHead>
                  <TableHead className="text-xs text-right">Remaining</TableHead>
                  <TableHead className="text-xs text-right">Re-credit</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {BOND_UTILIZATION.map((row) => (
                  <TableRow key={row.bondNo} className="border-amber-200/50 dark:border-amber-800/50">
                    <TableCell className="font-mono text-xs">{row.bondNo}</TableCell>
                    <TableCell className="font-mono text-xs">{row.iin}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums">{row.utilized}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums">{row.remaining}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums">{row.reCredit}</TableCell>
                    <TableCell>
                      <Badge variant={row.status === "Active" ? "success" : "warning"} className="text-[10px]">{row.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 3. Quarterly summary */}
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            Quarterly Summary
          </CardTitle>
          <CardDescription>
            Imported goods received, consumed, remaining — mapped to Bills of Entry; duty recredited
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-amber-200 dark:border-amber-800 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-amber-50 dark:bg-amber-950/20">
                  <TableHead className="text-xs">Quarter</TableHead>
                  <TableHead className="text-xs text-right">Received</TableHead>
                  <TableHead className="text-xs text-right">Consumed</TableHead>
                  <TableHead className="text-xs text-right">Remaining</TableHead>
                  <TableHead className="text-xs text-right">BOE count</TableHead>
                  <TableHead className="text-xs text-right">Duty recredited</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {QUARTERLY_SUMMARY.map((row) => (
                  <TableRow key={row.quarter} className="border-amber-200/50 dark:border-amber-800/50">
                    <TableCell className="text-xs font-medium">{row.quarter}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums">{row.received}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums">{row.consumed}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums">{row.remaining}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums">{row.boeCount}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums font-medium">{row.dutyRecredited}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 4. Job work monitoring */}
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Wrench className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            Goods Sent for Job Work
          </CardTitle>
          <CardDescription>
            Quantities, job worker details, expected and actual return dates, consumption status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-amber-200 dark:border-amber-800 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-amber-50 dark:bg-amber-950/20">
                  <TableHead className="text-xs">Vendor</TableHead>
                  <TableHead className="text-xs">Part ID</TableHead>
                  <TableHead className="text-xs text-right">Qty</TableHead>
                  <TableHead className="text-xs">Expected return</TableHead>
                  <TableHead className="text-xs">Actual return</TableHead>
                  <TableHead className="text-xs">Consumption status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {JOB_WORK_MONITOR.map((row) => (
                  <TableRow key={`${row.vendor}-${row.partId}`} className="border-amber-200/50 dark:border-amber-800/50">
                    <TableCell className="text-xs max-w-[140px] truncate">{row.vendor}</TableCell>
                    <TableCell className="font-mono text-xs">{row.partId}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums">{row.qty}</TableCell>
                    <TableCell className="text-xs">{row.expectedReturn}</TableCell>
                    <TableCell className="text-xs">{row.actualReturn}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-[10px]">{row.consumptionStatus}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 5. DTA cleared goods */}
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Store className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            Imported Goods Cleared in DTA
          </CardTitle>
          <CardDescription>
            Duty liabilities and payment status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-amber-200 dark:border-amber-800 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-amber-50 dark:bg-amber-950/20">
                  <TableHead className="text-xs">BOE</TableHead>
                  <TableHead className="text-xs">Description</TableHead>
                  <TableHead className="text-xs text-right">Duty liability</TableHead>
                  <TableHead className="text-xs">Payment status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DTA_CLEARED.map((row) => (
                  <TableRow key={row.boe} className="border-amber-200/50 dark:border-amber-800/50">
                    <TableCell className="font-mono text-xs">{row.boe}</TableCell>
                    <TableCell className="text-xs max-w-[180px] truncate">{row.description}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums font-medium">{row.dutyLiability}</TableCell>
                    <TableCell>
                      <Badge
                        variant={row.paymentStatus === "Paid" ? "success" : row.paymentStatus === "Overdue" ? "destructive" : "warning"}
                        className="text-[10px]"
                      >
                        {row.paymentStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 6. Transfers to other users / alternate purposes */}
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            Transfers & Alternate Use
          </CardTitle>
          <CardDescription>
            Goods transferred to eligible users or used for alternate purposes — with supporting documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-amber-200 dark:border-amber-800 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-amber-50 dark:bg-amber-950/20">
                  <TableHead className="text-xs">Ref</TableHead>
                  <TableHead className="text-xs">To / Purpose</TableHead>
                  <TableHead className="text-xs">Purpose type</TableHead>
                  <TableHead className="text-xs text-right">Value</TableHead>
                  <TableHead className="text-xs">Doc ref</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TRANSFER_RECORDS.map((row) => (
                  <TableRow key={row.ref} className="border-amber-200/50 dark:border-amber-800/50">
                    <TableCell className="font-mono text-xs">{row.ref}</TableCell>
                    <TableCell className="text-xs max-w-[160px] truncate">{row.to}</TableCell>
                    <TableCell className="text-xs">{row.purpose}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums">{row.value}</TableCell>
                    <TableCell className="text-xs font-mono">{row.docRef}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 7. Alerts — pending compliance, overdue, reconciliations */}
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            Compliance Alerts
          </CardTitle>
          <CardDescription>
            Pending compliance actions, overdue statements, and reconciliations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {COMPLIANCE_ALERTS.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-3 py-2",
                  alert.severity === "error"
                    ? "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20"
                    : "border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20"
                )}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className={cn("h-4 w-4", alert.severity === "error" ? "text-red-600" : "text-amber-600")} />
                  <div>
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.type} · Due: {alert.due}</p>
                  </div>
                </div>
                <Badge variant={alert.severity === "error" ? "destructive" : "warning"} className="text-[10px]">{alert.type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 8. Bond expiry & renewal notifications */}
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            Bond Expiry & Renewal Deadlines
          </CardTitle>
          <CardDescription>
            Upcoming bond expiries and renewal deadlines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {BOND_NOTIFICATIONS.map((n) => (
              <div
                key={n.bondNo}
                className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-4"
              >
                <p className="text-xs font-medium text-amber-800 dark:text-amber-200 uppercase tracking-wide">{n.bondNo}</p>
                <p className="text-sm mt-1">Expiry: {n.expiryDate}</p>
                <p className="text-xs text-muted-foreground">Renew by: {n.renewalDeadline}</p>
                <Badge variant={n.status === "Due soon" ? "destructive" : "default"} className="mt-2 text-[10px]">{n.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 9. Exception management */}
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            Exception Management
          </CardTitle>
          <CardDescription>
            Discrepancies, shortages, and unmatched consumption
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-amber-200 dark:border-amber-800 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-amber-50 dark:bg-amber-950/20">
                  <TableHead className="text-xs">Type</TableHead>
                  <TableHead className="text-xs">Ref</TableHead>
                  <TableHead className="text-xs">Detail</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {EXCEPTIONS.map((row) => (
                  <TableRow key={row.id} className="border-amber-200/50 dark:border-amber-800/50">
                    <TableCell><Badge variant="destructive" className="text-[10px]">{row.type}</Badge></TableCell>
                    <TableCell className="font-mono text-xs">{row.ref}</TableCell>
                    <TableCell className="text-xs max-w-[240px]">{row.detail}</TableCell>
                    <TableCell><Badge variant={row.status === "Resolved" ? "success" : "secondary"} className="text-[10px]">{row.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 10. Upload & view compliance documents */}
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Upload className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            Compliance Documents
          </CardTitle>
          <CardDescription>
            Upload and view job work intimations, duty payment proofs, transfer justifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <FileUploadButton
              label="Upload document"
              onFileSelect={() => {}}
              variant="outline"
              className="border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200"
            />
          </div>
          <div className="rounded-md border border-amber-200 dark:border-amber-800 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-amber-50 dark:bg-amber-950/20">
                  <TableHead className="text-xs">Document</TableHead>
                  <TableHead className="text-xs">Type</TableHead>
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-xs w-16">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {COMPLIANCE_DOCS.map((doc) => (
                  <TableRow key={doc.name} className="border-amber-200/50 dark:border-amber-800/50">
                    <TableCell className="text-xs flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                      {doc.name}
                    </TableCell>
                    <TableCell className="text-xs">{doc.type}</TableCell>
                    <TableCell className="text-xs">{doc.date}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-amber-700 dark:text-amber-300">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
