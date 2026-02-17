import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Download, Upload, FileSpreadsheet } from "lucide-react";
import { downloadVerticalsTemplate } from "@/lib/excel-export";
import { parseVerticalsExcel } from "@/lib/excel-parser";

interface VerticalsBulkUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VerticalsBulkUploadModal({
  open,
  onOpenChange,
}: VerticalsBulkUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDownloadTemplate = () => {
    try {
      downloadVerticalsTemplate();
      toast({
        title: "Template downloaded",
        description: "verticals_template.xlsx has been downloaded. Fill in Name, Description, and Status columns.",
      });
    } catch (err) {
      toast({
        title: "Download failed",
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      const ext = selected.name.split(".").pop()?.toLowerCase();
      if (ext !== "xlsx" && ext !== "xls") {
        toast({
          title: "Invalid file",
          description: "Please upload an Excel file (.xlsx or .xls).",
          variant: "destructive",
        });
        return;
      }
      setFile(selected);
    } else {
      setFile(null);
    }
    e.target.value = "";
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select an Excel file to upload.",
        variant: "destructive",
      });
      return;
    }
    setUploading(true);
    try {
      const rows = await parseVerticalsExcel(file);
      if (rows.length === 0) {
        toast({
          title: "No data found",
          description: "The file has no valid rows. Ensure the first row has headers: Name, Description, Status.",
          variant: "destructive",
        });
        setUploading(false);
        return;
      }
      const body = {
        verticals: rows.map((r) => ({
          name: r.name,
          description: r.description ?? "",
          status: r.status ?? "active",
        })),
      };
      const res = await fetch("/api/verticals/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Bulk upload failed");
      }
      const created = data.created ?? 0;
      const failed = data.failed ?? 0;
      queryClient.invalidateQueries({ queryKey: ["verticals"] });
      onOpenChange(false);
      setFile(null);
      toast({
        title: "Bulk upload complete",
        description:
          failed === 0
            ? `${created} vertical(s) created successfully.`
            : `${created} created, ${failed} failed. ${data.errors?.length ? "Check details." : ""}`,
        variant: failed > 0 ? "destructive" : "default",
      });
    } catch (err) {
      toast({
        title: "Upload failed",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setFile(null);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk upload verticals</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Download the template, fill in the verticals (Name, Description, Status), then upload the file.
            </p>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleDownloadTemplate}
            >
              <Download className="mr-2 h-4 w-4" />
              Download template
            </Button>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Upload Excel file</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleFileChange}
            />
            <div
              className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 px-4 py-8 text-center hover:border-muted-foreground/50"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Select Excel file"
            >
              {file ? (
                <>
                  <FileSpreadsheet className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Click to choose another file
                  </p>
                </>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to select .xlsx or .xls file
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleClose(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? "Uploading…" : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
