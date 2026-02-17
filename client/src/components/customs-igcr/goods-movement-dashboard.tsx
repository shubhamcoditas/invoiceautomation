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
  BarChart3,
  Ship,
  Store,
  ArrowLeftRight,
  Wrench,
  MapPin,
  Package,
} from "lucide-react";

// —— Sales Statistics: domestic vs export, volume and value ——
const SALES_PIE_DATA = [
  { name: "Export", value: 58, fill: "var(--color-export)" },
  { name: "Domestic (DTA)", value: 42, fill: "var(--color-domestic)" },
];
const SALES_CHART_CONFIG: ChartConfig = {
  export: { label: "Export", color: "hsl(221, 83%, 53%)" },
  domestic: { label: "Domestic (DTA)", color: "hsl(142, 76%, 36%)" },
};

const SALES_BAR_DATA = [
  { type: "Export", volume: 1250, value: 1561500 },
  { type: "Domestic (DTA)", volume: 920, value: 1438000 },
];
const SALES_BAR_CONFIG: ChartConfig = {
  volume: { label: "Volume (units)", color: "hsl(25, 95%, 53%)" },
  value: { label: "Value (INR)", color: "hsl(142, 76%, 36%)" },
};

// —— Exports Overview: scheme code, shipping bill, FG/SKU, duty benefit ——
const EXPORTS_OVERVIEW = [
  { schemeCode: "IGCR", shippingBill: "SB-2025-001234", fgSku: "FG-1001", dutyBenefit: "₹42,500", desc: "Assembly Unit A" },
  { schemeCode: "EPCG", shippingBill: "SB-2025-001235", fgSku: "FG-1002", dutyBenefit: "₹0", desc: "Electronic modules" },
  { schemeCode: "DBK", shippingBill: "SB-2025-001236", fgSku: "PT-1003", dutyBenefit: "₹56,200", desc: "Machinery components" },
  { schemeCode: "MOOWR", shippingBill: "SB-2025-001237", fgSku: "SKU-2001", dutyBenefit: "₹28,900", desc: "Raw material" },
  { schemeCode: "IGCR", shippingBill: "SB-2025-001238", fgSku: "FG-1005", dutyBenefit: "₹8,750", desc: "Spare parts kit" },
];

// —— Domestic Sales (DTA): value and quantum ——
const DOMESTIC_SALES_ROWS = [
  { buyer: "DTA Buyer One Pvt Ltd", sku: "PT-2001", qty: 120, value: "₹1,85,000", month: "Jan 2025" },
  { buyer: "Domestic Manufacturing Co", sku: "PT-2002", qty: 85, value: "₹4,20,000", month: "Jan 2025" },
  { buyer: "Industrial Supplies India", sku: "PT-2003", qty: 200, value: "₹2,75,000", month: "Feb 2025" },
  { buyer: "Tech Components Ltd", sku: "PT-2004", qty: 65, value: "₹1,68,000", month: "Feb 2025" },
  { buyer: "Auto Parts DTA", sku: "PT-2005", qty: 95, value: "₹3,90,000", month: "Feb 2025" },
];

// —— Inter-Branch / Bond Transfers ——
const BOND_TRANSFER_TILES = [
  { id: "bt-1", label: "Branch A → Branch B", type: "Inter-branch", dutyDeferred: "₹1.2 L", bondAdj: "BND-001", status: "Completed" },
  { id: "bt-2", label: "MOOWR Unit 1 → MOOWR Unit 2", type: "MOOWR-to-MOOWR", dutyDeferred: "₹0.8 L", bondAdj: "BND-002", status: "In transit" },
  { id: "bt-3", label: "Warehouse → Bond", type: "Bond transfer", dutyDeferred: "₹2.1 L", bondAdj: "BND-003", status: "Completed" },
  { id: "bt-4", label: "Branch C → Branch A", type: "Inter-branch", dutyDeferred: "₹0.5 L", bondAdj: "—", status: "Pending" },
];

// —— Job Work Status ——
const JOB_WORK_ROWS = [
  { vendor: "Precision Job Works", partId: "CP-1001", sentQty: 100, expectedReturn: "2025-02-15", actualReturn: "2025-02-14", status: "Received" },
  { vendor: "Surface Coating Pvt Ltd", partId: "CP-1002", sentQty: 200, expectedReturn: "2025-02-20", actualReturn: "—", status: "Pending" },
  { vendor: "Heat Treatment Works", partId: "CP-1003", sentQty: 0, expectedReturn: "—", actualReturn: "—", status: "N/A" },
  { vendor: "Assembly Subcontractors", partId: "CP-1004", sentQty: 120, expectedReturn: "2025-03-01", actualReturn: "2025-03-02", status: "Delayed" },
  { vendor: "Testing Lab Services", partId: "CP-1007", sentQty: 50, expectedReturn: "2025-02-28", actualReturn: "—", status: "In progress" },
];

// —— Sales Returns & Scrapping ——
const RETURNS_SCRAP_TILES = [
  { id: "ret-1", type: "Return to warehouse", qty: 45, value: "₹2.1 L", reasonCode: "R01 - Quality reject" },
  { id: "ret-2", type: "Return to warehouse", qty: 12, value: "₹0.6 L", reasonCode: "R02 - Wrong despatch" },
  { id: "scrap-1", type: "Scrapped", qty: 28, value: "₹0.4 L", reasonCode: "S01 - Obsolete" },
  { id: "scrap-2", type: "Scrapped", qty: 15, value: "₹0.2 L", reasonCode: "S02 - Damaged" },
];

// —— Scheme-wise Movement Mapping ——
const SCHEME_MOVEMENT_TILES = [
  { scheme: "IGCR", movementCount: 124, dutyBenefit: "₹1.8 Cr", compliance: "Compliant" },
  { scheme: "EPCG", movementCount: 89, dutyBenefit: "₹0.9 Cr", compliance: "Compliant" },
  { scheme: "MOOWR", movementCount: 156, dutyBenefit: "₹1.2 Cr", compliance: "Review due" },
  { scheme: "DBK", movementCount: 67, dutyBenefit: "₹0.6 Cr", compliance: "Compliant" },
  { scheme: "Advance License", movementCount: 34, dutyBenefit: "₹0.4 Cr", compliance: "Pending" },
];

export function GoodsMovementDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Goods Movement Dashboard
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm">
          Sales statistics, exports, DTA sales, bond transfers, job work, returns and scheme mapping
        </p>
      </div>

      {/* Sales Statistics: Bar/pie — domestic vs export, volume and value */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              Sales Statistics — Split
            </CardTitle>
            <CardDescription>
              Domestic vs export sales (% share)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={SALES_CHART_CONFIG} className="h-[220px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={SALES_PIE_DATA}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {SALES_PIE_DATA.map((entry, index) => (
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
              <BarChart3 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              Sales Statistics — Volume & Value
            </CardTitle>
            <CardDescription>
              Export vs domestic by volume (units) and value (INR)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={SALES_BAR_CONFIG} className="h-[220px] w-full">
              <BarChart data={SALES_BAR_DATA} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-amber-200/50 dark:stroke-amber-800/50" />
                <XAxis dataKey="type" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="volume" fill="var(--color-volume)" radius={[4, 4, 0, 0]} name="Volume" />
                <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} name="Value (INR)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Exports Overview: list/tile — scheme code, shipping bill, FG/SKU, duty benefit */}
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Ship className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            Exports Overview
          </CardTitle>
          <CardDescription>
            Goods exported with scheme code, shipping bill, FG/SKU and duty benefit mapping
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-amber-200 dark:border-amber-800 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-amber-50 dark:bg-amber-950/20">
                  <TableHead className="text-xs">Scheme Code</TableHead>
                  <TableHead className="text-xs">Shipping Bill</TableHead>
                  <TableHead className="text-xs">FG/SKU</TableHead>
                  <TableHead className="text-xs">Description</TableHead>
                  <TableHead className="text-xs text-right">Duty Benefit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {EXPORTS_OVERVIEW.map((row) => (
                  <TableRow key={row.shippingBill} className="border-amber-200/50 dark:border-amber-800/50">
                    <TableCell><Badge variant="secondary" className="text-[10px]">{row.schemeCode}</Badge></TableCell>
                    <TableCell className="font-mono text-xs">{row.shippingBill}</TableCell>
                    <TableCell className="font-mono text-xs">{row.fgSku}</TableCell>
                    <TableCell className="text-xs max-w-[140px] truncate">{row.desc}</TableCell>
                    <TableCell className="text-right text-xs font-medium tabular-nums">{row.dutyBenefit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Domestic Sales: value and quantum */}
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Store className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            Domestic Sales (DTA)
          </CardTitle>
          <CardDescription>
            Goods sold to DTA — value and quantum published
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-amber-200 dark:border-amber-800 overflow-x-auto max-h-[280px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-amber-50 dark:bg-amber-950/20">
                  <TableHead className="text-xs">Buyer</TableHead>
                  <TableHead className="text-xs">SKU</TableHead>
                  <TableHead className="text-xs text-right">Qty</TableHead>
                  <TableHead className="text-xs text-right">Value (INR)</TableHead>
                  <TableHead className="text-xs">Month</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DOMESTIC_SALES_ROWS.map((row) => (
                  <TableRow key={`${row.buyer}-${row.sku}`} className="border-amber-200/50 dark:border-amber-800/50">
                    <TableCell className="text-xs max-w-[160px] truncate">{row.buyer}</TableCell>
                    <TableCell className="font-mono text-xs">{row.sku}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums">{row.qty}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums font-medium">{row.value}</TableCell>
                    <TableCell className="text-xs">{row.month}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Inter-Branch / Bond Transfers */}
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            Inter-Branch / Bond Transfers
          </CardTitle>
          <CardDescription>
            Movement between branches and MOOWR-to-MOOWR; duty deferred and bond adjustments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {BOND_TRANSFER_TILES.map((tile) => (
              <div
                key={tile.id}
                className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-4"
              >
                <p className="text-xs font-medium text-amber-800 dark:text-amber-200 uppercase tracking-wide">
                  {tile.type}
                </p>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mt-1 line-clamp-2">
                  {tile.label}
                </p>
                <p className="text-xs text-muted-foreground mt-2">Duty deferred: {tile.dutyDeferred}</p>
                <p className="text-xs text-muted-foreground">Bond: {tile.bondAdj}</p>
                <Badge
                  variant={tile.status === "Completed" ? "success" : tile.status === "Pending" ? "secondary" : "default"}
                  className="mt-2 text-[10px]"
                >
                  {tile.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Job Work Status */}
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Wrench className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            Job Work Status
          </CardTitle>
          <CardDescription>
            Goods sent to / received from job work — expected vs actual return dates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-amber-200 dark:border-amber-800 overflow-x-auto max-h-[280px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-amber-50 dark:bg-amber-950/20">
                  <TableHead className="text-xs">Vendor</TableHead>
                  <TableHead className="text-xs">Part ID</TableHead>
                  <TableHead className="text-xs text-right">Sent Qty</TableHead>
                  <TableHead className="text-xs">Expected Return</TableHead>
                  <TableHead className="text-xs">Actual Return</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {JOB_WORK_ROWS.map((row) => (
                  <TableRow key={`${row.vendor}-${row.partId}`} className="border-amber-200/50 dark:border-amber-800/50">
                    <TableCell className="text-xs max-w-[140px] truncate">{row.vendor}</TableCell>
                    <TableCell className="font-mono text-xs">{row.partId}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums">{row.sentQty}</TableCell>
                    <TableCell className="text-xs">{row.expectedReturn}</TableCell>
                    <TableCell className="text-xs">{row.actualReturn}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          row.status === "Received" ? "success" :
                          row.status === "Delayed" ? "destructive" :
                          row.status === "In progress" ? "default" : "secondary"
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

      {/* Sales Returns & Scrapping */}
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            Sales Returns & Scrapping
          </CardTitle>
          <CardDescription>
            Quantity and value of goods returned to warehouse and scrapped, with reason codes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {RETURNS_SCRAP_TILES.map((tile) => (
              <div
                key={tile.id}
                className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-4"
              >
                <p className="text-xs font-medium text-amber-800 dark:text-amber-200 uppercase tracking-wide">
                  {tile.type}
                </p>
                <p className="text-lg font-bold text-amber-900 dark:text-amber-100 mt-1">Qty: {tile.qty}</p>
                <p className="text-sm text-muted-foreground">{tile.value}</p>
                <p className="text-xs text-muted-foreground mt-2">{tile.reasonCode}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scheme-wise Movement Mapping */}
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            Scheme-wise Movement Mapping
          </CardTitle>
          <CardDescription>
            Goods movement mapped to scheme benefits and compliance status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {SCHEME_MOVEMENT_TILES.map((tile) => (
              <div
                key={tile.scheme}
                className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-4 text-center"
              >
                <p className="text-xs font-medium text-amber-800 dark:text-amber-200 uppercase tracking-wide">
                  {tile.scheme}
                </p>
                <p className="text-lg font-bold text-amber-900 dark:text-amber-100 mt-1">
                  {tile.movementCount}
                </p>
                <p className="text-sm text-muted-foreground">movements</p>
                <p className="text-xs font-medium text-amber-700 dark:text-amber-300 mt-1">{tile.dutyBenefit}</p>
                <Badge
                  variant={tile.compliance === "Compliant" ? "success" : tile.compliance === "Review due" ? "warning" : "secondary"}
                  className="mt-2 text-[10px]"
                >
                  {tile.compliance}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
