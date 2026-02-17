"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Save,
  Building2,
  FileCheck,
  Factory,
  ClipboardList,
  Info,
  Plus,
  Trash2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";

type OnboardingStatus = "Draft" | "Submitted" | "Approved";

const STEPS = [
  { id: 1, title: "Entity Details", shortTitle: "Entity", icon: Building2 },
  { id: 2, title: "IGCR Scheme Details", shortTitle: "Scheme", icon: FileCheck },
  { id: 3, title: "Approved Factory / Premises", shortTitle: "Premises", icon: Factory },
  { id: 4, title: "Review & Submit", shortTitle: "Review", icon: ClipboardList },
];

const TOTAL_STEPS = STEPS.length;

type FactoryRow = { name: string; address: string; type: string; approvalRef: string; effectiveFrom: string };

const emptyFactory = (): FactoryRow => ({ name: "", address: "", type: "", approvalRef: "", effectiveFrom: "" });

export function IGCROnboarding() {
  const [status, setStatus] = useState<OnboardingStatus>("Draft");
  const [currentStep, setCurrentStep] = useState(1);
  const [declarationChecked, setDeclarationChecked] = useState(false);

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  // Entity (Step 1)
  const [entity, setEntity] = useState({
    legalName: "",
    iec: "",
    gstin: "",
    pan: "",
    address: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });

  // Scheme (Step 2)
  const [scheme, setScheme] = useState({
    schemeName: "IGCR",
    iin: "",
    authority: "",
    validFrom: "",
    validTo: "",
    declarationIntent: "",
  });

  // Factories (Step 3)
  const [factories, setFactories] = useState<FactoryRow[]>([]);

  const addFactory = () => setFactories((prev) => [...prev, emptyFactory()]);
  const removeFactory = (i: number) => setFactories((prev) => prev.filter((_, idx) => idx !== i));
  const updateFactory = (i: number, field: keyof FactoryRow, value: string) =>
    setFactories((prev) => prev.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)));

  return (
    <div className="w-full max-w-full min-w-0 flex flex-col">
      {/* Header: title, status, Save as Draft */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            IGCR Entity Onboarding
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Capture entity-level information required before any IGCR transaction can be performed.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant={status === "Approved" ? "success" : status === "Submitted" ? "warning" : "secondary"}
            className="text-xs"
          >
            {status}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStatus("Draft")}
            className="gap-2 border-amber-300 dark:border-amber-700"
          >
            <Save className="h-4 w-4" />
            Save as Draft
          </Button>
        </div>
      </div>

      {/* Progressive stepper indicator */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-between gap-1">
          {STEPS.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const isClickable = true;
            return (
              <div key={step.id} className="flex flex-1 items-center min-w-0 last:flex-none">
                <button
                  type="button"
                  onClick={() => isClickable && setCurrentStep(step.id)}
                  className={cn(
                    "flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 py-2 px-2 sm:px-3 rounded-lg transition-colors min-w-0 flex-1 sm:flex-initial",
                    isClickable && "cursor-pointer hover:bg-muted/50",
                    isActive && "bg-amber-100 dark:bg-amber-900/40 ring-1 ring-amber-300 dark:ring-amber-700"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium",
                      isCompleted && "bg-amber-600 text-white",
                      isActive && !isCompleted && "bg-amber-600 text-white",
                      !isActive && !isCompleted && "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                  </span>
                  <span
                    className={cn(
                      "text-xs sm:text-sm font-medium truncate text-center sm:text-left",
                      isActive ? "text-amber-900 dark:text-amber-100" : "text-muted-foreground"
                    )}
                  >
                    {step.shortTitle}
                  </span>
                </button>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "hidden sm:block flex-1 h-0.5 mx-1 min-w-[8px] rounded",
                      currentStep > step.id ? "bg-amber-500" : "bg-muted"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content — single visible step, full width */}
      <div className="w-full max-w-full min-w-0 flex-1">
        {/* Step 1: Entity Details */}
        {currentStep === 1 && (
          <Card className="w-full border-amber-200/60 dark:border-amber-800/60">
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                  1
                </span>
                <div>
                  <CardTitle className="text-lg">Entity Details</CardTitle>
                  <CardDescription>Legal entity and contact information</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label>Legal Entity Name</Label>
                  <Input value={entity.legalName} onChange={(e) => setEntity((p) => ({ ...p, legalName: e.target.value }))} placeholder="Enter legal entity name" />
                </div>
                <div className="space-y-2">
                  <Label>Importer Exporter Code (IEC)</Label>
                  <Input value={entity.iec} onChange={(e) => setEntity((p) => ({ ...p, iec: e.target.value }))} placeholder="Enter IEC" />
                </div>
                <div className="space-y-2">
                  <Label>GSTIN</Label>
                  <Input value={entity.gstin} onChange={(e) => setEntity((p) => ({ ...p, gstin: e.target.value }))} placeholder="Enter GSTIN" />
                </div>
                <div className="space-y-2">
                  <Label>PAN</Label>
                  <Input value={entity.pan} onChange={(e) => setEntity((p) => ({ ...p, pan: e.target.value }))} placeholder="Enter PAN" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Registered Address</Label>
                <Input value={entity.address} onChange={(e) => setEntity((p) => ({ ...p, address: e.target.value }))} placeholder="Enter registered address" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>Contact Person Name</Label>
                  <Input value={entity.contactName} onChange={(e) => setEntity((p) => ({ ...p, contactName: e.target.value }))} placeholder="Enter contact name" />
                </div>
                <div className="space-y-2">
                  <Label>Contact Email</Label>
                  <Input type="email" value={entity.contactEmail} onChange={(e) => setEntity((p) => ({ ...p, contactEmail: e.target.value }))} placeholder="Enter email" />
                </div>
                <div className="space-y-2">
                  <Label>Contact Phone Number</Label>
                  <Input value={entity.contactPhone} onChange={(e) => setEntity((p) => ({ ...p, contactPhone: e.target.value }))} placeholder="Enter phone" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: IGCR Scheme Details */}
        {currentStep === 2 && (
          <Card className="w-full border-amber-200/60 dark:border-amber-800/60">
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                  2
                </span>
                <div>
                  <CardTitle className="text-lg">IGCR Scheme Details</CardTitle>
                  <CardDescription>Scheme identification and jurisdictional authority</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1">
                <Info className="h-3.5 w-3.5" />
                IIN is mandatory to proceed. Scheme configuration locks post approval.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label>Scheme Name</Label>
                  <Input value={scheme.schemeName} readOnly className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    Import Identification Number (IIN)
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input value={scheme.iin} onChange={(e) => setScheme((p) => ({ ...p, iin: e.target.value }))} placeholder="Enter IIN" className="font-mono" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Jurisdictional Customs Authority</Label>
                  <Input value={scheme.authority} onChange={(e) => setScheme((p) => ({ ...p, authority: e.target.value }))} placeholder="Enter jurisdictional authority" />
                </div>
                <div className="space-y-2">
                  <Label>Validity Period (From)</Label>
                  <Input value={scheme.validFrom} onChange={(e) => setScheme((p) => ({ ...p, validFrom: e.target.value }))} placeholder="e.g. DD-MMM-YYYY" />
                </div>
                <div className="space-y-2">
                  <Label>Validity Period (To)</Label>
                  <Input value={scheme.validTo} onChange={(e) => setScheme((p) => ({ ...p, validTo: e.target.value }))} placeholder="e.g. DD-MMM-YYYY" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Declaration of intent</Label>
                <Textarea
                  value={scheme.declarationIntent}
                  onChange={(e) => setScheme((p) => ({ ...p, declarationIntent: e.target.value }))}
                  rows={4}
                  placeholder="Enter declaration of intent"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Approved Factory / Premises */}
        {currentStep === 3 && (
          <Card className="w-full border-amber-200/60 dark:border-amber-800/60">
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                  3
                </span>
                <div>
                  <CardTitle className="text-lg">Approved Factory / Premises Details</CardTitle>
                  <CardDescription>Locations where IGCR goods may be received or used</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                Only approved premises can consume IGCR goods.
              </p>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Factory / Premises Name</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Customs Approval Ref. No</TableHead>
                      <TableHead>Effective From Date</TableHead>
                      <TableHead className="w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {factories.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Input value={row.name} onChange={(e) => updateFactory(i, "name", e.target.value)} placeholder="Name" className="h-9" />
                        </TableCell>
                        <TableCell>
                          <Input value={row.address} onChange={(e) => updateFactory(i, "address", e.target.value)} placeholder="Address" className="h-9" />
                        </TableCell>
                        <TableCell>
                          <Select value={row.type || "_"} onValueChange={(v) => updateFactory(i, "type", v === "_" ? "" : v)}>
                            <SelectTrigger className="h-9 min-w-[120px]">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="_">Select</SelectItem>
                              <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                              <SelectItem value="Warehouse">Warehouse</SelectItem>
                              <SelectItem value="Job Work">Job Work</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input value={row.approvalRef} onChange={(e) => updateFactory(i, "approvalRef", e.target.value)} placeholder="Ref. No" className="h-9 font-mono text-xs" />
                        </TableCell>
                        <TableCell>
                          <Input value={row.effectiveFrom} onChange={(e) => updateFactory(i, "effectiveFrom", e.target.value)} placeholder="Date" className="h-9" />
                        </TableCell>
                        <TableCell>
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => removeFactory(i)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button type="button" variant="outline" size="sm" className="gap-2 border-amber-300 dark:border-amber-700" onClick={addFactory}>
                <Plus className="h-4 w-4" />
                Add Factory
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Review & Submit — read-only form layout of all sections */}
        {currentStep === 4 && (
          <Card className="w-full border-amber-200/60 dark:border-amber-800/60">
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                  4
                </span>
                <div>
                  <CardTitle className="text-lg">Review & Submit</CardTitle>
                  <CardDescription>Verify all details before submission</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Read-only: Entity Details */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground border-b pb-2">1. Entity Details</h4>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Legal Entity Name</Label>
                    <Input value={entity.legalName} readOnly className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Importer Exporter Code (IEC)</Label>
                    <Input value={entity.iec} readOnly className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">GSTIN</Label>
                    <Input value={entity.gstin} readOnly className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">PAN</Label>
                    <Input value={entity.pan} readOnly className="bg-muted/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Registered Address</Label>
                  <Input value={entity.address} readOnly className="bg-muted/50" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Contact Person Name</Label>
                    <Input value={entity.contactName} readOnly className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Contact Email</Label>
                    <Input type="email" value={entity.contactEmail} readOnly className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Contact Phone Number</Label>
                    <Input value={entity.contactPhone} readOnly className="bg-muted/50" />
                  </div>
                </div>
              </div>

              {/* Read-only: IGCR Scheme Details */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground border-b pb-2">2. IGCR Scheme Details</h4>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Scheme Name</Label>
                    <Input value={scheme.schemeName} readOnly className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Import Identification Number (IIN)</Label>
                    <Input value={scheme.iin} readOnly className="bg-muted/50 font-mono" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-muted-foreground">Jurisdictional Customs Authority</Label>
                    <Input value={scheme.authority} readOnly className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Validity Period (From)</Label>
                    <Input value={scheme.validFrom} readOnly className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Validity Period (To)</Label>
                    <Input value={scheme.validTo} readOnly className="bg-muted/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Declaration of intent</Label>
                  <Textarea value={scheme.declarationIntent} readOnly rows={4} className="bg-muted/50 resize-none" />
                </div>
              </div>

              {/* Read-only: Approved Factory / Premises */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground border-b pb-2">3. Approved Factory / Premises Details</h4>
                {factories.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No premises added.</p>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Factory / Premises Name</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Customs Approval Ref. No</TableHead>
                          <TableHead>Effective From Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {factories.map((row, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{row.name || "—"}</TableCell>
                            <TableCell className="text-muted-foreground">{row.address || "—"}</TableCell>
                            <TableCell>{row.type || "—"}</TableCell>
                            <TableCell className="font-mono text-xs">{row.approvalRef || "—"}</TableCell>
                            <TableCell>{row.effectiveFrom || "—"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-3 pt-2">
                <Checkbox
                  id="declaration"
                  checked={declarationChecked}
                  onCheckedChange={(c) => setDeclarationChecked(!!c)}
                />
                <label
                  htmlFor="declaration"
                  className="text-sm leading-tight cursor-pointer"
                >
                  I declare that the information provided is true and correct to the best of my knowledge and that I shall comply with the conditions of the IGCR scheme and related customs provisions.
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  className="bg-amber-600 hover:bg-amber-700"
                  onClick={() => setStatus("Submitted")}
                  disabled={!declarationChecked}
                >
                  Submit for Approval
                </Button>
                <Button
                  variant="outline"
                  className="border-amber-300 dark:border-amber-700"
                  onClick={() => setCurrentStep(1)}
                >
                  Edit
                </Button>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Info className="h-3.5 w-3.5" />
                Maker–Checker workflow: submission will route to approver; approval pending until verified.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer: Back / Next — only when not on step 4 (Review) */}
      {currentStep < 4 && (
        <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4 w-full max-w-full">
          <Button
            variant="outline"
            onClick={goBack}
            disabled={currentStep <= 1}
            className="gap-2 border-amber-300 dark:border-amber-700"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={goNext}
            className="gap-2 bg-amber-600 hover:bg-amber-700"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
