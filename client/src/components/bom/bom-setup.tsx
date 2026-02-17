"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { FileUploadButton } from "@/components/ui/file-upload-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Loader2, ListTree, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type Part = {
  id: string;
  part_id: string;
  description: string;
  uom: string;
  status: string;
};

type FinishedGood = {
  id: string;
  fg_id: string;
  description: string;
  uom: string;
  hsn?: string;
  status: string;
};

/** Dummy FGs so the dropdown is never empty (no API dependency for list) */
const DUMMY_FINISHED_GOODS: FinishedGood[] = [
  { id: "dummy-FG-1001", fg_id: "FG-1001", description: "Assembly Unit A", uom: "NOS", hsn: "8471", status: "active" },
  { id: "dummy-FG-1002", fg_id: "FG-1002", description: "Assembly Unit B", uom: "NOS", hsn: "8471", status: "active" },
  { id: "dummy-FG-1003", fg_id: "FG-1003", description: "Finished Good C - Electronic Module", uom: "NOS", hsn: "8504", status: "active" },
  { id: "dummy-FG-1004", fg_id: "FG-1004", description: "Packaged Consumer Product", uom: "CTN", hsn: "4819", status: "active" },
  { id: "dummy-FG-1005", fg_id: "FG-1005", description: "Machinery Assembly - Type X", uom: "NOS", hsn: "8479", status: "active" },
];

/** Dummy parts for Part ID lookup when API returns empty */
const DUMMY_PARTS: Part[] = [
  { id: "dummy-pt-1", part_id: "PT-1001", description: "Industrial machinery parts - Category A", uom: "NOS", status: "active" },
  { id: "dummy-pt-2", part_id: "PT-1002", description: "Electronic components - PCB assembly", uom: "NOS", status: "active" },
  { id: "dummy-pt-3", part_id: "PT-1003", description: "Raw materials - Steel grade 304", uom: "KG", status: "active" },
  { id: "dummy-pt-4", part_id: "PT-1004", description: "Packaging materials - Cartons", uom: "CTN", status: "active" },
  { id: "dummy-pt-5", part_id: "PT-1005", description: "Spare parts - Conveyor system", uom: "NOS", status: "active" },
  { id: "dummy-pt-6", part_id: "PT-1006", description: "Fasteners - M8 bolts", uom: "NOS", status: "active" },
  { id: "dummy-pt-7", part_id: "PT-1007", description: "Wire harness - 12V", uom: "M", status: "active" },
];

/** Standard UOM options for all dropdowns */
const UOM_OPTIONS = [
  "KG", "MT", "G", "NOS", "PCS", "SET", "LTR", "ML", "M", "CM", "MM",
  "SQM", "CUM", "BOX", "CTN", "BAG", "DRUM", "ROLL", "DOZ", "PAIR",
];

type FormBomLine = { partId: string; description: string; uom: string; quantity: string };

type BomRecord = {
  id: string;
  finished_good_id: string;
  entity_id: string;
  status: string;
};

type BomLine = {
  id: string;
  bom_id: string;
  part_id: string;
  part_description: string;
  part_uom: string;
  quantity: number;
  consumption_uom: string;
  uom_conversion_factor: number;
};

type BomWithLines = BomRecord & {
  fg_id: string;
  fg_description: string;
  fg_uom: string;
  fg_hsn?: string;
  lines: BomLine[];
};

/** Uploaded file preview: fixed dummy data shown on any file upload (file is not read) */
type UploadBomPreview = {
  fileName: string;
  headers: string[];
  rows: (string | number)[][];
};

const DUMMY_UPLOAD_PREVIEW: Omit<UploadBomPreview, "fileName"> = {
  headers: ["Part ID", "Description", "UOM", "Quantity"],
  rows: [
    ["PT-1001", "Industrial machinery parts - Category A", "NOS", 2],
    ["PT-1002", "Electronic components - PCB assembly", "NOS", 1],
    ["PT-1003", "Raw materials - Steel grade 304", "KG", 0.5],
    ["PT-1004", "Packaging materials - Cartons", "CTN", 4],
    ["PT-1005", "Spare parts - Conveyor system", "NOS", 1],
  ],
};

/** BOM Upload tab: previously uploaded BOM records */
type BomUploadRecord = {
  month: string;
  partId: string;
  partDescription: string;
  qty: number;
  materialUnitCost: number;
  totalValue: number;
  workOrderId: string;
  qtyFinal: number;
  totalValueFinal: number;
  taxableValue: number;
  hsnCode: string;
  dutyIgst: number;
};

const DUMMY_BOM_UPLOAD_RECORDS: BomUploadRecord[] = [
  { month: "Jan 2025", partId: "PT-1001", partDescription: "Industrial machinery parts - Category A", qty: 100, materialUnitCost: 1250, totalValue: 125000, workOrderId: "WO-2025-001", qtyFinal: 98, totalValueFinal: 122500, taxableValue: 115000, hsnCode: "8471", dutyIgst: 21150 },
  { month: "Jan 2025", partId: "PT-1002", partDescription: "Electronic components - PCB assembly", qty: 250, materialUnitCost: 340, totalValue: 85000, workOrderId: "WO-2025-002", qtyFinal: 248, totalValueFinal: 84320, taxableValue: 79000, hsnCode: "8534", dutyIgst: 14220 },
  { month: "Feb 2025", partId: "PT-1003", partDescription: "Raw materials - Steel grade 304", qty: 500, materialUnitCost: 185, totalValue: 92500, workOrderId: "WO-2025-003", qtyFinal: 495, totalValueFinal: 91575, taxableValue: 86000, hsnCode: "7219", dutyIgst: 15480 },
  { month: "Feb 2025", partId: "PT-1004", partDescription: "Packaging materials - Cartons", qty: 1200, materialUnitCost: 42, totalValue: 50400, workOrderId: "WO-2025-004", qtyFinal: 1195, totalValueFinal: 50190, taxableValue: 47000, hsnCode: "4819", dutyIgst: 8460 },
  { month: "Mar 2025", partId: "PT-1005", partDescription: "Spare parts - Conveyor system", qty: 45, materialUnitCost: 2200, totalValue: 99000, workOrderId: "WO-2025-005", qtyFinal: 44, totalValueFinal: 96800, taxableValue: 91000, hsnCode: "8483", dutyIgst: 16380 },
  { month: "Mar 2025", partId: "PT-1006", partDescription: "Fasteners - M8 bolts", qty: 5000, materialUnitCost: 8.5, totalValue: 42500, workOrderId: "WO-2025-006", qtyFinal: 4980, totalValueFinal: 42330, taxableValue: 39800, hsnCode: "7318", dutyIgst: 7164 },
];

/** Sample configured BOMs shown when API returns none (so the section is never empty) */
const DUMMY_BOMS_WITH_LINES: BomWithLines[] = [
  {
    id: "dummy-bom-1",
    finished_good_id: "dummy-FG-1001",
    entity_id: "hsbc",
    status: "active",
    fg_id: "FG-1001",
    fg_description: "Assembly Unit A",
    fg_uom: "NOS",
    fg_hsn: "8471",
    lines: [
      { id: "dummy-bl-1a", bom_id: "dummy-bom-1", part_id: "PT-1001", part_description: "Industrial machinery parts - Category A", part_uom: "NOS", quantity: 2, consumption_uom: "NOS", uom_conversion_factor: 1 },
      { id: "dummy-bl-1b", bom_id: "dummy-bom-1", part_id: "PT-1002", part_description: "Electronic components - PCB assembly", part_uom: "NOS", quantity: 1, consumption_uom: "NOS", uom_conversion_factor: 1 },
    ],
  },
  {
    id: "dummy-bom-2",
    finished_good_id: "dummy-FG-1002",
    entity_id: "hsbc",
    status: "active",
    fg_id: "FG-1002",
    fg_description: "Assembly Unit B",
    fg_uom: "NOS",
    fg_hsn: "8471",
    lines: [
      { id: "dummy-bl-2a", bom_id: "dummy-bom-2", part_id: "PT-1002", part_description: "Electronic components - PCB assembly", part_uom: "NOS", quantity: 3, consumption_uom: "NOS", uom_conversion_factor: 1 },
      { id: "dummy-bl-2b", bom_id: "dummy-bom-2", part_id: "PT-1003", part_description: "Raw materials - Steel grade 304", part_uom: "KG", quantity: 0.5, consumption_uom: "KG", uom_conversion_factor: 1 },
    ],
  },
];

export function BOMSetup() {
  const [selectedFgId, setSelectedFgId] = useState<string>("");
  const [bomId, setBomId] = useState<string | null>(null);
  const [addLineOpen, setAddLineOpen] = useState(false);
  const [addFgOpen, setAddFgOpen] = useState(false);
  const [addPartOpen, setAddPartOpen] = useState(false);
  const [newLine, setNewLine] = useState({
    partId: "",
    quantity: "",
    consumptionUom: "",
    uomConversionFactor: "1",
  });
  const [newFg, setNewFg] = useState({ fgId: "", description: "", uom: "", hsn: "" });
  const [newPart, setNewPart] = useState({ partId: "", description: "", uom: "" });
  const [createdFgs, setCreatedFgs] = useState<FinishedGood[]>([]);
  const [bomFormOpen, setBomFormOpen] = useState(false);
  const [formLines, setFormLines] = useState<FormBomLine[]>([{ partId: "", description: "", uom: "", quantity: "" }]);
  const [savingBom, setSavingBom] = useState(false);
  const [addFgWizardOpen, setAddFgWizardOpen] = useState(false);
  const [addFgWizardStep, setAddFgWizardStep] = useState<1 | 2>(1);
  const [addFgWizardFgName, setAddFgWizardFgName] = useState("");
  const [addFgWizardUom, setAddFgWizardUom] = useState("");
  const [addFgWizardHsn, setAddFgWizardHsn] = useState("");
  const [addFgWizardParts, setAddFgWizardParts] = useState<FormBomLine[]>([{ partId: "", description: "", uom: "", quantity: "" }]);
  const [addFgWizardSaving, setAddFgWizardSaving] = useState(false);
  const [uploadBomPreview, setUploadBomPreview] = useState<UploadBomPreview | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: partsFromApi = [], isLoading: partsLoading } = useQuery<Part[]>({
    queryKey: ["bom", "parts"],
    queryFn: async () => {
      const res = await fetch("/api/bom/parts");
      if (!res.ok) throw new Error("Failed to fetch parts");
      return res.json();
    },
  });

  const parts = useMemo(() => (partsFromApi.length > 0 ? partsFromApi : DUMMY_PARTS), [partsFromApi]);

  const { data: bomsFromApi = [], isLoading: bomsWithLinesLoading } = useQuery<BomWithLines[]>({
    queryKey: ["bom", "with-lines"],
    queryFn: async () => {
      const res = await fetch("/api/bom/with-lines");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const bomsWithLines = useMemo(() => {
    if (bomsFromApi.length === 0) return DUMMY_BOMS_WITH_LINES;
    return bomsFromApi.map((bom) => {
      if (bom.lines?.length) return bom;
      const dummy = DUMMY_BOMS_WITH_LINES.find((d) => d.fg_id === bom.fg_id);
      return { ...bom, lines: dummy?.lines ?? [] };
    });
  }, [bomsFromApi]);

  const { data: apiFinishedGoods = [] } = useQuery<FinishedGood[]>({
    queryKey: ["bom", "finished-goods"],
    queryFn: async () => {
      const res = await fetch("/api/bom/finished-goods");
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Use API FGs when available (includes seeded); otherwise dummy + created so dropdown is never empty
  const finishedGoods = useMemo(() => {
    if (apiFinishedGoods.length > 0) {
      const apiIds = new Set(apiFinishedGoods.map((f) => f.id));
      const extraCreated = createdFgs.filter((c) => !apiIds.has(c.id));
      return [...apiFinishedGoods, ...extraCreated];
    }
    return [...DUMMY_FINISHED_GOODS, ...createdFgs];
  }, [apiFinishedGoods, createdFgs]);

  const selectedFg = useMemo(
    () => finishedGoods.find((fg) => fg.id === selectedFgId),
    [finishedGoods, selectedFgId]
  );

  const isDummyFg = selectedFgId.startsWith("dummy-");

  const { data: bomByFg, isLoading: bomByFgLoading } = useQuery<BomRecord | null>({
    queryKey: ["bom", "by-fg", selectedFgId],
    queryFn: async () => {
      if (!selectedFgId || isDummyFg) return null;
      const res = await fetch(`/api/bom/by-finished-good/${selectedFgId}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch BOM");
      return res.json();
    },
    enabled: !!selectedFgId && !isDummyFg,
  });

  const effectiveBomId = bomByFg?.id ?? bomId;

  const { data: bomLines = [], isLoading: linesLoading } = useQuery<BomLine[]>({
    queryKey: ["bom", "lines", effectiveBomId],
    queryFn: async () => {
      if (!effectiveBomId) return [];
      const res = await fetch(`/api/bom/${effectiveBomId}/lines`);
      if (!res.ok) throw new Error("Failed to fetch BOM lines");
      return res.json();
    },
    enabled: !!effectiveBomId,
  });

  const createBomMutation = useMutation({
    mutationFn: async (finishedGoodId: string) => {
      const res = await fetch("/api/bom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finishedGoodId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create BOM");
      }
      return res.json();
    },
    onSuccess: (data: BomRecord) => {
      setBomId(data.id);
      queryClient.invalidateQueries({ queryKey: ["bom", "by-fg", selectedFgId] });
      queryClient.invalidateQueries({ queryKey: ["bom"] });
      toast({ title: "BOM created", description: "You can now add parts to this BOM." });
    },
    onError: (e: Error) => {
      toast({ variant: "destructive", title: "Error", description: e.message });
    },
  });

  const addLineMutation = useMutation({
    mutationFn: async (payload: {
      bomId: string;
      partId: string;
      quantity: number;
      consumptionUom: string;
      uomConversionFactor: number;
    }) => {
      const res = await fetch(`/api/bom/${payload.bomId}/lines`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partId: payload.partId,
          quantity: payload.quantity,
          consumptionUom: payload.consumptionUom,
          uomConversionFactor: payload.uomConversionFactor,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to add line");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bom", "lines", effectiveBomId!] });
      queryClient.invalidateQueries({ queryKey: ["bom", "with-lines"] });
      setAddLineOpen(false);
      setNewLine({ partId: "", quantity: "", consumptionUom: "", uomConversionFactor: "1" });
      toast({ title: "Line added" });
    },
    onError: (e: Error) => {
      toast({ variant: "destructive", title: "Error", description: e.message });
    },
  });

  const deleteLineMutation = useMutation({
    mutationFn: async (lineId: string) => {
      const res = await fetch(`/api/bom/lines/${lineId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete line");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bom", "lines", effectiveBomId!] });
      queryClient.invalidateQueries({ queryKey: ["bom", "with-lines"] });
      toast({ title: "Line removed" });
    },
    onError: (e: Error) => {
      toast({ variant: "destructive", title: "Error", description: e.message });
    },
  });

  const createFgMutation = useMutation({
    mutationFn: async (body: { fgId: string; description: string; uom: string; hsn?: string }) => {
      const res = await fetch("/api/bom/finished-goods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create finished good");
      }
      return res.json();
    },
    onSuccess: (data: FinishedGood) => {
      setCreatedFgs((prev) => [...prev, data]);
      queryClient.invalidateQueries({ queryKey: ["bom", "finished-goods"] });
      setSelectedFgId(data.id);
      setAddFgOpen(false);
      setNewFg({ fgId: "", description: "", uom: "", hsn: "" });
      toast({ title: "Finished good created", description: "Define BOM (add parts) in the form below." });
      setFormLines([{ partId: "", description: "", uom: "", quantity: "" }]);
      setBomFormOpen(true);
    },
    onError: (e: Error) => {
      toast({ variant: "destructive", title: "Error", description: e.message });
    },
  });

  const createPartMutation = useMutation({
    mutationFn: async (body: { partId: string; description: string; uom: string }) => {
      const res = await fetch("/api/bom/parts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create part");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bom", "parts"] });
      setAddPartOpen(false);
      setNewPart({ partId: "", description: "", uom: "" });
      toast({ title: "Part created" });
    },
    onError: (e: Error) => {
      toast({ variant: "destructive", title: "Error", description: e.message });
    },
  });

  const handleSelectFg = (fgId: string) => {
    setSelectedFgId(fgId);
    if (!fgId) setBomId(null);
  };

  const openBomForm = () => {
    if (!selectedFgId || !selectedFg) {
      toast({ variant: "destructive", title: "Select a finished good first" });
      return;
    }
    setFormLines([{ partId: "", description: "", uom: "", quantity: "" }]);
    setBomFormOpen(true);
  };

  const lookupPart = (partId: string): Part | undefined =>
    parts.find((p) => p.part_id.toUpperCase() === partId.trim().toUpperCase());

  const updateFormLinePart = (rowIndex: number, partId: string) => {
    const part = lookupPart(partId);
    setFormLines((prev) => {
      const next = [...prev];
      next[rowIndex] = {
        ...next[rowIndex],
        partId: partId.trim(),
        description: part ? part.description : "",
        uom: part ? part.uom : "",
      };
      return next;
    });
  };

  const addFormLine = () => setFormLines((prev) => [...prev, { partId: "", description: "", uom: "", quantity: "" }]);
  const removeFormLine = (index: number) => setFormLines((prev) => prev.filter((_, i) => i !== index));

  const openAddFgWizard = () => {
    setAddFgWizardStep(1);
    setAddFgWizardFgName("");
    setAddFgWizardUom("");
    setAddFgWizardHsn("");
    setAddFgWizardParts([{ partId: "", description: "", uom: "", quantity: "" }]);
    setAddFgWizardOpen(true);
  };

  const updateWizardPart = (rowIndex: number, partId: string) => {
    const part = lookupPart(partId);
    setAddFgWizardParts((prev) => {
      const next = [...prev];
      next[rowIndex] = {
        ...next[rowIndex],
        partId: partId.trim(),
        description: part ? part.description : "",
        uom: part ? part.uom : "",
      };
      return next;
    });
  };

  const addWizardPartRow = () => setAddFgWizardParts((prev) => [...prev, { partId: "", description: "", uom: "", quantity: "" }]);
  const removeWizardPartRow = (index: number) => setAddFgWizardParts((prev) => prev.filter((_, i) => i !== index));

  const saveAddFgWizard = async () => {
    const fgName = addFgWizardFgName.trim();
    const uom = addFgWizardUom.trim();
    if (!fgName || !uom) {
      toast({ variant: "destructive", title: "FG Name and UOM are required" });
      return;
    }

    // Use uploaded (dummy) part list if present, else manual table
    let validLines: { partId: string; quantity: string }[];
    if (uploadBomPreview?.rows?.length) {
      const partIdIdx = uploadBomPreview.headers.findIndex((h) => /part\s*id|partid/i.test(h));
      const qtyIdx = uploadBomPreview.headers.findIndex((h) => /qty|quantity/i.test(h));
      const partIdCol = partIdIdx >= 0 ? partIdIdx : 0;
      const qtyCol = qtyIdx >= 0 ? qtyIdx : uploadBomPreview.headers.length - 1;
      validLines = uploadBomPreview.rows
        .map((row) => ({
          partId: String(row[partIdCol] ?? "").trim(),
          quantity: String(row[qtyCol] ?? "0"),
        }))
        .filter((row) => row.partId && parseFloat(row.quantity) > 0);
    } else {
      validLines = addFgWizardParts
        .filter((row) => row.partId.trim() && row.quantity.trim() && parseFloat(row.quantity) > 0)
        .map((row) => ({ partId: row.partId, quantity: row.quantity }));
    }

    if (validLines.length === 0) {
      toast({ variant: "destructive", title: "Add at least one part (or upload a file with Part ID and Quantity)" });
      return;
    }
    for (const row of validLines) {
      if (!lookupPart(row.partId)) {
        toast({ variant: "destructive", title: `Part not found: ${row.partId}` });
        return;
      }
    }

    setAddFgWizardSaving(true);
    try {
      const fgId = `FG-${Date.now()}`;
      const fgRes = await fetch("/api/bom/finished-goods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fgId, description: fgName, uom, hsn: addFgWizardHsn.trim() || undefined }),
      });
      if (!fgRes.ok) {
        const err = await fgRes.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create finished good");
      }
      const fgData: FinishedGood = await fgRes.json();
      const bomRes = await fetch("/api/bom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finishedGoodId: fgData.id }),
      });
      if (!bomRes.ok) throw new Error("Failed to create BOM");
      const bomData: BomRecord = await bomRes.json();
      for (const row of validLines) {
        const part = lookupPart(row.partId)!;
        const lineRes = await fetch(`/api/bom/${bomData.id}/lines`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            partId: part.part_id,
            quantity: parseFloat(row.quantity),
            consumptionUom: part.uom,
            uomConversionFactor: 1,
          }),
        });
        if (!lineRes.ok) throw new Error(`Failed to add line for ${part.part_id}`);
      }
      queryClient.invalidateQueries({ queryKey: ["bom", "finished-goods"] });
      queryClient.invalidateQueries({ queryKey: ["bom", "with-lines"] });
      setAddFgWizardOpen(false);
      setAddFgWizardStep(1);
      setAddFgWizardFgName("");
      setAddFgWizardUom("");
      setAddFgWizardHsn("");
      setAddFgWizardParts([{ partId: "", description: "", uom: "", quantity: "" }]);
      setUploadBomPreview(null);
      toast({ title: "Finished good and BOM created", description: `${fgData.fg_id} with ${validLines.length} part(s).` });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e?.message || "Failed to create FG and BOM" });
    } finally {
      setAddFgWizardSaving(false);
    }
  };

  const handleUploadBomFile = (_file: File) => {
    setUploadBomPreview({
      ...DUMMY_UPLOAD_PREVIEW,
      fileName: _file.name,
    });
    toast({ title: "File loaded", description: `Showing sample part list (${DUMMY_UPLOAD_PREVIEW.rows.length} rows).` });
  };

  const saveBomFromForm = async () => {
    if (!selectedFg || !selectedFgId) return;
    setSavingBom(true);
    const validLines = formLines.filter((row) => row.partId.trim() && row.quantity.trim() && parseFloat(row.quantity) > 0);
    if (validLines.length === 0) {
      toast({ variant: "destructive", title: "Add at least one part with Part ID and quantity" });
      return;
    }
    for (const row of validLines) {
      if (!lookupPart(row.partId)) {
        toast({ variant: "destructive", title: `Part not found: ${row.partId}` });
        return;
      }
    }

    let fgIdToUse = selectedFgId;
    if (isDummyFg) {
      try {
        const fgRes = await fetch("/api/bom/finished-goods", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fgId: selectedFg.fg_id,
            description: selectedFg.description,
            uom: selectedFg.uom,
            hsn: selectedFg.hsn || undefined,
          }),
        });
        if (!fgRes.ok) throw new Error("Failed to create FG");
        const fgData: FinishedGood = await fgRes.json();
        setCreatedFgs((prev) => [...prev, fgData]);
        setSelectedFgId(fgData.id);
        fgIdToUse = fgData.id;
        queryClient.invalidateQueries({ queryKey: ["bom", "by-fg", fgData.id] });
      } catch (e: any) {
        toast({ variant: "destructive", title: "Error", description: e?.message || "Failed to create finished good" });
        setSavingBom(false);
        return;
      }
    }

    try {
      const bomRes = await fetch("/api/bom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finishedGoodId: fgIdToUse }),
      });
      if (!bomRes.ok) throw new Error("Failed to create BOM");
      const bomData: BomRecord = await bomRes.json();
      setBomId(bomData.id);
      queryClient.invalidateQueries({ queryKey: ["bom", "by-fg", fgIdToUse] });
      queryClient.invalidateQueries({ queryKey: ["bom"] });

      for (const row of validLines) {
        const part = lookupPart(row.partId)!;
        const qty = parseFloat(row.quantity);
        const lineRes = await fetch(`/api/bom/${bomData.id}/lines`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            partId: part.part_id,
            quantity: qty,
            consumptionUom: part.uom,
            uomConversionFactor: 1,
          }),
        });
        if (!lineRes.ok) throw new Error(`Failed to add line for ${part.part_id}`);
      }

      setBomFormOpen(false);
      setFormLines([{ partId: "", description: "", uom: "", quantity: "" }]);
      queryClient.invalidateQueries({ queryKey: ["bom", "lines", bomData.id] });
      queryClient.invalidateQueries({ queryKey: ["bom", "with-lines"] });
      toast({ title: "BOM created", description: `${validLines.length} part(s) added.` });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e?.message || "Failed to create BOM" });
    }
  };

  const handleAddLine = () => {
    if (!effectiveBomId || !newLine.partId || !newLine.quantity || !newLine.consumptionUom) {
      toast({ variant: "destructive", title: "Part, quantity and consumption UOM are required" });
      return;
    }
    const qty = parseFloat(newLine.quantity);
    const factor = parseFloat(newLine.uomConversionFactor || "1");
    if (isNaN(qty) || qty <= 0) {
      toast({ variant: "destructive", title: "Quantity must be a positive number" });
      return;
    }
    addLineMutation.mutate({
      bomId: effectiveBomId,
      partId: newLine.partId,
      quantity: qty,
      consumptionUom: newLine.consumptionUom,
      uomConversionFactor: isNaN(factor) || factor <= 0 ? 1 : factor,
    });
  };

  const partOptions = useMemo(
    () =>
      parts.map((p) => ({
        value: p.part_id,
        label: `${p.part_id} — ${p.description}`,
        uom: p.uom,
      })),
    [parts]
  );

  const selectedPartUom = newLine.partId
    ? partOptions.find((o) => o.value === newLine.partId)?.uom ?? ""
    : "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ListTree className="h-7 w-7 text-amber-600" />
          BOM Setup
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Set up a finished good (FG) and define which parts (PRT) it consumes, with quantity and UOM conversion.
        </p>
      </div>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className={cn("bg-amber-100/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800", "inline-flex h-11 gap-1 p-1")}>
          <TabsTrigger value="setup" className={cn("data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-sm", "border-amber-200 dark:border-amber-800")}>
            <ListTree className="h-4 w-4 mr-2" />
            BOM Setup
          </TabsTrigger>
          <TabsTrigger value="upload" className={cn("data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-sm", "border-amber-200 dark:border-amber-800")}>
            <Upload className="h-4 w-4 mr-2" />
            BOM Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="mt-4 space-y-6">
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 gap-4">
          <div className="space-y-1.5">
            <CardTitle className="text-lg">Configured BOMs</CardTitle>
            <CardDescription>
              Finished goods and their bill of materials (parts by ID, description, UOM).
            </CardDescription>
          </div>
          <Button
            type="button"
            onClick={openAddFgWizard}
            className="bg-amber-600 hover:bg-amber-700 shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add FG
          </Button>
        </CardHeader>
        <CardContent>
          {bomsWithLinesLoading ? (
            <div className="flex items-center gap-2 py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading...
            </div>
          ) : (
            <div className="space-y-6">
              {bomsFromApi.length === 0 && bomsWithLines.length > 0 && (
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Sample data. Create a BOM below to see your configured BOMs here.
                </p>
              )}

              {bomsWithLines.map((bom) => (
                <div key={bom.id} className="rounded-lg border border-amber-200/60 dark:border-amber-800/60 overflow-hidden">
                  <div className="bg-amber-50 dark:bg-amber-950/30 px-4 py-3 border-b border-amber-200/60 dark:border-amber-800/60">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                        {bom.fg_description}
                      </p>
                      <div className="flex items-center gap-6 text-sm">
                        <span className="text-amber-800 dark:text-amber-200">
                          <span className="font-medium text-amber-900 dark:text-amber-100">HSN</span>
                          {" "}
                          <span className="tabular-nums">{bom.fg_hsn ?? "8471"}</span>
                        </span>
                        <span className="text-amber-800 dark:text-amber-200">
                          <span className="font-medium text-amber-900 dark:text-amber-100">UOM</span>
                          {" "}
                          <span>{bom.fg_uom}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-muted/30 border-b border-amber-200/40 dark:border-amber-800/40">
                    <span className="text-xs font-medium text-muted-foreground">Parts</span>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-amber-200/50 dark:border-amber-800/50 bg-muted/40">
                        <TableHead className="font-medium text-amber-900 dark:text-amber-100">Part ID</TableHead>
                        <TableHead className="font-medium text-amber-900 dark:text-amber-100">Description</TableHead>
                        <TableHead className="font-medium text-amber-900 dark:text-amber-100 text-right w-24">Qty</TableHead>
                        <TableHead className="font-medium text-amber-900 dark:text-amber-100 w-24">UOM</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(bom.lines?.length ? bom.lines : []).map((line) => (
                        <TableRow key={line.id} className="border-amber-200/50 dark:border-amber-800/50">
                          <TableCell className="font-mono text-sm py-2.5">{line.part_id}</TableCell>
                          <TableCell className="text-sm text-muted-foreground py-2.5">{line.part_description}</TableCell>
                          <TableCell className="text-right tabular-nums py-2.5">{line.quantity ?? "—"}</TableCell>
                          <TableCell className="py-2.5">{line.part_uom}</TableCell>
                        </TableRow>
                      ))}
                      {(!bom.lines || bom.lines.length === 0) && (
                        <TableRow className="border-amber-200/50 dark:border-amber-800/50">
                          <TableCell colSpan={4} className="text-sm text-muted-foreground py-4 text-center italic">
                            No parts defined
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={addFgWizardOpen} onOpenChange={(open) => { setAddFgWizardOpen(open); if (!open) { setAddFgWizardStep(1); setUploadBomPreview(null); } }}>
        <DialogContent className="border-amber-200 dark:border-amber-800 sm:max-w-2xl max-w-[95vw] max-h-[90vh] overflow-y-auto">
          {addFgWizardStep === 1 ? (
            <>
              <DialogHeader>
                <DialogTitle>Add finished good — Step 1</DialogTitle>
                <CardDescription>Enter FG name and UOM. You will add or upload parts in the next step.</CardDescription>
              </DialogHeader>
              <div className="space-y-5 py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>FG Name</Label>
                    <Input
                      placeholder="e.g. Assembly Unit A"
                      value={addFgWizardFgName}
                      onChange={(e) => setAddFgWizardFgName(e.target.value)}
                      className="border-amber-200 dark:border-amber-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>UOM</Label>
                    <Select value={addFgWizardUom || "_empty"} onValueChange={(v) => setAddFgWizardUom(v === "_empty" ? "" : v)}>
                      <SelectTrigger className="border-amber-200 dark:border-amber-800">
                        <SelectValue placeholder="Select UOM..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_empty">Select UOM...</SelectItem>
                        {UOM_OPTIONS.map((u) => (
                          <SelectItem key={u} value={u}>{u}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>HSN</Label>
                    <Input
                      placeholder="e.g. 8471, 8504"
                      value={addFgWizardHsn}
                      onChange={(e) => setAddFgWizardHsn(e.target.value)}
                      className="border-amber-200 dark:border-amber-800"
                    />
                  </div>
                </div>

              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddFgWizardOpen(false)}>Cancel</Button>
                <Button
                  className="bg-amber-600 hover:bg-amber-700"
                  onClick={() => {
                    if (!addFgWizardFgName.trim() || !addFgWizardUom.trim()) {
                      toast({ variant: "destructive", title: "FG Name and UOM are required" });
                      return;
                    }
                    setAddFgWizardStep(2);
                  }}
                >
                  Next
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Add parts — Step 2</DialogTitle>
                <CardDescription>
                  Upload a file for the part list, or add parts manually by Part ID and quantity.
                </CardDescription>
              </DialogHeader>

              <div className="space-y-4 my-4">
                <div className="flex flex-wrap items-center gap-2">
                  <FileUploadButton
                    label="Upload BOM"
                    onFileSelect={handleUploadBomFile}
                    variant="outline"
                    className="border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                  />
                  {uploadBomPreview && (
                    <span className="text-xs text-muted-foreground">
                      {uploadBomPreview.fileName} — {uploadBomPreview.rows.length} row(s)
                    </span>
                  )}
                  {uploadBomPreview && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-amber-700 dark:text-amber-300"
                      onClick={() => setUploadBomPreview(null)}
                    >
                      Clear file
                    </Button>
                  )}
                </div>

                {uploadBomPreview ? (
                  <div className="rounded-lg border border-amber-200 dark:border-amber-800 overflow-hidden">
                    <div className="px-3 py-2 bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-800">
                      <span className="text-xs font-medium text-amber-900 dark:text-amber-100">Detailed part list from file</span>
                    </div>
                    <div className="overflow-x-auto max-h-[50vh] overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/40 border-amber-200/50 dark:border-amber-800/50">
                            {uploadBomPreview.headers.map((h, i) => (
                              <TableHead key={i} className="font-semibold text-amber-900 dark:text-amber-100 py-3 px-3 whitespace-nowrap">
                                {h}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(uploadBomPreview.rows.length === 0
                            ? [
                                Array(Math.max(1, uploadBomPreview.headers.length)).fill("—"),
                                Array(Math.max(1, uploadBomPreview.headers.length)).fill("—"),
                                Array(Math.max(1, uploadBomPreview.headers.length)).fill("—"),
                                Array(Math.max(1, uploadBomPreview.headers.length)).fill("—"),
                                Array(Math.max(1, uploadBomPreview.headers.length)).fill("—"),
                              ]
                            : uploadBomPreview.rows
                          ).map((row, rIdx) => (
                              <TableRow key={rIdx} className="border-amber-200/50 dark:border-amber-800/50">
                                {(uploadBomPreview.headers.length ? uploadBomPreview.headers : [""]).map((_, cIdx) => (
                                  <TableCell key={cIdx} className="py-2.5 px-3 text-sm">
                                    {row[cIdx] !== undefined && row[cIdx] !== null && row[cIdx] !== "" ? String(row[cIdx]) : "—"}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="border rounded-lg overflow-x-auto max-h-[50vh] overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-amber-200/50 dark:border-amber-800/50">
                            <TableHead className="font-semibold text-amber-900 dark:text-amber-100 py-3 px-3">Part ID</TableHead>
                            <TableHead className="font-semibold text-amber-900 dark:text-amber-100 py-3 px-3">Description</TableHead>
                            <TableHead className="font-semibold text-amber-900 dark:text-amber-100 text-right py-3 px-3 w-28">Qty</TableHead>
                            <TableHead className="w-12 py-3 px-3" />
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {addFgWizardParts.map((row, idx) => (
                            <TableRow key={idx} className="border-amber-200/50 dark:border-amber-800/50">
                              <TableCell className="py-2 px-3">
                                <Select
                                  value={row.partId || "_empty"}
                                  onValueChange={(v) => updateWizardPart(idx, v === "_empty" ? "" : v)}
                                >
                                  <SelectTrigger className="h-9 font-mono text-sm border-amber-200 dark:border-amber-800 min-w-[140px]">
                                    <SelectValue placeholder="Select part..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="_empty">Select part...</SelectItem>
                                    {partOptions.map((o) => (
                                      <SelectItem key={o.value} value={o.value}>
                                        {o.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell className="py-2 px-3 text-sm text-muted-foreground min-w-[160px]">{row.description || "—"}</TableCell>
                              <TableCell className="py-2 px-3 text-right">
                                <Input
                                  type="number"
                                  min="0"
                                  step="any"
                                  placeholder="0"
                                  value={row.quantity}
                                  onChange={(e) => {
                                    setAddFgWizardParts((prev) => {
                                      const next = [...prev];
                                      next[idx] = { ...next[idx], quantity: e.target.value };
                                      return next;
                                    });
                                  }}
                                  className="h-9 w-20 text-right tabular-nums border-amber-200 dark:border-amber-800 text-sm"
                                />
                              </TableCell>
                              <TableCell className="py-2 px-3">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600 hover:text-red-700 h-8 w-8"
                                  onClick={() => removeWizardPartRow(idx)}
                                  disabled={addFgWizardParts.length <= 1}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="pt-2">
                      <Button type="button" variant="outline" size="sm" onClick={addWizardPartRow} className="border-amber-200 dark:border-amber-800">
                        <Plus className="h-4 w-4 mr-2" />
                        Add row
                      </Button>
                    </div>
                  </>
                )}
              </div>

              <DialogFooter className="gap-2 pt-2">
                  <Button variant="outline" onClick={() => { setAddFgWizardStep(1); setUploadBomPreview(null); }} disabled={addFgWizardSaving}>Back</Button>
                  <Button className="bg-amber-600 hover:bg-amber-700" onClick={saveAddFgWizard} disabled={addFgWizardSaving}>
                    {addFgWizardSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Save
                  </Button>
                </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={bomFormOpen} onOpenChange={setBomFormOpen}>
        <DialogContent className="border-amber-200 dark:border-amber-800 sm:max-w-4xl max-w-[95vw] max-h-[90vh] overflow-y-auto p-6 sm:p-8">
          <DialogHeader className="space-y-2 pb-4">
            <DialogTitle className="text-xl">Create BOM</DialogTitle>
            {selectedFg && (
              <p className="text-sm text-muted-foreground pt-1">
                FG: <strong>{selectedFg.fg_id}</strong> — {selectedFg.description} (UOM: {selectedFg.uom})
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Select Part ID from the dropdown; description and UOM are filled automatically. Enter quantity consumed per unit of FG (in part UOM).
            </p>
          </DialogHeader>
          <div className="border rounded-lg overflow-x-auto my-6">
            <Table>
              <TableHeader>
                <TableRow className="border-amber-200/50 dark:border-amber-800/50">
                  <TableHead className="font-semibold text-amber-900 dark:text-amber-100 py-4 px-4">Part ID</TableHead>
                  <TableHead className="font-semibold text-amber-900 dark:text-amber-100 py-4 px-4">Description</TableHead>
                  <TableHead className="font-semibold text-amber-900 dark:text-amber-100 py-4 px-4 w-24">UOM</TableHead>
                  <TableHead className="font-semibold text-amber-900 dark:text-amber-100 text-right py-4 px-4 w-32">Qty per FG</TableHead>
                  <TableHead className="w-14 py-4 px-4" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {formLines.map((row, idx) => (
                  <TableRow key={idx} className="border-amber-200/50 dark:border-amber-800/50">
                    <TableCell className="py-3 px-4">
                      <Select
                        value={row.partId || "_empty"}
                        onValueChange={(v) => updateFormLinePart(idx, v === "_empty" ? "" : v)}
                      >
                        <SelectTrigger className="h-10 font-mono text-sm border-amber-200 dark:border-amber-800 min-w-[180px]">
                          <SelectValue placeholder="Select part..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_empty">Select part...</SelectItem>
                          {partOptions.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-sm text-muted-foreground min-w-[200px]">{row.description || "—"}</TableCell>
                    <TableCell className="py-3 px-4 text-sm font-medium">{row.uom || "—"}</TableCell>
                    <TableCell className="py-3 px-4 text-right">
                      <Input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0"
                        value={row.quantity}
                        onChange={(e) => setFormLines((prev) => {
                          const next = [...prev];
                          next[idx] = { ...next[idx], quantity: e.target.value };
                          return next;
                        })}
                        className="h-10 w-28 text-right tabular-nums border-amber-200 dark:border-amber-800 text-sm"
                      />
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700 h-9 w-9"
                        onClick={() => removeFormLine(idx)}
                        disabled={formLines.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between items-center pt-2 gap-4">
            <Button type="button" variant="outline" size="default" onClick={addFormLine} className="border-amber-200 dark:border-amber-800">
              <Plus className="h-4 w-4 mr-2" />
              Add row
            </Button>
            <DialogFooter className="gap-3 sm:gap-3">
              <Button variant="outline" size="default" onClick={() => setBomFormOpen(false)} disabled={savingBom}>Cancel</Button>
              <Button size="default" onClick={saveBomFromForm} disabled={savingBom} className="bg-amber-600 hover:bg-amber-700">
                {savingBom ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save BOM
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={addLineOpen} onOpenChange={setAddLineOpen}>
        <DialogContent className="border-amber-200 dark:border-amber-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add BOM line</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Part (PRT)</Label>
              <Select
                value={newLine.partId}
                onValueChange={(v) => setNewLine((prev) => ({ ...prev, partId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select part by Part ID and description..." />
                </SelectTrigger>
                <SelectContent>
                  {partOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPartUom && (
                <p className="text-xs text-muted-foreground">Part base UOM: {selectedPartUom}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="e.g. 2.5"
                  value={newLine.quantity}
                  onChange={(e) => setNewLine((prev) => ({ ...prev, quantity: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Consumption UOM</Label>
                <Select
                  value={newLine.consumptionUom || "_empty"}
                  onValueChange={(v) => setNewLine((prev) => ({ ...prev, consumptionUom: v === "_empty" ? "" : v }))}
                >
                  <SelectTrigger className="border-amber-200 dark:border-amber-800">
                    <SelectValue placeholder="Select UOM..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_empty">Select UOM...</SelectItem>
                    {UOM_OPTIONS.map((u) => (
                      <SelectItem key={u} value={u}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>UOM conversion factor (to part base UOM)</Label>
              <Input
                type="number"
                min="0"
                step="any"
                placeholder="1 if same UOM"
                value={newLine.uomConversionFactor}
                onChange={(e) => setNewLine((prev) => ({ ...prev, uomConversionFactor: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Part qty in base UOM = quantity × factor. Use 1 when consumption UOM is same as part UOM.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setAddPartOpen(true)}>
                Add new part to PRT list
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddLineOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddLine}
              disabled={addLineMutation.isPending || !newLine.partId || !newLine.quantity || !newLine.consumptionUom}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {addLineMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add line"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addFgOpen} onOpenChange={setAddFgOpen}>
        <DialogContent className="border-amber-200 dark:border-amber-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add finished good (FG)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>FG ID</Label>
              <Input
                placeholder="e.g. FG-1001"
                value={newFg.fgId}
                onChange={(e) => setNewFg((prev) => ({ ...prev, fgId: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="e.g. Assembly Unit A"
                value={newFg.description}
                onChange={(e) => setNewFg((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>UOM</Label>
              <Select value={newFg.uom || "_empty"} onValueChange={(v) => setNewFg((prev) => ({ ...prev, uom: v === "_empty" ? "" : v }))}>
                <SelectTrigger className="border-amber-200 dark:border-amber-800">
                  <SelectValue placeholder="Select UOM..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_empty">Select UOM...</SelectItem>
                  {UOM_OPTIONS.map((u) => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>HSN</Label>
              <Input
                placeholder="e.g. 8471, 8504"
                value={newFg.hsn}
                onChange={(e) => setNewFg((prev) => ({ ...prev, hsn: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddFgOpen(false)}>Cancel</Button>
            <Button
              onClick={() => createFgMutation.mutate({ ...newFg, hsn: newFg.hsn?.trim() || undefined })}
              disabled={createFgMutation.isPending || !newFg.fgId || !newFg.description || !newFg.uom}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {createFgMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addPartOpen} onOpenChange={setAddPartOpen}>
        <DialogContent className="border-amber-200 dark:border-amber-800 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add part (PRT)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Part ID</Label>
              <Input
                placeholder="e.g. PT-1001"
                value={newPart.partId}
                onChange={(e) => setNewPart((prev) => ({ ...prev, partId: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="e.g. Industrial machinery parts"
                value={newPart.description}
                onChange={(e) => setNewPart((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>UOM</Label>
              <Select value={newPart.uom || "_empty"} onValueChange={(v) => setNewPart((prev) => ({ ...prev, uom: v === "_empty" ? "" : v }))}>
                <SelectTrigger className="border-amber-200 dark:border-amber-800">
                  <SelectValue placeholder="Select UOM..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_empty">Select UOM...</SelectItem>
                  {UOM_OPTIONS.map((u) => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddPartOpen(false)}>Cancel</Button>
            <Button
              onClick={() => createPartMutation.mutate(newPart)}
              disabled={createPartMutation.isPending || !newPart.partId || !newPart.description || !newPart.uom}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {createPartMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </TabsContent>

        <TabsContent value="upload" className="mt-4">
          <Card className="border-amber-200 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="text-lg">Previously uploaded BOMs</CardTitle>
              <CardDescription>
                View all BOM records from uploads in table format.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-amber-200 dark:border-amber-800 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                      <TableHead className="font-semibold text-amber-900 dark:text-amber-100 whitespace-nowrap">Month</TableHead>
                      <TableHead className="font-semibold text-amber-900 dark:text-amber-100 whitespace-nowrap">PART_ID</TableHead>
                      <TableHead className="font-semibold text-amber-900 dark:text-amber-100 whitespace-nowrap">PART_DESCRIPTION</TableHead>
                      <TableHead className="font-semibold text-amber-900 dark:text-amber-100 text-right whitespace-nowrap">QTY</TableHead>
                      <TableHead className="font-semibold text-amber-900 dark:text-amber-100 text-right whitespace-nowrap">MATERIAL_UNIT_COST</TableHead>
                      <TableHead className="font-semibold text-amber-900 dark:text-amber-100 text-right whitespace-nowrap">TOTAL_VALUE</TableHead>
                      <TableHead className="font-semibold text-amber-900 dark:text-amber-100 whitespace-nowrap">WORK_ORDER_ID</TableHead>
                      <TableHead className="font-semibold text-amber-900 dark:text-amber-100 text-right whitespace-nowrap">QTY Final</TableHead>
                      <TableHead className="font-semibold text-amber-900 dark:text-amber-100 text-right whitespace-nowrap">TOTAL_VALUE Final</TableHead>
                      <TableHead className="font-semibold text-amber-900 dark:text-amber-100 text-right whitespace-nowrap">Taxable value</TableHead>
                      <TableHead className="font-semibold text-amber-900 dark:text-amber-100 whitespace-nowrap">HSN CODE</TableHead>
                      <TableHead className="font-semibold text-amber-900 dark:text-amber-100 text-right whitespace-nowrap">DUTY+IGST</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {DUMMY_BOM_UPLOAD_RECORDS.map((row, idx) => (
                      <TableRow key={idx} className="border-amber-200/50 dark:border-amber-800/50">
                        <TableCell className="whitespace-nowrap">{row.month}</TableCell>
                        <TableCell className="font-mono text-sm">{row.partId}</TableCell>
                        <TableCell className="max-w-[200px]">{row.partDescription}</TableCell>
                        <TableCell className="text-right tabular-nums">{row.qty}</TableCell>
                        <TableCell className="text-right tabular-nums">{row.materialUnitCost.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell className="text-right tabular-nums">{row.totalValue.toLocaleString("en-IN")}</TableCell>
                        <TableCell className="font-mono text-sm">{row.workOrderId}</TableCell>
                        <TableCell className="text-right tabular-nums">{row.qtyFinal}</TableCell>
                        <TableCell className="text-right tabular-nums">{row.totalValueFinal.toLocaleString("en-IN")}</TableCell>
                        <TableCell className="text-right tabular-nums">{row.taxableValue.toLocaleString("en-IN")}</TableCell>
                        <TableCell>{row.hsnCode}</TableCell>
                        <TableCell className="text-right tabular-nums">{row.dutyIgst.toLocaleString("en-IN")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
