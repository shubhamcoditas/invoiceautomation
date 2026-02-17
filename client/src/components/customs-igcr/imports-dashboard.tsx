"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  CreditCard,
  LayoutGrid,
  Boxes,
  FileCheck,
  Clock,
  AlertTriangle,
  TrendingDown,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for widgets
const PROCUREMENT_SOURCE_DATA = [
  { name: "Import", value: 42, fill: "var(--color-import)" },
  { name: "Indigenous", value: 35, fill: "var(--color-indigenous)" },
  { name: "Scrip/Concessional", value: 23, fill: "var(--color-scrip)" },
];

const PROCUREMENT_CHART_CONFIG: ChartConfig = {
  import: { label: "Import", color: "hsl(25, 95%, 53%)" },
  indigenous: { label: "Indigenous", color: "hsl(142, 76%, 36%)" },
  scrip: { label: "Scrip/Concessional", color: "hsl(221, 83%, 53%)" },
};

const DUTY_PAYMENT_DATA = [
  { method: "Cash", qty: 1250, fill: "var(--color-cash)" },
  { method: "Scrip", qty: 680, fill: "var(--color-scrip)" },
  { method: "Exemption & FTA", qty: 420, fill: "var(--color-exemption)" },
];

const DUTY_CHART_CONFIG: ChartConfig = {
  cash: { label: "Cash", color: "hsl(142, 76%, 36%)" },
  scrip: { label: "Scrip", color: "hsl(221, 83%, 53%)" },
  exemption: { label: "Exemption & FTA", color: "hsl(38, 92%, 50%)" },
};

const SCHEME_TILES = [
  { id: "dbk", label: "DBK", count: 1240, value: "₹2.4 Cr" },
  { id: "igcr", label: "IGCR", count: 890, value: "₹1.8 Cr" },
  { id: "moowr", label: "MOOWR", count: 456, value: "₹0.9 Cr" },
  { id: "epcg", label: "EPCG", count: 320, value: "₹0.6 Cr" },
  { id: "adv-lic", label: "Advance License", count: 210, value: "₹0.4 Cr" },
];

const INVENTORY_POSITION_ROWS = [
  { sku: "FG-1001", description: "Assembly Unit A", qty: 450, reserved: 80, consumed: 120, scrapped: 5, setAside: 15, status: "available" },
  { sku: "FG-1002", description: "Assembly Unit B", qty: 320, reserved: 150, consumed: 90, scrapped: 2, setAside: 8, status: "reserved" },
  { sku: "SKU-2001", description: "Raw Material X", qty: 1200, reserved: 200, consumed: 400, scrapped: 20, setAside: 50, status: "available" },
  { sku: "SKU-2002", description: "Raw Material Y", qty: 85, reserved: 60, consumed: 200, scrapped: 5, setAside: 10, status: "low" },
  { sku: "FG-1003", description: "Finished Good C", qty: 0, reserved: 0, consumed: 180, scrapped: 0, setAside: 0, status: "consumed" },
];

const BOND_IIN_TILES = [
  { id: "bond-001", label: "Bond BND-2024-001", stock: 450, compliance: "Compliant", link: "#" },
  { id: "bond-002", label: "Bond BND-2024-002", stock: 320, compliance: "Review due", link: "#" },
  { id: "iin-101", label: "IIN IIN-101", stock: 180, compliance: "Compliant", link: "#" },
  { id: "iin-102", label: "IIN IIN-102", stock: 95, compliance: "Pending", link: "#" },
];

const LEAD_TIME_DATA = [
  { batch: "Batch A", days: 12, threshold: 14, delayed: false },
  { batch: "Batch B", days: 18, threshold: 14, delayed: true },
  { batch: "Batch C", days: 10, threshold: 14, delayed: false },
  { batch: "Batch D", days: 22, threshold: 14, delayed: true },
  { batch: "Batch E", days: 9, threshold: 14, delayed: false },
];

const INVENTORY_AGING_DATA = [
  { range: "0-30 days", qty: 420, slowMoving: false, nearExpiry: false },
  { range: "31-60 days", qty: 280, slowMoving: false, nearExpiry: false },
  { range: "61-90 days", qty: 150, slowMoving: true, nearExpiry: false },
  { range: "91-120 days", qty: 85, slowMoving: true, nearExpiry: true },
  { range: "120+ days", qty: 45, slowMoving: true, nearExpiry: true },
];

const AGING_CHART_CONFIG: ChartConfig = {
  qty: { label: "Quantity", color: "hsl(221, 83%, 53%)" },
  nearExpiry: { label: "Near expiry", color: "hsl(0, 84%, 60%)" },
};

export function ImportsDashboard() {
  const avgLeadTime = Math.round(
    LEAD_TIME_DATA.reduce((s, d) => s + d.days, 0) / LEAD_TIME_DATA.length
  );
  const delayedCount = LEAD_TIME_DATA.filter((d) => d.delayed).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Imports Dashboard
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm">
          Procurement, duty, schemes, inventory, and compliance at a glance
        </p>
      </div>

      {/* Row 1: Procurement Source Split + Duty Payment Method */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              Procurement Source Split
            </CardTitle>
            <CardDescription>
              % share from Import, Indigenous, Scrip/Concessional
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={PROCUREMENT_CHART_CONFIG} className="h-[220px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={PROCUREMENT_SOURCE_DATA}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {PROCUREMENT_SOURCE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              Duty Payment Method
            </CardTitle>
            <CardDescription>
              Stock acquired via Cash, Scrip, Exemption & FTAs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={DUTY_CHART_CONFIG} className="h-[220px] w-full">
              <BarChart data={DUTY_PAYMENT_DATA} layout="vertical" margin={{ left: 0, right: 12 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="method" width={100} tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="qty" radius={[0, 4, 4, 0]}>
                  {DUTY_PAYMENT_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Scheme Mapping */}
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <LayoutGrid className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            Scheme Mapping
          </CardTitle>
          <CardDescription>
            Inventory under DBK, IGCR, MOOWR, EPCG, Advance License
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {SCHEME_TILES.map((tile) => (
              <div
                key={tile.id}
                className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-4 text-center"
              >
                <p className="text-xs font-medium text-amber-800 dark:text-amber-200 uppercase tracking-wide">
                  {tile.label}
                </p>
                <p className="text-lg font-bold text-amber-900 dark:text-amber-100 mt-1">
                  {tile.count.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">{tile.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Row 2: Inventory Position + Bond & IIN */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Boxes className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              Inventory Position
            </CardTitle>
            <CardDescription>
              SKU/FG-wise real-time stock levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-amber-200 dark:border-amber-800 overflow-x-auto max-h-[280px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-amber-50 dark:bg-amber-950/20">
                    <TableHead className="text-xs">SKU/FG</TableHead>
                    <TableHead className="text-xs">Description</TableHead>
                    <TableHead className="text-xs text-right">Qty</TableHead>
                    <TableHead className="text-xs text-right">Reserved</TableHead>
                    <TableHead className="text-xs text-right">Consumed</TableHead>
                    <TableHead className="text-xs text-right">Scrapped</TableHead>
                    <TableHead className="text-xs text-right">Set aside</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {INVENTORY_POSITION_ROWS.map((row) => (
                    <TableRow key={row.sku} className="border-amber-200/50 dark:border-amber-800/50">
                      <TableCell className="font-mono text-xs">{row.sku}</TableCell>
                      <TableCell className="text-xs max-w-[120px] truncate">{row.description}</TableCell>
                      <TableCell className="text-right text-xs tabular-nums">{row.qty}</TableCell>
                      <TableCell className="text-right text-xs tabular-nums">{row.reserved}</TableCell>
                      <TableCell className="text-right text-xs tabular-nums">{row.consumed}</TableCell>
                      <TableCell className="text-right text-xs tabular-nums">{row.scrapped}</TableCell>
                      <TableCell className="text-right text-xs tabular-nums">{row.setAside}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            row.status === "available"
                              ? "success"
                              : row.status === "low"
                                ? "warning"
                                : row.status === "consumed"
                                  ? "secondary"
                                  : "default"
                          }
                          className="text-[10px]"
                        >
                          {row.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              Bond & IIN Tracking
            </CardTitle>
            <CardDescription>
              Stock under bonds/IIN with links to compliance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BOND_IIN_TILES.map((tile) => (
                <a
                  key={tile.id}
                  href={tile.link}
                  className="flex items-center justify-between rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-3 hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                      {tile.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Stock: {tile.stock} units
                    </p>
                    <Badge
                      variant={tile.compliance === "Compliant" ? "success" : "warning"}
                      className="mt-2 text-[10px]"
                    >
                      {tile.compliance}
                    </Badge>
                  </div>
                  <ExternalLink className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Lead Time Overview + Inventory Aging */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              Lead Time Overview
            </CardTitle>
            <CardDescription>
              Average order-to-consumption lead time (days)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-amber-100 dark:bg-amber-900/30 px-4 py-3">
                <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                  {avgLeadTime} <span className="text-sm font-normal text-muted-foreground">days</span>
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300">Avg lead time</p>
              </div>
              {delayedCount > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 px-3 py-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <div>
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                      {delayedCount} delayed batch{delayedCount > 1 ? "es" : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">Above threshold</p>
                  </div>
                </div>
              )}
            </div>
            <div className="rounded-md border border-amber-200 dark:border-amber-800 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-amber-50 dark:bg-amber-950/20">
                    <TableHead className="text-xs">Batch</TableHead>
                    <TableHead className="text-xs text-right">Days</TableHead>
                    <TableHead className="text-xs text-right">Threshold</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {LEAD_TIME_DATA.map((row) => (
                    <TableRow key={row.batch} className="border-amber-200/50 dark:border-amber-800/50">
                      <TableCell className="text-xs">{row.batch}</TableCell>
                      <TableCell className="text-right text-xs tabular-nums">{row.days}</TableCell>
                      <TableCell className="text-right text-xs tabular-nums">{row.threshold}</TableCell>
                      <TableCell>
                        {row.delayed ? (
                          <Badge variant="destructive" className="text-[10px]">Delayed</Badge>
                        ) : (
                          <Badge variant="success" className="text-[10px]">On time</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              Inventory Aging
            </CardTitle>
            <CardDescription>
              Aged stock — near-expiry and slow-moving highlighted
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={AGING_CHART_CONFIG} className="h-[240px] w-full">
              <BarChart data={INVENTORY_AGING_DATA} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-amber-200/50 dark:stroke-amber-800/50" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="qty" fill="var(--color-qty)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
            <div className="flex flex-wrap gap-3 mt-3">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="inline-block w-3 h-3 rounded-sm bg-amber-500/80" />
                <span className="text-muted-foreground">Slow-moving / 90+ days</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="inline-block w-3 h-3 rounded-sm bg-red-500/80" />
                <span className="text-muted-foreground">Near-expiry</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
