import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Download, Wifi, Clock, FileText } from "lucide-react";

interface DownloadConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  documentType: 'invoices' | 'creditNotes' | 'debitNotes';
  count: number;
  totalFiles: number;
  totalSize: string;
  estimatedTime: string;
}

const getDocumentTypeLabel = (type: 'invoices' | 'creditNotes' | 'debitNotes'): string => {
  switch (type) {
    case 'creditNotes': return 'Credit Notes';
    case 'debitNotes': return 'Debit Notes';
    default: return 'Invoices';
  }
};

const getDocumentTypeIcon = (type: 'invoices' | 'creditNotes' | 'debitNotes') => {
  switch (type) {
    case 'creditNotes': return FileText;
    case 'debitNotes': return FileText;
    default: return FileText;
  }
};

export function DownloadConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  documentType,
  count,
  totalFiles,
  totalSize,
  estimatedTime,
}: DownloadConfirmationModalProps) {
  const DocumentIcon = getDocumentTypeIcon(documentType);
  const documentLabel = getDocumentTypeLabel(documentType);

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Download className="h-5 w-5 text-[#1964d7]" />
            Confirm Download
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            Please review the download details before proceeding
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Download Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <DocumentIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{documentLabel}</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{count} documents</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-blue-200 dark:border-blue-800">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total Files</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{totalFiles}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Download Size</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{totalSize}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-600 dark:text-gray-400">Estimated Time</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{estimatedTime}</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-amber-900 dark:text-amber-100">Important Instructions:</p>
                <ul className="space-y-1.5 text-amber-800 dark:text-amber-200 list-disc list-inside">
                  <li>Ensure you have a stable internet connection</li>
                  <li>Do not close this browser tab during download</li>
                  <li>The download will take approximately <strong>{estimatedTime}</strong> to complete</li>
                  <li>You can continue using other features while the download is in progress</li>
                  <li>Up to 3 downloads can run simultaneously</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <Wifi className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Network Requirements</p>
                <p className="text-blue-800 dark:text-blue-200">
                  A stable connection is recommended for large downloads. The download progress will be shown in a floating bar at the bottom of the screen.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="min-w-[100px] bg-gradient-to-r from-[#1964d7] to-[#1582b0] hover:from-[#1582b0] hover:to-[#8B1015] text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Start Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

